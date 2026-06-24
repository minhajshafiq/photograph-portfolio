import { useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";

/**
 * Drives a draggable card's tilt from its drag position and reports when it
 * has been thrown far enough to be sent to the back of the stack.
 */
export function useCardRotation(onThresholdExceed?: () => void) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [18, -18]);
  const rotateY = useTransform(x, [-100, 100], [-18, 18]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 160 || Math.abs(info.offset.y) > 160) {
      onThresholdExceed?.();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return { x, y, rotateX, rotateY, handleDragEnd };
}
