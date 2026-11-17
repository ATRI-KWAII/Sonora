import { useCallback, useEffect, useRef, useState } from "react"

/**
 * 通用「写请求」Hook: 把一次异步操作(POST/PUT/DELETE 等)的
 * loading / error / data 三件套、防重复提交和卸载清理收进一个地方。
 *
 * 和 React Query 的 useMutation 思路一致，但只有 100 行左右，方便看懂每一步。
 */

export type MutationStatus = "idle" | "pending" | "success" | "error"

export interface UseMutationOptions<TData, TVariables> {
  /** 成功后的回调,适合做跳转、提示、刷新列表等副作用 */
  onSuccess?: (data: TData, variables: TVariables) => void
  /** 失败后的回调,可以在这里做统一提示 */
  onError?: (error: Error, variables: TVariables) => void
  /** 无论成功失败都会执行,适合收尾(例如关闭弹窗) */
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void
}

export interface UseMutationResult<TData, TVariables> {
  /** 触发请求,不返回 Promise,错误已写进 state;一般用于 onClick/onSubmit */
  mutate: (variables: TVariables) => void
  /** 触发请求并返回 Promise,需要 await 拿到结果时使用 */
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | null
  error: Error | null
  status: MutationStatus
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  /** 清空 data/error,并把状态恢复到 idle */
  reset: () => void
}

interface MutationState<TData> {
  status: MutationStatus
  data: TData | null
  error: Error | null
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {},
): UseMutationResult<TData, TVariables> {
  const [state, setState] = useState<MutationState<TData>>({
    status: "idle",
    data: null,
    error: null,
  })

  // 要点 1: 用 ref 保存「最新」的 mutationFn 和 options。
  // 如果把它们放进 useCallback 的依赖数组,父组件每次渲染传进来的函数都可能是新的,
  // mutate/mutateAsync 的引用就会一直变;而异步回调里又容易读到旧闭包。
  const latestRef = useRef({ mutationFn, options })
  useEffect(() => {
    latestRef.current = { mutationFn, options }
  })

  // 要点 2: 组件卸载后不再 setState;同时用自增序号丢弃过期响应。
  const mountedRef = useRef(true)
  const requestIdRef = useRef(0)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    const { mutationFn: run, options: opts } = latestRef.current
    const requestId = ++requestIdRef.current

    setState({ status: "pending", data: null, error: null })

    let data: TData
    try {
      data = await run(variables)
    } catch (cause) {
      const error = toError(cause)
      // 只有「最后一次请求 + 组件仍挂载」才写 state、才触发回调。
      // 否则连续提交时,先失败的旧请求会把状态改回 error。
      if (mountedRef.current && requestId === requestIdRef.current) {
        setState({ status: "error", data: null, error })
        opts.onError?.(error, variables)
        opts.onSettled?.(null, error, variables)
      }
      throw error
    }

    if (mountedRef.current && requestId === requestIdRef.current) {
      setState({ status: "success", data, error: null })
      opts.onSuccess?.(data, variables)
      opts.onSettled?.(data, null, variables)
    }
    return data
  }, [])

  const mutate = useCallback(
    (variables: TVariables) => {
      // 用 void + catch 吞掉 rejection:错误已经进了 state 并触发 onError,
      // 不吞的话调用方会收到一个没人处理的 Promise rejection。
      void mutateAsync(variables).catch(() => {})
    },
    [mutateAsync],
  )

  const reset = useCallback(() => {
    // 让还在路上的请求作废,避免它回来后把状态又改回 success/error
    requestIdRef.current++
    setState({ status: "idle", data: null, error: null })
  }, [])

  return {
    mutate,
    mutateAsync,
    data: state.data,
    error: state.error,
    status: state.status,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    reset,
  }
}

/*
用法示例(接入 src/components/login-form.tsx):

const login = useMutation(
  async (variables: LoginVariables) => {
    await request<LoginVariables>({ url: "/api/login", method: "POST", data: variables })
  },
  { onSuccess: () => onLogin?.() },
)

// 提交时
login.mutate({ email, password })

// 渲染时
<Button disabled={login.isPending}>{login.isPending ? "登录中..." : "登录"}</Button>
{login.error && <p>{login.error.message}</p>}
*/

// 本文件由 AI（DeepSeek）生成，作为「写请求 Hook」的参考实现，可自由修改、删减或删除。
// ---DeepSeek
