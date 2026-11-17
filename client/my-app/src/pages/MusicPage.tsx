import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Disc3,
  Heart,
  ListMusic,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { playlist, type Song } from '@/data/playlist'
import { DiscussionPage } from '@/pages/DiscussionPage'
import { BlogPage } from '@/pages/BlogPage'

const mutedButton = 'grid place-items-center text-[#918a99] transition-colors hover:text-[#806ab7] disabled:cursor-default disabled:opacity-45 disabled:hover:text-[#918a99]'
const slider = 'h-1 w-full appearance-none rounded-full disabled:cursor-default [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#806ab7] [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#806ab7]'

function timeLabel(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

function SongArtwork({ song, className }: { song?: Song | null; className: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden bg-[linear-gradient(145deg,#b4a2d7,#7d74af)] bg-cover bg-center text-white/85 ${className}`}
      style={song?.cover ? { backgroundImage: `url("${song.cover}")` } : undefined}
    >
      <Music2 size={18} className="drop-shadow-sm" />
    </span>
  )
}

export function MusicPage() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off')
  const [activeView, setActiveView] = useState<'music' | 'discussion' | 'blog'>('music')
  const [musicSearch, setMusicSearch] = useState('')
  const [discussionSearch, setDiscussionSearch] = useState('')
  const [blogSearch, setBlogSearch] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [liked, setLiked] = useState<string[]>([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const songs = playlist.songs
  const playableSongs = songs.filter((song) => Boolean(song.src))
  const visibleSongs = songs.filter((song) => `${song.title} ${song.artist}`.toLocaleLowerCase().includes(musicSearch.trim().toLocaleLowerCase()))
  const currentIndex = currentSong ? playableSongs.findIndex((song) => song.id === currentSong.id) : -1
  const activeSearch = activeView === 'music' ? musicSearch : activeView === 'discussion' ? discussionSearch : blogSearch
  const setActiveSearch = activeView === 'music' ? setMusicSearch : activeView === 'discussion' ? setDiscussionSearch : setBlogSearch
  const showMusic = () => { setActiveView('music'); setMobileSearchOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const showDiscussion = () => { setActiveView('discussion'); setMobileSearchOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const showBlog = () => { setActiveView('blog'); setMobileSearchOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const playSong = (song: Song) => {
    const audio = audioRef.current
    if (!audio || !song.src) return
    audio.pause()
    audio.src = song.src
    audio.load()
    setCurrentSong(song)
    setTime(0)
    setDuration(0)
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false)
      setNotice('这首歌暂时无法播放，请检查音频文件。')
    })
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !playableSongs.length) return
    if (!currentSong) {
      playSong(playableSongs[0])
    } else if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => setNotice('音频播放失败，请稍后再试。'))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const changeSong = (direction: 1 | -1, wrap = true) => {
    if (!playableSongs.length) return
    const audio = audioRef.current
    if (direction === -1 && audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    if (direction === 1 && shuffle && playableSongs.length > 1) {
      const candidates = playableSongs.filter((song) => song.id !== currentSong?.id)
      playSong(candidates[Math.floor(Math.random() * candidates.length)])
      return
    }
    const next = currentIndex + direction
    if (next >= playableSongs.length && !wrap) {
      setPlaying(false)
      return
    }
    playSong(playableSongs[(next + playableSongs.length) % playableSongs.length])
  }

  const onEnded = () => {
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0
      void audioRef.current.play()
    } else {
      changeSong(1, repeat === 'all')
    }
  }

  const toggleLike = (id: string) => setLiked((previous) =>
    previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
  )

  const searchField = (
    <label className="flex h-9 items-center gap-2 rounded-[10px] border border-[#efecf1] bg-[#f8f7f9] px-3 text-[#aaa3af]">
      <Search size={17} className="shrink-0" />
      <input value={activeSearch} onChange={(event) => setActiveSearch(event.target.value)} placeholder={activeView === 'music' ? '搜索歌单中的歌曲' : activeView === 'discussion' ? '搜索讨论区帖子' : '搜索博客文章'} aria-label={activeView === 'music' ? '搜索歌单中的歌曲' : activeView === 'discussion' ? '搜索讨论区帖子' : '搜索博客文章'} className="min-w-0 flex-1 bg-transparent text-xs text-[#4e4659] outline-none placeholder:text-[#aaa4ad]" />
      {activeSearch && <button onClick={() => setActiveSearch('')} aria-label="清空搜索" className="grid place-items-center"><X size={14} /></button>}
    </label>
  )

  return (
    <div className="music-page min-h-screen bg-[#f9f8f7] pb-[144px] font-sans text-[#272430] sm:pb-[94px]">
      <audio ref={audioRef} onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onEnded={onEnded} />

      <header className="sticky top-0 z-20 border-b border-[#eeebef] bg-white">
        <div className="mx-auto flex h-[62px] max-w-[1320px] items-center gap-10 px-5 sm:h-[76px] md:px-9">
          <button onClick={showMusic} aria-label="细雨电台首页" className="flex shrink-0 items-center gap-2.5 text-left">
            <span className="grid size-9 place-items-center rounded-[11px] bg-[linear-gradient(145deg,#afa0dc,#7664b2)] text-white shadow-[0_6px_16px_#8a75b542] sm:size-10 sm:rounded-[13px]"><Music2 size={20} /></span>
            <span className="grid gap-0.5"><strong className="text-sm font-bold sm:text-[17px]">细雨电台</strong><small className="hidden text-[10px] tracking-wide text-[#a49ead] sm:block">听见自己的节奏</small></span>
          </button>
          <nav aria-label="主导航" className="hidden h-full items-center gap-9 sm:flex">
            <button onClick={showMusic} className={`relative h-full border-b-[3px] pt-[3px] text-[13px] font-semibold ${activeView === 'music' ? 'border-[#917ac5] text-[#68539f]' : 'border-transparent text-[#918c9a] hover:text-[#68539f]'}`}>歌单</button>
            <button onClick={showDiscussion} className={`relative h-full border-b-[3px] pt-[3px] text-[13px] font-semibold ${activeView === 'discussion' ? 'border-[#917ac5] text-[#68539f]' : 'border-transparent text-[#918c9a] hover:text-[#68539f]'}`}>讨论区</button>
            <button onClick={showBlog} className={`relative h-full border-b-[3px] pt-[3px] text-[13px] font-semibold ${activeView === 'blog' ? 'border-[#917ac5] text-[#68539f]' : 'border-transparent text-[#918c9a] hover:text-[#68539f]'}`}>博客</button>
          </nav>
          <div className="ml-auto flex items-center gap-4 sm:gap-6">
            <div className="hidden w-[230px] sm:block">{searchField}</div>
            <button onClick={() => setMobileSearchOpen((open) => !open)} aria-label={activeView === 'music' ? '搜索歌曲' : activeView === 'discussion' ? '搜索帖子' : '搜索文章'} className="grid place-items-center text-[#918c9a] sm:hidden"><Search size={19} /></button>
            <button onClick={() => setNotice('个人中心会在账号功能接入后开放。')} aria-label="个人中心" className="grid size-8 place-items-center rounded-full border-2 border-white bg-[#e8dce9] text-xs font-bold text-[#735e82] outline-1 outline-[#e5dce8] sm:size-9">我</button>
          </div>
        </div>
        {mobileSearchOpen && <div className="px-5 pb-3 sm:hidden">{searchField}</div>}
      </header>

      <main className={`mx-auto max-w-[1280px] px-[17px] pt-[26px] pb-[42px] sm:px-6 sm:pt-8 sm:pb-[70px] md:px-[34px] ${activeView === 'music' ? '' : 'hidden'}`}>
        <div className="mb-4 flex items-center gap-2 text-[8px] font-bold tracking-[1.4px] text-[#a694bd] sm:text-[9px] sm:tracking-[2px]"><span className="h-px w-5 bg-[#d9cde8]" />A PLAYLIST OF LITTLE MOMENTS<span className="h-px w-10 bg-[#d9cde8]" /></div>
        <section aria-label="歌单介绍" className="relative min-h-[310px] overflow-hidden rounded-[20px] bg-[linear-gradient(105deg,#a691c8_0%,#b7a7ce_47%,#e3dee7_76%,#f4f0f3_100%)] shadow-[0_14px_28px_#78688e1c] sm:min-h-[337px]">
          <div className="absolute -top-[410px] left-[39%] size-[560px] rounded-full bg-white/15" />
          <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden opacity-50 [mask-image:linear-gradient(90deg,transparent,black_26%)] sm:w-[52%] sm:opacity-100" aria-hidden="true">
            <img src="/blog/music-hero.webp" alt="" className="h-full w-full object-cover object-[center_38%]" />
            <div className="absolute -right-[76px] -bottom-[107px] hidden size-[255px] place-items-center rounded-full bg-[repeating-radial-gradient(circle,#4b414e_0_2px,#29252d_3px_4px)] opacity-90 shadow-[-16px_-15px_40px_#564b5e57] sm:grid"><span className="size-[79px] rounded-full border-[17px] border-[#d9c7e4] bg-[#cbb5db] shadow-[inset_0_0_0_5px_#ae91c5]" /></div>
            <span className="absolute top-7 right-3.5 text-[8px] font-bold tracking-[2px] text-[#5b4c6b99] [writing-mode:vertical-rl]">SOUNDTRACK FOR SLOW DAYS</span>
          </div>
          <div className="relative z-10 w-[80%] py-7 pr-2 pl-[22px] text-white sm:w-[58%] sm:py-[37px] sm:pl-[47px]">
            <span className="flex items-center gap-2 text-[11px] font-bold tracking-[1.1px] text-[#f5f0fb]"><Disc3 size={17} />细雨电台的歌单</span>
            <h1 className="mt-[22px] mb-[11px] max-w-[470px] text-[33px] leading-[1.24] font-bold tracking-wide text-balance drop-shadow-sm sm:mt-[26px] sm:mb-[13px] sm:text-[clamp(36px,3.7vw,55px)]">{playlist.title}</h1>
            <p className="max-w-[375px] text-[11px] leading-[1.7] text-white/90 sm:text-xs">{playlist.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-[27px] sm:gap-[17px]">
              <button disabled={!playableSongs.length} onClick={togglePlay} className="flex h-[38px] items-center gap-2 rounded-[10px] bg-white px-3 text-[11px] font-bold text-[#775fae] shadow-[0_5px_16px_#6b588333] transition-transform hover:-translate-y-0.5 disabled:cursor-default disabled:text-[#8c7ba3] disabled:opacity-80 disabled:shadow-none disabled:hover:translate-y-0 sm:h-[42px] sm:px-5 sm:text-xs"><Play size={17} fill="currentColor" />{playableSongs.length ? '播放歌单' : '曲目待上线'}</button>
              <span className="text-[9px] text-white/90 sm:text-[11px]">{songs.length} 首歌曲 <span className="px-1">·</span> {playableSongs.length ? '慢慢听' : '展示曲目 · 待替换'}</span>
            </div>
          </div>
        </section>

        <div className="mt-[33px] grid gap-[22px] lg:mt-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-7">
          <section aria-label="歌单歌曲" className="min-w-0">
            <div className="mb-[19px] flex items-end justify-between">
              <div><span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">THE PLAYLIST</span><h2 className="mt-1.5 mb-1 text-[19px] font-semibold text-[#302c37] sm:text-[21px]">歌单里的歌曲</h2><p className="text-[11px] text-[#a69fa9]">每一首，都有它适合出现的时刻。</p></div>
              <span className="pb-0.5 text-[10px] tracking-wide text-[#b3aaba]">{String(songs.length).padStart(2, '0')} SONGS</span>
            </div>
            {songs.length === 0 || visibleSongs.length === 0 ? (
              <div className="flex min-h-[290px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[#dcd2e7] bg-white text-center">
                <span className="mb-4 grid size-[69px] place-items-center rounded-full bg-[#f2edf8] text-[#9d88c3]">{songs.length ? <Search size={28} /> : <Disc3 size={40} strokeWidth={1.3} />}</span>
                <strong className="text-sm text-[#5b5264]">{songs.length ? '没有找到这首歌' : '歌单正在准备中'}</strong>
                <p className="mt-2 text-[11px] text-[#aaa3ae]">{songs.length ? '试试其他歌名或歌手。' : '下一首喜欢的歌，很快就会出现在这里。'}</p>
              </div>
            ) : (
              <div className="rounded-[14px] border border-[#eeebef] bg-white px-2.5 pb-1.5 shadow-[0_4px_16px_#635a6e0a] sm:px-[18px]">
                <div className="grid h-[46px] grid-cols-[30px_minmax(0,1fr)_39px] items-center border-b border-[#f1eef2] text-[10px] text-[#b5aeba] md:grid-cols-[46px_minmax(0,1.8fr)_minmax(100px,1fr)_56px_30px]"><span className="pl-2">#</span><span>歌曲</span><span className="hidden md:block">歌手</span><span className="md:col-start-4">时长</span></div>
                {visibleSongs.map((song, index) => (
                  <div key={song.id} className={`group grid h-[61px] grid-cols-[30px_minmax(0,1fr)_39px] items-center border-b border-[#f6f3f7] last:border-b-0 md:h-[69px] md:grid-cols-[46px_minmax(0,1.8fr)_minmax(100px,1fr)_56px_30px] ${song.id === currentSong?.id ? 'bg-[#faf7fe]' : ''} ${song.src ? 'hover:bg-[#fbf8fd]' : ''}`}>
                    <button disabled={!song.src} onClick={() => playSong(song)} aria-label={song.src ? `播放 ${song.title}` : `${song.title}，展示曲目`} className="grid h-9 w-[27px] place-items-center text-[11px] text-[#b0a9b4] disabled:cursor-default md:w-[33px]">{song.id === currentSong?.id && playing ? <span className="text-[#806ab7]">♫</span> : <><span className={song.src ? 'group-hover:hidden' : ''}>{String(index + 1).padStart(2, '0')}</span>{song.src && <Play size={15} fill="currentColor" className="hidden text-[#856cbc] group-hover:block" />}</>}</button>
                    <button disabled={!song.src} onClick={() => playSong(song)} className="flex min-w-0 items-center gap-2 text-left disabled:cursor-default md:gap-3">
                      <SongArtwork song={song} className="size-[37px] rounded-lg md:size-[43px]" />
                      <strong className="min-w-0 truncate text-[11px] font-bold text-[#49434f] md:text-xs">{song.title}</strong>
                      {!song.src && <small className="ml-auto shrink-0 rounded-[5px] bg-[#f3eff8] px-1 py-0.5 text-[8px] text-[#9b87b4] md:px-1.5 md:text-[9px]">展示</small>}
                    </button>
                    <span className="hidden text-[11px] text-[#aaa3ae] md:block">{song.artist}</span>
                    <span className="text-right text-[9px] text-[#aaa3ae] md:text-left md:text-[11px]">{song.id === currentSong?.id && duration ? timeLabel(duration) : song.duration ?? '—'}</span>
                    <button disabled={!song.src} onClick={() => toggleLike(song.id)} aria-label={liked.includes(song.id) ? `取消收藏 ${song.title}` : `收藏 ${song.title}`} className={`hidden place-items-center disabled:cursor-default md:grid ${liked.includes(song.id) ? 'text-[#bf79a0]' : 'text-[#b7b0ba]'}`}><Heart size={17} fill={liked.includes(song.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:pt-0.5">
            <div className="rounded-[14px] border border-[#f0edf1] bg-white px-[23px] pt-[23px] pb-5 shadow-[0_4px_16px_#635a6e0a]">
              <span className="text-[9px] font-bold tracking-[1.9px] text-[#a490ba]">ABOUT THIS PLAYLIST</span>
              <div className="mt-5 grid size-[43px] place-items-center rounded-xl bg-[#f1eafa] text-[#9b83c4]"><Music2 size={23} /></div>
              <h2 className="mt-4 mb-2.5 text-[19px] leading-[1.45] font-semibold text-[#4f445b]">把喜欢的声音<br />放在一起。</h2>
              <p className="text-[11px] leading-[1.8] text-[#a49baa]">这里会慢慢装进值得反复听的歌。随时回来，也许会遇到新的心动旋律。</p>
              <div className="my-5 h-px bg-[#f0edf1]" />
              <div className="flex items-center justify-between text-[10px] text-[#9f97a7]"><span>目前收录</span><strong className="text-lg text-[#876cbb]">{String(songs.length).padStart(2, '0')} <small className="text-[10px] font-medium">首歌曲</small></strong></div>
            </div>
            <div className="mt-[15px] flex items-start gap-2.5 rounded-xl bg-[#f2eef8] px-[15px] py-[17px] text-[#9983b3]"><MessageCircle size={19} className="shrink-0" /><div className="min-w-0"><strong className="block text-[11px] text-[#736489]">听完想聊聊？</strong><p className="mt-1 text-[10px] leading-[1.65]">去讨论区分享这首歌，或者看看大家正在聊什么。</p></div><button onClick={showDiscussion} aria-label="前往讨论区" className="ml-auto shrink-0"><ArrowRight size={18} /></button></div>
          </aside>
        </div>
      </main>

      <div className={activeView === 'discussion' ? '' : 'hidden'}><DiscussionPage search={discussionSearch} onNotice={setNotice} onMusic={showMusic} /></div>
      <div className={activeView === 'blog' ? '' : 'hidden'}><BlogPage search={blogSearch} onMusic={showMusic} /></div>

      <div className="fixed right-0 bottom-[57px] left-0 z-30 grid h-[77px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-t border-[#eeeaf0] bg-white px-3.5 shadow-[0_-8px_25px_#4c425b0a] sm:bottom-0 sm:h-[94px] sm:grid-cols-[minmax(170px,1fr)_minmax(250px,1.2fr)] sm:gap-5 sm:px-6 lg:grid-cols-[minmax(210px,1fr)_minmax(280px,1.1fr)_minmax(180px,1fr)] lg:px-9">
        <div className="flex min-w-0 items-center gap-2.5"><SongArtwork song={currentSong} className="size-[42px] rounded-lg sm:size-[49px]" /><span className="grid min-w-0 gap-1"><strong className="truncate text-[11px] font-bold text-[#4c4552]">{currentSong?.title ?? (playableSongs.length ? '选一首歌，开始播放' : '歌曲待上线')}</strong><small className="truncate text-[10px] text-[#aaa3ae]">{currentSong?.artist ?? '细雨电台'}</small></span>{currentSong && <button onClick={() => toggleLike(currentSong.id)} aria-label="收藏当前歌曲" className={`ml-2 hidden sm:grid ${liked.includes(currentSong.id) ? 'text-[#bf79a0]' : 'text-[#b7b0ba]'}`}><Heart size={18} fill={liked.includes(currentSong.id) ? 'currentColor' : 'none'} /></button>}</div>
        <div className="sm:grid sm:gap-2.5"><div className="flex items-center justify-center gap-[25px]"><button disabled={!playableSongs.length} onClick={() => setShuffle((value) => !value)} aria-label="随机播放" className={`hidden sm:grid ${mutedButton} ${shuffle ? 'text-[#806ab7]' : ''}`}><Shuffle size={17} /></button><button disabled={!playableSongs.length} onClick={() => changeSong(-1)} aria-label="上一首" className={`hidden sm:grid ${mutedButton}`}><SkipBack size={18} fill="currentColor" /></button><button disabled={!playableSongs.length} onClick={togglePlay} aria-label={playing ? '暂停' : '播放'} className="grid size-[35px] place-items-center rounded-full bg-[#806ab7] text-white shadow-[0_4px_10px_#7d68b253] disabled:cursor-default disabled:bg-[#ded8e8] disabled:text-[#a99bb8] disabled:shadow-none">{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button disabled={!playableSongs.length} onClick={() => changeSong(1)} aria-label="下一首" className={`hidden sm:grid ${mutedButton}`}><SkipForward size={18} fill="currentColor" /></button><button disabled={!playableSongs.length} onClick={() => setRepeat((value) => value === 'off' ? 'all' : value === 'all' ? 'one' : 'off')} aria-label={repeat === 'off' ? '开启循环' : repeat === 'all' ? '切换单曲循环' : '关闭循环'} className={`hidden sm:grid ${mutedButton} ${repeat !== 'off' ? 'text-[#806ab7]' : ''}`}>{repeat === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}</button></div>
          <div className="hidden items-center gap-3 text-[9px] text-[#aaa3ae] sm:flex"><span className="min-w-[27px]">{timeLabel(time)}</span><input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} disabled={!currentSong} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value) }} aria-label="播放进度" className={slider} style={{ background: `linear-gradient(90deg,#9079c2 ${duration ? time / duration * 100 : 0}%,#eae6ef ${duration ? time / duration * 100 : 0}%)` }} /><span className="min-w-[27px]">{duration ? timeLabel(duration) : '0:00'}</span></div></div>
        <div className="hidden items-center justify-end gap-[17px] text-[#a7a0ad] lg:flex"><ListMusic size={18} /><button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} aria-label={volume === 0 ? '取消静音' : '静音'} className={mutedButton}>{volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="音量" className={`${slider} max-w-[88px]`} style={{ background: `linear-gradient(90deg,#9079c2 ${volume * 100}%,#eae6ef ${volume * 100}%)` }} /></div>
      </div>
      <nav aria-label="移动端导航" className="fixed right-0 bottom-0 left-0 z-30 flex h-[57px] items-center justify-around border-t border-[#eeeaf0] bg-white sm:hidden"><button onClick={showMusic} className={`flex flex-col items-center gap-0.5 px-5 text-[9px] ${activeView === 'music' ? 'text-[#806ab7]' : 'text-[#938b9c]'}`}><ListMusic size={19} />歌单</button><button onClick={showDiscussion} className={`flex flex-col items-center gap-0.5 px-5 text-[9px] ${activeView === 'discussion' ? 'text-[#806ab7]' : 'text-[#938b9c]'}`}><MessageCircle size={19} />讨论区</button><button onClick={showBlog} className={`flex flex-col items-center gap-0.5 px-5 text-[9px] ${activeView === 'blog' ? 'text-[#806ab7]' : 'text-[#938b9c]'}`}><BookOpen size={19} />博客</button></nav>
      {notice && <div role="status" className="fixed bottom-[150px] left-1/2 z-50 flex max-w-[calc(100vw-30px)] -translate-x-1/2 items-center gap-3 rounded-[10px] bg-[#403748] px-[13px] py-[11px] text-[11px] text-white shadow-[0_8px_23px_#3e344a44] sm:bottom-[110px]"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="关闭提示" className="shrink-0"><X size={15} /></button></div>}
    </div>
  )
}
