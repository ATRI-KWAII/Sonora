import {useState} from "react"
import {request} from "@/lib/http"

const LOGIN_URL = "/api/auth/login"

//这个useLogin用来处理用户登陆请求
type UserData = {
  email:string,
  password:string
}

type LoginState =
|{state:"success"}
|{state:"error",error:Error}
|{state:"loading"}
|{state:"idle"}

export function useLogin()  {
  const [loginState, setLoginState] = useState<LoginState>({state:"idle"})

  async function login (userData:UserData): Promise<boolean> {
    if(loginState.state === "loading"){
       console.warn("正在登录中,请勿重复点击") 
       return false 
    }  
    setLoginState({state:"loading"})
    const loginResponse : boolean = await request<UserData>({url:LOGIN_URL,method:"POST",data:userData}).then((data : string ) => {
    sessionStorage.setItem("accessToken", data)
    setLoginState({ state: "success" })
    return true
    }).catch((error: unknown)=>{
        const reason = error instanceof Error && error.cause instanceof Error ? error.cause : error
        setLoginState({state:"error",error: reason instanceof Error ? reason : new Error("登录失败，请稍后重试")})
        return false;
      })
      return loginResponse
    }
    
    
    function resetLogin() {
      setLoginState({state:"idle"})
    }

    return [loginState, login, resetLogin] as const
}
//古法手搓代码.不烧心
