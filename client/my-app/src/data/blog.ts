export const blogCategories = ['音乐随笔', '生活手记', '城市漫游'] as const

export type BlogCategory = typeof blogCategories[number]

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  paragraphs: string[]
  category: BlogCategory
  author: string
  date: string
  minutes: number
  cover?: string
  mine?: boolean
}

/** 博客演示文章；接入后端后可换成接口返回的数据。 */
export const initialBlogPosts: BlogPost[] = [
  {
    id: 'rooftop-after-rain',
    title: '雨停以后，把耳机留给傍晚',
    excerpt: '天台的水还没干，云却已经慢慢亮起来。有些歌适合在回家的路上听，有些歌适合在路结束以后继续听。',
    paragraphs: [
      '雨停得比预想中早。楼梯间的窗开着一条缝，风把潮湿的空气推上天台，远处的房子像刚从水里捞出来。',
      '我把耳机戴上，却没有急着按播放。城市已经有了自己的节奏：楼下的自行车铃，电车拐弯时轻轻的摩擦声，还有不知道从哪一扇窗里传出的钢琴练习。',
      '后来选了一首很慢的歌。它没有替今天解释什么，只是陪我把天色从粉色看到紫色。原来放松有时候不是把事情做完，而是允许自己在一段旋律里停一会儿。',
      '如果你也刚好结束了忙碌的一天，不妨把喜欢的那首歌再听一遍。等副歌过去，再决定要不要往前走。',
    ],
    category: '音乐随笔',
    author: '小岛来信',
    date: '2026-11-12',
    minutes: 4,
    cover: '/blog/rooftop-notes.webp',
  },
  {
    id: 'window-and-starlight',
    title: '给深夜留一盏小灯',
    excerpt: '一本没读完的书，一杯温热的茶，还有窗外慢慢安静下来的街道。今晚可以不用着急。',
    paragraphs: [
      '我总觉得，夜里适合把白天没来得及想的事情放到桌面上。灯只开一盏，书翻到一半，茶也不必立刻喝完。',
      '窗外偶尔有车经过，光在天花板上划出短短的一道线。我把今天听过的歌写进本子里，旁边记着一句当时没来得及说出口的话。',
      '很多平常的瞬间，在几天后就会变得珍贵。也许因为它们没有什么特别之处，才需要我们自己给它们一个名字。',
      '今晚的名字就叫作「慢一点」。希望你的灯光也刚刚好。',
    ],
    category: '生活手记',
    author: '半颗月亮',
    date: '2026-11-10',
    minutes: 3,
    cover: '/blog/night-reading.webp',
  },
  {
    id: 'last-train-home',
    title: '末班车经过的小站',
    excerpt: '站台上只有很轻的雨声。耳机里的歌唱到最后一句时，刚好看见远处列车的灯。',
    paragraphs: [
      '那天我比平常晚一点离开。小站的灯亮着，地面映出一小片一小片的天空，像谁把傍晚剪碎后放在脚边。',
      '等车的人不多。我看见一位阿姨把伞收好，认真地抖掉上面的雨水。几分钟里，谁也没有说话，大家只是一起望着铁轨尽头。',
      '列车进站前，我正听到一首歌的最后一句。它讲的是离开，也是回来。耳机里的声音和车窗里的灯光碰在一起，普通的一天忽然有了片尾。',
      '城市总会有人赶路，也总会有人在某个小站停下来。下一次经过这里，我想试着不那么匆忙。',
    ],
    category: '城市漫游',
    author: '晚风收音机',
    date: '2026-11-08',
    minutes: 4,
    cover: '/blog/last-train.webp',
  },
]
