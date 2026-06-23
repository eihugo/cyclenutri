import { useState } from "react";

// ─── Design System ─────────────────────────────────────────────────────────────
// Primary: #6B35A8 (deep violet), #9B59D0 (mid violet)
// Accent:  #E91E8C (hot pink), #FF6BAE (light pink)
// Surface: #FFFFFF, #F8F4FE (lavender tint), #FDF0F7 (pink tint)
// Text:    #1A0D2E (near-black), #6B5B8A (muted), #A394BE (hint)

const C = {
  primary: "#6B35A8",
  primaryMid: "#8B45C8",
  primaryLight: "#9B59D0",
  accent: "#E91E8C",
  accentLight: "#FF6BAE",
  accentPale: "#FFE0F0",
  lavender: "#F3EEFF",
  lavenderMid: "#E0D0F8",
  surface: "#FFFFFF",
  bg: "#F8F4FE",
  bgPink: "#FDF5FB",
  text: "#1A0D2E",
  textMuted: "#6B5B8A",
  textHint: "#A394BE",
  border: "#EDE5F8",
  borderPink: "#F5D0E8",
  success: "#2ECC71",
  warning: "#F39C12",
};

const phases = {
  menstrual: { label: "Menstruação", color: "#E91E8C", bg: "#FFE0F0", days: "1–5", emoji: "🔴" },
  follicular: { label: "Fase Folicular", color: "#9B59D0", bg: "#EDE0FF", days: "6–13", emoji: "🌱" },
  ovulatory: { label: "Ovulação", color: "#27AE60", bg: "#D5F5E3", days: "14–16", emoji: "✨" },
  luteal: { label: "Fase Lútea", color: "#6B35A8", bg: "#E8D5FF", days: "17–28", emoji: "🌙" },
};

function getPhase(day) {
  if (day <= 5) return "menstrual";
  if (day <= 13) return "follicular";
  if (day <= 16) return "ovulatory";
  return "luteal";
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function GradientBtn({ children, onClick, style = {}, outline = false }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? "transparent" : `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 100%)`,
      border: outline ? `1.5px solid ${C.accent}` : "none",
      color: outline ? C.accent : "#fff",
      borderRadius: 50, padding: "12px 24px",
      fontSize: 14, fontWeight: 700, cursor: "pointer",
      width: "100%", letterSpacing: "0.02em",
      ...style,
    }}>{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`,
      padding: 16, ...style,
    }}>{children}</div>
  );
}

function Chip({ children, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: active ? "none" : `1px solid ${C.border}`,
      background: active ? (color || `linear-gradient(135deg, ${C.accent}, ${C.primary})`) : C.surface,
      color: active ? "#fff" : C.textMuted,
      borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 600,
      cursor: "pointer", whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, fontWeight: 800, color: C.textHint, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>{children}</p>;
}

function Avatar({ name = "C", size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
    }}>{initials}</div>
  );
}

function PhaseDot({ phase }) {
  const p = phases[phase];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: p.bg, borderRadius: 50, padding: "4px 10px",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "inline-block" }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.label}</span>
    </span>
  );
}

// ─── Cycle Ring ───────────────────────────────────────────────────────────────
function CycleRing({ day = 18, size = 80 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (day / 28) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.lavenderMid} strokeWidth={6} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={6}
          strokeDasharray={`${progress} ${circ - progress}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.accent} />
            <stop offset="100%" stopColor={C.primary} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{day}</span>
        <span style={{ fontSize: size * 0.13, color: C.textHint, fontWeight: 600 }}>de 28</span>
      </div>
    </div>
  );
}

// ─── Food Emoji Cards (replace images) ────────────────────────────────────────
const FOOD_EMOJIS = {
  "Iogurte com aveia": "🥣",
  "Arroz integral com frango": "🍱",
  "Vitamina de banana": "🥤",
  "Sopa de abóbora": "🍜",
  "Tigela de iogurte com frutas": "🥗",
  "Vitamina de banana com cacau": "🍫",
  "Pão integral com ovo": "🍳",
  "Brownie funcional": "🍫",
  "Sopa anti-inflamatória": "🫕",
  "Panqueca de aveia": "🥞",
  "Bowl anti-inflamatório": "🥗",
};

function FoodCard({ name, tags = [], time, kcal, style = {} }) {
  const emoji = FOOD_EMOJIS[name] || "🍽️";
  return (
    <Card style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, ...style }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${C.accentPale}, ${C.lavender})`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
      }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 4px", lineHeight: 1.3 }}>{name}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tags.map((t, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 600, color: C.primary, background: C.lavender, borderRadius: 6, padding: "2px 7px" }}>• {t}</span>
          ))}
        </div>
        {(time || kcal) && (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {time && <span style={{ fontSize: 10, color: C.textHint }}>⏱ {time}</span>}
            {kcal && <span style={{ fontSize: 10, color: C.textHint }}>🔥 {kcal} kcal</span>}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "home", label: "Início", icon: "🏠" },
    { id: "cycle", label: "Ciclo", icon: "🔄" },
    { id: "diary", label: "Diário", icon: "📝" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 430, margin: "0 auto",
      background: C.surface, borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "8px 8px calc(8px + env(safe-area-inset-bottom, 0))",
      zIndex: 200,
    }}>
      {tabs.slice(0, 2).map(t => (
        <TabBtn key={t.id} tab={t} active={active} onChange={onChange} />
      ))}
      {/* Center FAB */}
      <button
        onClick={() => onChange("plan")}
        style={{
          width: 52, height: 52, borderRadius: "50%", border: "none",
          background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`,
          fontSize: 22, cursor: "pointer", flexShrink: 0,
          boxShadow: `0 4px 16px ${C.accent}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: active === "plan" ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.15s",
        }}
      >➕</button>
      {tabs.slice(2).map(t => (
        <TabBtn key={t.id} tab={t} active={active} onChange={onChange} />
      ))}
    </div>
  );
}

function TabBtn({ tab, active, onChange }) {
  const isActive = active === tab.id;
  return (
    <button onClick={() => onChange(tab.id)} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      background: "none", border: "none", cursor: "pointer", padding: "4px 12px",
      opacity: isActive ? 1 : 0.45, minWidth: 50,
    }}>
      <span style={{ fontSize: 20 }}>{tab.icon}</span>
      <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? C.primary : C.textHint }}>{tab.label}</span>
    </button>
  );
}

// ─── SCREEN: Login ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 14,
    border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none",
    background: C.bg, color: C.text, boxSizing: "border-box",
    fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.lavender} 0%, #fff 40%, ${C.bgPink} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: `linear-gradient(135deg, ${C.accentLight}, ${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 12px" }}>🌸</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.primary, margin: 0, letterSpacing: "-0.5px" }}>CycleNutri</h1>
        <p style={{ color: C.textHint, fontSize: 13, marginTop: 4 }}>Nutrição inteligente para cada fase da mulher</p>
      </div>

      <div style={{ background: C.surface, borderRadius: 24, padding: 28, width: "100%", maxWidth: 360, boxShadow: `0 8px 40px ${C.primary}18` }}>
        <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 3, marginBottom: 22 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
              background: mode === m ? C.surface : "transparent",
              color: mode === m ? C.primary : C.textHint,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: mode === m ? `0 2px 8px ${C.primary}20` : "none",
            }}>{m === "login" ? "Entrar" : "Cadastrar"}</button>
          ))}
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nome completo</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" style={inputStyle} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Senha</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
        </div>

        {mode === "login" && (
          <p style={{ textAlign: "right", fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 18, cursor: "pointer", marginTop: -14 }}>Esqueci minha senha</p>
        )}

        <GradientBtn onClick={() => onLogin(name || "Camila Oliveira")}>
          {mode === "login" ? "Entrar" : "Criar conta gratuita"} 💜
        </GradientBtn>

        <p style={{ textAlign: "center", fontSize: 12, color: C.textHint, marginTop: 16 }}>
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: C.accent, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>

      <p style={{ color: C.textHint, fontSize: 11, marginTop: 20, textAlign: "center" }}>Ao continuar, você concorda com nossa política de privacidade e LGPD.</p>
    </div>
  );
}

// ─── SCREEN: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ user, cycleDay, phase, onNavigate }) {
  const ph = phases[phase];
  const mood = ["😊", "🙂", "😐", "😔", "😩"];
  const [selectedMood, setSelectedMood] = useState(1);

  const quickActions = [
    { icon: "🥗", label: "Plano alimentar", tab: "plan" },
    { icon: "📝", label: "Sintomas", tab: "diary" },
    { icon: "📚", label: "Receitas", tab: "recipes" },
    { icon: "✅", label: "Conteúdo", tab: "education" },
  ];

  return (
    <div style={{ padding: "0 0 90px" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${C.primary} 0%, ${C.primaryMid} 60%, ${C.accentLight} 100%)`,
        padding: "52px 20px 28px", borderRadius: "0 0 28px 28px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 2px" }}>Olá, {user.split(" ")[0]}! 💜</p>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>Que bom ter você aqui!</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 16, cursor: "pointer" }}>🔔</button>
            <Avatar name={user} size={36} />
          </div>
        </div>

        {/* Phase card */}
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 18, padding: 16, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>Fase atual do seu ciclo</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <CycleRing day={cycleDay} size={72} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{ph.emoji}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{ph.label}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "0 0 10px" }}>Dias {ph.days}</p>
              <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 50, padding: "5px 14px", display: "inline-block" }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Ver dicas →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Mood */}
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Como você está se sentindo?</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {mood.map((m, i) => (
              <button key={i} onClick={() => setSelectedMood(i)} style={{
                background: selectedMood === i ? `linear-gradient(135deg, ${C.accentPale}, ${C.lavender})` : "none",
                border: selectedMood === i ? `2px solid ${C.accent}` : "2px solid transparent",
                borderRadius: 14, padding: "8px 10px", cursor: "pointer", fontSize: 22,
              }}>{m}</button>
            ))}
          </div>
        </Card>

        {/* Tip */}
        <Card style={{ marginBottom: 12, background: `linear-gradient(135deg, ${C.lavender}, ${C.accentPale})`, border: `1px solid ${C.lavenderMid}` }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>💡 Próximas dicas para você</p>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 12px", lineHeight: 1.6 }}>
            {phase === "luteal" ? "Priorize alimentos ricos em magnésio para reduzir os sintomas da TPM." :
             phase === "menstrual" ? "Aumente o consumo de ferro e vitamina C para repor o que é perdido." :
             phase === "follicular" ? "Aposte em probióticos e alimentos frescos para nutrir seu crescimento." :
             "Priorize proteínas e hidratação para sustentar seu pico de energia."}
          </p>
          <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 50, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver dicas</button>
        </Card>

        {/* Quick access */}
        <SectionLabel>Acesso rápido</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {quickActions.map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.tab)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer",
            }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, lineHeight: 1.2, textAlign: "center" }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Today's meal preview */}
        <SectionLabel>Refeição de hoje</SectionLabel>
        <FoodCard name="Iogurte com aveia" tags={["Magnésio", "Fibras", "Probióticos"]} time="10 min" kcal="290" style={{ marginBottom: 8 }} />
        <FoodCard name="Arroz integral com frango" tags={["Ferro", "Proteínas", "Fibras"]} time="25 min" kcal="480" />
      </div>
    </div>
  );
}

// ─── SCREEN: Cycle Calendar ───────────────────────────────────────────────────
function CycleScreen({ cycleDay, setCycleDay }) {
  const [selectedDay, setSelectedDay] = useState(cycleDay);
  const today = 18;
  const phase = getPhase(selectedDay);
  const ph = phases[phase];

  const days28 = Array.from({ length: 28 }, (_, i) => i + 1);
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Simulate calendar offset (starts on Wednesday = 3)
  const offset = 3;

  function getDayPhaseColor(d) {
    const p = getPhase(d);
    return phases[p].color;
  }
  function getDayPhaseBg(d) {
    const p = getPhase(d);
    return phases[p].bg;
  }

  const records = [
    { icon: "🩸", label: "Menstruação", tap: true },
    { icon: "😊", label: "Sintomas", tap: false },
    { icon: "😄", label: "Humor", tap: false },
    { icon: "⚡", label: "Energia", tap: false },
  ];

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>Calendário do Ciclo</h2>
        <PhaseDot phase={phase} />
      </div>

      <Card style={{ marginBottom: 14 }}>
        {/* Month nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.textMuted }}>‹</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Maio 2024</span>
          <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.textMuted }}>›</button>
        </div>

        {/* Weekday labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.textHint, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />)}
          {days28.map(d => {
            const isToday = d === today;
            const isSelected = d === selectedDay;
            const isMens = d <= 5;
            return (
              <button key={d} onClick={() => { setSelectedDay(d); setCycleDay(d); }} style={{
                aspectRatio: "1", borderRadius: 10, border: "none",
                background: isSelected ? getDayPhaseColor(d) : isMens ? "#FFE0F0" : getDayPhaseBg(d),
                color: isSelected ? "#fff" : getDayPhaseColor(d),
                fontSize: 12, fontWeight: isSelected ? 800 : isToday ? 700 : 500,
                cursor: "pointer",
                outline: isToday && !isSelected ? `2px solid ${getDayPhaseColor(d)}` : "none",
              }}>{d}</button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, justifyContent: "center" }}>
          {Object.entries(phases).map(([key, p]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected day info */}
      <Card style={{ marginBottom: 12, borderLeft: `4px solid ${ph.color}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textHint, textTransform: "uppercase", margin: "0 0 4px" }}>Hoje • {ph.label}</p>
        <p style={{ fontSize: 14, color: C.text, margin: "0 0 8px", lineHeight: 1.6 }}>
          {phase === "luteal" ? "Seu corpo está mais sensível. Aposte em alimentos que promovem bem-estar e equilíbrio." :
           phase === "menstrual" ? "Descanse e priorize alimentos ricos em ferro. Você merece esse cuidado." :
           phase === "follicular" ? "Energia em alta! Ótimo momento para experimentar novas receitas." :
           "Pico de energia! Consuma proteínas e mantenha-se bem hidratada."}
        </p>
        <button style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`, color: "#fff", border: "none", borderRadius: 50, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          Ver dicas para hoje
        </button>
      </Card>

      {/* Register info */}
      <SectionLabel>Registrar informações</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {records.map((r, i) => (
          <button key={i} style={{
            background: r.tap ? `linear-gradient(135deg, ${C.accentPale}, ${C.lavender})` : C.surface,
            border: `1px solid ${r.tap ? C.borderPink : C.border}`,
            borderRadius: 14, padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer",
          }}>
            <span style={{ fontSize: 20 }}>{r.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: r.tap ? C.accent : C.textMuted, textAlign: "center" }}>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: Diary (Symptoms) ────────────────────────────────────────────────
function DiaryScreen({ phase }) {
  const ph = phases[phase];
  const [symptoms, setSymptoms] = useState({});
  const [mood, setMood] = useState(null);
  const [craving, setCraving] = useState(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const symptomList = [
    { id: "cramping", label: "Cólicas" },
    { id: "bloating", label: "Inchaço" },
    { id: "headache", label: "Dor de cabeça" },
    { id: "fatigue", label: "Fadiga" },
    { id: "irritability", label: "Irritabilidade" },
    { id: "acne", label: "Acne" },
    { id: "anxiety", label: "Ansiedade" },
    { id: "breast", label: "Sensib. mamária" },
  ];

  const cravings = ["Doce", "Salgado", "Carboidrato", "Nada específico"];
  const moods = [
    { icon: "😊", label: "Ótima" },
    { icon: "🙂", label: "Bem" },
    { icon: "😐", label: "Normal" },
    { icon: "😔", label: "Mal" },
    { icon: "😩", label: "Péssima" },
  ];

  const dotLevels = [0, 1, 2, 3, 4];

  function toggleSym(id) {
    setSymptoms(p => ({ ...p, [id]: ((p[id] || 0) + 1) % 5 }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const recommendations = [];
  if ((symptoms.cramping || 0) >= 2) recommendations.push("Magnésio e ômega-3 para as cólicas");
  if ((symptoms.fatigue || 0) >= 2) recommendations.push("Ferro e vitamina B12 para a fadiga");
  if (craving === "Doce") recommendations.push("Frutas e chocolate 70% para o desejo");
  if ((symptoms.bloating || 0) >= 2) recommendations.push("Reduza sódio e aumente hidratação");

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.textMuted }}>←</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Diário de Sintomas</h2>
          <p style={{ fontSize: 12, color: C.textHint, margin: "2px 0 0" }}>Hoje, {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}</p>
        </div>
        <PhaseDot phase={phase} />
      </div>

      {/* Mood */}
      <Card style={{ marginBottom: 12 }}>
        <SectionLabel>Como você está se sentindo?</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {moods.map((m, i) => (
            <button key={i} onClick={() => setMood(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: mood === i ? C.lavender : "none",
              border: mood === i ? `1.5px solid ${C.primary}` : "1.5px solid transparent",
              borderRadius: 12, padding: "8px", cursor: "pointer",
            }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 10, color: mood === i ? C.primary : C.textHint, fontWeight: 600 }}>{m.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Symptoms */}
      <Card style={{ marginBottom: 12 }}>
        <SectionLabel>Quais sintomas você está sentindo?</SectionLabel>
        {symptomList.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{s.label}</span>
            <div style={{ display: "flex", gap: 5 }}>
              {dotLevels.map(l => (
                <button key={l} onClick={() => setSymptoms(p => ({ ...p, [s.id]: l }))} style={{
                  width: 12, height: 12, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: (symptoms[s.id] || 0) >= l + 1 ? C.accent : C.border,
                }} />
              ))}
            </div>
          </div>
        ))}
        <button style={{ marginTop: 10, background: "none", border: `1px dashed ${C.border}`, borderRadius: 10, padding: "8px 16px", color: C.textHint, fontSize: 12, cursor: "pointer", width: "100%" }}>
          + Outro sintoma
        </button>
      </Card>

      {/* Cravings */}
      <Card style={{ marginBottom: 12 }}>
        <SectionLabel>Desejos alimentares</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {cravings.map(c => (
            <Chip key={c} active={craving === c} onClick={() => setCraving(craving === c ? null : c)}>{c}</Chip>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card style={{ marginBottom: 12 }}>
        <SectionLabel>Observações</SectionLabel>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Escreva como você se sente..."
          style={{
            width: "100%", minHeight: 80, borderRadius: 12, border: `1.5px solid ${C.border}`,
            padding: "10px 12px", fontSize: 13, color: C.text, resize: "none", outline: "none",
            background: C.bg, fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6,
          }}
        />
      </Card>

      {/* Auto recommendations */}
      {recommendations.length > 0 && (
        <Card style={{ marginBottom: 12, background: C.lavender, border: `1px solid ${C.lavenderMid}` }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: C.primary, margin: "0 0 8px" }}>💜 Recomendações para você</p>
          {recommendations.map((r, i) => (
            <p key={i} style={{ fontSize: 12, color: C.textMuted, margin: "4px 0" }}>• {r}</p>
          ))}
        </Card>
      )}

      <GradientBtn onClick={save}>{saved ? "✓ Salvo com sucesso!" : "Salvar"}</GradientBtn>
    </div>
  );
}

// ─── SCREEN: Meal Plan ────────────────────────────────────────────────────────
function PlanScreen({ phase }) {
  const ph = phases[phase];
  const [view, setView] = useState("Dia");
  const views = ["Dia", "Semana", "Lista de compras"];

  const plans = {
    menstrual: [
      { meal: "Café da manhã", emoji: "☀️", name: "Iogurte com aveia", tags: ["Magnésio", "Fibras", "Probióticos"], kcal: "290", time: "10 min" },
      { meal: "Almoço", emoji: "🥗", name: "Arroz integral com frango", tags: ["Ferro", "Proteínas", "Fibras"], kcal: "480", time: "30 min" },
      { meal: "Lanche da tarde", emoji: "🍌", name: "Vitamina de banana", tags: ["Magnésio", "Triptofano"], kcal: "180", time: "5 min" },
      { meal: "Jantar", emoji: "🌙", name: "Sopa de abóbora", tags: ["Anti-inflamatório", "Leve"], kcal: "290", time: "25 min" },
    ],
    follicular: [
      { meal: "Café da manhã", emoji: "☀️", name: "Tigela de iogurte com frutas", tags: ["Probióticos", "Vitamina C"], kcal: "320", time: "10 min" },
      { meal: "Almoço", emoji: "🥗", name: "Salada de quinoa com frango", tags: ["Proteínas", "Ácido Fólico"], kcal: "450", time: "20 min" },
      { meal: "Lanche da tarde", emoji: "🥑", name: "Avocado toast integral", tags: ["Gordura boa", "Fibras"], kcal: "220", time: "5 min" },
      { meal: "Jantar", emoji: "🌙", name: "Salmão com brócolis", tags: ["Ômega-3", "Vitamina D"], kcal: "380", time: "25 min" },
    ],
    ovulatory: [
      { meal: "Café da manhã", emoji: "☀️", name: "Vitamina de banana com cacau", tags: ["Energia", "Antioxidantes"], kcal: "310", time: "8 min" },
      { meal: "Almoço", emoji: "🥗", name: "Bowl de frango com aspargos", tags: ["Proteínas", "Zinco"], kcal: "490", time: "20 min" },
      { meal: "Lanche da tarde", emoji: "🫐", name: "Mix de frutas e castanhas", tags: ["Antioxidantes", "Energia"], kcal: "190", time: "2 min" },
      { meal: "Jantar", emoji: "🌙", name: "Atum com salada de rúcula", tags: ["Ômega-3", "Leve"], kcal: "320", time: "15 min" },
    ],
    luteal: [
      { meal: "Café da manhã", emoji: "☀️", name: "Mingau de aveia com banana", tags: ["Magnésio", "Serotonina"], kcal: "300", time: "10 min" },
      { meal: "Almoço", emoji: "🥗", name: "Abóbora assada com frango", tags: ["Vitamina B6", "Proteínas"], kcal: "470", time: "35 min" },
      { meal: "Lanche da tarde", emoji: "🍫", name: "Vitamina de banana com cacau", tags: ["Magnésio", "Triptofano"], kcal: "200", time: "5 min" },
      { meal: "Jantar", emoji: "🌙", name: "Sopa de abóbora com gengibre", tags: ["Anti-inflamatório", "Leve"], kcal: "280", time: "25 min" },
    ],
  };

  const mealList = plans[phase];
  const totalKcal = mealList.reduce((acc, m) => acc + parseInt(m.kcal), 0);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>Plano Alimentar</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <PhaseDot phase={phase} />
            <span style={{ fontSize: 11, color: C.textHint }}>▾</span>
          </div>
        </div>
        <button style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>📅</button>
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", background: C.lavender, borderRadius: 12, padding: 3, marginBottom: 16, gap: 2 }}>
        {views.map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 10, border: "none",
            background: view === v ? C.surface : "transparent",
            color: view === v ? C.primary : C.textHint,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            boxShadow: view === v ? `0 2px 6px ${C.primary}18` : "none",
          }}>{v}</button>
        ))}
      </div>

      {/* Total */}
      <Card style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>Total do dia</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{totalKcal} kcal</span>
      </Card>

      {/* Meals */}
      {mealList.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: C.textHint, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 5 }}>
            <span>{m.emoji}</span> {m.meal}
          </p>
          <FoodCard name={m.name} tags={m.tags} kcal={m.kcal} time={m.time} />
        </div>
      ))}

      <GradientBtn style={{ marginTop: 8 }}>🔄 Gerar novo plano</GradientBtn>
    </div>
  );
}

// ─── SCREEN: Recipes ──────────────────────────────────────────────────────────
function RecipesScreen({ phase }) {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const filters = ["Todas", "TPM", "SOP", "Gestação", "Menopausa"];

  const recipes = [
    { name: "Panqueca de aveia com banana (TPM)", sub: "Rica em magnésio e triptofano", time: "20 min", level: "Fácil", emoji: "🥞", tag: "TPM" },
    { name: "Bowl anti-inflamatório (SOP)", sub: "Equilíbrio hormonal", time: "25 min", level: "Fácil", emoji: "🥗", tag: "SOP" },
    { name: "Brownie funcional com chocolate 70%", sub: "Para TPM — rico em magnésio", time: "30 min", level: "Médio", emoji: "🍫", tag: "TPM" },
    { name: "Sopa anti-inflamatória de legumes", sub: "Rica em fibras e antioxidantes", time: "25 min", level: "Fácil", emoji: "🫕", tag: "SOP" },
    { name: "Vitamina de banana com espinafre", sub: "Energia e ferro — fase menstrual", time: "5 min", level: "Fácil", emoji: "🥤", tag: "Todas" },
  ];

  const filtered = activeFilter === "Todas" ? recipes : recipes.filter(r => r.tag === activeFilter);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>Receitas Funcionais</h2>
        <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>🔍</button>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
        {filters.map(f => <Chip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>{f}</Chip>)}
      </div>

      {filtered.map((r, i) => (
        <Card key={i} style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.accentPale}, ${C.lavender})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
          }}>{r.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{r.name}</p>
            <p style={{ fontSize: 11, color: C.textHint, margin: "0 0 6px" }}>{r.sub}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 11, color: C.textMuted }}>⏱ {r.time}</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>👩‍🍳 {r.level}</span>
            </div>
          </div>
          <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.textHint }}>🤍</button>
        </Card>
      ))}
    </div>
  );
}

// ─── SCREEN: Education ────────────────────────────────────────────────────────
function EducationScreen() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const tabs = ["Todos", "Artigos", "Vídeos", "Guias"];

  const articles = [
    { emoji: "🥗", title: "Alimentação e ciclo menstrual: como sua dieta impacta seus hormônios", time: "5 min", type: "Artigos", text: "Os hormônios estrogênio e progesterona flutuam ao longo do ciclo menstrual e influenciam diretamente o apetite, o metabolismo e as necessidades nutricionais. Entender essa relação permite criar uma dieta sintonizada com cada fase, reduzindo sintomas e promovendo bem-estar. Na fase folicular, foque em ferro e ácido fólico. Na fase lútea, magnésio e ômega-3 são seus aliados." },
    { emoji: "🫀", title: "SOP: alimentos que ajudam no equilíbrio hormonal", time: "6 min", type: "Artigos", text: "A Síndrome dos Ovários Policísticos (SOP) afeta cerca de 10% das mulheres em idade reprodutiva. A alimentação tem papel fundamental no controle dos sintomas. Alimentos de baixo índice glicêmico, ricos em fibras, com ômega-3 e antioxidantes ajudam a reduzir a inflamação e o excesso de andrógenos." },
    { emoji: "🌸", title: "Guia nutricional para uma gestação saudável", time: "7 min", type: "Guias", text: "Durante a gestação, as necessidades nutricionais aumentam significativamente. Ácido fólico previne defeitos do tubo neural, o ferro previne anemia, o cálcio garante o desenvolvimento ósseo do bebê. Uma alimentação equilibrada é o maior presente que você pode dar ao seu filho antes mesmo do nascimento." },
    { emoji: "🌅", title: "Menopausa: como a alimentação pode aliviar sintomas", time: "6 min", type: "Artigos", text: "A queda do estrogênio na menopausa traz desafios como fogachos, alterações de humor e risco aumentado de osteoporose. Isoflavonas da soja, cálcio, vitamina D e alimentos ricos em fitoestrógenos podem ajudar a suavizar essa transição e proteger a saúde óssea e cardiovascular." },
  ];

  const filtered = activeTab === "Todos" ? articles : articles.filter(a => a.type === activeTab);

  if (selected) {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
          ← Voltar
        </button>
        <div style={{ fontSize: 40, marginBottom: 14 }}>{selected.emoji}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: C.textHint }}>📖 {selected.time} de leitura</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: "0 0 16px", lineHeight: 1.3 }}>{selected.title}</h2>
        <Card>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, margin: 0 }}>{selected.text}</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Aprenda</h2>
      <p style={{ fontSize: 13, color: C.textHint, margin: "0 0 16px" }}>Conteúdo educativo sobre nutrição e ciclo</p>

      <div style={{ display: "flex", background: C.lavender, borderRadius: 12, padding: 3, marginBottom: 16, gap: 2 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 10, border: "none",
            background: activeTab === t ? C.surface : "transparent",
            color: activeTab === t ? C.primary : C.textHint,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            boxShadow: activeTab === t ? `0 2px 6px ${C.primary}18` : "none",
          }}>{t}</button>
        ))}
      </div>

      {filtered.map((a, i) => (
        <button key={i} onClick={() => setSelected(a)} style={{
          width: "100%", background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 14, display: "flex", gap: 12, alignItems: "flex-start",
          cursor: "pointer", textAlign: "left", marginBottom: 10,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.lavender}, ${C.accentPale})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>{a.emoji}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 4px", lineHeight: 1.3 }}>{a.title}</p>
            <span style={{ fontSize: 11, color: C.textHint }}>📖 {a.time} de leitura</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── SCREEN: Profile ──────────────────────────────────────────────────────────
function ProfileScreen({ user, cycleDay, phase, onLogout }) {
  const ph = phases[phase];
  const [activeTab, setActiveTab] = useState("Resumo");
  const analysisTabs = ["Resumo", "Sintomas", "Alimentação"];

  const topFoods = [
    { name: "Banana", emoji: "🍌" },
    { name: "Aveia", emoji: "🌾" },
    { name: "Espinafre", emoji: "🥬" },
  ];

  return (
    <div style={{ padding: "0 0 90px" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${C.primary}, ${C.primaryMid})`,
        padding: "52px 20px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={user} size={52} />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>{user}</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "2px 0 0" }}>Editar perfil</p>
            </div>
          </div>
          <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 16, cursor: "pointer" }}>⚙️</button>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Personal data */}
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Dados pessoais</SectionLabel>
          {[["Idade", "28 anos"], ["Peso", "62 kg"], ["Altura", "1,65 m"], ["Objetivo", "Equilíbrio e bem-estar"]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Health conditions */}
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Condições de saúde</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["TPM intensa", "Intolerância à lactose"].map((c, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, color: C.accent, background: C.accentPale, borderRadius: 50, padding: "5px 12px" }}>{c}</span>
            ))}
          </div>
        </Card>

        {/* Dietary prefs */}
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Preferências alimentares</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Sem glúten", "Vegetariana"].map((c, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, color: C.primary, background: C.lavender, borderRadius: 50, padding: "5px 12px" }}>{c}</span>
            ))}
          </div>
        </Card>

        {/* Analyses & insights */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Análises e Insights</p>
            <button style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver relatório</button>
          </div>
          <div style={{ display: "flex", background: C.lavender, borderRadius: 10, padding: 3, gap: 2, marginBottom: 12 }}>
            {analysisTabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                flex: 1, padding: "7px 4px", borderRadius: 8, border: "none",
                background: activeTab === t ? C.surface : "transparent",
                color: activeTab === t ? C.primary : C.textHint,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 10px" }}>Seus ciclos estão regulares 🎉  •  Média de 28 dias</p>

          <SectionLabel>Sintomas mais comuns</SectionLabel>
          {[["Inchaço", 8, 10], ["Fadiga", 6, 10], ["Cólicas", 5, 10]].map(([name, val, max], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.textMuted, minWidth: 60 }}>{name}</span>
              <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 4 }}>
                <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.accent}, ${C.primary})`, width: `${(val / max) * 100}%` }} />
              </div>
              <span style={{ fontSize: 11, color: C.textHint, minWidth: 12 }}>{val}</span>
            </div>
          ))}

          <SectionLabel>Alimentos que mais te ajudam</SectionLabel>
          <div style={{ display: "flex", gap: 12 }}>
            {topFoods.map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{f.emoji}</div>
                <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{f.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Configurações</SectionLabel>
          {[["🔔", "Notificações"], ["⏰", "Lembretes"], ["🔒", "Privacidade"], ["❓", "Ajuda e suporte"], ["ℹ️", "Sobre o CycleNutri"]].map(([icon, label], i, arr) => (
            <button key={i} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", border: "none", padding: "11px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>{icon}</span>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{label}</span>
              </div>
              <span style={{ color: C.textHint }}>›</span>
            </button>
          ))}
        </Card>

        <button onClick={onLogout} style={{
          width: "100%", padding: 13, borderRadius: 14, border: `1.5px solid ${C.accentLight}`,
          background: "none", color: C.accent, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>Sair da conta</button>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function CycleNutri() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("Camila Oliveira");
  const [tab, setTab] = useState("home");
  const [cycleDay, setCycleDay] = useState(18);

  const phase = getPhase(cycleDay);

  if (!loggedIn) {
    return <LoginScreen onLogin={name => { setUser(name); setLoggedIn(true); }} />;
  }

  const screens = {
    home: <HomeScreen user={user} cycleDay={cycleDay} phase={phase} onNavigate={setTab} />,
    cycle: <CycleScreen cycleDay={cycleDay} setCycleDay={setCycleDay} />,
    diary: <DiaryScreen phase={phase} />,
    plan: <PlanScreen phase={phase} />,
    recipes: <RecipesScreen phase={phase} />,
    education: <EducationScreen />,
    profile: <ProfileScreen user={user} cycleDay={cycleDay} phase={phase} onLogout={() => setLoggedIn(false)} />,
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif",
      background: C.bg,
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflowX: "hidden",
    }}>
      {screens[tab] || screens.home}
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
