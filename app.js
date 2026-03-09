const agents = [
    { 
    id: 'utm', 
    name: 'UTM Builder', 
    cat: 'Digital Campaigns', 
    icon: 'link', 
    desc: 'Standardize campaign tracking instantly.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Campaign Link Generator</h3>
            
            <div class="space-y-1">
                <label class="text-[10px] uppercase text-slate-500 font-bold">Base Destination URL</label>
                <input id="utm-url" type="text" placeholder="https://www.wwt.com/atc" 
                    class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-sm focus:border-blue-500 outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="text-[10px] uppercase text-slate-500 font-bold">Source</label>
                    <select id="utm-src" class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-sm outline-none">
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">X / Twitter</option>
                        <option value="newsletter">Email Newsletter</option>
                        <option value="partner">Partner Site</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] uppercase text-slate-500 font-bold">Medium</label>
                    <select id="utm-med" class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-sm outline-none">
                        <option value="social">Organic Social</option>
                        <option value="paid">Paid Advertising</option>
                        <option value="email">Direct Email</option>
                        <option value="referral">Referral</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-[10px] uppercase text-slate-500 font-bold">Campaign Name</label>
                <input id="utm-cam" type="text" placeholder="e.g. atc-workshop-2026" 
                    class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-sm outline-none">
            </div>

            <button onclick="runUTM()" class="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                Generate Standardized Link
            </button>

            <div id="utm-result-container" class="hidden space-y-2 animate-in fade-in slide-in-from-top-2">
                <label class="text-[10px] uppercase text-green-500 font-bold">Ready to use:</label>
                <div class="flex gap-2">
                    <div id="utm-result" class="flex-1 p-3 bg-black/50 border border-green-900/30 rounded text-green-400 font-mono text-[11px] break-all"></div>
                    <button onclick="copyUTM()" class="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 text-white">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `
},
    { 
    id: 'intel', 
    name: 'Competitive Intel', 
    cat: 'Brand/ATC/Services', 
    icon: 'shield', 
    desc: 'Live signals from CDW, Presidio, and Accenture.',
    demo: `
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">Rival Signal Feed</h3>
                <span class="animate-pulse flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Live
                </span>
            </div>
            
            <div class="flex flex-wrap gap-2" id="rival-filters">
                <button onclick="fetchLiveNews('Accenture')" class="text-[10px] px-2 py-1 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 text-slate-300">Accenture</button>
                <button onclick="fetchLiveNews('CDW')" class="text-[10px] px-2 py-1 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 text-slate-300">CDW</button>
                <button onclick="fetchLiveNews('Presidio')" class="text-[10px] px-2 py-1 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 text-slate-300">Presidio</button>
                <button onclick="fetchLiveNews('Insight Enterprises')" class="text-[10px] px-2 py-1 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 text-slate-300">Insight</button>
            </div>

            <div id="intel-feed" class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div class="p-8 text-center text-slate-500 text-xs italic">
                    Select a rival above to scan market signals...
                </div>
            </div>
        </div>
    `
},
    { 
    id: 'seo', 
    name: 'SEO Search Agent', 
    cat: 'Growth/Search', 
    icon: 'search', 
    desc: 'Analyzing 2026 search trends and Answer Engine visibility.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">2026 Search Intelligence</h3>
            
            <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Top Intent Pillar</p>
                    <p class="text-sm text-blue-400 font-bold">Cloud 3.0 & GPU-as-a-Service</p>
                </div>
                <div class="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Search Mode</p>
                    <p class="text-sm text-green-400 font-bold">Conversational / Agentic</p>
                </div>
            </div>

            <div class="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <p class="text-xs text-slate-300 mb-3">Trending "WWT vs Rivals" Queries:</p>
                <ul class="space-y-2" id="seo-trends">
                    <li class="flex justify-between items-center text-[11px]">
                        <span class="text-slate-400">"WWT ATC labs vs CDW solution center"</span>
                        <span class="text-green-500">+140% 📈</span>
                    </li>
                    <li class="flex justify-between items-center text-[11px]">
                        <span class="text-slate-400">"Accenture agentic AI vs WWT custom models"</span>
                        <span class="text-green-500">+85% 📈</span>
                    </li>
                </ul>
            </div>

            <button onclick="runSEOScan()" class="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs transition-colors">
                Generate Content Strategy
            </button>
            <div id="seo-output" class="text-[10px] text-slate-400 italic"></div>
        </div>
    `
},
   { 
    id: 'icp', 
    name: 'ICP Agent', 
    cat: 'Portfolio Marketing', 
    icon: 'users', 
    desc: 'Map the 2026 buying committee for WWT verticals.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Target Persona Mapper</h3>
            
            <div class="space-y-1">
                <label class="text-[10px] uppercase text-slate-500 font-bold">Select Industry Vertical</label>
                <select id="icp-industry" class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500">
                    <option value="Healthcare">Healthcare & Life Sciences</option>
                    <option value="Finance">Financial Services (FSI)</option>
                    <option value="Manufacturing">Smart Manufacturing / Industry 4.0</option>
                    <option value="Public Sector">Public Sector / Federal</option>
                </select>
            </div>

            <button onclick="runICP()" class="w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="users" class="w-4 h-4"></i>
                Identify Buying Committee
            </button>

            <div id="icp-result" class="space-y-2 hidden animate-in fade-in slide-in-from-bottom-2">
                </div>
        </div>
    `
},
    { 
    id: 'industry', 
    name: 'Industry Content', 
    cat: 'Portfolio Marketing', 
    icon: 'file-text', 
    desc: 'Generate ATC-validated executive briefs for specific verticals.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Executive Brief Drafter</h3>
            
            <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                    <label class="text-[10px] uppercase text-slate-500 font-bold">Topic</label>
                    <select id="content-topic" class="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs outline-none">
                        <option>Generative AI Governance</option>
                        <option>Sustainable Data Centers</option>
                        <option>Zero Trust Architecture</option>
                        <option>Private 5G Deployment</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="text-[10px] uppercase text-slate-500 font-bold">Target Persona</label>
                    <select id="content-persona" class="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs outline-none">
                        <option>C-Level Executive</option>
                        <option>Technical Architect</option>
                        <option>Operations Director</option>
                    </select>
                </div>
            </div>

            <button onclick="runContent()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="pen-tool" class="w-4 h-4"></i>
                Draft Executive Brief
            </button>

            <div id="content-output" class="hidden animate-in zoom-in-95 duration-300">
                <div class="bg-white p-6 rounded shadow-inner h-64 overflow-y-auto text-slate-900 font-serif leading-relaxed relative">
                    <div id="brief-text" class="text-[11px]"></div>
                    <div class="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                </div>
                <button onclick="copyBrief()" class="mt-2 w-full text-[10px] text-slate-500 hover:text-emerald-400 flex items-center justify-center gap-1">
                    <i data-lucide="copy" class="w-3 h-3"></i> Copy Draft to Clipboard
                </button>
            </div>
        </div>
    `
},
    { 
    id: 'revenue', 
    name: 'Marketing-to-Revenue', 
    cat: 'Portfolio Marketing', 
    icon: 'trending-up', 
    desc: 'Link campaign activity to Salesforce pipeline and closed-won deals.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Revenue Attribution Model</h3>
            
            <div id="drop-zone" class="p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 text-center group hover:border-blue-500 transition-all">
                <i data-lucide="upload-cloud" class="mx-auto mb-2 text-slate-500 group-hover:text-blue-400"></i>
                <p class="text-[10px] text-slate-400">Drag & Drop Salesforce Export (.csv)</p>
                <p class="text-[9px] text-slate-600 uppercase mt-1">or click to browse</p>
            </div>

            <button onclick="simulateRevenue()" class="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
                Analyze Pipeline Impact
            </li>

            <div id="rev-analysis" class="hidden space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div class="grid grid-cols-2 gap-2">
                    <div class="bg-slate-800 p-3 rounded border border-slate-700">
                        <p class="text-[9px] text-slate-500 uppercase">Marketing-Influenced</p>
                        <p class="text-lg font-bold text-green-400">$4.2M</p>
                    </div>
                    <div class="bg-slate-800 p-3 rounded border border-slate-700">
                        <p class="text-[9px] text-slate-500 uppercase">Conversion Lift</p>
                        <p class="text-lg font-bold text-blue-400">+22%</p>
                    </div>
                </div>
                
                <div class="h-32 bg-slate-900 border border-slate-800 rounded flex items-end justify-around p-4 gap-2">
                    <div class="w-full bg-blue-900/40 h-[40%] rounded-t-sm relative group">
                        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Awareness</div>
                    </div>
                    <div class="w-full bg-blue-700/60 h-[65%] rounded-t-sm relative group">
                        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">ATC Discovery</div>
                    </div>
                    <div class="w-full bg-blue-500 h-[85%] rounded-t-sm relative group">
                        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">POC Stage</div>
                    </div>
                    <div class="w-full bg-green-500 h-full rounded-t-sm relative group">
                        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Closed Won</div>
                    </div>
                </div>
            </div>
        </div>
    `
},
    { 
    id: 'email', 
    name: 'Email Marketing', 
    cat: 'Digital Campaigns', 
    icon: 'mail', 
    desc: 'Professionalize campaign copy with WWT brand alignment.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">WWT Tone Optimizer</h3>
            
            <div class="space-y-1">
                <label class="text-[10px] uppercase text-slate-500 font-bold">Input: Rough Concept / Bullet Points</label>
                <textarea id="email-raw" class="w-full h-24 bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-xs outline-none focus:border-blue-500" 
                    placeholder="e.g. follow up on Cisco lab, mention 10% discount for Q3, invite to ATC..."></textarea>
            </div>

            <div class="flex gap-2">
                <button onclick="runAIEmail()" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-xs">
                    <i data-lucide="sparkles" class="w-3 h-3"></i> Professionalize (AI)
                </button>
            </div>

            <div id="email-result-container" class="hidden animate-in fade-in zoom-in-95">
                <label class="text-[10px] uppercase text-blue-400 font-bold">Optimized Draft:</label>
                <div id="email-result" class="mt-1 p-4 bg-white text-slate-800 rounded-lg text-[11px] leading-relaxed font-serif shadow-xl min-h-[100px] whitespace-pre-wrap"></div>
                <button onclick="copyEmail()" class="mt-2 w-full text-[9px] text-slate-500 hover:text-blue-400 flex items-center justify-center gap-1">
                    <i data-lucide="copy" class="w-3 h-3"></i> Copy to Clipboard
                </button>
            </div>
        </div>
    `
},
    { 
    id: 'reporting', 
    name: 'Reporting Perf', 
    cat: 'Portfolio Marketing', 
    icon: 'bar-chart-2', 
    desc: 'Real-time campaign health and CPL tracking.',
    demo: `
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">Campaign Health Pulse</h3>
                <span class="text-[10px] text-slate-500 font-mono">ID: WWT-MAR-2026</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2">
                <div class="bg-slate-900 border border-slate-800 p-2 rounded-lg text-center">
                    <p class="text-[9px] text-slate-500 uppercase">MQLs</p>
                    <p class="text-lg font-bold text-white">842</p>
                    <p class="text-[8px] text-green-400 font-bold">+12.4%</p>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-2 rounded-lg text-center">
                    <p class="text-[9px] text-slate-500 uppercase">Avg CPL</p>
                    <p class="text-lg font-bold text-white">$18.40</p>
                    <p class="text-[8px] text-blue-400 font-bold">-5.1%</p>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-2 rounded-lg text-center">
                    <p class="text-[9px] text-slate-500 uppercase">Conv. Rate</p>
                    <p class="text-lg font-bold text-white">3.2%</p>
                    <p class="text-[8px] text-slate-500 font-bold">Stable</p>
                </div>
            </div>

            <div class="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="zap" class="w-3 h-3 text-blue-400"></i>
                    <span class="text-[10px] font-bold text-blue-400 uppercase tracking-tight">AI Diagnostic Signal</span>
                </div>
                <p id="report-insight" class="text-[10px] text-slate-300 leading-tight">
                    Performance is currently exceeding Q1 benchmarks. LinkedIn Sponsored Content (ATC Focus) is driving 60% of high-intent conversions.
                </p>
            </div>

            <button onclick="refreshReport()" class="w-full py-2 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold tracking-widest transition-all">
                Sync with Marketing Cloud
            </button>
        </div>
    `
},
    { 
    id: 'readout', 
    name: 'Readout + Rec', 
    cat: 'Portfolio Marketing', 
    icon: 'presentation', 
    desc: 'Automate executive-ready PPT summaries and lab recommendations.',
    demo: `
        <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">Executive Slide Generator</h3>
            
            <div class="space-y-1">
                <label class="text-[10px] uppercase text-slate-500 font-bold">Project Name / Campaign Title</label>
                <input id="readout-title" type="text" placeholder="e.g. FY26 Q1 AI Infrastructure Campaign" 
                    class="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-xs outline-none focus:border-blue-500">
            </div>

            <button onclick="runReadout()" class="w-full bg-slate-100 hover:bg-white text-slate-900 p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                <i data-lucide="layout-template" class="w-4 h-4"></i>
                Synthesize Executive Slide
            </button>

            <div id="slide-preview" class="hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div class="aspect-video bg-white border-4 border-slate-200 p-6 text-slate-800 shadow-2xl rounded relative overflow-hidden">
                    <div class="absolute top-0 left-0 right-0 h-10 bg-[#004a99] flex items-center px-4 justify-between">
                        <span class="text-white text-[10px] font-bold uppercase tracking-widest">WWT Strategic Readout</span>
                        <div class="w-12 h-4 bg-white/20 rounded"></div>
                    </div>
                    
                    <div class="mt-8">
                        <h4 id="slide-title-text" class="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4">Project Summary</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-3">
                                <div class="p-2 bg-slate-50 rounded">
                                    <p class="text-[8px] text-slate-500 uppercase font-bold">Key Achievement</p>
                                    <p class="text-[10px] font-medium">Validated Multi-Cloud AI Architecture via ATC Labs.</p>
                                </div>
                                <div class="p-2 bg-slate-50 rounded">
                                    <p class="text-[8px] text-slate-500 uppercase font-bold">Pipeline Impact</p>
                                    <p class="text-[10px] font-medium">$2.4M identified across 3 target verticals.</p>
                                </div>
                            </div>
                            <div class="bg-blue-50 p-3 rounded border border-blue-100">
                                <p class="text-[8px] text-blue-800 uppercase font-bold mb-1">Strategic Recommendation</p>
                                <ul class="text-[9px] text-slate-700 space-y-1 list-disc ml-3">
                                    <li>Pivot toward "Edge-Inference" messaging.</li>
                                    <li>Schedule 3 Cisco/Dell joint webinars.</li>
                                    <li>Refresh ATC Lab sandbox for Q2.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="mt-4 w-full py-2 border border-dashed border-slate-700 text-slate-500 text-[10px] uppercase font-bold hover:text-white transition-colors">
                    Download .pptx (Simulated Export)
                </button>
            </div>
        </div>
    `
},
];

// Initialize Dashboard
function init() {
    const grid = document.getElementById('agent-grid');
    grid.innerHTML = agents.map(agent => `
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-blue-600/20 rounded-lg text-blue-400">
                        <i data-lucide="${agent.icon || 'zap'}"></i>
                    </div>
                    <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">${agent.cat}</span>
                </div>
                <h3 class="text-lg font-bold text-white">${agent.name}</h3>
                <p class="text-sm text-slate-400 mt-2 line-clamp-2">${agent.desc}</p>
            </div>
            <button onclick="openModal('${agent.id}')" class="mt-6 w-full py-2 border border-slate-700 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition">
                Launch Agent
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

// Modal Logic
// Corrected Modal Logic to handle titles and icons
// --- WORKSPACE LOGIC: Launching into the TOP STAGE ---
function launchAgent(id) {
    const agent = agents.find(a => a.id === id);
    const stagePlaceholder = document.getElementById('stage-placeholder');
    const stageContent = document.getElementById('stage-content');
    const stageWrapper = document.getElementById('action-stage');

    // 1. UI Transition: Hide placeholder, show content area
    stagePlaceholder.classList.add('hidden');
    stageContent.classList.remove('hidden');
    stageWrapper.classList.add('active', 'ring-2', 'ring-blue-500/20');

    // 2. Inject the Agent UI into the Stage
    stageContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div class="flex-1">
                <div class="mb-4 flex items-center gap-3">
                    <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <i data-lucide="${agent.icon}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">${agent.cat}</span>
                        <h3 class="text-lg font-bold text-[#566a7f]">${agent.name}</h3>
                    </div>
                </div>
                <div class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                    ${agent.demo}
                </div>
            </div>
        </div>
    `;

    // 3. Re-run Lucide to render icons inside the new HTML
    lucide.createIcons();

    // 4. Special Handlers (RSS Feed for Intel or UTM logic)
    if(id === 'intel') fetchLiveNews();
    
    // 5. Scroll to top so the user sees the active tool immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearStage() {
    document.getElementById('stage-placeholder').classList.remove('hidden');
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('action-stage').classList.remove('active', 'ring-2', 'ring-blue-500/20');
}

// --- GRID LOGIC: The 5 + 4 Switchboard ---
function initSneatDashboard() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;

    grid.innerHTML = agents.map((agent, index) => {
        // Force the 6th agent to start a new row on desktop (5-col grid)
        // and center the bottom row by using col-start
        let gridClasses = "card p-4 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-50 border border-transparent hover:border-blue-100 w-full min-w-[140px]";
        
        if (index === 5) {
            // This moves the 6th agent to the first column of the second row
            // On a 5-column grid, we can offset it by 1 to center the row of 4
            gridClasses += " md:col-start-1 lg:col-start-1"; 
        }

        return `
            <div class="${gridClasses}" onclick="launchAgent('${agent.id}')">
                <div class="w-12 h-12 mb-3 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-[#004a99] group-hover:text-white transition-all duration-300">
                    <i data-lucide="${agent.icon}" class="w-6 h-6"></i>
                </div>
                <h4 class="text-[10px] font-bold text-[#566a7f] uppercase tracking-tighter leading-tight">${agent.name}</h4>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Start the Dashboard on load
document.addEventListener('DOMContentLoaded', initSneatDashboard);

// --- LOGIC ENGINES ---

// 1. UTM Builder
function runUTM() {
     url = document.getElementById('utm-url').value || 'https://wwt.com/atc';
     src = document.getElementById('utm-src').value || 'linkedin';
     med = document.getElementById('utm-med').value || 'social';
     result = `${url}?utm_source=${src}&utm_medium=${med}&utm_campaign=wwt_agent_demo`;
     box = document.getElementById('utm-result');
    box.innerText = result;
    box.classList.remove('hidden');
}

// 2. Competitive Intel (LIVE RSS)
async function fetchLiveNews(company = 'Accenture') {
    const feed = document.getElementById('intel-feed');
    feed.innerHTML = `<div class="p-4 text-center animate-pulse text-blue-400 text-xs">Scanning signals for ${company}...</div>`;
    
    // We target tech-specific news for the competitor
    const query = encodeURIComponent(`${company} technology news`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            feed.innerHTML = `<div class="p-4 text-slate-500 text-xs text-center">No recent signals detected for ${company}.</div>`;
            return;
        }

        feed.innerHTML = data.items.slice(0, 5).map(item => {
            // Randomly assign a 'threat level' for the UI demo feel
            const levels = ['Low', 'Medium', 'High'];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const color = level === 'High' ? 'text-red-400' : level === 'Medium' ? 'text-orange-400' : 'text-blue-400';

            return `
                <div class="p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-blue-500/50 transition-all group">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">${company}</span>
                        <span class="text-[9px] font-bold uppercase ${color}">${level} Threat</span>
                    </div>
                    <p class="text-xs text-white font-medium line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors">${item.title}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] text-slate-500">${new Date(item.pubDate).toLocaleDateString()}</span>
                        <a href="${item.link}" target="_blank" class="text-[9px] text-blue-500 hover:underline">Full Report →</a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        feed.innerHTML = `<div class="p-4 text-red-400 text-xs text-center">Intelligence stream offline. Check connection.</div>`;
    }
}

// 3. SEO Scraper (LIVE Google Suggestions)
async function runSEO() {
    const query = document.getElementById('seo-query').value;
    const resDiv = document.getElementById('seo-results');
    resDiv.innerHTML = "Querying Search Index...";
    try {
        const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`);
        const data = await response.json();
        resDiv.innerHTML = data[1].length > 0 ? data[1].map(term => `<div>🔍 ${term}</div>`).join('') : "No live data found.";
    } catch (e) {
        resDiv.innerHTML = "Connect error. Proxy-bypass required for live scrape.";
    }
}

// 4. ICP Persona Mapper
function runICP() {
    const industry = document.getElementById('icp-industry').value;
    const resDiv = document.getElementById('icp-result');
    resDiv.classList.remove('hidden');
    const roles = {
        'Healthcare': ['Chief Medical Officer', 'Head of Clinical IT', 'Healthcare Security Architect'],
        'Finance': ['Chief Risk Officer', 'Director of Fintech Ops', 'Cloud Compliance Lead'],
        'Public Sector': ['Mission Systems Lead', 'Agency CTO', 'Cyber Operations Director']
    };
    resDiv.innerHTML = roles[industry].map(role => `
        <div class="bg-slate-800 p-2 rounded text-xs border border-purple-500/30 flex justify-between">
            <span>${role}</span>
            <span class="text-purple-400 text-[10px]">High Intent</span>
        </div>
    `).join('');
}

// 5. Content Drafter
function runContent() {
    const topic = document.getElementById('content-topic').value;
    const output = document.getElementById('content-output');
    output.classList.remove('hidden');
    output.innerHTML = `
        <h4 class="font-bold border-b border-slate-300 mb-2 pb-1 text-blue-900 uppercase">WWT Executive Report: ${topic}</h4>
        <p class="mb-2"><b>Overview:</b> As enterprises scale their digital footprint, ${topic} has become the primary bottleneck for operational efficiency. Without lab-validated architectures, the risk of technical debt remains high.</p>
        <p class="mb-2"><b>Strategy:</b> WWT recommends an "Outcome-First" approach, utilizing the Advanced Technology Center (ATC) to bench-test performance before capital expenditure.</p>
        <p class="mb-2"><b>Next Steps:</b> (1) Current State Assessment (2) ATC Lab Workshop (3) Vendor Comparison Matrix.</p>
    `;
}

// 6. Email Tone Optimizer
function runEmail() {
    const raw = document.getElementById('email-raw').value;
    const out = document.getElementById('email-result');
    out.classList.remove('hidden');
    out.innerText = `Subject: Strategic Approach to ${raw.split(' ').slice(0,3).join(' ') || 'Our Next Initiative'} \n\nHi Team, I've been reviewing our approach to ${raw || 'this project'} and believe we can leverage our ATC insights to streamline the rollout. Let's discuss a formal alignment...`;
}

// 7. Revenue Simulator
function simulateRevenue() {
    document.getElementById('rev-chart').classList.remove('hidden');
}

init();

// Replace this with your actual key for testing, 
// but DON'T commit the key to a public GitHub repo! 
// Use a text input in the UI for the demo instead.
const GOOGLE_AI_KEY = "REPLACE_ME_WITH_KEY"; 

async function runAIEmail() {
    const rawContent = document.getElementById('email-raw').value;
    const resultDiv = document.getElementById('email-result');
    
    if (!GOOGLE_AI_KEY) {
        GOOGLE_AI_KEY = prompt("Please enter your Gemini API Key for the Live AI Demo:");
        if (!GOOGLE_AI_KEY) return;
    }

    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = "<span class='animate-pulse text-blue-600'>Gemini is thinking...</span>";

    const promptText = `You are a Marketing Director at WWT (World Wide Technology). 
    Convert these rough notes into a professional, persuasive email for our partners. 
    Notes: ${rawContent} 
    Include a mention of our Advanced Technology Center (ATC).`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        resultDiv.innerText = aiText;
    } catch (e) {
        resultDiv.innerText = "Error: Make sure your API key is valid!";
    }

}

// 1. UTM Builder Logic
function runUTM() {
    const url = document.getElementById('utm-url').value || 'https://wwt.com/atc';
    const src = document.getElementById('utm-src').value;
    const med = document.getElementById('utm-med').value;
    const cam = document.getElementById('utm-cam').value || 'agent-demo';
    
    // Clean URL and build params
    const cleanUrl = url.split('?')[0];
    const result = `${cleanUrl}?utm_source=${src}&utm_medium=${med}&utm_campaign=${cam.replace(/\s+/g, '-').toLowerCase()}`;
    
    const box = document.getElementById('utm-result');
    const container = document.getElementById('utm-result-container');
    
    box.innerText = result;
    container.classList.remove('hidden');
    lucide.createIcons(); // Re-render icons for the copy button
}

function copyUTM() {
    const text = document.getElementById('utm-result').innerText;
    navigator.clipboard.writeText(text);
    
    // Visual feedback for the copy
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-green-400"></i>';
    lucide.createIcons();
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        lucide.createIcons();
    }, 2000);
}

function runSEOScan() {
    const output = document.getElementById('seo-output');
    output.innerHTML = "Scanning LLM citation frequency...";
    
    setTimeout(() => {
        output.innerHTML = `
            <div class="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-slate-200">
                <strong>💡 Content Strategy Recommendation:</strong><br>
                Create a "White Paper" titled: <span class="text-blue-300 italic">"The FinOps of AI Inference: Scaling Beyond the Public Cloud."</span><br><br>
                <em>Why:</em> Search intent for "AI token cost optimization" is rising across CIO demographics in March 2026.
            </div>
        `;
    }, 1500);
}

function runICP() {
    const industry = document.getElementById('icp-industry').value;
    const resDiv = document.getElementById('icp-result');
    resDiv.classList.remove('hidden');
    
    const committees = {
        'Healthcare': [
            { role: 'Chief Medical AI Officer', pain: 'Model Bias & Patient Privacy', driver: 'ATC Lab Validation' },
            { role: 'VP of Clinical Infrastructure', pain: 'Legacy EHR Latency', driver: 'Edge Computing' },
            { role: 'Head of Bio-Informatics', pain: 'Genomics Data Silos', driver: 'High-Perf Storage' }
        ],
        'Finance': [
            { role: 'Head of Algorithmic Risk', pain: 'Real-time Fraud Latency', driver: 'Low-Latency Networking' },
            { role: 'Chief Sustainability Officer', pain: 'Data Center Energy Carbon', driver: 'Liquid Cooling (ATC)' },
            { role: 'Director of Fintech Ops', pain: 'Cloud Sovereignty', driver: 'Hybrid Cloud Strategy' }
        ],
        'Manufacturing': [
            { role: 'Director of Digital Twins', pain: 'OT/IT Convergence Gaps', driver: 'Industrial IoT' },
            { role: 'VP of Supply Chain AI', pain: 'Predictive Accuracy', driver: 'Advanced Analytics' },
            { role: 'Smart Factory Lead', pain: 'Private 5G Reliability', driver: 'Wireless Engineering' }
        ],
        'Public Sector': [
            { role: 'Agency Chief Data Scientist', pain: 'Sovereign AI Compliance', driver: 'FedRAMP Solutions' },
            { role: 'Mission Systems Lead', pain: 'Edge Intelligence at Sea/Field', driver: 'Ruggedized Compute' },
            { role: 'Cyber Ops Director', pain: 'Zero Trust Maturity', driver: 'Security Architecture' }
        ]
    };

    resDiv.innerHTML = committees[industry].map(p => `
        <div class="bg-slate-900/80 border border-purple-500/20 p-3 rounded-lg hover:border-purple-500/50 transition-colors">
            <div class="flex justify-between items-start mb-1">
                <span class="text-xs font-bold text-white">${p.role}</span>
                <span class="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded uppercase">High Influence</span>
            </div>
            <p class="text-[10px] text-slate-400"><span class="text-slate-500 italic font-semibold">Pain Point:</span> ${p.pain}</p>
            <p class="text-[10px] text-purple-300 mt-1 font-mono"><span class="text-slate-500">WWT Lever:</span> ${p.driver}</p>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function runContent() {
    const topic = document.getElementById('content-topic').value;
    const persona = document.getElementById('content-persona').value;
    const outputContainer = document.getElementById('content-output');
    const briefText = document.getElementById('brief-text');
    
    outputContainer.classList.remove('hidden');
    briefText.innerHTML = `<p class="animate-pulse text-slate-400">Structuring narrative for ${persona}...</p>`;

    setTimeout(() => {
        const hooks = {
            'C-Level Executive': `Focusing on ROI, market speed, and risk mitigation.`,
            'Technical Architect': `Focusing on integration complexity, scalability, and API standards.`,
            'Operations Director': `Focusing on uptime, resource allocation, and lifecycle management.`
        };

        briefText.innerHTML = `
            <div class="border-b-2 border-emerald-800 mb-4 pb-2">
                <h4 class="text-lg font-bold text-slate-900">STRATEGIC BRIEF: ${topic.toUpperCase()}</h4>
                <p class="text-[9px] text-slate-500 uppercase tracking-widest font-sans">Prepared for: ${persona} • 2026 Internal Draft</p>
            </div>
            <p class="mb-3"><strong>The Challenge:</strong> In the 2026 landscape, ${topic} is no longer a technical choice but a business imperative. ${hooks[persona]}</p>
            <p class="mb-3"><strong>The WWT Approach:</strong> We leverage the Advanced Technology Center (ATC) to bypass the "theory phase." By virtualizing your specific environment, we validate ${topic} across multi-vendor ecosystems before a single dollar of CAPEX is committed.</p>
            <div class="bg-slate-50 p-3 border-l-4 border-emerald-500 mb-3">
                <p class="italic text-slate-700">"The ATC allows us to simulate 1.5 million+ configurations, ensuring that ${topic} scales without breaking legacy dependencies."</p>
            </div>
            <p class="mb-3"><strong>Outcome:</strong> A reduction in deployment risk by 40% and a 2x acceleration in time-to-value for enterprise stakeholders.</p>
            <p><strong>Next Steps:</strong> Schedule a 2-hour ATC Discovery Workshop to map your current architecture against these validated patterns.</p>
        `;
        lucide.createIcons();
    }, 1000);
}

function simulateRevenue() {
    const dropZone = document.getElementById('drop-zone');
    const analysis = document.getElementById('rev-analysis');
    
    dropZone.innerHTML = `
        <div class="flex items-center justify-center gap-2 text-blue-400 animate-pulse">
            <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
            <span class="text-xs font-bold">Mapping Leads to Opportunities...</span>
        </div>
    `;
    lucide.createIcons();

    setTimeout(() => {
        dropZone.classList.add('hidden');
        analysis.classList.remove('hidden');
        lucide.createIcons();
    }, 1800);
}

function refreshReport() {
    const insight = document.getElementById('report-insight');
    insight.innerHTML = `<span class="animate-pulse">Fetching latest telemetry from WWT-Cloud...</span>`;
    
    setTimeout(() => {
        const insights = [
            "Signal Alert: 'Hybrid Cloud' campaign creative is reaching saturation. Recommend pivot to 'Liquid Cooling' assets.",
            "Efficiency Gain: CPL has dropped below $20 for the first time this quarter due to better ICP targeting.",
            "Channel Shift: Organic search citations for 'ATC Labs' are up 40%. Direct traffic is our strongest lead source today."
        ];
        insight.innerText = insights[Math.floor(Math.random() * insights.length)];
    }, 1500);
}

async function runAIEmail() {
    const rawContent = document.getElementById('email-raw').value;
    const container = document.getElementById('email-result-container');
    const resultDiv = document.getElementById('email-result');
    
    if (!rawContent) return alert("Please enter some notes first!");

    container.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="flex items-center gap-2 text-blue-600 italic">
            <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
            Applying WWT Brand Voice...
        </div>
    `;
    lucide.createIcons();

    // The Prompt for Gemini
    const promptText = `You are a Senior Marketing Manager at WWT (World Wide Technology). 
    Convert these rough notes into a professional, persuasive, and warm email for an enterprise client.
    Notes: "${rawContent}"
    Brand Constraints: 
    - Mention the Advanced Technology Center (ATC) as a key differentiator.
    - Professional but not stiff. 
    - Focused on outcomes and partnership.
    - Do not use placeholders like [Your Name]. Just provide the body text.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        resultDiv.innerText = aiText;
    } catch (e) {
        resultDiv.innerHTML = "<span class='text-red-500'>Error: AI connection failed. Check your API Key or Secret Injection.</span>";
    }
}

function copyEmail() {
    const text = document.getElementById('email-result').innerText;
    navigator.clipboard.writeText(text);
    alert("Draft copied!");
}

function runReadout() {
    const titleInput = document.getElementById('readout-title').value || "Strategic Campaign Summary";
    const slide = document.getElementById('slide-preview');
    const slideTitle = document.getElementById('slide-title-text');
    
    // Simulate data crunching
    slideTitle.innerText = titleInput;
    slide.classList.remove('hidden');
    lucide.createIcons();
}



