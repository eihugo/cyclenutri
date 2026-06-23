import { useState, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const palette = {
  rose: { 50: "#fff0f3", 100: "#ffd6e0", 200: "#ffadc0", 400: "#f46d8a", 600: "#c23a5c", 800: "#7a1635", 900: "#4a0a1f" },
  plum: { 50: "#f9f0ff", 100: "#ead6ff", 200: "#d4adff", 400: "#a855f7", 600: "#7c22b8", 800: "#4c1180", 900: "#2d0a52" },
  sage: { 50: "#f0faf4", 100: "#d1f0dc", 200: "#a3e1bb", 400: "#4caf7d", 600: "#2a7a52", 800: "#154d32", 900: "#0a3020" },
  sky: { 50: "#f0f7ff", 100: "#d0e8ff", 200: "#a1d1ff", 400: "#3b9eff", 600: "#1a6bc2", 800: "#0a3d80", 900: "#052550" },
  amber: { 50: "#fffbeb", 100: "#fde68a", 400: "#f59e0b", 600: "#d97706", 800: "#92400e" },
  neutral: { 50: "#faf9fb", 100: "#f0eef4", 200: "#e0dce8", 400: "#9d94b0", 600: "#5c5470", 800: "#2d2640", 900: "#1a1528" },
};

// ─── Phase Data ────────────────────────────────────────────────────────────────
const PHASES = {
  menstrual: {
    label: "Menstrual",
    emoji: "🔴",
    color: "rose",
    days: "1–5",
    description: "Renovação e introspecção",
    tip: "Aumente a ingestão de ferro e mantenha-se hidratada.",
    foods: ["Feijão", "Espinafre", "Carne vermelha magra", "Lentilha", "Tofu"],
    nutrients: ["Ferro", "Vitamina C", "Magnésio", "Zinco"],
    avoid: ["Cafeína excessiva", "Álcool", "Alimentos ultraprocessados"],
  },
  follicular: {
    label: "Folicular",
    emoji: "🌱",
    color: "sage",
    days: "6–13",
    description: "Energia e criatividade crescentes",
    tip: "Aposte em probióticos e alimentos frescos para nutrir o crescimento.",
    foods: ["Iogurte natural", "Avocado", "Ovos", "Salmão", "Brócolis"],
    nutrients: ["Probióticos", "Vitamina B", "Ácido Fólico", "Ferro"],
    avoid: ["Excesso de açúcar", "Alimentos muito gordurosos"],
  },
  ovulatory: {
    label: "Ovulatória",
    emoji: "✨",
    color: "amber",
    days: "14–16",
    description: "Pico de energia e comunicação",
    tip: "Priorize proteínas e hidratação para sustentar seu pico.",
    foods: ["Chia", "Quinoa", "Frango", "Aspargos", "Framboesas"],
    nutrients: ["Proteínas", "Antioxidantes", "Vitamina E", "Zinco"],
    avoid: ["Excesso de cafeína", "Alimentos inflamatórios"],
  },
  luteal: {
    label: "Lútea",
    emoji: "🌙",
    color: "plum",
    days: "17–28",
    description: "Período de preparação e sensibilidade",
    tip: "Magnésio e ômega-3 ajudam a reduzir a tensão pré-menstrual.",
    foods: ["Chocolate 70%", "Castanhas", "Abóbora", "Banana", "Salmão"],
    nutrients: ["Magnésio", "Ômega-3", "Cálcio", "Vitamina B6"],
    avoid: ["Sal em excesso", "Cafeína", "Açúcar refinado"],
  },
};

const SYMPTOMS = [
  { id: "cramping", label: "Cólicas", icon: "⚡" },
  { id: "headache", label: "Dor de cabeça", icon: "🧠" },
  { id: "bloating", label: "Inchaço", icon: "💧" },
  { id: "fatigue", label: "Fadiga", icon: "😴" },
  { id: "mood", label: "Alterações de humor", icon: "🌊" },
  { id: "acne", label: "Acne", icon: "⭕" },
  { id: "craving", label: "Desejo por doces", icon: "🍫" },
  { id: "breast", label: "Sensibilidade mamária", icon: "💗" },
];

const INTENSITY = ["Nenhum", "Leve", "Moderado", "Forte"];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getPhase(dayOfCycle) {
  if (dayOfCycle <= 5) return "menstrual";
  if (dayOfCycle <= 13) return "follicular";
  if (dayOfCycle <= 16) return "ovulatory";
  return "luteal";
}

function getDayLabel(day) {
  const d = new Date();
  d.setDate(d.getDate() + day);
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
}

// ─── Color utils ───────────────────────────────────────────────────────────────
const phaseGradients = {
  rose: "linear-gradient(135deg, #fff0f3 0%, #ffd6e0 100%)",
  sage: "linear-gradient(135deg, #f0faf4 0%, #d1f0dc 100%)",
  amber: "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
  plum: "linear-gradient(135deg, #f9f0ff 0%, #ead6ff 100%)",
};

const phaseAccents = {
  rose: "#c23a5c",
  sage: "#2a7a52",
  amber: "#d97706",
  plum: "#7c22b8",
};

const phaseLight = {
  rose: "#ffd6e0",
  sage: "#d1f0dc",
  amber: "#fde68a",
  plum: "#ead6ff",
};

// ─── Components ────────────────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%",
      background: "linear-gradient(135deg, #f46d8a, #a855f7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 600, fontSize: 14, flexShrink: 0,
    }}>{initials}</div>
  );
}

function Badge({ children, color = "rose" }) {
  return (
    <span style={{
      background: phaseLight[color],
      color: phaseAccents[color],
      fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 20,
      letterSpacing: "0.03em",
    }}>{children}</span>
  );
}

function IntensityPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {INTENSITY.map((label, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500,
            border: value === i ? "1.5px solid #c23a5c" : "1px solid #e0dce8",
            background: value === i ? "#fff0f3" : "#faf9fb",
            color: value === i ? "#c23a5c" : "#5c5470",
            cursor: "pointer",
          }}
        >{label}</button>
      ))}
    </div>
  );
}

function PhaseCard({ phase, active, onClick }) {
  const p = PHASES[phase];
  const accent = phaseAccents[p.color];
  const light = phaseLight[p.color];
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${accent}` : "1.5px solid #e0dce8",
        borderRadius: 14,
        padding: "14px 12px",
        background: active ? phaseGradients[p.color] : "#faf9fb",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        width: "100%",
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.label}</div>
      <div style={{ fontSize: 11, color: "#9d94b0", marginTop: 2 }}>Dias {p.days}</div>
    </button>
  );
}

function CircleProgress({ value, max, color, size = 80 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / max) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e0dce8" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
    </svg>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

// Login
function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff0f3 0%, #f9f0ff 50%, #f0f7ff 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌸</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1528", margin: 0, letterSpacing: "-0.5px" }}>CycleNutri</h1>
        <p style={{ color: "#9d94b0", fontSize: 14, marginTop: 6 }}>Nutrição personalizada para cada fase</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, boxShadow: "0 4px 24px rgba(194,58,92,0.10)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1528", marginBottom: 20 }}>
          {isRegister ? "Criar conta" : "Bem-vinda de volta"}
        </h2>

        {isRegister && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#5c5470", display: "block", marginBottom: 4 }}>Nome completo</label>
            <input
              type="text" placeholder="Seu nome"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dce8", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#5c5470", display: "block", marginBottom: 4 }}>E-mail</label>
          <input
            type="email" placeholder="voce@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dce8", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#5c5470", display: "block", marginBottom: 4 }}>Senha</label>
          <input
            type="password" placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dce8", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={() => onLogin(form.name || "Usuária")}
          style={{
            width: "100%", padding: "12px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #f46d8a, #a855f7)",
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >{isRegister ? "Criar conta" : "Entrar"}</button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#9d94b0", marginTop: 18 }}>
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: "none", border: "none", color: "#c23a5c", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {isRegister ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}

// Dashboard
function DashboardScreen({ user, cycleDay, phase }) {
  const p = PHASES[phase];
  const accent = phaseAccents[p.color];

  const stats = [
    { label: "Dia do ciclo", value: cycleDay, max: 28, unit: "de 28" },
    { label: "Dias restantes", value: 28 - cycleDay, max: 28, unit: "dias" },
    { label: "Nível de energia", value: 72, max: 100, unit: "%" },
    { label: "Hidratação", value: 6, max: 8, unit: "copos" },
  ];

  const messages = {
    menstrual: "Você está menstruada. Priorize repouso e alimentos ricos em ferro hoje. 🩸",
    follicular: "Ótimo momento para experimentar novos alimentos! Sua energia está aumentando. 🌱",
    ovulatory: "Você está próxima da ovulação. Consuma proteínas e mantenha-se bem hidratada. ✨",
    luteal: "Fase lútea detectada. Magnésio e ômega-3 são seus melhores aliados agora. 🌙",
  };

  return (
    <div style={{ padding: "0 0 80px" }}>
      {/* Hero */}
      <div style={{ background: phaseGradients[p.color], padding: "28px 20px 24px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 13, color: "#9d94b0", margin: 0 }}>Olá, {user.name.split(" ")[0]} 👋</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1528", margin: "2px 0 0" }}>Seu ciclo hoje</h2>
          </div>
          <Avatar name={user.name} />
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 12px rgba(194,58,92,0.08)" }}>
          <CircleProgress value={cycleDay} max={28} color={accent} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: accent }}>{p.label}</span>
            </div>
            <p style={{ fontSize: 12, color: "#9d94b0", margin: "0 0 8px" }}>Dia {cycleDay} — {p.description}</p>
            <Badge color={p.color}>Dias {p.days}</Badge>
          </div>
        </div>
      </div>

      {/* Smart tip */}
      <div style={{ margin: "16px 16px 0", background: "#fff", borderRadius: 14, padding: "14px 16px", borderLeft: `4px solid ${accent}` }}>
        <p style={{ fontSize: 13, color: "#2d2640", margin: 0, lineHeight: 1.6 }}>
          💡 {messages[phase]}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 16px 0" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f0eef4" }}>
            <p style={{ fontSize: 11, color: "#9d94b0", margin: "0 0 6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#1a1528" }}>{s.value}</span>
              <span style={{ fontSize: 12, color: "#9d94b0" }}>{s.unit}</span>
            </div>
            <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: "#f0eef4" }}>
              <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${accent}, ${phaseLight[p.color]})`, width: `${(s.value / s.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Today's foods */}
      <div style={{ margin: "16px 16px 0" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1528", margin: "0 0 10px" }}>Alimentos recomendados hoje</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {p.foods.map((f, i) => (
            <div key={i} style={{ background: phaseLight[p.color], borderRadius: 20, padding: "6px 14px", fontSize: 13, color: accent, fontWeight: 500 }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Nutrients */}
      <div style={{ margin: "16px 16px 0", background: "#fff", borderRadius: 14, padding: "16px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1528", margin: "0 0 12px" }}>Nutrientes prioritários</h3>
        {p.nutrients.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < p.nutrients.length - 1 ? "1px solid #f0eef4" : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#2d2640" }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Calendar
function CalendarScreen({ cycleDay, phase, setCycleDay }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const today = new Date();

  function getPhaseColor(day) {
    const ph = getPhase(day);
    return phaseAccents[PHASES[ph].color];
  }

  function getPhaseLight(day) {
    const ph = getPhase(day);
    return phaseLight[PHASES[ph].color];
  }

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1528", margin: "0 0 4px" }}>Calendário Menstrual</h2>
      <p style={{ fontSize: 13, color: "#9d94b0", margin: "0 0 20px" }}>Toque em um dia para ver detalhes</p>

      {/* Phase legend */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(PHASES).map(([key, p]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: phaseAccents[p.color] }} />
            <span style={{ fontSize: 11, color: "#5c5470" }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 20 }}>
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#9d94b0", fontWeight: 700, padding: "4px 0" }}>{d}</div>
        ))}
        {Array.from({ length: today.getDay() }, (_, i) => <div key={`e${i}`} />)}
        {days.map(day => (
          <button
            key={day}
            onClick={() => setCycleDay(day)}
            style={{
              aspectRatio: "1", borderRadius: 10, border: "none",
              background: day === cycleDay ? getPhaseColor(day) : getPhaseLight(day),
              color: day === cycleDay ? "#fff" : getPhaseColor(day),
              fontSize: 12, fontWeight: day === cycleDay ? 700 : 500,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: day === cycleDay ? `0 2px 8px ${getPhaseColor(day)}60` : "none",
            }}
          >{day}</button>
        ))}
      </div>

      {/* Selected day info */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #f0eef4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: phaseGradients[PHASES[getPhase(cycleDay)].color], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {PHASES[getPhase(cycleDay)].emoji}
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#9d94b0", margin: 0, fontWeight: 600, textTransform: "uppercase" }}>Dia {cycleDay} do ciclo</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1528", margin: "2px 0 0" }}>{PHASES[getPhase(cycleDay)].label}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#5c5470", margin: "0 0 12px", lineHeight: 1.6 }}>
          {PHASES[getPhase(cycleDay)].tip}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PHASES[getPhase(cycleDay)].nutrients.map((n, i) => (
            <Badge key={i} color={PHASES[getPhase(cycleDay)].color}>{n}</Badge>
          ))}
        </div>
      </div>

      {/* Register period button */}
      <button style={{
        width: "100%", marginTop: 14, padding: 14, borderRadius: 14, border: "1.5px dashed #f46d8a",
        background: "#fff0f3", color: "#c23a5c", fontSize: 14, fontWeight: 600, cursor: "pointer",
      }}>
        + Registrar início da menstruação
      </button>
    </div>
  );
}

// Symptoms
function SymptomsScreen() {
  const [symptoms, setSymptoms] = useState({});
  const [saved, setSaved] = useState(false);

  function setSymptom(id, val) {
    setSymptoms(prev => ({ ...prev, [id]: val }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const recommendations = [];
  if ((symptoms.cramping || 0) >= 2) recommendations.push({ text: "Magnésio e ômega-3 para cólicas", icon: "💊" });
  if ((symptoms.fatigue || 0) >= 2) recommendations.push({ text: "Ferro e vitamina B12 para fadiga", icon: "⚡" });
  if ((symptoms.craving || 0) >= 2) recommendations.push({ text: "Frutas e chocolate 70% para o desejo por doces", icon: "🍫" });
  if ((symptoms.bloating || 0) >= 2) recommendations.push({ text: "Reduzir sódio e aumentar hidratação", icon: "💧" });

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1528", margin: "0 0 4px" }}>Sintomas de Hoje</h2>
      <p style={{ fontSize: 13, color: "#9d94b0", margin: "0 0 20px" }}>
        {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SYMPTOMS.map(s => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f0eef4" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1528" }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9d94b0" }}>{INTENSITY[symptoms[s.id] || 0]}</span>
            </div>
            <IntensityPicker value={symptoms[s.id] || 0} onChange={val => setSymptom(s.id, val)} />
          </div>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: 16, background: "#f9f0ff", borderRadius: 14, padding: 16, border: "1px solid #ead6ff" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#4c1180", margin: "0 0 10px" }}>💜 Recomendações para você</h3>
          {recommendations.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
              <span>{r.icon}</span>
              <span style={{ fontSize: 13, color: "#5c5470" }}>{r.text}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        style={{
          width: "100%", marginTop: 16, padding: 14, borderRadius: 14, border: "none",
          background: saved ? "#4caf7d" : "linear-gradient(135deg, #f46d8a, #a855f7)",
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.2s",
        }}
      >
        {saved ? "✓ Sintomas salvos!" : "Salvar sintomas"}
      </button>
    </div>
  );
}

// Meal Plan
function MealPlanScreen({ phase }) {
  const p = PHASES[phase];
  const accent = phaseAccents[p.color];

  const mealPlans = {
    menstrual: {
      breakfast: { name: "Vitamina de Espinafre com Banana", cal: 280, protein: 8, carb: 42, fat: 9, ingredients: ["1 xíc espinafre", "1 banana", "200ml leite vegetal", "1 col sopa chia"] },
      lunch: { name: "Feijão Preto com Arroz Integral e Couve", cal: 520, protein: 22, carb: 78, fat: 8, ingredients: ["100g feijão preto", "80g arroz integral", "2 folhas couve", "1 fio de azeite"] },
      dinner: { name: "Sopa de Lentilha com Legumes", cal: 340, protein: 18, carb: 48, fat: 6, ingredients: ["120g lentilha", "1 cenoura", "1 batata", "2 dentes alho", "Cúrcuma"] },
      snack: { name: "Castanhas e Chocolate 70%", cal: 190, protein: 5, carb: 12, fat: 14, ingredients: ["30g castanha do pará", "2 quadradinhos chocolate 70%"] },
    },
    follicular: {
      breakfast: { name: "Bowl de Iogurte com Granola e Frutas Vermelhas", cal: 320, protein: 14, carb: 48, fat: 7, ingredients: ["150g iogurte natural", "40g granola", "50g morangos", "50g mirtilo"] },
      lunch: { name: "Salada de Quinoa com Frango Grelhado", cal: 480, protein: 38, carb: 45, fat: 12, ingredients: ["80g quinoa", "150g frango", "Tomate cereja", "Pepino", "Azeite"] },
      dinner: { name: "Salmão Assado com Brócolis no Vapor", cal: 390, protein: 36, carb: 18, fat: 18, ingredients: ["150g salmão", "1 xíc brócolis", "Limão", "Ervas frescas"] },
      snack: { name: "Avocado Toast Integral", cal: 220, protein: 6, carb: 26, fat: 11, ingredients: ["1 fatia pão integral", "½ abacate", "Limão", "Sal rosa"] },
    },
    ovulatory: {
      breakfast: { name: "Omelete de Espinafre e Tomate", cal: 260, protein: 20, carb: 8, fat: 16, ingredients: ["3 ovos caipira", "1 xíc espinafre", "1 tomate", "Ervas a gosto"] },
      lunch: { name: "Bowl de Frango com Aspargos e Quinoa", cal: 510, protein: 42, carb: 44, fat: 10, ingredients: ["160g peito frango", "80g quinoa", "6 aspargos", "Molho tahini"] },
      dinner: { name: "Atum com Salada de Framboesa e Rúcula", cal: 340, protein: 32, carb: 22, fat: 14, ingredients: ["150g atum fresco", "50g framboesas", "Rúcula", "Azeite", "Limão"] },
      snack: { name: "Mix de Sementes e Frutas Secas", cal: 180, protein: 6, carb: 20, fat: 10, ingredients: ["30g mix sementes", "20g frutas secas sem açúcar"] },
    },
    luteal: {
      breakfast: { name: "Mingau de Aveia com Banana e Canela", cal: 290, protein: 8, carb: 52, fat: 6, ingredients: ["60g aveia", "1 banana", "Canela", "200ml leite", "1 col mel"] },
      lunch: { name: "Abóbora Assada com Frango e Arroz Integral", cal: 490, protein: 34, carb: 62, fat: 10, ingredients: ["200g abóbora", "130g frango", "70g arroz integral", "Açafrão"] },
      dinner: { name: "Salmão com Espinafre Refogado e Batata Doce", cal: 420, protein: 32, carb: 38, fat: 16, ingredients: ["150g salmão", "1 xíc espinafre", "1 batata doce média"] },
      snack: { name: "Banana com Pasta de Castanha e Chocolate 70%", cal: 210, protein: 5, carb: 28, fat: 10, ingredients: ["1 banana", "1 col pasta de amendoim", "2 quadradinhos chocolate 70%"] },
    },
  };

  const plan = mealPlans[phase];
  const meals = [
    { key: "breakfast", label: "Café da manhã", emoji: "☀️" },
    { key: "lunch", label: "Almoço", emoji: "🥗" },
    { key: "dinner", label: "Jantar", emoji: "🌙" },
    { key: "snack", label: "Lanche", emoji: "🍎" },
  ];

  const totalCal = Object.values(plan).reduce((acc, m) => acc + m.cal, 0);

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1528", margin: 0 }}>Plano Alimentar</h2>
          <p style={{ fontSize: 13, color: "#9d94b0", margin: "2px 0 0" }}>Fase {p.label} {p.emoji}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: "#9d94b0", margin: 0 }}>Total do dia</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: accent, margin: 0 }}>{totalCal} kcal</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4, marginTop: 12 }}>
        {[["Proteínas", Object.values(plan).reduce((a, m) => a + m.protein, 0) + "g"], ["Carboidratos", Object.values(plan).reduce((a, m) => a + m.carb, 0) + "g"], ["Gorduras", Object.values(plan).reduce((a, m) => a + m.fat, 0) + "g"]].map(([label, val], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "10px 16px", border: "1px solid #f0eef4", flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: "#9d94b0", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase" }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1528", margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      {meals.map(({ key, label, emoji }) => {
        const meal = plan[key];
        return (
          <div key={key} style={{ background: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, border: "1px solid #f0eef4" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#9d94b0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{meal.cal} kcal</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1528", margin: "0 0 8px" }}>{meal.name}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {meal.ingredients.map((ing, i) => (
                <span key={i} style={{ fontSize: 11, background: phaseLight[p.color], color: accent, borderRadius: 6, padding: "3px 8px" }}>{ing}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, borderTop: "1px solid #f0eef4", paddingTop: 8 }}>
              {[["P", meal.protein + "g"], ["C", meal.carb + "g"], ["G", meal.fat + "g"]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#9d94b0", fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#5c5470" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button style={{
        width: "100%", padding: 14, borderRadius: 14, border: "none",
        background: `linear-gradient(135deg, ${accent}, ${phaseLight[p.color]})`,
        color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
      }}>
        🔄 Gerar novo plano
      </button>
    </div>
  );
}

// Education
function EducationScreen() {
  const [selected, setSelected] = useState(null);

  const content = [
    {
      category: "Ciclo Menstrual", emoji: "🔄", color: "rose",
      articles: [
        { title: "As 4 fases do ciclo", text: "O ciclo menstrual se divide em 4 fases: menstrual (1-5 dias), folicular (6-13), ovulatória (14-16) e lútea (17-28). Cada fase tem características hormonais únicas que influenciam energia, humor e necessidades nutricionais." },
        { title: "Hormônios e nutrição", text: "Estrogênio e progesterona flutuam durante o ciclo. Na fase folicular, o estrogênio favorece metabolismo de ferro. Na fase lútea, a progesterona aumenta o apetite e a necessidade de magnésio." },
      ],
    },
    {
      category: "Nutrição Feminina", emoji: "🥗", color: "sage",
      articles: [
        { title: "Macronutrientes por fase", text: "Proteínas são essenciais na fase ovulatória para sustentar a energia. Carboidratos complexos ajudam na fase lútea. Gorduras boas (ômega-3) são especialmente importantes na fase menstrual para reduzir inflamação." },
        { title: "Micronutrientes essenciais", text: "Ferro: menstruação. Ácido fólico: fase folicular. Vitamina D e cálcio: saúde óssea ao longo do ciclo. Zinco: regularidade hormonal. Magnésio: redução de TPM." },
      ],
    },
    {
      category: "Saúde Intestinal", emoji: "🦠", color: "plum",
      articles: [
        { title: "Probióticos e o ciclo", text: "A microbiota intestinal influencia diretamente o metabolismo do estrogênio. Uma flora saudável ajuda a eliminar o excesso de estrogênio, reduzindo sintomas de TPM e cólicas." },
        { title: "Prebióticos: combustível para as bactérias boas", text: "Alho, cebola, aspargos, banana verde e aveia são ricos em prebióticos. Alimentam as bactérias benéficas do intestino, melhorando imunidade e equilíbrio hormonal." },
      ],
    },
    {
      category: "Fertilidade", emoji: "🌸", color: "amber",
      articles: [
        { title: "Nutrientes para a fertilidade", text: "Ácido fólico, CoQ10, vitamina E, zinco e ômega-3 são nutrientes-chave. Dieta mediterrânea tem evidências científicas para apoiar a fertilidade feminina." },
      ],
    },
    {
      category: "Menopausa", emoji: "🌅", color: "sky",
      articles: [
        { title: "Alimentação na menopausa", text: "Com a queda do estrogênio, aumenta o risco de osteoporose e doenças cardiovasculares. Cálcio, vitamina D, proteínas e isoflavonas (soja) são prioridade. Reduzir açúcar e álcool ajuda a controlar fogachos." },
      ],
    },
  ];

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1528", margin: "0 0 4px" }}>Educação Nutricional</h2>
      <p style={{ fontSize: 13, color: "#9d94b0", margin: "0 0 20px" }}>Aprenda sobre seu corpo e nutrição</p>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#c23a5c", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "0 0 16px", display: "flex", alignItems: "center", gap: 4 }}>
            ← Voltar
          </button>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f0eef4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{selected.category.emoji}</span>
              <div>
                <p style={{ fontSize: 11, color: "#9d94b0", margin: 0, textTransform: "uppercase", fontWeight: 700 }}>
                  {content.find(c => c.articles.includes(selected))?.category}
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1528", margin: "2px 0 0" }}>{selected.title}</h3>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#5c5470", lineHeight: 1.8, margin: 0 }}>{selected.text}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {content.map((cat, ci) => (
            <div key={ci} style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0eef4", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", background: phaseGradients[cat.color] || "#f9f9f9", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1528", margin: 0 }}>{cat.category}</h3>
              </div>
              {cat.articles.map((article, ai) => (
                <button
                  key={ai}
                  onClick={() => setSelected({ ...article, category: { emoji: cat.emoji } })}
                  style={{
                    width: "100%", textAlign: "left", background: "none", border: "none",
                    padding: "12px 16px",
                    borderTop: "1px solid #f0eef4",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#2d2640", fontWeight: 500 }}>{article.title}</span>
                  <span style={{ fontSize: 16, color: "#9d94b0" }}>›</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile
function ProfileScreen({ user, cycleDay, phase }) {
  const p = PHASES[phase];
  const accent = phaseAccents[p.color];

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #f46d8a, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 32, color: "#fff" }}>
          {user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1528", margin: 0 }}>{user.name}</h2>
        <p style={{ fontSize: 13, color: "#9d94b0", margin: "4px 0 0" }}>Membro CycleNutri</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {[["Ciclo atual", `Dia ${cycleDay}`], ["Fase", p.label], ["Registros", "12"]].map(([label, val], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #f0eef4" }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1528", margin: "0 0 2px" }}>{val}</p>
            <p style={{ fontSize: 10, color: "#9d94b0", margin: 0, fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0eef4", overflow: "hidden" }}>
        {[
          ["👤", "Dados pessoais"],
          ["🎯", "Meu objetivo"],
          ["🚫", "Restrições alimentares"],
          ["🔔", "Notificações"],
          ["🌙", "Modo escuro"],
          ["📊", "Histórico do ciclo"],
          ["📥", "Exportar em PDF"],
          ["🔒", "Privacidade e LGPD"],
        ].map(([emoji, label], i, arr) => (
          <button
            key={i}
            style={{
              width: "100%", textAlign: "left", background: "none", border: "none",
              padding: "14px 16px",
              borderBottom: i < arr.length - 1 ? "1px solid #f0eef4" : "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{emoji}</span>
              <span style={{ fontSize: 14, color: "#2d2640", fontWeight: 500 }}>{label}</span>
            </div>
            <span style={{ fontSize: 16, color: "#9d94b0" }}>›</span>
          </button>
        ))}
      </div>

      <button style={{
        width: "100%", marginTop: 14, padding: 14, borderRadius: 14, border: "1.5px solid #ffd6e0",
        background: "#fff", color: "#c23a5c", fontSize: 14, fontWeight: 600, cursor: "pointer",
      }}>
        Sair da conta
      </button>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "dashboard", label: "Início", emoji: "🏠" },
    { id: "calendar", label: "Calendário", emoji: "📅" },
    { id: "symptoms", label: "Sintomas", emoji: "📝" },
    { id: "meals", label: "Cardápio", emoji: "🥗" },
    { id: "education", label: "Aprender", emoji: "📚" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
      borderTop: "1px solid #f0eef4",
      display: "flex", padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
      zIndex: 100,
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            opacity: active === t.id ? 1 : 0.45,
          }}
        >
          <span style={{ fontSize: 20 }}>{t.emoji}</span>
          <span style={{ fontSize: 10, fontWeight: active === t.id ? 700 : 500, color: active === t.id ? "#c23a5c" : "#9d94b0" }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function CycleNutri() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "Usuária" });
  const [tab, setTab] = useState("dashboard");
  const [cycleDay, setCycleDay] = useState(18);

  const phase = getPhase(cycleDay);

  function handleLogin(name) {
    setUser({ name });
    setLoggedIn(true);
  }

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  const screens = {
    dashboard: <DashboardScreen user={user} cycleDay={cycleDay} phase={phase} />,
    calendar: <CalendarScreen cycleDay={cycleDay} phase={phase} setCycleDay={setCycleDay} />,
    symptoms: <SymptomsScreen />,
    meals: <MealPlanScreen phase={phase} />,
    education: <EducationScreen />,
    profile: <ProfileScreen user={user} cycleDay={cycleDay} phase={phase} />,
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#faf9fb",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
    }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0eef4",
        padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌸</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1528" }}>CycleNutri</span>
        </div>
        <button
          onClick={() => setTab(tab === "profile" ? "dashboard" : "profile")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <Avatar name={user.name} />
        </button>
      </div>

      {/* Screen content */}
      <div style={{ paddingTop: 4 }}>
        {screens[tab]}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
