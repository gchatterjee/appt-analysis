import React from 'react'
import PropTypes from 'prop-types'
import HistogramControlTitle from './histogram-control-title'
import HistogramControlDropdown from './histogram-control-dropdown/histogram-control-dropdown'

export default class HistogramControl extends React.PureComponent {
  render() {
    const { name, labels, action } = this.props

    return (
      <>
        <HistogramControlTitle name={name} />
        <HistogramControlDropdown name={name} labels={labels} action={action} />
      </>
    )
  }
}

HistogramControl.propTypes = {
  name: PropTypes.string,
  action: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
}
