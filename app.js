// 1. GLOBAL SESSION STATE
let SESSION_AI_KEY = null;
let AI_ENABLED = false;


const UTM_AI_SYSTEM_PROMPT = `You are a WWT Marketing Data Guardrail.
Task: Provide a 5-word strategic reason for a UTM correction.
Constraint: NO introductory text, NO quotes, NO punctuation at the end. 
Example Input: lnkd -> linkedin
Example Output: Ensures cross-platform attribution parity`;


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

const icpDB = {
    "manufacturing-ai": {
        title: "Industrial AI Pioneers",
        signals: ["Increased NVIDIA H100 spend", "Hiring 'Head of Digital Twin'", "Recent $50M Series C"],
        attributes: { industry: "Manufacturing", techStack: "NVIDIA, Azure", painPoint: "OT/IT Gap" },
        strategy: "Focus on 'ATC Factory-in-a-Box'. Lead with edge compute security."
    },
    "finance-security": {
        title: "Quantum-Ready Fintech",
        signals: ["SEC Cyber disclosure update", "Mainframe migration", "High egress fees"],
        attributes: { industry: "Financial Services", techStack: "AWS, Palo Alto", painPoint: "Quantum threats" },
        strategy: "Pitch 'Cyber Range' simulations. Lead with compliance risk-reduction."
    }
};

const revenueDB = {
    "global-bank-deal": {
        account: "Global Fortune 500 Bank",
        insight: "The ATC Workshop was the 'Tipping Point.' 80% of closed deals in this sector attended a lab within 30 days of closing.",
        recommendation: "Increase budget for 'Cloud-First' ATC lab invites by 20% for Q3.",
        touches: [
            { date: "Jan 12", event: "SEO: Quantum Security Search", impact: "High" },
            { date: "Feb 05", event: "Email: CTO Strategy Briefing", impact: "Medium" },
            { date: "Mar 01", event: "ATC: Private Cloud Workshop", impact: "Critical" }
        ]
    },
    "retail-edge-expansion": {
        account: "National Retail Chain",
        insight: "Content-heavy journey. This account consumed 4+ pieces of thought leadership before engaging sales.",
        recommendation: "Retarget similar 'Retail' personas with the 'AI Roadmap' whitepaper.",
        touches: [
            { date: "Feb 10", event: "LinkedIn: Edge Computing Ad", impact: "Medium" },
            { date: "Feb 22", event: "Web: Retail Whitepaper Download", impact: "High" },
            { date: "Mar 10", event: "Webinar: Future of Retail AI", impact: "High" }
        ]
    }
};

const emailDraftDB = {
    "sovereign-cloud": {
        pageTitle: "Data Sovereignty & Sovereign Cloud",
        url: "https://www.wwt.com/sovereign-cloud",
        draft: {
            subject: "Data Sovereignty: Navigating the Multi-Cloud Regulatory Landscape",
            body: "Hi [First_Name],\n\nAs regulatory landscapes shift, maintaining control over your data residency is now mission-critical. We just published a deep dive on how WWT delivers Sovereign Cloud solutions that keep your data compliant.\n\nWould you like to see how we've mapped these requirements in the ATC?\n\nBest,\n[Your Name]"
        }
    },
    "ai-proving-ground": {
        pageTitle: "AI Proving Ground: Accelerating AI Outcomes",
        url: "https://www.wwt.com/ai-proving-ground",
        draft: {
            subject: "Move from AI Hype to AI Reality",
            body: "Hi [First_Name],\n\nMost AI projects stall at the proof-of-concept stage. WWT’s AI Proving Ground is designed to break that cycle by providing the infrastructure and expertise to validate your LLM use cases at scale.\n\nReady to see the lab in action?\n\nBest,\n[Your Name]"
        }
    },
    "cyber-range": {
        pageTitle: "WWT Cyber Range: Advanced Security Simulation",
        url: "https://www.wwt.com/cyber-range",
        draft: {
            subject: "Test Your Defenses in the WWT Cyber Range",
            body: "Hi [First_Name],\n\nYou shouldn't find the gaps in your security during a breach. The WWT Cyber Range allows your team to simulate real-world attacks in a safe, sandboxed environment.\n\nCheck out our latest threat-hunting scenarios here.\n\nBest,\n[Your Name]"
        }
    }
};

const industryGapDB = {
    "healthcare": {
        industry: "Healthcare & Life Sciences",
        gap: "Clinical Edge Computing",
        trend: "74% increase in 'Hospital-at-Home' infrastructure searches.",
        opportunity: "WWT has strong Edge labs but lacks a specific 'Clinical-at-the-Edge' reference architecture for remote patient monitoring.",
        outline: {
            title: "The Hospital Without Walls: Scaling Clinical AI to the Edge",
            sections: [
                "The shift from centralized Data Centers to bedside compute.",
                "Reducing latency in real-time patient vitals monitoring.",
                "Security: HIPAA compliance in a decentralized Edge network.",
                "The ATC Blueprint: Validating Edge pods for hospital environments."
            ]
        }
    },
    "energy": {
        industry: "Energy & Utilities",
        gap: "Grid Modernization AI",
        trend: "Surge in 'Renewable Integration' and 'Smart Grid Security' queries.",
        opportunity: "High interest in Cisco/NVIDIA utility plays; WWT can lead by showing the 'Physical Truth' of grid simulations.",
        outline: {
            title: "Securing the Transition: AI-Driven Grid Resiliency",
            sections: [
                "Predictive maintenance for aging utility infrastructure.",
                "Managing the load: Integrating renewables with AI forecasting.",
                "Zero Trust for the Power Grid: Protecting Operational Technology (OT).",
                "Case Study: Digital Twin simulation of a regional substation."
            ]
        }
    }
};

const readoutDB = {
    "weekly-ops-mar-10": {
        date: "March 10, 2026",
        audience: "Portfolio Marketing Leadership",
        status: "On Track",
        workstreams: [
            { name: "Sovereign Cloud Launch", status: "Complete", update: "Platform page live; Email 'Special Send' synced to Marketo." },
            { name: "AI Proving Ground Campaign", status: "At Risk", update: "Creative assets delayed 48hrs; looking to pull in external agency support." },
            { name: "FY27 H1 Planning", status: "In Progress", update: "Industry gap analysis completed for Healthcare and Energy sectors." }
        ],
        metrics: {
            mql_growth: "+12% WoW",
            atc_tours: "45 Booked",
            budget_utilization: "88%"
        },
        recommendations: [
            "Pivot 'AI Proving Ground' ad spend to LinkedIn Sponsored Content to offset asset delay.",
            "Schedule executive briefing for 'Sovereign Cloud' results by Friday."
        ]
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
    { id: 'icp', name: 'ICP Agent', cat: 'Portfolio', icon: 'target' },
    { id: 'revenue', name: 'Revenue Intel', cat: 'Portfolio', icon: 'pie-chart' },
    { id: 'industry', name: 'Industry Agent', cat: 'Portfolio', icon: 'factory' },
    { id: 'email', name: 'Email Draft', cat: 'Campaigns', icon: 'mail' },
    { id: 'readout', name: 'Readout Agent', cat: 'Marketing Ops', icon: 'file-text' } // The Final Piece!
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
                <span class="text-[8px] text-slate-500 mt-1 uppercase font-medium tracking-tighter">${a.cat}</span>
            </div>
        `).join('');
    }
    if (window.lucide) lucide.createIcons();
}

// The Ignition Function
async function toggleUniversalAI(checkbox) {
    const container = document.getElementById('ai-status-container');
    const dot = document.getElementById('ai-glow-dot');

    AI_ENABLED = checkbox.checked;

    if (AI_ENABLED) {
        // Just take whatever they give us. We'll validate it during the actual call.
        const key = prompt("Enter WWT Agentic Master Key (or any string to attempt Live Mode):");
        SESSION_AI_KEY = key; 
        
        if(container) container.classList.add('border-blue-500/50');
        if(dot) dot.classList.add('bg-blue-400', 'animate-pulse');
        console.log("AI Mode Attempting...");
    } else {
        SESSION_AI_KEY = null;
        if(container) container.classList.remove('border-blue-500/50');
        if(dot) dot.classList.remove('bg-blue-400', 'animate-pulse');
    }
}

// UNIVERSAL CALLER (Used by all agents)
async function callGemini(prompt) {
    if (!SESSION_AI_KEY) return null; // If toggle is off, return null to use demo data
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${SESSION_AI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("AI Link Failed:", e);
        return null;
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
    if (id === 'icp') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Ideal Client Profile (ICP) Agent</h3>
                    </div>
                    <div class="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                        Analyzing Market Signals
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Identify Growth Opportunity</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onclick="runICP('manufacturing-ai')" class="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold hover:border-indigo-500 transition-all text-left">
                            Manufacturing + AI
                        </button>
                        <button onclick="runICP('finance-security')" class="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-bold hover:border-indigo-500 transition-all text-left">
                            FinTech + Quantum Security
                        </button>
                    </div>
                </div>

                <div id="icp-result" class="hidden grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                        <h4 class="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Detected Market Signals</h4>
                        <div id="icp-signals" class="space-y-3"></div>
                    </div>

                    <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                        <div class="relative z-10 space-y-6">
                            <div>
                                <h2 id="icp-title" class="text-2xl font-bold text-white mb-1"></h2>
                                <span class="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Target ICP Definition</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <p class="text-[9px] text-slate-500 font-bold uppercase">Industry</p>
                                    <p id="icp-industry" class="text-slate-200 text-xs font-medium"></p>
                                </div>
                                <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <p class="text-[9px] text-slate-500 font-bold uppercase">Tech Stack</p>
                                    <p id="icp-tech" class="text-slate-200 text-xs font-medium"></p>
                                </div>
                            </div>
                            <div class="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                                <h5 class="text-indigo-400 text-[10px] font-bold uppercase mb-1">Portfolio Strategy</h5>
                                <p id="icp-strategy" class="text-white text-sm font-medium leading-relaxed"></p>
                            </div>
                        </div>
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                            <i data-lucide="target" class="w-24 h-24 text-white"></i>
                        </div>
                    </div>
                </div>
            </div>`;
    }

            if (id === 'revenue') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Marketing-to-Revenue Intelligence</h3>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onclick="runRevenue('global-bank-deal')" class="p-5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500 transition-all text-left group">
                        <h4 class="text-white font-bold group-hover:text-emerald-400 text-lg">Global Fortune 500 Bank</h4>
                        <p class="text-[10px] text-slate-500 uppercase mt-1 tracking-tight">$2.4M Deal Value • 180 Day Cycle</p>
                    </button>
                    <button onclick="runRevenue('retail-edge-expansion')" class="p-5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500 transition-all text-left group">
                        <h4 class="text-white font-bold group-hover:text-emerald-400 text-lg">National Retail Chain</h4>
                        <p class="text-[10px] text-slate-500 uppercase mt-1 tracking-tight">$850K Deal Value • 95 Day Cycle</p>
                    </button>
                </div>

                <div id="rev-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-8">
                            <h4 class="text-[10px] font-bold text-slate-500 uppercase mb-8 tracking-[0.2em]">Multi-Touch Attribution Journey</h4>
                            <div id="rev-timeline" class="space-y-6"></div>
                        </div>
                        <div class="space-y-4">
                            <div class="bg-emerald-600 rounded-2xl p-6 shadow-xl shadow-emerald-900/20">
                                <h5 class="text-emerald-100 text-[10px] font-black uppercase mb-4 tracking-widest">AI Strategic Conclusion</h5>
                                <p id="rev-insight" class="text-white font-bold text-sm leading-relaxed"></p>
                            </div>
                            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                                <h5 class="text-slate-500 text-[10px] font-bold uppercase mb-2">Next-Best Action</h5>
                                <p id="rev-rec" class="text-slate-200 text-xs font-medium italic"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

            if (id === 'email') {
        content.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Email Campaign Agent</h3>
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
                    <div class="flex items-center justify-between px-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WWT Platform: Latest Published Pages</label>
                        <span class="text-[9px] text-emerald-500 font-bold animate-pulse">● LIVE SYNC</span>
                    </div>
                    <div class="flex gap-3">
                        <select id="cms-page-selector" class="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl text-blue-400 font-medium text-sm outline-none focus:border-blue-500 appearance-none">
                            <option value="sovereign-cloud">Sovereign Cloud Solutions</option>
                            <option value="ai-proving-ground">AI Proving Ground</option>
                            <option value="cyber-range">Cyber Range Simulation</option>
                        </select>
                        <button onclick="runEmailDraft()" class="px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                            <i data-lucide="wand-2" class="w-4 h-4"></i> Draft Special Send
                        </button>
                    </div>
                </div>

                <div id="email-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                        <div class="bg-slate-900 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent Draft Output</span>
                            <div id="edit-indicator" class="hidden text-[9px] font-bold text-orange-400 uppercase tracking-widest animate-pulse">Editing Mode Active</div>
                        </div>
                        <div class="p-8 space-y-4 font-serif text-slate-300">
                            <div class="flex items-center gap-2">
                                <b class="text-slate-500 font-bold uppercase text-[10px] font-sans">Subject:</b>
                                <span id="eml-subject" contenteditable="false" class="text-sm font-sans text-white focus:outline-none focus:bg-slate-900 px-1 rounded"></span>
                            </div>
                            <hr class="border-slate-800">
                            <div id="eml-body" contenteditable="false" class="whitespace-pre-wrap leading-relaxed italic text-lg focus:outline-none focus:bg-slate-900 p-2 rounded transition-colors"></div>
                        </div>
                        <div class="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-between items-center px-6">
                             <button onclick="toggleEmailEdit()" id="edit-toggle-btn" class="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                                <i data-lucide="edit-3" class="w-3 h-3"></i> <span>Edit Content</span>
                             </button>
                             <div class="flex gap-3">
                                 <button onclick="simulatePush()" id="push-btn" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2">
                                    <i data-lucide="share-2" class="w-3 h-3"></i> Push to Marketo
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

        if (id === 'industry') {
        content.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Industry Content Intelligence</h3>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl text-center space-y-6">
                    <div class="flex justify-center gap-8">
                        <div class="text-center group cursor-pointer" onclick="runIndustryAnalysis('healthcare')">
                            <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-3 group-hover:border-blue-500 transition-all">
                                <i data-lucide="heart-pulse" class="w-8 h-8 text-blue-500"></i>
                            </div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Healthcare</span>
                        </div>
                        <div class="text-center group cursor-pointer" onclick="runIndustryAnalysis('energy')">
                            <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-3 group-hover:border-orange-500 transition-all">
                                <i data-lucide="zap" class="w-8 h-8 text-orange-500"></i>
                            </div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Energy</span>
                        </div>
                    </div>
                    <p class="text-slate-400 text-sm italic">Select an industry to identify high-value content white spaces.</p>
                </div>

                <div id="industry-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-1 space-y-4">
                            <div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
                                <h5 class="text-blue-400 text-[10px] font-bold uppercase mb-4 tracking-widest">Market Gap Detected</h5>
                                <h2 id="ind-gap" class="text-xl font-bold text-white mb-2"></h2>
                                <p id="ind-trend" class="text-xs text-slate-400 leading-relaxed"></p>
                            </div>
                            <div class="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
                                <h5 class="text-blue-300 text-[10px] font-bold uppercase mb-2">The Opportunity</h5>
                                <p id="ind-opp" class="text-white text-xs font-medium leading-relaxed"></p>
                            </div>
                        </div>

                        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div class="bg-slate-950 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                                <span class="text-[10px] font-bold text-slate-500 uppercase">AI-Generated Content Blueprint</span>
                                <button class="text-[10px] font-bold text-blue-500 uppercase hover:text-blue-400">Export to Word</button>
                            </div>
                            <div class="p-8 space-y-6">
                                <h3 id="ind-title" class="text-2xl font-bold text-white border-l-4 border-blue-600 pl-4"></h3>
                                <div id="ind-sections" class="space-y-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        if (id === 'readout') {
        content.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-6">
                <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white tracking-tight">Marketing Readout & Rec Agent</h3>
                    </div>
                    <div class="flex gap-2">
                        <button class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-1 px-3 rounded-lg border border-slate-700 transition-all">Export PPT</button>
                        <button class="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-1 px-3 rounded-lg transition-all">Sync to Loop</button>
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between">
                    <div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Reporting Cycle</p>
                        <h4 class="text-white font-bold">WWT Portfolio Marketing - Week 10 (Mar 2026)</h4>
                    </div>
                    <button onclick="runReadout('weekly-ops-mar-10')" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i> Generate Executive Brief
                    </button>
                </div>

                <div id="readout-result" class="hidden grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                            <h5 class="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Workstream Status</h5>
                            <div id="readout-workstreams" class="space-y-4"></div>
                        </div>
                        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                            <h5 class="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest italic">Weekly Recommendations</h5>
                            <ul id="readout-recs" class="space-y-3 list-none"></ul>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-900/20">
                            <h5 class="text-indigo-100 text-[10px] font-black uppercase mb-4 tracking-widest">Key Performance Indicators</h5>
                            <div id="readout-metrics" class="space-y-4"></div>
                        </div>
                        <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                            <h5 class="text-slate-500 text-[10px] font-bold uppercase mb-2">Overall Program Health</h5>
                            <div class="text-3xl font-black text-emerald-500 uppercase tracking-tighter">ON TRACK</div>
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
    const rawSrc = document.getElementById('utm-src').value || "direct";
    const rawMed = document.getElementById('utm-med').value || "none";
    const rawCamp = document.getElementById('utm-camp').value || "promo";

    // 1. RUN MANUAL GOVERNANCE FIRST (The guaranteed fallback)
    const s = govern(rawSrc, "direct");
    const m = govern(rawMed, "none");
    const c = govern(rawCamp, "promo");
    
    let finalSrc = s.val;
    let finalMed = m.val;
    let finalCamp = c.val;
    let log = s.label; // Default to "Mapped Platform ID", "Lowercased", etc.

    // 2. TRY AI (But don't rely on it)
    if (AI_ENABLED && SESSION_AI_KEY) {
        try {
            const prompt = `Source: ${rawSrc} -> ${finalSrc}. Medium: ${rawMed} -> ${finalMed}. 
                            Explain benefit in 5 words for WWT reporting. No quotes.`;
            
            const aiResponse = await callGemini(prompt);
            
            // Only update the log if the AI actually returned a successful string
            if (aiResponse && !aiResponse.includes("error")) {
                log = aiResponse.replace(/[".]/g, '').trim();
            }
        } catch (e) {
            console.log("AI Key/Network Error. Falling back to manual labels.");
            // We do nothing here! 'log' is already set to the manual 's.label'
        }
    }

    // 3. FINALIZE (This will work even if AI failed)
    const connector = rawUrl.includes('?') ? '&' : '?';
    const finalUrl = `${rawUrl}${connector}utm_source=${finalSrc}&utm_medium=${finalMed}&utm_campaign=${finalCamp}`;

    utmHistory.unshift({
        raw: `${rawSrc} / ${rawMed}`,
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

function runICP(key) {
    const data = icpDB[key];
    const resultArea = document.getElementById('icp-result');
    
    // Signals
    document.getElementById('icp-signals').innerHTML = data.signals.map(s => `
        <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <i data-lucide="activity" class="w-3 h-3 text-indigo-500"></i>
            <span class="text-xs text-slate-300 font-mono">${s}</span>
        </div>
    `).join('');

    // Profile
    document.getElementById('icp-title').innerText = data.title;
    document.getElementById('icp-industry').innerText = data.attributes.industry;
    document.getElementById('icp-tech').innerText = data.attributes.techStack;
    document.getElementById('icp-strategy').innerText = data.strategy;

    resultArea.classList.remove('hidden');
    lucide.createIcons();
}

function runRevenue(key) {
    const data = revenueDB[key];
    const resultArea = document.getElementById('rev-result');
    
    // Inject Timeline
    document.getElementById('rev-timeline').innerHTML = data.touches.map((t, i) => `
        <div class="flex items-start gap-4">
            <div class="flex flex-col items-center">
                <div class="w-8 h-8 rounded-full ${t.impact === 'Critical' ? 'bg-emerald-500' : 'bg-slate-800'} flex items-center justify-center text-[10px] font-bold text-white z-10">${i+1}</div>
                ${i < data.touches.length - 1 ? '<div class="w-0.5 h-10 bg-slate-800"></div>' : ''}
            </div>
            <div class="flex-1 bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                <div><p class="text-[9px] text-slate-500 font-bold uppercase">${t.date}</p><p class="text-white text-sm font-bold">${t.event}</p></div>
                <span class="text-[8px] font-black uppercase ${t.impact === 'Critical' ? 'text-emerald-400' : 'text-slate-500'}">${t.impact} Impact</span>
            </div>
        </div>
    `).join('');

    document.getElementById('rev-insight').innerText = data.insight;
    document.getElementById('rev-rec').innerText = data.recommendation;
    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function runEmailDraft() {
    const selector = document.getElementById('cms-page-selector');
    const key = selector.value;
    const data = emailDraftDB[key];
    const resultArea = document.getElementById('email-result');
    
    document.getElementById('eml-subject').innerText = data.draft.subject;
    document.getElementById('eml-body').innerText = data.draft.body;

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function toggleEmailEdit() {
    const body = document.getElementById('eml-body');
    const subject = document.getElementById('eml-subject');
    const indicator = document.getElementById('edit-indicator');
    const btnSpan = document.querySelector('#edit-toggle-btn span');
    const btnIcon = document.querySelector('#edit-toggle-btn i');

    const isEditing = body.contentEditable === "true";

    if (isEditing) {
        body.contentEditable = "false";
        subject.contentEditable = "false";
        indicator.classList.add('hidden');
        btnSpan.innerText = "Edit Content";
        body.classList.remove('bg-slate-900', 'border', 'border-blue-500/30');
    } else {
        body.contentEditable = "true";
        subject.contentEditable = "true";
        indicator.classList.remove('hidden');
        btnSpan.innerText = "Save Changes";
        body.classList.add('bg-slate-900', 'border', 'border-blue-500/30');
        body.focus();
    }
}

function simulatePush() {
    const btn = document.getElementById('push-btn');
    btn.innerHTML = `<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Syncing...`;
    lucide.createIcons();
    
    setTimeout(() => {
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-slate-800');
        btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> Synced to Marketo Asset #9921`;
        lucide.createIcons();
        alert("Success: Email draft has been pushed as a Local Asset to Marketo 'Q1_Sovereign_Campaign'.");
    }, 2000);
}

function runIndustryAnalysis(key) {
    const data = industryGapDB[key];
    const resultArea = document.getElementById('industry-result');
    
    document.getElementById('ind-gap').innerText = data.gap;
    document.getElementById('ind-trend').innerText = data.trend;
    document.getElementById('ind-opp').innerText = data.opportunity;
    document.getElementById('ind-title').innerText = data.outline.title;

    const sectionsHTML = data.outline.sections.map((s, i) => `
        <div class="flex gap-4 items-start">
            <span class="text-blue-500 font-mono text-sm font-bold">0${i+1}</span>
            <p class="text-slate-300 text-sm">${s}</p>
        </div>
    `).join('');
    
    document.getElementById('ind-sections').innerHTML = sectionsHTML;

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function runReadout(key) {
    const data = readoutDB[key];
    const resultArea = document.getElementById('readout-result');

    // Build Workstreams
    document.getElementById('readout-workstreams').innerHTML = data.workstreams.map(w => `
        <div class="flex items-start justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div>
                <h6 class="text-white font-bold text-sm">${w.name}</h6>
                <p class="text-xs text-slate-400 mt-1">${w.update}</p>
            </div>
            <span class="text-[8px] font-black px-2 py-1 rounded border ${w.status === 'At Risk' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'} uppercase">${w.status}</span>
        </div>
    `).join('');

    // Build Recs
    document.getElementById('readout-recs').innerHTML = data.recommendations.map(r => `
        <li class="flex items-start gap-3 text-xs text-slate-300">
            <i data-lucide="arrow-right-circle" class="w-4 h-4 text-indigo-500 flex-shrink-0"></i>
            <span>${r}</span>
        </li>
    `).join('');

    // Build Metrics
    document.getElementById('readout-metrics').innerHTML = `
        <div class="flex justify-between border-b border-indigo-400/30 pb-2"><span class="text-xs text-indigo-100">MQL Growth</span><span class="text-white font-bold">${data.metrics.mql_growth}</span></div>
        <div class="flex justify-between border-b border-indigo-400/30 pb-2"><span class="text-xs text-indigo-100">ATC Tours</span><span class="text-white font-bold">${data.metrics.atc_tours}</span></div>
        <div class="flex justify-between"><span class="text-xs text-indigo-100">Budget Spent</span><span class="text-white font-bold">${data.metrics.budget_utilization}</span></div>
    `;

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function clearStage() {
    document.getElementById('stage-placeholder').classList.remove('hidden');
    document.getElementById('stage-content').classList.add('hidden');
}

function copyLine(text, btn) {
    navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i>`;
    lucide.createIcons();
    setTimeout(() => { btn.innerHTML = original; lucide.createIcons(); }, 2000);
}

function clearStage() {
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('stage-placeholder').classList.remove('hidden');
}

window.onload = init;


















