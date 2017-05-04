'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
//const webpack = require('webpack');

module.exports = {
    entry: "./app/initGame",
    output: {
        filename: "./build.js",
        library: "MinesweeperGame"
    },
    
    watch: NODE_ENV == 'development',
    devtool: NODE_ENV == 'development' ? "eval" : null,
    
    //plugins: [
    //    new webpack.DefinePlugin({
    //        NODE_ENV: JSON.stringify(NODE_ENV),
    //        LANG: JSON.stringify('ru')
    //    })
    //],
    
    //module: {
    //    rules: [{
    //        test: /\.js$/,
    //        use: {
    //            loader: "babel-loader",
    //            options: {
    //                presets: ['es2015'],
    //                plugins: ['transform-runtime']
    //            }
    //        }
    //    }]
    //}
}