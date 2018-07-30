import "../../normalize";
import 'url-search-params-polyfill';
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
    for (let item in obj) {
      arr[idx++] = [item, obj[item]]
    }
    return new URLSearchParams(arr).toString()
  }
  
  /**
   * 真正的请求
   * @param url 请求地址
   * @param options 请求参数
   * @param method 请求方式
   */
  function commonFetch(url, options, method = 'GET') {
    const searchStr =new URLSearchParams(options);
    console.log(searchStr)
    let initObj = {}
    if (method === 'GET') { // 如果是GET请求，拼接url
      url += '?' + searchStr;
      initObj = {
        method: method,
        credentials: 'include',
        mode:'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
      }
    } else {
      initObj = {
        method: method,
        credentials: 'include',
        mode:'cors',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: searchStr
      }
    }
    return fetch(url, initObj).then(function(response) {
      console.log(JSON.stringify(response)+"--------fetch------")
      return response&&response.json();
    });
    // fetch(url, initObj).then((res) => {
    //   return res.json()
    // }).then((res) => {
    //   return res
    // })
  }
  
  /**
   * GET请求
   * @param url 请求地址
   * @param options 请求参数
   */
  export function GET(url, options) {
    return commonFetch(url, options, 'GET')
  }
  
  /**
   * POST请求
   * @param url 请求地址
   * @param options 请求参数
   */
  export function POST(url, options) {
    return commonFetch(url, options, 'POST')
  }