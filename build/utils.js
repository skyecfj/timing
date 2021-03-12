'use strict';
const path = require('path');

// 配置文件
const config = require('../config');

// 提取css的插件pack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageConfig = require('../package.json');

exports.assetsPath = function (_path) {
  const assetsSubDirectory = (process.env.NODE_ENV === 'production'||process.env.NODE_ENV === 'pro')
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  //  path.posix.join与path.join一样，不过总是以 posix 兼容的方式交互
  return path.posix.join(assetsSubDirectory, _path);
};


exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: { // options是loader的选项配置
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };



  function generateLoaders (loader, loaderOptions) { // 生成loader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) { // 如果参数loader存在
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, { // 将loaderOptions和sourceMap组成一个对象
          sourceMap: options.sourceMap
        })
      });
    }


    if (options.extract) {  // 如果传入的options存在extract且为true
      return ExtractTextPlugin.extract({  // ExtractTextPlugin分离js中引入的css文件
        use: loaders, // 处理的loader
        fallback: 'vue-style-loader' // 没有被提取分离时使用的loader
      });
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }


  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

exports.styleLoaders = function (options) {
  const output = []; // 定义返回的数组，数组中保存的是针对各类型的样式文件的处理方式
  const loaders = exports.cssLoaders(options); // 调用cssLoaders方法返回各类型的样式对象(css: loader)

  for (const extension in loaders) { // 循环遍历loaders
    const loader = loaders[extension]; // 根据遍历获得的key(extension)来得到value(loader)
    output.push({
      test: new RegExp('\\.' + extension + '$'), // 处理的文件类型
      use: loader  // 用loader来处理，loader来自loaders[extension]
    });
  }

  return output;
};
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};
