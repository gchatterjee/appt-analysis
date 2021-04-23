import React from 'react'
import PropTypes from 'prop-types'

export default class HistogramXAxis extends React.PureComponent {
  render() {
    const { xTitle, xLabels } = this.props
    return (
      <>
        <div>{xLabels}</div>
        {xTitle && <div>{xTitle}</div>}
      </>
    )
  }
}

HistogramXAxis.propTypes = {
  xTitle: PropTypes.string,
  xLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
}
