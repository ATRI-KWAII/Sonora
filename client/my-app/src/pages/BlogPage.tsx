import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, Clock3, PenLine, Plus, Search, Sparkles, X } from 'lucide-react'
import { blogCategories, initialBlogPosts, type BlogCategory, type BlogPost } from '@/data/blog'

type BlogPageProps = {
  search: string
  onMusic: () => void
}

const dateLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))

export function BlogPage({ search, onMusic }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts)
  const [category, setCategory] = useState<BlogCategory | '全部'>('全部')
  const [savedOnly, setSavedOnly] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftCategory, setDraftCategory] = useState<BlogCategory>('音乐随笔')
  const [draftContent, setDraftContent] = useState('')

  const selectedPost = posts.find((post) => post.id === selectedId)
  const query = search.trim().toLocaleLowerCase()
  const filteredPosts = posts.filter((post) =>
    (category === '全部' || post.category === category) &&
    (!savedOnly || savedIds.includes(post.id)) &&
    (!query || `${post.title} ${post.excerpt} ${post.author} ${post.category}`.toLocaleLowerCase().includes(query))
  )
  const featuredPost = filteredPosts[0]
  const otherPosts = filteredPosts.slice(1)

  useEffect(() => {
    if (!editorOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditorOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [editorOpen])

  const openPost = (post: BlogPost) => {
    setSelectedId(post.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const returnToList = () => {
    setSelectedId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSaved = (id: string) => {
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const publishPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = draftTitle.trim()
    const paragraphs = draftContent.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    if (!title || !paragraphs.length) return

    const post: BlogPost = {
      id: `local-${Date.now()}`,
      title,
      excerpt: `${paragraphs[0].slice(0, 82)}${paragraphs[0].length > 82 ? '…' : ''}`,
      paragraphs,
      category: draftCategory,
      author: '我',
      date: new Date().toISOString().slice(0, 10),
      minutes: Math.max(1, Math.ceil(draftContent.length / 450)),
      mine: true,
    }
    setPosts((current) => [post, ...current])
    setDraftTitle('')
    setDraftContent('')
    setCategory('全部')
    setSavedOnly(false)
    setEditorOpen(false)
    openPost(post)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-[17px] pt-[26px] pb-[42px] sm:px-6 sm:pt-8 sm:pb-[70px] md:px-[34px]">
      {selectedPost ? (
        <article className="mx-auto max-w-[890px]">
          <button onClick={returnToList} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#806ab7] hover:text-[#654e9e]"><ArrowLeft size={16} />返回博客</button>
          <div className="overflow-hidden rounded-[22px] border border-[#eee9f2] bg-white shadow-[0_12px_38px_#5c4b7412]">
            {selectedPost.cover ? (
              <img src={selectedPost.cover} alt="" className="aspect-[2.15/1] w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-[linear-gradient(120deg,#c7b7df,#f4d9df)] text-white"><BookOpen size={52} strokeWidth={1.2} /></div>
            )}
            <div className="px-6 py-8 sm:px-11 sm:py-10">
              <span className="inline-flex rounded-full bg-[#f2ecf8] px-3 py-1 text-[11px] font-bold text-[#806ab7]">{selectedPost.category}</span>
              <h1 className="mt-5 text-[28px] leading-[1.35] font-bold text-[#302a3d] sm:text-[38px]">{selectedPost.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#f0ebf3] pb-6 text-xs text-[#93899e]">
                <span>{selectedPost.author}</span><span>{dateLabel(selectedPost.date)}</span><span className="inline-flex items-center gap-1"><Clock3 size={14} />约 {selectedPost.minutes} 分钟</span>
              </div>
              <div className="space-y-6 pt-8 text-[15px] leading-[2.05] text-[#514b59] sm:text-base">
                {selectedPost.paragraphs.map((paragraph, index) => <p key={index} className="whitespace-pre-wrap">{paragraph}</p>)}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ebf3] pt-6">
                <span className="text-xs text-[#9a91a1]">读到这里，听首歌休息一下吧。</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleSaved(selectedPost.id)} className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${savedIds.includes(selectedPost.id) ? 'border-[#cfbee5] bg-[#f2ecf8] text-[#775eaa]' : 'border-[#e7e1eb] text-[#82788c] hover:bg-[#f8f5fa]'}`}><Bookmark size={15} fill={savedIds.includes(selectedPost.id) ? 'currentColor' : 'none'} />{savedIds.includes(selectedPost.id) ? '已收藏' : '收藏文章'}</button>
                  <button onClick={onMusic} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#806ab7] px-3 text-xs font-semibold text-white hover:bg-[#7059aa]">去听音乐<ArrowRight size={15} /></button>
                </div>
              </div>
            </div>
          </div>
          {selectedPost.mine && <p className="mt-4 text-center text-xs text-[#a399aa]">演示文章保存在当前页面，刷新后会消失。</p>}
        </article>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-[2px] text-[#a694bd]"><span className="h-px w-5 bg-[#d9cde8]" />STORIES FOR SLOW DAYS<span className="h-px w-10 bg-[#d9cde8]" /></div>
          <section className="relative flex min-h-[310px] items-end overflow-hidden rounded-[22px] bg-[#28233d] shadow-[0_18px_38px_#5c4b7426] sm:min-h-[370px] sm:items-center" aria-label="博客介绍">
            <img src="/blog/blog-hero.webp" alt="雨夜咖啡馆里写日记的插画" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,23,51,.92),rgba(40,32,65,.58)_48%,rgba(40,32,65,.06))]" />
            <div className="relative z-10 max-w-[600px] px-6 py-8 text-white sm:px-12 sm:py-11">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[1.5px] text-[#e8d9ff]"><Sparkles size={16} />细雨电台 · 博客</span>
              <h1 className="mt-5 text-[34px] leading-[1.24] font-bold tracking-wide sm:text-[50px]">把日子写成<br />可以重听的故事。</h1>
              <p className="mt-4 max-w-[410px] text-xs leading-[1.9] text-white/85 sm:text-sm">关于音乐、城市和那些舍不得忘记的瞬间。慢慢读，慢慢听，给每一种心情留一个位置。</p>
              <button onClick={() => openPost(initialBlogPosts[0])} className="mt-6 inline-flex h-10 items-center gap-2 rounded-[10px] bg-white px-5 text-xs font-bold text-[#765fa9] shadow-lg transition-transform hover:-translate-y-0.5">读一篇文章<ArrowRight size={16} /></button>
            </div>
          </section>

          <div className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,1fr)_270px]">
            <section className="min-w-0" aria-label="博客文章">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">THE JOURNAL</span><h2 className="mt-1 text-[23px] font-semibold text-[#302c37]">博客里的故事</h2><p className="mt-1 text-xs text-[#a69fa9]">每篇文章，都是一段想和你分享的时间。</p></div>
                <button onClick={() => setEditorOpen(true)} className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#806ab7] px-3.5 text-xs font-semibold text-white hover:bg-[#7059aa]"><Plus size={16} />写文章</button>
              </div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {(['全部', ...blogCategories] as const).map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-[11px] font-semibold transition-colors ${category === item ? 'bg-[#806ab7] text-white' : 'bg-white text-[#8b8094] hover:bg-[#f1ebf7]'}`}>{item}</button>)}
                <button onClick={() => setSavedOnly((value) => !value)} className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold ${savedOnly ? 'bg-[#efe5f7] text-[#7659aa]' : 'bg-white text-[#8b8094] hover:bg-[#f1ebf7]'}`}><Bookmark size={13} fill={savedOnly ? 'currentColor' : 'none'} />只看收藏</button>
              </div>
              {filteredPosts.length === 0 ? (
                <div className="grid min-h-[270px] place-content-center rounded-[16px] border border-dashed border-[#ded4e8] bg-white px-5 text-center"><Search size={29} className="mx-auto mb-3 text-[#ad98c6]" /><strong className="text-sm text-[#5a5064]">暂时没有找到文章</strong><p className="mt-2 text-xs text-[#a59baa]">试试其他关键词或分类。</p></div>
              ) : (
                <>
                  {featuredPost && <article className="group overflow-hidden rounded-[16px] border border-[#eeeaf0] bg-white shadow-[0_6px_22px_#635a6e0b] sm:grid sm:grid-cols-[42%_1fr]">
                    <button onClick={() => openPost(featuredPost)} className="block h-[220px] w-full overflow-hidden text-left sm:h-full sm:min-h-[255px]" aria-label={`阅读 ${featuredPost.title}`}>
                      {featuredPost.cover ? <img src={featuredPost.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="grid h-full place-items-center bg-[linear-gradient(135deg,#cbb9e6,#f6dce2)] text-white"><BookOpen size={45} /></span>}
                    </button>
                    <div className="flex flex-col p-5 sm:p-6"><span className="text-[10px] font-bold tracking-[1.2px] text-[#9b80bb]">{featuredPost.category} · {featuredPost.mine ? '刚刚发布' : '精选文章'}</span><button onClick={() => openPost(featuredPost)} className="mt-3 text-left text-xl leading-[1.45] font-semibold text-[#41384c] hover:text-[#806ab7]">{featuredPost.title}</button><p className="mt-3 line-clamp-3 text-xs leading-[1.85] text-[#8d8493]">{featuredPost.excerpt}</p><div className="mt-auto flex items-center justify-between pt-6 text-[10px] text-[#a49aaa]"><span>{featuredPost.author} · {dateLabel(featuredPost.date)}</span><button onClick={() => openPost(featuredPost)} aria-label={`阅读全文：${featuredPost.title}`} className="text-[#806ab7]"><ArrowRight size={18} /></button></div></div>
                  </article>}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {otherPosts.map((post) => <article key={post.id} className="group overflow-hidden rounded-[16px] border border-[#eeeaf0] bg-white shadow-[0_6px_22px_#635a6e0b]"><button onClick={() => openPost(post)} className="block h-[185px] w-full overflow-hidden" aria-label={`阅读 ${post.title}`}>{post.cover ? <img src={post.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="grid h-full place-items-center bg-[linear-gradient(135deg,#cbb9e6,#f6dce2)] text-white"><BookOpen size={40} /></span>}</button><div className="p-5"><span className="text-[10px] font-bold tracking-wide text-[#9b80bb]">{post.category}</span><button onClick={() => openPost(post)} className="mt-2 block text-left text-base leading-[1.5] font-semibold text-[#41384c] hover:text-[#806ab7]">{post.title}</button><p className="mt-2 line-clamp-2 text-xs leading-[1.8] text-[#8d8493]">{post.excerpt}</p><div className="mt-5 flex items-center justify-between border-t border-[#f2eef4] pt-3 text-[10px] text-[#a49aaa]"><span>{post.author} · 约 {post.minutes} 分钟</span><button onClick={() => toggleSaved(post.id)} aria-label={savedIds.includes(post.id) ? `取消收藏 ${post.title}` : `收藏 ${post.title}`} className="text-[#9b83bb] hover:text-[#806ab7]"><Bookmark size={16} fill={savedIds.includes(post.id) ? 'currentColor' : 'none'} /></button></div></div></article>)}
                  </div>
                </>
              )}
            </section>

            <aside className="space-y-4 lg:pt-1">
              <div className="rounded-[16px] border border-[#eee9f2] bg-white p-6 shadow-[0_6px_22px_#635a6e0b]"><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">A LITTLE NOTE</span><div className="mt-5 grid size-11 place-items-center rounded-xl bg-[#f2ecf8] text-[#9b83c4]"><BookOpen size={22} /></div><h3 className="mt-4 text-lg leading-[1.5] font-semibold text-[#4f445b]">故事不必很长，<br />真心就好。</h3><p className="mt-3 text-xs leading-[1.85] text-[#a49baa]">可以写一首歌，也可以写下路过的风景。这里留给每个想慢慢说话的人。</p><button onClick={() => setEditorOpen(true)} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#806ab7] hover:text-[#654e9e]"><PenLine size={15} />写下我的故事<ArrowRight size={15} /></button></div>
              <div className="rounded-[16px] bg-[#eee8f5] p-6 text-[#716181]"><Sparkles size={20} className="text-[#9a80ba]" /><p className="mt-3 text-sm leading-[1.75] font-semibold">有些心情适合写下来，<br />有些心情适合唱出来。</p><button onClick={onMusic} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#806ab7]">回到歌单<ArrowRight size={15} /></button></div>
              <p className="px-2 text-[11px] leading-[1.7] text-[#aaa1ae]">当前博客内容为前端演示。新写的文章和收藏在刷新后会消失。</p>
            </aside>
          </div>
        </>
      )}

      {editorOpen && <div onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false) }} className="fixed inset-0 z-40 grid place-items-center bg-[#27212fb8] px-4 py-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="blog-editor-title" className="max-h-[calc(100vh-40px)] w-full max-w-[610px] overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><span className="text-[10px] font-bold tracking-[1.5px] text-[#a490ba]">NEW STORY</span><h2 id="blog-editor-title" className="mt-1 text-[23px] font-semibold text-[#403749]">写一篇文章</h2><p className="mt-1 text-xs text-[#a49baa]">把今天想留下的声音和故事写下来。</p></div><button onClick={() => setEditorOpen(false)} aria-label="关闭写文章窗口" className="grid size-8 place-items-center rounded-lg text-[#a49baa] hover:bg-[#f5f1f7]"><X size={19} /></button></div><form onSubmit={publishPost} className="mt-6 space-y-4"><div><label htmlFor="blog-title" className="text-xs font-semibold text-[#655a6e]">标题</label><input id="blog-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} required minLength={2} maxLength={80} placeholder="给这篇故事起个名字" className="mt-2 h-11 w-full rounded-lg border border-[#e9e4ed] bg-[#fbfafc] px-3 text-sm text-[#524b58] outline-none placeholder:text-[#b0a9b3] focus:border-[#af9acb]" /></div><div><label htmlFor="blog-category" className="text-xs font-semibold text-[#655a6e]">分类</label><select id="blog-category" value={draftCategory} onChange={(event) => setDraftCategory(event.target.value as BlogCategory)} className="mt-2 h-11 w-full rounded-lg border border-[#e9e4ed] bg-[#fbfafc] px-3 text-sm text-[#524b58] outline-none focus:border-[#af9acb]">{blogCategories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="blog-content" className="text-xs font-semibold text-[#655a6e]">正文</label><textarea id="blog-content" value={draftContent} onChange={(event) => setDraftContent(event.target.value)} required minLength={20} maxLength={10000} placeholder="写下你的故事。用空行分开段落，阅读时会更舒服。" className="mt-2 min-h-[220px] w-full resize-y rounded-lg border border-[#e9e4ed] bg-[#fbfafc] px-3 py-3 text-sm leading-[1.8] text-[#524b58] outline-none placeholder:text-[#b0a9b3] focus:border-[#af9acb]" /></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0edf1] pt-5"><span className="text-[11px] text-[#aaa3ae]">演示模式：刷新后文章会消失</span><div className="flex gap-2"><button type="button" onClick={() => setEditorOpen(false)} className="h-9 rounded-lg px-3 text-xs text-[#8f8794]">取消</button><button type="submit" className="h-9 rounded-lg bg-[#806ab7] px-4 text-xs font-semibold text-white hover:bg-[#7059aa]">发布文章</button></div></div></form></div></div>}
    </div>
  )
}
