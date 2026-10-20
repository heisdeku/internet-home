import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

export type { SanityImageSource };

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');
