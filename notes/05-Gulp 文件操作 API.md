### Gulp 文件操作 API
#### 压缩css文件并重命名输出文件
````javascript
//src 为读取文件流，dest为写入文件流
const { src, dest} = require('gulp')
//压缩css文件的插件
const cleanCss = require('gulp-clean-css')
//重命名插件
const rename = require('gulp-rename')

exports.default = () => {
    return src('src/*.css')
        .pipe(cleanCss())
        .pipe(rename({extname:'.min.css'}))
        .pipe(dest('dist'))
}
````