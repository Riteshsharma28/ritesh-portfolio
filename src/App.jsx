// src/App.jsx
import { Float, OrbitControls, Environment, Text3D } from "@react-three/drei";
import { motion } from "framer-motion";
import { 
  Github, Linkedin, Mail, Phone, ExternalLink, Download, Trophy, Award, FileBadge, ArrowUp 
} from "lucide-react";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, animateScroll as scroll } from "react-scroll";
import "./App.css";

// ------------------- Rotating 3D Logo -------------------
function RotatingR({ size }) {
  const ref = useRef();

  // Use fixed rotation speed
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01; // original speed
  });

  return (
    <Text3D
      ref={ref}
      font="fonts/helvetiker_regular.typeface.json"
      size={size}       // dynamic size for mobile/desktop
      height={0.35}
      bevelEnabled
      bevelThickness={0.05}
      bevelSize={0.02}
      bevelSegments={5}
      onUpdate={(self) => self.geometry.center()}
    >
      RS
      <meshStandardMaterial
        color="#b18cff"
        metalness={0.8}
        roughness={0.1}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
      />
    </Text3D>
  );
}



// ------------------- Particles Background -------------------
function ParticlesBackground() {
  const init = async (engine) => await loadFull(engine);
  return (
    <Particles
      id="tsparticles"
      init={init}
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          color: { value: "#b18cff" },
          links: { enable: true, color: "#b18cff", distance: 150, opacity: 0.4, width: 1 },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
}

// ------------------- Hero Section -------------------
function Hero3D() {
  const roles = ["ECE Student", "Software Engineer", "Data Analyst", "Tech Enthusiast"];
  const [current, setCurrent] = useState(0);
  const [logoSize, setLogoSize] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => (prev + 1) % roles.length), 2000);

    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      if (mobile) setLogoSize(5);           // bigger logo for mobile
      else if (window.innerWidth < 768) setLogoSize(3.5);
      else setLogoSize(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
   <div className={`relative w-full h-screen flex flex-col sm:flex-row items-center justify-between px-8 md:px-10 bg-gradient-to-b from-night/90 to-night overflow-hidden`}>

      
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.6 }}
        className="max-w-lg z-10 text-center sm:text-left"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">Ritesh</h1>
        <p className="mt-4 text-xl font-semibold text-purple-400 h-8">{roles[current]}</p>
        <p className="mt-4 text-lg text-white/70">
          Final-year B.Tech ECE student passionate about building impactful projects using real-world data and modern technologies.
        </p>

        <div className="mt-6 flex gap-4 flex-wrap justify-center sm:justify-start">
          {/* Resume & GitHub buttons */}
       a
    href="public/RiteshSharmaResume.pdf"
    download
    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg transition"
  >
    <Download className="h-5 w-5" />
    Resume
  </a>

      {/* 3D Logo */}
      <div className={`w-full sm:w-2/5 ${isMobile ? "h-[350px]" : "h-full"} z-10 flex justify-center items-center mb-6 sm:mb-0`}>
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[2, 3, 4]} intensity={1.1} />
          <pointLight position={[-3, 2, -3]} intensity={0.6} color="#b18cff" />
          <Suspense fallback={null}>
            <Float floatIntensity={0.5} rotationIntensity={0.08} speed={1.5}>
  <RotatingR size={logoSize} />
</Float>

          </Suspense>
          <Environment preset="studio" background={false} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.35} />
        </Canvas>
      </div>
    </div>
  );
}


// ------------------- Project Card -------------------
function ProjectCard({ title, desc, href, stack = [], img }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -6, scale: 1.02 }}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-transform duration-300 hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      {img && <img src={img} alt={title} className="rounded-lg mb-4" />}
      <div className="flex items-start justify-between">
        <div className="pr-4">
          <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
          <p className="mt-2 text-white/70">{desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-300 border border-purple-500/20">{t}</span>
            ))}
          </div>
        </div>
        <span className="rounded-full bg-white/10 p-2 ring-1 ring-white/15 group-hover:bg-white/15">
          <Github className="h-5 w-5 group-hover:text-indigo-400" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="h-4 w-4" />
        <span>Open project</span>
      </div>
    </motion.a>
  );
}

// ------------------- Timeline Item -------------------
function TimelineItem({ title, subtitle, icon: Icon }) {
  return (
    <div className="relative pl-10 mb-6">
      <div className="absolute left-0 top-1 w-6 h-6 flex items-center justify-center bg-purple-600 rounded-full border border-white/20">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="text-white font-semibold">{title}</p>
      <p className="text-white/70 text-sm">{subtitle}</p>
    </div>
  );
}

// ------------------- FadeItem -------------------
function FadeItem({ children, duration = 0.6 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

// ------------------- Back To Top -------------------
// function BackToTop() {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 400);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return show ? (
//     <button
//       onClick={() => scroll.scrollToTop({ duration: 600 })}
//       className="fixed bottom-6 right-6 p-3 rounded-full bg-purple-600 hover:bg-purple-500 shadow-lg"
//     >
//       <ArrowUp className="h-5 w-5 text-white" />
//     </button>
//   ) : null;
// }

// ------------------- Main App -------------------
export default function App() {
  return (
    <div className="min-h-screen w-full bg-night text-white">
      {/* Navbar */}
     <header className="fixed top-0 left-0 w-full z-50 bg-night/70 backdrop-blur-md shadow-md">
  <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
    <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
      Ritesh Sharma
    </div>
    <nav className="flex gap-6 mt-3 sm:mt-0 text-white/80 font-medium">
      {["projects", "skills-details", "contact"].map((id) => (
        <Link
          key={id}
          to={id}
          smooth
          duration={500}
          className="cursor-pointer hover:text-purple-400"
        >
          {id.replace("-", " ")}
        </Link>
      ))}
    </nav>
  </div>
</header>


      {/* Hero */}
      <Hero3D />

      {/* Projects */}
      <section id="projects" className="w-full py-16 md:py-20 px-6 bg-night">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
  {[
    {
      title: "IPL Data Analysis App",
      desc: "Analyzes IPL stats, player performances, and match predictions using Python & Flask.",
      href: "https://github.com/Riteshsharma28/ipl-data-analysis",
      stack: ["Python", "Flask", "Pandas"],
    },
    {
      title: "Weather Forecast App",
      desc: "Real-time weather data app with search, API integration, and modern UI.",
      href: "https://github.com/Riteshsharma28/weather-app-flutter",
      stack: ["Flutter", "Dart", "API"],
    },
    {
      title: "JourneyGram",
      desc: "Travel diary app to log experiences, photos and share insights.",
      href: "https://github.com/Riteshsharma28/journeygram-prototype",
      stack: ["React Native", "Firebase"],
    },
  ].map((p) => (
    <FadeItem key={p.title}>
      <div className="h-full flex">
        <ProjectCard {...p} className="flex flex-col justify-between h-full" />
      </div>
    </FadeItem>
  ))}
</div>

      </section>

      {/* Skills & Achievements */}
      <section id="skills-details" className="w-full py-16 px-6 bg-night/90">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Skills */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold">Technical Skills</h2>
            {[
              { title: "Programming Languages", items: ["C", "C++", "Java", "Python"] },
              { title: "Web Technologies", items: ["HTML", "CSS", "JavaScript"] },
              { title: "Database & Tools", items: ["MySQL", "Power BI", "ETL", "GitHub", "VS Code"] },
              { title: "Development Platforms", items: ["Android Studio", "Firebase", "Flutter (Basic)", "API Integration"] },
              { title: "Core Concepts", items: ["DSA", "OOPS", "API Integration"] },
            ].map((sec) => (
              <div key={sec.title}>
                <h3 className="text-xl font-semibold mb-2">{sec.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {sec.items.map((it) => <span key={it} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">{it}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements & Certifications */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Achievements</h2>
              {[
                { title: "Selected for Regional Round at DIPEX 2025", subtitle: "Presented project for 3 days in Pune", icon: Trophy },
                { title: "Selected for Placement & Internship Program", subtitle: "Kiran Academy, Pune", icon: Award },
                { title: "2× Class Topper", subtitle: "Medals", icon: Trophy },
                { title: "2× Cricket Runner-up", subtitle: "Trophies & Medals", icon: Trophy },
                { title: "Group Dance Runner-up", subtitle: "Trophy", icon: Trophy },
              ].map((it) => <FadeItem key={it.title}><TimelineItem {...it} /></FadeItem>)}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Certifications</h2>
              {[
                { title: "Problem Solving through C", subtitle: "NPTEL" },
                { title: "Programming in Java", subtitle: "NPTEL" },
                { title: "The Joy of Computing using Python", subtitle: "NPTEL" },
                { title: "Full Stack Web Development", subtitle: "MGM" },
                { title: "BYST Volunteer", subtitle: "National Level" },
              ].map((it) => <FadeItem key={it.title}><TimelineItem {...it} icon={FileBadge} /></FadeItem>)}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full py-8 flex flex-col md:flex-row items-center justify-between px-16 text-white/60 gap-4 bg-night/95">
        <p>© {new Date().getFullYear()} Ritesh. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a href="https://github.com/Riteshsharma28" target="_blank" rel="noopener noreferrer"><Github /></a>
          <a href="https://www.linkedin.com/in/ritesh-sharma-207415263" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
          <a href="mailto:ritesh.sharma2806@gmail.com"><Mail /></a>
          <a href="tel:+918446719943"><Phone /></a>
        </div>
      </footer>

      {/* <BackToTop /> */}
    </div>
  );
}
