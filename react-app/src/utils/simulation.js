/* ============================================================
   ENVIRION – Simulation Constants (utils/simulation.js)
   EXACT copy from analyst.js — DO NOT MODIFY
   ============================================================ */

export const BHOSARI = [73.855, 18.625]; // [Lng, Lat]

export const STRATEGIES = [
  { id:'timber',   category:'positive', title:'Timber Construction', desc:'Replace concrete with timber.',      label:'% Adoption', max_co2:.35,  max_pol:.10, icon:'🏗️', color:'#8b5cf6' },
  { id:'cement',   category:'positive', title:'Green Cement',        desc:'Use low-clinker alternatives.',      label:'% Mix',       max_co2:.30,  max_pol:.05, icon:'🏭', color:'#06b6d4' },
  { id:'retrofit', category:'positive', title:'Retrofit Policy',     desc:'Renovate instead of demolish.',     label:'% Projects',  max_co2:.90,  max_pol:.60, icon:'🔧', color:'#10b981' },
  { id:'transport',category:'positive', title:'Public Transit',      desc:'Shift to light-rail/metro.',        label:'% Shift',     max_co2:.50,  max_pol:.40, icon:'🚇', color:'#f59e0b' },
  { id:'ev',       category:'positive', title:'EV Adoption',         desc:'Electrify vehicle fleet.',          label:'% Fleet',     max_co2:.65,  max_pol:.50, icon:'⚡', color:'#eab308' },
  { id:'trees',    category:'positive', title:'Urban Greening',      desc:'Expand tree canopy.',               label:'% Target',    max_co2:.15,  max_pol:.20, icon:'🌳', color:'#22c55e' },
  { id:'ccs',      category:'positive', title:'Industrial CCS',      desc:'Carbon capture on stacks.',         label:'% Stacks',    max_co2:.75,  max_pol:.30, icon:'🏭', color:'#ef4444' },
  { id:'parali',   category:'negative', title:'Parali Burning',      desc:'Source: 1 tonne = 1460kg CO₂',     label:'100s Tons',   max_co2:1.46, max_pol:.80, icon:'🔥', color:'#dc2626' }
];
