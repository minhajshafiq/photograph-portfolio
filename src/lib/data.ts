import type { Category, Photo } from "./types";

// ── Real photos provided by Lyba ────────────────────────────────────────────
const GYM = ["/img/gym_1.jpg"];
const BUSINESS = ["/img/business_1.JPG", "/img/business_2.JPG"];

// ── Placeholders still to be replaced (Portrait / Video / Events) ────────────
const PLACEHOLDER = [
  "/img/work-01.avif",
  "/img/work-02.jpg",
  "/img/work-03.jpg",
  "/img/work-04.jpg",
];

// Scatter layout presets, chosen by how many photos a category reveals so the
// trio (or pair, or single) fans out nicely around the cursor.
const LAYOUTS: Record<number, { x: number; y: number; r: number }[]> = {
  1: [{ x: 0, y: -10, r: 3 }],
  2: [
    { x: -220, y: 30, r: -7 },
    { x: 220, y: 40, r: 8 },
  ],
  3: [
    { x: -260, y: 40, r: -8 },
    { x: 0, y: -30, r: 3 },
    { x: 260, y: 50, r: 9 },
  ],
};

const makePhotos = (srcs: string[]): Photo[] => {
  const layout = LAYOUTS[srcs.length] ?? LAYOUTS[3];
  return srcs.map((src, i) => ({
    src,
    offsetX: layout[i].x,
    offsetY: layout[i].y,
    rotate: layout[i].r,
  }));
};

export const CATEGORIES: Category[] = [
  { id: "gym", label: "Gym", meta: "training · brands", photos: makePhotos(GYM) },
  {
    id: "business",
    label: "Business",
    meta: "founders · products",
    photos: makePhotos(BUSINESS),
  },
  {
    id: "portrait",
    label: "Portrait",
    meta: "people · editorial",
    photos: makePhotos([PLACEHOLDER[1], PLACEHOLDER[2], PLACEHOLDER[0]]),
  },
  {
    id: "video",
    label: "Video",
    meta: "reels · short films",
    photos: makePhotos([PLACEHOLDER[3], PLACEHOLDER[0], PLACEHOLDER[1]]),
  },
  {
    id: "events",
    label: "Events",
    meta: "live · coverage",
    photos: makePhotos([PLACEHOLDER[0], PLACEHOLDER[2], PLACEHOLDER[3]]),
  },
];

// Draggable showcase stack — leads with Lyba's real work.
export const STACK_IMAGES = [
  "/img/gym_1.jpg",
  "/img/business_1.JPG",
  "/img/business_2.JPG",
  "/img/work-01.avif",
];
