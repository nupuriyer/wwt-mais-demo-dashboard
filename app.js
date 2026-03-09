const agents = [
    { 
        id: 'utm', 
        name: 'UTM Builder', 
        cat: 'Digital Campaigns', 
        icon: 'link', 
        desc: 'Standardize campaign tracking instantly.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Live UTM Generator</h3>
                <input id="utm-url" type="text" placeholder="Base URL (e.g. wwt.com/atc)" class="w-full bg-slate-800 border-slate-700 p-2 rounded text-white">
                <div class="grid grid-cols-2 gap-2">
                    <input id="utm-src" type="text" placeholder="Source" class="bg-slate-800 border-slate-700 p-2 rounded text-white">
                    <input id="utm-med" type="text" placeholder="Medium" class="bg-slate-800 border-slate-700 p-2 rounded text-white">
                </div>
                <button onclick="runUTM()" class="w-full bg-blue-600 p-2 rounded font-bold hover:bg-blue-500">Generate Link</button>
                <div id="utm-result" class="p-3 bg-black rounded text-green-400 font-mono text-xs break-all hidden"></div>
            </div>
        `
    },
    { 
        id: 'intel', 
        name: 'Competitive Intel', 
        cat: 'Brand/ATC/Services', 
        icon: 'shield', 
        desc: 'Live signals from WWT rivals.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Rival Signal Feed</h3>
                <p class="text-xs text-slate-400 italic">Scanning: Accenture, Dell, HPE, Cisco...</p>
                <div id="intel-feed" class="space-y-2 max-h-60 overflow-y-auto">
                    <div class="p-2 border-l-2 border-blue-500 bg-slate-800 text-sm italic">Accessing market wires...</div>
                </div>
                <button onclick="fetchLiveNews()" class="text-xs text-blue-400 underline">Refresh Feed</button>
            </div>
        `
    },
    { 
        id: 'seo', 
        name: 'SEO Search Agent', 
        cat: 'Marketing Ops', 
        icon: 'search', 
        desc: 'Pull real-time search trends.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">SEO Trend Scraper</h3>
                <div class="flex gap-2">
                    <input id="seo-query" type="text" value="World Wide Technology" class="flex-1 bg-slate-800 border-slate-700 p-2 rounded text-white">
                    <button onclick="runSEO()" class="bg-blue-600 px-4 rounded text-sm hover:bg-blue-500">Scrape</button>
                </div>
                <div id="seo-results" class="space-y-1 text-sm text-blue-300 font-mono bg-black p-3 rounded min-h-[100px]">Enter a keyword to see live Google trends...</div>
            </div>
        `
    },
    { 
        id: 'icp', 
        name: 'ICP Agent', 
        cat: 'Portfolio Marketing', 
        icon: 'users', 
        desc: 'Target profile identification.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Target Persona Mapper</h3>
                <select id="icp-industry" class="w-full bg-slate-800 border-slate-700 p-2 rounded text-white">
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Financial Services</option>
                    <option value="Public Sector">Public Sector / Federal</option>
                </select>
                <button onclick="runICP()" class="w-full bg-purple-600 p-2 rounded font-bold hover:bg-purple-500">Map Buying Committee</button>
                <div id="icp-result" class="grid grid-cols-1 gap-2 hidden"></div>
            </div>
        `
    },
    { 
        id: 'industry', 
        name: 'Industry Content', 
        cat: 'Portfolio Marketing', 
        icon: 'file-text', 
        desc: 'Accelerate content drafts.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">WWT Content Drafter</h3>
                <select id="content-topic" class="w-full bg-slate-800 border-slate-700 p-2 rounded text-white">
                    <option>Multi-Cloud Strategy</option>
                    <option>AI at the Edge</option>
                    <option>Cyber Resilience</option>
                    <option>ATC Lab Validation</option>
                </select>
                <button onclick="runContent()" class="w-full bg-green-600 p-2 rounded font-bold hover:bg-green-500">Draft Executive Brief</button>
                <div id="content-output" class="p-4 bg-white text-slate-900 text-[10px] rounded shadow-inner hidden h-48 overflow-y-auto font-serif"></div>
            </div>
        `
    },
    { 
        id: 'revenue', 
        name: 'Marketing-to-Revenue', 
        cat: 'Portfolio Marketing', 
        icon: 'trending-up', 
        desc: 'Link activity to pipeline.',
        demo: `
            <div class="space-y-4 text-center">
                <h3 class="text-xl font-bold">Revenue Impact Modeling</h3>
                <div class="p-6 border-2 border-dashed border-slate-700 rounded-xl">
                    <i data-lucide="upload-cloud" class="mx-auto mb-2 text-slate-500"></i>
                    <p class="text-xs text-slate-400">Drag & Drop Salesforce Export (.csv)</p>
                </div>
                <button onclick="simulateRevenue()" class="w-full bg-blue-600 p-2 rounded font-bold">Process Sample Data</button>
                <div id="rev-chart" class="h-32 bg-slate-800 rounded flex items-end justify-around p-2 hidden">
                    <div class="w-8 bg-blue-500 h-1/2"></div><div class="w-8 bg-blue-400 h-3/4"></div><div class="w-8 bg-blue-300 h-full"></div>
                </div>
            </div>
        `
    },
    { 
        id: 'email', 
        name: 'Email Marketing', 
        cat: 'Digital Campaigns', 
        icon: 'mail', 
        desc: 'AI-assisted copy consistency.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Tone Optimizer</h3>
                <textarea id="email-raw" class="w-auto h-24 bg-slate-800 border-slate-700 p-2 rounded text-white text-xs w-full" placeholder="Paste rough notes here..."></textarea>
                <button onclick="runEmail()" class="w-full bg-blue-600 p-2 rounded font-bold">Professionalize</button>
                <div id="email-result" class="p-3 bg-slate-100 text-slate-800 rounded text-xs hidden italic"></div>
            </div>
        `
    },
    { 
        id: 'reporting', 
        name: 'Reporting Perf', 
        cat: 'Portfolio Marketing', 
        icon: 'bar-chart-2', 
        desc: 'Revenue-centric visualization.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Campaign Health readout</h3>
                <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="bg-slate-800 p-2 rounded"><p class="text-[10px] text-slate-500">MQLs</p><p class="text-lg text-green-400">412</p></div>
                    <div class="bg-slate-800 p-2 rounded"><p class="text-[10px] text-slate-500">CPL</p><p class="text-lg text-blue-400">$24.10</p></div>
                </div>
                <p class="text-[10px] text-slate-400 italic font-mono uppercase">Syncing with WWT Marketing Cloud...</p>
            </div>
        `
    },
    { 
        id: 'readout', 
        name: 'Readout + Rec', 
        cat: 'Portfolio Marketing', 
        icon: 'presentation', 
        desc: 'Automate PPT summaries.',
        demo: `
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Executive Slide Generator</h3>
                <p class="text-sm text-slate-400">Synthesizing campaign data into 1-page summary...</p>
                <div class="aspect-video bg-white border border-slate-300 p-4 text-slate-800 shadow-2xl scale-95 origin-top">
                    <div class="h-4 w-2/3 bg-blue-900 mb-4"></div>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="h-20 bg-slate-100 rounded"></div><div class="h-20 bg-slate-100 rounded"></div>
                    </div>
                    <div class="mt-4 h-2 w-full bg-slate-200"></div>
                </div>
                <button class="w-full border border-slate-700 py-1 text-xs">Download .pptx (Simulated)</button>
            </div>
        `
    }
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
function openModal(id) {
    const agent = agents.find(a => a.id === id);
    const content = document.getElementById('modal-content');
    content.innerHTML = agent.demo;
    document.getElementById('modal').classList.remove('hidden');
    
    if(id === 'intel') fetchLiveNews();
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// --- LOGIC ENGINES ---

// 1. UTM Builder
function runUTM() {
    const url = document.getElementById('utm-url').value || 'https://wwt.com/atc';
    const src = document.getElementById('utm-src').value || 'linkedin';
    const med = document.getElementById('utm-med').value || 'social';
    const result = `${url}?utm_source=${src}&utm_medium=${med}&utm_campaign=wwt_agent_demo`;
    const box = document.getElementById('utm-result');
    box.innerText = result;
    box.classList.remove('hidden');
}

// 2. Competitive Intel (LIVE RSS)
async function fetchLiveNews() {
    const feed = document.getElementById('intel-feed');
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.computerworld.com/category/it-services/index.rss');
        const data = await response.json();
        feed.innerHTML = data.items.slice(0, 5).map(item => `
            <div class="p-3 bg-slate-900 border-l-2 border-blue-500 rounded text-[11px]">
                <p class="text-blue-400 font-bold mb-1">${item.author || 'Market Intelligence'}</p>
                <p class="text-white mb-1">${item.title}</p>
                <a href="${item.link}" target="_blank" class="text-slate-500 hover:text-blue-300 underline">Read Full Signal</a>
            </div>
        `).join('');
    } catch (e) {
        feed.innerHTML = "Signal interrupted. Reconnecting to data stream...";
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