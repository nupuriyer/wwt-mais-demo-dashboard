const GOOGLE_AI_KEY = 'REPLACE_ME_WITH_KEY';

// 1. GLOBAL STATE
let AI_ENABLED = false;

// 2. AGENT DEFINITIONS
const agents = [
    { 
        id: 'utm', 
        name: 'UTM Builder', 
        cat: 'Digital Campaigns', 
        icon: 'link', 
        demo: `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-slate-700">Campaign Link Builder</h3>
                    <div id="ai-badge" class="hidden flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> AI STRATEGIC MODE
                    </div>
                </div>
                <div class="space-y-3">
                    <input id="utm-url" type="text" placeholder="https://www.wwt.com/atc" 
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 outline-none focus:border-blue-500 transition-all">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <input id="utm-src" type="text" placeholder="Source (e.g. LinkedIn)" class="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm outline-none focus:border-blue-500">
                        <input id="utm-med" type="text" placeholder="Medium (e.g. Social)" class="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm outline-none focus:border-blue-500">
                    </div>
                </div>

                <button onclick="processUTM()" id="utm-btn" class="w-full bg-slate-800 p-4 rounded-xl font-bold text-white transition-all hover:bg-slate-700 shadow-md">
                    Generate Link
                </button>

                <div id="utm-result-container" class="hidden p-4 bg-blue-50 border border-blue-100 rounded-xl relative">
                    <p class="text-[10px] font-bold text-blue-400 uppercase mb-2">Generated URL</p>
                    <code id="utm-result" class="text-blue-800 text-xs break-all font-mono"></code>
                    <button onclick="copyUTM()" class="absolute top-3 right-3 text-blue-500 hover:text-blue-700">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        ` 
    },
    { id: 'intel', name: 'Competitive Intel', cat: 'Brand/ATC/Services', icon: 'shield', demo: `<div class="p-8 text-center text-slate-400 italic">Agent logic coming in the next phase...</div>` },
    { id: 'seo', name: 'SEO Search Agent', cat: 'Growth/Search', icon: 'search', demo: `<div class="p-8 text-center text-slate-400 italic">Agent logic coming in the next phase...</div>` },
    { id: 'icp', name: 'ICP Agent', cat: 'Portfolio Marketing', icon: 'users', demo: `<div class="p-8 text-center text-slate-400 italic">Agent logic coming in the next phase...</div>` }
];

// 3. INITIALIZATION
function init() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;

    grid.innerHTML = agents.map((agent) => `
        <div class="agent-button card p-4 flex flex-col items-center justify-center text-center cursor-pointer group" 
             onclick="launchAgent('${agent.id}')">
            <div class="w-10 h-10 mb-3 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <i data-lucide="${agent.icon}" class="w-5 h-5"></i>
            </div>
            <h4 class="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">${agent.name}</h4>
        </div>
    `).join('');

    lucide.createIcons();
}

// 4. CORE UI LOGIC
function toggleUniversalAI(el) {
    AI_ENABLED = el.checked;
    const icon = document.getElementById('universal-ai-icon');
    const badge = document.getElementById('ai-badge');
    const btn = document.getElementById('utm-btn');

    if (AI_ENABLED) {
        icon?.classList.add('text-blue-500', 'animate-pulse');
        badge?.classList.remove('hidden');
        if(btn) {
            btn.classList.replace('bg-slate-800', 'bg-blue-600');
            btn.innerText = "Generate with Gemini";
        }
    } else {
        icon?.classList.remove('text-blue-500', 'animate-pulse');
        badge?.classList.add('hidden');
        if(btn) {
            btn.classList.replace('bg-blue-600', 'bg-slate-800');
            btn.innerText = "Generate Link";
        }
    }
}

function launchAgent(id) {
    const agent = agents.find(a => a.id === id);
    const placeholder = document.getElementById('stage-placeholder');
    const content = document.getElementById('stage-content');
    const wrapper = document.getElementById('action-stage-wrapper');

    placeholder.classList.add('hidden');
    content.classList.remove('hidden');
    wrapper.classList.add('active');

    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="mb-6 flex items-center gap-4">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <i data-lucide="${agent.icon}"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">${agent.cat}</span>
                    <h3 class="text-xl font-bold text-slate-800">${agent.name}</h3>
                </div>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                ${agent.demo}
            </div>
        </div>
    `;

    lucide.createIcons();
    // Sync the internal UI with the current global AI state
    const toggleEl = document.getElementById('universal-ai-toggle');
    if(toggleEl) toggleUniversalAI(toggleEl);
}

function clearStage() {
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('stage-placeholder').classList.remove('hidden');
    document.getElementById('action-stage-wrapper').classList.remove('active');
}

// 5. UTM AGENT LOGIC
async function processUTM() {
    const url = document.getElementById('utm-url').value || "https://wwt.com";
    const resultDiv = document.getElementById('utm-result');
    const container = document.getElementById('utm-result-container');
    
    container.classList.remove('hidden');

    if (!AI_ENABLED) {
        // MANUAL MODE
        const src = document.getElementById('utm-src').value || "manual";
        const med = document.getElementById('utm-med').value || "direct";
        const cleanUrl = url.split('?')[0];
        resultDiv.innerText = `${cleanUrl}?utm_source=${src}&utm_medium=${med}&utm_campaign=standard`;
    } else {
        // AI MODE
        resultDiv.innerHTML = "<span class='animate-pulse text-blue-600 font-bold'>Gemini is strategizing...</span>";
        
        try {
            const prompt = `Act as a WWT Marketing specialist. For URL ${url}, suggest a professional lowercase hyphenated campaign name, source, and medium. Return ONLY JSON: {"campaign": "...", "source": "...", "medium": "..."}`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const cleanText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
            const ai = JSON.parse(cleanText);
            
            document.getElementById('utm-src').value = ai.source;
            document.getElementById('utm-med').value = ai.medium;
            resultDiv.innerText = `${url}?utm_source=${ai.source}&utm_medium=${ai.medium}&utm_campaign=${ai.campaign}`;
        } catch (e) {
            resultDiv.innerHTML = "<span class='text-red-500 font-bold italic text-[10px]'>AI connection failed. Check your API key or toggle AI off.</span>";
        }
    }
    lucide.createIcons();
}

function copyUTM() {
    const text = document.getElementById('utm-result').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}

// START
document.addEventListener('DOMContentLoaded', init);
