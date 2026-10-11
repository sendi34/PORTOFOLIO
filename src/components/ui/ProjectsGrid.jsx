import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function ProjectsGrid({ items }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.category)))],
    [items],
  );
  const [filter, setFilter] = useState("All");
  const shown =
    filter === "All" ? items : items.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 mb-10 sm:mb-14">
        {categories.map((cat) => {
          const active = cat === filter;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`relative text-sm sm:text-base font-semibold pb-2 transition-colors ${
                active ? "text-black" : "text-black/40 hover:text-black/70"
              }`}
            >
              {cat}
              {active && (
                <motion.span
                  layoutId="project-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-lime-400"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.a
              key={p.title}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group relative block rounded-3xl overflow-hidden aspect-[3/4] ring-1 ring-black/5 shadow-sm"
            >
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 sm:px-6 text-white sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-400">
                <h3 className="font-display text-sm sm:text-2xl font-semibold leading-snug">
                  {p.title}
                </h3>
                <p className="hidden sm:block text-xs sm:text-sm text-white/70 mt-3 leading-relaxed max-w-[90%]">
                  {p.description}
                </p>
                <div className="hidden sm:flex flex-wrap justify-center gap-1.5 mt-4">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <span className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-lime-300 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400 delay-75">
                {p.cta} <ArrowUpRight size={15} />
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
