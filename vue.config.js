const fs = require('fs')
const path = require('path')
const spritesmithPlugin = require('webpack-spritesmith')
const terserPlugin = require('terser-webpack-plugin')
const cdnDependencies = require('./dependencies.cdn')
const AliOSSPlugin = require('webpack-alioss-plugin')
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)

console.log('is_prod', IS_PROD)
//console.log('vue_app_env', VUE_APP_ENV)

const spritesmithTasks = []
fs.readdirSync('src/assets/sprites').map(dirname => {
  if (fs.statSync(`src/assets/sprites/${dirname}`).isDirectory()) {
    spritesmithTasks.push(
      new spritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, `src/assets/sprites/${dirname}`),
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, `src/assets/sprites/${dirname}.[hash].png`),
          css: [
            [path.resolve(__dirname, `src/assets/sprites/_${dirname}.scss`), {
              format: 'handlebars_based_template',
              spritesheetName: dirname
            }]
          ]
        },
        customTemplates: {
          'handlebars_based_template': path.resolve(__dirname, 'scss.template.hbs')
        },
        // 样式文件中调用雪碧图地址写法
        apiOptions: {
          cssImageRef: `~${dirname}.[hash].png`
        },
        spritesmithOptions: {
          algorithm: 'binary-tree',
          padding: 10
        }
      })
    )
  }
})

// CDN 相关
const isCDN = process.env.VUE_APP_CDN == 'ON'
const externals = {}
cdnDependencies.forEach(pkg => {
  externals[pkg.name] = pkg.library
})
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e)
}

module.exports = {
  publicPath: '',
  productionSourceMap: false,
  devServer: {
    port: 9020,
    open: false,
    overlay: {
      warnings: true,
      errors: false
    }
  },
  configureWebpack: config => {
    config.resolve.modules = ['node_modules', 'assets/sprites']
    config.plugins.push(...spritesmithTasks)
    if (isCDN) {
      config.externals = externals
    }

    config.optimization = {
      minimizer: [
        new terserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      fix: true,
    }
  },
  chainWebpack: config => {
    // config.plugin('stylelint').use('stylelint-webpack-plugin')
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    // if (IS_PROD && process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID) {
    //   config.plugin('alioss').use(AliOSSPlugin, [
    //     {
    //       ossBaseDir: '/digitalcnzz/pretest/',
    //       project: 'digitalcnzz-xxxx-web', // 发布前把xxxx换成当前项目的名称
    //       retry: 0,
    //       gzip: true,
    //       exclude: /.*\.$/,
    //       removeMode: false
    //     }
    //   ])
    // }
    oneOfsMap.forEach(item => {
      item.use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: [
            './src/assets/styles/resources/*.scss',
            './src/assets/sprites/*.scss'
          ]
        })
        .end()
    })
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.plugin('html')
      .tap(args => {
        args[0].title = process.env.VUE_APP_TITLE;
        if (isCDN) {
          args[0].cdn = cdn;
        }
        return args;
      })
  }
}
