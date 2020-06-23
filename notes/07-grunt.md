### grunt的基本使用
1. $ yarn init --yes     //创建package.json文件
2. $ yarn add grunt --dev     //新增grunt模块
3. $ code gruntfile.js   //创建Grunt的入口文件
### gruntfile.js的作用
- Grunt 的入口文件
- 用于定义一些需要 Grunt 自动执行的任务
- 需要导出一个函数
- 此函数接收一个 Grunt 的形参，内部提供一些创建任务是可以用到的 API
### 注册任务的用法
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('foo',() => {
        console.log('hello grunt~')
    })
}
````
> 注册一个foo的任务，使用 yarn grunt foo 执行这个任务，会打印 hello grunt~

````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('foo',() => {
        console.log('hello grunt~')
    })
    grunt.registerTask('default',() => {
        console.log('default task~')
    })
}
````
> 注册默认default的任务，使用 yarn grunt default 或者 yarn grunt 执行默认任务，会打印 default task~
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('foo',() => {
        console.log('hello grunt~')
    })
    grunt.registerTask('bar','任务描述',() => {
        console.log('other task~')
    })
    grunt.registerTask('default',['foo','bar'])
}
````
> 注册默认default的任务，使用 yarn grunt default 或者 yarn grunt 执行默认任务，会依次执行foo和bar任务
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('async-task',() => {
        setTimeout(() => {
            console.log('async task working~')
        },1000)
    })
}
````
> grunt默认是同步任务,不会执行async-task中的延时器
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('async-task',function(){
        const done = this.async();
        setTimeout(() => {
            console.log('async task working~')
            done()
        },1000)
    })
}
````
> 要调用异步任务要使用上述方法，**但是不能使用箭头函数，因为要用this**，这样就会执行异步任务延时器了
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('bad',() => {
        console.log('bad working~')
        return false
    })
}
````
> 如果要标记一个失败的任务，return false就行了
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('bad',() => {
        console.log('bad working~')
        return false
    })
    grunt.registerTask('foo',() => {
        console.log('hello grunt~')
    })
    grunt.registerTask('bar','任务描述',() => {
        console.log('other task~')
    })
    grunt.registerTask('default',['foo','bad','bar'])
}
````
> 执行默认任务，会执行foo任务，bad任务会失败，不会执行bar任务，如果要继续执行bar任务，yarn grunt --force，在grunt 后面加上--force就可以了
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.registerTask('async-task',function(){
        const done = this.async();
        setTimeout(() => {
            console.log('async task working~')
            done(false)
        },1000)
    })
}
````
> 标记异步任务中的失败任务，done(false)就行了
### Grunt 的配置方法
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        foo:'bar'
    })

    grunt.registerTask('foo',() => {
        console.log(grunt.config('foo'))
    })
}
//bar
````
> 执行 yarn grunt foo ,会打印bar 
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        foo:{
            bar:123
        }
    })

    grunt.registerTask('foo',() => {
        console.log(grunt.config('foo.bar'))
    })
}
//123
````
> 执行 yarn grunt foo ,会打印123
### Grunt 多任务目标
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        build:{
            css:1,
            js:2
        }
    })

    //多目标模式，可以让任务根据配置形成多个子任务
    grunt.registerMultiTask('build',function(){
        console.log(`target: ${this.target}, data: ${this.data}`)
    })
}
//target: css, data: 1
//target: js, data: 2
````
> 会依次执行build中的css、js任务
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        options: {
            foo:'bar'
        },
        build:{
            css:1,
            js:2
        }
    })

    //多目标模式，可以让任务根据配置形成多个子任务
    grunt.registerMultiTask('build',function(){
        console.log(this.options())
        console.log(`target: ${this.target}, data: ${this.data}`)
    })
}
//{ foo: 'bar' }
//target: css, data: 1
//{ foo: 'bar' }
//target: js, data: 2
````
> options 为配置项，可以通过this.options拿到
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        options: {
            foo:'bar'
        },
        build:{
            css:{
                options: {
                    foo: 'baz'
                }
            }，
            js:2
        }
    })

    //多目标模式，可以让任务根据配置形成多个子任务
    grunt.registerMultiTask('build',function(){
        console.log(this.options())
        console.log(`target: ${this.target}, data: ${this.data}`)
    })
}
//{ foo: 'baz' }
//target: css, data: [object Object]
//{ foo: 'bar' }
//target: js, data: 2
````
> 执行build任务后，css中的options会覆盖任务中的options
### Grunt 插件的使用
#### grunt-contrib-clean插件的使用（清除插件）
1. $ yarn add grunt-contrib-clean --dev
2. 配置 gruntfile.js
````javascript
//gruntfile.js
module.exports = grunt => {
    grunt.initConfig({
        clean: {
            temp: 'temp/index.js'  //指定目标，删除index,js
            //temp: 'temp/*.js'      //删除temp所有的js文件
            //temp: 'temp/**'        //删除temp文件夹及该文件夹下的所有文件
        }
    })
    grunt.loadNpmTasks('grunt-contrib-clean')
}
````
> 通过loadNpmTasks方法载入插件
>
> 3. $ yarn grunt clean  
#### grunt-sass插件的使用（sass转css插件）
1. $ yarn add grunt-sass sass --dev
2. 配置 gruntfile.js
````javascript
//gruntfile.js
const sass = require('sass')
module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-sass')
}
````
> 通过loadNpmTasks方法载入插件
3. $ yarn grunt sass
> 会把src/scss/main.scss转出成dist/css/main.css

### Grunt 中的3个插件
1. yarn add grunt-babel @babel/core @babel/preset-env --dev
//ES 新特性的转换
2. yarn add load-grunt-tasks --dev  
//自动加载所有的grunt插件
3. yarn add grunt-contrib-watch --dev
//实时监控插件
4. 配置 gruntfile.js
````javascript
//gruntfile.js
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        watch: {
            js: {
                files: ['src/js/*.js'],
                tasks: ['babel']   //文件变化后执行babel任务
            },
            css: {
                files: ['src/scss/*scss'],
                tasks: ['sass']
            }
        }
    })
    // grunt.loadNpmTasks('grunt-sass')
    loadGruntTasks(grunt)   //自动加载所有的grunt插件

    grunt.registerTask('default',['sass','babel','watch'])
    //先执行一下sass和babel任务，在执行watch监听，因为直接执行监听它不会执行sass和babel任务，只有在文件改变时才执行
}
````
> 执行 yarn grunt ，就可以实时监听js和scss文件了