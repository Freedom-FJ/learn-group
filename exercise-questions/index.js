/*
 * @Author: majiahui
 * @Description: 
 * @Date: 2024-03-11 15:19:31
 * @LastEditTime: 2024-03-11 15:27:20
 * @FilePath: /my-learn/exercise-questions/index.js
 */

const url = 'http://sample.com/?a=1&b=2&c=xx&d=2#hash';

const getUrlParams1 = (url) => {
  const arrSearch = url.split('?').pop().split('#').shift().split('&');
  let obj = {};
  arrSearch.forEach((item) => {
    const [k, v] = item.split('=');
    obj[k] = v;
    return obj;
  });
  return obj;
};

const getUrlParams2 = (url) => {
  const u = new URL(url);
  const s = new URLSearchParams(u.search);
  const obj = {};
  s.forEach((v, k) => (obj[k] = v));
  return obj;
};

const getUrlParams3 = (url) => {
  // 定义一个 parse url.search 的方法
  function parse(url) {
    const obj = {};
    url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (obj[k] = v));
    return obj;
  }
  url = url.split('#').shift();
  return parse(url);
};