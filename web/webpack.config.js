const path = require('path')

module.exports = (_, argv) => {
  const { mode } = argv
  return {
    context: path.resolve(__dirname),
    entry: './index.js',
    mode,
    output: { filename: 'index.js', path: `${__dirname}/docs` },
    devtool: mode === 'development' ? 'eval' : 'none',
  }
}
