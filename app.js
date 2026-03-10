var GOOGLE_AI_KEY = 'GEMINI_API_KEY_PLACEHOLDER';
let AI_ENABLED = false;

// 1. DATASET & AGENTS
const utmHistory = [
    { url: "https://wwt.com/atc", src: "LinkedIn", med: "Paid_Social", camp: "atc-promo", fixedUrl: "https://wwt.com/atc?utm_source=linkedin&utm_medium=social&utm_campaign=atc-promo" },
    { url: "https://wwt.com/labs", src: "FACEBOOK", med: "Email_Newsletter", camp: "labs-update", fixedUrl: "https://wwt.com/labs?utm_source=facebook&utm_medium=email&utm_campaign=labs-update" }
];

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
    if (grid) {
        grid.innerHTML = agents.map(a => `
            <div class="agent-button card p-4 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-slate-800 transition-all" onclick="launchAgent('${a.id}')">
                <div class="w-10 h-10 mb-3 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i data-lucide="${a.icon}" class="w-5 h-5"></i>
                </div>
                <h4 class="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-tight">${a.name}</h4>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

// 3. AGENT LAUNCHER
function launchAgent(id) {
    document.getElementById('stage-placeholder').classList.add('hidden');
    const content = document.getElementById('stage-content');
    content.classList.remove('hidden');

    if (id === 'utm') {
        content.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                        <h3 class="text-xl font-bold text-white">UTM Strategic Governance</h3>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest ${AI_ENABLED ? '' : 'invisible'}">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> AI Enabled
                    </div>
                </div>
                
                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                    <input id="utm-url" type="text" placeholder="Landing Page URL" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all">
                    <div class="grid grid-cols-3 gap-4">
                        <input id="utm-src" type="text" placeholder="Source" class="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none">
                        <input id="utm-med" type="text" placeholder="Medium" class="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none">
                        <input id="utm-camp" type="text" placeholder="Campaign" class="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none">
                    </div>
                    <button onclick="processUTM()" id="utm-btn" class="w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600' : 'bg-slate-700'}">
                        ${AI_ENABLED ? 'Govern with Gemini' : 'Generate Standard Link'}
                    </button>
                </div>

                <div class="space-y-3">
                    <div class="flex justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Governance Feed</span>
                        <span>Standardized Output</span>
                    </div>
                    <div id="utm-history-list" class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"></div>
                </div>
            </div>`;
        renderHistory();
    }
    lucide.createIcons();
}

// 4. GOVERNANCE ENGINE
function standardize(text, fallback) {
    if (!text) return fallback;
    return text.toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')         // Replace ampersand
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '')   // Remove special characters
        .replace(/-+/g, '-');         // Remove double hyphens
}

async function processUTM() {
    const rawUrl = document.getElementById('utm-url').value || "https://wwt.com";
    const rawSrc = document.getElementById('utm-src').value;
    const rawMed = document.getElementById('utm-med').value;
    const rawCamp = document.getElementById('utm-camp').value;

    // Local Logic (Immediate Governance)
    const fixedSrc = standardize(rawSrc, "direct");
    const fixedMed = standardize(rawMed, "none");
    const fixedCamp = standardize(rawCamp, "standard-promo");
    
    const finalUrl = `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}utm_source=${fixedSrc}&utm_medium=${fixedMed}&utm_campaign=${fixedCamp}`;

    utmHistory.push({
        url: rawUrl,
        src: rawSrc || "None",
        med: rawMed || "None",
        fixedUrl: finalUrl
    });

    renderHistory();
    
    // Clear inputs
    ['utm-src', 'utm-med', 'utm-camp'].forEach(id => document.getElementById(id).value = '');
}

function renderHistory() {
    const list = document.getElementById('utm-history-list');
    if (!list) return;
    list.innerHTML = utmHistory.map((item, idx) => `
        <div class="bg-slate-800/40 border border-slate-700 p-4 rounded-xl flex flex-col gap-3 group hover:border-blue-500/50 transition-all">
            <div class="flex justify-between items-start">
                <div class="flex flex-col">
                    <span class="text-[10px] text-red-400 font-mono italic">Input: ${item.src} / ${item.med}</span>
                    <span class="text-[11px] text-white font-mono break-all mt-1">${item.fixedUrl}</span>
                </div>
                <button onclick="copyLine('${item.fixedUrl}', this)" class="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-blue-400 transition-all">
                    <i data-lucide="copy" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).reverse().join('');
    lucide.createIcons();
}

// 5. UTILS
function copyLine(text, btn) {
    navigator.clipboard.writeText(text);
    const originalIcon = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-400"></i>`;
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = originalIcon;
        lucide.createIcons();
    }, 2000);
}

function toggleUniversalAI(el) {
    AI_ENABLED = el.checked;
    launchAgent('utm');
}

function clearStage() {
    document.getElementById('stage-content').classList.add('hidden');
    document.getElementById('stage-placeholder').classList.remove('hidden');
}

window.onload = init;
