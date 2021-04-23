import React from 'react'
import PropTypes from 'prop-types'

import HistogramControlPanel from './histogram-control-panel/histogram-control-panel'
import HistogramChart from './histogram-chart/histogram-chart'

export default class Histogram extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      data,
      controls,
      transformData,
      xLabels,
      generateXLabels,
      xTitle,
      generateXTitle,
      yLabels,
      generateYLabels,
      yTitle,
      generateYTitle,
    } = this.props
    const { granularity, dataWindow } = this.state
    const chartData = transformData
      ? transformData(data, { granularity, dataWindow })
      : data

    const chartXTitle =
      xTitle || (generateXTitle && generateXTitle({ granularity, dataWindow }))
    const chartYTitle =
      yTitle || (generateYTitle && generateYTitle({ granularity, dataWindow }))
    const chartXLabels =
      xLabels ||
      (generateXLabels && generateXLabels({ granularity, dataWindow }))
    const chartYLabels =
      yLabels ||
      (generateYLabels && generateYLabels({ granularity, dataWindow }))

    return (
      <>
        {controls && (
          <HistogramControlPanel
            controls={controls.map((control) => ({
              ...control,
              action: async () => {
                this.setState(await control.action())
              },
            }))}
          />
        )}

        <HistogramChart
          data={chartData}
          xTitle={chartXTitle}
          yTitle={chartYTitle}
          xLabels={chartXLabels}
          yLabels={chartYLabels}
        />
      </>
    )
  }
}

Histogram.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]).isRequired,
  controls: PropTypes.arrayOf(PropTypes.func),
  transformData: PropTypes.func,
  xLabels: PropTypes.arrayOf(PropTypes.string),
  generateXLabels: PropTypes.func,
  xTitle: PropTypes.string,
  generateXTitle: PropTypes.func,
  yLabels: PropTypes.arrayOf(PropTypes.string),
  generateYLabels: PropTypes.func,
  yTitle: PropTypes.string,
  generateYTitle: PropTypes.func,
}
