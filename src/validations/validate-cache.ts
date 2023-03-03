import { z } from 'zod'

export const FirstPageCacheSchema = z.object({
  posts: z.array(z.any()),
  comments: z.array(z.any())
})

export const SecondPageCacheSchema = z.object({
  albums: z.array(z.any()),
  photos: z.array(z.any())
})

export const ThirdPageCacheSchema = z.object({
  todos: z.array(z.any()),
  users: z.array(z.any())
})
