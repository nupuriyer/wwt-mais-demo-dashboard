var GOOGLE_AI_KEY = 'GEMINI_API_KEY_PLACEHOLDER';
let AI_ENABLED = false;

// 1. HARDCODED GOVERNANCE & INITIAL SEED
const governanceMap = {
    "linkedin": "linkedin",
    "lnkd-post": "linkedin",
    "paid search": "paid-search",
    "google & bing": "google-and-bing",
    "atc_promo_2026": "atc-promo-2026",
    "email_newsletter": "email",
    "web-referral": "referral",
    "facebook": "facebook",
    "strategy briefing 2.0": "strategy-briefing-v2",
    "display ": "display"
};

const utmHistory = [
    { raw: "LinkedIn / Paid_Social", fixed: "linkedin / social", url: "https://wwt.com?utm_source=linkedin&utm_medium=social", changed: true },
    { raw: "FACEBOOK / Email_Newsletter", fixed: "facebook / email", url: "https://wwt.com?utm_source=facebook&utm_medium=email", changed: true },
    { raw: "Google & Bing / Search", fixed: "google-and-bing / search", url: "https://wwt.com?utm_source=google-and-bing&utm_medium=search", changed: true },
    { raw: "LNKD-Post / Organic", fixed: "linkedin / social", url: "https://wwt.com?utm_source=linkedin&utm_medium=social", changed: true },
    { raw: "atc_promo_2026 / Banner", fixed: "atc-promo-2026 / display", url: "https://wwt.com?utm_source=atc-promo-2026&utm_medium=display", changed: true }
];

const agents = [
    { id: 'utm', name: 'UTM Builder', cat: 'Digital', icon: 'link' },
    { id: 'intel', name: 'Competitor Intel', cat: 'Strategy', icon: 'shield' },
    { id: 'seo', name: 'SEO Search', cat: 'Growth', icon: 'search' },
    { id: 'social', name: 'Social Post', cat: 'Content', icon: 'share-2' },
    { id: 'email', name: 'Email Draft', cat: 'Campaigns', icon: 'mail' }
];

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
                    <input id="utm-url" type="text" placeholder="Landing Page URL" class="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 font-medium placeholder:text-slate-600 outline-none focus:border-blue-500 transition-all">
                    <div class="grid grid-cols-3 gap-4">
                        <input id="utm-src" type="text" placeholder="Source" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 font-medium placeholder:text-slate-600 outline-none">
                        <input id="utm-med" type="text" placeholder="Medium" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 font-medium placeholder:text-slate-600 outline-none">
                        <input id="utm-camp" type="text" placeholder="Campaign" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 font-medium placeholder:text-slate-600 outline-none">
                    </div>
                    <button onclick="processUTM()" id="utm-btn" class="w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-slate-800'}">
                        ${AI_ENABLED ? 'Govern with Gemini' : 'Generate Standard Link'}
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="flex justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span>Audit Log: Inconsistency → Standard</span>
                        <span>Copy</span>
                    </div>
                    <div id="utm-history-list" class="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar"></div>
                </div>
            </div>`;
        renderHistory();
    }
    lucide.createIcons();
}

function govern(input, fallback) {
    if (!input) return fallback;
    const clean = input.trim().toLowerCase();
    if (governanceMap[clean]) return governanceMap[clean];
    return clean.replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

async function processUTM() {
    const rawUrl = document.getElementById('utm-url').value || "https://wwt.com";
    const rawSrc = document.getElementById('utm-src').value || "Direct";
    const rawMed = document.getElementById('utm-med').value || "None";
    const rawCamp = document.getElementById('utm-camp').value || "General";

    const activeKey = window.API_KEY_INJECTED || window.GOOGLE_AI_KEY || GOOGLE_AI_KEY;
    let finalSrc, finalMed, finalCamp;

    if (AI_ENABLED && activeKey && !activeKey.includes('PLACEHOLDER')) {
        try {
            const prompt = `Act as a WWT Marketing specialist. For URL ${rawUrl}, suggest lowercase hyphenated: source, medium, campaign. Return JSON: {"source": "...", "medium": "...", "campaign": "..."}`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${activeKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            const cleanJson = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());
            finalSrc = cleanJson.source;
            finalMed = cleanJson.medium;
            finalCamp = cleanJson.campaign;
        } catch (e) {
            finalSrc = govern(rawSrc, "direct");
            finalMed = govern(rawMed, "none");
            finalCamp = govern(rawCamp, "standard");
        }
    } else {
        finalSrc = govern(rawSrc, "direct");
        finalMed = govern(rawMed, "none");
        finalCamp = govern(rawCamp, "standard");
    }

    const finalUrl = `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}utm_source=${finalSrc}&utm_medium=${finalMed}&utm_campaign=${finalCamp}`;

    utmHistory.unshift({
        raw: `${rawSrc} / ${rawMed}`,
        fixed: `${finalSrc} / ${finalMed}`,
        url: finalUrl,
        changed: (rawSrc.toLowerCase() !== finalSrc || rawMed.toLowerCase() !== finalMed)
    });

    renderHistory();
    ['utm-src', 'utm-med', 'utm-camp'].forEach(id => document.getElementById(id).value = '');
}

function renderHistory() {
    const list = document.getElementById('utm-history-list');
    if (!list) return;
    list.innerHTML = utmHistory.map((item) => `
        <div class="bg-slate-900/40 border ${item.changed ? 'border-blue-500/20 bg-blue-500/5' : 'border-slate-800'} p-4 rounded-xl flex items-center justify-between transition-all duration-500 animate-in fade-in slide-in-from-top-2">
            <div class="flex flex-col gap-1.5 max-w-[85%]">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[9px] text-slate-600 line-through decoration-red-900/50">${item.raw}</span>
                    <i data-lucide="arrow-right" class="w-3 h-3 text-blue-500/50"></i>
                    <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">${item.fixed}</span>
                    ${item.changed ? '<span class="text-[7px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-black tracking-tighter">GOVERNED</span>' : ''}
                </div>
                <span class="text-[10px] text-slate-500 font-mono truncate opacity-80">${item.url}</span>
            </div>
            <button onclick="copyLine('${item.url}', this)" class="ml-4 p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');
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
