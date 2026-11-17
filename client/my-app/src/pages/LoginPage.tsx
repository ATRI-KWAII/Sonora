import { LoginForm } from '@/components/login-form'

interface LoginPageProps {
  /** 登录成功后的回调,由 LoginForm 内的登录请求成功后触发 */
  onLogin: () => void
}

/**
 * 登录页:负责居中布局,卡片主体和登录请求在 components/login-form.tsx
 */
export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div
      className="flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10"//"url('/loginbg.png')"
      style={{
      minHeight: '100vh',
      backgroundImage: "url('/loginbg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
      <div className="w-full max-w-sm" >
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  )
}
