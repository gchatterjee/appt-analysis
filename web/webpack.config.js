const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (_, argv) => {
  const { mode } = argv
  return {
    context: path.resolve(__dirname),
    entry: './index.js',
    mode,
    output: { filename: 'index.js' },
    devtool: mode === 'development' && 'eval',
    plugins: [new HtmlWebpackPlugin({
      title: 'Massachusetts COVID-19 Vaccine Appointment Analysis',
      template: 'index.html'
    })],
  }
}
