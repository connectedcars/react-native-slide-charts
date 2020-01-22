# react-native-slide-charts

[![Version](https://img.shields.io/npm/v/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)
[![NPM](https://img.shields.io/npm/dm/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)

`react-native-slide-charts` uses [`react-native-svg`](https://github.com/react-native-community/react-native-svg), [`d3`](https://github.com/d3/d3), and [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) to create highly customizable interactive charts that animate smoothly via [`Direct Manipulation`](https://facebook.github.io/react-native/docs/direct-manipulation).

## [Check out the demo on expo](https://snack.expo.io/@nhannah/react-native-slide-charts)

## Features

### Bar Chart

![](./screenshots/BarChart.gif)

### Area Chart

![](./screenshots/AreaChart.gif)

## Installation

```console
$ npm install react-native-slide-charts --save
```

or

```console
$ yarn add react-native-slide-charts
```

### Peer Dependencies

`react-native-slide-charts` depends on three peer dependencies with native modules that must be installed alongside it. Follow the installation instructions for both iOS and Android for all three packages.

| Package                                                                                               | Minimum Version | Maximum Version |
| ----------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| [`react-native-svg`](https://github.com/react-native-community/react-native-svg)                      | 7.0.0           | 9.x             |
| [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler)    | 1.1.0           | 1.x             |
| [`react-native-haptic-feedback`](https://github.com/milk-and-cookies-io/react-native-haptic-feedback) | 1.8.0           | 1.x             |

#### NOTICE:

Make sure the version of the native module packages chosen works with the `react-native` version of the project. Manually linking the projects may be required depending on the version and platform.

## Usage

`react-native-slide-charts` exports two types of graphs, `SlideAreaChart` and `SlideBarChart` along with the type definitions for the charts, Props, and enums.

```jsx
import {
  SlideAreaChart,
  SlideBarChart,
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisMarkerProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
  LabelAndAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
} from 'react-native-slide-charts'
```

### Common Props:

| Prop                  |                                  Type                                   |   Default   | Note                                                                                                                                                                                                                                                                                                               |
| :-------------------- | :---------------------------------------------------------------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alwaysShowIndicator` |                                `boolean`                                |   `true`    | Determines if the indicator for the chart should be visible always or just when being touched.<br/><br/>For `SlideAreaChart` the indicator is the `CursorMarker`, `CursorLine`, and `ToolTip`.<br/><br/>For `SlideBarChart` the indicator is the `barSelectedColor` or `renderSelectedFillGradient` and `ToolTip`. |
| `animated`            |                                `boolean`                                |   `true`    | Animates the charts on mounting and between prop updates.                                                                                                                                                                                                                                                          |
| `axisHeight`          |                                `number`                                 |     `0`     | Height of the area below the graph for the X-Axis markers and label to render in.                                                                                                                                                                                                                                  |
| `axisWidth`           |                                `number`                                 |     `0`     | Width of the area left of the graph for the Y-Axis markers and label to render in.                                                                                                                                                                                                                                 |
| `callbackWithX`       | <pre><code class="language-ts">(x: number \| Date) => void</code></pre> | `undefined` | Callback function that provides the current cursor position `x`. As this is firing off of a continuous animation and not state usage should match appropriately<br/><br/>e.g. This can be used in conjunction with an array of timed gps points to move an indicator along a path on a map.                        |
