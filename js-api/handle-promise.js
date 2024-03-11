/*
 * @Author: majiahui
 * @Description: 
 * @Date: 2024-03-04 17:33:06
 * @LastEditTime: 2024-03-05 11:40:08
 * @FilePath: /my-learn/js-api/handle-promise.js
 */
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
    constructor(executor) {
        this.value = undefined
        this.reason = undefined
        this.status = PENDING
        // 定义两个数组
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        
        this.resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        this.reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        const promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                // 用 setTimeout 模拟异步
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === REJECTED) {
                // 用 setTimeout 模拟异步
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // 用 setTimeout 模拟异步
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    // 用 setTimeout 模拟异步
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
   }
    // catch函数实际上里面就是调用了then方法
    catch (errCallback) {
      return this.then(null, errCallback)
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('UnhandledPromiseRejectionWarning: TypeError: Chaining cycle detected for promise #<Promise>'))
    }
    let called
    // 判断x的类型 x是对象或函数才有可能是一个promise
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        try {
            const then = x.then
            if (typeof then === 'function') {
                // 只能认为它是一个promise
                then.call(x, (y) => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            }else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}


module.exports = Promise;
