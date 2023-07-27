const path = require('path');

module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'tlfb-v3-bundle.js',
    path: path.resolve(__dirname, 'static'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname)
    }
  },
  performance: {
    hints: false // No warning for large bundle size
  }
};