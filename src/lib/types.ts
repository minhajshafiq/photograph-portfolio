export type MousePosition = {
  x: number;
  y: number;
};

export type CategoryId = "gym" | "business" | "portrait" | "video" | "events";

export type Photo = {
  src: string;
  /** Horizontal offset from cursor, in px, for the scatter layout. */
  offsetX: number;
  /** Vertical offset from cursor, in px, for the scatter layout. */
  offsetY: number;
  /** Resting rotation, in degrees. */
  rotate: number;
};

export type Category = {
  id: CategoryId;
  label: string;
  /** Short descriptor shown next to the label. */
  meta: string;
  photos: Photo[];
};

export type StackableItem = {
  id: number | string;
};
