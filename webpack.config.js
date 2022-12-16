const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  };

  if (isProd) {
    config.minimizer = [new OptimizeCssPlugin(), new TerserPlugin()];
  }

  return config;
};

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, 'css-loader'];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelLoaders = (presets) => {
  const isPresetsExist = typeof presets !== 'undefined';

  return isPresetsExist
    ? {
        loader: 'babel-loader',
        options: {
          presets,
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    : {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      };
};

const fileName = (extension, path) => {
  return isDev ? `${path}[name].${extension}` : `${path}[name].[hash].${extension}`;
};

const dirName = (pathToFile) => {
  return path.resolve(__dirname, pathToFile);
};

module.exports = {
  target: 'web',
  context: dirName('src/'),
  mode: 'development',

  entry: {
    main: ['@babel/polyfill', './index']
  },

  output: {
    filename: fileName('js', 'scripts/'),
    path: dirName('dist'),
    clean: true
  },

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': dirName('src')
    }
  },

  optimization: optimization(),

  devtool: isDev ? 'source-map' : false,

  devServer: {
    static: {
      directory: path.join(__dirname, './'),
      serveIndex: true
    },
    open: true,
    hot: isDev
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: '../index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),

    new VueLoaderPlugin(),

    new ESLintPlugin(),

    new CopyPlugin({
      patterns: [
        {
          from: dirName('src/assets/favicon.ico'),
          to: dirName('dist')
        }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: fileName('css', 'styles/')
    }),

    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true
    })
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: babelLoaders()
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|webp2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext]'
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  }
};
