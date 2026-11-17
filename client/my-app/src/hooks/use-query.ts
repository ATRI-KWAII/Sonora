import { useCallback, useEffect, useRef, useState } from "react"

/**
 * 通用「读请求」Hook: 组件挂载/依赖变化时自动请求,卸载或依赖变化时取消旧请求,
 * 并处理三个经典问题:
 *   1. 竞态: 旧请求回来得比新请求晚,不能覆盖新数据
 *   2. 卸载后 setState: 组件已经没了,就别再写状态
 *   3. 重复请求: queryFn 是内联函数,不能因为它的引用每次变化就重新请求
 */

export type QueryStatus = "idle" | "pending" | "success" | "error"

export interface UseQueryOptions {
  /** 为 false 时不自动请求(例如缺少参数、未登录) */
  enabled?: boolean
}

export interface UseQueryResult<T> {
  data: T | null
  error: Error | null
  status: QueryStatus
  /** 首次加载: 还没有拿到过任何数据 */
  isLoading: boolean
  /** 任意一次请求进行中,包括 refetch */
  isFetching: boolean
  /** 手动重新请求 */
  refetch: () => void
}

interface QueryState<T> {
  status: QueryStatus
  data: T | null
  error: Error | null
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export function useQuery<T>(
  /** 请求函数,接收 AbortSignal;把它传给 fetch 才能真正取消网络请求 */
  queryFn: (signal: AbortSignal) => Promise<T>,
  /**
   * 何时重新请求,语义和 useEffect 的依赖数组一致。
   * 注意: 数组长度必须在多次渲染之间保持稳定(别按条件增减元素),
   * 否则 React 会报 "the final argument passed to useEffect changed size between renders"。
   */
  deps: readonly unknown[],
  options: UseQueryOptions = {},
): UseQueryResult<T> {
  const { enabled = true } = options
  const [state, setState] = useState<QueryState<T>>({
    status: "idle",
    data: null,
    error: null,
  })
  const [isFetching, setIsFetching] = useState(false)
  // 手动 refetch: 版本号 +1,驱动下面的 effect 重新执行
  const [version, setVersion] = useState(0)

  // 每次渲染都换成最新的 queryFn。这样调用方可以放心写内联箭头函数,
  // 不用担心「函数引用变了 → 触发重复请求」。
  const queryFnRef = useRef(queryFn)
  useEffect(() => {
    queryFnRef.current = queryFn
  })

  useEffect(() => {
    if (!enabled) {
      setState((prev) => (prev.status === "idle" ? prev : { ...prev, status: "idle" }))
      return
    }

    const controller = new AbortController()
    // alive 是「这次 effect 是否还有效」的开关,卸载或依赖变化时置为 false
    let alive = true

    setIsFetching(true)
    // 保留旧 data,这样重新请求时页面不会闪成空白;isLoading 由 data 是否为空决定
    setState((prev) => ({ ...prev, status: "pending", error: null }))

    queryFnRef
      .current(controller.signal)
      .then((data) => {
        if (!alive) return
        setState({ status: "success", data, error: null })
      })
      .catch((cause: unknown) => {
        // 主动取消导致的 abort 不是错误,不写进 state
        if (!alive || controller.signal.aborted) return
        // 失败时保留上一次成功的数据,避免列表页因为一次刷新失败闪成空白
        setState((prev) => ({ status: "error", data: prev.data, error: toError(cause) }))
      })
      .finally(() => {
        if (alive) setIsFetching(false)
      })

    return () => {
      alive = false
      // 组件卸载或依赖变化: 取消这次网络请求,并阻止它回来写 state
      controller.abort()
    }
    // deps 由调用方决定,这里用展开数组,和 useEffect 的依赖语义保持一致
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, version, ...deps])

  const refetch = useCallback(() => {
    setVersion((value) => value + 1)
  }, [])

  return {
    data: state.data,
    error: state.error,
    status: state.status,
    isLoading: state.status === "pending" && state.data === null,
    isFetching,
    refetch,
  }
}

/*
用法示例(注意: 你的 src/lib/http.ts 目前还不支持 AbortSignal,
可以先传 _signal 占位,靠 alive 标志防止旧数据覆盖;等 http.ts 按 TODO 加上
signal 参数后,把 signal 透传给 request 即可真正取消请求):

const { data, isLoading, error, refetch } = useQuery<Song[]>(
  (_signal) => request<{ page: number }>({ url: "/api/songs", method: "GET", data: { page } }),
  [page],
)

if (isLoading) return <Skeleton />
if (error) return <Button onClick={refetch}>重试</Button>
return <SongList songs={data ?? []} />
*/

// 本文件由 AI（DeepSeek）生成，作为「读请求 Hook」的参考实现，可自由修改、删减或删除。
// ---DeepSeek
