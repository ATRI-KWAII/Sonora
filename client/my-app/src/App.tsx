import { useState } from 'react'
import { LoginPage } from '@/pages/LoginPage'
import { MusicPage } from '@/pages/MusicPage'

/**
 * 应用入口。
 * 目前用 loggedIn 状态切换「登录页 / 音乐首页」,刷新页面会回到登录页。
 * DashboardPage 保留给未来的管理端入口。
 * TODO(路由): 接入真实登录后,建议换成 react-router,这里改为路由出口 + 路由守卫
 * (未登录访问受保护页面时重定向到 /login)。
 */
function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />
  }

  return <MusicPage />
}

export default App
