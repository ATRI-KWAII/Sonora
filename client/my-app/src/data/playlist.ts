/**
 * 这张歌单由站长维护。将音频文件放进 public/music/，然后在 tracks 中添加记录。
 * 例如：{ id: 'song-1', title: '歌名', artist: '歌手', src: '/music/song-1.mp3' }
 * 没有 src 的曲目只用于展示，不会触发播放。
 * 访客页面没有上传入口；后续接入后端时，可以用接口返回的数据替换这里。
 */
export type Song = {
  id: string
  title: string
  artist: string
  src?: string
  cover?: string
  duration?: string
}

export const playlist: {
  title: string
  description: string
  songs: Song[]
} = {
  title: '雨停之前，再听一首歌。',
  description: '收集那些想要反复听的旋律，也收集每一首歌背后的心情。',
  songs: [
    { id: 'demo-1', title: '细雨落在草坪上', artist: '示例歌手', duration: '03:42' },
    { id: 'demo-2', title: '留在窗上的晚安', artist: '示例歌手', duration: '04:08' },
    { id: 'demo-3', title: '云层以下', artist: '示例歌手', duration: '03:26' },
    { id: 'demo-4', title: '下个晴天见', artist: '示例歌手', duration: '04:12' },
  ],
}
