import { motion } from "framer-motion";
import type { Category, CategoryId } from "../../lib/types";

type CategoryRowProps = {
  category: Category;
  active: boolean;
  onHover: (id: CategoryId) => void;
  onLeave: () => void;
};

/** One big interactive category title. Stretches slightly on hover. */
export function CategoryRow({ category, active, onHover, onLeave }: CategoryRowProps) {
  const activate = () => onHover(category.id);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      data-cursor="view"
      className="group relative z-20 flex w-full cursor-pointer items-center justify-between gap-4 border-b border-ink/15 px-4 py-5 transition-colors duration-300 hover:bg-ink md:items-baseline md:py-7"
      onMouseEnter={activate}
      onMouseMove={activate}
      onMouseLeave={onLeave}
      onFocus={activate}
      onBlur={onLeave}
    >
      <div className="min-w-0 flex-1">
        <motion.span
          className="block font-display text-[11vw] uppercase leading-none tracking-tight transition-colors duration-300 md:inline md:text-[7vw]"
          animate={{
            scaleY: active ? 1.16 : 1,
            color: active ? "#c8553d" : "#0a0a0a",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 12, mass: 0.7 }}
          style={{ originY: 1 }}
        >
          {category.label}
        </motion.span>
        {/* meta sits under the title on mobile */}
        <span className="mt-2 block font-sans text-[11px] uppercase tracking-[0.2em] text-ink/50 transition-colors duration-300 group-hover:text-paper/60 md:hidden">
          {category.meta}
        </span>
      </div>

      {/* Static thumbnail — mobile only (replaces the hover scatter) */}
      <img
        src={category.photos[0]?.src}
        alt={`${category.label} — preview`}
        loading="lazy"
        className="h-20 w-16 shrink-0 rounded-md object-cover md:hidden"
      />

      {/* meta on the right — desktop only */}
      <span className="ml-4 hidden shrink-0 font-sans text-sm uppercase tracking-[0.2em] text-ink/50 transition-colors duration-300 group-hover:text-paper/60 md:block">
        {category.meta}
      </span>
    </motion.div>
  );
}
