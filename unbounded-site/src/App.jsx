import React, { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Unbounded Spac3s — live site. Every buy button opens its real
// Payhip product. Singles are per-category pickers; four bundles.
// ─────────────────────────────────────────────────────────────

const PAYHIP = {
  // single-pack pickers
  beauty:   "https://payhip.com/b/ZoaR0",
  creatives:"https://payhip.com/b/Blq2s",
  events:   "https://payhip.com/b/g9tIw",
  food:     "https://payhip.com/b/MiH1c",
  trades:   "https://payhip.com/b/IurnD",
  online:   "https://payhip.com/b/tJjd2",
  corePick: "https://payhip.com/b/eXIuN",
  scaleupPick:  "https://payhip.com/b/3012C",
  goglobalPick: "https://payhip.com/b/fluo4",
  // bundles
  coreBundle:        "https://payhip.com/b/QLqsG",
  scaleupBundle:     "https://payhip.com/b/n6XOw",
  goglobalBundle:    "https://payhip.com/b/yexOm",
  growthGlobalBundle:"https://payhip.com/b/aELIx",
  // FREE lead magnet — replace with your free (£0) Payhip product link once you create it:
  freebie:           "https://payhip.com/b/7R4D8",
};
const pay = (key) => window.open(PAYHIP[key], "_blank", "noopener");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Epilogue:wght@300;400;500;600&display=swap');
:root{--cream:#F5F1E8;--paper:#FBF8F2;--white:#FFF;--ink:#14110E;--ink2:#1C1813;--card:#241E17;
--gold:#B8843A;--gold-br:#C79B4A;--text:#211D17;--muted:#726A5E;--muted-l:#9a9182;
--line:rgba(20,17,14,.10);--line-g:rgba(184,132,58,.4);--dline:rgba(245,241,232,.12);--r:16px;}
*{box-sizing:border-box;margin:0;padding:0}
.u{font-family:'Epilogue',system-ui,sans-serif;color:var(--text);background:var(--cream);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.u .s{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
.u .wrap{max-width:1180px;margin:0 auto;padding:0 30px}
.u .eyebrow{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:600}
.u .eyebrow:before{content:"— ";opacity:.7}
.u .h2{font-family:'Instrument Serif',serif;font-size:clamp(30px,4.6vw,52px);line-height:1.05;margin-top:14px}
.u .sub{color:var(--muted);font-size:17px;max-width:560px;margin-top:14px}
.u section{padding:66px 0}
.u .btn{font-family:inherit;font-size:14.5px;font-weight:500;border-radius:40px;padding:13px 26px;cursor:pointer;text-decoration:none;display:inline-block;border:1.5px solid transparent;transition:.18s}
.u .dark{background:var(--ink);color:var(--cream)}.u .dark:hover{background:#000}
.u .ghost{border-color:var(--ink);color:var(--ink);background:none}.u .ghost:hover{background:var(--ink);color:var(--cream)}
.u .gold{background:var(--gold);color:var(--ink);font-weight:600}.u .gold:hover{background:var(--gold-br)}
/* nav */
.u nav{position:sticky;top:0;z-index:60;background:rgba(245,241,232,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.u .nrow{display:flex;align-items:center;justify-content:space-between;height:66px}
.u .logo{font-family:'Instrument Serif',serif;font-size:23px;cursor:pointer;background:none;border:none}
.u .logo i{color:var(--gold);font-style:italic}
.u .nlinks{display:flex;gap:26px;align-items:center}
.u .nlinks button{background:none;border:none;font-family:inherit;color:var(--text);font-size:12.5px;letter-spacing:.13em;text-transform:uppercase;font-weight:500;cursor:pointer}
.u .nlinks button:hover,.u .nlinks button.active{color:var(--gold)}
.u .nlinks .start{background:var(--ink);color:var(--cream);padding:11px 22px;border-radius:40px}
@media(max-width:860px){.u .nlinks button:not(.start){display:none}}
/* hero */
.u .hero{display:grid;grid-template-columns:1.05fr .95fr;min-height:72vh}
@media(max-width:860px){.u .hero{grid-template-columns:1fr}}
.u .heroL{padding:70px 30px;max-width:640px;margin-left:auto;width:100%}
.u .hero h1{font-family:'Instrument Serif',serif;font-size:clamp(46px,7vw,80px);line-height:.98}
.u .hero h1 i{font-style:italic;color:var(--gold)}
.u .hero .sub{font-size:18px;max-width:440px;margin-top:22px}
.u .hbtns{display:flex;gap:13px;margin-top:30px;flex-wrap:wrap}
.u .scroll{margin-top:44px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted-l)}
.u .scroll:before{content:"";display:inline-block;width:34px;height:1px;background:var(--muted-l);vertical-align:middle;margin-right:12px}
.u .heroR{background:var(--ink);background-image:linear-gradient(rgba(245,241,232,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,241,232,.03) 1px,transparent 1px);background-size:34px 34px;display:flex;flex-direction:column;justify-content:flex-end;padding:60px 54px}
.u .quote{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(26px,3.2vw,36px);color:var(--cream);line-height:1.2;max-width:440px}
.u .quote b{color:var(--gold-br);font-weight:400}
.u .promise{margin-top:24px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted-l)}
/* marquee */
.u .marq{background:var(--ink);overflow:hidden;white-space:nowrap;padding:14px 0}
.u .mtrack{display:inline-block;animation:mv 24s linear infinite}
.u .mtrack span{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream);font-weight:500;padding:0 26px}
.u .mtrack span:after{content:"✦";color:var(--gold);margin-left:26px;font-size:10px}
@keyframes mv{to{transform:translateX(-50%)}}
/* problem */
.u .prob{background:var(--white);display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
@media(max-width:860px){.u .prob{grid-template-columns:1fr;gap:34px}}
.u .before{background:var(--cream);border:1px solid var(--line);border-top:3px solid var(--gold);border-radius:18px;padding:30px}
.u .before .bt{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted-l);font-weight:600;margin-bottom:16px}
.u .brow{background:var(--white);border:1px solid var(--line);border-radius:11px;padding:14px 16px;margin-bottom:11px;font-size:14.5px;color:var(--muted);display:flex;align-items:center;gap:12px}
.u .dot{width:9px;height:9px;border-radius:50%;flex:none}
.u .plist{margin-top:30px}
.u .pitem{display:flex;gap:18px;padding:16px 0;border-top:1px solid var(--line)}
.u .pitem .n{font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;color:var(--gold);flex:none;padding-top:1px}
.u .pitem p{font-size:16px}
/* intake */
.u .intakebox{max-width:760px;margin:0 auto;background:var(--card);border:1px solid var(--dline);border-radius:16px;padding:34px 32px 36px}
.u .free{display:inline-block;font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);background:var(--gold);padding:4px 12px;border-radius:40px;font-weight:600}
.u .intakebox h2{font-family:'Instrument Serif',serif;font-size:clamp(26px,3.6vw,36px);margin:16px 0 8px;text-align:center;color:var(--cream)}
.u .intakebox .isub{text-align:center;color:var(--muted-l);max-width:520px;margin:0 auto 24px;font-size:16px}
.u .intakebox label{display:block;font-size:13px;color:var(--muted-l);margin-bottom:8px}
.u .intakebox textarea,.u .intakebox select{width:100%;background:var(--ink);border:1px solid var(--dline);color:var(--cream);border-radius:10px;padding:14px 15px;font-family:inherit;font-size:15px;resize:vertical}
.u .intakebox textarea:focus,.u .intakebox select:focus{outline:none;border-color:var(--gold)}
.u .ask{width:100%;margin-top:18px;border:none;cursor:pointer}
.u .result{margin-top:26px;border-top:1px solid var(--dline);padding-top:24px}
.u .rlabel{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-br)}
.u .result h4{font-family:'Instrument Serif',serif;font-size:22px;margin:8px 0 4px;color:var(--cream)}
.u .rnote{color:var(--muted-l);font-size:15px;margin-bottom:18px}
.u .starter{background:var(--ink);border:1px solid var(--dline);border-radius:12px;padding:22px}
.u .starter ol{margin-left:18px;color:var(--cream)}.u .starter li{padding:5px 0;font-size:14.5px}
/* services / doors / offers */
.u .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px}
@media(max-width:900px){.u .grid3{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.u .grid3{grid-template-columns:1fr}}
.u .svc{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:26px 24px;transition:.2s}
.u .svc:hover{border-color:var(--gold);transform:translateY(-3px)}
.u .svc.dk{background:var(--ink);color:var(--cream)}
.u .svc .num{font-family:'Instrument Serif',serif;font-style:italic;font-size:34px;color:#d8cdb6}
.u .svc.dk .num{color:#4a4234}
.u .svc h3{font-family:'Instrument Serif',serif;font-size:23px;margin:6px 0 8px}
.u .svc p{font-size:14.5px;color:var(--muted)}.u .svc.dk p{color:var(--muted-l)}
.u .svc ul{list-style:none;margin:16px 0}
.u .svc li{font-size:13.5px;padding:4px 0 4px 16px;position:relative}.u .svc.dk li{color:var(--cream)}
.u .svc li:before{content:"–";position:absolute;left:0;color:var(--gold)}
.u .svc .from{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);font-weight:600}
.u .doors{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
@media(max-width:820px){.u .doors{grid-template-columns:1fr}}
.u .door{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:28px 26px;transition:.2s}
.u .door:hover{border-color:var(--gold);transform:translateY(-3px)}
.u .door .dn{font-family:'Instrument Serif',serif;font-style:italic;color:var(--gold);font-size:18px}
.u .door h3{font-family:'Instrument Serif',serif;font-size:23px;margin:8px 0 6px}
.u .door p{color:var(--muted);font-size:14.5px}
.u .door ul{list-style:none;margin-top:16px;border-top:1px solid var(--line);padding-top:14px}
.u .door li{font-size:14px;padding:5px 0 5px 18px;position:relative}
.u .door li:before{content:"";position:absolute;left:0;top:11px;width:7px;height:7px;border-left:1.5px solid var(--gold);border-bottom:1.5px solid var(--gold)}
.u .allsectors{margin-top:30px;text-align:center;font-size:14.5px;color:var(--muted)}.u .allsectors b{color:var(--text);font-weight:600}
/* process */
.u .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:44px}
@media(max-width:760px){.u .steps{grid-template-columns:1fr 1fr;gap:30px}}
.u .step{text-align:center}
.u .circ{width:58px;height:58px;border:1px solid var(--line-g);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-family:'Instrument Serif',serif;font-style:italic;font-size:24px;color:var(--gold);background:var(--paper)}
.u .step h4{font-family:'Instrument Serif',serif;font-size:19px;margin-bottom:6px}.u .step p{font-size:13.5px;color:var(--muted)}
/* book */
.u .book{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
@media(max-width:860px){.u .book{grid-template-columns:1fr}}
.u .bstep{display:flex;gap:16px;padding:13px 0;border-top:1px solid var(--line);font-size:15px}
.u .bstep i{font-family:'Instrument Serif',serif;font-style:italic;color:var(--gold);font-size:17px}
.u .btags{display:flex;gap:9px;flex-wrap:wrap;margin-top:20px}
.u .btag{border:1px solid var(--line-g);color:var(--gold);border-radius:40px;padding:6px 14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.u .cal{background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.u .calbar{background:var(--ink);padding:14px 16px;display:flex;align-items:center;gap:8px}
.u .calbar i{width:11px;height:11px;border-radius:50%;display:block}
.u .calbar span{color:var(--muted-l);font-size:13px;margin:0 auto}
.u .calbody{padding:40px 20px;text-align:center}
.u .caldash{border:2px dashed var(--line-g);border-radius:10px;padding:30px 18px;color:var(--muted);font-size:14px}
.u .caldash b{display:block;color:var(--gold);font-size:12px;letter-spacing:.1em;text-transform:uppercase;margin-top:12px}
/* faq */
.u .faqwrap{display:grid;grid-template-columns:1fr 1.4fr;gap:50px}
@media(max-width:800px){.u .faqwrap{grid-template-columns:1fr;gap:24px}}
.u .fq{border-top:1px solid var(--line)}
.u .fqh{width:100%;background:none;border:none;text-align:left;padding:18px 0;cursor:pointer;font-family:'Instrument Serif',serif;font-size:19px;color:var(--text);display:flex;justify-content:space-between;gap:16px;align-items:center}
.u .fqh .chev{color:var(--gold);flex:none;transition:.2s}
.u .fqa{font-size:15px;color:var(--muted);padding:0 0 18px;max-width:640px}
/* cta */
.u .cta{background:var(--gold);color:var(--cream);position:relative;overflow:hidden}
.u .cta:after{content:"";position:absolute;right:-80px;top:-40px;width:340px;height:340px;border-radius:50%;background:rgba(255,255,255,.08)}
.u .cta .in{display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center;position:relative;z-index:2}
@media(max-width:800px){.u .cta .in{grid-template-columns:1fr}}
.u .cta h2{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(32px,4.4vw,50px);line-height:1.05}
.u .cta p{margin-top:14px;max-width:430px;color:#f3ead9}
.u .cbtns{display:flex;gap:13px;flex-wrap:wrap}
.u .cta .wbtn{background:var(--cream);color:var(--gold);border-color:var(--cream)}.u .cta .wbtn:hover{background:#fff}
.u .cta .obtn{border-color:rgba(255,255,255,.6);color:var(--cream)}.u .cta .obtn:hover{background:rgba(255,255,255,.12)}
/* templates page */
.u .cat{background:var(--ink);color:var(--cream)}
.u .cat .h2{color:var(--cream)}.u .cat .sub{color:var(--muted-l)}
.u .chero{text-align:center;padding-top:60px}
.u .chero .mark{display:inline-block;border-left:2px solid var(--gold);border-top:2px solid var(--gold);width:26px;height:26px;opacity:.6;margin-bottom:22px}
.u .chero h1{font-family:'Instrument Serif',serif;font-size:clamp(34px,5.2vw,58px);line-height:1.06;color:var(--cream)}
.u .chero h1 i{font-style:italic;color:var(--gold-br)}
.u .chero p{color:var(--muted-l);font-size:18px;max-width:560px;margin:18px auto 0}
.u .cstats{display:flex;gap:34px;justify-content:center;margin-top:26px;flex-wrap:wrap}
.u .cstat b{font-family:'Instrument Serif',serif;font-size:26px;color:var(--gold-br);display:block}
.u .cstat span{font-size:12px;color:var(--muted-l);letter-spacing:.05em}
.u .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}
@media(max-width:820px){.u .pgrid{grid-template-columns:1fr 1fr}}
@media(max-width:540px){.u .pgrid{grid-template-columns:1fr}}
.u .pcard{background:var(--ink2);border:1px solid var(--dline);border-radius:14px;padding:24px 22px;display:flex;flex-direction:column;transition:.2s}
.u .pcard:hover{border-color:var(--gold);transform:translateY(-3px)}
.u .pcard .pn{font-family:'Instrument Serif',serif;font-size:22px;color:var(--cream)}
.u .pcard .pmeta{color:var(--muted-l);font-size:13.5px;margin-top:4px;flex-grow:1}
.u .pcard .prow{display:flex;align-items:center;justify-content:space-between;margin-top:20px}
.u .pcard .pp{font-family:'Instrument Serif',serif;font-size:20px;color:var(--gold-br)}
.u .bcard{background:linear-gradient(135deg,#2a2117,#1c1710);border:1px solid var(--line-g)}
.u footer{background:var(--ink);color:var(--muted-l);padding:56px 0 28px}
.u .fgrid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px}
@media(max-width:800px){.u .fgrid{grid-template-columns:1fr 1fr}}
.u footer .logo{color:var(--cream);margin-bottom:14px}
.u footer .ftag{font-size:13.5px;max-width:230px}
.u .fcol h5{font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px}
.u .fcol button,.u .fcol a{display:block;background:none;border:none;font-family:inherit;color:var(--cream);font-size:14px;padding:5px 0;opacity:.85;cursor:pointer;text-align:left;text-decoration:none}
.u .fcol button:hover,.u .fcol a:hover{color:var(--gold-br)}
.u .fbot{border-top:1px solid var(--dline);margin-top:40px;padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:12.5px}
@media(prefers-reduced-motion:reduce){.u *{animation:none!important;transition:none!important}}
`;

const SERVICES = [
  ["01","Business Setup & Planning","Solid foundations from day one. Business plans, company structure and strategy built to scale.",["Business plan & model canvas","Company structure guidance","90-day action roadmap"],"From £297",false],
  ["02","Workflow & Process Design","Map, build and document the processes that keep your business running, so tasks get done right.",["Process mapping & docs","SOP creation","Notion or Docs delivery"],"From £397",false],
  ["03","Branded Client Documents","Proposals, decks and client materials that look polished and unmistakably yours.",["Custom proposal templates","Pitch deck design","Client onboarding pack"],"From £197",false],
  ["04","Full Operations Overhaul","A complete review and rebuild of how your business operates. From chaos to clarity.",["Full ops audit","Systems & tools setup","Team handover pack"],"From £750",true],
  ["05","Ongoing Consultancy Retainer","An experienced ops partner every month. Implementation, accountability and expert guidance.",["Monthly hours & check-ins","Ad-hoc support","Quarterly strategy review"],"From £350/mo",false],
  ["06","Founder Strategy Session","A focused 90-minute session to diagnose gaps and walk away with a clear, practical roadmap.",["90-min deep-dive call","Written action plan","Offset against any package"],"£125",false],
];
const PROBLEMS=["Proposals and pitches look unprofessional, and you lose deals because of it","Operations are scattered, nothing is documented, and everything takes too long","Clients and investors don't see the business you know you're building","You're spending your best hours on admin, not on growth"];
const DOORS=[["01","Just getting started","You've got the idea. Let's give it a backbone.",["Business setup documents","Your first templates, ready to use","A plan you can actually act on"]],["02","Up and running","You're trading. Let's tighten the engine.",["Systems and processes that hold","Branded documents, done properly","Admin that stops leaking time"]],["03","Ready to scale","It works. Let's make it bigger without breaking it.",["Strategy and positioning","Investor and partner-ready materials","Done-for-you document suites"]]];
const STEPS=[["Discovery Call or Brief","We understand where you are and what's getting in the way. 20 minutes is usually all we need."],["Proposal & Scope","A clear scope, timeline and fixed price, no surprises. You approve before anything begins."],["Build & Deliver","Fast turnaround, high quality output, delivered in the formats you actually use."],["Implement & Grow","Everything handed over and ready to use. Ongoing support available where needed."]];
const FAQS=[["How quickly can I see results?","Templates are ready to use the moment you download them. Done-for-you services typically deliver within 48 to 72 hours. Full operations builds take 1 to 2 weeks depending on scope."],["Do I need a big budget to get started?","Not at all. Single packs start at £17 and give immediate, practical value. A Founder Strategy Session at £125 is the ideal low-cost entry point, and it offsets against any service package."],["Are your templates editable and customisable?","Yes, everything is fully editable and delivered in Word, ready to make your own. No locked templates, no design skills required."],["Do you work with specific industries?","We cover seven sectors, from beauty and events to trades, food, creatives and online. Good operations are universal, the principles don't change by industry."],["What if I'm not sure what I need?","Book the free discovery call. We'll tell you honestly what would make the biggest difference, whether that's a £17 pack or a full engagement."]];
const SECTORS=[["Beauty & Hair","20 packs","beauty"],["Creatives","10 packs","creatives"],["Events","20 packs","events"],["Food & Hospitality","20 packs","food"],["Trades & Property","22 packs","trades"],["Online & Coaching","22 packs","online"]];
const BUNDLES=[["Core Essentials Bundle","£97","The six core packs every business needs, in one.","coreBundle"],["Scale-Up Bundle","£77","Five packs to take a running business to the next level.","scaleupBundle"],["Go Global Bundle","£77","Five packs to expand your business beyond the UK.","goglobalBundle"],["Growth & Global Bundle","£127","All ten scale-up and go-global packs together.","growthGlobalBundle"]];
const INTAKE={
  beauty:{name:"Beauty & Hair",key:"beauty",tip:"Before your first client, the document that protects you most is a consultation and consent form. It records allergies and patch tests, and it's your first line of defence if anything ever goes wrong."},
  trades:{name:"Trades & Property",key:"trades",tip:"The fastest way to win more jobs isn't lower prices, it's a professional quote. A clear, branded quote beats a number sent over text, and it quietly signals you know your compliance."},
  food:{name:"Food & Hospitality",key:"food",tip:"Get your allergen and food-safety paperwork sorted before you sell a single thing. It keeps you legal, and it's the first thing that trips new food businesses up."},
  events:{name:"Events",key:"events",tip:"Your contract and deposit terms matter more than anything. They protect you from last-minute cancellations, which is exactly where event businesses lose real money."},
  creatives:{name:"Creatives",key:"creatives",tip:"Put an IP and image-licensing clause in your contract from day one. It decides who owns the work, and getting it wrong quietly costs creatives their rights and their fees."},
  online:{name:"Online & Coaching",key:"online",tip:"Your client agreement and privacy wording aren't optional for coaches and online sellers. They set clear boundaries and keep you and your clients safe, especially around advice and data."},
  core:{name:"the foundations",key:"corePick",tip:"You don't need everything on day one. You need a backbone: a plan, a way to price, a way to onboard, and a simple contract. Get those four and you look and run like a real business."}
};
const KEYWORDS=[
  ["beauty",["nail","lash","brow","hair","salon","barber","makeup","make-up","beauty","skin","aesthetic","wax","tan","massage","spa","wellness","therapist","pmu","microblad","facial","cosmetic"]],
  ["trades",["electric","plumb","build","carpenter","joiner","plaster","roof","tiler","gas ","heating","handyman","trade","construction","property","landlord","estate agent","letting","decorat","landscap","scaffold","fitter"]],
  ["food",["baker","cake","cafe","café","coffee","restaurant","takeaway","catering","chef","food","hospitality","bar ","pub","street food","kitchen","deli","drinks","vegan","juice","meal prep"]],
  ["events",["wedding","event","festival","party","planner","florist"," dj ","venue","exhibition","pop-up","popup","supper club","staffing"]],
  ["creatives",["photograph","videograph","designer","illustrat","content creat","web design","artist","copywrit","social media","creative","studio"]],
  ["online",["coach","course","online","membership","consultant","virtual assistant","marketing","podcast","newsletter","ecommerce","e-commerce","dropship","affiliate","saas","digital product","freelance","educator"]],
];
const detectSector=(t)=>{const s=" "+t.toLowerCase()+" ";for(const[sec,words]of KEYWORDS){if(words.some(w=>s.includes(w)))return sec;}return "core";};
const QUIZ=[
 {id:"work",q:"What kind of work lights you up?",opts:[["Hands-on trades or property","trades"],["Beauty, hair or wellness","beauty"],["Creative work","creatives"],["Events and bringing people together","events"],["Food and drink","food"],["Coaching, advising or selling online","online"],["Honestly, I'm not sure yet","mixed"]]},
 {id:"stage",q:"Where are you right now?",opts:[["Just an idea","starting"],["Already trading","running"],["Ready to grow","scaling"]]},
 {id:"sell",q:"What will you mainly sell?",opts:[["My time and skills","time"],["A product","product"],["My knowledge","knowledge"]]},
 {id:"aim",q:"What do you most want this business to give you?",opts:[["More money","money"],["Time and freedom","freedom"],["To do what I love","passion"],["To build something big","scale"]]},
 {id:"invest",q:"Realistically, what can you put in right now?",opts:[["Starting lean","lean"],["A bit, to set up properly","some"],["Ready to invest to grow","ready"]]},
 {id:"worry",q:"What's your biggest worry?",opts:[["Looking professional","professional"],["Getting clients","clients"],["Staying legal and compliant","legal"],["Staying organised","organised"]]},
];
const AIM_LINE={money:"You're after more money, so pricing well and winning clients is where to focus.",freedom:"You want time and freedom, so systems that run without you are worth building early.",passion:"You want to do what you love, so getting the admin off your plate frees you up for it.",scale:"You're building something big, so strong foundations now save real pain later."};
const INVEST_LINE={lean:"Starting lean is smart. The single packs let you build up one at a time.",some:"With a bit to invest, a bundle gets you set up properly in one go.",ready:"You're ready to invest, so a bundle plus the Scale-Up packs will move you fastest."};
const quizResult=(a)=>{const weak=a.work==="mixed";const sec=weak?"core":a.work;const base=INTAKE[sec]||INTAKE.core;return {weak,name:base.name,key:base.key,lines:[AIM_LINE[a.aim],INVEST_LINE[a.invest]].filter(Boolean),scaling:a.stage==="scaling"};};

const Footer=({go})=>(
  <footer><div className="wrap">
    <div className="fgrid">
      <div><div className="logo s">Unbounded <i style={{color:"var(--gold)",fontStyle:"italic"}}>Spac3s</i></div>
        <p className="ftag">Practical tools, templates and systems to help founders get organised, present professionally and run more smoothly.</p></div>
      <div className="fcol"><h5>Templates</h5><button onClick={()=>go("templates")}>Single packs</button><button onClick={()=>go("templates")}>Bundles</button><button onClick={()=>go("templates")}>Scale-up & global</button></div>
      <div className="fcol"><h5>Services</h5><button onClick={()=>go("services")}>What we do</button><button onClick={()=>go("services","process")}>How it works</button><button onClick={()=>go("services","book")}>Book a call</button></div>
      <div className="fcol"><h5>Company</h5><a href="https://payhip.com/UnboundedSpac3s" target="_blank" rel="noopener">Shop</a><button onClick={()=>go("home","faq")}>FAQ</button><button onClick={()=>go("services","book")}>Contact</button></div>
    </div>
    <div className="fbot"><span>© 2026 Unbounded Spac3s. All rights reserved.</span><span>hello@unboundedspac3s.com</span><span>Built for founders. Designed with purpose.</span></div>
  </div></footer>
);

export default function App(){
  const [page,setPage]=useState("home");
  const [openFaq,setOpenFaq]=useState(0);
  const [stage,setStage]=useState("running");
  const [desc,setDesc]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [quizStep,setQuizStep]=useState(0);
  const [quizAns,setQuizAns]=useState({});
  const [quizEmail,setQuizEmail]=useState("");
  const [quizSent,setQuizSent]=useState(false);
  const go=(p,anchor)=>{setPage(p);setTimeout(()=>{anchor?document.getElementById(anchor)?.scrollIntoView({behavior:"smooth"}):window.scrollTo({top:0,behavior:"smooth"});},30);};
  const findStart=async()=>{
    if(!desc.trim())return;
    setLoading(true); setResult(null);
    const stageWord={starting:"just getting started",running:"up and running",scaling:"ready to scale"}[stage];
    try{
      const r=await fetch("/api/ask",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message:desc,stage:stageWord})});
      if(!r.ok) throw new Error();
      const d=await r.json();
      const base=INTAKE[d.sector]||INTAKE.core;
      setResult({name:base.name,key:base.key,tip:d.reply||base.tip,unknown:(d.sector||"core")==="core",scaling:stage==="scaling",fit:d.fit||"strong"});
    }catch{
      const sec=detectSector(desc);
      setResult({...INTAKE[sec],unknown:sec==="core",scaling:stage==="scaling",fit:"strong"});
    }finally{setLoading(false);}
  };

  return (
    <div className="u"><style>{CSS}</style>
      <nav><div className="wrap nrow">
        <button className="logo s" onClick={()=>go("home")}>Unbounded <i>Spac3s</i></button>
        <div className="nlinks">
          <button className={page==="quiz"?"active":""} onClick={()=>go("quiz")}>Find Your Fit</button>
          <button className={page==="templates"?"active":""} onClick={()=>go("templates")}>Templates</button>
          <button className={page==="services"?"active":""} onClick={()=>go("services")}>Services</button>
          <button onClick={()=>go("services","book")}>Book a Call</button>
          <button onClick={()=>go("home","faq")}>FAQ</button>
          <button className="start" onClick={()=>go("templates")}>Shop Now</button>
        </div>
      </div></nav>

      {page==="home"&&<>
        <section className="hero" style={{padding:0}}>
          <div className="heroL">
            <div className="eyebrow">For founders & growing businesses</div>
            <h1 className="s" style={{marginTop:22}}>Your business,<br/><i>finally</i> organised.</h1>
            <p className="sub">Practical, ready-to-use documents that help founders present professionally, run smoothly and build with confidence, from day one.</p>
            <div className="hbtns"><button className="btn dark" onClick={()=>go("templates")}>Browse Templates →</button><button className="btn ghost" onClick={()=>go("services")}>Explore Services</button></div>
            <div className="scroll">Scroll to explore</div>
          </div>
          <div className="heroR"><div className="quote">"From <b>scattered ideas</b> to a business that actually runs."</div><div className="promise">The Unbounded Spac3s promise</div></div>
        </section>
        <div className="marq"><div className="mtrack">{["Founder Toolkits","Workflow Design","Branded Proposals","Client Systems","Operations Consulting","Founder Toolkits","Workflow Design","Branded Proposals","Client Systems","Operations Consulting"].map((t,i)=><span key={i}>{t}</span>)}</div></div>
        <section className="prob"><div className="wrap" style={{display:"contents"}}>
          <div className="before"><div className="bt">Before Unbounded Spac3s</div>
            {[["Proposal v7_FINAL_FINAL.docx","#c0563f"],["Client notes scattered across 3 apps","#B8843A"],['Onboarding? "I\'ll send something over…"',"#8a8175"],["Business plan… somewhere in Google Drive","#c0563f"],["No process. No system. Just vibes.","#B8843A"]].map(([t,c])=><div className="brow" key={t}><span className="dot" style={{background:c}}/>{t}</div>)}</div>
          <div><div className="eyebrow">The problem</div><h2 className="h2">You're brilliant at what you do. Running the business is another story.</h2>
            <p className="sub" style={{maxWidth:480}}>Most founders start with great ideas and real skills, but no infrastructure. The chaos quietly costs you clients, credibility and time.</p>
            <div className="plist">{PROBLEMS.map((p,i)=><div className="pitem" key={i}><span className="n">0{i+1}</span><p>{p}</p></div>)}</div></div>
        </div></section>
        <section style={{background:"var(--ink2)"}}><div className="wrap"><div className="intakebox">
          <div style={{textAlign:"center"}}><span className="free">Free</span></div>
          <h2>Not sure where to start? Ask.</h2>
          <p className="isub">Tell us where you are and what's on your mind. We'll share a quick, useful tip and point you to the exact pack for you.</p>
          <label>Where are you right now?</label>
          <select value={stage} onChange={e=>setStage(e.target.value)}><option value="starting">I'm just getting started</option><option value="running">I'm up and running</option><option value="scaling">I'm ready to scale</option></select>
          <label style={{marginTop:16}}>Tell us about your business and what's on your mind</label>
          <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. I run a small mobile nail business and I keep losing track of bookings and payments…"/>
          <button className="btn gold ask" onClick={findStart} disabled={loading}>{loading?"Thinking it through…":"Show me where to start"}</button>
          {result&&<div className="result"><div className="rlabel">Here's where I'd start you</div><h4>{result.fit==="weak"?"This one's worth a chat":(result.unknown?"Start with the foundations":result.name)}</h4><p className="rnote">{result.tip}</p>
            {result.fit==="weak"?(
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:2}}>
              <button className="btn gold" onClick={()=>go("services","book")}>Book a free discovery call →</button>
              {!result.unknown&&<button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay(result.key)}>See the {result.name} packs</button>}
              <button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay("freebie")}>Free checklist</button>
            </div>
            ):(
            <>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:2}}>
              <button className="btn gold" onClick={()=>pay(result.key)}>{result.unknown?"Get the Core Essentials →":`Browse the ${result.name} packs →`}</button>
              {result.scaling&&<button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay("scaleupPick")}>Add the Scale-Up packs →</button>}
              {result.unknown&&<button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay("freebie")}>Free checklist</button>}
            </div>
            <p style={{color:"var(--muted-l)",fontSize:14,marginTop:18}}>Rather talk it through first? <button onClick={()=>go("services","book")} style={{background:"none",border:"none",color:"var(--gold-br)",cursor:"pointer",fontFamily:"inherit",fontSize:14,textDecoration:"underline",padding:0}}>Book a free call with me →</button></p>
            </>
            )}
          </div>}
        </div></div></section>
        <section style={{background:"var(--ink)"}}><div className="wrap" style={{textAlign:"center"}}>
          <div className="eyebrow">Free download</div>
          <h2 className="h2" style={{color:"var(--cream)"}}>Not ready to buy? Start free.</h2>
          <p className="sub" style={{color:"var(--muted-l)",margin:"14px auto 0"}}>Grab the UK Business Starter Checklist, the documents every new business needs, completely free. Pop in your email and it's yours.</p>
          <button className="btn gold" style={{marginTop:24}} onClick={()=>pay("freebie")}>Get the free checklist →</button>
        </div></section>

        <section id="faq" style={{background:"var(--cream)"}}><div className="wrap faqwrap">
          <div><div className="eyebrow">FAQ</div><h2 className="h2">Common questions.</h2><p className="sub">Everything founders ask before getting started.</p>
            <button className="btn dark" onClick={()=>go("services","book")} style={{marginTop:22}}>Still unsure? Book a free call →</button></div>
          <div>{FAQS.map(([q,a],i)=>{const o=openFaq===i;return(<div className="fq" key={i}><button className="fqh" onClick={()=>setOpenFaq(o?-1:i)}>{q}<span className="chev" style={{transform:o?"rotate(45deg)":"none"}}>+</span></button>{o&&<div className="fqa">{a}</div>}</div>);})}</div>
        </div></section>
        <section className="cta"><div className="wrap in"><div><h2>Stop building on chaos.</h2><p>Grab a pack today or book a free discovery call and start making real progress, immediately.</p></div>
          <div className="cbtns"><button className="btn wbtn" onClick={()=>go("templates")}>Browse Templates →</button><button className="btn obtn" onClick={()=>go("services","book")}>Book a Free Call</button></div></div></section>
      </>}

      {page==="services"&&<>
        <section style={{background:"var(--cream)"}}><div className="wrap"><div className="eyebrow">Wherever you are</div><h2 className="h2">There's a way in for every stage.</h2>
          <div className="doors">{DOORS.map(([n,t,d,items])=><div className="door" key={n}><div className="dn">{n}</div><h3>{t}</h3><p>{d}</p><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div>
          <p className="allsectors">For <b>every sector</b> — beauty, events, food, creatives, trades, property, online and coaching.</p></div></section>
        <section id="services"><div className="wrap"><div className="eyebrow">What we do</div><h2 className="h2">Services built for how founders actually work.</h2>
          <p className="sub">Whether you need a single document, a full system build or an expert in your corner, there's an option that fits where you are.</p>
          <div className="grid3">{SERVICES.map(([num,title,d,bullets,price,dk])=><div className={"svc"+(dk?" dk":"")} key={num}><div className="num">{num}</div><h3>{title}</h3><p>{d}</p><ul>{bullets.map(b=><li key={b}>{b}</li>)}</ul><div className="from">{price}</div></div>)}</div></div></section>
        <section id="process" style={{background:"var(--cream)"}}><div className="wrap"><div className="eyebrow">How it works</div><h2 className="h2">From first message to fully operational.</h2>
          <p className="sub">Straightforward, low-friction process. No unnecessary meetings, no surprises, just fast, quality delivery.</p>
          <div className="steps">{STEPS.map(([t,d],i)=><div className="step" key={t}><div className="circ">{i+1}</div><h4>{t}</h4><p>{d}</p></div>)}</div></div></section>
        <section id="book" style={{background:"var(--white)"}}><div className="wrap book">
          <div><div className="eyebrow">Book a call</div><h2 className="h2">Free 20-minute discovery call.</h2>
            <p className="sub">Tell us where you are and what you're trying to build. We'll tell you exactly what would make the biggest difference, honestly, no hard sell.</p>
            {["Pick a time that works for you","We'll send a confirmation straight away","Show up, have the conversation","Walk away with clarity, whether you work with us or not"].map((s,i)=><div className="bstep" key={i}><i>{i+1}</i>{s}</div>)}
            <div className="btags">{["No obligation","20 minutes","100% free","Zoom or phone"].map(t=><span className="btag" key={t}>{t}</span>)}</div></div>
          <div className="cal"><div className="calbar"><i style={{background:"#e05"}}/><i style={{background:"#fb0"}}/><i style={{background:"#2c6"}}/><span>calendly.com/unboundedspac3s</span></div>
            <div className="calbody"><div className="caldash">Your Calendly booking calendar will appear here.<b>→ Paste your Calendly embed in this section</b></div></div></div>
        </div></section>
      </>}

      {page==="templates"&&<div className="cat">
        <div className="wrap chero"><span className="mark"/><h1 className="s">Ready-made documents.<br/><i>Buy once, use forever.</i></h1>
          <p>Professional Word templates for real UK businesses across seven sectors. Choose your business, or a bundle, and download the moment you buy.</p>
          <div className="cstats"><div className="cstat"><b>119</b><span>PACKS</span></div><div className="cstat"><b>7</b><span>SECTORS</span></div><div className="cstat"><b>£17</b><span>FROM</span></div></div></div>

        <section style={{paddingTop:34}}><div className="wrap">
          <div className="eyebrow">Choose your business</div><h2 className="h2">Single packs, built for you.</h2>
          <p className="sub">Pick your business type and download the exact pack. Each is a complete, editable document set, from setup and compliance to contracts and pricing.</p>
          <div className="pgrid">
            {SECTORS.map(([name,meta,key])=><div className="pcard" key={key}><div className="pn">{name}</div><div className="pmeta">{meta} · pick your business type</div><div className="prow"><span className="pp">from £17</span><button className="btn gold" onClick={()=>pay(key)}>Choose your pack →</button></div></div>)}
            <div className="pcard"><div className="pn">Core Essentials</div><div className="pmeta">6 packs · the foundations any business needs</div><div className="prow"><span className="pp">from £27</span><button className="btn gold" onClick={()=>pay("corePick")}>Choose a pack →</button></div></div>
          </div>
        </div></section>

        <section style={{paddingTop:10}}><div className="wrap">
          <div className="eyebrow">Grow & expand</div><h2 className="h2">For businesses ready for the next level.</h2>
          <div className="pgrid">
            <div className="pcard"><div className="pn">Scale-Up</div><div className="pmeta">Staff, finance, retention, positioning and growth</div><div className="prow"><span className="pp">from £27</span><button className="btn gold" onClick={()=>pay("scaleupPick")}>Choose a pack →</button></div></div>
            <div className="pcard"><div className="pn">Go Global</div><div className="pmeta">Export, going online globally, licensing and more</div><div className="prow"><span className="pp">from £27</span><button className="btn gold" onClick={()=>pay("goglobalPick")}>Choose a pack →</button></div></div>
          </div>
        </div></section>

        <section style={{paddingTop:10,paddingBottom:70}}><div className="wrap">
          <div className="eyebrow">Bundles</div><h2 className="h2">More in one, for less.</h2>
          <p className="sub">Cross-business toolkits that save you buying piece by piece.</p>
          <div className="pgrid">
            {BUNDLES.map(([name,price,meta,key])=><div className="pcard bcard" key={key}><div className="pn">{name}</div><div className="pmeta">{meta}</div><div className="prow"><span className="pp">{price}</span><button className="btn gold" onClick={()=>pay(key)}>Buy the bundle →</button></div></div>)}
          </div>
          <p className="allsectors" style={{color:"var(--muted-l)"}}>Prefer to browse everything? <a href="https://payhip.com/UnboundedSpac3s" target="_blank" rel="noopener" style={{color:"var(--gold-br)"}}>Visit the full shop →</a></p>
        </div></section>
      </div>}

      {page==="quiz"&&<div style={{background:"var(--ink2)",minHeight:"72vh"}}><section><div className="wrap" style={{maxWidth:760}}>
        <div style={{textAlign:"center",marginBottom:30}}><div className="eyebrow" style={{color:"var(--gold)"}}>Free · about a minute</div><h2 className="h2" style={{color:"var(--cream)"}}>Not sure what to build? Find your footing.</h2><p className="sub" style={{color:"var(--muted-l)",margin:"12px auto 0"}}>A few quick taps and we'll point you toward a direction and a starting point.</p></div>
        {quizStep<QUIZ.length?(
          <div className="intakebox">
            <div className="rlabel">Question {quizStep+1} of {QUIZ.length}</div>
            <h4 style={{fontFamily:"'Instrument Serif',serif",fontSize:24,color:"var(--cream)",margin:"8px 0 18px"}}>{QUIZ[quizStep].q}</h4>
            <div style={{display:"grid",gap:10}}>{QUIZ[quizStep].opts.map(([label,tag])=><button key={tag} onClick={()=>{setQuizAns(a=>({...a,[QUIZ[quizStep].id]:tag}));setQuizStep(x=>x+1);}} style={{textAlign:"left",background:"var(--ink)",border:"1px solid var(--dline)",color:"var(--cream)",borderRadius:10,padding:"14px 16px",fontFamily:"inherit",fontSize:15,cursor:"pointer"}}>{label}</button>)}</div>
            {quizStep>0&&<button onClick={()=>setQuizStep(x=>x-1)} style={{marginTop:16,background:"none",border:"none",color:"var(--muted-l)",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>← Back</button>}
          </div>
        ):(()=>{const R=quizResult(quizAns);return(
          <div className="intakebox">
            <div className="rlabel">Here's where I'd point you</div>
            <h4 style={{fontFamily:"'Instrument Serif',serif",fontSize:26,color:"var(--cream)",margin:"6px 0 10px"}}>{R.weak?"You've got real options.":`Sounds like ${R.name}.`}</h4>
            <p className="rnote">{R.weak?"That's genuinely worth talking through before you commit to one path. Let's have a quick chat and I'll help you find the direction that fits you.":R.lines.join(" ")}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
              {R.weak?<><button className="btn gold" onClick={()=>go("services","book")}>Book a free discovery call →</button><button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay("corePick")}>Start with Core Essentials</button></>:<><button className="btn gold" onClick={()=>pay(R.key)}>Browse the {R.name} packs →</button>{R.scaling&&<button className="btn" style={{border:"1px solid var(--dline)",color:"var(--cream)"}} onClick={()=>pay("scaleupPick")}>Add the Scale-Up packs →</button>}</>}
            </div>
            <div style={{borderTop:"1px solid var(--dline)",marginTop:24,paddingTop:20}}>
              {quizSent?<p style={{color:"var(--gold-br)"}}>Brilliant, noted. When our email is live your results and a free checklist will come straight over.</p>:<>
                <label style={{display:"block",color:"var(--muted-l)",fontSize:14,marginBottom:8}}>Want your results and a free starter checklist emailed over?</label>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <input value={quizEmail} onChange={e=>setQuizEmail(e.target.value)} placeholder="you@email.com" style={{flex:"1 1 220px",background:"var(--ink)",border:"1px solid var(--dline)",color:"var(--cream)",borderRadius:10,padding:"12px 14px",fontFamily:"inherit",fontSize:15}}/>
                  <button className="btn gold" onClick={()=>{if(!quizEmail.includes("@"))return;fetch("/api/quiz-lead",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:quizEmail,answers:quizAns,result:R.weak?"discovery call":R.name})}).catch(()=>{});setQuizSent(true);}}>Send my results</button>
                </div>
              </>}
            </div>
            <button onClick={()=>{setQuizStep(0);setQuizAns({});setQuizSent(false);}} style={{marginTop:18,background:"none",border:"none",color:"var(--muted-l)",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>↺ Start again</button>
          </div>
        );})()}
      </div></section></div>}

      <Footer go={go}/>
    </div>
  );
}
