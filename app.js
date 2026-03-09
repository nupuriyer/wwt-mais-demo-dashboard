const agents = [
    { 
        id: 'utm', 
        name: 'UTM Builder', 
        cat: 'Digital Campaigns', 
        icon: 'link', 
        desc: 'Standardize campaign tracking instantly.', 
        demo: `
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4">
                    <input id="utm-url" type="text" placeholder="Destination URL (e.g., wwt.com/atc)" class="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                    <div class="grid grid-cols-2 gap-4">
                        <select id="utm-src" class="bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">X / Twitter</option>
                            <option value="google">Google</option>
                            <option value="newsletter">Newsletter</option>
                        </select>
                        <select id="utm-med" class="bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                            <option value="social">Social</option>
                            <option value="cpc">Paid Search</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                    <input id="utm-cam" type="text" placeholder="Campaign Name" class="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                </div>
                <button onclick="runUTM()" class="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold transition-colors">Generate Tracking Link</button>
                <div id="utm-result-container" class="hidden animate-in fade-in slide-in-from-bottom-2">
                    <div class="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <code id="utm-result" class="text-blue-300 text-xs break-all flex-1 font-mono"></code>
                        <button onclick="copyUTM()" class="p-2 hover:bg-blue-500/20 rounded text-blue-400"><i data-lucide="copy" class="w-4 h-4"></i></button>
                    </div>
                </div>
            </div>`
    },
    { 
        id: 'intel', 
        name: 'Competitive Intel', 
        cat: 'Brand/ATC/Services', 
        icon: 'shield', 
        desc: 'Live signals from rivals.', 
        demo: `
            <div class="space-y-4">
                <div class="flex gap-2">
                    <input id="intel-comp" type="text" placeholder="Competitor (e.g. Accenture)" class="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm">
                    <button onclick="fetchLiveNews(document.getElementById('intel-comp').value)" class="bg-blue-600 px-4 rounded text-white text-xs font-bold">Scan</button>
                </div>
                <div id="intel-feed" class="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <p class="text-slate-500 text-center text-xs py-8 italic">Enter a competitor name to stream real-time news signals.</p>
                </div>
            </div>`
    },
    { 
        id: 'seo', 
        name: 'SEO Search Agent', 
        cat: 'Growth/Search', 
        icon: 'search', 
        desc: '2026 search trends.', 
        demo: `
            <div class="space-y-4">
                <input id="seo-query" type="text" placeholder="Keyword Topic" class="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                <button onclick="runSEOScan()" class="w-full bg-blue-600 text-white p-3 rounded font-bold">Analyze Search Intent</button>
                <div id="seo-output" class="text-xs text-slate-400 leading-relaxed"></div>
            </div>`
    },
    { 
        id: 'icp', 
        name: 'ICP Agent', 
        cat: 'Portfolio Marketing', 
        icon: 'users', 
        desc: 'Map buying committees.', 
        demo: `
            <div class="space-y-4">
                <select id="icp-industry" class="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Financial Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Public Sector">Public Sector</option>
                </select>
                <button onclick="runICP()" class="w-full bg-purple-600 text-white p-3 rounded font-bold">Map Buying Committee</button>
                <div id="icp-result" class="hidden grid grid-cols-1 gap-2 mt-4"></div>
            </div>`
    },
    { 
        id: 'industry', 
        name: 'Industry Content', 
        cat: 'Portfolio Marketing', 
        icon: 'file-text', 
        desc: 'ATC-validated briefs.', 
        demo: `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <input id="content-topic" type="text" placeholder="Topic (e.g. GenAI)" class="bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                    <select id="content-persona" class="bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm">
                        <option>C-Level Executive</option>
                        <option>Technical Architect</option>
                        <option>Operations Director</option>
                    </select>
                </div>
                <button onclick="runContent()" class="w-full bg-emerald-600 text-white p-3 rounded font-bold">Generate Strategic Brief</button>
                <div id="content-output" class="hidden mt-4 p-6 bg-white rounded-lg shadow-inner text-slate-800 text-xs">
                    <div id="brief-text"></div>
                </div>
            </div>`
    },
    { id: 'revenue', name: 'Marketing-to-Revenue', cat: 'Portfolio Marketing', icon: 'trending-up', desc: 'SFDC linking.', demo: `<div class="text-center py-10"><button onclick="simulateRevenue()" class="bg-blue-600 px-6 py-2 rounded font-bold text-white">Simulate Revenue Attribution</button><div id="drop-zone" class="mt-4"></div><div id="rev-analysis" class="hidden mt-4 text-xs text-blue-400 font-mono italic">Pipeline Sync Complete: $4.2M Attributed to ATC Lab Workshops.</div></div>` },
    { id: 'email', name: 'Email Marketing', cat: 'Digital Campaigns', icon: 'mail', desc: 'Brand alignment.', demo: `<div class="space-y-4"><textarea id="email-raw" placeholder="Drop rough notes here..." class="w-full h-24 bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm"></textarea><button onclick="runAIEmail()" class="w-full bg-blue-600 text-white p-3 rounded font-bold">Apply Brand Voice (Gemini)</button><div id="email-result-container" class="hidden mt-4"><div id="email-result" class="p-4 bg-slate-800 rounded border border-blue-500/30 text-xs text-slate-200 whitespace-pre-wrap"></div></div></div>` },
    { id: 'reporting', name: 'Reporting Perf', cat: 'Portfolio Marketing', icon: 'bar-chart-2', desc: 'Campaign health.', demo: `<div class="p-4 bg-slate-900 rounded-lg border border-slate-800"><div class="flex justify-between mb-4"><h5 class="text-xs font-bold text-white uppercase">Weekly Telemetry</h5><button onclick="refreshReport()" class="text-[10px] text-blue-400 hover:underline">Refresh Data</button></div><div id="report-insight" class="text-xs text-slate-400 italic">Historical campaign data loaded. Press refresh for real-time AI insights.</div></div>` },
    { id: 'readout', name: 'Readout + Rec', cat: 'Portfolio Marketing', icon: 'presentation', desc: 'PPT summaries.', demo: `<div class="space-y-4"><input id="readout-title" type="text" placeholder="Meeting Title" class="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm"><button onclick="runReadout()" class="w-full bg-indigo-600 text-white p-3 rounded font-bold">Generate Exec Slide</button><div id="slide-preview" class="hidden mt-4 p-8 bg-slate-800 border-4 border-slate-700 rounded shadow-2xl text-center"><h3 id="slide-title-text" class="text-xl font-bold text-white mb-2"></h3><p class="text-xs text-slate-500 uppercase tracking-widest">Confidential Internal Briefing</p></div></div>` }
];

// --- DASHBOARD INITIALIZATION (5+4 Grid) ---
function init() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;

    grid.innerHTML = agents.map((agent, index) => {
        let gridClasses = "bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 w-full min-h-[110px]";
        
        // Offset the 6th element to start the second row properly
        if (index === 5) gridClasses += " md:col-start-1 lg:col-start-1";

        return `
            <div class="${gridClasses}" onclick="launchAgent('${agent.id}')">
                <div class="w-10 h-10 mb-2 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i data-lucide="${agent.icon}" class="w-5 h-5"></i>
                </div>
                <h4 class="text-[10px] font-bold text-slate-300 uppercase tracking-tighter leading-tight">${agent.name}</h4>
                <p class="text-[8px] text-slate-600 mt-1 uppercase group-hover:text-slate-400 transition-colors">${agent.cat}</p>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

// --- WORKSPACE LOGIC ---
function launchAgent(id) {
    const agent = agents.find(a => a.id === id);
    const placeholder = document.getElementById('stage-placeholder');
    const content = document.getElementById('stage-content');
    const wrapper = document.getElementById('action-stage-wrapper');

    placeholder.classList.add('hidden');
    content.classList.remove('hidden');
    wrapper.classList.add('active');

    content.innerHTML = `
        <div class="animate-in fade-in slide-in-from-top-4 duration-500">
            <div class="mb-6 flex items-center gap-4">
                <div class="p-3 bg-blue-600/20 text-blue-400 rounded-xl"><i data-lucide="${agent.icon}"></i></div>
                <div>
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">${agent.cat}</span>
                    <h3 class="text-xl font-bold text-white">${agent.name}</h3>
                </div>
            </div>
            <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                ${agent.demo}
            </div>
        </div>
    `;

    lucide.createIcons();
    if(id === 'intel') fetchLiveNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearStage() {
    document.getElementById('stage-placeholder').classList.remove('hidden');
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('action-stage-wrapper').classList.remove('active');
}

// --- LOGIC ENGINES ---

function runUTM() {
    const url = document.getElementById('utm-url').value || 'https://wwt.com/atc';
    const src = document.getElementById('utm-src').value;
    const med = document.getElementById('utm-med').value;
    const cam = document.getElementById('utm-cam').value || 'agent-demo';
    const result = `${url.split('?')[0]}?utm_source=${src}&utm_medium=${med}&utm_campaign=${cam.replace(/\s+/g, '-').toLowerCase()}`;
    document.getElementById('utm-result').innerText = result;
    document.getElementById('utm-result-container').classList.remove('hidden');
    lucide.createIcons();
}

function copyUTM() {
    const text = document.getElementById('utm-result').innerText;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
}

async function fetchLiveNews(company = 'Accenture') {
    const feed = document.getElementById('intel-feed');
    if(!feed) return;
    feed.innerHTML = `<div class="p-4 text-center animate-pulse text-blue-400 text-xs">Scanning signals for ${company}...</div>`;
    
    try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(company + ' technology')}&hl=en-US&gl=US&ceid=US:en`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        feed.innerHTML = data.items.slice(0, 3).map(item => `
            <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <p class="text-xs text-white font-medium mb-1">${item.title}</p>
                <div class="flex justify-between items-center text-[9px] text-slate-500">
                    <span>${new Date(item.pubDate).toLocaleDateString()}</span>
                    <a href="${item.link}" target="_blank" class="text-blue-500">Read More →</a>
                </div>
            </div>
        `).join('');
    } catch (e) {
        feed.innerHTML = `<p class="text-xs text-red-400 text-center">Intel stream offline.</p>`;
    }
}

function runSEOScan() {
    const out = document.getElementById('seo-output');
    out.innerHTML = "Querying citation frequency...";
    setTimeout(() => {
        out.innerHTML = `<div class="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-slate-300"><strong>Recommendation:</strong> Create content around "AI Inference Costs" for Q3 targets.</div>`;
    }, 1500);
}

function runICP() {
    const industry = document.getElementById('icp-industry').value;
    const resDiv = document.getElementById('icp-result');
    resDiv.classList.remove('hidden');
    const data = {
        'Healthcare': ['Chief Medical Officer', 'Head of Clinical IT'],
        'Finance': ['Chief Risk Officer', 'Fintech Ops Lead'],
        'Manufacturing': ['Digital Twin Lead', 'Smart Factory Director'],
        'Public Sector': ['Agency CTO', 'Cyber Ops Director']
    };
    resDiv.innerHTML = data[industry].map(role => `<div class="bg-slate-800 p-2 rounded text-[10px] border border-purple-500/30 text-slate-200">${role}</div>`).join('');
}

function runContent() {
    const topic = document.getElementById('content-topic').value;
    const persona = document.getElementById('content-persona').value;
    const output = document.getElementById('content-output');
    const brief = document.getElementById('brief-text');
    output.classList.remove('hidden');
    brief.innerHTML = `<h4 class="font-bold text-blue-900 uppercase border-b mb-2">WWT Strategy: ${topic}</h4><p>Prepared for ${persona}. This brief leverages ATC lab data to validate architecture...</p>`;
}

function simulateRevenue() {
    document.getElementById('rev-analysis').classList.remove('hidden');
}

function refreshReport() {
    document.getElementById('report-insight').innerText = "Signal Alert: 'Hybrid Cloud' campaign is reaching saturation. Recommend pivot to 'Liquid Cooling' assets.";
}

function runReadout() {
    document.getElementById('slide-title-text').innerText = document.getElementById('readout-title').value || "Strategic Summary";
    document.getElementById('slide-preview').classList.remove('hidden');
}

async function runAIEmail() {
    const result = document.getElementById('email-result');
    document.getElementById('email-result-container').classList.remove('hidden');
    result.innerHTML = "<span class='animate-pulse text-blue-400'>Applying WWT Brand Voice via Gemini...</span>";
    setTimeout(() => {
        result.innerText = "Subject: Strategic Alignment on " + (document.getElementById('email-raw').value.split(' ')[0] || "Innovation") + "\n\nHi Team,\n\nFollowing up on our notes, I believe our ATC lab capabilities could significantly de-risk this deployment...";
    }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
