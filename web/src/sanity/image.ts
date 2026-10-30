import {
  createImageUrlBuilder,
  type SanityImageCrop,
  type SanityImageHotspot,
  type SanityImageSource,
} from "@sanity/image-url";
import { sanityClient } from "sanity:client";

// The image fields the queries select: an asset reference with the editor's crop and hotspot.
export type SanityImageField = {
  asset?: { _ref: string } | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  alt?: string | null;
  lqip?: string | null;
};

const builder = createImageUrlBuilder(sanityClient);

// Every image is delivered as WebP; the share-image route builds its own PNG URLs.
export const urlFor = (source: SanityImageSource) =>
  builder.image(source).format("webp");
