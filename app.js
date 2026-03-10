var GOOGLE_AI_KEY = 'GEMINI_API_KEY_PLACEHOLDER';
let AI_ENABLED = false;

// 1. DATASET
const utmHistory = [
    { url: "https://wwt.com/atc", src: "LinkedIn", med: "Paid_Social", camp: "ATC Promo 2026", fixedSrc: "linkedin", fixedMed: "social", fixedCamp: "atc-promo-2026" },
    { url: "https://wwt.com/labs", src: "FACEBOOK", med: "Email_Newsletter", camp: "Labs_Update", fixedSrc: "facebook", fixedMed: "email", fixedCamp: "labs-update" },
    { url: "https://wwt.com/cloud", src: "Google & Bing", med: "Search-Ads", camp: "Cloud_Migration", fixedSrc: "google-bing", fixedMed: "search", fixedCamp: "cloud-migration" },
    { url: "https://wwt.com/security", src: "LNKD-App", med: "Post", camp: "Security_Brief_2.0", fixedSrc: "linkedin", fixedMed: "social", fixedCamp: "security-brief-v2" },
    { url: "https://wwt.com/ai", src: "Twitter", med: "Organic_Share", camp: "AI_Strategy_Final", fixedSrc: "twitter", fixedMed: "social", fixedCamp: "ai-strategy-final" },
    { url: "https://wwt.com/data", src: "newsletter_march", med: "ClickThrough", camp: "Data_Insights", fixedSrc: "newsletter", fixedMed: "email", fixedCamp: "data-insights" },
    { url: "https://wwt.com/edge", src: "Internal_Referral", med: "Banner_Ads", camp: "Edge_Compute", fixedSrc: "internal", fixedMed: "display", fixedCamp: "edge-compute" },
    { url: "https://wwt.com/network", src: "Partner Portal", med: "Web_Referral", camp: "Network_Scale", fixedSrc: "partner", fixedMed: "referral", fixedCamp: "network-scale" },
    { url: "https://wwt.com/storage", src: "Event_QR", med: "Physical_Print", camp: "Storage_Summit", fixedSrc: "event", fixedMed: "qr-code", fixedCamp: "storage-summit" },
    { url: "https://wwt.com/compute", src: "YouTube_Pre-Roll", med: "Video_Ad", camp: "Compute_Efficiency", fixedSrc: "youtube", fixedMed: "video", fixedCamp: "compute-efficiency" }
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
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">UTM Strategic Governance</h3>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest ${AI_ENABLED ? '' : 'invisible'}">
                        <i data-lucide="sparkles" class="w-3 h-3"></i> AI Enabled
                    </div>
                </div>
                
                <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                    <input id="utm-url" type="text" placeholder="URL" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                    <div class="grid grid-cols-2 gap-4">
                        <input id="utm-src" type="text" placeholder="Manual Source" class="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                        <input id="utm-med" type="text" placeholder="Manual Medium" class="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                    </div>
                    <button onclick="processUTM()" id="utm-btn" class="w-full p-4 rounded-xl font-bold text-white transition-all ${AI_ENABLED ? 'bg-blue-600' : 'bg-slate-700'}">
                        ${AI_ENABLED ? 'Generate with Gemini' : 'Generate Standard Link'}
                    </button>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Human Input (Messy)</span>
                        <span>AI Standardized (Clean)</span>
                    </div>
                    <div id="utm-history-list" class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        </div>
                </div>
            </div>`;
        renderHistory();
    }
    lucide.createIcons();
}

function renderHistory() {
    const list = document.getElementById('utm-history-list');
    if (!list) return;
    list.innerHTML = utmHistory.map(item => `
        <div class="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex justify-between items-center group hover:border-blue-500/50 transition-all animate-in fade-in slide-in-from-top-4">
            <div class="flex flex-col gap-1 max-w-[45%]">
                <span class="text-[9px] text-red-400 font-mono">${item.src} / ${item.med}</span>
                <span class="text-[10px] text-slate-500 truncate italic">${item.url}</span>
            </div>
            <div class="text-slate-600"><i data-lucide="arrow-right" class="w-4 h-4"></i></div>
            <div class="flex flex-col gap-1 text-right max-w-[45%]">
                <span class="text-[9px] text-blue-400 font-bold font-mono uppercase tracking-tighter">${item.fixedSrc} / ${item.fixedMed}</span>
                <span class="text-[10px] text-green-400 font-bold">Standardized ✓</span>
            </div>
        </div>
    `).reverse().join(''); // Show newest on top
    lucide.createIcons();
}

async function processUTM() {
    const url = document.getElementById('utm-url').value || "https://wwt.com";
    const srcInput = document.getElementById('utm-src').value || "Manual-Entry";
    const medInput = document.getElementById('utm-med').value || "MESSY_DATA";

    // 1. Simple Standardization for demo purposes
    const fixedSrc = srcInput.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fixedMed = medInput.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // 2. Add to the front of the array
    utmHistory.push({
        url: url,
        src: srcInput,
        med: medInput,
        fixedSrc: fixedSrc,
        fixedMed: fixedMed
    });

    // 3. Re-render
    renderHistory();
    
    // Clear inputs for next entry
    document.getElementById('utm-src').value = '';
    document.getElementById('utm-med').value = '';
}

function toggleUniversalAI(el) {
    AI_ENABLED = el.checked;
    launchAgent('utm'); // Refresh the view
}

window.onload = init;
