import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

export type { SanityImageSource };

const builder = createImageUrlBuilder(sanityClient);

// Every image is delivered as WebP; the share-image route builds its own PNG URLs.
export const urlFor = (source: SanityImageSource) => builder.image(source).format('webp');
