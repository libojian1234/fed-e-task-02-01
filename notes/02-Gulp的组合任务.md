### Gulp 的组合任务
````javascript
//gulpgile.js
const { series, parallel } = require('gulp')

const task1 = done => {
    setTimeout(() => {
        console.log('task1 working~')
        done()
    },1000)
}

const task2 = done => {
    setTimeout(() => {
        console.log('task2 working~')
        done()
    },1000)
}

const task3 = done => {
    setTimeout(() => {
        console.log('task3 working~')
        done()
    },1000)
}

exports.foo = series(task1,task2,task3)
//series 是串行执行
exports.bar = parallel(task1,task2,task3)
//parallel 是并行执行
````
> 例如：项目中js和css编译同时编译，我们就要用并行任务parallel，它们互不干扰，再如：我们部署的时候先要执行编译的任务，再执行其他的任务，我们就要用串行执行（series）