### Gulp 案例

1. 安装gulp

   ````
   $ yarn init --yes       //生成package.json文件
   $ yarn add gulp --dev	//安装gulp
   ````

2. 根目录下新建gulpfile.js文件

3. gulpfile.js编写

   ````
   $ yarn add gulp-sass --dev    
   //安装scss转css插件
   $ yarn add gulp-babel --dev    
   //安装babel插件,babel只是一个转换平台，不做任何转换，唤醒core模块来转换
   $ yarn add @babel/core @babel/preset-env --dev  
   //core是ES6转ES5的转换模块，preset-env是ES最新特性
   $ yarn add gulp-swig --dev
   //安装html打包插件
   $ yarn add gulp-imagemin --dev 
   //安装图片打包插件(安装不成功可以使用cnpm或者npm安装)
   $ yarn add del --dev
   //安装del删除插件
   $ yarn add gulp-load-plugins --dev
   //安装自动载入gulp插件的插件，load-plugins这个插件会自动载入gulp的插件，例如：gulp-babel被载入后，可以用plugins.babel去调用它，gulp-imagemin-gifsicle的插件被载入后，可以用plugins.imageminGifsicle去调用它(驼峰法则)
   $ yarn add browser-sync --dev
   //安装服务插件
   $ yarn add jquery
   //安装jquery
   $ yarn add bootstrap
   //安装bootstrap
   $ yarn add gulp-useref --dev
   //对html页面中的js，css的引用进行合并
   $ yarn add gulp-htmlmin gulp-uglify gulp-clean-css --dev
   //安装压缩html、js、css的插件
   $ yarn add gulp-if --dev
   //A ternary gulp plugin: conditionally control the flow of vinyl objects.
   ````

   ````javascript
   //gulpfile.js
   const { src, dest, parallel, series, watch } = require('gulp')  
   //src为文件读取，dest为文件写入，parallel是并行任务,series是串行任务
   
   const del = require('del')  //删除文件模块
   const browserSync = require('browser-sync') //服务插件
   
   const loadPlugins = require('gulp-load-plugins')  //自动载入gulp插件的插件
   
   const plugins = loadPlugins()    //执行插件,会自动载入gulp插件
   const bs = browserSync.create()  //自动创建一个browserSync的开发服务器
   
   //下面的gulp插件都会被loadPlugins自动载入，例如：gulp-babel被载入后，可以用plugins.babel去调用它，gulp-imagemin-gifsicle的插件被载入后，可以用plugins.imageminGifsicle去调用它(驼峰法则)
   // const sass = require('gulp-sass')  //scss转css插件
   // const babel = require('gulp-babel') //ES转换插件
   // const swig = require('gulp-swig') //html插件
   // const imagemin = require('gulp-imagemin') //图片压缩插件
   
   const data = {
       menus: [
         {
           name: 'Home',
           icon: 'aperture',
           link: 'index.html'
         },
         {
           name: 'Features',
           link: 'features.html'
         },
         {
           name: 'About',
           link: 'about.html'
         },
         {
           name: 'Contact',
           link: '#',
           children: [
             {
               name: 'Twitter',
               link: 'https://twitter.com/w_zce'
             },
             {
               name: 'About',
               link: 'https://weibo.com/zceme'
             },
             {
               name: 'divider'
             },
             {
               name: 'About',
               link: 'https://github.com/zce'
             }
           ]
         }
       ],
       pkg: require('./package.json'),
       date: new Date()
   }
   
   //删除dist文件夹
   const clean = () => {
       return del(['dist','temp'])
   }
   
   //打包样式
   const style = () => {
       return src('src/assets/styles/*.scss',{ base : 'src'}) 
       	//设置base属性，复制到dist文件夹中的scss文件会保持在src中的目录结构
       	.pipe(plugins.sass({ outputStyle : 'expanded'}))
       	//outputStyle : 'expanded' 为css样式大括号完全展开，结尾大括号单独占一行
       	//sass插件默认下划线开头的scss文件为依赖文件，不会编译打包
           .pipe(dest('temp'))
           //指定输出到dist文件夹
           .pipe(bs.reload({ stream: true}))
           //重新以流的形式推送到浏览器
   }
   
   //打包js
   const script = () => {
       return src('src/assets/scripts/*.js',{ base : 'src'})
       	//设置base属性，复制到dist文件夹中的js文件会保持在src中的目录结构
           .pipe(plugins.babel({ presets : ['@babel/preset-env'] }))
       	//如果不指定@babel/preset-env，ES转换不会有效，因为babel只是一个平台
           .pipe(dest('temp'))
           //指定输出到dist文件夹
           .pipe(bs.reload({ stream: true}))
           //重新以流的形式推送到浏览器
   }
   
   //打包html
   const page = () => {
       return src('src/*.html',{ base : 'src'})
       	//设置base属性，复制到dist文件夹中的html文件会保持在src中的目录结构
           .pipe(plugins.swig({data,defaults: { cache: false }}))   // 防止模板缓存导致页面不能及时更新
       	//data是data:data的简写
           .pipe(dest('temp'))
           //指定输出到dist文件夹
           .pipe(bs.reload({ stream: true}))
           //重新以流的形式推送到浏览器
   }
   
   //打包图片
   const image = () => {
       return src('src/assets/images/**',{ base : 'src'})
       	//** 表示images文件夹及子文件夹下所有文件
           .pipe(plugins.imagemin()) 
           .pipe(dest('dist'))
   }
   
   //打包font
   const font = () => {
       return src('src/assets/fonts/**',{ base : 'src'})
       	//** 表示font文件夹及子文件夹下所有文件
           .pipe(plugins.imagemin()) 
           .pipe(dest('dist'))
   }
   
   //打包public静态文件
   const extra = () => {
       return src('public/**',{ base : 'public'})
           //把pulic中的文件打包到dist/public下面
           .pipe(dest('dist/public'))
   }
   
   const serve = () => {
       watch('src/assets/styles/*.scss',style)   //监视scss文件，当文件有改动后，执行style任务
       watch('src/assets/scripts/*.js',script)   //监视js文件，当文件有改动后，执行script任务
       watch('src/*.html',page)                  //监视html文件，当文件有改动后，执行page任务
   
       // 开发阶段我们不用去构建image,fonts,public，可以直接读取src中的文件，减少一次构建
       // watch('src/assets/images/**',image)       //监视图片文件，当文件有改动后，执行image任务
       // watch('src/assets/fonts/**',style)        //监视fonts下的文件，当文件有改动后，执行font任务
       // watch('public/**',extra)                  //监视public下的文件，当文件有改动后，执行extra任务
       watch([
           'src/assets/images/**',
           'src/assets/fonts/**',
           'public/**'
       ], bs.reload)
   
       bs.init({
           notify: false,   //取消页面右上角browser-sync启动时是否连接上的提示
           port: 2080,      //自定义端口
           // open: false,     //是否服务启动时自动打开浏览器
           // files: 'dist/**',    //修改dist下面文件修改后被实时监听会页面会实时更新（这个可以和pipe(bs.reload({ stream: true}))二选一）
           server: {
               baseDir: ['temp','src','public'],   //先从dist文件夹找，没有的话依次向后面找
               routes: {
                   '/node_modules': 'node_modules'
               }
           }
       })
   }
   
   const useref = () => {
       return src('temp/*.html', {base : 'temp'})
           .pipe(plugins.useref({searchPath: ['temp', '.']}))
           //html、js、css的压缩
           .pipe(plugins.if(/\.js$/, plugins.uglify()))
           .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
           .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
               collapseWhitespace: true,
               minifyCSS: true,   //行内css、style标签内css压缩
               minifyJS: true     // 行内js压缩
           })))
           //htmlmin()只会去掉单词之间的空格，设置collapseWhitespace为true才能去掉所有的空格和换行符
           .pipe(dest('dist'))  //临时目录temp，避免一边读取流，一边写入流
   }
   
   const compile = parallel(style, script, page)
   //并行执行style, script, page的组合任务
   
   const build = series(
       clean, 
       parallel(
           series(compile, useref), 
           image, 
           font, 
           extra
           )   
       )
   //上线之前打包使用
   
   const develop = series(compile, serve)
   //开发环境使用
   
   module.exports = {
       clean,
       build,
       develop
   }
   ````

   ````
   $ yarn gulp style     //把src中的scss文件（非下划线开头的文件名）打包到dist文件夹
   $ yarn gulp script    //把src中的js文件打包到dist文件夹
   $ yarn gulp page      //把src中的html文件打包到dist文件夹
   $ yarn gulp compile   //并行执行style, script, page的组合任务
   
   $ yarn gulp clean   //删除dist、temp文件夹
   $ yarn gulp develop //开发环境使用
   $ yarn gulp build   //生产环境上线使用
   ````


