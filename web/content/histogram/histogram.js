import React from 'react'
import PropTypes from 'prop-types'

import HistogramChart from './histogram-chart'
import HistogramXAxis from './histogram-x-axis'
import HistogramYAxis from './histogram-y-axis'

export default class Histogram extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data, xLabels, xTitle, yTitle } = this.props

    return (
      <>
        <div className='histogram-grid-column'>
          <div className='histogram-grid-cell'>
            <HistogramYAxis max={Math.max(data)} yTitle={yTitle} />
          </div>
          <div className='histogram-grid-cell histogram-empty-cell' />
        </div>
        <div className='histogram-grid-column'>
          <div className='histogram-grid-cell'>
            <HistogramChart data={data} />
          </div>
          <div className='histogram-grid-cell'>
            <HistogramXAxis
              xLabels={data.map(
                (_, i) => xLabels && i < xLabels.length && xLabels[i]
              )}
              xTitle={xTitle}
            />
          </div>
        </div>
      </>
    )
  }
}

Histogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  xLabels: PropTypes.arrayOf(PropTypes.string),
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
}
