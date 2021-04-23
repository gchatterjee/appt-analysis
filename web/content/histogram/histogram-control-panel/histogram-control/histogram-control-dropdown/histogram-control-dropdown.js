import React from 'react'
import PropTypes from 'prop-types'
import kebabCase from 'lodash.kebabcase'

export default class HistogramControlDropdown extends React.PureComponent {
  render() {
    const { name, action, labels } = this.props
    return (
      <select onChange={(event) => action(event.target.value)}>
        {labels.map((label) => (
          <option
            key={kebabCase(label)}
            className='histogram-control-option'
            id={`histogram-control-option-${kebabCase(name)}-${kebabCase(
              label
            )}`}
          >
            {label}
          </option>
        ))}
      </select>
    )
  }
}

HistogramControlDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
}
