import React from 'react'
import PropTypes from 'prop-types'

export default class HistogramChart extends React.PureComponent {
  render() {
    const { data } = this.props

    const maxBar = Math.max(...data)

    console.log(data.length)
    console.log(maxBar)

    /* eslint-disable react/no-array-index-key */
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {data.map((bar, i) => (
          <div
            className='histogram-chart-bar'
            key={`bar-${i}`}
            style={{
              height: `${(100 * bar) / maxBar}px`,
              width: `${100 / data.length}%`,
            }}
          />
        ))}
      </div>
    )
    /* eslint-enable react/no-array-index-key */
  }
}

HistogramChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
}
