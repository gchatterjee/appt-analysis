import React from 'react'
import PropTypes from 'prop-types'

import HistogramControl from './histogram-control/histogram-control'

export default class HistogramControlPanel extends React.PureComponent {
  render() {
    const { controls, setGranularity, setDataWindow } = this.props

    return (
      <>
        {controls.map(({ name, action, labels }) => (
          <HistogramControl
            key={name}
            name={name}
            action={async (option) => {
              const { granularity, dataWindow } = await action(option)
              if (granularity !== undefined) setGranularity(granularity)
              if (dataWindow !== undefined) setDataWindow(granularity)
            }}
            labels={labels}
          />
        ))}
      </>
    )
  }
}

HistogramControlPanel.propTypes = {
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      action: PropTypes.func.isRequired,
    })
  ).isRequired,
  setGranularity: PropTypes.func.isRequired,
  setDataWindow: PropTypes.func.isRequired,
}
