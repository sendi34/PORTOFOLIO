import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { SmoothCursor } from "./ui/SmoothCursor";
import { Carousel } from "./ui/Carousel";
import { ProjectsGrid } from "./ui/ProjectsGrid";
import { Download, MapPin, Mail } from "lucide-react";

function BrandIcon({ path, size = 17, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

const BRAND_PATHS = {
  gmail:
    "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
};

const PROFILE = {
  name: "Sendi Pratama",
  role: "IT Support & Web Developer",
  location: "Banjarbaru, Indonesia",
  photo: "/hero-photo.jpg",
  tagline:
    "Lulusan Teknik Informatika dengan pengalaman membangun aplikasi web dan dukungan teknis IT secara terstruktur.",
  bio:
    "Lulusan Teknik Informatika yang telah menyelesaikan sidang skripsi dan saat ini menunggu proses yudisium/wisuda. Memiliki pengetahuan dasar IT Support, IT Helpdesk, pengembangan aplikasi web, pengelolaan data, dan administrasi. Memahami troubleshooting hardware/software, instalasi sistem, jaringan dasar, serta pengembangan website menggunakan Laravel, PHP, MySQL, dan React.",
  email: "sendipratama302@gmail.com",
  cvUrl: "/cv-sendi-pratama.pdf",
};

const PROJECTS = [
  {
    title:
      "ALFO RIVER - Akses Layanan Informasi Air Sungai Reliable, Informative, Valid, Easy, Responsible",
    category: "Web Development",
    tech: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    description:
      "Website layanan publik untuk pemantauan kualitas air sungai dengan data manual/otomatis, grafik tren IKA, dan konten edukasi untuk masyarakat.",
    image: "/projects/alforiver.jpg",
    href: "https://alforiver.kalselprov.go.id/",
    cta: "Lihat project",
  },
  {
    title: "One Stop · Website Toko Sepeda",
    category: "UI/UX Design",
    tech: ["Figma", "Prototyping", "UI Design", "Design System"],
    description:
      "Desain prototype website e-commerce sepeda dengan alur Home, Bikes, Parts, Equipment, About, dan Contact untuk persiapan implementasi front-end.",
    image: "/projects/onestop.jpg",
    href: "https://www.figma.com/proto/Inllw47xGLXlhjLDxrWTkY/One-Stop?node-id=0-1",
    cta: "Buka prototype",
  },
];

const DESIGN_SHOWCASE = [
  { src: "/designs/RWB.jpg", title: "Poster Porsche Rwb", tag: "Poster / Graphic Design" },
  { src: "/designs/NISSAN-FAIRLADY.jpg", title: "Poster NISSAN FAIRLADY", tag: "Poster / Graphic Design" },
  { src: "/designs/FERRARI.jpg", title: "Poster Ferrari", tag: "Poster / Graphic Design" },
  { src: "/designs/PORSCHE.jpg", title: "Poster PORSCHE", tag: "Poster / Graphic Design" },
  { src: "/designs/LEXUS.jpg", title: "Poster Lexus", tag: "Poster / Graphic Design" },
];

const SOCIALS = [
  { icon: "gmail", href: "mailto:sendipratama302@gmail.com", label: "Gmail" },
  { icon: "github", href: "https://github.com/sendi34", label: "GitHub" },
  { icon: "linkedin", href: "https://www.linkedin.com/in/sendi-pratama-285959422/", label: "LinkedIn" },
  { icon: "whatsapp", href: "https://wa.me/6287817640992", label: "WhatsApp" },
  { icon: "instagram", href: "https://www.instagram.com/sendi_pratama00/", label: "Instagram" },
];

const SKILL_GROUPS = [
  {
    num: "01",
    title: "Web Development",
    skills: ["Laravel", "PHP", "React", "MySQL"],
  },
  {
    num: "02",
    title: "IT Support & Helpdesk",
    skills: ["Troubleshooting Hardware", "Troubleshooting Software", "Dukungan Pengguna Akhir"],
  },
  {
    num: "03",
    title: "System & Network Basics",
    skills: ["Instalasi Sistem Operasi", "Konfigurasi Dasar", "Jaringan Komputer Dasar"],
  },
  {
    num: "04",
    title: "Data & Dokumentasi",
    skills: ["Input Data", "Dokumentasi Teknis", "Microsoft Office"],
  },
  {
    num: "05",
    title: "Tools",
    skills: ["Git", "GitHub", "Figma"],
  },
];

const EXPERIENCES = [
  {
    num: "01",
    company: "Dinas Lingkungan Hidup Provinsi Kalimantan Selatan",
    role: "Fullstack Developer",
    period: "Sep 2025 - Nov 2025",
    points: [
      "Mengembangkan dan memelihara ALFO RIVER (alforiver.kalselprov.go.id), website layanan publik untuk pemantauan kualitas air sungai.",
      "Membangun tampilan data pemantauan manual dan otomatis, grafik tren Indeks Kualitas Air (IKA), modul edukasi, serta fitur kuis interaktif.",
      "Menyusun dokumentasi teknis dan laporan terstruktur untuk mendukung serah terima proyek kepada instansi terkait.",
      "Berkoordinasi dengan tim instansi untuk memastikan website memenuhi standar aksesibilitas dan kegunaan publik.",
    ],
  },
  {
    num: "02",
    company: "Service Shop Welcomp Techno Computer",
    role: "IT Hardware & Software Support",
    period: "Apr 2021 - Mei 2021",
    points: [
      "Melakukan perakitan, instalasi, dan troubleshooting hardware untuk komputer dan laptop pelanggan.",
      "Menginstal dan mengonfigurasi sistem operasi serta software standar untuk pelanggan walk-in.",
      "Mendiagnosis dan menyelesaikan permasalahan hardware/software umum, termasuk setup printer dan perangkat pendukung.",
      "Melayani pelanggan secara langsung dan menjelaskan permasalahan teknis dengan bahasa yang mudah dipahami.",
    ],
  },
];

const EDUCATION = [
  {
    institution: "Universitas Islam Kalimantan (UNISKA) Muhammad Arsyad Al Banjari",
    major: "S1 Teknik Informatika",
    period: "Sep 2023 - Agu 2026",
  },
  {
    institution: "SMKN 2 Banjarbaru",
    major: "Teknik Komputer dan Jaringan",
    period: "Jul 2019 - Mei 2022",
  },
];

const CERTIFICATIONS = [
  "Sertifikat LSP (Lembaga Sertifikasi Profesi) – Skema Analisis Program (PHP/SQL/PHPUnit), UNISKA (2026)",
  "MTCNA (MikroTik Certified Network Associate) – MikroTik (2022)",
  "Sertifikat Kompetensi – Routing dalam Autonomous System (AS) pada Perangkat Cisco, ITSME Indonesia (2022)",
  "Sertifikat Kompetensi BNSP – Jaringan Komputer: Konfigurasi Routing pada Perangkat Jaringan Komputer, LSP SMKN 2 Banjarbaru (2021)",
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SkillsList({ groups }) {
  return (
    <div>
      <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-black/40 mb-8">
        Kompetensi Utama
      </span>
      <div className="divide-y divide-black/6">
        {groups.map((g, i) => (
          <Reveal key={g.num} delay={i * 60}>
            <div className="flex items-start gap-5 py-5">
              <span className="font-display text-2xl font-bold text-lime-400 shrink-0 tabular-nums leading-none w-8 mt-0.5">
                {g.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold tracking-wide text-[#141414]">{g.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {g.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold px-2.5 py-1 bg-black/5 text-black/55 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function PinnedSkillsStack({ groups }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groups.length]);

  const active = groups[activeIndex];

  return (
    <div className="relative">
      <div className="sticky top-24">
        <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-black/40 mb-6">
          Kompetensi Utama
        </span>
        <div className="flex items-start gap-4 sm:gap-8">
          <div
            className="relative shrink-0 overflow-hidden font-display text-5xl sm:text-8xl font-semibold text-lime-300 tabular-nums"
            style={{ height: "1em", lineHeight: 1 }}
            aria-hidden="true"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={active.num}
                className="block"
                style={{ height: "1em", lineHeight: 1 }}
                initial={{ y: "0.6em", opacity: 0 }}
                animate={{ y: "0em", opacity: 1 }}
                exit={{ y: "-0.6em", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {active.num}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.num}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-xl sm:text-3xl md:text-4xl font-semibold">
                  {active.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {active.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs sm:text-sm font-semibold px-3 py-1.5 bg-black/5 text-black/55 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-2 mt-10 sm:mt-14">
          {groups.map((g, i) => (
            <span
              key={g.num}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-black" : "w-1.5 bg-black/15"
              }`}
            />
          ))}
        </div>
      </div>

      <div aria-hidden="true">
        {groups.map((g, i) => (
          <div
            key={g.num}
            data-index={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="h-[55vh]"
          />
        ))}
      </div>
    </div>
  );
}

const dockGlowVariants = {
  hidden: { opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};
const dockRingVariants = {
  hidden: { opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

function SocialDock() {
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const leaveTimer = useRef(null);
  const active = hovered || isTouch;

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () =>
      setIsTouch(mq.matches || navigator.maxTouchPoints > 0);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("touchstart", update, { once: true });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("touchstart", update);
    };
  }, []);

  const handleEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(true);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  return (
    <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
      <style>{`
        @property --dock-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes dock-chase {
          to { --dock-angle: 360deg; }
        }
        .dock-chasing-bg {
          --dock-angle: 0deg;
          background: conic-gradient(
            from var(--dock-angle),
            rgba(255,70,130,1),
            rgba(255,150,70,1),
            rgba(130,70,210,1),
            rgba(90,90,220,1),
            rgba(255,70,130,1)
          );
          animation: dock-chase 2.6s linear infinite;
        }
        .dock-chasing-ring {
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

      <div
        className="relative rounded-full"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <AnimatePresence>
          {active && (
            <motion.div
              key="chasing-glow"
              variants={dockGlowVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="dock-chasing-bg absolute -inset-1.5 rounded-full blur-[20px] pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && (
            <motion.div
              key="chasing-ring"
              variants={dockRingVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="dock-chasing-bg dock-chasing-ring absolute -inset-[0px] rounded-full pointer-events-none"
              style={{ padding: "2px" }}
            />
          )}
        </AnimatePresence>

        <div className="relative flex items-center gap-0.5 sm:gap-1 bg-black/85 backdrop-blur-md rounded-full px-1.5 sm:px-2.5 py-1.5 sm:py-2 shadow-xl">
          {SOCIALS.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <BrandIcon path={BRAND_PATHS[icon]} size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  // tetap terlihat sampai hampir di dasar halaman, lalu menghilang
  const opacity = useTransform(scrollYProgress, [0, 0.92, 1], [1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-6 sm:bottom-10 left-5 sm:left-10 z-30 flex items-center gap-3 pointer-events-none text-white mix-blend-difference"
    >
      <div className="h-8 w-px bg-white/30 relative overflow-hidden rounded-full">
        <motion.div
          className="absolute top-0 left-0 right-0 h-full bg-white rounded-full origin-top"
          animate={{ scaleY: [0, 1, 0], y: ["0%", "0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
        Scroll
      </span>
    </motion.div>
  );
}

export default function PortfolioMinimal() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "8%"]);

  return (
    <div
      className="min-h-screen w-full overflow-x-clip bg-[#F5F3EF] text-[#141414] font-sans"
      style={{ overflowX: "clip" }}
    >
      <SmoothCursor />
      <ScrollIndicator />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @font-face {
          font-family: 'Cantry';
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url('/fonts/Cantry.otf') format('opentype'),
               url('/fonts/Cantry.ttf') format('truetype');
        }

        .font-sans { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.01em; }
        .font-cantry { font-family: 'Cantry', 'DM Sans', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.015em; }
        html { scroll-behavior: smooth; }
        @media (min-width: 768px) {
          * { cursor: none !important; }
          input, textarea, select { cursor: text !important; }
        }
      `}</style>

      <section
        id="top"
        className="relative w-full overflow-hidden bg-[#8B8B87]"
        style={{ height: "100svh", minHeight: "560px", maxHeight: "960px" }}
      >
        <SocialDock />

        {/* Foto dengan parallax */}
        <motion.img
          src={PROFILE.photo}
          alt={PROFILE.name}
          style={{ y }}
          className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-90"
        />

        {/* Layer gelap bertingkat */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Pojok kanan atas — label */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 text-right">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-white/60">
            Portfolio
          </p>
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.14em] text-white/35 mt-0.5">
            {new Date().getFullYear()}
          </p>
        </div>

        {/* Konten utama — posisi di bawah kiri (ubah pb untuk naik/turun) */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 pb-24 sm:pb-45">

          {/* Label role — kecil di atas nama */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex items-center gap-2.5 mb-3 sm:mb-4"
          >
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-lime-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {PROFILE.role}
            </span>
          </motion.div>

          {/* Nama — sangat besar */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="font-cantry text-white font-bold "
              style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)", lineHeight: 1.15, letterSpacing: "-0.01em" }}
            >
              Sendi Pratama
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── RINGKASAN ─────────────────────────────────────────── */}
      <section id="ringkasan" className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-28 pb-20">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            {/* Label */}
            <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-5">
              Tentang Saya
            </span>

            {/* Nama besar */}
            <h2 className="font-display text-5xl sm:text-6xl font-bold leading-[1.02] tracking-tight text-[#141414]">
              {PROFILE.name}
            </h2>

            {/* Role dengan garis kiri */}
            <div className="flex items-center gap-3 mt-5">
              <span className="h-5 w-[3px] bg-lime-400 rounded-full shrink-0" />
              <p className="text-sm sm:text-base font-semibold text-black/70">{PROFILE.role}</p>
            </div>

            {/* Divider */}
            <div className="mt-6 h-px w-full bg-black/8" />

            {/* Bio */}
            <p className="text-black/55 text-sm sm:text-base leading-[1.8] mt-6">
              {PROFILE.bio}
            </p>

            {/* Lokasi */}
            <div className="flex items-center gap-2 text-sm font-medium text-black/45 mt-5">
              <MapPin size={14} className="shrink-0 text-lime-500" />
              {PROFILE.location}
            </div>

            {/* Download CV */}
            <a
              href={PROFILE.cvUrl}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 bg-[#141414] text-white rounded-full hover:bg-black transition-colors"
            >
              <Download size={14} />
              Download CV
            </a>
          </Reveal>

          {/* Skills — mobile: list, desktop: pinned stack */}
          <div className="lg:hidden">
            <SkillsList groups={SKILL_GROUPS} />
          </div>
          <div className="hidden lg:block">
            <PinnedSkillsStack groups={SKILL_GROUPS} />
          </div>
        </div>
      </section>

      {/* ── PENGALAMAN KERJA ──────────────────────────────────── */}
      <section id="pengalaman" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-black/6">

        {/* Section heading */}
        <Reveal className="mb-12 sm:mb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35">Riwayat</span>
              <h2 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-[#141414] mt-1">
                Pengalaman<br className="hidden sm:block" /> Kerja
              </h2>
            </div>
            <span className="hidden sm:block h-px flex-1 bg-black/8 mb-4" />
          </div>
        </Reveal>

        {/* Timeline vertikal */}
        <div className="relative">
          {/* Garis timeline */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-black/8" aria-hidden="true" />

          <div className="space-y-10 sm:space-y-14">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 100}>
                <div className="flex gap-6 sm:gap-10 relative">
                  {/* Dot */}
                  <div className="shrink-0 relative z-10 mt-1.5">
                    <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-lime-300 flex items-center justify-center shadow-sm">
                      <span className="font-display text-sm font-bold text-black">{exp.num}</span>
                    </div>
                  </div>

                  {/* Konten */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3">
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-tight text-[#141414]">
                        {exp.company}
                      </h3>
                      <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-black/5 text-black/50 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-lime-600 mb-3">{exp.role}</p>
                    <ul className="space-y-2">
                      {exp.points.map((point) => (
                        <li key={point} className="flex gap-2.5 text-sm sm:text-base text-black/55 leading-relaxed">
                          <span className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full bg-lime-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROYEK ─────────────────────────────────────────────── */}
      <section id="portofolio" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-black/6">

        {/* Heading proyek */}
        <Reveal className="mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35">Karya</span>
              <h2 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-[#141414] mt-1">
                Proyek Pilihan
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <ProjectsGrid items={PROJECTS} />
        </Reveal>

        {/* Design Showcase */}
        <Reveal className="mt-20 sm:mt-28">
          <div className="mb-10 sm:mb-14">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35">Visual</span>
            <h3 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-[#141414] mt-1">
              Design Showcase
            </h3>
          </div>
          <Carousel items={DESIGN_SHOWCASE} />
        </Reveal>
      </section>

      {/* ── PENDIDIKAN & SERTIFIKASI ──────────────────────────── */}
      <section id="education" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-t border-black/6">

        {/* Heading */}
        <Reveal className="mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35">Latar Belakang</span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-[#141414] mt-1">
            Pendidikan &amp; Sertifikasi
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16">

          {/* Pendidikan — timeline kecil */}
          <Reveal>
            <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-6">
              Pendidikan
            </span>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-black/8" aria-hidden="true" />
              <div className="space-y-8">
                {EDUCATION.map((item) => (
                  <div key={item.institution} className="flex gap-5 relative">
                    <div className="shrink-0 relative z-10 mt-1">
                      <div className="w-6 h-6 rounded-full border-2 border-lime-400 bg-[#F5F3EF] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-lime-400 block" />
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-[11px] font-semibold text-black/40 mb-1">{item.period}</p>
                      <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-[#141414]">
                        {item.institution}
                      </h3>
                      <p className="text-sm text-black/55 mt-0.5 font-medium">{item.major}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Sertifikasi — numbered list */}
          <Reveal delay={100}>
            <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-6">
              Sertifikasi
            </span>
            <div className="space-y-0 divide-y divide-black/6">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={cert} className="flex gap-4 py-4">
                  <span className="shrink-0 font-display text-base font-bold text-lime-400 tabular-nums w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm sm:text-base text-black/60 leading-relaxed">{cert}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── KONTAK / FOOTER ──────────────────────────────────── */}
      <section
        id="contact"
        className="relative w-full overflow-hidden bg-[#141414] mt-4"
      >
        {/* Aksen lingkaran dekoratif */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-10 sm:pb-14 flex flex-col min-h-[420px] sm:min-h-[480px]">

          {/* Tagline atas */}
          <Reveal>
            <p className="text-sm sm:text-base font-medium text-white/40 max-w-xs sm:max-w-sm leading-relaxed">
              Terima kasih sudah melihat portofolio saya.{" "}
              <span className="text-white/70">Saya terbuka untuk peluang kerja atau kolaborasi.</span>
            </p>
          </Reveal>

          <div className="flex-1" />

          {/* Heading besar */}
          <Reveal delay={80} className="mb-8 sm:mb-12">
            <h2
              className="font-display font-bold text-white leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 10vw, 6.5rem)" }}
            >
              Hubungi<br />
              <span className="text-lime-400">Saya.</span>
            </h2>
          </Reveal>

          {/* Email CTA + Social + Copyright */}
          <Reveal delay={140}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/10">
              {/* Email button */}
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 bg-lime-300 text-black text-sm font-bold px-5 py-3 rounded-full hover:bg-lime-200 transition-colors self-start"
              >
                <Mail size={14} className="shrink-0" />
                <span className="truncate max-w-[220px] sm:max-w-none">{PROFILE.email}</span>
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-1">
                {SOCIALS.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={label}
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <BrandIcon path={BRAND_PATHS[icon]} size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-white/25 mt-5">
              © {new Date().getFullYear()} — {PROFILE.name.toUpperCase()}. All rights reserved.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}