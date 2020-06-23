### Gulp 构建过程核心工作原理
#### 模拟压缩文件并输出文件
````javascript
//gulpfile.js
const fs = require('fs')
const { Transform } = require('stream')

exports.default = () => {
    //文件读取流
    const read = fs.createReadStream('foo.css')
    //文件写入流
    const write = fs.createWriteStream('foo.min.css')
    //文件转换流
    const transform = new Transform({
        transform: (chunk,encoding,callback) =>{
            //核心转换过程实现
            //chunk => 读取流中读取到的内容（Buffer）
            const input = chunk.toString()
            const output = input.replace(/\s+/g,'').replace(/\/\*.+?\*\//g,'')
            callback(null,output)
        }
    })
    //把读取出来的文件流导入写入文件流
    read
        .pipe(transform) //转换
        .pipe(write)  //导入
    return read
}
````