export const discussionCategories = ['音乐闲聊', '心情碎片', '推荐分享'] as const

export type DiscussionCategory = typeof discussionCategories[number]

export type Reply = {
  id: string
  author: string
  content: string
  createdAt: string
  mine?: boolean
}

export type Post = {
  id: string
  title: string
  content: string
  category: DiscussionCategory
  author: string
  createdAt: string
  likes: number
  replies: Reply[]
  mine?: boolean
  demo?: boolean
}

/** 前端演示数据；接入接口后用服务端返回的帖子替换。 */
export const initialPosts: Post[] = [
  {
    id: 'demo-post-1',
    title: '有没有一首歌，让你想起某个下雨的下午？',
    content: '今天路过一家小店，门口正好放着很久没听过的旋律。雨下得不大，却突然想起以前放学回家的路。你们也有这样的歌吗？',
    category: '音乐闲聊',
    author: '小岛来信',
    createdAt: '2026-11-09T09:30:00+08:00',
    likes: 18,
    demo: true,
    replies: [
      { id: 'demo-reply-1', author: '半颗月亮', content: '有！有些前奏一响，整条街的味道都回来了。', createdAt: '2026-11-09T10:04:00+08:00' },
      { id: 'demo-reply-2', author: '晚风收音机', content: '我会想起坐在窗边听雨的那个夏天。', createdAt: '2026-11-09T10:22:00+08:00' },
    ],
  },
  {
    id: 'demo-post-2',
    title: '分享一首适合夜里散步时听的歌',
    content: '想找一些节奏不太快、但能让人越走越轻松的歌。也欢迎说说你最喜欢在什么时间听它。',
    category: '推荐分享',
    author: '慢慢走',
    createdAt: '2026-11-08T21:16:00+08:00',
    likes: 12,
    demo: true,
    replies: [
      { id: 'demo-reply-3', author: '小岛来信', content: '我喜欢先从很安静的钢琴开始，走到街灯亮起来。', createdAt: '2026-11-08T21:40:00+08:00' },
    ],
  },
  {
    id: 'demo-post-3',
    title: '今天的心情，像歌单里的哪一首？',
    content: '想给今天留一个声音作为书签。如果用一首歌形容现在的心情，你会选什么？',
    category: '心情碎片',
    author: '纸飞机',
    createdAt: '2026-11-08T16:25:00+08:00',
    likes: 9,
    demo: true,
    replies: [
      { id: 'demo-reply-4', author: '半颗月亮', content: '选一首慢慢变亮的歌吧，今天总算轻松了一点。', createdAt: '2026-11-08T17:01:00+08:00' },
    ],
  },
  {
    id: 'demo-post-4',
    title: '你会把一首喜欢的歌单曲循环多久？',
    content: '最近发现自己总舍不得切歌。好像不听到腻，就还没认真和它告别。',
    category: '音乐闲聊',
    author: '晚风收音机',
    createdAt: '2026-11-07T19:50:00+08:00',
    likes: 15,
    demo: true,
    replies: [],
  },
]
