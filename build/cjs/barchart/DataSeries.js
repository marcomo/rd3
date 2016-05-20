'use strict';

var React = require('react');
var BarContainer = require('./BarContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data: React.PropTypes.array,
    series: React.PropTypes.array,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    valuesAccessor: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
    hoverAnimation: React.PropTypes.any, // TODO: prop types?
    xScale: React.PropTypes.any,
    yScale: React.PropTypes.any
  },

  _renderBarSeries: function _renderBarSeries() {
    var _this = this;

    var _props = this.props;
    var _data = _props._data;
    var valuesAccessor = _props.valuesAccessor;

    return _data.map(function (layer, seriesIdx) {
      return valuesAccessor(layer).map(function (segment) {
        return _this._renderBarContainer(segment, seriesIdx);
      });
    });
  },
  _renderBarContainer: function _renderBarContainer(segment, seriesIdx) {
    var _props2 = this.props;
    var colors = _props2.colors;
    var colorAccessor = _props2.colorAccessor;
    var hoverAnimation = _props2.hoverAnimation;
    var xScale = _props2.xScale;
    var yScale = _props2.yScale;

    var barHeight = Math.abs(yScale(0) - yScale(segment.y));
    var y = yScale(segment.y0 + segment.y);
    return React.createElement(BarContainer, {
      height: barHeight,
      width: xScale.rangeBand(),
      x: xScale(segment.x),
      y: segment.y >= 0 ? y : y - barHeight,
      fill: colors(colorAccessor(segment, seriesIdx)),
      hoverAnimation: hoverAnimation,
      onMouseOver: this.props.onMouseOver,
      onMouseLeave: this.props.onMouseLeave,
      dataPoint: {
        xValue: segment.x,
        yValue: segment.y,
        seriesName: this.props.series[seriesIdx]
      }
    });
  },
  render: function render() {
    return React.createElement(
      'g',
      null,
      this._renderBarSeries()
    );
  }
});