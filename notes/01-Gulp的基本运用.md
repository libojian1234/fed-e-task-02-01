### Gulp 的基本运用
1. $ yarn init --yes  //创建package.json
2. $ yarn add gulp   //安装gulp模块，同时会默认安装gulp-cli
3. $ code gulpfile.js  //新建gulp的入口文件gulpfile.js
````javascript
//gulpgile.js
exports.foo = () => {
    console.log('foo task working~')
}
//foo task working~
// The following tasks did not complete: foo
// Did you forget to signal async completion?
````
> 此时foo任务会执行，但是会报上面的错误，因为最新的gulp取消了同步模式，规定每个都是异步任务，需要有结束的标识
````javascript
//gulpgile.js
exports.foo = done => {
    console.log('foo task working~')
    done()  //标识任务完成的回调函数
}
//foo task working~
````
> 使用done这个回调函数标识任务完成
````javascript
//gulpgile.js
exports.default = done => {
    console.log('default task working~')
    done()  //标识任务完成的回调函数
}
//default task working~
````
> 执行yarn gulp 或者 yarn gulp default ，default为gulp默认任务
````javascript
//gulpgile.js
const gulp = require('gulp')
gulp.task('bar',done => {
    console.log('bar working~')
    done()
})
//bar working~
````
> gulp4.0之前使用task的方式，现在保留了task的方式，但不推荐