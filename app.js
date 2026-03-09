var GOOGLE_AI_KEY = 'GEMINI_API_KEY_PLACEHOLDER';
let AI_ENABLED = false;

// 1. NINE AGENTS DEFINITION
const agents = [
    { id: 'utm', name: 'UTM Builder', cat: 'Digital', icon: 'link' },
    { id: 'intel', name: 'Competitor Intel', cat: 'Strategy', icon: 'shield' },
    { id: 'seo', name: 'SEO Search', cat: 'Growth', icon: 'search' },
    { id: 'social', name: 'Social Post', cat: 'Content', icon: 'share-2' },
    { id: 'email', name: 'Email Draft', cat: 'Campaigns', icon: 'mail' },
    { id: 'audit', name: 'Site Audit', cat: 'Technical', icon: 'file-text' },
    { id: 'icp', name: 'ICP Analysis', cat: 'Marketing', icon: 'users' },
    { id: 'event', name: 'Event Tracker', cat: 'Field', icon: 'calendar' },
    { id: 'brand', name: 'Brand Guide', cat: 'Creative', icon: 'palette' }
];

// 2. INITIALIZATION
function init() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;
    grid.innerHTML = agents.map(a => `
        <div class="agent-button card p-4 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-slate-800 transition-all" onclick="launchAgent('${a.id}')">
            <div class="w-10 h-10 mb-3 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <i data-lucide="${a.icon}" class="w-5 h-5"></i>
            </div>
            <h4 class="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-tight">${a.name}</h4>
        </div>
    `).join('');
    lucide.createIcons();
}

// 3. UI LOGIC
function toggleUniversalAI(el) {
    AI_ENABLED = el.checked;
    const icon = document.getElementById('universal-ai-icon');
    icon?.classList.toggle('text-blue-400', AI_ENABLED);
    icon?.classList.toggle('animate-pulse', AI_ENABLED);
    
    // Refresh UTM button if it's currently open
    const utmBtn = document.getElementById('utm-btn');
    if (utmBtn) {
        utmBtn.className = `w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600' : 'bg-slate-700'}`;
        utmBtn.innerText = AI_ENABLED ? "Generate with Gemini" : "Generate Standard Link";
    }
}

function launchAgent(id) {
    const agent = agents.find(a => a.id === id);
    document.getElementById('stage-placeholder').classList.add('hidden');
    const content = document.getElementById('stage-content');
    content.classList.remove('hidden');

    if (id === 'utm') {
        content.innerHTML = `
            <div class="max-w-xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">UTM Builder</h3>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest ${AI_ENABLED ? '' : 'invisible'}">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> AI Strategic Mode
                    </div>
                </div>
                <div class="space-y-4">
                    <input id="utm-url" type="text" placeholder="https://wwt.com/atc" class="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-blue-500">
                    <div class="grid grid-cols-2 gap-4">
                        <input id="utm-src" type="text" placeholder="Source (e.g. LinkedIn)" class="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none">
                        <input id="utm-med" type="text" placeholder="Medium (e.g. Social)" class="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none">
                    </div>
                </div>
                <button onclick="processUTM()" id="utm-btn" class="w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600' : 'bg-slate-700'}">
                    ${AI_ENABLED ? 'Generate with Gemini' : 'Generate Standard Link'}
                </button>
                <div id="utm-res-box" class="hidden p-5 bg-slate-800 border border-blue-500/30 rounded-2xl relative group">
                    <p class="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2">Final Campaign URL</p>
                    <code id="utm-result" class="text-blue-100 text-xs break-all font-mono"></code>
                    <button onclick="copyUTM()" class="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><i data-lucide="copy" class="w-4 h-4"></i></button>
                </div>
            </div>`;
    } else {
        content.innerHTML = `
            <div class="text-center py-12">
                <div class="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-500 border border-slate-700">
                    <i data-lucide="${agent.icon}" class="w-10 h-10"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">${agent.name}</h3>
                <p class="text-slate-400 max-w-sm mx-auto">This agent is currently undergoing logic training. Check back soon.</p>
            </div>`;
    }
    lucide.createIcons();
}

// 4. THE CORE UTM LOGIC
async function processUTM() {
    const url = document.getElementById('utm-url').value || "https://wwt.com";
    const box = document.getElementById('utm-res-box');
    const text = document.getElementById('utm-result');
    box.classList.remove('hidden');

    if (!AI_ENABLED) {
        // --- MANUAL MODE ---
        const src = (document.getElementById('utm-src').value || "manual").toLowerCase();
        const med = (document.getElementById('utm-med').value || "direct").toLowerCase();
        text.innerText = `${url}?utm_source=${src}&utm_medium=${med}&utm_campaign=standard`;
    } else {
        // --- AI MODE ---
        text.innerHTML = "<span class='animate-pulse text-blue-400 font-bold'>Gemini is strategizing...</span>";
        
        try {
            // 1. DYNAMIC KEY CHECK: Look everywhere for the key right when the button is clicked
            const activeKey = window.API_KEY_INJECTED || window.GOOGLE_AI_KEY || GOOGLE_AI_KEY;

            if (!activeKey || activeKey.includes('PLACEHOLDER') || activeKey.length < 10) {
                throw new Error("API Key Missing. Check GitHub Secrets for GEMSTONE_DIAMOND.");
            }

            const modelId = "gemini-2.0-flash";
            const prompt = `Act as a WWT Marketing specialist. For the URL ${url}, suggest a professional lowercase hyphenated campaign name, source, and medium. Return ONLY a raw JSON object with these keys: campaign, source, medium.`;
            
            // 2. CACHE-BUSTED API URL
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${activeKey}&cb=${Date.now()}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            // 3. ROBUST DATA PARSING
            const rawText = data.candidates[0].content.parts[0].text;
            const cleanJson = JSON.parse(rawText.replace(/```json|```/g, "").trim());
            
            document.getElementById('utm-src').value = cleanJson.source;
            document.getElementById('utm-med').value = cleanJson.medium;
            text.innerText = `${url}?utm_source=${cleanJson.source}&utm_medium=${cleanJson.medium}&utm_campaign=${cleanJson.campaign}`;
            
        } catch (e) {
            console.error("UTM AI Error:", e);
            // Show a helpful error message in the UI
            text.innerHTML = `<span class="text-red-400 text-[10px]">AI Offline: ${e.message}</span>`;
        }
    }
    lucide.createIcons();
}

function copyUTM() {
    const content = document.getElementById('utm-result').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert("Link Copied!");
    });
}

function clearStage() {
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('stage-placeholder').classList.remove('hidden');
}

window.onload = init;

