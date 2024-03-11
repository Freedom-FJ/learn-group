/*
 * @Author: majiahui
 * @Description: 
 * @Date: 2024-03-11 15:19:31
 * @LastEditTime: 2024-03-11 15:19:33
 * @FilePath: /my-learn/exercise-questions/index.js
 */

const url = 'http://sample.com/?a=1&b=2&c=xx&d=2#hash';

const getUrlParams = (url) => {
  const arrSearch = url.split('?').pop().split('#').shift().split('&');
  let obj = {};
  arrSearch.forEach((item) => {
    const [k, v] = item.split('=');
    obj[k] = v;
    return obj;
  });
  return obj;
};