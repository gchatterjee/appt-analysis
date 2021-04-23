import React from 'react'
import PropTypes from 'prop-types'

export default class HistogramXAxis extends React.PureComponent {
  render() {
    const { yTitle } = this.props
    return <>{yTitle && <div>{yTitle}</div>}</>
  }
}

HistogramXAxis.propTypes = { yTitle: PropTypes.string }
