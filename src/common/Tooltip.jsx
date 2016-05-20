'use strict';

const React = require('react');

module.exports = React.createClass({

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    child: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.element,
    ]),
    show: React.PropTypes.bool,
    tooltipStyles: React.PropTypes.object
  },

  render() {
    const props = this.props;
    const display = this.props.show ? 'inherit' : 'none';
    const containerStyles = {
      position: 'fixed',
      top: props.y,
      left: props.x,
      display
    };

    // TODO: add 'right: 0px' style when tooltip is off the chart
    const defaultTooltipStyles = {
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid',
      borderColor: '#ddd',
      borderRadius: '2px',
      padding: '10px',
      marginLeft: '10px',
      marginRight: '10px',
      marginTop: '-15px',
    };

    const tooltipStyles = (props.tooltipStyles !== undefined) ? props.tooltipStyles : defaultTooltipStyles;

    return (
      <div style={containerStyles}>
        <div style={tooltipStyles}>
          {props.child}
        </div>
      </div>
    );
  },
});
