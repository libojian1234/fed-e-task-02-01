// 实现这个项目的构建任务

const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
const lrSnippet = require('connect-livereload')({
  port: 35729
});
const serveStatic = require('serve-static'); //加载serve-static模块,设置静态文件服务器的路径
const serveIndex = require('serve-index'); //加载serve-index模块,启用目录浏览

const data = {
  menus: [{
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
      children: [{
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

module.exports = grunt => {
  grunt.initConfig({
    // copy: {
    //   main: {
    //     expand: true,
    //     cwd: 'src',
    //     src: '**',
    //     dest: 'dist/',
    //   }
    // },
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      main: {
        files: [{
          expand: true,
          src: ['src/**/*.scss'],
          dest: 'dist',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      main: {
        options: {
          mangle: false
        },
        expand: true,
        cwd: 'dist',
        src: '**/*.css',
        dest: 'dist'
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'dist'
        }]
      }
    },
    uglify: {
      options: {
        mangle: true, //混淆变量名
        comments: 'false' //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
      },
      main: {
        files: [{
          expand: true,
          cwd: 'dist/', //js目录下
          src: ['**/*.js'], //所有js文件
          dest: 'dist/' //输出到此目录下
        }]
      }
    },
    htmlmin: { //压缩html
      main: {
        options: { // Target options
          removeComments: true, // 去除注释信息 
          collapseWhitespace: true, // 去除空白字符  
          removeEmptyAttributes: true, // 去除标签的空属性
          removeCommentsFromCDATA: true, // 去除 CDATA 的注释信息
          removeRedundantAttributes: true, // 去除标签的冗余属性
          minifyCSS: true, //行内css、style标签内css压缩
          minifyJS: true // 行内js压缩
        },
        files: [{
          expand: true, // Enable dynamic expansion.
          cwd: 'dist/',
          src: ['**/*.html'], // Actual pattern(s) to match.
          dest: 'dist', // Destination path prefix.
        }]
      }
    },
    web_swig: {
      options: {
        swigOptions: {
          cache: false
        },
        getData: function(tpl) {
          return {
            data: data
          };
        }
      },
      main: {
        // Target-specific file lists and/or options go here.
        files: [{
          expand: true,
          cwd: 'src/', //js目录下
          src: ['**/*.html'], //所有js文件
          dest: 'dist/' //输出到此目录下
        }]
      },
    },
    useref: {
      main: {
        // specify which files contain the build blocks
        html: 'dist/**/*',
        // explicitly specify the temp directory you are working in
        // this is the the base of your links ( "/" )
        temp: 'dist'
      }
    },
    watch: {
      //   options: {
      //     livereload: true
      //   },

      js: {
        cwd: {
          files: '/node_modules',
          spawn: 'node_modules'
        },
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel'] //文件变化后执行babel任务
      },
      css: {
        files: ['src/assetes/styles/*.scss'],
        tasks: ['sass']
      },
      html: {
        files: ['src/**/*.html'],
        task: ['web_swig']
      }
    },
    connect: {
      dist: {
        options: {
          port: 9001,
          base: ['dist', 'public'],
          open: true,
          middleware: function(connect) {
            return [
              // 把脚本，注入到静态文件中
              lrSnippet,
              // 静态文件服务器的路径
              serveStatic('dist'),
              // 启用目录浏览(相当于IIS中的目录浏览)
              serveIndex('dist')
            ];

          }
        }
      }
    },
    clean: {
      temp: 'dist/**' //删除temp文件夹及该文件夹下的所有文件
    }
  })

  loadGruntTasks(grunt) //自动加载所有的grunt插件

  grunt.registerTask('build', ['clean', 'copy', 'babel', 'sass', 'web_swig', 'useref']);

  grunt.registerTask('dev', ['clean', 'sass', 'babel', 'web_swig', 'connect', 'watch'])
  //先执行一下sass和babel任务，在执行watch监听，因为直接执行监听它不会执行sass和babel任务，只有在文件改变时才执行
}
