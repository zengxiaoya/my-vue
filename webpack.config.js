const { resolve } = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: resolve(__dirname, './src/index.js'),
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] // 后缀名自动补全
    },
    output: {
        path: resolve(__dirname, '/example/'),
        filename: '[name][contenthash:7].bundle.js'
    },
    target: ['web', 'es5'],
    devtool: 'source-map',
    module: {
        rules: [
            {
                /**
                 *  babel-loader只能处理普通的编译 对于复杂的编译的babel需要借助其他插件
                 * 1.基础的js兼容性问题处理--> @babel/preset-export
                 * 问题：只能转换基本语法，如promise不能转
                 * 2.全部的js兼容性处理-->@babel/polyfill
                 * 问题： 我只要解决部分的兼容性问题，但是会解决所有问题，体积太大了～
                 * 3.需要做兼容处理的就做：按需加载 --corejs
                 */
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'entry',
                        corejs: {
                          version: 3
                        },
                        targets: {
                          chrome: '60',
                          firefox: '60',
                          ie: '9',
                          safari: '10',
                          edge: '17'
                        }
                      }
        
                    ]
                  ],
                  plugins: [
                    [
                      "@babel/plugin-proposal-decorators",
                      {
                        "legacy": true
                      }
                    ]
                  ],
                  // 开启babel缓存，第二次构建时会读取缓存，编译速度会更快
                  cacheDirectory: true
                }
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: resolve(__dirname, './public/index.html'),
            filename: 'index.html'
        }),
    ],
    devServer: {
        contentBase: resolve(__dirname, './public'), // 资源路径地址
        open: true, // 自动打开默认浏览器
        port: 8080, // 端口号
        hot: true, // 开启MHMR热模块替换
        inline: true
    }
}