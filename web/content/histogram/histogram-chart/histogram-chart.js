import React from 'react'
import PropTypes from 'prop-types'

import HistogramChartArea from './histogram-chart-area'

export default class HistogramChart extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <>
        <HistogramChartArea data={data} />
      </>
    )
  }
}

HistogramChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  xLabels: PropTypes.arrayOf(PropTypes.string),
  xTitle: PropTypes.string,
  yLabels: PropTypes.arrayOf(PropTypes.string),
  yTitle: PropTypes.string,
}
