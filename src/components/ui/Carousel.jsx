import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

const SWIPE_THRESHOLD = 60;

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function Carousel({ items }) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const desktop = useIsDesktop();

  const wrap = useCallback((i) => (i + count) % count, [count]);
  const go = useCallback((dir) => setActive((a) => wrap(a + dir)), [wrap]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const relative = (i) => {
    let offset = i - active;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const step = desktop ? 190 : 120;
  const styleFor = (offset) => {
    const abs = Math.abs(offset);
    const dir = Math.sign(offset);
    const shift = abs === 1 ? step : step * 1.55;
    return {
      x: `calc(-50% + ${offset === 0 ? 0 : dir * shift}px)`,
      y: "-50%",
      rotateY: offset === 0 ? 0 : -dir * 34,
      scale: offset === 0 ? 1 : abs === 1 ? 0.82 : 0.66,
      opacity: abs === 0 ? 1 : abs === 1 ? 0.85 : 0.35,
      filter: offset === 0 ? "blur(0px)" : "blur(2px)",
      zIndex: 30 - abs,
    };
  };

  return (
    <div className="select-none">
      {/* Stage */}
      <div className="relative rounded-2xl overflow-hidden bg-transparent">
        <motion.div
          className="relative mx-auto h-[360px] sm:h-[500px] cursor-grab active:cursor-grabbing"
          style={{ perspective: 1400 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) go(1);
            else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
          }}
        >
          {items.map((item, i) => {
            const offset = relative(i);
            const isCenter = offset === 0;
            return (
              <motion.button
                type="button"
                key={item.src}
                onClick={() => !isCenter && setActive(i)}
                aria-label={item.title}
                aria-hidden={Math.abs(offset) > 2}
                tabIndex={isCenter ? 0 : -1}
                className="absolute left-1/2 top-1/2 w-[175px] sm:w-[270px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/8"
                initial={false}
                animate={styleFor(offset)}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Indikator bawah */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === active
                  ? "w-6 h-1.5 bg-lime-400"
                  : "w-1.5 h-1.5 bg-black/15 hover:bg-black/30"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-[11px] font-bold tabular-nums text-black/30 tracking-widest">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
