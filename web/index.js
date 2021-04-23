import React from 'react'
import ReactDOM from 'react-dom'

import Histogram from './content/histogram/histogram'

import data from './data/analysis.json'

class App extends React.PureComponent {
  render() {
    return <Histogram data={data.histograms.last_1_days} />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
