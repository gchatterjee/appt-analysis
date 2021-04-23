import React from 'react'
import PropTypes from 'prop-types'

export default class HistogramChartArea extends React.PureComponent {
  render() {
    const { data } = this.props
    /* eslint-disable react/no-array-index-key */
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', width: '100vh' }}>
        {data.map((bar, i) => (
          <div
            key={`bar-${i}`}
            style={{
              backgroundColor: 'yellow',
              height: `${10 * bar}px`,
              width: `${100 / data.length}vh`,
            }}
          />
        ))}
      </div>
    )
    /* eslint-enable react/no-array-index-key */
  }
}

HistogramChartArea.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
}
