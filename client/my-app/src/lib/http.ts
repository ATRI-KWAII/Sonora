//这个文件是为了集中处理api发送和接收
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type HttpRequest<T> = {
    url: string,
    method: RequestMethod,
    data: T
}

type BackendResult = {
    code: number,// 1表示成功,其他都是失败
    msg: string,// 后端返回的错误消息
    data: any// 后端返回的数据
}
/***
 *@param request: HttpRequest<T>  请求对象,包含url(请求路径),method(请求方式),data(需要发送的数据)

 *@returns Promise<any> 返回一个Promise对象,成功时返回data,失败时抛出错误
 */

//request函数不亲自发送请求,而是处理报错和返回数据,并且返回数据,方便后续处理.
//返回 1 才是成功 , 其他都是失败
export async function request<T>(request: HttpRequest<T>):Promise<any> {//只规定返回值类型的原因是为了简化操作,不然的话还得去定义一个返回值的类型作为泛型,太麻烦了
    let attemptCount : number = 0;
    while (true) {
        try{
        const result : BackendResult = await send<T>(request);
        return result.data;
        } catch (error) {
        attemptCount++;
        if (attemptCount < 5) {
            console.error(`执行失败 重试中(${attemptCount}/5)`);
            continue; // 重试
        }
        console.error(`执行失败`);
        throw new Error("执行失败",{cause:error});
        }
    }
}

//发送请求,失败时会抛出错误
async function send<T>  (request: HttpRequest<T>):Promise<BackendResult>  {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const url = request.method === 'GET' && request.data
        ? `${request.url}?${new URLSearchParams(request.data as Record<string, string>)}`
        : request.url;

    return await fetch(url, request.method === 'GET' ? {
        method: request.method,
        headers,
        } : {
        method: request.method,
        headers,
        body: JSON.stringify(request.data)
    }).then(async response => {
        const result : BackendResult = await response.json();
        if (!response.ok||result.code !== 1) {
            if (result.code !== 1) throw new Error(`后端报错: ${result.msg}`);
            else throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);

        }else{
            return result;
        }
    })

}

/***
 *遗留待解决问题:
 *1. 重试无差别:4xx、401、业务错误码等重试也不会成功的错误,现在照样重试5次,应只对网络错误和5xx重试(后端完善后改)
 *2. 没有超时:服务器挂起不响应时,请求会一直pending,将来加AbortController + setTimeout
 *3. 响应不是JSON时会抛难懂的错:比如后端500返回HTML错误页,response.json()会抛解析错误
 *4. 返回值是any,调用方没有类型提示,字段拼错不会报错,可改为双泛型 request<TReq, TRes>
 *5. 代码风格:return await冗余、try块内缩进、空格等小问题,可顺手清理
 *                                                                                               ---- KIMI
 */
