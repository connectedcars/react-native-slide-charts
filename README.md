# react-native-slide-charts

[![Version](https://img.shields.io/npm/v/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)
[![NPM](https://img.shields.io/npm/dm/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)

`react-native-slide-charts` uses [`react-native-svg`](https://github.com/react-native-community/react-native-svg), [`d3`](https://github.com/d3/d3), and [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) to create interactive charts.

## [Check out the demo in expo](https://snack.expo.io/@nhannah/react-native-slide-charts)

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
