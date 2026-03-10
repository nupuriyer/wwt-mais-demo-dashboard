var GOOGLE_AI_KEY = 'GEMINI_API_KEY_PLACEHOLDER';
let AI_ENABLED = false;

// 1. THE GOVERNANCE DICTIONARY
const governanceMap = {
    "linkedin": { val: "linkedin", label: "Standardized Brand" },
    "lnkd-post": { val: "linkedin", label: "Mapped Platform ID" },
    "paid search": { val: "paid-search", label: "Hyphenated Space" },
    "google & bing": { val: "google-and-bing", label: "Converted Ampersand" },
    "email_newsletter": { val: "email", label: "Cleaned Medium" },
    "web-ref": { val: "referral", label: "Resolved Jargon" },
    "strategy briefing 2.0": { val: "strategy-briefing-v2", label: "Slugified Version" }
};

const competitorIntelDB = {
    "accenture": {
        headline: "Accenture to Acquire Ookla to Strengthen Network Intelligence with Data and AI",
        source: "Accenture Newsroom • March 3, 2026",
        url: "https://newsroom.accenture.com/news/2026/accenture-to-acquire-ookla-to-strengthen-network-intelligence-and-experience-with-data-and-ai-for-enterprises",
        summary: "Accenture is integrating Speedtest and Downdetector data into their AI stack to own the 'Data Foundation' for 5G optimization.",
        impact: "Challenges WWT's role in network performance validation; they are moving from consulting to owning the measurement tools.",
        counter: "Double down on the ATC 'Physical Truth'—software data can be modeled, but WWT provides the hardware-level validation Accenture lacks."
    },
    "deloitte": {
        headline: "Deloitte Unveils 'Physical AI' Solutions Built with NVIDIA Omniverse Libraries",
        source: "Deloitte Global • March 2, 2026",
        url: "https://www.deloitte.com/global/en/about/press-room/physical-ai-nvidia-omniverse-industrial-transformation.html",
        summary: "Expansion of NVIDIA partnership to deploy high-fidelity digital twins and edge robotics in industrial environments.",
        impact: "Deloitte is moving into 'Embodied AI' (Robotics/Edge), requiring massive compute infrastructure where WWT typically leads.",
        counter: "Lead with 'Edge-to-Cloud' architecture. Deloitte has the digital twin software, but WWT has the labs to build the supercomputing pods."
    },
    "insight": {
        headline: "Insight Enterprises Presents AI-First Strategic Shift at Raymond James Conference",
        source: "Investing.com • March 3, 2026",
        url: "https://in.investing.com/news/transcripts/insight-enterprises-at-raymond-james-conference-aifirst-strategy-93CH-5270229",
        summary: "A direct brand-pivot to move beyond hardware reseller roots into high-margin AI consulting and 'Decision Intelligence' platforms.",
        impact: "Increases market noise; clients may see Insight as a cheaper alternative for AI integration.",
        counter: "Showcase the 'AI Project Canvas.' Emphasize WWT's ability to take a project from vague concept to ATC-validated roadmap."
    }
};

const seoIntentDB = {
    "ai-infrastructure": {
        topic: "AI Infrastructure & Agents",
        organic: ["NVIDIA GTC 2026", "Agentic AI workflows", "AI compute costs"],
        internal: ["NVIDIA GTC Watch Party", "Hands-on Lab: AI Proving Ground", "AI Project Canvas"],
        insight: "Users are moving from 'What is AI?' (Organic) to 'How do I build it at WWT?' (Internal).",
        action: "Create a 'GTC Recap' blog that links directly to the AI Proving Ground lab."
    },
    "cybersecurity": {
        topic: "Cybersecurity & Zero Trust",
        organic: ["Quantum-safe cryptography", "AI-driven phishing", "CISO playbook 2026"],
        internal: ["Fortinet vs Palo Alto lab", "Cyber Range demo", "Infection Core workshop"],
        insight: "Organic search is academic/fear-based. Internal search is highly tactical and vendor-comparison focused.",
        action: "Launch a 'Comparison Guide' landing page for Fortinet vs. Palo Alto in the ATC."
    },
    "cloud-networking": {
        topic: "Cloud & Multi-Cloud Networking",
        organic: ["Sovereign cloud strategy", "Multi-cloud egress fees", "Azure vs AWS 2026"],
        internal: ["Cisco Nexus Dashboard lab", "Equinix Cloud Exchange", "Cloud Transit Gateway"],
        insight: "Internal users are searching for specific technical 'connectors' rather than broad strategy.",
        action: "Develop a 'Technical Quick-Start Guide' for Multi-Cloud connectivity."
    }
};

const performanceDB = {
    "q1-ai-launch": {
        name: "Q1 Global AI Launch",
        spend: 125000,
        metrics: {
            impressions: "1.2M",
            clicks: "45K",
            mqls: 850,
            sqls: 120,
            pipeline: 4200000,
            revenue: 1100000
        },
        insight: "High efficiency in the 'Consideration' phase. 14% MQL-to-SQL conversion is 4% above benchmark.",
        status: "High Performance"
    },
    "cyber-range-promo": {
        name: "Cyber Range: Hands-on Demo",
        spend: 85000,
        metrics: {
            impressions: "850K",
            clicks: "12K",
            mqls: 310,
            sqls: 95,
            pipeline: 2800000,
            revenue: 650000
        },
        insight: "Lower top-of-funnel volume, but extremely high SQL quality. Leads from this campaign close 20% faster.",
        status: "High Quality"
    }
};

const utmHistory = [
    { raw: "LinkedIn / Paid Search", fixed: "linkedin / paid-search", url: "https://wwt.com?utm_source=linkedin&utm_medium=paid-search", changeLog: "Standardized & Hyphenated" },
    { raw: "FACEBOOK / Email_Newsletter", fixed: "facebook / email", url: "https://wwt.com?utm_source=facebook&utm_medium=email", changeLog: "Lowercased & Cleaned" },
    { raw: "Google & Bing / Search", fixed: "google-and-bing / search", url: "https://wwt.com?utm_source=google-and-bing&utm_medium=search", changeLog: "Ampersand Fixed" }
];

const agents = [
    { id: 'utm', name: 'UTM Builder', cat: 'Digital', icon: 'link' },
    { id: 'intel', name: 'Competitor Intel', cat: 'Strategy', icon: 'shield' },
    { id: 'seo', name: 'SEO Search', cat: 'Growth', icon: 'search' },
    { id: 'reporting', name: 'Performance Agent', cat: 'Revenue', icon: 'bar-chart-3' },
    { id: 'social', name: 'Social Post', cat: 'Content', icon: 'share-2' },
    { id: 'email', name: 'Email Draft', cat: 'Campaigns', icon: 'mail' }
];

function init() {
    const grid = document.getElementById('agent-grid');
    if (grid) {
        grid.innerHTML = agents.map(a => `
            <div class="agent-button card p-4 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-slate-800 transition-all border-slate-700 hover:border-blue-500" onclick="launchAgent('${a.id}')">
                <div class="w-10 h-10 mb-3 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i data-lucide="${a.icon}" class="w-5 h-5"></i>
                </div>
                <h4 class="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-tight">${a.name}</h4>
                <span class="text-[8px] text-slate-500 mt-1 uppercase">${a.cat}</span>
            </div>
        `).join('');
    }
    // Check if lucide is available before calling
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Call init when window loads
window.onload = init;


function launchAgent(id) {
    document.getElementById('stage-placeholder').classList.add('hidden');
    const content = document.getElementById('stage-content');
    content.classList.remove('hidden');

    if (id === 'utm') {
        content.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-6">
                <div class="flex justify-between items-center px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">UTM Strategic Governance</h3>
                    </div>
                </div>
                
                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
                    <input id="utm-url" type="text" placeholder="Landing Page URL" class="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-300 font-medium placeholder:text-slate-600 outline-none focus:border-blue-500 transition-all">
                    <div class="grid grid-cols-3 gap-4">
                        <input id="utm-src" type="text" placeholder="Source" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-300 font-medium placeholder:text-slate-600 outline-none">
                        <input id="utm-med" type="text" placeholder="Medium" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-300 font-medium placeholder:text-slate-600 outline-none">
                        <input id="utm-camp" type="text" placeholder="Campaign" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-300 font-medium placeholder:text-slate-600 outline-none">
                    </div>
                    <button onclick="processUTM()" id="utm-btn" class="w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-slate-800'}">
                        ${AI_ENABLED ? 'Govern with Gemini' : 'Generate Standard Link'}
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="flex justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span>Audit Log: Inconsistency → Correction</span>
                        <span>Copy URL</span>
                    </div>
                    <div id="utm-history-list" class="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar"></div>
                </div>
            </div>`;
        renderHistory();
    }
            if (id === 'intel') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Competitor Intelligence Crawler</h3>
                    </div>
                    <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Web Crawler Active</span>
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
                    <div class="flex gap-4">
                        <input id="intel-search" type="text" placeholder="Enter Competitor Name (e.g. Accenture, Deloitte, Insight)" 
                               class="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-300 font-medium placeholder:text-slate-600 outline-none focus:border-blue-500 transition-all">
                        <button onclick="runCrawler()" class="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                            <i data-lucide="zap" class="w-4 h-4"></i> Run Analysis
                        </button>
                    </div>
                </div>

                <div id="intel-display" class="hidden grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
                    
                    <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                        <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Crawler Snapshot</span>
                            <span id="snap-source" class="text-[9px] text-blue-400 font-mono"></span>
                        </div>
                        <div class="p-8 space-y-4">
                            <div class="w-12 h-1 bg-blue-500"></div>
                            <h2 id="snap-headline" class="text-2xl font-bold text-white leading-tight"></h2>
                            <div class="space-y-2 opacity-40">
                                <div class="h-3 bg-slate-800 rounded w-full"></div>
                                <div class="h-3 bg-slate-800 rounded w-5/6"></div>
                                <div class="h-3 bg-slate-800 rounded w-4/6"></div>
                            </div>
                            <div class="pt-6">
                                <a id="snap-link" href="#" target="_blank" class="inline-flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
                                    View Original Source <i data-lucide="external-link" class="w-3 h-3"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl space-y-3">
                            <h5 class="text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <i data-lucide="brain-circuit" class="w-4 h-4"></i> Strategic Synthesis
                            </h5>
                            <p id="syn-summary" class="text-slate-200 text-sm leading-relaxed font-medium"></p>
                        </div>
                        <div class="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl space-y-3">
                            <h5 class="text-red-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <i data-lucide="alert-triangle" class="w-4 h-4"></i> WWT Competitive Impact
                            </h5>
                            <p id="syn-impact" class="text-slate-200 text-sm leading-relaxed font-medium"></p>
                        </div>
                        <div class="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center justify-between">
                             <div class="space-y-1">
                                <h5 class="text-green-400 font-bold text-[10px] uppercase tracking-widest">Recommended Counter-Move</h5>
                                <p id="syn-counter" class="text-white font-bold text-lg leading-tight"></p>
                             </div>
                             <div class="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                <i data-lucide="shield-check" class="w-5 h-5"></i>
                             </div>
                        </div>
                    </div>

                </div>
            </div>`;
            }

        if (id === 'seo') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Search Intent Bridge</h3>
                    </div>
                    <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                        <i data-lucide="search" class="w-3 h-3 text-blue-400"></i>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SEO Data Synced</span>
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block px-1">Select Topic Cluster</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onclick="runSEO('ai-infrastructure')" class="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold hover:border-blue-500 transition-all text-left group">
                            <span class="block text-xs opacity-50 mb-1 font-medium">Topic 01</span>
                            AI & Infrastructure
                        </button>
                        <button onclick="runSEO('cybersecurity')" class="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold hover:border-blue-500 transition-all text-left group">
                            <span class="block text-xs opacity-50 mb-1 font-medium">Topic 02</span>
                            Cybersecurity
                        </button>
                        <button onclick="runSEO('cloud-networking')" class="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold hover:border-blue-500 transition-all text-left group">
                            <span class="block text-xs opacity-50 mb-1 font-medium">Topic 03</span>
                            Cloud Networking
                        </button>
                    </div>
                </div>

                <div id="seo-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                            <div class="flex items-center gap-2 mb-6">
                                <div class="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                                    <i data-lucide="globe" class="w-4 h-4"></i>
                                </div>
                                <h4 class="text-sm font-bold text-white uppercase tracking-tight">External Intent (Google)</h4>
                            </div>
                            <ul id="seo-organic" class="space-y-3"></ul>
                        </div>

                        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                            <div class="flex items-center gap-2 mb-6">
                                <div class="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                                    <i data-lucide="layout" class="w-4 h-4"></i>
                                </div>
                                <h4 class="text-sm font-bold text-white uppercase tracking-tight">Internal Intent (wwt.com)</h4>
                            </div>
                            <ul id="seo-internal" class="space-y-3"></ul>
                        </div>
                    </div>

                    <div class="bg-blue-600 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-blue-900/20 shadow-2xl">
                        <div class="flex-1 space-y-2 text-center md:text-left">
                            <h5 class="text-blue-100 font-bold text-xs uppercase tracking-widest">The SEO Bridge Insight</h5>
                            <p id="seo-insight" class="text-white text-xl font-bold leading-snug"></p>
                        </div>
                        <div class="w-full md:w-72 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl space-y-3">
                            <span class="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Recommended Action</span>
                            <p id="seo-action" class="text-white font-medium text-sm"></p>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        if (id === 'reporting') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Performance Attribution Agent</h3>
                    </div>
                    <div class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter">
                        Single Source of Truth Active
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onclick="runReporting('q1-ai-launch')" class="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all text-left">
                        <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Campaign</span>
                        <h4 class="text-white font-bold text-lg">Q1 Global AI Launch</h4>
                    </button>
                    <button onclick="runReporting('cyber-range-promo')" class="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all text-left">
                        <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Campaign</span>
                        <h4 class="text-white font-bold text-lg">Cyber Range Demo Promo</h4>
                    </button>
                </div>

                <div id="report-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">Spend</p>
                            <h2 id="rep-spend" class="text-2xl font-bold text-white mt-1"></h2>
                        </div>
                        <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">Total MQLs</p>
                            <h2 id="rep-mql" class="text-2xl font-bold text-blue-400 mt-1"></h2>
                        </div>
                        <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">Pipeline ($)</p>
                            <h2 id="rep-pipe" class="text-2xl font-bold text-green-400 mt-1"></h2>
                        </div>
                        <div class="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">ROI (Calculated)</p>
                            <h2 id="rep-roi" class="text-2xl font-bold text-orange-400 mt-1"></h2>
                        </div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div class="p-8 flex flex-col md:flex-row gap-10 items-center">
                            <div class="flex-1 space-y-4">
                                <div class="flex items-center gap-2">
                                    <span id="rep-status" class="px-2 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase rounded"></span>
                                    <h4 class="text-white font-bold">Marketing-to-Revenue Insight</h4>
                                </div>
                                <p id="rep-insight" class="text-slate-400 leading-relaxed font-medium"></p>
                            </div>
                            <div class="w-full md:w-64 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h5 class="text-[10px] font-bold text-slate-500 uppercase mb-4">Conversion Health</h5>
                                <div class="space-y-4">
                                    <div>
                                        <div class="flex justify-between text-[10px] mb-1"><span class="text-slate-400">MQL to SQL</span><span class="text-white">14.2%</span></div>
                                        <div class="h-1.5 w-full bg-slate-800 rounded-full"><div class="h-full bg-blue-500 w-[14%] rounded-full"></div></div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-[10px] mb-1"><span class="text-slate-400">SQL to Opportunity</span><span class="text-white">32%</span></div>
                                        <div class="h-1.5 w-full bg-slate-800 rounded-full"><div class="h-full bg-green-500 w-[32%] rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    
    lucide.createIcons();
}

// 2. ROBUST GOVERNANCE WITH LABELING
function govern(input, fallback) {
    if (!input || input.trim() === "") return { val: fallback, label: "Default Used" };
    
    let clean = input.trim().toLowerCase();
    
    // Check Dictionary
    if (governanceMap[clean]) return governanceMap[clean];

    // Check for general cleanup
    let final = clean.replace(/&/g, 'and').replace(/[\s\._]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    
    let reason = "Lowercased";
    if (input.includes(" ")) reason = "Fixed Spacing";
    if (input.includes("_") || input.includes(".")) reason = "Slugified";
    if (input.includes("&")) reason = "Fixed Ampersand";

    return { val: final, label: reason };
}

async function processUTM() {
    const rawUrl = document.getElementById('utm-url').value || "https://wwt.com";
    const rawSrc = document.getElementById('utm-src').value || "";
    const rawMed = document.getElementById('utm-med').value || "";
    const rawCamp = document.getElementById('utm-camp').value || "";

    const activeKey = window.API_KEY_INJECTED || window.GOOGLE_AI_KEY || GOOGLE_AI_KEY;
    let finalSrc, finalMed, finalCamp, log;

    if (AI_ENABLED && activeKey && !activeKey.includes('PLACEHOLDER')) {
        try {
            // ... (AI Logic remains ready here)
            log = "AI Strategic Correction";
        } catch (e) {
            const res = govern(rawSrc, "direct");
            finalSrc = res.val; log = res.label;
        }
    } else {
        const s = govern(rawSrc, "direct");
        const m = govern(rawMed, "none");
        const c = govern(rawCamp, "promo");
        finalSrc = s.val;
        finalMed = m.val;
        finalCamp = c.val;
        log = `${s.label} / ${m.label}`;
    }

    const finalUrl = `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}utm_source=${finalSrc}&utm_medium=${finalMed}&utm_campaign=${finalCamp}`;

    utmHistory.unshift({
        raw: `${rawSrc || "None"} / ${rawMed || "None"}`,
        fixed: `${finalSrc} / ${finalMed}`,
        url: finalUrl,
        changeLog: log
    });

    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('utm-history-list');
    if (!list) return;
    list.innerHTML = utmHistory.map((item) => `
        <div class="bg-slate-900/40 border border-blue-500/10 bg-blue-500/5 p-4 rounded-xl flex items-center justify-between transition-all duration-500 animate-in fade-in slide-in-from-top-2">
            <div class="flex flex-col gap-1.5 max-w-[85%]">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[9px] text-slate-600 line-through decoration-red-900/30">${item.raw}</span>
                    <i data-lucide="arrow-right" class="w-3 h-3 text-blue-500/30"></i>
                    <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">${item.fixed}</span>
                    <span class="text-[7px] border border-blue-500/20 px-1.5 py-0.5 rounded font-black tracking-tighter uppercase text-slate-500 bg-slate-900/50">${item.changeLog}</span>
                </div>
                <span class="text-[10px] text-slate-500 font-mono truncate opacity-80">${item.url}</span>
            </div>
            <button onclick="copyLine('${item.url}', this)" class="ml-4 p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function runCrawler() {
    const query = document.getElementById('intel-search').value.toLowerCase().trim();
    const display = document.getElementById('intel-display');
    
    // Default Fallback
    let data = {
        headline: "Monitoring Competitive Signals for " + query,
        source: "Live Crawler • March 2026",
        url: "https://www.wwt.com",
        summary: "General market movement detected. Competitor is increasing headcount in digital engineering roles.",
        impact: "Incremental pressure on talent acquisition and standard consulting rates.",
        counter: "Promote the ATC's 'Lab-as-a-Service' to highlight our physical engineering edge."
    };

    if (competitorIntelDB[query]) { data = competitorIntelDB[query]; }

    // Populate UI
    document.getElementById('snap-source').innerText = data.source;
    document.getElementById('snap-headline').innerText = data.headline;
    document.getElementById('syn-summary').innerText = data.summary;
    document.getElementById('syn-impact').innerText = data.impact;
    document.getElementById('syn-counter').innerText = data.counter;
    
    // Set the link
    const linkEl = document.getElementById('snap-link');
    linkEl.href = data.url;

    display.classList.remove('hidden');
    lucide.createIcons();
}

function runSEO(clusterId) {
    const data = seoIntentDB[clusterId];
    const resultArea = document.getElementById('seo-result');
    
    // Clear & Populate lists
    const orgList = document.getElementById('seo-organic');
    const intList = document.getElementById('seo-internal');
    
    orgList.innerHTML = data.organic.map(item => `
        <li class="flex items-center gap-3 text-slate-400 text-sm py-2 border-b border-slate-900">
            <i data-lucide="trending-up" class="w-3 h-3 text-blue-500"></i> ${item}
        </li>`).join('');
        
    intList.innerHTML = data.internal.map(item => `
        <li class="flex items-center gap-3 text-slate-400 text-sm py-2 border-b border-slate-900">
            <i data-lucide="mouse-pointer-2" class="w-3 h-3 text-orange-500"></i> ${item}
        </li>`).join('');

    document.getElementById('seo-insight').innerText = data.insight;
    document.getElementById('seo-action').innerText = data.action;

    resultArea.classList.remove('hidden');
    lucide.createIcons();
}

function runReporting(campaignId) {
    const data = performanceDB[campaignId];
    const resultArea = document.getElementById('report-result');
    
    document.getElementById('rep-spend').innerText = '$' + data.spend.toLocaleString();
    document.getElementById('rep-mql').innerText = data.metrics.mqls;
    document.getElementById('rep-pipe').innerText = '$' + (data.metrics.pipeline / 1000000).toFixed(1) + 'M';
    
    const roi = ((data.metrics.revenue - data.spend) / data.spend * 100).toFixed(0);
    document.getElementById('rep-roi').innerText = roi + '%';
    
    document.getElementById('rep-status').innerText = data.status;
    document.getElementById('rep-insight').innerText = data.insight;

    resultArea.classList.remove('hidden');
    lucide.createIcons();
}


function copyLine(text, btn) {
    navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i>`;
    lucide.createIcons();
    setTimeout(() => { btn.innerHTML = original; lucide.createIcons(); }, 2000);
}

function toggleUniversalAI(el) {
    AI_ENABLED = el.checked;
    const utmBtn = document.getElementById('utm-btn');
    if (utmBtn) {
        utmBtn.className = `w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-slate-800'}`;
        utmBtn.innerText = AI_ENABLED ? "Govern with Gemini" : "Generate Standard Link";
    }
}

function clearStage() {
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('stage-placeholder').classList.remove('hidden');
}

window.onload = init;






