'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircleContainer = require('./VoronoiCircleContainer');
var Line = require('./Line');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    color: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      xAccessor: function xAccessor(d) {
        return d.x;
      },
      yAccessor: function yAccessor(d) {
        return d.y;
      },
      interpolationType: 'linear',
      hoverAnimation: false
    };
  },
  _isDate: function _isDate(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },
  render: function render() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    var xAccessor = props.xAccessor;
    var yAccessor = props.yAccessor;

    var interpolatePath = d3.svg.line().y(function (d) {
      return props.yScale(yAccessor(d));
    }).interpolate(props.interpolationType);

    if (this._isDate(props.data[0].values[0], xAccessor)) {
      interpolatePath.x(function (d) {
        return props.xScale(props.xAccessor(d).getTime());
      });
    } else {
      interpolatePath.x(function (d) {
        return props.xScale(props.xAccessor(d));
      });
    }

    var lines = props.data.map(function (series, idx) {
      return React.createElement(Line, {
        path: interpolatePath(series.values),
        stroke: props.colors(props.colorAccessor(series, idx)),
        strokeWidth: series.strokeWidth,
        strokeDashArray: series.strokeDashArray,
        seriesName: series.name,
        key: idx
      });
    });

    var voronoi = d3.geom.voronoi().x(function (d) {
      return xScale(d.coord.x);
    }).y(function (d) {
      return yScale(d.coord.y);
    }).clipExtent([[0, 0], [props.width, props.height]]);

    var cx = void 0;
    var cy = void 0;
    var circleFill = void 0;
    var regions = voronoi(props.value).map(function (vnode, idx) {
      var point = vnode.point.coord;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }
      circleFill = props.colors(props.colorAccessor(vnode, vnode.point.seriesIndex));

      return React.createElement(VoronoiCircleContainer, {
        key: idx,
        circleFill: circleFill,
        vnode: vnode,
        hoverAnimation: props.hoverAnimation,
        cx: cx, cy: cy,
        circleRadius: props.circleRadius,
        onMouseOver: props.onMouseOver,
        dataPoint: {
          xValue: xAccessor(point),
          yValue: yAccessor(point),
          seriesName: vnode.point.series.name
        }
      });
    });

    return React.createElement(
      'g',
      null,
      React.createElement(
        'g',
        null,
        regions
      ),
      React.createElement(
        'g',
        null,
        lines
      )
    );
  }
});