import { useState, useEffect, useRef } from "react";

const DEFAULT_AZKAR = {
  morning: [
    { id: "m1", arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", trans: "Asbahna wa asbahal mulku lillah", meaning: "We have reached the morning and all dominion belongs to Allah.", count: 1, hadith: "رواه أبو داود — يُقال عند الصباح." },
    { id: "m2", arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا", trans: "Allahumma bika asbahna wa bika amsayna", meaning: "O Allah, by You we reach the morning and by You we reach the evening.", count: 1, hadith: "رواه أبو داود (5068)" },
    { id: "m3", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", trans: "Subhan-Allahi wa bihamdihi", meaning: "Glory be to Allah and Praise is to Him.", count: 100, hadith: "مَن قالها مئة مرة مُحيت خطاياه وإن كانت مثل زَبَد البحر — رواه مسلم (2691)" },
    { id: "m4", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", trans: "La ilaha illallah wahdahu la sharika lah", meaning: "There is no god but Allah alone, with no partner.", count: 10, hadith: "مَن قالها عشر مرات كانت له عِدل عتق أربع رقاب — رواه مسلم (2693)" },
    { id: "m5", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ", trans: "Allahumma anta rabbi la ilaha illa ant", meaning: "O Allah, You are my Lord, there is no god but You.", count: 1, hadith: "سيد الاستغفار — رواه البخاري (6306)" },
    { id: "m6", arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي", trans: "Allahumma 'afini fi badani", meaning: "O Allah, grant me health in my body.", count: 3, hadith: "رواه أبو داود والترمذي — دعاء العافية." },
  ],
  evening: [
    { id: "e1", arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", trans: "Amsayna wa amsal mulku lillah", meaning: "We have reached the evening and all dominion belongs to Allah.", count: 1, hadith: "رواه أبو داود (5068)" },
    { id: "e2", arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", trans: "Allahumma bika amsayna wa bika asbahna", meaning: "O Allah, by You we reach the evening and by You we reach the morning.", count: 1, hadith: "رواه أبو داود (5068)" },
    { id: "e3", arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", trans: "A'udhu bikalimatillahit-tammati min sharri ma khalaq", meaning: "I seek refuge in the perfect words of Allah from the evil of what He has created.", count: 3, hadith: "مَن قالها ثلاثاً لم تضرّه حُمة تلك الليلة — رواه الترمذي (3604)" },
    { id: "e4", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ", trans: "Bismillahilladhi la yadurru ma'a ismihi shay'", meaning: "In the name of Allah with whose name nothing can cause harm.", count: 3, hadith: "مَن قالها ثلاثاً لم تُصبه فجأة بلاء — رواه أبو داود (5088)" },
    { id: "e5", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", trans: "Subhan-Allahi wa bihamdihi", meaning: "Glory be to Allah and Praise is to Him.", count: 33, hadith: "رواه مسلم — تمحو الخطايا." },
  ],
  afterPrayer: [
    { id: "p1", arabic: "أَسْتَغْفِرُ اللَّهَ", trans: "Astaghfirullah", meaning: "I seek forgiveness from Allah.", count: 3, hadith: "كان النبي ﷺ إذا انصرف من الصلاة استغفر ثلاثاً — رواه مسلم (591)" },
    { id: "p2", arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ", trans: "Allahumma antas-salam wa minkas-salam", meaning: "O Allah, You are Peace and from You comes peace.", count: 1, hadith: "رواه مسلم (591)" },
    { id: "p3", arabic: "سُبْحَانَ اللَّهِ", trans: "Subhan-Allah", meaning: "Glory be to Allah.", count: 33, hadith: "مَن سبّح الله ثلاثاً وثلاثين... غُفرت خطاياه — رواه مسلم (597)" },
    { id: "p4", arabic: "الْحَمْدُ لِلَّهِ", trans: "Alhamdulillah", meaning: "All praise is due to Allah.", count: 33, hadith: "رواه مسلم (597) — بعد كل صلاة مكتوبة." },
    { id: "p5", arabic: "اللَّهُ أَكْبَرُ", trans: "Allahu Akbar", meaning: "Allah is the Greatest.", count: 33, hadith: "رواه مسلم (597)" },
    { id: "p6", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", trans: "La ilaha illallah wahdahu la sharika lah", meaning: "There is no god but Allah alone, with no partner.", count: 1, hadith: "غُفرت له ذنوبه وإن كانت مثل زَبَد البحر — رواه مسلم (597)" },
    { id: "p7", arabic: "آيَةُ الْكُرْسِيِّ", trans: "Ayat Al-Kursi (2:255)", meaning: "Recite Ayat Al-Kursi — the greatest verse in the Quran.", count: 1, hadith: "مَن قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت — رواه النسائي" },
  ],
};

const DEFAULT_TRAITS = [
  { id: "t1", icon: "✦", title: "Honesty (Sidq)", desc: "Consistency between one's inner beliefs, outer speech, and actions in all circumstances.", hadith: "عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ — رواه البخاري (6094)", reviewed: true },
  { id: "t2", icon: "⏳", title: "Patience (Sabr)", desc: "The ability to endure hardship or delay with tranquility and without complaint or loss of faith.", hadith: "مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ — رواه البخاري (1469)", reviewed: false },
  { id: "t3", icon: "🤲", title: "Generosity (Jud)", desc: "Giving freely of one's wealth, time, and knowledge to benefit others without seeking recognition.", hadith: "الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى — رواه البخاري (1429)", reviewed: false },
  { id: "t4", icon: "🌿", title: "Humility (Tawadu)", desc: "Acknowledging one's limitations and treating all human beings with equal respect and dignity.", hadith: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا — رواه مسلم (2588)", reviewed: true },
  { id: "t5", icon: "⚖️", title: "Justice ('Adl)", desc: "Upholding fairness and truth even if it goes against oneself, one's family, or interests.", hadith: "إِنَّ الْمُقْسِطِينَ عِنْدَ اللَّهِ عَلَى مَنَابِرَ مِنْ نُورٍ — رواه مسلم (1827)", reviewed: false },
  { id: "t6", icon: "🔒", title: "Trust (Amanah)", desc: "Being worthy of trust and fulfilling one's responsibilities and promises diligently.", hadith: "أَدِّ الْأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ — رواه أبو داود (3534)", reviewed: false },
  { id: "t7", icon: "💬", title: "Good Speech", desc: "Speaking words that are beneficial, kind, truthful and elevating to those who hear them.", hadith: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ — رواه البخاري (2989)", reviewed: false },
  { id: "t8", icon: "🛡️", title: "Modesty (Haya)", desc: "An inner sense of shyness and dignity that guards one from what displeases Allah.", hadith: "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ — رواه البخاري (6117)", reviewed: false },
];

const DEFAULT_NOTES = [
  { id: "n1", tag: "SURAH AL-KAHF", tagColor: "#4CAF50", title: "Morning Reflection", content: "The light between two Fridays. Thinking deeply about the cave and the preservation of faith in difficult times.", favorite: true, time: "2M AGO" },
  { id: "n2", tag: "HABITS", tagColor: "#C8A96E", title: "Nightly Adhkar", content: "Establishing a consistent routine before sleep. Using the 33-33-34 method for Tasbih.", favorite: false, time: "YESTERDAY" },
  { id: "n3", tag: "LECTURE", tagColor: "#7E9E7A", title: "Purification of Heart", content: "Summary of Imam Ghazali's teachings on envy and pride. The medicine is knowledge.", favorite: false, time: "JAN 12" },
];

const JUZ_NAMES = ["Al-Fatiha","Al-Baqarah","Al-Baqarah II","Al-Imran","Al-Nisa","Al-Nisa II","Al-Maidah","Al-An'am","Al-A'raf","Al-Anfal","Hud","Yusuf","Ibrahim","Al-Kahf","Al-Isra","Al-Kahf II","Al-Anbiya","Al-Mu'minun","Al-Furqan","An-Naml","Al-Ankabut","Al-Ahzab","Ya-Sin","Az-Zumar","Fussilat","Al-Ahqaf","Az-Zariyat","Al-Mujadila","Al-Mulk","An-Naba"];

const getS = (dark) => ({
  bg: dark ? "#0F1410" : "#F5F2EC",
  card: dark ? "#1A2018" : "#FFFFFF",
  cardAlt: dark ? "#1F2B1C" : "#F0EDE5",
  text: dark ? "#E8E3D5" : "#1A2A14",
  textSub: dark ? "#8A9E82" : "#6B7C65",
  textMuted: dark ? "#4A5E44" : "#9BA899",
  green: "#2D5A27",
  greenL: "#4A7C42",
  greenPale: dark ? "#1A3018" : "#E8F0E5",
  greenTag: "#4CAF50",
  border: dark ? "#1E2B1B" : "#E8E4DC",
  navBg: dark ? "#0A100A" : "#FFFFFF",
  accent: "#C8A96E",
  red: "#C0392B",
  input: dark ? "#141F12" : "#F8F5EF",
});

function CircProgress({ val, max, size = 110, sw = 8, dark }) {
  const S = getS(dark);
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(max > 0 ? val / max : 0, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={S.greenPale} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={S.green} strokeWidth={sw}
        strokeDasharray={c} strokeDashoffset={c - pct * c} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
    </svg>
  );
}

function Modal({ open, onClose, title, dark, children }) {
  const S = getS(dark);
  if (!open) return null;
  return (
    <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",zIndex:300,display:"flex",alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",background:S.card,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px",
        maxHeight:"82%",overflowY:"auto",boxSizing:"border-box",
      }}>
        <div style={{ width:36,height:4,background:S.border,borderRadius:99,margin:"0 auto 16px" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <h3 style={{ fontSize:17,fontWeight:800,color:S.text,margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:22,color:S.textMuted,cursor:"pointer",lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FInput({ label, value, onChange, placeholder, dark, multi }) {
  const S = getS(dark);
  const base = { width:"100%",background:S.input,border:`1px solid ${S.border}`,borderRadius:10,padding:"10px 12px",fontSize:14,color:S.text,outline:"none",boxSizing:"border-box",fontFamily:"inherit",resize:"none" };
  return (
    <div style={{ marginBottom:10 }}>
      {label && <div style={{ fontSize:11,fontWeight:700,color:S.textMuted,marginBottom:4,letterSpacing:.5 }}>{label}</div>}
      {multi ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={base}/> : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}
    </div>
  );
}

function SaveBtn({ label, onClick, dark }) {
  const S = getS(dark);
  return <button onClick={onClick} style={{ background:S.green,color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",fontSize:13,fontWeight:700,cursor:"pointer",marginRight:10 }}>{label}</button>;
}
function CancelBtn({ onClick, dark }) {
  const S = getS(dark);
  return <button onClick={onClick} style={{ background:S.greenPale,color:S.green,border:"none",borderRadius:10,padding:"11px 18px",fontSize:13,fontWeight:600,cursor:"pointer" }}>Cancel</button>;
}

function Nav({ tab, setTab, dark }) {
  const S = getS(dark);
  const tabs = [{ id:"home",icon:"⌂",label:"Home"},{ id:"azkar",icon:"☽",label:"Azkar"},{ id:"tasks",icon:"✓",label:"Tasks"},{ id:"profile",icon:"◉",label:"Profile"}];
  return (
    <div style={{ display:"flex",background:S.navBg,borderTop:`1px solid ${S.border}`,paddingBottom:20,paddingTop:8,flexShrink:0 }}>
      {tabs.map(tb=>(
        <button key={tb.id} onClick={()=>setTab(tb.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 0" }}>
          <div style={{ width:38,height:38,borderRadius:11,background:tab===tb.id?S.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:tab===tb.id?"#fff":S.textMuted,transition:"all .2s" }}>{tb.icon}</div>
          <span style={{ fontSize:10,color:tab===tb.id?S.green:S.textMuted,fontWeight:tab===tb.id?700:400 }}>{tb.label}</span>
        </button>
      ))}
    </div>
  );
}

// HOME
function HomeScreen({ dark, prayers, setPrayers, azkar, traits, notes }) {
  const S = getS(dark);
  const done = prayers.filter(Boolean).length;
  const td = traits.filter(t=>t.reviewed).length;
  const pct = Math.round((done/5)*60+(td/Math.max(traits.length,1))*40);
  const pNames = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
  return (
    <div style={{ padding:"22px 16px 16px" }}>
      <h1 style={{ fontSize:27,fontWeight:700,color:S.green,margin:0,fontFamily:"Georgia,serif" }}>Assalamu Alaikum</h1>
      <p style={{ color:S.textSub,fontSize:13,margin:"4px 0 18px" }}>May your day be filled with barakah.</p>

      <div style={{ background:S.card,borderRadius:20,padding:18,marginBottom:12,boxShadow:dark?"0 4px 20px rgba(0,0,0,0.4)":"0 2px 16px rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize:10,color:S.greenTag,fontWeight:700,letterSpacing:1 }}>DAILY SPIRITUAL FOCUS</span>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8 }}>
          <div>
            <h2 style={{ fontSize:17,fontWeight:800,color:S.text,margin:"0 0 4px" }}>Your Progress Today</h2>
            <p style={{ fontSize:12,color:S.textSub,margin:0 }}>{done}/5 prayers · {td}/{traits.length} traits</p>
          </div>
          <div style={{ position:"relative",width:78,height:78 }}>
            <CircProgress val={pct} max={100} size={78} sw={6} dark={dark}/>
            <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:17,fontWeight:900,color:S.text }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:S.card,borderRadius:20,padding:14,marginBottom:12,boxShadow:dark?"0 4px 20px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
          <span style={{ fontSize:11,color:S.greenTag,fontWeight:700,letterSpacing:1 }}>TODAY'S PRAYERS</span>
          <span style={{ fontSize:12,color:S.textSub }}>{done}/5</span>
        </div>
        <div style={{ display:"flex",gap:7 }}>
          {pNames.map((n,i)=>(
            <button key={i} onClick={()=>{ const p=[...prayers]; p[i]=!p[i]; setPrayers(p); }} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:prayers[i]?S.green:S.greenPale,border:"none",borderRadius:11,padding:"8px 3px",cursor:"pointer",transition:"all .2s" }}>
              <span style={{ fontSize:14,color:prayers[i]?"#fff":S.textMuted }}>{prayers[i]?"✓":"○"}</span>
              <span style={{ fontSize:9,color:prayers[i]?"#fff":S.textSub,fontWeight:600 }}>{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:12 }}>
        {[
          { icon:"☽", t:"Azkar", s:`${Object.values(azkar).flat().length} remembrances`, bg:S.greenPale },
          { icon:"♡", t:"Traits", s:`${td}/${traits.length} reviewed`, bg:S.card },
          { icon:"✎", t:"Notes", s:`${notes.length} reflections`, bg:S.card },
          { icon:"📖", t:"Hifz", s:"Track memorization", bg:S.greenPale },
        ].map((c,i)=>(
          <div key={i} style={{ background:c.bg,borderRadius:15,padding:14,boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:20,marginBottom:7 }}>{c.icon}</div>
            <div style={{ fontSize:13,fontWeight:700,color:S.text }}>{c.t}</div>
            <div style={{ fontSize:11,color:S.textSub,marginTop:2 }}>{c.s}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"linear-gradient(135deg,#1A2A14,#2D4A24)",borderRadius:20,padding:22,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-20,right:-10,fontSize:80,opacity:.07 }}>﷽</div>
        <span style={{ fontSize:10,color:"#C8A96E",fontWeight:700,letterSpacing:1 }}>DAILY AYAH</span>
        <p style={{ fontSize:19,fontWeight:700,color:"#fff",fontStyle:"italic",lineHeight:1.4,margin:"10px 0 10px" }}>"So remember Me; I will remember you."</p>
        <span style={{ fontSize:11,color:"rgba(255,255,255,0.55)" }}>— Al-Baqarah 2:152</span>
      </div>
    </div>
  );
}

// AZKAR
function AzkarScreen({ dark, azkar, setAzkar }) {
  const S = getS(dark);
  const [cat, setCat] = useState("morning");
  const [counts, setCounts] = useState({});
  const [flash, setFlash] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ arabic:"", trans:"", meaning:"", count:"1", hadith:"" });

  const cats = [{ id:"morning",label:"Morning" },{ id:"evening",label:"Evening" },{ id:"afterPrayer",label:"After Prayer" }];
  const list = (azkar[cat]||[]).filter(z => !search || z.arabic.includes(search) || z.trans.toLowerCase().includes(search.toLowerCase()) || z.meaning.toLowerCase().includes(search.toLowerCase()));
  const activeIdx = list.findIndex(z=>(counts[z.id]??z.count)>0);
  const current = list[activeIdx>=0?activeIdx:0];
  const rem = current?(counts[current.id]??current.count):0;
  const tot = current?.count??1;

  const tap = () => {
    if (!current||rem<=0) return;
    setCounts(c=>({...c,[current.id]:rem-1}));
    setFlash(true); setTimeout(()=>setFlash(false),120);
  };

  const openAdd = () => { setForm({arabic:"",trans:"",meaning:"",count:"1",hadith:""}); setEditItem(null); setModal("form"); };
  const openEdit = (z) => { setForm({arabic:z.arabic,trans:z.trans,meaning:z.meaning,count:String(z.count),hadith:z.hadith||""}); setEditItem(z); setModal("form"); };
  const saveForm = () => {
    const item = {...form,count:parseInt(form.count)||1,id:editItem?.id||`z${Date.now()}`};
    setAzkar(a=>({...a,[cat]:editItem?a[cat].map(z=>z.id===editItem.id?item:z):[...(a[cat]||[]),item]}));
    setModal(null);
  };
  const del = (id) => setAzkar(a=>({...a,[cat]:a[cat].filter(z=>z.id!==id)}));

  return (
    <div style={{ padding:"22px 16px 16px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div>
          <span style={{ fontSize:11,color:S.textSub,fontWeight:600,letterSpacing:1 }}>SPIRITUAL FOCUS</span>
          <h1 style={{ fontSize:24,fontWeight:800,color:S.text,margin:"2px 0 0" }}>Azkar</h1>
        </div>
        <button onClick={openAdd} style={{ background:S.green,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer" }}>+ Add</button>
      </div>

      <div style={{ background:S.card,borderRadius:12,padding:"8px 13px",display:"flex",alignItems:"center",gap:8,marginBottom:13,border:`1px solid ${S.border}` }}>
        <span style={{ color:S.textMuted }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search azkar..." style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:S.text,flex:1 }}/>
        {search&&<button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:S.textMuted,cursor:"pointer",fontSize:16 }}>×</button>}
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:18,overflowX:"auto" }}>
        {cats.map(c=>(
          <button key={c.id} onClick={()=>{setCat(c.id);setCounts({});}} style={{ padding:"9px 16px",borderRadius:50,border:"none",cursor:"pointer",whiteSpace:"nowrap",background:cat===c.id?S.green:S.card,color:cat===c.id?"#fff":S.textSub,fontSize:13,fontWeight:600,transition:"all .2s",boxShadow:cat===c.id?"none":(dark?"none":"0 1px 8px rgba(0,0,0,0.06)") }}>{c.label}</button>
        ))}
      </div>

      {current&&!search&&(
        <div style={{ background:S.card,borderRadius:22,padding:20,marginBottom:14,boxShadow:dark?"0 8px 32px rgba(0,0,0,0.5)":"0 4px 24px rgba(0,0,0,0.08)",textAlign:"center" }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:14,position:"relative" }}>
            <CircProgress val={tot-rem} max={tot} size={105} sw={8} dark={dark}/>
            <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:32,fontWeight:900,color:S.text }}>{rem}</span>
              <span style={{ fontSize:10,color:S.textMuted }}>OF {tot}</span>
            </div>
          </div>
          <p style={{ fontSize:23,color:S.text,fontFamily:"Georgia,serif",direction:"rtl",lineHeight:1.6,margin:"0 0 5px" }}>{current.arabic}</p>
          <p style={{ fontSize:12,color:S.textSub,fontStyle:"italic",margin:"0 0 5px" }}>"{current.trans}"</p>
          <p style={{ fontSize:12,color:S.textMuted,margin:"0 0 4px" }}>{current.meaning}</p>
          {current.hadith&&<p style={{ fontSize:11,color:S.accent,fontStyle:"italic",borderTop:`1px solid ${S.border}`,paddingTop:8,margin:"8px 0 12px",lineHeight:1.5 }}>📚 {current.hadith}</p>}
          <button onClick={tap} style={{ width:"100%",padding:16,borderRadius:14,border:"none",cursor:"pointer",background:rem===0?S.greenPale:(flash?S.greenL:S.green),color:rem===0?S.textMuted:"#fff",fontSize:14,fontWeight:700,transform:flash?"scale(0.97)":"scale(1)",transition:"all 0.1s",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <span style={{ fontSize:17 }}>👆</span>{rem===0?"✓ DONE":"TAP TO COUNT"}
          </button>
          <div style={{ display:"flex",gap:9,marginTop:9 }}>
            <button onClick={()=>setCounts(c=>({...c,[current.id]:current.count}))} style={{ flex:1,padding:10,borderRadius:11,border:`1px solid ${S.border}`,background:S.card,color:S.text,fontSize:13,fontWeight:600,cursor:"pointer" }}>↺ Reset</button>
            <button onClick={()=>setCounts(c=>({...c,[current.id]:0}))} style={{ flex:1,padding:10,borderRadius:11,border:"none",background:S.greenPale,color:S.green,fontSize:13,fontWeight:600,cursor:"pointer" }}>▶ Next</button>
            <button onClick={()=>{setEditItem(current);setModal("detail");}} style={{ padding:10,borderRadius:11,border:"none",background:S.cardAlt,color:S.textSub,fontSize:12,cursor:"pointer",width:42 }}>ⓘ</button>
          </div>
        </div>
      )}

      <div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9 }}>
          <span style={{ fontSize:12,fontWeight:700,color:S.text }}>All {cats.find(c=>c.id===cat)?.label} ({list.length})</span>
        </div>
        {list.map(z=>{
          const r2=counts[z.id]??z.count; const isDone=r2===0;
          return (
            <div key={z.id} style={{ background:S.card,borderRadius:14,padding:14,marginBottom:10,boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 2px 10px rgba(0,0,0,0.05)",opacity:isDone?0.6:1,borderLeft:`3px solid ${isDone?S.greenTag:S.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:17,color:S.text,direction:"rtl",margin:"0 0 3px",lineHeight:1.5,fontFamily:"Georgia,serif" }}>{z.arabic}</p>
                  <p style={{ fontSize:11,color:S.textSub,margin:"0 0 3px",fontStyle:"italic" }}>{z.trans}</p>
                  <p style={{ fontSize:11,color:S.textMuted,margin:0,lineHeight:1.4 }}>{z.meaning}</p>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,marginLeft:10,flexShrink:0 }}>
                  <span style={{ background:isDone?S.greenTag:S.greenPale,color:isDone?"#fff":S.green,borderRadius:8,padding:"2px 10px",fontSize:14,fontWeight:800 }}>{r2}</span>
                  <div style={{ display:"flex",gap:4 }}>
                    <button onClick={()=>openEdit(z)} style={{ background:S.greenPale,border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,color:S.green,cursor:"pointer" }}>✎</button>
                    <button onClick={()=>del(z.id)} style={{ background:"#FFF0F0",border:"none",borderRadius:6,padding:"3px 8px",fontSize:11,color:S.red,cursor:"pointer" }}>✕</button>
                  </div>
                </div>
              </div>
              {z.hadith&&<p style={{ fontSize:11,color:S.accent,margin:"7px 0 0",borderTop:`1px solid ${S.border}`,paddingTop:6,lineHeight:1.5 }}>📚 {z.hadith}</p>}
            </div>
          );
        })}
        {list.length===0&&<div style={{ textAlign:"center",padding:28,color:S.textMuted }}><div style={{ fontSize:30 }}>☽</div><p style={{ margin:"8px 0 0",fontSize:13 }}>{search?"No results":"No azkar yet. Tap + Add."}</p></div>}
      </div>

      <Modal open={modal==="form"} onClose={()=>setModal(null)} title={editItem?"Edit Zikr":"Add Zikr"} dark={dark}>
        <FInput label="Arabic Text" value={form.arabic} onChange={v=>setForm(f=>({...f,arabic:v}))} placeholder="اكتب الذكر هنا..." dark={dark} multi/>
        <FInput label="Transliteration" value={form.trans} onChange={v=>setForm(f=>({...f,trans:v}))} placeholder="e.g. Subhan-Allah" dark={dark}/>
        <FInput label="Meaning" value={form.meaning} onChange={v=>setForm(f=>({...f,meaning:v}))} placeholder="English meaning" dark={dark}/>
        <FInput label="Count" value={form.count} onChange={v=>setForm(f=>({...f,count:v}))} placeholder="e.g. 33" dark={dark}/>
        <FInput label="Hadith / Source (optional)" value={form.hadith} onChange={v=>setForm(f=>({...f,hadith:v}))} placeholder="Hadith reference..." dark={dark} multi/>
        <div style={{ display:"flex",marginTop:6 }}><SaveBtn label="Save" onClick={saveForm} dark={dark}/><CancelBtn onClick={()=>setModal(null)} dark={dark}/></div>
      </Modal>

      <Modal open={modal==="detail"} onClose={()=>setModal(null)} title="Zikr Details" dark={dark}>
        {editItem&&<>
          <p style={{ fontSize:24,color:getS(dark).text,direction:"rtl",fontFamily:"Georgia,serif",lineHeight:1.7,marginBottom:8 }}>{editItem.arabic}</p>
          <p style={{ fontSize:13,color:getS(dark).textSub,fontStyle:"italic",marginBottom:6 }}>"{editItem.trans}"</p>
          <p style={{ fontSize:13,color:getS(dark).textMuted,marginBottom:10,lineHeight:1.6 }}>{editItem.meaning}</p>
          {editItem.hadith&&<div style={{ background:getS(dark).greenPale,borderRadius:12,padding:14 }}>
            <span style={{ fontSize:10,color:getS(dark).greenTag,fontWeight:700,letterSpacing:1 }}>HADITH / SOURCE</span>
            <p style={{ fontSize:13,color:getS(dark).text,margin:"6px 0 0",lineHeight:1.6 }}>{editItem.hadith}</p>
          </div>}
        </>}
      </Modal>
    </div>
  );
}

// TASKS
function TasksScreen({ dark, traits, setTraits, notes, setNotes, hifz, setHifz }) {
  const S = getS(dark);
  const [sub, setSub] = useState("traits");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [editT, setEditT] = useState(null);
  const [tForm, setTForm] = useState({ title:"", desc:"", hadith:"", icon:"✦" });
  const [editN, setEditN] = useState(null);
  const [nForm, setNForm] = useState({ title:"", content:"", tag:"PERSONAL" });
  const [nModal, setNModal] = useState(false);

  const mem = hifz.filter(j=>j.status==="memorized").length;
  const inp = hifz.filter(j=>j.status==="inProgress").length;
  const rem = hifz.filter(j=>j.status==="notStarted").length;

  const fTraits = traits.filter(t=>!search||t.title.toLowerCase().includes(search.toLowerCase())||t.desc.toLowerCase().includes(search.toLowerCase()));
  const fNotes = notes.filter(n=>!search||n.title.toLowerCase().includes(search.toLowerCase())||n.content.toLowerCase().includes(search.toLowerCase()));

  const saveTrait = () => {
    const item={...tForm,id:editT?.id||`tr${Date.now()}`,reviewed:editT?.reviewed||false};
    setTraits(t=>editT?t.map(x=>x.id===editT.id?item:x):[...t,item]);
    setModal(null);
  };
  const delTrait = (id) => setTraits(t=>t.filter(x=>x.id!==id));
  const toggleT = (id) => setTraits(t=>t.map(x=>x.id===id?{...x,reviewed:!x.reviewed}:x));

  const saveNote = () => {
    const item={...nForm,id:editN?.id||`n${Date.now()}`,time:"NOW",favorite:editN?.favorite||false,tagColor:"#4CAF50"};
    setNotes(n=>editN?n.map(x=>x.id===editN.id?item:x):[...n,item]);
    setNModal(false); setEditN(null);
  };
  const delNote = (id) => setNotes(n=>n.filter(x=>x.id!==id));
  const toggleFav = (id) => setNotes(n=>n.map(x=>x.id===id?{...x,favorite:!x.favorite}:x));

  const ICONS = ["✦","⏳","🤲","🌿","⚖️","🔒","💬","🛡️","🌙","📖","🕌","🌺","💎","🦋","🌾","☀️"];

  return (
    <div style={{ padding:"22px 16px 16px" }}>
      <h1 style={{ fontSize:24,fontWeight:800,color:S.text,margin:"0 0 14px" }}>Tasks</h1>

      <div style={{ display:"flex",gap:8,marginBottom:14,overflowX:"auto" }}>
        {[{id:"traits",l:"Traits"},{id:"notes",l:"Notes"},{id:"hifz",l:"Hifz"}].map(st=>(
          <button key={st.id} onClick={()=>{setSub(st.id);setSearch("");}} style={{ padding:"8px 15px",borderRadius:50,border:"none",cursor:"pointer",whiteSpace:"nowrap",background:sub===st.id?S.green:S.card,color:sub===st.id?"#fff":S.textSub,fontSize:12,fontWeight:600,transition:"all .2s",boxShadow:sub===st.id?"none":(dark?"none":"0 1px 8px rgba(0,0,0,0.06)") }}>{st.l}</button>
        ))}
      </div>

      {sub!=="hifz"&&<div style={{ background:S.card,borderRadius:12,padding:"8px 13px",display:"flex",alignItems:"center",gap:8,marginBottom:14,border:`1px solid ${S.border}` }}>
        <span style={{ color:S.textMuted }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${sub}...`} style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:S.text,flex:1 }}/>
        {search&&<button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:S.textMuted,cursor:"pointer",fontSize:16 }}>×</button>}
      </div>}

      {/* TRAITS */}
      {sub==="traits"&&<div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11 }}>
          <span style={{ fontSize:12,color:S.textSub }}>{traits.filter(t=>t.reviewed).length}/{traits.length} reviewed</span>
          <button onClick={()=>{setTForm({title:"",desc:"",hadith:"",icon:"✦"});setEditT(null);setModal("trait");}} style={{ background:S.green,color:"#fff",border:"none",borderRadius:9,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer" }}>+ Add Trait</button>
        </div>
        {fTraits.map(trait=>(
          <div key={trait.id} style={{ background:S.card,borderRadius:15,padding:14,marginBottom:11,boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 2px 12px rgba(0,0,0,0.05)",borderLeft:`3px solid ${trait.reviewed?S.greenTag:S.border}` }}>
            <div style={{ display:"flex",gap:11,alignItems:"flex-start" }}>
              <div style={{ width:38,height:38,borderRadius:11,background:S.greenPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0 }}>{trait.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <h3 style={{ fontSize:14,fontWeight:700,color:S.text,margin:0 }}>{trait.title}</h3>
                  <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                    <button onClick={()=>{setTForm({title:trait.title,desc:trait.desc,hadith:trait.hadith||"",icon:trait.icon||"✦"});setEditT(trait);setModal("trait");}} style={{ background:S.greenPale,border:"none",borderRadius:6,padding:"3px 7px",fontSize:11,color:S.green,cursor:"pointer" }}>✎</button>
                    <button onClick={()=>delTrait(trait.id)} style={{ background:"#FFF0F0",border:"none",borderRadius:6,padding:"3px 7px",fontSize:11,color:S.red,cursor:"pointer" }}>✕</button>
                    <button onClick={()=>toggleT(trait.id)} style={{ width:24,height:24,borderRadius:"50%",border:`2px solid ${trait.reviewed?S.green:S.border}`,background:trait.reviewed?S.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s" }}>
                      {trait.reviewed&&<span style={{ color:"#fff",fontSize:12 }}>✓</span>}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize:12,color:S.textSub,margin:"4px 0",lineHeight:1.5 }}>{trait.desc}</p>
                {trait.hadith&&<p style={{ fontSize:11,color:S.accent,margin:"5px 0 0",padding:"5px 0 0",borderTop:`1px solid ${S.border}`,lineHeight:1.5 }}>📚 {trait.hadith}</p>}
                <span style={{ fontSize:10,fontWeight:700,color:trait.reviewed?S.greenTag:S.textMuted,marginTop:5,display:"block" }}>{trait.reviewed?"● REVIEWED TODAY":"○ PENDING REVIEW"}</span>
              </div>
            </div>
          </div>
        ))}
        {fTraits.length===0&&<div style={{ textAlign:"center",padding:28,color:S.textMuted }}><div style={{ fontSize:28 }}>♡</div><p style={{ margin:"8px 0 0",fontSize:13 }}>{search?"No traits found":"Tap + Add Trait."}</p></div>}
      </div>}

      {/* NOTES */}
      {sub==="notes"&&<div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11 }}>
          <span style={{ fontSize:12,color:S.textSub }}>{notes.length} notes</span>
          <button onClick={()=>{setNForm({title:"",content:"",tag:"PERSONAL"});setEditN(null);setNModal(true);}} style={{ background:S.green,color:"#fff",border:"none",borderRadius:9,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer" }}>+ Add Note</button>
        </div>
        {fNotes.map(note=>(
          <div key={note.id} style={{ background:S.card,borderRadius:15,padding:14,marginBottom:11,boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
              <span style={{ fontSize:10,background:note.tagColor+"22",color:note.tagColor,padding:"3px 8px",borderRadius:6,fontWeight:700 }}>{note.tag}</span>
              <div style={{ display:"flex",gap:5,alignItems:"center" }}>
                <span style={{ fontSize:11,color:S.textMuted }}>{note.time}</span>
                <button onClick={()=>toggleFav(note.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:note.favorite?S.green:S.textMuted }}>🔖</button>
                <button onClick={()=>{setNForm({title:note.title,content:note.content,tag:note.tag});setEditN(note);setNModal(true);}} style={{ background:S.greenPale,border:"none",borderRadius:6,padding:"3px 7px",fontSize:11,color:S.green,cursor:"pointer" }}>✎</button>
                <button onClick={()=>delNote(note.id)} style={{ background:"#FFF0F0",border:"none",borderRadius:6,padding:"3px 7px",fontSize:11,color:S.red,cursor:"pointer" }}>✕</button>
              </div>
            </div>
            <h3 style={{ fontSize:14,fontWeight:700,color:S.text,margin:"0 0 5px" }}>{note.title}</h3>
            <p style={{ fontSize:12,color:S.textSub,margin:0,lineHeight:1.5 }}>{note.content}</p>
          </div>
        ))}
        {fNotes.length===0&&<div style={{ textAlign:"center",padding:28,color:S.textMuted }}><div style={{ fontSize:28 }}>✎</div><p style={{ margin:"8px 0 0",fontSize:13 }}>{search?"No notes found":"Add your first reflection."}</p></div>}
      </div>}

      {/* HIFZ */}
      {sub==="hifz"&&<div>
        <h2 style={{ fontSize:18,fontWeight:800,color:S.text,margin:"0 0 4px" }}>Hifz Tracker</h2>
        <p style={{ color:S.textSub,fontSize:12,margin:"0 0 14px" }}>Track Quran memorization</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14 }}>
          {[{l:"Memorized",v:mem,c:S.green},{l:"In Progress",v:inp,c:S.accent},{l:"Remaining",v:rem,c:S.textMuted}].map((s,i)=>(
            <div key={i} style={{ background:S.card,borderRadius:13,padding:12,textAlign:"center",boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:20,fontWeight:900,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10,color:S.textSub,marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:S.card,borderRadius:14,padding:13,marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
            <span style={{ fontSize:12,fontWeight:700,color:S.text }}>Overall</span>
            <span style={{ fontSize:12,color:S.green,fontWeight:700 }}>{Math.round((mem/30)*100)}%</span>
          </div>
          <div style={{ height:7,background:S.greenPale,borderRadius:99 }}>
            <div style={{ height:"100%",width:`${(mem/30)*100}%`,background:S.green,borderRadius:99,transition:"width 0.5s" }}/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7 }}>
          {hifz.map(j=>{
            const bg=j.status==="memorized"?S.green:j.status==="inProgress"?S.accent:S.card;
            const tc=j.status==="notStarted"?S.textMuted:"#fff";
            return (
              <button key={j.id} onClick={()=>setHifz(d=>d.map(x=>x.id===j.id?{...x,status:x.status==="notStarted"?"inProgress":x.status==="inProgress"?"memorized":"notStarted"}:x))} style={{ background:bg,border:`1px solid ${S.border}`,borderRadius:11,padding:"9px 3px",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                <span style={{ fontSize:13,fontWeight:800,color:tc }}>{j.id}</span>
                <span style={{ fontSize:8,color:tc,opacity:.8 }}>{j.status==="memorized"?"✓":j.status==="inProgress"?"~":"○"}</span>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize:10,color:S.textMuted,textAlign:"center",marginTop:9 }}>Tap to cycle: ○ not started → ~ in progress → ✓ memorized</p>
      </div>}

      <Modal open={modal==="trait"} onClose={()=>setModal(null)} title={editT?"Edit Trait":"Add Trait"} dark={dark}>
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11,fontWeight:700,color:S.textMuted,marginBottom:6,letterSpacing:.5 }}>ICON</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {ICONS.map(ic=>(
              <button key={ic} onClick={()=>setTForm(f=>({...f,icon:ic}))} style={{ width:35,height:35,borderRadius:9,border:`2px solid ${tForm.icon===ic?S.green:S.border}`,background:tForm.icon===ic?S.greenPale:"transparent",fontSize:17,cursor:"pointer" }}>{ic}</button>
            ))}
          </div>
        </div>
        <FInput label="Title" value={tForm.title} onChange={v=>setTForm(f=>({...f,title:v}))} placeholder="e.g. Gratitude (Shukr)" dark={dark}/>
        <FInput label="Description" value={tForm.desc} onChange={v=>setTForm(f=>({...f,desc:v}))} placeholder="What does this trait mean?" dark={dark} multi/>
        <FInput label="Hadith / Reference (optional)" value={tForm.hadith} onChange={v=>setTForm(f=>({...f,hadith:v}))} placeholder="Hadith or Quranic reference..." dark={dark} multi/>
        <div style={{ display:"flex",marginTop:6 }}><SaveBtn label="Save" onClick={saveTrait} dark={dark}/><CancelBtn onClick={()=>setModal(null)} dark={dark}/></div>
      </Modal>

      <Modal open={nModal} onClose={()=>{setNModal(false);setEditN(null);}} title={editN?"Edit Note":"New Note"} dark={dark}>
        <FInput label="Title" value={nForm.title} onChange={v=>setNForm(f=>({...f,title:v}))} placeholder="Note title..." dark={dark}/>
        <FInput label="Tag" value={nForm.tag} onChange={v=>setNForm(f=>({...f,tag:v}))} placeholder="e.g. LECTURE, PERSONAL, SURAH..." dark={dark}/>
        <FInput label="Content" value={nForm.content} onChange={v=>setNForm(f=>({...f,content:v}))} placeholder="Write your reflection..." dark={dark} multi/>
        <div style={{ display:"flex",marginTop:6 }}><SaveBtn label="Save" onClick={saveNote} dark={dark}/><CancelBtn onClick={()=>{setNModal(false);setEditN(null);}} dark={dark}/></div>
      </Modal>
    </div>
  );
}

// PROFILE
function ProfileScreen({ dark, setDark, lang, setLang }) {
  const S = getS(dark);
  const sets = [
    { icon:"🌙", label:"Dark Mode", action:()=>setDark(d=>!d), toggle:true, val:dark },
    { icon:"🌐", label:"Language", action:()=>setLang(l=>l==="en"?"ar":"en"), badge:lang==="en"?"عربي":"English" },
    { icon:"🔔", label:"Notifications", action:()=>{} },
    { icon:"👤", label:"Account", action:()=>{} },
  ];
  return (
    <div style={{ padding:"22px 16px 16px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:13,marginBottom:22 }}>
        <div style={{ width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#2D5A27,#4A7C42)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>🌿</div>
        <div>
          <h2 style={{ fontSize:19,fontWeight:800,color:S.text,margin:0 }}>My Sanctuary</h2>
          <p style={{ color:S.textSub,fontSize:12,margin:"2px 0 0" }}>Personal Islamic App</p>
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#2D5A27,#4A7C42)",borderRadius:18,padding:18,marginBottom:18,display:"flex",alignItems:"center",gap:14 }}>
        <div style={{ fontSize:36 }}>🔥</div>
        <div>
          <div style={{ fontSize:28,fontWeight:900,color:"#fff" }}>12</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.8)" }}>Day Streak</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:1 }}>Keep it up! 🌟</div>
        </div>
      </div>

      <div style={{ background:S.card,borderRadius:18,overflow:"hidden",boxShadow:dark?"0 4px 20px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)",marginBottom:18 }}>
        {sets.map((s,i)=>(
          <div key={i} onClick={s.action} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 17px",borderBottom:i<sets.length-1?`1px solid ${S.border}`:"none",cursor:"pointer" }}>
            <div style={{ display:"flex",alignItems:"center",gap:11 }}>
              <span style={{ fontSize:17 }}>{s.icon}</span>
              <span style={{ fontSize:14,color:S.text,fontWeight:500 }}>{s.label}</span>
            </div>
            {s.toggle?<div style={{ width:41,height:23,borderRadius:99,background:s.val?S.green:S.border,position:"relative",transition:"background 0.2s" }}>
              <div style={{ position:"absolute",top:2,left:s.val?19:2,width:19,height:19,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
            </div>:s.badge?<span style={{ fontSize:12,background:S.greenPale,color:S.green,padding:"3px 10px",borderRadius:20,fontWeight:600 }}>{s.badge}</span>:<span style={{ color:S.textMuted,fontSize:17 }}>›</span>}
          </div>
        ))}
      </div>

      {/* Install Instructions */}
      <div style={{ background:S.card,borderRadius:18,padding:17,boxShadow:dark?"0 4px 20px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize:10,color:S.greenTag,fontWeight:700,letterSpacing:1 }}>📱 INSTALL ON iPHONE — FREE</span>
        <h3 style={{ fontSize:15,fontWeight:700,color:S.text,margin:"8px 0 10px" }}>Add to Home Screen</h3>
        {[
          { step:"1", text:"Open this page in Safari (not Chrome or Firefox)", ok:false },
          { step:"2", text:'Tap the Share button at the bottom of Safari (□↑)', ok:false },
          { step:"3", text:"Scroll down and tap 'Add to Home Screen'", ok:false },
          { step:"4", text:"Name it 'The Sanctuary' then tap Add", ok:false },
          { step:"✓", text:"Done! Opens like a real app, full screen, no browser bar!", ok:true },
        ].map((s,i)=>(
          <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:8 }}>
            <div style={{ width:20,height:20,borderRadius:"50%",background:s.ok?S.green:S.greenPale,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
              <span style={{ fontSize:10,fontWeight:800,color:s.ok?"#fff":S.green }}>{s.step}</span>
            </div>
            <p style={{ fontSize:12,color:s.ok?S.greenTag:S.textSub,margin:0,lineHeight:1.5,fontWeight:s.ok?700:400 }}>{s.text}</p>
          </div>
        ))}
        <div style={{ background:S.greenPale,borderRadius:10,padding:"10px 13px",marginTop:10 }}>
          <p style={{ fontSize:11,color:S.green,margin:0,fontWeight:600,lineHeight:1.5 }}>
            💡 Pro tip: Once installed, your data stays saved locally on your phone. Share the link with friends so they can install it too!
          </p>
        </div>
      </div>

      <p style={{ textAlign:"center",fontSize:10,color:S.textMuted,marginTop:18,lineHeight:1.6 }}>The Sanctuary v2.0 · Built with ❤️ for personal growth</p>
    </div>
  );
}

// ROOT
export default function App() {
  const [tab, setTab] = useState("home");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [prayers, setPrayers] = useState([false,false,false,false,false]);
  const [azkar, setAzkar] = useState(DEFAULT_AZKAR);
  const [traits, setTraits] = useState(DEFAULT_TRAITS);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [hifz, setHifz] = useState(
    Array.from({length:30},(_,i)=>({ id:i+1, name:JUZ_NAMES[i], status:i<5?"memorized":i<8?"inProgress":"notStarted" }))
  );

  const S = getS(dark);

  const screens = {
    home: <HomeScreen dark={dark} prayers={prayers} setPrayers={setPrayers} azkar={azkar} traits={traits} notes={notes}/>,
    azkar: <AzkarScreen dark={dark} azkar={azkar} setAzkar={setAzkar}/>,
    tasks: <TasksScreen dark={dark} traits={traits} setTraits={setTraits} notes={notes} setNotes={setNotes} hifz={hifz} setHifz={setHifz}/>,
    profile: <ProfileScreen dark={dark} setDark={setDark} lang={lang} setLang={setLang}/>,
  };

  return (
    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:dark?"#050805":"#C8C3B8",fontFamily:"Georgia,serif" }}>
      <div style={{ width:390,height:844,background:S.bg,borderRadius:48,boxShadow:"0 40px 100px rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",border:dark?"2px solid #1A2A18":"2px solid rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 24px 4px",background:S.bg,flexShrink:0 }}>
          <span style={{ fontSize:12,fontWeight:700,color:S.text }}>9:41</span>
          <div style={{ width:110,height:26,background:dark?"#0A100A":"#111",borderRadius:99 }}/>
          <span style={{ fontSize:10,color:S.text }}>●●●</span>
        </div>
        <div style={{ flex:1,overflowY:"auto",overflowX:"hidden" }}>{screens[tab]}</div>
        <Nav tab={tab} setTab={setTab} dark={dark}/>
      </div>
    </div>
  );
}
