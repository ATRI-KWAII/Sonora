import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  MessageSquareText,
  Music2,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { discussionCategories, initialPosts, type DiscussionCategory, type Post, type Reply } from '@/data/discussion'

type DiscussionPageProps = {
  search: string
  onNotice: (message: string) => void
  onMusic: () => void
}

const dateLabel = (value: string, mine?: boolean) => mine
  ? '刚刚'
  : new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(value))

const categoryTone: Record<DiscussionCategory, string> = {
  音乐闲聊: 'bg-[#f0ebfa] text-[#8068b5]',
  心情碎片: 'bg-[#fbeef3] text-[#bd7795]',
  推荐分享: 'bg-[#eaf4f4] text-[#65959c]',
}

function Avatar({ name, mine = false, size = 'normal' }: { name: string; mine?: boolean; size?: 'normal' | 'small' }) {
  const colors = ['bg-[#e8dbef] text-[#8d68ab]', 'bg-[#e5edf3] text-[#708aa7]', 'bg-[#f4e5e7] text-[#ac7d87]', 'bg-[#e9eee2] text-[#829273]']
  const color = mine ? 'bg-[#e9def8] text-[#7d65b1]' : colors[name.length % colors.length]
  return <span className={`grid shrink-0 place-items-center rounded-full font-bold ${color} ${size === 'small' ? 'size-8 text-xs' : 'size-10 text-sm'}`}>{mine ? '我' : name.slice(0, 1)}</span>
}

export function DiscussionPage({ search, onNotice, onMusic }: DiscussionPageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [category, setCategory] = useState<DiscussionCategory | '全部话题'>('全部话题')
  const [tab, setTab] = useState<'latest' | 'hot' | 'mine'>('latest')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftCategory, setDraftCategory] = useState<DiscussionCategory>('音乐闲聊')
  const [replyDraft, setReplyDraft] = useState('')

  useEffect(() => {
    if (!editorOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditorOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [editorOpen])

  const selectedPost = posts.find((post) => post.id === selectedId)
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const filteredPosts = posts
    .filter((post) => category === '全部话题' || post.category === category)
    .filter((post) => tab !== 'mine' || post.mine)
    .filter((post) => `${post.title} ${post.content} ${post.author}`.toLocaleLowerCase().includes(normalizedSearch))
    .sort((a, b) => tab === 'hot' ? (b.likes + b.replies.length * 2) - (a.likes + a.replies.length * 2) : Date.parse(b.createdAt) - Date.parse(a.createdAt))
  const replyCount = posts.reduce((total, post) => total + post.replies.length, 0)

  const toggleLike = (id: string) => setLikedIds((previous) =>
    previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
  )

  const openPost = (id: string) => {
    setSelectedId(id)
    setReplyDraft('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const publishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = draftTitle.trim()
    const content = draftContent.trim()
    if (!title || !content) return
    const id = `local-post-${crypto.randomUUID()}`
    const newPost: Post = {
      id,
      title,
      content,
      category: draftCategory,
      author: '我',
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      mine: true,
    }
    setPosts((previous) => [newPost, ...previous])
    setSelectedId(id)
    setDraftTitle('')
    setDraftContent('')
    setEditorOpen(false)
    onNotice('帖子已发布在当前页面；刷新后会消失。')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const publishReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = replyDraft.trim()
    if (!selectedId || !content) return
    const reply: Reply = {
      id: `local-reply-${crypto.randomUUID()}`,
      author: '我',
      content,
      createdAt: new Date().toISOString(),
      mine: true,
    }
    setPosts((previous) => previous.map((post) => post.id === selectedId ? { ...post, replies: [...post.replies, reply] } : post))
    setReplyDraft('')
    onNotice('回复已显示；刷新后会消失。')
  }

  return (
    <main className="mx-auto max-w-[1280px] px-[17px] pt-[26px] pb-[42px] sm:px-6 sm:pt-8 sm:pb-[70px] md:px-[34px]">
      <div className="mb-4 flex items-center gap-2 text-[8px] font-bold tracking-[1.4px] text-[#a694bd] sm:text-[9px] sm:tracking-[2px]"><span className="h-px w-5 bg-[#d9cde8]" />THE LISTENING ROOM<span className="h-px w-10 bg-[#d9cde8]" /></div>

      <section className="relative min-h-[230px] overflow-hidden rounded-[20px] bg-[linear-gradient(110deg,#a995cb_0%,#c5b6d5_54%,#f0e9eb_100%)] shadow-[0_14px_28px_#78688e1c] sm:min-h-[250px]">
        <div className="absolute -top-48 right-[18%] size-[420px] rounded-full border border-white/20 shadow-[0_0_0_36px_#ffffff0d,0_0_0_78px_#ffffff0a]" />
        <div className="absolute inset-y-0 right-0 w-[60%] overflow-hidden opacity-25 [mask-image:linear-gradient(90deg,transparent,black_45%)] sm:w-[48%] sm:opacity-55" aria-hidden="true"><img src="/blog/discussion-hero.webp" alt="" className="h-full w-full object-cover object-[center_44%]" /></div>
        <div className="absolute right-7 bottom-7 hidden size-24 rotate-[-12deg] place-items-center rounded-[28px] border border-white/40 bg-white/20 text-white shadow-[0_15px_30px_#7a629a22] backdrop-blur-sm sm:grid"><MessageSquareText size={44} strokeWidth={1.3} /></div>
        <div className="relative z-10 max-w-[670px] px-6 py-7 text-white sm:px-12 sm:py-8">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-[1.2px] text-white/90"><Sparkles size={15} /> 细雨电台 · 讨论区</span>
          <h1 className="mt-4 text-[29px] leading-[1.28] font-bold tracking-wide sm:mt-5 sm:text-[39px]">听见你，也听见你的故事。</h1>
          <p className="mt-2 max-w-[460px] text-[11px] leading-[1.7] text-white/90 sm:text-xs">聊聊最近喜欢的歌，分享心情，或者写下某个被旋律记住的瞬间。</p>
          <button onClick={() => setEditorOpen(true)} className="mt-5 flex h-[37px] items-center gap-2 rounded-[9px] bg-white px-4 text-[11px] font-bold text-[#7963ad] shadow-[0_5px_16px_#6b588333] hover:bg-[#f9f5ff]"><Plus size={16} />发一篇帖子</button>
        </div>
      </section>

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-7">
        <section className="min-w-0" aria-label="讨论区帖子">
          {selectedPost ? (
            <>
              <button onClick={() => setSelectedId(null)} className="mb-5 flex items-center gap-2 text-[11px] font-semibold text-[#8b78ac] hover:text-[#6f589e]"><ArrowLeft size={16} />返回帖子列表</button>
              <article className="rounded-[15px] border border-[#eeeaf0] bg-white px-5 py-6 shadow-[0_4px_16px_#635a6e0a] sm:px-7">
                <div className="flex items-center gap-2.5"><Avatar name={selectedPost.author} mine={selectedPost.mine} /><div className="min-w-0"><strong className="block truncate text-xs text-[#544b5c]">{selectedPost.author}</strong><span className="text-[10px] text-[#aaa2ae]">{dateLabel(selectedPost.createdAt, selectedPost.mine)} · {selectedPost.demo ? '示例帖子' : '页面内发布'}</span></div><span className={`ml-auto shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${categoryTone[selectedPost.category]}`}>{selectedPost.category}</span></div>
                <h2 className="mt-6 text-xl leading-[1.45] font-bold text-[#302c37] sm:text-[23px]">{selectedPost.title}</h2>
                <p className="mt-4 whitespace-pre-wrap text-[13px] leading-[1.9] text-[#6f6874]">{selectedPost.content}</p>
                <div className="mt-7 flex items-center gap-5 border-t border-[#f0edf1] pt-4"><button onClick={() => toggleLike(selectedPost.id)} aria-label={likedIds.includes(selectedPost.id) ? '取消喜欢帖子' : '喜欢帖子'} className={`flex items-center gap-1.5 text-[11px] ${likedIds.includes(selectedPost.id) ? 'text-[#bd789b]' : 'text-[#a69ca9]'}`}><Heart size={17} fill={likedIds.includes(selectedPost.id) ? 'currentColor' : 'none'} />{selectedPost.likes + (likedIds.includes(selectedPost.id) ? 1 : 0)}</button><span className="flex items-center gap-1.5 text-[11px] text-[#a69ca9]"><MessageCircle size={17} />{selectedPost.replies.length} 条回复</span></div>
              </article>

              <div className="mt-5 rounded-[15px] border border-[#eeeaf0] bg-white px-5 py-6 shadow-[0_4px_16px_#635a6e0a] sm:px-7"><h3 className="text-sm font-bold text-[#47404e]">全部回复 <span className="ml-1 text-xs font-medium text-[#a69ca9]">{selectedPost.replies.length}</span></h3><div className="mt-5 space-y-5">{selectedPost.replies.length ? selectedPost.replies.map((reply) => <div key={reply.id} className="flex gap-3 border-b border-[#f3f0f4] pb-5 last:border-b-0 last:pb-0"><Avatar name={reply.author} mine={reply.mine} size="small" /><div className="min-w-0"><div className="flex items-center gap-2"><strong className="text-[11px] text-[#554c5d]">{reply.author}</strong><span className="text-[10px] text-[#b2aab6]">{dateLabel(reply.createdAt, reply.mine)}</span></div><p className="mt-2 whitespace-pre-wrap text-xs leading-[1.8] text-[#6f6874]">{reply.content}</p></div></div>) : <p className="py-3 text-[11px] text-[#aaa3ae]">还没有回复，来说第一句吧。</p>}</div><form onSubmit={publishReply} className="mt-6 border-t border-[#f0edf1] pt-5"><label htmlFor="reply-content" className="text-[11px] font-semibold text-[#6c6076]">写下你的回复</label><textarea id="reply-content" value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} maxLength={1000} required placeholder="分享你的想法，友善地聊聊……" className="mt-2.5 min-h-[100px] w-full resize-y rounded-[10px] border border-[#e9e4ed] bg-[#fbfafc] px-3.5 py-3 text-xs leading-[1.7] text-[#524b58] outline-none placeholder:text-[#b0a9b3] focus:border-[#af9acb]" /><div className="mt-2.5 flex items-center justify-between"><span className="text-[10px] text-[#ada5b1]">演示模式：刷新后回复会消失</span><button type="submit" disabled={!replyDraft.trim()} className="flex h-9 items-center gap-2 rounded-[9px] bg-[#806ab7] px-4 text-[11px] font-semibold text-white disabled:cursor-default disabled:opacity-50"><Send size={14} />发表回复</button></div></form></div>
            </>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">COMMUNITY NOTES</span><h2 className="mt-1.5 text-[21px] font-semibold text-[#302c37]">大家在聊什么</h2><p className="mt-1 text-[11px] text-[#a69fa9]">在这里，音乐总有更多说法。</p></div><button onClick={() => setEditorOpen(true)} className="flex h-9 items-center gap-1.5 rounded-[9px] bg-[#806ab7] px-3.5 text-[11px] font-semibold text-white hover:bg-[#7059aa]"><Plus size={15} />写帖子</button></div>
              <div className="rounded-[14px] border border-[#eeeaf0] bg-white px-4 pt-1 shadow-[0_4px_16px_#635a6e0a] sm:px-5"><div className="flex items-center gap-6 border-b border-[#f0edf1]"><button onClick={() => setTab('latest')} className={`h-11 border-b-2 text-[11px] font-semibold ${tab === 'latest' ? 'border-[#927bc7] text-[#765fae]' : 'border-transparent text-[#9b94a0]'}`}>最新</button><button onClick={() => setTab('hot')} className={`h-11 border-b-2 text-[11px] font-semibold ${tab === 'hot' ? 'border-[#927bc7] text-[#765fae]' : 'border-transparent text-[#9b94a0]'}`}>热门</button><button onClick={() => setTab('mine')} className={`h-11 border-b-2 text-[11px] font-semibold ${tab === 'mine' ? 'border-[#927bc7] text-[#765fae]' : 'border-transparent text-[#9b94a0]'}`}>我的帖子</button><span className="ml-auto text-[10px] text-[#b6aeb9]">{filteredPosts.length} 个话题</span></div><div className="flex gap-2 overflow-x-auto py-4">{(['全部话题', ...discussionCategories] as const).map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold ${category === item ? 'bg-[#806ab7] text-white' : 'bg-[#f7f4f9] text-[#958a9d] hover:bg-[#eee8f4]'}`}>{item}</button>)}</div></div>
              <div className="mt-3 space-y-3">{filteredPosts.length ? filteredPosts.map((post) => <article key={post.id} className="rounded-[14px] border border-[#eeeaf0] bg-white px-4 py-4 shadow-[0_4px_16px_#635a6e0a] sm:px-5 sm:py-5"><div className="flex items-center gap-2.5"><Avatar name={post.author} mine={post.mine} size="small" /><strong className="text-[11px] text-[#5b5260]">{post.author}</strong><span className="text-[10px] text-[#b3aab5]">· {dateLabel(post.createdAt, post.mine)}</span><span className={`ml-auto shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold ${categoryTone[post.category]}`}>{post.category}</span></div><button onClick={() => openPost(post.id)} className="mt-3 block w-full text-left"><h3 className="line-clamp-2 text-[15px] leading-[1.5] font-bold text-[#3e3745] hover:text-[#806ab7]">{post.title}</h3><p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.8] text-[#938b98]">{post.content}</p></button><div className="mt-4 flex items-center gap-5 border-t border-[#f5f2f5] pt-3.5 text-[10px]"><button onClick={() => toggleLike(post.id)} aria-label={likedIds.includes(post.id) ? `取消喜欢 ${post.title}` : `喜欢 ${post.title}`} className={`flex items-center gap-1.5 ${likedIds.includes(post.id) ? 'text-[#bd789b]' : 'text-[#aaa2ac]'}`}><Heart size={15} fill={likedIds.includes(post.id) ? 'currentColor' : 'none'} />{post.likes + (likedIds.includes(post.id) ? 1 : 0)}</button><button onClick={() => openPost(post.id)} className="flex items-center gap-1.5 text-[#aaa2ac]"><MessageCircle size={15} />{post.replies.length} 条回复</button><span className="ml-auto text-[#b9b1ba]">{post.demo ? '示例帖子' : '当前页面'}</span></div></article>) : <div className="rounded-[14px] border border-dashed border-[#ddd4e8] bg-white px-6 py-14 text-center"><MessageCircle size={28} className="mx-auto text-[#ad98ca]" /><strong className="mt-4 block text-sm text-[#5d5267]">暂时没有匹配的帖子</strong><p className="mt-1.5 text-[11px] text-[#aaa3ae]">换个筛选条件，或者写下第一篇。</p></div>}</div>
            </>
          )}
        </section>

        <aside className="space-y-4"><div className="rounded-[14px] border border-[#f0edf1] bg-white px-[22px] py-[23px] shadow-[0_4px_16px_#635a6e0a]"><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">A LITTLE CORNER</span><div className="mt-5 grid size-11 place-items-center rounded-xl bg-[#f1eafa] text-[#9b83c4]"><MessageSquareText size={23} /></div><h2 className="mt-4 text-[19px] leading-[1.45] font-semibold text-[#4f445b]">让好听的歌，<br />遇见好聊的人。</h2><p className="mt-2 text-[11px] leading-[1.8] text-[#a49baa]">分享歌，也分享被歌陪伴的日常。每一种心情都值得被认真听见。</p><div className="my-5 h-px bg-[#f0edf1]" /><div className="flex justify-between text-[10px] text-[#9f97a7]"><span>话题 <strong className="ml-1 text-sm text-[#806ab7]">{posts.length}</strong></span><span>回复 <strong className="ml-1 text-sm text-[#806ab7]">{replyCount}</strong></span></div></div><div className="rounded-xl bg-[#f2eef8] px-4 py-4"><span className="text-[11px] font-semibold text-[#736489]">来这里聊聊</span><p className="mt-1.5 text-[10px] leading-[1.7] text-[#9988aa]">友善表达、尊重不同的听歌喜好。演示内容只在当前页面保留。</p></div><button onClick={onMusic} className="flex w-full items-center justify-between rounded-xl border border-[#ede8f1] bg-white px-4 py-3.5 text-[11px] font-semibold text-[#806ab7]"><span className="flex items-center gap-2"><Music2 size={16} />回到歌单听听歌</span><ArrowRight size={16} /></button></aside>
      </div>

      {editorOpen && <div onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false) }} className="fixed inset-0 z-40 grid place-items-center bg-[#27212fb0] px-4 py-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="new-post-title" className="max-h-[calc(100vh-40px)] w-full max-w-[570px] overflow-y-auto rounded-[18px] bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">NEW CONVERSATION</span><h2 id="new-post-title" className="mt-1 text-xl font-bold text-[#3e3745]">写下你的故事</h2><p className="mt-1 text-[11px] text-[#a49baa]">一首歌、一种心情，都可以成为话题。</p></div><button onClick={() => setEditorOpen(false)} aria-label="关闭发帖窗口" className="grid size-8 place-items-center rounded-lg text-[#a49baa] hover:bg-[#f5f1f7]"><X size={19} /></button></div><form onSubmit={publishPost} className="mt-6 space-y-4"><div><label htmlFor="post-category" className="block text-[11px] font-semibold text-[#655a6e]">话题分类</label><select id="post-category" value={draftCategory} onChange={(event) => setDraftCategory(event.target.value as DiscussionCategory)} className="mt-2 h-10 w-full rounded-[9px] border border-[#e9e4ed] bg-[#fbfafc] px-3 text-xs text-[#524b58] outline-none focus:border-[#af9acb]">{discussionCategories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="post-title" className="block text-[11px] font-semibold text-[#655a6e]">标题</label><input id="post-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} maxLength={80} minLength={2} required placeholder="给你的话题起个名字" className="mt-2 h-10 w-full rounded-[9px] border border-[#e9e4ed] bg-[#fbfafc] px-3 text-xs text-[#524b58] outline-none placeholder:text-[#b0a9b3] focus:border-[#af9acb]" /></div><div><label htmlFor="post-content" className="block text-[11px] font-semibold text-[#655a6e]">内容</label><textarea id="post-content" value={draftContent} onChange={(event) => setDraftContent(event.target.value)} maxLength={3000} minLength={2} required placeholder="说说你想分享的歌和故事……" className="mt-2 min-h-[170px] w-full resize-y rounded-[9px] border border-[#e9e4ed] bg-[#fbfafc] px-3 py-3 text-xs leading-[1.7] text-[#524b58] outline-none placeholder:text-[#b0a9b3] focus:border-[#af9acb]" /></div><div className="flex items-center justify-between border-t border-[#f0edf1] pt-4"><span className="max-w-[190px] text-[10px] leading-[1.5] text-[#aaa3ae]">演示模式：刷新后帖子会消失</span><div className="flex gap-2"><button type="button" onClick={() => setEditorOpen(false)} className="h-9 rounded-[9px] px-3 text-[11px] text-[#8f8794]">取消</button><button type="submit" disabled={!draftTitle.trim() || !draftContent.trim()} className="flex h-9 items-center gap-1.5 rounded-[9px] bg-[#806ab7] px-4 text-[11px] font-semibold text-white disabled:cursor-default disabled:opacity-50"><Send size={14} />发布帖子</button></div></div></form></div></div>}
    </main>
  )
}
