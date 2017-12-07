(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["chartist"], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    ***REMOVED***);
  ***REMOVED*** else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("chartist"));
  ***REMOVED*** else {
    root['Chartist.plugins.tooltips'] = factory(Chartist);
  ***REMOVED***
***REMOVED***(this, function (Chartist) {

  /**
   * Chartist.js plugin to display a data label on top of the points in a line chart.
   *
   */
  /* global Chartist */
  (function (window, document, Chartist) {
    'use strict';

    var defaultOptions = {
      currency: undefined,
      currencyFormatCallback: undefined,
      tooltipOffset: {
        x: 0,
        y: -20
      ***REMOVED***,
      anchorToPoint: false,
      appendToBody: false,
      class: undefined,
      pointClass: 'ct-point'
    ***REMOVED***;

    Chartist.plugins = Chartist.plugins || {***REMOVED***;
    Chartist.plugins.tooltip = function (options) {
      options = Chartist.extend({***REMOVED***, defaultOptions, options);

      return function tooltip(chart) {
        var tooltipSelector = options.pointClass;
        if (chart instanceof Chartist.Bar) {
          tooltipSelector = 'ct-bar';
        ***REMOVED*** else if (chart instanceof Chartist.Pie) {
          // Added support for donut graph
          if (chart.options.donut) {
            tooltipSelector = 'ct-slice-donut';
          ***REMOVED*** else {
            tooltipSelector = 'ct-slice-pie';
          ***REMOVED***
        ***REMOVED***

        var $chart = chart.container;
        var $toolTip = $chart.querySelector('.chartist-tooltip');
        if (!$toolTip) {
          $toolTip = document.createElement('div');
          $toolTip.className = (!options.class) ? 'chartist-tooltip' : 'chartist-tooltip ' + options.class;
          if (!options.appendToBody) {
            $chart.appendChild($toolTip);
          ***REMOVED*** else {
            document.body.appendChild($toolTip);
          ***REMOVED***
        ***REMOVED***
        var height = $toolTip.offsetHeight;
        var width = $toolTip.offsetWidth;

        hide($toolTip);

        function on(event, selector, callback) {
          $chart.addEventListener(event, function (e) {
            if (!selector || hasClass(e.target, selector))
              callback(e);
          ***REMOVED***);
        ***REMOVED***

        on('mouseover', tooltipSelector, function (event) {
          var $point = event.target;
          var tooltipText = '';

          var isPieChart = (chart instanceof Chartist.Pie) ? $point : $point.parentNode;
          var seriesName = (isPieChart) ? $point.parentNode.getAttribute('ct:meta') || $point.parentNode.getAttribute('ct:series-name') : '';
          var meta = $point.getAttribute('ct:meta') || seriesName || '';
          var hasMeta = !!meta;
          var value = $point.getAttribute('ct:value');

          if (options.transformTooltipTextFnc && typeof options.transformTooltipTextFnc === 'function') {
            value = options.transformTooltipTextFnc(value);
          ***REMOVED***

          if (options.tooltipFnc && typeof options.tooltipFnc === 'function') {
            tooltipText = options.tooltipFnc(meta, value);
          ***REMOVED*** else {
            if (options.metaIsHTML) {
              var txt = document.createElement('textarea');
              txt.innerHTML = meta;
              meta = txt.value;
            ***REMOVED***

            meta = '<span class="chartist-tooltip-meta">' + meta + '</span>';

            if (hasMeta) {
              tooltipText += meta + '<br>';
            ***REMOVED*** else {
              // For Pie Charts also take the labels into account
              // Could add support for more charts here as well!
              if (chart instanceof Chartist.Pie) {
                var label = next($point, 'ct-label');
                if (label) {
                  tooltipText += text(label) + '<br>';
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***

            if (value) {
              if (options.currency) {
                if (options.currencyFormatCallback != undefined) {
                  value = options.currencyFormatCallback(value, options);
                ***REMOVED*** else {
                  value = options.currency + value.replace(/(\d)(?=(\d{3***REMOVED***)+(?:\.\d+)?$)/g, '$1,');
                ***REMOVED***
              ***REMOVED***
              value = '<span class="chartist-tooltip-value">' + value + '</span>';
              tooltipText += value;
            ***REMOVED***
          ***REMOVED***

          if(tooltipText) {
            $toolTip.innerHTML = tooltipText;
            setPosition(event);
            show($toolTip);

            // Remember height and width to avoid wrong position in IE
            height = $toolTip.offsetHeight;
            width = $toolTip.offsetWidth;
          ***REMOVED***
        ***REMOVED***);

        on('mouseout', tooltipSelector, function () {
          hide($toolTip);
        ***REMOVED***);

        on('mousemove', null, function (event) {
          if (false === options.anchorToPoint)
            setPosition(event);
        ***REMOVED***);

        function setPosition(event) {
          height = height || $toolTip.offsetHeight;
          width = width || $toolTip.offsetWidth;
          var offsetX = - width / 2 + options.tooltipOffset.x
          var offsetY = - height + options.tooltipOffset.y;
          var anchorX, anchorY;

          if (!options.appendToBody) {
            var box = $chart.getBoundingClientRect();
            var left = event.pageX - box.left - window.pageXOffset ;
            var top = event.pageY - box.top - window.pageYOffset ;

            if (true === options.anchorToPoint && event.target.x2 && event.target.y2) {
              anchorX = parseInt(event.target.x2.baseVal.value);
              anchorY = parseInt(event.target.y2.baseVal.value);
            ***REMOVED***

            $toolTip.style.top = (anchorY || top) + offsetY + 'px';
            $toolTip.style.left = (anchorX || left) + offsetX + 'px';
          ***REMOVED*** else {
            $toolTip.style.top = event.pageY + offsetY + 'px';
            $toolTip.style.left = event.pageX + offsetX + 'px';
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***;

    function show(element) {
      if(!hasClass(element, 'tooltip-show')) {
        element.className = element.className + ' tooltip-show';
      ***REMOVED***
    ***REMOVED***

    function hide(element) {
      var regex = new RegExp('tooltip-show' + '\\s*', 'gi');
      element.className = element.className.replace(regex, '').trim();
    ***REMOVED***

    function hasClass(element, className) {
      return (' ' + element.getAttribute('class') + ' ').indexOf(' ' + className + ' ') > -1;
    ***REMOVED***

    function next(element, className) {
      do {
        element = element.nextSibling;
      ***REMOVED*** while (element && !hasClass(element, className));
      return element;
    ***REMOVED***

    function text(element) {
      return element.innerText || element.textContent;
    ***REMOVED***

  ***REMOVED*** (window, document, Chartist));

  return Chartist.plugins.tooltips;

***REMOVED***));