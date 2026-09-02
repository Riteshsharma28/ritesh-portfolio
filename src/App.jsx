// src/App.jsx
import { Float, OrbitControls, Environment, Text3D } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useInView } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Github, Linkedin, Mail, Phone, ExternalLink, Download, Trophy, Award,
  FileBadge, Briefcase, GraduationCap, Code2, Globe, Database, BarChart3,
  Cloud, Cpu, Circle,
} from "lucide-react";
import { Suspense, useRef, useEffect, useState } from "react";
import { Link } from "react-scroll";
import "./App.css";

/* =========================================================
   3D LOGO — bounded wobble instead of full autoRotate so the
   extruded "RS" mark never rotates far enough to show its
   (mirrored-looking) backside.
   ========================================================= */
function RotatingR({ size }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.45;
    }
  });

  return (
    <group ref={groupRef}>
      <Text3D
        font="fonts/helvetiker_regular.typeface.json"
        size={size}
        height={0.35}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.02}
        bevelSegments={5}
        onUpdate={(self) => self.geometry.center()}
      >
        RS
        <meshStandardMaterial
          color="#2DD4BF"
          metalness={0.75}
          roughness={0.15}
        />
      </Text3D>
    </group>
  );
}

/* =========================================================
   IMPACT CHART — signature element. A self-drawing line chart
   annotated with a real resume stat (−30% reporting effort at
   Honda). Grounds the "data analyst" identity in an actual
   number instead of decoration.
   ========================================================= */
function ImpactChart() {
  const points = "0,70 40,58 80,62 120,40 160,44 200,20 240,26 280,8";
  return (
    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
      <line x1="0" y1="90" x2="300" y2="90" stroke="#1E2633" strokeWidth="1" />
      <line x1="0" y1="60" x2="300" y2="60" stroke="#1E2633" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="0" y1="30" x2="300" y2="30" stroke="#1E2633" strokeWidth="1" strokeDasharray="2 4" />
      <motion.polyline
        points={points}
        fill="none"
        stroke="#2DD4BF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.circle
        cx="280" cy="8" r="4" fill="#F5A623"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      />
      <motion.text
        x="205" y="2" fill="#F5A623" fontSize="9" fontFamily="JetBrains Mono, monospace"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        −30% reporting time
      </motion.text>
    </svg>
  );
}

/* =========================================================
   KPI STRIP — count-up stats, dashboard-style
   ========================================================= */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return [value, ref];
}

function KPI({ target, decimals = 0, suffix = "", label }) {
  const [value, ref] = useCountUp(target);
  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="font-mono text-3xl md:text-4xl font-semibold text-paper tabular-nums">
        {value.toFixed(decimals)}{suffix}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-widest text-inkSoft">{label}</span>
    </div>
  );
}

function KPIStrip() {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-md mx-auto sm:mx-0">
      <KPI target={8.8} decimals={1} label="CGPA / 10" />
      <KPI target={2} label="Internships" />
      <KPI target={3} label="Projects Shipped" />
      <KPI target={3} label="Certifications" />
    </div>
  );
}

/* =========================================================
   HERO SECTION
   ========================================================= */
function Hero3D() {
  const roles = ["Data Analyst", "Data Scientist", "Python Developer"];
  const [current, setCurrent] = useState(0);
  const [logoSize, setLogoSize] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((p) => (p + 1) % roles.length), 2200);
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
        if (mobile) setLogoSize(5.2);
        else if (window.innerWidth < 768) setLogoSize(4);
        else setLogoSize(3.6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 md:px-16 pt-28 pb-16 sm:py-0 bg-ink overflow-hidden">
      {/* faint background grid, dashboard-esque */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#8D97AC 1px, transparent 1px), linear-gradient(90deg, #8D97AC 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-lg text-center sm:text-left"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 mb-6 font-mono text-[11px] tracking-widest uppercase text-inkSoft">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
          </span>
          Open to opportunities
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-paper tracking-tight">
          Ritesh Sharma
        </h1>
        <p className="mt-3 font-mono text-lg sm:text-xl text-signal h-7">
          {roles[current]}
        </p>
        <p className="mt-5 text-base sm:text-lg text-inkSoft leading-relaxed">
          B.Tech graduate in Electronics &amp; Computer Engineering, turning messy datasets
          into dashboards and decisions — Power BI, SQL, and Python end to end.
        </p>

        <div className="mt-7 flex gap-4 flex-wrap justify-center sm:justify-start">
          <a
            href={`${import.meta.env.BASE_URL}public/RiteshSharmaResume.pdf`}
            download
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-signal hover:bg-signal/90 text-ink font-semibold text-sm shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] transition"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
          <Link
            to="projects"
            smooth
            duration={500}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line hover:border-signal/60 text-paper font-medium text-sm cursor-pointer transition"
          >
            View Projects
          </Link>
        </div>

        <KPIStrip />
      </motion.div>

      {/* Right: 3D logo + signature impact chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className={`relative z-10 w-full sm:w-2/5 ${isMobile ? "h-[280px]" : "h-[420px]"} flex flex-col justify-center items-center mt-10 sm:mt-0`}
      >
        <div className="w-full h-3/5">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 3, 4]} intensity={1.1} />
            <pointLight position={[-3, 2, -3]} intensity={0.5} color="#2DD4BF" />
            <Suspense fallback={null}>
              <Float floatIntensity={0.4} rotationIntensity={0} speed={1.4}>
                <RotatingR size={logoSize} />
              </Float>
            </Suspense>
            <Environment preset="studio" background={false} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>
        <div className="w-full max-w-xs h-24 mt-2 rounded-xl border border-line bg-panel/40 px-4 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-inkSoft mb-1">
            Reporting Effort — Honda Cars India
          </p>
          <ImpactChart />
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
   ========================================================= */
function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mb-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-2">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-paper">{title}</h2>
    </div>
  );
}

/* =========================================================
   FADE ITEM
   ========================================================= */
function FadeItem({ children, duration = 0.6, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   EXPERIENCE — changelog / timeline style
   ========================================================= */
function ExperienceEntry({ index, role, company, period, points }) {
  return (
    <div className="relative pl-8 sm:pl-10 pb-10 border-l border-line last:border-transparent last:pb-0">
      <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-ink border-2 border-signal" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <span className="font-mono text-xs text-signal">EXP.0{index}</span>
        <h3 className="font-display text-xl font-semibold text-paper">{role}</h3>
      </div>
      <p className="font-mono text-xs text-inkSoft mb-3">{company} · {period}</p>
      <ul className="space-y-2">
        {points.map((pt, i) => (
          <li key={i} className="flex gap-2 text-sm text-inkSoft leading-relaxed">
            <span className="text-signal mt-1.5 text-[8px]">▸</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const EXPERIENCE = [
  {
    role: "Data Analyst Intern",
    company: "Honda Cars India Ltd, Tapukara, Rajasthan",
    period: "Oct 2025 – Jan 2026",
    points: [
      "Analysed training and assessment data for 100+ employees using Advanced Excel and Google Sheets, identifying performance trends and learning gaps.",
      "Performed data cleaning on monthly datasets — missing values, duplicates, inconsistencies — to prepare analysis-ready reports.",
      "Built Power BI dashboards and automated Excel reporting templates, cutting manual reporting effort by ~30%.",
      "Prepared PowerPoint presentations and Word reports summarising monthly training insights for HR and management review.",
    ],
  },
  {
    role: "Trainee Developer — Python Full Stack Industrial Training",
    company: "Kiran Academy, Pune, Maharashtra",
    period: "Jan 2026 – Jun 2026",
    points: [
      "Completed a 6-month industrial training internship building a full-stack Python project as a Trainee Developer.",
      "Applied Python, Flask, SQL, and front-end fundamentals (HTML, CSS, JavaScript, React.js) to build and iterate on the assigned project.",
      "Used NumPy, Pandas, Matplotlib, and scikit-learn for data manipulation, visualization, and predictive modeling.",
      "Integrated front-end interfaces with backend Flask APIs and SQL-based data storage.",
    ],
  },
];

/* =========================================================
   PROJECTS — interactive tilt cards
   ========================================================= */
function ProjectCard({ title, desc, href, stack }) {
  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      glareEnable={true}
      glareMaxOpacity={0.06}
      glareColor="#2DD4BF"
      glarePosition="all"
      scale={1.01}
      transitionSpeed={1200}
      className="h-full"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group h-full flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-signal/50"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-xl font-semibold text-paper leading-tight pr-3">{title}</h3>
            <span className="shrink-0 rounded-full bg-ink p-2 border border-line group-hover:border-signal/50 transition-colors">
              <Github className="h-4 w-4 text-inkSoft group-hover:text-signal transition-colors" />
            </span>
          </div>
          <p className="text-sm text-inkSoft leading-relaxed">{desc}</p>
        </div>
        <div>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span key={t} className="font-mono text-[11px] px-2 py-1 rounded-md bg-ink text-signal border border-line">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-inkSoft opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View repository</span>
          </div>
        </div>
      </a>
    </Tilt>
  );
}

const PROJECTS = [
  {
    title: "IPL Data Analysis Web App",
    desc: "Flask web app performing ETL on 10+ seasons of IPL match data, delivering player stats, season trends, and match outcome predictions via interactive dashboards.",
    href: "https://github.com/Riteshsharma28/ipl-data-analysis",
    stack: ["Python", "Flask", "Pandas", "scikit-learn"],
  },
  {
    title: "JourneyGram",
    desc: "Tourism-focused web platform selected for the Regional Round of DIPEX 2025, presented over a 3-day exhibition in Pune to an industry jury.",
    href: "https://github.com/Riteshsharma28/journeygram",
    stack: ["React Native", "Firebase"],
  },
  {
    title: "Smart City Data Analytics",
    desc: "Flask-based web application to analyse and visualize smart city data — traffic, utilities, civic infrastructure — through interactive charts and dashboards.",
    href: "https://github.com/Riteshsharma28/smart-city",
    stack: ["Python", "Flask", "Pandas", "Matplotlib"],
  },
];

/* =========================================================
   SKILLS — grouped panels with icons
   ========================================================= */
const SKILLS = [
  { title: "Programming", icon: Code2, items: ["Python", "Java", "JavaScript", "C", "C++"] },
  { title: "Web Development", icon: Globe, items: ["HTML", "CSS", "Flask", "Django", "REST APIs"] },
  { title: "Databases", icon: Database, items: ["MySQL", "PostgreSQL"] },
  { title: "BI & Reporting", icon: BarChart3, items: ["Power BI", "Excel (Advanced)", "Dashboards"] },
  { title: "Data & ML", icon: Cpu, items: ["Pandas", "NumPy", "scikit-learn", "ETL", "ML"] },
  { title: "Cloud & Tools", icon: Cloud, items: ["Git", "GitHub", "AWS (Basics)", "VS Code"] },
];

function SkillPanel({ title, icon: Icon, items }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5 hover:border-signal/40 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-signal" />
        <h3 className="font-mono text-xs uppercase tracking-widest text-paper">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it} className="text-xs px-2.5 py-1 rounded-md bg-ink text-inkSoft border border-line">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY LOG — achievements + certifications, log style
   ========================================================= */
function LogEntry({ tag, tagColor, title, subtitle, icon: Icon }) {
  return (
    <div className="flex gap-3 items-start py-3 border-b border-line last:border-none">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${tagColor}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${tagColor}`}>{tag}</span>
        </div>
        <p className="text-sm text-paper font-medium leading-snug">{title}</p>
        <p className="text-xs text-inkSoft mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

const ACHIEVEMENTS = [
  { tag: "DIPEX 2025", title: "Selected for Regional Round at DIPEX 2025", subtitle: "Presented \u201cJourneyGram\u201d over a 3-day exhibition in Pune", icon: Trophy },
  { tag: "Academics", title: "2× Class Topper", subtitle: "Academic excellence medals", icon: Award },
];

const CERTIFICATIONS = [
  { tag: "NPTEL 2023", title: "Problem Solving through C", subtitle: "NPTEL Certification", icon: FileBadge },
  { tag: "NPTEL 2024", title: "Programming in Java", subtitle: "NPTEL Certification", icon: FileBadge },
  { tag: "NPTEL 2024", title: "The Joy of Computing using Python", subtitle: "NPTEL Certification", icon: FileBadge },
];

/* =========================================================
   MAIN APP
   ========================================================= */
export default function App() {
  const navItems = ["experience", "projects", "skills-details", "education", "contact"];

  return (
    <div className="min-h-screen w-full bg-ink text-paper font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-ink/80 backdrop-blur-md border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-display text-lg font-bold text-paper flex items-center gap-2">
            <Circle className="h-2 w-2 fill-signal text-signal" />
            Ritesh Sharma
          </div>
          <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest text-inkSoft">
            {navItems.map((id) => (
              <Link
                key={id}
                to={id}
                smooth
                duration={500}
                offset={-70}
                className="cursor-pointer hover:text-signal transition-colors"
              >
                {id.replace("-", " ")}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <Hero3D />

      {/* Experience */}
      <section id="experience" className="w-full py-20 md:py-28 px-6 bg-ink">
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow="Career log" title="Work Experience" />
          {EXPERIENCE.map((exp, i) => (
            <FadeItem key={exp.role} delay={i * 0.1}>
              <ExperienceEntry index={i + 1} {...exp} />
            </FadeItem>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="w-full py-20 md:py-28 px-6 bg-panel/30">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Selected work" title="Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p, i) => (
              <FadeItem key={p.title} delay={i * 0.08}>
                <ProjectCard {...p} />
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Achievements */}
      <section id="skills-details" className="w-full py-20 md:py-28 px-6 bg-ink">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Toolkit" title="Skills & Recognition" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Skills */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SKILLS.map((sec, i) => (
                  <FadeItem key={sec.title} delay={i * 0.06}>
                    <SkillPanel {...sec} />
                  </FadeItem>
                ))}
              </div>
            </div>

            {/* Achievements + Certifications as activity log */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-inkSoft mb-3">Achievements</h3>
                <div className="rounded-xl border border-line bg-panel px-5">
                  {ACHIEVEMENTS.map((a) => (
                    <LogEntry key={a.title} tagColor="text-flag" {...a} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-inkSoft mb-3">Certifications</h3>
                <div className="rounded-xl border border-line bg-panel px-5">
                  {CERTIFICATIONS.map((c) => (
                    <LogEntry key={c.title} tagColor="text-signal" {...c} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="w-full py-20 md:py-28 px-6 bg-panel/30">
        <div className="mx-auto max-w-4xl">
          <SectionHeader eyebrow="Foundation" title="Education" />
          <FadeItem>
            <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl border border-line bg-panel px-8 py-8">
              <div className="shrink-0 flex flex-col items-center">
                <span className="font-mono text-5xl font-bold text-signal tabular-nums">8.8</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-inkSoft mt-1">CGPA / 10</span>
              </div>
              <div className="hidden sm:block w-px self-stretch bg-line" />
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <GraduationCap className="h-5 w-5 text-signal" />
                  <p className="font-display text-lg font-semibold text-paper">
                    B.Tech in Electronics &amp; Computer Engineering
                  </p>
                </div>
                <p className="text-sm text-inkSoft">CSMSS Chh. Shahu College of Engineering, Chhatrapati Sambhaji Nagar</p>
                <p className="font-mono text-xs text-inkSoft mt-1">2022 – 2026</p>
              </div>
            </div>
          </FadeItem>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full py-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 gap-4 border-t border-line bg-ink">
        <p className="font-mono text-xs text-inkSoft">© {new Date().getFullYear()} Ritesh Sharma. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://github.com/Riteshsharma28" target="_blank" rel="noopener noreferrer" className="text-inkSoft hover:text-signal transition-colors"><Github className="h-5 w-5" /></a>
          <a href="https://linkedin.com/in/riteshsharma28" target="_blank" rel="noopener noreferrer" className="text-inkSoft hover:text-signal transition-colors"><Linkedin className="h-5 w-5" /></a>
          <a href="mailto:ritesh.sharma2806@gmail.com" className="text-inkSoft hover:text-signal transition-colors"><Mail className="h-5 w-5" /></a>
          <a href="tel:+918446719943" className="text-inkSoft hover:text-signal transition-colors"><Phone className="h-5 w-5" /></a>
        </div>
      </footer>
    </div>
  );
}
