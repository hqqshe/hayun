import "../../normalize";
import 'url-search-params-polyfill';
  /**
   * 具体请求
   * @param url 请求地址
   * @param options 请求参数
   * @param method 请求方式
   */
  function commonFetch(url, options, method = 'GET') {
    console.log(method+'----fetch url---'+url)
    const searchStr =new URLSearchParams(options);
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