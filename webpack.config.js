const path = require('path');

const fileName = 'keen-tracking';

module.exports = {
  entry: ['./lib/browser.js',
  ],

  target: process.env.TARGET ? `${process.env.TARGET}` : 'web',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${
      process.env.TARGET ? `${process.env.TARGET}/` : ''
    }${
      fileName
    }${
      process.env.OPTIMIZE_MINIMIZE ? '.min' : ''
    }.js`,
    library: `${!process.env.LIBRARY ? '' : process.env.LIBRARY}`,
    libraryTarget: 'umd',
  },

  module: {

    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'lib'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loader: 'babel-loader',
      },

      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],

  },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
  },

  optimization: {
    minimize: !!process.env.OPTIMIZE_MINIMIZE,
  },

  devtool: 'source-map',

  context: __dirname,

  // stats: 'verbose',

  plugins: [],

  mode: !process.env.ENV ? 'development' : process.env.ENV,

  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    open: true,
    inline: true,
    hot: false,
    watchContentBase: true,
  },

  externals: process.env.TARGET === 'node' ? {
    'component-emitter' : 'component-emitter',
    'js-cookie' : 'js-cookie',
    'keen-core' : 'keen-core',
  } : {
  },

};
