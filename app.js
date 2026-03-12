// 1. GLOBAL SESSION STATE
let SESSION_AI_KEY = null;
let AI_ENABLED = false;

const INDUSTRY_KEY_MAP = {
    "Telecommunications": "telco",
    "Healthcare": "healthcare",
    "Energy": "energy",
    "Financial Services": "finance",
    "Manufacturing": "manufacturing",
    "Public Sector": "public"
};

const UTM_AI_SYSTEM_PROMPT = `You are a WWT Marketing Data Guardrail.
Task: Provide a 5-word strategic reason for a UTM correction.
Constraint: NO introductory text, NO quotes, NO punctuation at the end. 
Example Input: lnkd -> linkedin
Example Output: Ensures cross-platform attribution parity`;

const INTEL_AI_PROMPT = `You are a WWT Strategic Analyst. 
Given a competitor's move, provide a 1-sentence "WWT Power Play" that emphasizes WWT's Advanced Technology Center (ATC) labs.
Keep it under 15 words. Be aggressive and strategic. 
No introductory fluff.`;

const SEO_AI_PROMPT = `You are a WWT SEO Specialist. 
Given a list of existing organic keywords and internal links, identify ONE "High-Intent Content Gap" for WWT to target.
Focus on ATC-specific advantages. 
Format: "Gap: [Topic] - [Strategy]". 
Keep it under 12 words. No quotes.`;

const REPORT_AI_PROMPT = `You are a WWT Marketing Analyst. 
Analyze these campaign metrics: Spend, MQLs, Pipeline, and ROI.
Provide a one-sentence "Executive Optimization" suggestion. 
Focus on ATC integration or high-value conversion. 
Under 12 words. No quotes.`;

const ICP_AI_PROMPT = `You are a WWT Sales Strategist. 
Given an ICP profile (Industry, Tech Stack, and Strategy), identify ONE "Hyper-Personalized Hook" for a WWT executive to use in an intro meeting.
Mention the ATC specifically. 
Under 15 words. No quotes.`;

const REV_AI_PROMPT = `You are a WWT Revenue Operations Analyst. 
Look at this customer journey (Timeline of touches). 
Identify ONE "Velocity Play" to accelerate the closing of this $1M+ deal. 
Mention an ATC residency or executive briefing. 
Under 12 words. No quotes.`;

const EMAIL_AI_PROMPT = `You are a WWT Senior Copywriter. 
Refine the provided email draft to be more compelling for a C-suite executive. 
Focus on the Advanced Technology Center (ATC) as the primary value driver. 
Maintain a professional, visionary tone. 
Provide a "Subject" and a "Body". 
Keep the body under 60 words. No quotes.`;

const INDUSTRY_AI_PROMPT = `You are a Senior Market Strategist. 
Analyze the provided industry gap data.
Refine the "Opportunity" and the "Strategic Outline" to be more aggressive and visionary. 
Ensure the strategic steps are highly actionable and high-leverage.
Structure the response exactly as:
Gap: [One sentence]
Trend: [One sentence]
Opportunity: [One sentence]
Outline: [Step 1], [Step 2], [Step 3], [Step 4]`;

const READOUT_AI_PROMPT = `You are a Principal Growth Strategist. 
Review the provided workstream updates, metrics, and recommendations. 
Synthesize this into a "Executive Summary" style refinement. 
For each workstream, sharpen the 'update' to be more result-oriented. 
Rewrite the recommendations to be high-impact 'Power Moves'.
Ensure the tone is visionary and data-backed.
Return the response in JSON format with keys: workstreams (array of updates), and powerMoves (array).`;

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
        headline: "Accenture acquires Ookla to scale AI-driven network intelligence",
        source: "Accenture Newsroom • March 3, 2026",
        url: "https://newsroom.accenture.com/news/2026/accenture-to-acquire-ookla-to-strengthen-network-intelligence-and-experience-with-data-and-ai-for-enterprises",
        summary: "Integrating Speedtest and Downdetector data to optimize the 5G and Wi-Fi networks powering enterprise digital cores.",
        impact: "Direct threat to WWT's role in optimizing mission-critical connectivity for AI infrastructure.",
        counter: "Showcase WWT’s ATC multi-vendor testing to prove network resilience beyond simple benchmarking.",
        industry: "Telecommunications",
        topic: "AI Network Intelligence"
    },
    "deloitte": {
        headline: "Deloitte unveils Physical AI solutions with NVIDIA Omniverse",
        source: "Deloitte Global • March 3, 2026",
        url: "https://www.deloitte.com/global/en/about/press-room/physical-ai-nvidia-omniverse-industrial-transformation.html",
        summary: "Scaling 'embodied AI'—moving AI from digital pilots into physical robotics and digital twin simulations.",
        impact: "Aggressive move into the 'Simulation-to-Reality' space where WWT traditionally leads via staging.",
        counter: "Position the WWT ATC as the premier site for physical validation of Deloitte's digital simulations.",
        industry: "Manufacturing",
        topic: "Physical AI & Robotics"
    },
    "insight": {
        headline: "Insight highlights AI & Multicloud focus at Raymond James Conference",
        source: "Insight Investor News • March 8, 2026",
        url: "https://investor.insight.com/news-releases/default.aspx",
        summary: "Pivot toward higher-margin AI services and cybersecurity to offset traditional hardware reseller pressure.",
        impact: "Insight is transitioning from a partner to a direct competitor in AI services and multicloud orchestration.",
        counter: "Highlight WWT's deeper engineering bench and 'Lab-as-a-Service' vs. Insight's reseller-heavy heritage.",
        industry: "Financial Services", // Often mapped to their Raymond James focus
        topic: "Multicloud AI Services"
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

const reportingDB = {
    "q1-ai-launch": {
        spend: "$450,000",
        mqls: "1,240",
        pipeline: "$3.8M",
        roi: "8.4x",
        status: "High Performance",
        insight: "The Q1 Global AI Launch is significantly outperforming benchmarks in the EMEA region, primarily driven by the 'Sovereign Cloud' webinar series which maintained a 42% attendance-to-MQL conversion rate."
    },
    "cyber-range-promo": {
        spend: "$125,000",
        mqls: "410",
        pipeline: "$1.2M",
        roi: "9.6x",
        status: "Optimal Efficiency",
        insight: "Cyber Range promotions are seeing lower volume but significantly higher intent. 1 in 4 MQLs from this campaign are converting to SQLs within 14 days, the fastest velocity in the current portfolio."
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
    "industry-sync": {
        pageTitle: "Latest Strategy Sync",
        url: "https://www.wwt.com/atc-innovation",
        draft: {
            subject: "Strategy Update: [INDUSTRY] - [TITLE]",
            body: "Hi [First_Name],\n\nFollowing our analysis of the [INDUSTRY] landscape, I wanted to share the validation work we've been doing in the ATC. We've developed a new framework specifically addressing:\n\n[SECTION_1]\n\nThis approach directly aligns with the current trend regarding [TREND]. Would you be open to a brief call to see how this architecture could scale for your team?\n\nBest,\n[Your Name]"
        }
    },
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
        industry: "Healthcare",
        gap: "Clinical AI Orchestration",
        trend: "74% surge in 'Hospital-at-Home' and 'AI-Imaging' infrastructure.",
        opportunity: "WWT can lead by validating MLOps blueprints for clinical edge compute in the ATC.",
        formats: {
            "Whitepaper": {
                title: "The Hospital Without Walls: Scaling Clinical AI to the Edge",
                sections: [
                    "DECENTRALIZED CARE MODELS: Analyzing the transition from centralized data centers to bedside compute pods. Focus on maintaining data integrity via Cisco SD-WAN and AppDynamics visibility.",
                    "LATENCY-CRITICAL INFERENCE: Optimizing NVIDIA Clara workloads for real-time patient vitals. Validating sub-millisecond response times for critical care AI models through hardware-level tuning in the ATC.",
                    "ZERO TRUST IO_MT: Securing the medical perimeter. Implementation of micro-segmentation for connected medical devices to prevent lateral threat movement, validated in the WWT Cyber Range.",
                    "MULTIVENDOR ATC BLUEPRINT: The physical truth of integration. Validating interoperability of Pure Storage and Cisco UCS for high-speed medical imaging retrieval and archival."
                ]
            },
            "Case Study": {
                title: "Case Study: Reducing Radiology Latency by 40% with Edge AI",
                sections: [
                    "THE CHALLENGE: A regional health network faced 15-second delays in AI-assisted stroke detection due to cloud latency bottlenecks.",
                    "ATC VALIDATION: WWT engineers staged a multi-vendor stack using NVIDIA GPUs and Dell PowerEdge to mirror the client's high-traffic environment.",
                    "THE SOLUTION: Implementation of an 'Edge-First' inference engine that processed imaging locally before syncing to the clinical core.",
                    "RESULTS: Achieved a 40% reduction in time-to-diagnosis and 100% HIPAA compliance for data in transit."
                ]
            },
            "POV": {
                title: "Strategy: Why Clinical Edge is the New Standard for Patient Outcomes",
                sections: [
                    "MARKET SHIFT: The transition from 'Digital Records' to 'Active Intelligence' requires a fundamental rethink of hospital infrastructure.",
                    "THE WWT STANCE: Infrastructure is not a commodity; it is the clinical foundation. We believe speed-of-light constraints dictate an edge-heavy architecture.",
                    "RISK MITIGATION: How to avoid the 'Pilot Purgatory' by validating security and scale in a sandbox environment before clinical deployment.",
                    "INVESTMENT ROADMAP: Prioritizing high-ROI use cases like automated vitals monitoring and surgical robotics."
                ]
            }
        }
    },
    "energy": {
        industry: "Energy & Utilities",
        gap: "OT/IT Convergence Security",
        trend: "Federal mandates for 'Grid Cybersecurity' and 'Green Hydrogen' pilots.",
        opportunity: "Leverage ATC Digital Twin simulations to show the 'Physical Truth' of grid attacks.",
        formats: {
            "Whitepaper": {
                title: "Hardening the Grid: A Blueprint for OT/IT AI Integration",
                sections: [
                    "THE OT/IT DIVIDE: Bridging legacy operational technology with modern AI analytics. Strategies for data extraction from substations without compromising NERC CIP compliance.",
                    "RUGGEDIZED COMPUTE: Deploying AI at the substation level. Analyzing Cisco industrial Ethernet stacks designed for harsh conditions, tested for heat and vibration in WWT labs.",
                    "CYBER RANGE SIMULATION: Utilizing the WWT Cyber Range to simulate 'Black Sky' events. Testing AI-driven threat detection against simulated ransomware attacks on SCADA systems.",
                    "GRID MODERNIZATION ROI: Building the business case for AI-driven predictive maintenance. Using sensor data to extend the lifecycle of aging assets through digital twin modeling."
                ]
            },
            "Case Study": {
                title: "Case Study: Defending Critical Utility Infrastructure via Digital Twin",
                sections: [
                    "THE CHALLENGE: A major utility needed to validate their response to targeted PLC-level ransomware without taking the grid offline.",
                    "ATC VALIDATION: WWT created a physical-to-digital twin of the utility’s substation environment in the Cyber Range.",
                    "THE SOLUTION: Deployment of AI-driven anomaly detection that identified the lateral move of the threat within 12 seconds.",
                    "RESULTS: Prevented a simulated 4-hour blackout and established a new NERC-CIP compliance reporting framework."
                ]
            },
            "POV": {
                title: "Strategy: The Future of Energy is Resilient, Autonomous, and Hybrid",
                sections: [
                    "THE DECARBONIZATION CRISIS: Renewable integration introduces grid instability that traditional manual controls cannot manage.",
                    "THE WWT STANCE: Secure AI at the edge is the only way to balance the load of a decentralized, carbon-neutral energy grid.",
                    "BEYOND COMPLIANCE: Moving from 'Check-the-box' security to 'Always-on' resilience via automated threat hunting.",
                    "FUTURE PROOFING: Why modular, vendor-agnostic infrastructure is the key to surviving the next decade of energy transition."
                ]
            }
        }
    },
    "finance": {
        industry: "Financial Services",
        gap: "Multicloud AI Governance",
        trend: "Shift toward 'Real-Time Payment' security and 'Quantum-Safe' encryption.",
        opportunity: "Banks struggle with GPU costs and data sovereignty; WWT leads with AI Infrastructure FinOps.",
        formats: {
            "Whitepaper": {
                title: "The Secure Vault: High-Performance AI for Modern Finance",
                sections: [
                    "MULTICLOUD DATA SOVEREIGNTY: Solving the compliance crisis. How WWT integrates NetApp and Snowflake to ensure sensitive data remains governed while enabling rapid model iteration.",
                    "LOW-LATENCY FRAUD: Running AI inference at the transaction point. Utilizing NVIDIA H100 clusters validated in the ATC to identify anomalies in milliseconds without affecting UX.",
                    "QUANTUM READINESS: Preparing for post-quantum cryptographic standards. Analyzing the impact of Q-day on encryption and testing hardware-based security modules (HSMs) in the ATC.",
                    "HYBRID CLOUD FINOPS: Balancing core banking data with public cloud AI. Strategies for reducing TCO of massive GPU clusters through intelligent resource scheduling."
                ]
            },
            "Case Study": {
                title: "Case Study: Scaling Fraud Detection for 100M+ Daily Transactions",
                sections: [
                    "THE CHALLENGE: A global bank's fraud detection latency was causing checkout abandonment at high-volume retail periods.",
                    "ATC VALIDATION: Staging a full-stack high-frequency trading environment to benchmark AI inference at the network edge.",
                    "THE SOLUTION: Implementation of high-throughput NVIDIA TensorRT engines integrated into the existing transaction switch.",
                    "RESULTS: Reduced false positives by 22% and increased transaction throughput by 4x with zero increase in latency."
                ]
            },
            "POV": {
                title: "Strategy: Why Sovereignty is the Next Frontier of Financial AI",
                sections: [
                    "THE DATA DILEMMA: Banks want the power of LLMs but cannot risk data leakage into public foundation models.",
                    "THE WWT STANCE: Private AI Infrastructure is the only viable path for the Tier 1 banking sector to maintain regulatory trust.",
                    "FINOPS REALITY: AI costs are spiraling out of control. Organizations must move from 'Unlimited Spend' to 'Optimized Inference'.",
                    "ROADMAP: Building a multi-generational plan for Quantum-Safe encryption before the hardware arrives."
                ]
            }
        }
    },
    "telco": {
        industry: "Telecommunications",
        gap: "AI-Native Network Intelligence",
        trend: "Massive investment in 5G SA and 'Autonomous' network management.",
        opportunity: "Use the ATC to showcase how AI-driven network intelligence optimizes real-time QoS.",
        formats: {
            "Whitepaper": {
                title: "Connected Intelligence: AI-Native Foundations for 5G",
                sections: [
                    "NETWORK SLICING: AI-driven resource allocation for enterprise 5G. Using the ATC to simulate high-density environments and validate dynamic bandwidth steering for mission-critical apps.",
                    "RAN EFFICIENCY: Reducing energy consumption via intelligent beamforming. How AI-native network stacks can lower operational costs by powering down components during low-traffic periods.",
                    "EDGE MONETIZATION: Building low-latency application stacks for smart cities. Validating the integration of Dell PowerEdge and VMware Telco Cloud for distributed MEC deployments.",
                    "VENDOR INTEROP: The WWT advantage in Open RAN. Testing the 'Plug-and-Play' reality of O-RAN components from different vendors to ensure carrier-grade performance."
                ]
            },
            "Case Study": {
                title: "Case Study: Deploying the World's First AI-Native O-RAN Fabric",
                sections: [
                    "THE CHALLENGE: A Tier 1 carrier needed to integrate four different radio vendors into a single automated management plane.",
                    "ATC VALIDATION: The WWT Open RAN Foundry was used to benchmark interoperability and energy efficiency across the stack.",
                    "THE SOLUTION: A cloud-native RAN Intelligent Controller (RIC) that dynamically optimizes radio traffic based on AI predictions.",
                    "RESULTS: 30% reduction in power consumption and successful 'plug-and-play' integration of non-proprietary hardware."
                ]
            },
            "POV": {
                title: "Strategy: The Evolution from Connectivity Provider to AI Orchestrator",
                sections: [
                    "THE REVENUE GAP: Telcos are struggling to monetize 5G as a 'dumb pipe'. The value is now in the intelligence layer.",
                    "THE WWT STANCE: The network is the computer. Carriers must own the edge-compute layer to capture the enterprise AI market.",
                    "OPEN ARCHITECTURES: Why proprietary 'black box' hardware is the biggest threat to carrier agility in the 2030s.",
                    "EXECUTION: How to build a partner ecosystem that supports multi-vendor, AI-native network growth."
                ]
            }
        }
    },
    "manufacturing": {
        industry: "Manufacturing",
        gap: "The Sim-to-Real Chasm",
        trend: "Transition from digital pilots to 'Physical AI' in operational environments.",
        opportunity: "WWT ATC serves as the physical validation site for NVIDIA Omniverse and industrial robotics simulations.",
        formats: {
            "Whitepaper": {
                title: "Factory of the Future: Scaling Physical AI with Industrial Digital Twins",
                sections: [
                    "EMBODIED INTELLIGENCE: Moving AI from digital pilots into physical robotics. Strategies for integrating NVIDIA Omniverse simulations with factory floor automation.",
                    "STAGING THE EDGE: Utilizing WWT’s global supply chain to pre-configure physical AI nodes before deployment in harsh industrial environments.",
                    "INDUSTRIAL CYBERSECURITY: Securing the robotics perimeter. Implementing micro-segmentation for OT assets to ensure physical AI agents cannot be compromised by lateral threats.",
                    "OT DATA PIPELINES: Extracting high-frequency sensor data for real-time model training. Bridging the gap between legacy PLC hardware and modern GPU-accelerated stacks."
                ]
            },
            "Case Study": {
                title: "Case Study: Reducing Factory Downtime via Physical AI Twins",
                sections: [
                    "THE CHALLENGE: An automotive manufacturer faced 12% unplanned downtime due to sensor failures in legacy assembly line robots.",
                    "ATC VALIDATION: WWT mirrored the assembly line using industrial edge sensors and an NVIDIA Omniverse digital twin.",
                    "THE SOLUTION: Deployment of 'Embodied AI' that predicts physical wear-and-tear and automatically schedules maintenance during off-shifts.",
                    "RESULTS: Unplanned downtime reduced to <1% and overall equipment effectiveness (OEE) improved by 18%.",
                ]
            },
            "POV": {
                title: "Strategy: Moving AI from the Cloud to the Factory Floor",
                sections: [
                    "THE PHYSICAL REALITY: AI in manufacturing fails when it doesn't account for gravity, friction, and environmental heat.",
                    "THE WWT STANCE: You cannot deploy industrial AI without physical lab validation. Simulation is just the first step.",
                    "SUPPLY CHAIN INTEGRATION: Why logistics and staging are just as important as the neural network architecture.",
                    "THE LEADERSHIP GAP: Bridging the cultural divide between the 'Software' IT team and the 'Hardware' OT team."
                ]
            }
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
    // ACTIVE AGENTS
    { id: 'intel', name: 'Competitor Intel', cat: 'Strategy', icon: 'shield', status: 'active' },
    { id: 'industry', name: 'Industry Agent', cat: 'Portfolio', icon: 'factory', status: 'active' },

    // COMING SOON
    { id: 'email', name: 'Email Draft', cat: 'Campaigns', icon: 'mail', status: 'soon' },

    // DEVELOPMENT BACKLOG (CANDIDATES - Mapped to Image)
    { 
        id: 'reporting', 
        name: 'Performance Agent', 
        cat: 'Revenue', 
        icon: 'bar-chart-3', 
        status: 'candidate',
        desc: 'Automated ROI & Pipeline Attribution synthesis.',
        solves: 'Eliminates manual H1 marketing-to-revenue reporting.'
    },
    { 
        id: 'readout', 
        name: 'Readout Agent', 
        cat: 'Marketing Ops', 
        icon: 'file-text', 
        status: 'candidate',
        desc: 'AI-generated weekly executive summaries.',
        solves: 'Consolidates cross-team signals into a single source of truth.'
    },
    { 
        id: 'utm', 
        name: 'UTM Builder', 
        cat: 'Digital', 
        icon: 'link', 
        status: 'candidate',
        desc: 'Governance-first campaign link generator.',
        solves: 'Fixes fragmented data caused by inconsistent tagging.'
    },
    { 
        id: 'seo', 
        name: 'SEO Search', 
        cat: 'Growth', 
        icon: 'search', 
        status: 'candidate',
        desc: 'Identifies high-intent ATC keyword gaps.',
        solves: 'Captures untapped organic search demand.'
    },
    { 
        id: 'icp', 
        name: 'ICP Agent', 
        cat: 'Portfolio', 
        icon: 'target', 
        status: 'candidate',
        desc: 'Refines Ideal Customer Profile targets.',
        solves: 'Aligns sales and marketing on high-propensity accounts.'
    },
    { 
        id: 'revenue', 
        name: 'Revenue Intel', 
        cat: 'Portfolio', 
        icon: 'pie-chart', 
        status: 'candidate',
        desc: 'Predictive modeling for deal velocity.',
        solves: 'Reduces slippage in the bottom-of-funnel pipeline.'
    }
];


// Initialize popularity data
let candidateInterest = {
    'reporting': 42,
    'readout': 28,
    'utm': 15,
    'seo': 12,
    'icp': 9,
    'revenue': 5
};

function init() {
    const grid = document.getElementById('agent-grid');
    if (!grid) return;

    // Standard 3-column layout for the Top Row
    grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 w-full";

    const sortedCandidates = agents
        .filter(a => a.status === 'candidate')
        .sort((a, b) => (candidateInterest[b.id] || 0) - (candidateInterest[a.id] || 0));

    // Helper: Active/Soon Cards
   // Inside your init() function, update this helper:
const createActiveCard = (a) => {
    const isActive = a.status === 'active';
    const isSoon = a.status === 'In Dev';
    const activeDot = isActive ? `<span class="absolute top-3 left-3 flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>` : "";
    const badge = isSoon ? `<span class="absolute top-3 right-3 text-[7px] bg-slate-900 text-blue-400 px-1.5 py-0.5 rounded uppercase font-black border border-blue-500/20">Soon</span>` : "";

    return `
        <div class="h-44 p-6 flex flex-col items-center justify-center text-center transition-all relative group border-2 rounded-2xl ${isActive ? 'border-blue-500/50 hover:border-blue-400 bg-slate-900/50 cursor-pointer shadow-lg shadow-blue-500/5' : 'border-slate-800/60 bg-slate-900/10 opacity-70 cursor-not-allowed'}" 
             onclick="${isActive ? `launchAgent('${a.id}')` : ''}">
            ${activeDot} ${badge}
            <div class="w-12 h-12 mb-3 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center ${isActive ? 'group-hover:bg-blue-600 group-hover:text-white' : ''} transition-all">
                <i data-lucide="${a.icon}" class="w-6 h-6"></i>
            </div>
            <h4 class="text-[10px] font-bold ${isActive ? 'text-slate-200' : 'text-slate-500'} uppercase tracking-widest px-2">${a.name}</h4>
            <span class="text-[8px] text-slate-600 mt-1 uppercase font-medium tracking-tighter">${a.cat}</span>
        </div>
    `;
};

    // Helper: Potential Future Candidate Row
    const createCandidateRow = (a) => `
        <div class="col-span-1 md:col-span-3 flex items-center justify-between p-4 px-6 border border-slate-800/40 rounded-xl opacity-40 hover:opacity-90 transition-all cursor-pointer bg-slate-950/30 group mb-2"
             onclick="logInterest('${a.id}')">
            <div class="flex items-center gap-6 flex-1">
                <div class="p-2 rounded-lg bg-slate-900 group-hover:bg-slate-800 transition-colors">
                    <i data-lucide="${a.icon}" class="w-4 h-4 text-slate-500 group-hover:text-blue-400"></i>
                </div>
                <div class="flex flex-col md:flex-row md:items-center gap-8 text-left">
                    <div class="w-32">
                        <h4 class="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-tight">${a.name}</h4>
                        <span class="text-[7px] text-slate-700 font-bold uppercase tracking-tighter">Potential</span>
                    </div>
                    <div class="flex flex-col border-l border-slate-800/50 pl-4">
                        <p class="text-[9px] text-slate-400 font-medium leading-tight">
                            <span class="text-slate-600 uppercase text-[7px] font-black mr-1">Impact:</span> ${a.desc}
                        </p>
                        <p class="text-[8px] text-slate-500 italic mt-0.5">
                            <span class="text-slate-700 uppercase text-[7px] font-black not-italic mr-1">Solves:</span> ${a.solves}
                        </p>
                    </div>
                </div>
            </div>
            <div class="text-right ml-4 min-w-[80px]">
                <span id="count-${a.id}" class="text-[10px] font-mono text-slate-600 group-hover:text-blue-400 uppercase font-black">
                    ${candidateInterest[a.id] || 0}
                </span>
                <div class="text-[6px] text-slate-700 uppercase tracking-tighter">Interest Logged</div>
            </div>
        </div>
    `;

    grid.innerHTML = `
        ${agents.filter(a => a.status === 'active' || a.status === 'soon').map(createActiveCard).join('')}

        <div class="col-span-1 md:col-span-3 mt-16 mb-4 px-2">
            <div class="flex items-center gap-4">
                <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap">Potential Future Candidates</h5>
                <div class="w-full h-[1px] bg-slate-800/40"></div>
            </div>
        </div>

        ${sortedCandidates.map(createCandidateRow).join('')}
    `;

    if (window.lucide) lucide.createIcons();
}

function logInterest(agentId) {
    // 1. Increment the data
    candidateInterest[agentId] = (candidateInterest[agentId] || 0) + 1;
    
    // 2. Target the specific counter ID we built in createCandidateRow
    const countEl = document.getElementById(`count-${agentId}`);
    
    if (countEl) {
        // 3. Update text with a quick color flash to show interaction
        countEl.innerText = candidateInterest[agentId];
        countEl.classList.remove('text-slate-600');
        countEl.classList.add('text-blue-400');
        
        // Reset color after a moment
        setTimeout(() => {
            countEl.classList.remove('text-blue-400');
            countEl.classList.add('text-slate-600');
        }, 500);
    }
    
    console.log(`📈 Popularity Data: +1 for ${agentId}. Total: ${candidateInterest[agentId]}`);
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
// Update this function in your app.js
async function callGemini(prompt) {
    if (!SESSION_AI_KEY) return null;

    try {
        const genAI = new GoogleGenerativeAI(SESSION_AI_KEY);
        
        // FIX: Using 'gemini-2.0-flash' which is the 2026 Free Tier standard
        // This resolves the "Model not found" 404 error.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash" 
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
        
    } catch (error) {
        console.error("Gemini API Primary Error:", error.message);
        
        // FALLBACK: Try the 'latest' alias if the specific version fails
        try {
            console.log("Attempting fallback to gemini-1.5-flash-latest...");
            const genAI = new GoogleGenerativeAI(SESSION_AI_KEY);
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await fallbackModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (fallbackError) {
            console.error("All Gemini models failed.");
            throw fallbackError; // This triggers your 'catch' in runReadout/runIndustry
        }
    }
}


// Call init when window loads
window.onload = init;


function launchAgent(id, context = null) {
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
    // Dynamically pull the strategy title from the Industry Agent's input field
    const activeTopic = document.getElementById('ind-title')?.value.replace('✨ ', '') || "Current Strategic Framework";

    content.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6">
            <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-4">
                    <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                    </button>
                    <div class="flex items-center gap-3">
                        <h3 class="text-xl font-bold text-white tracking-tight">Email Campaign Agent</h3>
                        <span class="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded tracking-widest">BETA</span>
                    </div>
                </div>
            </div>

            <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800/50 shadow-2xl space-y-5">
                <div class="flex items-center justify-between px-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Target Campaign Topic</label>
                </div>
                <div class="flex gap-4">
                    <input 
                        id="active-topic-input" 
                        type="text" 
                        readonly
                        value="${activeTopic}" 
                        class="flex-1 bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl text-blue-400 font-semibold text-base outline-none cursor-default shadow-inner"
                    >
                    <button onclick="runEmailDraft()" class="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center gap-3 group active:scale-95 shadow-lg shadow-blue-900/30">
                        <i data-lucide="wand-2" class="w-5 h-5 group-hover:rotate-12 transition-all"></i>
                        <span class="text-sm uppercase tracking-wider">Draft Special Send</span>
                    </button>
                </div>
            </div>

            <div id="email-result" class="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div class="bg-slate-900 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Campaign Draft Output</span>
                        <div id="edit-indicator" class="hidden text-[9px] font-bold text-orange-400 uppercase tracking-widest animate-pulse font-sans">Editing Mode Active</div>
                    </div>
                    
                    <div class="p-8 space-y-4 font-serif text-slate-300">
                        <div class="flex items-center gap-3">
                            <b class="text-slate-500 font-bold uppercase text-[10px] font-sans tracking-widest">Subject:</b>
                            <span id="eml-subject" contenteditable="false" class="text-sm font-sans text-white focus:outline-none px-1 rounded transition-colors"></span>
                        </div>
                        <hr class="border-slate-800/50">
                        <div id="eml-body" contenteditable="false" class="whitespace-pre-wrap leading-relaxed italic text-lg p-2 rounded focus:outline-none transition-all"></div>
                    </div>

                    <div class="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-between items-center px-6">
                         <div class="flex gap-6">
                            <button onclick="toggleEmailEdit()" id="edit-toggle-btn" class="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                                <i data-lucide="edit-3" class="w-3 h-3"></i> <span>Edit Content</span>
                            </button>
                            <button onclick="handleEmailCopy(this)" id="copy-btn" class="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                                <i data-lucide="copy" class="w-3 h-3"></i> <span>Copy Text</span>
                            </button>
                         </div>
                         <button onclick="simulatePush()" id="push-btn" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                            <i data-lucide="share-2" class="w-3 h-3"></i> Push to Marketo
                         </button>
                    </div>
                </div>
            </div>
        </div>`;
    
    if (window.lucide) lucide.createIcons();
}
    
       if (id === 'industry') {
        content.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                    <div class="flex items-center gap-4">
                        <button onclick="clearStage()" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <div>
                            <h3 class="text-xl font-bold text-white tracking-tight">Industry Content Architect</h3>
                            <p id="context-breadcrumb" class="text-[9px] text-blue-500 font-mono uppercase tracking-widest mt-1 hidden"></p>
                        </div>
                    </div>
                    
                    <div class="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        ${['Whitepaper', 'Case Study', 'POV'].map(type => `
                            <button onclick="setContentType('${type}')" id="btn-${type}" class="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${type === 'Whitepaper' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}">
                                ${type}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                    ${['healthcare', 'energy', 'finance', 'telco', 'manufacturing'].map(key => `
                        <button onclick="runIndustryAnalysis('${key}')" id="ind-btn-${key}" class="flex flex-col items-center gap-3 bg-slate-950 border border-slate-800/60 p-4 rounded-xl hover:border-blue-500/50 transition-all group overflow-hidden">
                            <div class="p-3 bg-slate-900 rounded-lg group-hover:bg-blue-600/10 transition-colors">
                                <i data-lucide="${
                                    key === 'healthcare' ? 'heart-pulse' : 
                                    key === 'energy' ? 'zap' : 
                                    key === 'finance' ? 'landmark' : 
                                    key === 'telco' ? 'rss' : 'factory'
                                }" class="w-5 h-5 text-slate-500 group-hover:text-blue-400"></i>
                            </div>
                            <span class="text-[9px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-white truncate w-full text-center">${key}</span>
                        </button>
                    `).join('')}
                </div>

                <div id="industry-result" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-4 space-y-6">
                        <div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div class="inline-flex px-2 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded">Target Gap</div>
                            <h2 id="ind-gap" class="text-2xl font-bold text-white leading-tight"></h2>
                            <p id="ind-trend" class="text-xs text-slate-500 italic"></p>
                        </div>
                        <div class="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl">
                            <h5 class="text-blue-400 text-[10px] font-black uppercase mb-3">The Opportunity</h5>
                            <p id="ind-opp" class="text-white text-sm leading-relaxed"></p>
                        </div>
                    </div>
                    <div class="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div class="bg-slate-950 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <span class="text-[9px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md font-bold uppercase">Draft Editor</span>
                            </div>
                            <button onclick="launchAgent('email')" class="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-blue-900/40">
                                <i data-lucide="mail" class="w-3 h-3"></i> Outreach
                            </button>
                        </div>
                        <div class="p-8 space-y-8">
                            <input id="ind-title" class="w-full bg-transparent text-2xl font-bold text-white border-b border-slate-800 focus:border-blue-500 outline-none pb-2">
                            <div id="ind-sections" class="space-y-6"></div>
                        </div>
                    </div>
                </div>
            </div>`;

        if (context) {
            const activeKey = INDUSTRY_KEY_MAP[context.industry] || context.industry.toLowerCase();
            setTimeout(() => runIndustryAnalysis(activeKey, context), 50);
        }
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

async function runCrawler() {
    const query = document.getElementById('intel-search').value.toLowerCase().trim();
    const display = document.getElementById('intel-display');
    const btn = document.querySelector('button[onclick="runCrawler()"]');
    
    // 1. BASELINE DATA & FALLBACKS
    let data = {
        headline: "Monitoring Competitive Signals for " + query,
        source: "Live Crawler • March 2026",
        url: "https://www.wwt.com",
        summary: "General market movement detected in the digital engineering sector.",
        impact: "Incremental pressure on talent acquisition and standard consulting rates.",
        counter: "Promote the ATC's 'Lab-as-a-Service' to highlight our physical engineering edge.",
        industry: "General Tech",
        topic: "AI Infrastructure"
    };

    // Check internal DB for curated signals
    if (competitorIntelDB[query]) { 
        data = JSON.parse(JSON.stringify(competitorIntelDB[query])); 
    }

    // 2. AI STRATEGIC ENHANCEMENT
    if (AI_ENABLED && SESSION_AI_KEY) {
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Analyzing...`;
        btn.disabled = true;

        const context = `Competitor: ${query}. Move: ${data.headline}. Standard counter: ${data.counter}`;
        const prompt = `${INTEL_AI_PROMPT}\n\nContext: ${context}`;

        try {
            const aiResponse = await callGemini(prompt);
            if (aiResponse) {
                const lines = aiResponse.split('\n');
                // Capture the Play (Line 1)
                data.counter = lines[0].replace('Play:', '').replace(/[".]/g, '').trim();
                
                // Capture the Trigger (Line 2)
                const triggerLine = lines.find(l => l.includes('Trigger:'));
                if (triggerLine) {
                    const [ind, top] = triggerLine.replace('Trigger:', '').split('|');
                    data.industry = ind.trim();
                    data.topic = top.trim();
                }
            }
        } catch (e) {
            console.log("Intel AI Fallback active: Using standard DB counter.");
        }
        
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    }

    // 3. UI MAPPING & POPULATION
    const industryMap = {
        "Telecommunications": { icon: "rss" },
        "Healthcare": { icon: "heart-pulse" }, // Corrected icon name
        "Energy": { icon: "zap" },
        "Financial Services": { icon: "landmark" },
        "Manufacturing": { icon: "factory" }
    };

    const industryInfo = industryMap[data.industry] || { icon: "layout" };

    // Update basic fields
    document.getElementById('snap-source').innerText = data.source;
    document.getElementById('snap-headline').innerText = data.headline;
    document.getElementById('syn-summary').innerText = data.summary;
    document.getElementById('syn-impact').innerText = data.impact;
    document.getElementById('snap-link').href = data.url;

    // Update the Recommendation Box (The "Power Play")
    const counterEl = document.getElementById('syn-counter');
    counterEl.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-start gap-4">
                <div class="w-1.5 h-14 bg-green-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <p class="text-white font-bold text-xl leading-tight tracking-tight">
                    "${data.counter}"
                </p>
            </div>
            
            <div class="pt-2">
                <button onclick="launchAgent('industry', { industry: '${data.industry}', topic: '${data.topic}' })" 
                        class="group flex items-center gap-4 px-5 py-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-white transition-all shadow-xl hover:shadow-blue-500/5">
                    <div class="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <i data-lucide="${industryInfo.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="text-left">
                        <div class="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 mb-0.5">Recommended Action</div>
                        <div class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            Launch Industry Agent: ${data.industry}
                        </div>
                    </div>
                    <i data-lucide="arrow-right" class="w-4 h-4 ml-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"></i>
                </button>
            </div>
        </div>
    `;

    // Reveal and refresh icons
    display.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

async function runSEO(clusterId) {
    const data = seoIntentDB[clusterId];
    const resultArea = document.getElementById('seo-result');
    const insightEl = document.getElementById('seo-insight');
    const actionEl = document.getElementById('seo-action');
    
    // 1. POPULATE BASELINE DATA (Immediate)
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

    insightEl.innerText = data.insight;
    actionEl.innerText = data.action;

    // 2. AI ENHANCEMENT (The "Content Gap" Analysis)
    if (AI_ENABLED && SESSION_AI_KEY) {
        // Show a "Thinking" state for the AI section
        const originalAction = data.action;
        actionEl.innerHTML = `<span class="flex items-center gap-2 text-blue-400"><i data-lucide="sparkles" class="w-3 h-3 animate-pulse"></i> Gemini is auditing content gaps...</span>`;

        const context = `Cluster: ${clusterId}. Keywords: ${data.organic.join(', ')}. Internal Links: ${data.internal.join(', ')}.`;
        const prompt = `${SEO_AI_PROMPT}\n\nContext: ${context}`;

        try {
            const aiResponse = await callGemini(prompt);
            if (aiResponse) {
                // Combine the standard action with the AI's "Bonus" Gap analysis
                actionEl.innerHTML = `
                    <div class="space-y-2">
                        <p>${originalAction}</p>
                        <div class="pt-2 border-t border-blue-500/20">
                            <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">AI Strategic Gap Found:</span>
                            <span class="text-blue-200 italic">"${aiResponse.replace(/[".]/g, '')}"</span>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.log("SEO AI Bypassed.");
            actionEl.innerText = originalAction;
        }
    }

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

async function runRevenue(key) {
    const data = revenueDB[key];
    const resultArea = document.getElementById('rev-result');
    const timeline = document.getElementById('rev-timeline');
    
    // 1. POPULATE BASELINE (Immediate & Colorful)
    // We use hardcoded classes to ensure desktop renders them correctly
    timeline.innerHTML = data.journey.map((step, i) => `
        <div class="relative pl-8 border-l-2 border-slate-800 pb-6 last:pb-0">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 ${step.type === 'Conversion' ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-indigo-500'}"></div>
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors">
                <div>
                    <span class="text-[10px] font-bold ${step.type === 'Conversion' ? 'text-emerald-400' : 'text-indigo-400'} uppercase tracking-widest">${step.type}</span>
                    <h5 class="text-white font-bold text-sm mt-0.5">${step.event}</h5>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-[10px] text-slate-500 font-mono">${step.date}</span>
                    <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[9px] font-bold border border-slate-700">${step.source}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Default Baseline Text
    document.getElementById('rev-insight').innerText = "Analyzing touchpoint influence...";
    document.getElementById('rev-rec').innerText = "Identifying next step...";
    
    resultArea.classList.remove('hidden');

    // 2. AI ENHANCEMENT
    if (typeof AI_ENABLED !== 'undefined' && AI_ENABLED && SESSION_AI_KEY) {
        try {
            // Update to gemini-2.0-flash to avoid the 404 error
            const context = `Journey: ${JSON.stringify(data.journey)}`;
            const aiResponse = await callGemini(`${REVENUE_AI_PROMPT}\n\nContext: ${context}`);
            
            if (aiResponse) {
                const [conclusion, action] = aiResponse.split('Action:');
                
                document.getElementById('rev-insight').innerHTML = `
                    <span class="text-emerald-200 opacity-60 text-[8px] block mb-1">REFINED BY AI</span>
                    ${conclusion.replace('Conclusion:', '').trim()}
                `;
                document.getElementById('rev-rec').innerText = action ? action.trim() : "Follow up immediately.";
            }
        } catch (e) {
            console.warn("Revenue AI Error - Staying with baseline insights.");
            document.getElementById('rev-insight').innerText = "Data-driven attribution complete. Ready for executive review.";
        }
    }

    if (window.lucide) lucide.createIcons();
}

async function runICP(key) {
    const data = icpDB[key];
    const resultArea = document.getElementById('icp-result');
    const strategyEl = document.getElementById('icp-strategy');
    
    // 1. POPULATE BASELINE SIGNALS & PROFILE (Immediate)
    document.getElementById('icp-signals').innerHTML = data.signals.map(s => `
        <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <i data-lucide="activity" class="w-3 h-3 text-indigo-500"></i>
            <span class="text-xs text-slate-300 font-mono">${s}</span>
        </div>
    `).join('');

    document.getElementById('icp-title').innerText = data.title;
    document.getElementById('icp-industry').innerText = data.attributes.industry;
    document.getElementById('icp-tech').innerText = data.attributes.techStack;
    
    // Set default strategy from DB
    let finalStrategy = data.strategy;
    strategyEl.innerText = finalStrategy;

    // 2. AI STRATEGIC HOOK (The "Pinch of AI")
    if (AI_ENABLED && SESSION_AI_KEY) {
        // Visual cue for AI processing
        strategyEl.innerHTML = `<span class="flex items-center gap-2 text-indigo-400"><i data-lucide="shield-check" class="w-3 h-3 animate-pulse"></i> Gemini generating executive hook...</span>`;
        if (window.lucide) lucide.createIcons();

        const context = `Industry: ${data.attributes.industry}. Tech: ${data.attributes.techStack}. Strategy: ${data.strategy}`;
        const prompt = `${ICP_AI_PROMPT}\n\nContext: ${context}`;

        try {
            const aiResponse = await callGemini(prompt);
            if (aiResponse) {
                // Update with the "AI Sales Hook"
                strategyEl.innerHTML = `
                    <div class="space-y-2">
                        <p class="text-slate-400 text-xs">${finalStrategy}</p>
                        <div class="pt-3 border-t border-indigo-500/20">
                            <span class="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">AI Executive Hook:</span>
                            <p class="text-white font-bold leading-snug">"${aiResponse.replace(/[".]/g, '').trim()}"</p>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.log("ICP AI Fallback active.");
            strategyEl.innerText = finalStrategy;
        }
    }

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

async function runRevenue(key) {
    const data = revenueDB[key];
    const resultArea = document.getElementById('rev-result');
    const insightEl = document.getElementById('rev-insight');
    const recEl = document.getElementById('rev-rec');
    
    // 1. POPULATE TIMELINE (Immediate & Hardcoded)
    document.getElementById('rev-timeline').innerHTML = data.touches.map((t, i) => `
        <div class="flex items-start gap-4 animate-in slide-in-from-left duration-300" style="animation-delay: ${i * 100}ms">
            <div class="flex flex-col items-center">
                <div class="w-8 h-8 rounded-full ${t.impact === 'Critical' ? 'bg-emerald-500' : 'bg-slate-800'} flex items-center justify-center text-[10px] font-bold text-white z-10">${i+1}</div>
                ${i < data.touches.length - 1 ? '<div class="w-0.5 h-10 bg-slate-800"></div>' : ''}
            </div>
            <div class="flex-1 bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex justify-between items-center transition-all hover:border-emerald-500/30">
                <div>
                    <p class="text-[9px] text-slate-500 font-bold uppercase">${t.date}</p>
                    <p class="text-white text-sm font-bold">${t.event}</p>
                </div>
                <span class="text-[8px] font-black uppercase ${t.impact === 'Critical' ? 'text-emerald-400' : 'text-slate-500'}">${t.impact} Impact</span>
            </div>
        </div>
    `).join('');

    // Set defaults from DB
    insightEl.innerText = data.insight;
    recEl.innerText = data.recommendation;

    // 2. AI VELOCITY ANALYSIS (The "Pinch of AI")
    if (AI_ENABLED && SESSION_AI_KEY) {
        // Show AI status on the recommendation card
        recEl.innerHTML = `<span class="flex items-center gap-2 text-emerald-400"><i data-lucide="zap" class="w-3 h-3 animate-pulse"></i> Gemini identifying deal velocity patterns...</span>`;
        if (window.lucide) lucide.createIcons();

        const journeySummary = data.touches.map(t => `${t.date}: ${t.event} (${t.impact})`).join(' -> ');
        const prompt = `${REV_AI_PROMPT}\n\nContext: ${journeySummary}`;

        try {
            const aiResponse = await callGemini(prompt);
            if (aiResponse) {
                // Style the AI recommendation to look premium
                recEl.innerHTML = `
                    <div class="space-y-1">
                        <span class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">AI Velocity Accelerator</span>
                        <p class="text-white font-bold italic">"${aiResponse.replace(/[".]/g, '').trim()}"</p>
                    </div>
                `;
            }
        } catch (e) {
            console.log("Revenue AI Bypassed.");
            recEl.innerText = data.recommendation;
        }
    }

    resultArea.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

// --- Drafting Logic ---
async function runEmailDraft() {
    const topicInput = document.getElementById('active-topic-input');
    const resultArea = document.getElementById('email-result');
    const btn = document.querySelector('button[onclick="runEmailDraft()"]');
    
    // Baseline template
    const template = emailDraftDB["industry-sync"];
    let subject = template.draft.subject;
    let body = template.draft.body;

    // Scrape real-time context from the Industry Agent UI
    const activeIndustry = document.getElementById('sync-industry-tag')?.innerText || "Strategic Solutions";
    const activeTopic = topicInput ? topicInput.value : "Case Study";
    const indTrend = document.getElementById('ind-trend')?.innerText || "market dynamics";
    const indSection1 = document.querySelector('#ind-sections textarea')?.value || "architecture and lab validation.";

    // Data injection
    subject = subject.replace('[INDUSTRY]', activeIndustry).replace('[TITLE]', activeTopic);
    body = body.replace('[INDUSTRY]', activeIndustry).replace('[SECTION_1]', indSection1).replace('[TREND]', indTrend);

    document.getElementById('eml-subject').innerText = subject;
    document.getElementById('eml-body').innerText = body;
    resultArea.classList.remove('hidden');

    if (AI_ENABLED) {
        const originalBtn = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 animate-spin"></i> Harmonizing...`;
        setTimeout(() => {
            document.getElementById('eml-subject').innerHTML = `<span class="text-blue-400">✨ </span>${subject}`;
            // Added "Gemini" text here so your simulatePush detects the AI Refinement
            document.getElementById('eml-body').innerHTML = `<span class="block text-blue-500 font-bold italic mb-3 border-b border-blue-500/10 pb-2 text-[9px] tracking-widest uppercase font-sans">AI Strategic Overlay Refined by Gemini 2.0</span>${body}`;
            btn.innerHTML = originalBtn;
            if (window.lucide) lucide.createIcons();
        }, 800);
    }
}

// --- Editing Helper ---
function toggleEmailEdit() {
    const body = document.getElementById('eml-body');
    const subject = document.getElementById('eml-subject');
    const indicator = document.getElementById('edit-indicator');
    const btnSpan = document.querySelector('#edit-toggle-btn span');

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

// --- Copy Helpers ---
function copyLine(text, btn) {
    navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-green-500"></i>`;
    lucide.createIcons();
    setTimeout(() => { btn.innerHTML = original; lucide.createIcons(); }, 2000);
}

function handleEmailCopy(btn) {
    const subject = document.getElementById('eml-subject').innerText;
    const body = document.getElementById('eml-body').innerText;
    const fullText = `Subject: ${subject}\n\n${body}`;
    copyLine(fullText, btn);
}

// --- Marketo Sync Helper ---
function simulatePush() {
    const btn = document.getElementById('push-btn');
    btn.innerHTML = `<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Syncing...`;
    lucide.createIcons();
    
    setTimeout(() => {
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-slate-800');
        
        const isAIRefined = document.getElementById('eml-body').innerHTML.includes('Gemini');
        const label = isAIRefined ? "AI-Optimized Asset #9921" : "Standard Asset #9921";
        
        btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> Synced to Marketo ${label}`;
        lucide.createIcons();
        
        alert(`Success: ${isAIRefined ? 'AI-enhanced' : 'Standard'} email draft pushed to Marketo.`);
    }, 2000);
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


// Ensure this matches your existing DB keys (e.g., 'cloud-migration', 'edge-computing')
// Add 'key' as a parameter so buttons can pass "energy" or "healthcare"
let currentContentType = 'Whitepaper';

function setContentType(type) {
    // 1. Update global state
    currentContentType = type;

    // 2. Update UI: Toggle button styles
    ['Whitepaper', 'Case Study', 'POV'].forEach(t => {
        const btn = document.getElementById(`btn-${t}`);
        if (btn) {
            btn.classList.toggle('bg-blue-600', t === type);
            btn.classList.toggle('text-white', t === type);
            btn.classList.toggle('text-slate-500', t !== type);
        }
    });

    // 3. Re-run analysis for the currently active industry
    const activeBtn = document.querySelector('[id^="ind-btn-"].border-blue-500');
    if (activeBtn) {
        // Extract key from id (e.g., "ind-btn-finance" -> "finance")
        const activeKey = activeBtn.id.replace('ind-btn-', '');
        runIndustryAnalysis(activeKey);
    }
}

async function runIndustryAnalysis(key, externalData = null) {
    // 1. Key Resolution - Maps full names to DB keys
    const activeKey = INDUSTRY_KEY_MAP[key] || (key ? key.toLowerCase().split(' ')[0] : "healthcare");
    const data = industryGapDB[activeKey];
    
    if (!data) {
        console.error(`Industry key "${activeKey}" not found in industryGapDB`);
        return;
    }

    // Determine content format (Default to Whitepaper)
    const selectedFormat = (typeof currentContentType !== 'undefined') ? currentContentType : 'Whitepaper';
    const content = data.formats[selectedFormat] || data.formats['Whitepaper'];

    const resultArea = document.getElementById('industry-result');
    
    // 2. Update Breadcrumb & Visibility
    const breadcrumb = document.getElementById('context-breadcrumb');
    if (externalData && breadcrumb) {
        breadcrumb.innerText = `Focus: ${externalData.topic}`;
        breadcrumb.classList.remove('hidden');
    } else if (breadcrumb) {
        breadcrumb.classList.add('hidden');
    }

    // 3. Highlight the correct industry button
    document.querySelectorAll('[id^="ind-btn-"]').forEach(btn => {
        btn.classList.remove('border-blue-500', 'bg-blue-500/10');
        if (btn.id === `ind-btn-${activeKey}`) btn.classList.add('border-blue-500', 'bg-blue-500/10');
    });

    // 4. Baseline UI Population (Using formatted data from your DB)
    document.getElementById('ind-gap').innerText = data.gap;
    document.getElementById('ind-trend').innerText = data.trend;
    document.getElementById('ind-opp').innerText = data.opportunity;
    document.getElementById('ind-title').value = content.title;

    const sectionsContainer = document.getElementById('ind-sections');
    sectionsContainer.innerHTML = content.sections.map((s, i) => {
        const rowCount = selectedFormat === 'Whitepaper' ? 4 : 3;
        return `
            <div class="group space-y-2">
                <div class="flex items-center gap-3">
                    <span class="text-[9px] font-mono text-blue-500/50 font-bold italic">Module 0${i+1}</span>
                    <div class="h-px flex-1 bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>
                </div>
                <textarea class="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 text-sm text-slate-300 focus:border-blue-500/50 focus:bg-slate-950 outline-none transition-all resize-none leading-relaxed" rows="${rowCount}">${s}</textarea>
            </div>
        `;
    }).join('');

    resultArea.classList.remove('hidden');

    // 5. Mock AI Refinement for Demo
    // Since Gemini is off, we show the "Refining" state briefly to maintain the "AI-driven" vibe
    if (AI_ENABLED) {
        const titleInput = document.getElementById('ind-title');
        const finalTitle = content.title;
        
        titleInput.value = "AI is refining technical depth...";
        
        // Brief timeout to simulate "thought" before revealing the high-quality dummy text
        setTimeout(() => {
            titleInput.value = `✨ ${finalTitle}`;
            
            // Sync textareas if they were cleared or changed
            const textareas = document.querySelectorAll('#ind-sections textarea');
            textareas.forEach((area, index) => {
                area.value = content.sections[index];
            });
        }, 850);
    }
    
    if (window.lucide) lucide.createIcons();
}

async function runReadout() {
    const selector = document.getElementById('readout-selector');
    
    // FIX: Prevents the "null" crash. Defaults to the Mar 10 key if no selector found.
    const key = selector ? selector.value : "weekly-ops-mar-10"; 
    
    const data = readoutDB[key];
    if (!data) return console.error("Readout key not found:", key);

    const resultArea = document.getElementById('readout-result');
    const btn = document.querySelector('button[onclick="runReadout()"]');

    // --- 1. POPULATE BASELINE (Immediate & Fail-safe) ---
    
    // Build Workstreams (The core status table)
    document.getElementById('readout-workstreams').innerHTML = data.workstreams.map(w => `
        <div class="flex items-start justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div>
                <h6 class="text-white font-bold text-sm">${w.name}</h6>
                <p id="ws-update-${w.name.replace(/\s+/g, '')}" class="text-xs text-slate-400 mt-1">${w.update}</p>
            </div>
            <span class="text-[8px] font-black px-2 py-1 rounded border ${w.status === 'At Risk' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'} uppercase tracking-widest">${w.status}</span>
        </div>
    `).join('');

    // Build Recommendations List
    const recsList = document.getElementById('readout-recs');
    recsList.innerHTML = data.recommendations.map(r => `
        <li class="flex items-start gap-3 text-xs text-slate-300">
            <i data-lucide="arrow-right-circle" class="w-4 h-4 text-indigo-500 flex-shrink-0"></i>
            <span>${r}</span>
        </li>
    `).join('');

    // Build Metrics Panel
    document.getElementById('readout-metrics').innerHTML = `
        <div class="flex justify-between border-b border-indigo-400/30 pb-2"><span class="text-xs text-indigo-100 italic">MQL Growth</span><span class="text-white font-bold">${data.metrics.mql_growth}</span></div>
        <div class="flex justify-between border-b border-indigo-400/30 pb-2"><span class="text-xs text-indigo-100 italic">ATC Tours</span><span class="text-white font-bold">${data.metrics.atc_tours}</span></div>
        <div class="flex justify-between"><span class="text-xs text-indigo-100 italic">Budget Spent</span><span class="text-white font-bold">${data.metrics.budget_utilization}</span></div>
    `;

    // Reveal the container instantly
    resultArea.classList.remove('hidden');

    // --- 2. AI ENHANCEMENT (The Strategic Layer) ---
    if (typeof AI_ENABLED !== 'undefined' && AI_ENABLED && SESSION_AI_KEY) {
        const originalBtn = btn ? btn.innerHTML : null;
        if (btn) btn.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3 animate-spin"></i> Synthesizing...`;
        
        try {
            const context = JSON.stringify(data);
            const prompt = `${READOUT_AI_PROMPT}\n\nProject Data: ${context}`;
            
            // Using 'gemini-2.0-flash' to avoid the 404 error
            const aiResponse = await callGemini(prompt);
            const aiData = JSON.parse(aiResponse);

            if (aiData) {
                // Layer on AI "Power Moves" over the existing recs
                recsList.innerHTML += aiData.powerMoves.map(pm => `
                    <li class="flex items-start gap-3 text-xs text-blue-300 bg-blue-500/10 p-2 rounded border border-blue-500/30 mt-2 animate-pulse">
                        <i data-lucide="zap" class="w-3 h-3 text-yellow-400 flex-shrink-0"></i>
                        <span><b class="text-blue-400 uppercase text-[9px]">AI Strategic Pivot:</b> ${pm}</span>
                    </li>
                `).join('');
            }
        } catch (e) {
            console.warn("Readout AI Fallback: Displaying March 10 operational data only.");
        }
        if (btn) btn.innerHTML = originalBtn;
    }

    if (window.lucide) lucide.createIcons();
}

async function runReporting(key) {
    // 1. DYNAMIC KEY LOGIC
    const activeKey = key || "q1-ai-launch";
    const data = reportingDB[activeKey];
    
    if (!data) return console.error("Reporting key not found:", activeKey);

    const resultArea = document.getElementById('report-result');
    
    console.log(`🚀 Reporting Module: Synthesizing ${activeKey}...`);

    // 2. POPULATE BASELINE (Immediate & Colorful)
    document.getElementById('rep-spend').innerText = data.spend;
    document.getElementById('rep-mql').innerText = data.mqls;
    document.getElementById('rep-pipe').innerText = data.pipeline;
    document.getElementById('rep-roi').innerText = data.roi;
    document.getElementById('rep-status').innerText = data.status;
    document.getElementById('rep-insight').innerText = data.insight;

    // Reveal the hidden results
    resultArea.classList.remove('hidden');

    // 3. AI ENHANCEMENT (Optional Layer)
    if (typeof AI_ENABLED !== 'undefined' && AI_ENABLED && SESSION_AI_KEY) {
        // Find the button to show the loading state
        const btn = document.querySelector(`button[onclick*="${activeKey}"]`);
        const originalBtn = btn ? btn.innerHTML : null;
        if (btn) btn.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3 animate-spin"></i> Analyzing...`;

        try {
            const prompt = `Analyze this campaign performance: ${JSON.stringify(data)}. 
            Provide a 1-sentence executive "Power Insight" that sounds like a senior CMO strategy.`;
            
            // Using the gemini-2.0-flash fix we discussed
            const aiResponse = await callGemini(prompt);
            
            if (aiResponse) {
                document.getElementById('rep-insight').innerHTML = `
                    <span class="text-blue-400 font-bold block text-[10px] mb-2">✨ AI EXECUTIVE SUMMARY:</span>
                    ${aiResponse.trim()}
                `;
            }
        } catch (e) {
            console.warn("Reporting AI Fallback: Using database insights.");
        }
        if (btn) btn.innerHTML = originalBtn;
    }

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
