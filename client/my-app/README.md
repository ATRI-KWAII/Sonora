# my-app

基于 **React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui** 的管理后台前端,目前包含登录页和侧边栏控制台两个页面,均未接后端接口。

## 技术栈

| 类别       | 技术                                        |
| ---------- | ------------------------------------------- |
| 框架       | React 19 + Vite 8                           |
| 语言       | TypeScript 7                                |
| 样式       | Tailwind CSS v4 + shadcn/ui(radix 风格,nova 预设) |
| 组件底层   | Radix UI + lucide-react 图标                |
| 代码规范   | oxlint                                      |

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器
npm run build      # 类型检查 + 生产构建(输出到 dist/)
npm run preview    # 本地预览构建产物
npm run lint       # oxlint 检查
```

首次启动后访问终端里提示的地址(默认 http://localhost:5173)。页面默认进入**登录页**,输入任意邮箱和密码(格式校验通过即可)即跳转到控制台;刷新页面会回到登录页(登录态只存在内存中)。

## 目录结构

```
src/
├── App.tsx                    # 应用入口:登录态切换
├── main.tsx                   # React 挂载入口
├── index.css                  # Tailwind + shadcn 主题变量(深色为默认)
├── pages/
│   ├── LoginPage.tsx          # 登录页(居中布局 + 提交拦截)
│   └── DashboardPage.tsx      # 控制台:侧边栏 + 面包屑 + 占位卡片
├── components/
│   ├── sidebar-data.tsx       # ★ 侧边栏菜单数据,改菜单只动这里
│   ├── app-sidebar.tsx        # 侧边栏结构(品牌区/菜单/用户)
│   ├── login-form.tsx         # 登录卡片(表单本体)
│   ├── nav-main.tsx           # 主菜单(可展开子菜单)
│   ├── nav-projects.tsx       # 项目分组(含更多操作下拉)
│   ├── nav-secondary.tsx      # 底部辅助菜单
│   ├── nav-user.tsx           # 用户卡片 + 账号下拉菜单
│   └── ui/                    # shadcn 生成的通用组件,勿手写修改
├── lib/utils.ts               # cn() 工具
└── hooks/use-mobile.ts        # 移动端判断 hook
```

## 常用改动入口

- **改侧边栏菜单**:编辑 `src/components/sidebar-data.tsx`(字段说明见文件内注释)
- **改主题/颜色**:`src/index.css` 里的 `:root` / `.dark` CSS 变量
- **登录页文案/字段**:`src/components/login-form.tsx`

## 待办(代码中以 `TODO(...)` 标注,可全局搜索)

- [ ] `TODO(接口)`:登录接口对接(`src/pages/LoginPage.tsx`)、Google OAuth、退出登录(`nav-user.tsx`)
- [ ] `TODO(路由)`:引入 react-router,替换 `App.tsx` 里的内存状态切换;注册 / 忘记密码页面跳转;面包屑按路由生成
- [ ] `TODO(内容)`:控制台占位卡片替换为真实业务内容

## 添加更多 shadcn 组件

```bash
npx shadcn@latest add <组件名>     # 如 table、dialog、chart 等
npx shadcn@latest add <区块名>     # 如 dashboard-01 等完整页面区块
```

组件列表见 [ui.shadcn.com](https://ui.shadcn.com)。
