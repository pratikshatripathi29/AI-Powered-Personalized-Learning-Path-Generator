// App.js — The entire frontend UI
import { useState } from "react";

// ── SKILL DEFINITIONS ──────────────────────────────────
const SKILLS = [
  { key: "python",    label: "Python / Programming", icon: "🐍", desc: "Loops, functions, OOP" },
  { key: "math",      label: "Math / Statistics",    icon: "📐", desc: "Algebra, probability, linear algebra" },
  { key: "webdev",    label: "Web Development",      icon: "🌐", desc: "HTML, CSS, JavaScript, React" },
  { key: "databases", label: "Databases / SQL",      icon: "🗃️", desc: "Queries, schema design, NoSQL" },
  { key: "ml_basics", label: "ML / Data Science",    icon: "🤖", desc: "Algorithms, model training, data analysis" },
];

const priorityColor = (p) =>
  p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";

// ── MAIN APP ──────────────────────────────────────────
export default function App() {
  // State: tracks which screen we're on
  const [step, setStep] = useState("name"); // "name" | "assess" | "loading" | "result"

  // State: user's name
  const [name, setName] = useState("");

  // State: skill sliders (start at 3 out of 10)
  const [scores, setScores] = useState({
    python: 3, math: 3, webdev: 3, databases: 3, ml_basics: 2,
  });

  // State: result from ML model
  const [result, setResult] = useState(null);

  // State: which topics user has checked off
  const [completed, setCompleted] = useState({});

  // ── CALL THE BACKEND ──────────────────────────────
  const generatePath = async () => {
    setStep("loading"); // show spinner

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scores), // send scores to backend
      });

      const data = await response.json(); // get result back
      setResult(data);
      setStep("result");
    } catch (error) {
      alert("❌ Could not connect to backend. Make sure uvicorn is running!");
      setStep("assess");
    }
  };

  const toggleComplete = (i) =>
    setCompleted((prev) => ({ ...prev, [i]: !prev[i] }));

  // ── SCREEN 1: Enter Name ──────────────────────────
  if (step === "name") return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
        <h1 style={styles.heading}>AI Learning Path Generator</h1>
        <p style={styles.subtext}>
          Rate your skills → our <strong>KNN algorithm</strong> recommends your perfect learning roadmap.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("assess")}
          placeholder="Enter your name..."
          style={styles.input}
          autoFocus
        />
        <button
          onClick={() => name.trim() && setStep("assess")}
          disabled={!name.trim()}
          style={{ ...styles.button, opacity: name.trim() ? 1 : 0.5 }}
        >
          Start Assessment →
        </button>
      </div>
    </div>
  );

  // ── SCREEN 2: Skill Sliders ───────────────────────
  if (step === "assess") return (
    <div style={{ ...styles.page, padding: "32px 16px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ color: "white", fontSize: 26, fontWeight: 900 }}>
            Hey {name}! Rate Your Skills
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>0 = Never heard of it · 10 = I could teach it</p>
        </div>

        {SKILLS.map((skill) => (
          <div key={skill.key} style={styles.skillCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{skill.icon} {skill.label}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{skill.desc}</div>
              </div>
              {/* Big score badge */}
              <div style={styles.scoreBadge}>{scores[skill.key]}</div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="10"
              value={scores[skill.key]}
              onChange={(e) =>
                setScores((prev) => ({ ...prev, [skill.key]: Number(e.target.value) }))
              }
              style={{ width: "100%", accentColor: "#4f46e5", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
              <span>Beginner (0)</span>
              <span>Mid (5)</span>
              <span>Expert (10)</span>
            </div>
          </div>
        ))}

        <button onClick={generatePath} style={{ ...styles.button, width: "100%", marginTop: 8 }}>
          🚀 Generate My Learning Path
        </button>
      </div>
    </div>
  );

  // ── SCREEN 3: Loading ─────────────────────────────
  if (step === "loading") return (
    <div style={{ ...styles.page, justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⚙️</div>
      <h2 style={{ color: "white", fontSize: 22 }}>Running KNN Algorithm...</h2>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Finding your 3 nearest learner matches</p>
    </div>
  );

  // ── SCREEN 4: Results ─────────────────────────────
  if (step === "result" && result) {
    const path = result.path;
    const doneCount = Object.values(completed).filter(Boolean).length;
    const progress = Math.round((doneCount / path.topics.length) * 100);

    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)", padding: "36px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 52 }}>🎯</div>
          <h1 style={{ color: "white", fontSize: 24, fontWeight: 900, margin: "12px 0 8px" }}>
            {name}'s Personalized Path
          </h1>
          <div style={{ display: "inline-block", background: "#4f46e5", color: "white", borderRadius: 22, padding: "8px 24px", fontWeight: 800, fontSize: 16 }}>
            {path.title}
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Overall Score", value: `${result.overall_score}/10`, icon: "📊" },
              { label: "AI Confidence", value: `${result.confidence}%`, icon: "🤖" },
              { label: "Est. Duration", value: `${path.weeks} weeks`, icon: "📅" },
            ].map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <div style={{ fontSize: 28 }}>{stat.icon}</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: "#1f2937" }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 800, color: "#065f46", marginBottom: 8 }}>💪 Strengths</div>
              {result.strengths.length
                ? result.strengths.map((s) => <div key={s} style={{ color: "#16a34a", fontSize: 13 }}>✓ {s}</div>)
                : <div style={{ color: "#6b7280", fontSize: 13 }}>Keep building!</div>}
            </div>
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 800, color: "#9a3412", marginBottom: 8 }}>📈 Focus Areas</div>
              {result.weaknesses.length
                ? result.weaknesses.map((s) => <div key={s} style={{ color: "#ea580c", fontSize: 13 }}>→ {s}</div>)
                : <div style={{ color: "#6b7280", fontSize: 13 }}>Great all-rounder!</div>}
            </div>
          </div>

          {/* Skill bars */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📊 Your Skill Breakdown</h3>
            {SKILLS.map((skill) => (
              <div key={skill.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{skill.icon} {skill.label.split(" / ")[0]}</span>
                  <span style={{ color: "#6b7280" }}>{scores[skill.key]}/10</span>
                </div>
                <div style={{ background: "#f3f4f6", borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${scores[skill.key] * 10}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                    borderRadius: 6,
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Roadmap checklist */}
          <div style={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={styles.sectionTitle}>📚 Your Roadmap</h3>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{doneCount}/{path.topics.length} done</span>
            </div>

            {/* Progress bar */}
            <div style={{ background: "#f3f4f6", borderRadius: 8, height: 10, marginBottom: 18 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#4f46e5", borderRadius: 8, transition: "width 0.4s" }} />
            </div>

            {path.topics.map((topic, i) => (
              <div
                key={i}
                onClick={() => toggleComplete(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12, marginBottom: 8,
                  cursor: "pointer",
                  background: completed[i] ? "#f0fdf4" : "#f9fafb",
                  border: `1.5px solid ${completed[i] ? "#86efac" : "#e5e7eb"}`,
                  transition: "all 0.2s"
                }}
              >
                {/* Checkbox circle */}
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: `2.5px solid ${completed[i] ? "#4f46e5" : "#d1d5db"}`,
                  background: completed[i] ? "#4f46e5" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  {completed[i] && <span style={{ color: "white", fontSize: 13 }}>✓</span>}
                </div>

                {/* Topic info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: completed[i] ? "#9ca3af" : "#1f2937", textDecoration: completed[i] ? "line-through" : "none" }}>
                    {topic.name}
                  </div>
                </div>

                {/* Priority + Link */}
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: priorityColor(topic.priority), background: `${priorityColor(topic.priority)}20`, padding: "3px 9px", borderRadius: 10 }}>
                    {topic.priority}
                  </span>
                  <a href={topic.url} target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 11, color: "#4f46e5", textDecoration: "none", fontWeight: 700, background: "#eff6ff", padding: "3px 10px", borderRadius: 8 }}>
                    Open →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setStep("assess"); setResult(null); setCompleted({}); }}
            style={{ width: "100%", padding: 14, background: "white", color: "#4f46e5", border: "2px solid #4f46e5", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer" }}
          >
            ← Re-assess My Skills
          </button>
        </div>
      </div>
    );
  }
}

// ── SHARED STYLES ─────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "system-ui, sans-serif",
    padding: 16,
  },
  card: {
    background: "white",
    borderRadius: 28,
    padding: "48px 40px",
    maxWidth: 500,
    width: "100%",
    textAlign: "center",
    marginTop: "10vh",
    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
  },
  heading: {
    fontSize: 28,
    fontWeight: 900,
    color: "#0f0c29",
    margin: "0 0 12px",
  },
  subtext: {
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: 28,
  },
  input: {
    width: "100%",
    padding: "15px 18px",
    borderRadius: 14,
    border: "2px solid #e5e7eb",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 14,
  },
  button: {
    padding: "15px 24px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
  },
  skillCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    padding: "18px 22px",
    marginBottom: 14,
  },
  scoreBadge: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    borderRadius: 12,
    padding: "6px 16px",
    fontWeight: 900,
    fontSize: 22,
    minWidth: 48,
    textAlign: "center",
  },
  statCard: {
    background: "white",
    borderRadius: 16,
    padding: "16px 10px",
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  section: {
    background: "white",
    borderRadius: 18,
    padding: "20px 22px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
    marginBottom: 18,
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontWeight: 800,
    color: "#1f2937",
    fontSize: 16,
  },
};