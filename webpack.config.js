var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

var env = process.env.WEBPACK_ENV;
var outputFile;

var config = {
    entry: (env !== 'build'?[
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:3000',
        './app/index.js' //入口文件
    ]:[
        './app/index.js'
    ]),
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定编译后的代码位置
        filename: (env === 'build'?"bundle.[hash:6].js":"bundle.js"),
    },
    devtool: (env !== 'build'?'source-map':null),
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }
            },
            //   {
            //     test: /\.less$/,
            //     loaders: ['style', 'css', 'less'],
            //     include: path.resolve(__dirname, 'app')
            //   }
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'app/index.ejs'),
            inject: 'body',
            // hash:true
        }),
        // new webpack.optimize.CommonsChunkPlugin("commons", "commons.js"),
        new ExtractTextPlugin(env === 'build'?"style.[hash:6].css":"style.css", {
            allChunks: true
        }),
        new CleanWebpackPlugin(['dist'], {
          root: __dirname,
          verbose: true,
          dry: false
        })
    ]
}

if (env === 'build') {
    var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
    config.plugins.concat([
        new UglifyJsPlugin({
            minimize: true,
            compress: {
                dead_code:false
            }
        })
    ]);
}

module.exports = config;
