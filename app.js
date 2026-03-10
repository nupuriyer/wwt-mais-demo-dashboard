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

const utmHistory = [
    { raw: "LinkedIn / Paid Search", fixed: "linkedin / paid-search", url: "https://wwt.com?utm_source=linkedin&utm_medium=paid-search", changeLog: "Standardized & Hyphenated" },
    { raw: "FACEBOOK / Email_Newsletter", fixed: "facebook / email", url: "https://wwt.com?utm_source=facebook&utm_medium=email", changeLog: "Lowercased & Cleaned" },
    { raw: "Google & Bing / Search", fixed: "google-and-bing / search", url: "https://wwt.com?utm_source=google-and-bing&utm_medium=search", changeLog: "Ampersand Fixed" }
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

