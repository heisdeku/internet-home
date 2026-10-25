import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'
import {ASPECT_RATIOS} from './embed'

/** A video from an uploaded file or a direct URL, with a poster. Embedded players use `embed`. */
export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'source',
      type: 'string',
      options: {
        list: [
          {title: 'Upload', value: 'file'},
          {title: 'URL', value: 'url'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'file',
    }),
    defineField({
      name: 'file',
      type: 'file',
      options: {accept: 'video/mp4,video/webm,video/quicktime'},
      hidden: ({parent}) => parent?.source === 'url',
      validation: (rule) =>
        rule.custom((file, context) => {
          const parent = context.parent as {source?: string} | undefined
          return parent?.source === 'url' || file?.asset ? true : 'Upload a video or switch to URL'
        }),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      description: 'A direct link to an .mp4 or .webm file',
      type: 'url',
      hidden: ({parent}) => parent?.source !== 'url',
      validation: (rule) =>
        rule.custom((url, context) => {
          const parent = context.parent as {source?: string} | undefined
          return parent?.source !== 'url' || url ? true : 'Enter the video URL'
        }),
    }),
    defineField({
      name: 'poster',
      description: 'Shown before the video plays and as the still on slow connections',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aspectRatio',
      description: 'Reserves the space before the video loads',
      type: 'string',
      options: {
        list: ASPECT_RATIOS,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '16/9',
    }),
    defineField({name: 'caption', type: 'string'}),
    defineField({
      name: 'autoplay',
      description:
        'Muted, looping and without controls, for motion clips. Off shows a play button.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {caption: 'caption', media: 'poster', source: 'source'},
    prepare: ({caption, media, source}) => ({
      title: caption || 'Video',
      subtitle: source === 'url' ? 'From URL' : 'Uploaded',
      media,
    }),
  },
})
