import {
  BookOpenIcon,
  BotIcon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  TerminalSquareIcon,
} from 'lucide-react'

/**
 * 侧边栏数据:改菜单只动这里,不用碰组件
 *
 * navMain 字段说明:
 *   title    菜单名
 *   url      跳转地址(目前是 "#" 占位,接入路由后改成真实路径)
 *   icon     图标(lucide-react,可去 https://lucide.dev 挑选替换)
 *   isActive 默认展开子菜单
 *   items    子菜单,没有则不渲染展开箭头
 */
export const sidebarData = {
  // 当前登录用户(接入接口后由后端数据填充,头像放 public/ 或换成外链)
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: '游乐场',
      url: '#',
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: '历史', url: '#' },
        { title: '主演', url: '#' },
        { title: '设置', url: '#' },
      ],
    },
    {
      title: '模型',
      url: '#',
      icon: <BotIcon />,
      items: [
        { title: 'Genesis', url: '#' },
        { title: 'Explorer', url: '#' },
        { title: 'Quantum', url: '#' },
      ],
    },
    {
      title: '文档资料',
      url: '#',
      icon: <BookOpenIcon />,
      items: [
        { title: '简介', url: '#' },
        { title: '快速开始', url: '#' },
        { title: '教程', url: '#' },
        { title: '更新日志', url: '#' },
      ],
    },
    {
      title: '设置',
      url: '#',
      icon: <Settings2Icon />,
      items: [
        { title: '通用', url: '#' },
        { title: '团队', url: '#' },
        { title: '账单', url: '#' },
        { title: '限制', url: '#' },
      ],
    },
  ],
  // 底部辅助菜单(支持 / 反馈)
  navSecondary: [
    { title: '支持', url: '#', icon: <LifeBuoyIcon /> },
    { title: '反馈', url: '#', icon: <SendIcon /> },
  ],
  // 「项目」分组
  projects: [
    { name: '设计工程', url: '#', icon: <FrameIcon /> },
    { name: '销售与市场营销', url: '#', icon: <PieChartIcon /> },
    { name: '旅行', url: '#', icon: <MapIcon /> },
  ],
}
