import { motion } from "framer-motion";
import type { MousePosition, Photo } from "../../lib/types";

type PhotoPreviewProps = {
  photo: Photo;
  index: number;
  mouse: MousePosition;
  label: string;
};

/**
 * A single photo that springs in around the cursor when a category is hovered.
 * The center image (index 1) follows the cursor at half strength for depth.
 */
export function PhotoPreview({ photo, index, mouse, label }: PhotoPreviewProps) {
  return (
    <motion.div
      className="pointer-events-none absolute z-30 aspect-[4/5] w-44 overflow-hidden rounded-lg shadow-2xl md:w-56"
      initial={{ scale: 0, opacity: 0, x: photo.offsetX, y: photo.offsetY, rotate: photo.rotate }}
      animate={{
        scale: 1,
        opacity: 1,
        x: photo.offsetX + (index === 1 ? mouse.x / 2 : mouse.x),
        y: photo.offsetY + mouse.y,
        rotate: photo.rotate,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 13, mass: 0.6 }}
    >
      <img
        src={photo.src}
        alt={`${label} — preview`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
