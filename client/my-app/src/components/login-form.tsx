import { useState } from "react"
import { cn } from "cn"
import { useLogin } from "@/hooks/use-login"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  onLogin,
  ...props
}: React.ComponentProps<"div"> & { onLogin?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loginState, login, resetLogin] = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) onLogin?.()
  }

  return  (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-bold text-gray-500 ">
            {loginState.state === "error" ? "登录失败" : "登录你的账号"}
          </CardTitle>
          <CardDescription className="text-bold text-gray-500">
            {loginState.state === "error" ? "请检查账号信息或网络连接，然后重试" : "全世界的细雨落在了全世界的草坪上"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginState.state === "error" ? (
            <FieldGroup role="alert">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-5 text-center text-red-700">
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-red-100 text-xl font-bold">!</div>
                <p className="font-semibold">登录失败</p>
                <p className="mt-2 text-sm">{loginState.error.message}</p>
              </div>
              <Button type="button" onClick={resetLogin}>返回登录</Button>
            </FieldGroup>
          ) : (
            <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-bold text-gray-500">
                  邮箱
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="xxxx@qq.com?"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-500 font-semibold"
                />
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-bold text-gray-500">密码</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {/* TODO(路由): 跳转忘记密码/找回密码页 */}
                    忘记密码?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="你的密码是?"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loginState.state === "loading"}>
                  {loginState.state === "loading" ? "登录中..." : "登录"}
                </Button>
                {/* TODO(接口): 接入 Google 等第三方 OAuth 登录 */}
                <Button variant="outline" type="button" onClick={() => alert("向神明祈求一个账号->860393075@qq.com")}>
                  使用 其他 登录 方式
                </Button>
                <FieldDescription className="text-center">
                  {/* TODO(路由): 跳转注册页;忘记密码同理 */}
                  还没有账号? <a href="#">注册</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
