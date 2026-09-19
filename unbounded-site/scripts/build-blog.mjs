// Unbounded Spac3s blog builder
// Runs after "vite build". Reads every post in content/blog and writes
// finished pages to dist/blog.html and dist/blog/<post-name>.html,
// then writes a fresh dist/sitemap.xml that includes every post.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "content", "blog");
const DIST = path.join(ROOT, "dist");

const SITE = "https://unboundedspac3s.com";
const SITE_NAME = "Unbounded Spac3s";
const AUTHOR = "Unbounded Spac3s";
const DEFAULT_IMAGE = SITE + "/og-image.png";
const PIN_IMAGE = SITE + "/pin-image.jpg";

// Pages from the main site to keep in the sitemap
const MAIN_PAGES = ["/"];

// Payhip packs. In a post, write the word on the left, for example: pack: beauty
const PACKS = {
  beauty: { name: "Beauty & Hair", url: "https://payhip.com/b/ZoaR0", price: "Single packs from £17" },
  creatives: { name: "Creatives", url: "https://payhip.com/b/Blq2s", price: "Single packs from £17" },
  events: { name: "Events", url: "https://payhip.com/b/g9tIw", price: "Single packs from £17" },
  food: { name: "Food & Hospitality", url: "https://payhip.com/b/MiH1c", price: "Single packs from £17" },
  trades: { name: "Trades & Property", url: "https://payhip.com/b/IurnD", price: "Single packs from £17" },
  online: { name: "Online & Coaching", url: "https://payhip.com/b/tJjd2", price: "Single packs from £17" },
  core: { name: "Core Essentials", url: "https://payhip.com/b/eXIuN", price: "Single packs from £27" },
  bundle: { name: "Core Essentials Bundle", url: "https://payhip.com/b/QLqsG", price: "All six core packs for £97" },
};
const FREEBIE = "https://payhip.com/b/7R4D8";

// ---------- helpers ----------

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ukDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Brand rule: swap any long dashes for plain punctuation
const cleanDashes = (text, file) => {
  if (/[\u2013\u2014]/.test(text)) {
    console.warn(`[blog] ${file}: long dashes found and replaced`);
    text = text.replace(/\s*\u2014\s*/g, ", ").replace(/\u2013/g, "-");
  }
  if (/\bvibes?\b/i.test(text)) console.warn(`[blog] ${file}: contains the word "vibes"`);
  return text;
};

const readPost = (file) => {
  let raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8").replace(/\r\n/g, "\n");
  raw = cleanDashes(raw, file);
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    console.warn(`[blog] ${file}: skipped, the header block between --- lines is missing`);
    return null;
  }
  const meta = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    meta[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const slug = file.replace(/\.md$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!meta.title || !meta.description || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date || "")) {
    console.warn(`[blog] ${file}: skipped, it needs a title, a description and a date like 2026-09-17`);
    return null;
  }
  if (/^(yes|true)$/i.test(meta.draft || "")) {
    console.log(`[blog] ${file}: draft, not published`);
    return null;
  }
  if (meta.pack && !PACKS[meta.pack.toLowerCase()]) {
    console.warn(`[blog] ${file}: pack "${meta.pack}" not recognised, no pack button shown`);
  }
  const body = match[2];
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    url: `${SITE}/blog/${slug}`,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: /^\d{4}-\d{2}-\d{2}$/.test(meta.updated || "") ? meta.updated : meta.date,
    sector: meta.sector || "",
    pack: PACKS[(meta.pack || "").toLowerCase()] || null,
    image: meta.image ? (meta.image.startsWith("http") ? meta.image : SITE + "/" + meta.image.replace(/^\//, "")) : PIN_IMAGE,
    minutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body),
  };
};

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

// ---------- shared page parts ----------

const CSS = `
:root{--cream:#F5F1E8;--paper:#FBF8F2;--ink:#14110E;--gold:#B8843A;--gold-br:#C79B4A;--text:#211D17;--muted:#726A5E;--line:rgba(20,17,14,.10);--dline:rgba(245,241,232,.14)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Epilogue',system-ui,sans-serif;color:var(--text);background:var(--cream);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.wrap{max-width:1120px;margin:0 auto;padding:0 30px}
.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
header{border-bottom:1px solid var(--line);background:var(--cream)}
.nrow{display:flex;justify-content:space-between;align-items:center;height:74px;gap:20px}
.logo{font-size:23px;text-decoration:none;color:var(--text)}
.logo i{color:var(--gold)}
.nlinks{display:flex;gap:24px;align-items:center}
.nlinks a{text-decoration:none;font-size:12.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500}
.nlinks a:hover,.nlinks a.active{color:var(--gold)}
.nlinks .start{background:var(--ink);color:var(--cream);padding:11px 22px;border-radius:40px}
.nlinks .start:hover{color:var(--cream);background:#2a241d}
.logo,.nlinks a{white-space:nowrap}
@media(max-width:760px){.nlinks .hide-m{display:none}.nlinks{gap:12px}.logo{font-size:19px}.nlinks a{letter-spacing:.06em}.nlinks .start{padding:9px 14px}}
main{padding:64px 0 90px}
.col{max-width:700px;margin:0 auto}
.crumb{font-size:13.5px;color:var(--muted);margin-bottom:26px}
.crumb a{text-decoration:none}.crumb a:hover{color:var(--gold)}
.sector{color:var(--gold);font-size:14px;font-weight:500}
h1.serif{font-size:clamp(38px,6vw,60px);line-height:1.04;margin:10px 0 18px}
.lede{font-size:19px;color:var(--muted);max-width:620px}
.meta{font-size:13.5px;color:var(--muted);margin-top:22px;padding-bottom:30px;border-bottom:1px solid var(--line)}
.meta span+span{margin-left:14px}
.hero{width:100%;max-width:340px;display:block;margin:34px auto 0;border-radius:14px}
.post{font-size:17px;line-height:1.75;padding-top:34px}
.post>*+*{margin-top:1.1em}
.post h2{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:31px;line-height:1.15;margin-top:1.7em}
.post h3{font-size:18.5px;font-weight:600;margin-top:1.5em}
.post ul,.post ol{padding-left:1.3em}
.post li+li{margin-top:.45em}
.post li::marker{color:var(--gold)}
.post a{color:var(--gold);text-underline-offset:3px}
.post blockquote{border-left:2px solid var(--gold);padding:4px 0 4px 20px;font-family:'Instrument Serif',Georgia,serif;font-size:23px;line-height:1.35}
.post strong{font-weight:600}
.post img{max-width:100%;height:auto;border-radius:12px}
.post hr{border:none;border-top:1px solid var(--line);margin:2em 0}
.post table{border-collapse:collapse;width:100%;font-size:15px;display:block;overflow-x:auto}
.post th,.post td{border-bottom:1px solid var(--line);padding:10px 12px;text-align:left}
.pack{margin-top:52px;background:var(--ink);color:var(--cream);border-radius:18px;padding:34px 34px 30px}
.pack h2{font-size:30px;line-height:1.12;margin-bottom:8px}
.pack p{color:rgba(245,241,232,.72);font-size:15.5px;max-width:480px}
.pack .row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px;margin-top:22px}
.btn{display:inline-block;background:var(--gold);color:var(--ink);text-decoration:none;font-weight:500;font-size:14.5px;border-radius:40px;padding:13px 26px}
.btn:hover{background:var(--gold-br)}
.pack .free{font-size:14px;color:var(--cream);text-underline-offset:3px}
.more{margin-top:64px}
.more h2{font-size:26px;margin-bottom:6px}
.list{list-style:none}
.list li{border-bottom:1px solid var(--line)}
.list a{display:block;text-decoration:none;padding:26px 0}
.list a:hover .t{color:var(--gold)}
.list .t{font-family:'Instrument Serif',Georgia,serif;font-size:28px;line-height:1.15;margin:4px 0 8px;transition:color .15s}
.list .d{color:var(--muted);font-size:15.5px}
.list .small{font-size:13px;color:var(--muted)}
.intro{margin-bottom:26px}
.empty{padding:40px 0;color:var(--muted)}
footer{background:var(--ink);color:rgba(245,241,232,.7);font-size:13.5px}
.frow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px;padding-top:34px;padding-bottom:34px}
footer a{text-decoration:none}footer a:hover{color:var(--gold-br)}
footer .logo{color:var(--cream);font-size:21px}
@media(max-width:560px){.wrap{padding:0 20px}main{padding:44px 0 70px}.pack{padding:28px 22px}.post{font-size:16.5px}}
`;

const head = ({ title, ogTitle, description, url, image, type, extra = "" }) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="theme-color" content="#14110E" />
<meta property="og:type" content="${type}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${esc(ogTitle || title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image || DEFAULT_IMAGE}" />
${image ? "" : '<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />\n'}<meta property="og:locale" content="en_GB" />
${extra}<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(ogTitle || title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${image || DEFAULT_IMAGE}" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2314110E'/><text x='50' y='68' font-size='60' text-anchor='middle' fill='%23B8843A' font-family='Georgia'>U</text></svg>" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Epilogue:wght@300;400;500;600&display=swap" />
<style>${CSS}</style>
`;

const header = `<header><div class="wrap nrow">
<a class="logo serif" href="/">Unbounded <i>Spac3s</i></a>
<nav class="nlinks" aria-label="Main">
<a class="hide-m" href="/?page=quiz">Find Your Fit</a>
<a class="hide-m" href="/?page=templates">Templates</a>
<a class="active" href="/blog">Blog</a>
<a class="start" href="/?page=templates">Shop Now</a>
</nav>
</div></header>`;

const footer = `<footer><div class="wrap frow">
<a class="logo serif" href="/">Unbounded <i style="color:var(--gold)">Spac3s</i></a>
<span><a href="/blog">Blog</a> &nbsp; <a href="https://payhip.com/UnboundedSpac3s" target="_blank" rel="noopener">Shop</a> &nbsp; <a href="mailto:hello@unboundedspac3s.com">hello@unboundedspac3s.com</a></span>
<span>&copy; ${new Date().getFullYear()} Unbounded Spac3s. All rights reserved.</span>
</div></footer>`;

const listItem = (p) => `<li><a href="/blog/${p.slug}">
<span class="small">${p.sector ? `<span class="sector">${esc(p.sector)}</span> &nbsp; ` : ""}${ukDate(p.date)}</span>
<div class="t">${esc(p.title)}</div>
<div class="d">${esc(p.description)}</div>
</a></li>`;

const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE + "/", logo: { "@type": "ImageObject", url: DEFAULT_IMAGE } };

// ---------- page builders ----------

const postPage = (p, others) => {
  const extra = `<meta property="article:published_time" content="${p.date}" />
<meta property="article:modified_time" content="${p.updated}" />
<meta property="article:author" content="${AUTHOR}" />
${p.sector ? `<meta property="article:section" content="${esc(p.sector)}" />\n` : ""}`;

  const schema = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        image: p.image || DEFAULT_IMAGE,
        datePublished: p.date,
        dateModified: p.updated,
        author: { "@type": "Organization", name: AUTHOR, url: SITE + "/" },
        publisher,
        mainEntityOfPage: p.url,
        url: p.url,
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" },
          { "@type": "ListItem", position: 3, name: p.title, item: p.url },
        ],
      },
    ],
  });

  const pack = p.pack
    ? `<aside class="pack">
<h2 class="serif">Get the ${esc(p.pack.name)} templates</h2>
<p>Editable Word documents, ready to fill in with your details and use straight away. ${esc(p.pack.price)}.</p>
<div class="row"><a class="btn" href="${p.pack.url}" target="_blank" rel="noopener">Browse the ${esc(p.pack.name)} packs</a>
<a class="free" href="${FREEBIE}" target="_blank" rel="noopener">Or start with the free checklist</a></div>
</aside>`
    : "";

  const more = others.length
    ? `<section class="more"><h2 class="serif">More guides</h2><ul class="list">${others.map(listItem).join("")}</ul></section>`
    : "";

  return `${head({ title: `${p.title} | ${SITE_NAME}`, ogTitle: p.title, description: p.description, url: p.url, image: p.image, type: "article", extra })}${schema}
</head>
<body>
${header}
<main><div class="wrap"><article class="col">
<div class="crumb"><a href="/">Home</a> &nbsp;/&nbsp; <a href="/blog">Blog</a></div>
${p.sector ? `<div class="sector">${esc(p.sector)}</div>` : ""}
<h1 class="serif">${esc(p.title)}</h1>
<p class="lede">${esc(p.description)}</p>
<div class="meta"><span>${ukDate(p.date)}</span><span>${p.minutes} minute read</span></div>
<img class="hero" src="${p.image}" alt="${esc(p.title)}" width="1000" height="1500" />
<div class="post">${p.html}</div>
${pack}
${more}
</article></div></main>
${footer}
</body>
</html>
`;
};

const indexPage = (posts) => {
  const title = "Blog | Practical guides for UK founders | " + SITE_NAME;
  const description = "Plain-English guides to the documents, contracts and paperwork UK small businesses need, across beauty, coaching, events, creative work, trades and hospitality.";
  const schema = jsonLd({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SITE_NAME + " Blog",
    url: SITE + "/blog",
    description,
    inLanguage: "en-GB",
    publisher,
    blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: p.url, datePublished: p.date })),
  });
  return `${head({ title, description, url: SITE + "/blog", image: "", type: "website" })}${schema}
</head>
<body>
${header}
<main><div class="wrap"><div class="col">
<div class="intro">
<h1 class="serif">Practical guides for UK founders</h1>
<p class="lede">Clear, no-nonsense help with the documents and paperwork that keep a small business organised and protected.</p>
</div>
${posts.length ? `<ul class="list">${posts.map(listItem).join("")}</ul>` : `<p class="empty">New guides are on the way. In the meantime, <a href="/?page=templates">browse the templates</a>.</p>`}
</div></div></main>
${footer}
</body>
</html>
`;
};

const sitemap = (posts) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...MAIN_PAGES.map((p) => `  <url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`),
    `  <url><loc>${SITE}/blog</loc><lastmod>${posts[0]?.updated || today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...posts.map((p) => `  <url><loc>${p.url}</loc><lastmod>${p.updated}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
};

// ---------- run ----------

if (!fs.existsSync(DIST)) {
  console.error("[blog] The dist folder is missing. The main site build needs to run first.");
  process.exit(1);
}

const files = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  : [];

const posts = files
  .map(readPost)
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

fs.mkdirSync(path.join(DIST, "blog"), { recursive: true });

for (const p of posts) {
  const others = posts.filter((o) => o.slug !== p.slug).slice(0, 2);
  fs.writeFileSync(path.join(DIST, "blog", `${p.slug}.html`), postPage(p, others));
}
fs.writeFileSync(path.join(DIST, "blog.html"), indexPage(posts));
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap(posts));

console.log(`[blog] Built ${posts.length} post(s), the blog page and the sitemap.`);
