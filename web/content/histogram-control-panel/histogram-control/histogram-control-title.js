import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash.kebabcase'

export default class HistogramControlTitle extends React.PureComponent {
  render() {
    const { name } = this.props
    return <div id={`histogram-control-title-${kebabCase(name)}`}>{name}</div>
  }
}

HistogramControlTitle.propTypes = { name: PropTypes.string.isRequired }
