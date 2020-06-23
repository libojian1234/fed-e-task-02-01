### Gulp 异步任务的三种方式
````javascript
//gulpgile.js
exports.callback = done => {
    console.log('callback task~')
    done()
}

exports.callback_error = done => {
    console.log('callback task~')
    done(new Error('task failed!'))
}
````
> 抛出了错误事件后，任务就不会向后执行了
````javascript
//gulpgile.js
exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve()
}

exports.promise_error = () => {
    console.log('promise task~')
    return Promise.reject(new Error('task failed~'))
}

const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve,time)
    })
}

exports.async = async () => {
    await timeout(1000)
    console.log('async task')
}
````
````javascript
//gulpgile.js
const fs = require('fs')

exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeSteam = fs.createWriteStream('temp.txt')
    readStream.pipe(writeSteam)
    return readStream
}
````
> stream 中的文件流读取完成之后，会触发end方法来结束这个任务
````javascript
//gulpgile.js
const fs = require('fs')

exports.stream = done => {
    const readStream = fs.createReadStream('package.json')
    const writeSteam = fs.createWriteStream('temp.txt')
    readStream.pipe(writeSteam)
    readStream.on('end',() => {
        done()
    })
}
````
> 这个是模拟end方法中的结束任务