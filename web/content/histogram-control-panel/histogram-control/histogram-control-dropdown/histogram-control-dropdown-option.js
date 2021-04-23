import React from 'react'
import PropTypes from 'prop-types'
import kebabCase from 'lodash.kebabcase'

export default class HistogramControlDropdownOptions extends React.PureComponent {
  render() {
    const { name, label } = this.props
    return (
      <option
        key={kebabCase(label)}
        className='histogram-control-option'
        id={`histogram-control-option-${kebabCase(name)}-${kebabCase(label)}`}
      >
        {label}
      </option>
    )
  }
}

HistogramControlDropdownOptions.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
