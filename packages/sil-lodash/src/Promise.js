export default class Promise {
    callbacks = [];
    state = 'pending'; // 初始状态
    value = null;
    constructor(fn) {
        fn(this._resolve.bind(this), this._reject.bind(this));
    }
    _handle(callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback);
            return;
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
        if (!cb) {
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(this.value);
            return;
        }

        let ret;

        try {
            ret = cb(this.value);
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
        } catch (error) {
            ret = error;
            cb = callback.reject;
        } finally {
            cb(ret);
        }
    }
    _resolve(value) {
        if (value && (typeof value === 'object' || typeof value === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this), this._reject.bind(this));
                return;
            }
        }
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach(callback => this._handle(callback));
    }
    _reject(error) {
        this.state = 'rejected';
        this.value = error;
        this.callbacks.forEach(callback => this._handle(callback));
    }
    then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject,
            })
        })
    }
    catch(onError) {
        return this.then(null, onError);
    }
    finally(onDone) {
        if (typeof onDone !== 'function') return this.then();
        let Promise = this.constructor;
        return this.then(
            value => Promise.resolve(onDone()).then(() => value),
            reason => Promise.resolve(onDone()).then(() => { throw reason })
        );
    }
    static resolve(value) {
        if (value && value instanceof Promise) {
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise(resolve => {
                then(resolve);
            });
        } else if (value) {
            return new Promise(resolve => resolve(value));
        } else {
            return new Promise(resolve => resolve());
        }
    }
    static reject(value) {
        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise((resolve, reject) => {
                then(reject);
            });
        } else {
            return new Promise((resolve, reject) => reject(value));
        }
    }
    static all(promises) {
        return new Promise((resolve, reject) => {
            let fulilledCount = 0;
            const itemNum = promises.length;
            const rets = Array.from({ length: itemNum });
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(result => {
                    fulfilledCount++;
                    rets[index] = result;
                    if (fulfilledCount === itemNum) {
                        resolve(rets);
                    }
                }, reason => reject(reason));
            })
        })
    }
    static race(promises) {
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(function (value) {
                    return resolve(value);
                }, function (reason) {
                    return reject(reason);
                })
            }
        })
    }
}
