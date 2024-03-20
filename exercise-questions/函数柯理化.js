/*
 * @Author: mjh
 * @Date: 2024-03-20 10:58:36
 * @LastEditors: mjh
 * @LastEditTime: 2024-03-20 13:38:33
 * @Description: 
 */
const sumjs = function (num) {
    let sum = num
    const sumSub = function (num) {
        return sumjs(num + sum)
    }
    sumSub.valueOf = () => sum
    return sumSub
}

const sumNum = sumjs(19)(20)(14).valueOf()
console.log(sumNum, 'sumNum');

function curry(fn, ...arg) {
    if (arg.length >= fn.length) {
        return fn(...arg)
    } else {
        return function (..._arg) {
            return curry(fn, ...arg,..._arg)
        }
    }
}

function testSum  (x, y, z, d) {
    return x+y+z+d
}
const testFun = curry(testSum)
console.log('testFun: ', testFun(1,2,3,4));
console.log('testFun: ', testFun(1)(2)(3)(4));
console.log('testFun: ', testFun(1, 2)(3,4));