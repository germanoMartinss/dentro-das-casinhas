import type { GalleryPhoto } from "@/types";

/** Fotos da seção "Conheça a Casinha", em /public/images/casinha. */
export const GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 20 }, (_, i) => ({
  src: `/images/casinha/${i + 1}.jpg`,
  alt: `Dentro da Casinha - foto ${i + 1}`,
}));
