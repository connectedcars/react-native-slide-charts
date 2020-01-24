# react-native-slide-charts

[![Version](https://img.shields.io/npm/v/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)
[![NPM](https://img.shields.io/npm/dm/react-native-slide-charts.svg)](https://www.npmjs.com/package/react-native-slide-charts)

`react-native-slide-charts` uses [`react-native-svg`](https://github.com/react-native-community/react-native-svg), [`d3`](https://github.com/d3/d3), and [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) to create highly customizable interactive charts that animate smoothly via [`Direct Manipulation`](https://facebook.github.io/react-native/docs/direct-manipulation).

## [Check out the demo on expo 📊📈](https://snack.expo.io/@nhannah/react-native-slide-charts)

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

`react-native-slide-charts` exports two types of charts, `SlideAreaChart` and `SlideBarChart` along with the type definitions for the charts, Props, and enums.

```jsx
import {
  SlideAreaChart,
  SlideBarChart,
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
} from 'react-native-slide-charts'
```

To get started you can render an empty chart:

```jsx
<SlideAreaChart />
```

But it will be more visually useful for configuring to use some test [data](#data).

```jsx
<SlideBarChart
  data={[
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
  ]}
/>
```

### Charts

#### Common Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `alwaysShowIndicator`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Determines if the indicator for the chart should be visible always or just when being touched.<br/><br/>For `SlideAreaChart` the indicator is the [`CursorMarker`, `CursorLine`](#cursor), and [`ToolTip`](#tool-tip).<br/><br/>For `SlideBarChart` the indicator is the [`barSelectedColor`](#barselectedcolor) or [`renderSelectedFillGradient`](#renderselectedfillgradient) and [`ToolTip`](#tool-tip).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `animated`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Animates the charts on mounting and between prop updates.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisHeight`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

Height of the area below the chart for the X-Axis markers and label to render in.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

Width of the area left of the chart for the Y-Axis markers and label to render in.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `callbackWithX`
</td>
<td align="center">

```ts
(x: number
| Date)
=> void
```

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Callback function that provides the current [Cursor](#cursor) position `x`. As this is firing off of a continuous animation and not state usage should match appropriately.<br/><br/>e.g. This can be used in conjunction with an array of timed gps points to move an indicator along a path on a map.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `callbackWithY`
</td>
<td align="center">

```ts
(y: number)
=> void
```

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Callback function that provides the current [Cursor](#cursor) position `y`. As this is firing off of a continuous animation and not state usage should match appropriately.<br/><br/>e.g. This can be used with direct manipulation on a `TextInput` to display the current value outside the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `chartPaddingTop`
</td>
<td align="center">

`number`

</td>
<td align="center">

`16`

</td>
<td align="left">

Pushes the rendered height of the data within the chart down to make room for the [`ToolTip`](#tool-tip-props) at the max. The [`ToolTip`](#tool-tip-props) will render outside of the chart component if desired so this can be set to `0` or adjusted for using [`paddingTop`](#paddingtop) or [`style`](#style) if desired.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `data`
</td>
<td align="center">

```ts
Array<{
  x: number
  | Date,
  y: number
}>
```

</td>
<td align="center">

`[]`

</td>
<td align="left">

Data that will be displayed on the chart. This must be an array of objects with `x` and `y` values with the `x` increasing from index 0 onward as the chart does not sort the array before use and will render incorrectly otherwise.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `fillColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Color to fill the bars of the bar chart or area of the area chart. Takes precedence over [`renderFillGradient`](#renderfillgradient) when applied.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `height`
</td>
<td align="center">

`number`

</td>
<td align="center">

`200`

</td>
<td align="left">

Height of the entire chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `onPress`
</td>
<td align="center">

```ts
() => void
```

</td>
<td align="center">

`undefined`

</td>
<td align="left">

If provided the chart will not be interactive and instead can be pressed.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `paddingBottom`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

Bottom padding as it can not be applied via styles to the chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `paddingLeft`
</td>
<td align="center">

`number`

</td>
<td align="center">

`8`

</td>
<td align="left">

Left padding as it can not be applied via styles to the chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `paddingRight`
</td>
<td align="center">

`number`

</td>
<td align="center">

`8`

</td>
<td align="left">

Right padding as it can not be applied via styles to the chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `paddingTop`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

Top padding as it can not be applied via styles to the chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `renderFillGradient`
</td>
<td align="center">

```ts
(props:
GradientProps)
=> JSX.Element
| null
```

</td>
<td align="center">

TODO: PUT GRADIENT

</td>
<td align="left">

Function that returns a custom gradient to fill the bars of the bar chart or area of the area chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `scrollable`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Ensure touch is passed to `scrollView` on `y` movement if component is inside `scrollView`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `shouldCancelWhenOutside`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Terminates touch outside the chart component.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `showIndicatorCallback`
</td>
<td align="center">

```ts
(opacity: number)
=> void
```

</td>
<td align="center">

`undefined`

</td>
<td align="left">

If [`alwaysShowIndicator`](#alwaysshowindicator) is `false` this function is fired with the current indicator opacity whenever the indicator appears or disappears.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `style`
</td>
<td align="center">

`ViewStyle`

</td>
<td align="center">

```ts
{backgroundColor:
'#fff'}
```

</td>
<td align="left">

Style of chart component.

</td>
</tr>
</tr>
<tr>
<td align="center">
  
  ##### `throttleAndroid`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

On some slower Android devices there may be too many calls across the bridge that it can cause some lagging of the indicator movement, this limits the calls to the queue on Android with little noticeable change in the interaction.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `toolTipProps`
</td>
<td align="center">

[`ToolTipProps`](#tool-tip-props)

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Props for rendering the [`ToolTip`](#tool-tip).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `width`
</td>
<td align="center">

`number`

</td>
<td align="center">

```ts
Dimensions
.get('window')
.width
```

</td>
<td align="left">

Width of the entire chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `xAxisProps`
</td>
<td align="center">

[`XAxisProps`](#x-axis-props)

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Props for rendering the `XAxis`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `xRange`
</td>
<td align="center">

```ts
[number, number]
| [Date, Date]
```

</td>
<td align="center">

Value of `x` in first and last object in [`data`](#data) array.

</td>
<td align="left">

The range for the [`XAxis`](#x-axis-props) of the chart to be rendered using.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `xScale`
</td>
<td align="center">

```ts
'time' | 'linear'
```

</td>
<td align="center">

`'linear'`

</td>
<td align="left">

Determines the applied [`d3` scale](https://www.d3indepth.com/scales/) of the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `yAxisProps`
</td>
<td align="center">

[`YAxisProps`](#y-axis-props)

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Props for rendering the YAxis.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `yRange`
</td>
<td align="center">

```ts
[number, number]
```

</td>
<td align="center">

Max and Min value of `y` in [`data`](#data) array

</td>
<td align="left">

The range for the [`YAxis`](#y-axis-props) of the chart to be rendered using.

</td>
</tr>
</tbody>
</table>

#### Bar Chart Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `barSelectedColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Sets the bar color for the selected bar. Takes precedence over [`renderSelectedFillGradient`](#renderselectedfillgradient).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `barSpacing`
</td>
<td align="center">

`number`

</td>
<td align="center">

`1`

</td>
<td align="left">

Sets the space that should be rendered between each bar on the bar chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `barWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Sets the width of each bar, takes precedence over [`barSpacing`](#barspacing) when applied.

</td>
</tr>
</tr>
<tr>
<td align="center">
  
  ##### `hapticFeedback`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Runs [`selection`](https://developer.apple.com/documentation/uikit/uiselectionfeedbackgenerator) feedback on iOS using [`react-native-haptic-feedback`](https://github.com/milk-and-cookies-io/react-native-haptic-feedback).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `hideSelection`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Prevents [`fillColor`](#fillcolor) or [`renderSelectedFillGradient`](#renderselectedfillgradient) from being applied to the selected bar.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `renderSelectedFillGradient`
</td>
<td align="center">

```ts
(props:
GradientProps)
=> JSX.Element
| null
```

</td>
<td align="center">

TODO: GRAD

</td>
<td align="left">

Function that returns a custom gradient to fill the selected bar.

</td>
</tr>
</tbody>
</table>

#### Area Chart Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `cursorProps`
</td>
<td align="center">

[`CursorProps`](#cursor-props)

</td>
<td align="center">

```ts
{cursorMarkerHeight: 24,
cursorMarkerWidth: 24,
cursorWidth: 2}
```

</td>
<td align="left">

Props for [`Cursor`](#cursor) that follows the touch.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `curveType`
</td>
<td align="center">

```ts
shape.CurveFactory
| shape
.CurveFactoryLineOnly
```

</td>
<td align="center">

```ts
shape.curveMonotoneX
```

</td>
<td align="left">

Type of curve to use for the area chart from [`d3-shape`](https://github.com/d3/d3-shape#curves).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `chartLineColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`'#0081EB'`

</td>
<td align="left">

Color for the line designating the area charted.

</td>
</tr>
</tr>
<tr>
<td align="center">
  
  ##### `chartLineWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`3`

</td>
<td align="left">

Stroke width of the line designating the area charted.

</td>
</tr>
</tbody>
</table>

### Axis

#### Common Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `axisLabel`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Label for the axis.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisLabelStyle`
</td>
<td align="center">

```ts
TSpanProps &
{ color: string }
```

</td>
<td align="center">

```ts
{fontSize: 13,
color: '#777'}
```

</td>
<td align="left">

Styling for label, extends [`TSpanProps`](https://github.com/react-native-community/react-native-svg/blob/master/src/index.d.ts) from [`react-native-svg`](https://github.com/react-native-community/react-native-svg) with type `color`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `labelTopPadding`
</td>
<td align="center">

`number`

</td>
<td align="center">

`4`

</td>
<td align="left">

Space above the label to offset it from either the top of the component or the bottom of the chart.

</td>
</tr>
</tbody>
</table>

#### X-Axis Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `adjustForSpecialMarkers`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

If [`specialStartmarker`](#specialstartmarker) or [`specialEndMarker`](#specialendmarker) are set it adjusts the text to left or right align to the edge of the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisLabelAlignment`
</td>
<td align="center">

[`XAxisLabelAlignment`](#xaxislabelalignment)

</td>
<td align="center">

`right`

</td>
<td align="left">

Position for the axis label below the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisMarkerLabels`
</td>
<td align="center">

```ts
string[]
```

</td>
<td align="center">

`[]`

</td>
<td align="left">

Array of labels placed below the chart, these will line up with the bars if there are an adequate amount, or space evenly otherwise.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `labelBottomOffset`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

If [`axisMarkerLabels`](#axismarkerlabels) and [`axisLabel`](#axislabel) the `axisLabel` will bottom justify and this offset will apply to it.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `markerSpacing`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

If [`axisMarkerLabels`](#axismarkerlabels) are overcrowded a number of empty spaces can be given to set between each marker shown.

</td>
</tr>
</tr>
<tr>
<td align="center">
  
  ##### `markerTopPadding`
</td>
<td align="center">

`number`

</td>
<td align="center">

`4`

</td>
<td align="left">

The axis markers are top justified below the chart, this is the space between the marker and the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `minimumSpacing`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

The first and last marker are always shown then the rest are layed out left to right, if the marker before the final one would layout closer than [`markerSpacing`](#markerspacing) to the final marker, this can be avoided with minimum spacing. This is also useful in making room for a [`specialEndMarker`](#specialendmarker).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `specialEndMarker`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

The right hand marker of the chart can be set to a special marker, such as 'end', or another designation.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `specialStartMarker`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

The left hand marker of the chart can be set to a special marker, such as 'start', or another designation.

</td>
</tr>
</tbody>
</table>

#### Y-Axis Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `averageLineColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`'#77777780'`

</td>
<td align="left">

Color for average line.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `averageMarkerDecimals`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

Number of decimal places to show in the average marker if [`markAverageLine`](#markaverageline) is `true`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisAverageMarkerStyle`
</td>
<td align="center">

```ts
TSpanProps &
{ color:
string }
```

</td>
<td align="center">

```ts
{
fontSize:
13,
color:
'#77777780'
}
```

</td>
<td align="left">

Styling for marker, extends [`TSpanProps`](https://github.com/react-native-community/react-native-svg/blob/master/src/index.d.ts) from [`react-native-svg`](https://github.com/react-native-community/react-native-svg) with type `color`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisLabelAlignment`
</td>
<td align="center">

[`YAxisLabelAlignment`](#yaxislabelalignment)

</td>
<td align="center">

`aboveTicks`

</td>
<td align="left">

Position for the axis label left of the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `axisMarkerStyle`
</td>
<td align="center">

```ts
TSpanProps &
{ color:
string }
```

</td>
<td align="center">

```ts
{fontSize:
13,
color:
'#222'}
```

</td>
<td align="left">

Styling for markers, extends [`TSpanProps`](https://github.com/react-native-community/react-native-svg/blob/master/src/index.d.ts) from [`react-native-svg`](https://github.com/react-native-community/react-native-svg) with type `color`.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `fullBaseLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Extends bottom line of chart to left edge.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `hideMarkers`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Hides the markers on the Y-Axis without hiding the tick lines.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `horizontalLineColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Color for horizontal lines, overrides [`renderHorizontalLineGradient`](#renderhorizontallinegradient).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `horizontalLineWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`1`

</td>
<td align="left">

Stroke width for horizontal lines.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `interval`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Spacing for the Y-Axis ticks, this is determined using `numberOfTicks` and [`yRange`](#yrange) if not defined while `numberOfTicks` is given.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `labelLeftOffset`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

If there are ticks with labels and [`axisLabel`](#axislabel) the `axisLabel` will left justify and this offset will apply to it.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `markAverageLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Show marker next to the average of the data.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `markerChartOffset`
</td>
<td align="center">

`number`

</td>
<td align="center">

`4`

</td>
<td align="left">

Spacing between the markers and the chart to the left of the chart and right of the markers.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `markFirstLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Show marker next to bottom line, often `0` and not needed.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `numberOfTicks`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Number of ticks the chart should have, spaced via [`interval`](#interval).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `renderHorizontalLineGradient`
</td>
<td align="center">

```ts
(props:
GradientProps
& { count:
number }) =>
JSX.Element
| null
```

</td>
<td align="center">

TODO: put line gradient

</td>
<td align="left">

Function that returns a custom gradient for the horizontal lines.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `renderVerticalLineGradient`
</td>
<td align="center">

```ts
(props:
GradientProps)
=> JSX.Element
| null
```

</td>
<td align="center">

TODO: put line gradient

</td>
<td align="left">

Function that returns a custom gradient for the vertical side lines.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `rotateAxisLabel`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Rotates the Y-Axis label vertically.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `showAverageLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Shows the average line.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `showBaseLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Shows the base line of the chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `verticalLineColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Color for vertical lines, overrides [`renderVerticallLineGradient`](#renderverticallinegradient).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `verticalLineWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`1`

</td>
<td align="left">

Stroke width of the vertial side lines.

</td>
</tr>
</tbody>
</table>

### Cursor

#### Cursor Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `cursorBorderColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`'#fff'`

</td>
<td align="left">

Border color for default cursor.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `cursorColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`'#F4B700'`

</td>
<td align="left">

Inside color of default cursor.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `cursorLine`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Display line to bottom of chart below cursor.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `cursorMarkerHeight`
</td>
<td align="center">

`number`

</td>
<td align="center">

`24`

</td>
<td align="left">

Height of the cursor, you need to adjust this is you use a custom cursor or want to change the default cursor size.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `cursorMarkerWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`24`

</td>
<td align="left">

Width of the cursor, you need to adjust this is you use a custom cursor or want to change the default cursor size.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `cursorWidth`
</td>
<td align="center">

`number`

</td>
<td align="center">

`2`

</td>
<td align="left">

Width of the cursor line.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `displayCursor`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Display the cursor.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `renderCursorMarker`
</td>
<td align="center">

```ts
(props:
CursorProps & { ref:
React.RefObject<any>
}) =>
React.ReactNode | null
```

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Function that returns a custom cursor marker with ref assigned.

</td>
</tr>
</tbody>
</table>

### Tool Tip

#### Tool Tip Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `backgroundColor`
</td>
<td align="center">

`string`

</td>
<td align="center">

`'#fff'`

</td>
<td align="left">

Background color of tool tip.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `borderRadius`
</td>
<td align="center">

`number`

</td>
<td align="center">

`2`

</td>
<td align="left">

Border radius of tool tip corners.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `displayToolTip`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Display tool tip if [`toolTipTextRenderers`](#tooltiptextrenderers) given.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `displayTriangle`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`true`

</td>
<td align="left">

Display tool tip triangle on bottom of tool tip.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `fontSize`
</td>
<td align="center">

`number`

</td>
<td align="center">

`13`

</td>
<td align="left">

Default font size of tool tip text.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `height`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Height of the tool tip, you should set this if there is minimal change as the measurements for less jitteriness if wanted.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `lockTriangleCenter`
</td>
<td align="center">

`boolean`

</td>
<td align="center">

`false`

</td>
<td align="left">

Keeps the tool tip triangle centered instead of moving to adjust for the position within the graph.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `textStyles`
</td>
<td align="center">

[`TextStyle[]`](https://facebook.github.io/react-native/docs/text-style-props)

</td>
<td align="center">

`[]`

</td>
<td align="left">

Array of text styles that match up with [toolTipTextRenderers](#tooltiptextrenderers) array for styling.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `toolTipTextRenderers`
</td>
<td align="center">

```ts
Array<(
toolTipTextRenderersInput:
ToolTipTextRenderersInput
) => { text: string }
>
```

</td>
<td align="center">

`[]`

</td>
<td align="left">

Array of functions that return an object that has a `text` key with a `string` value.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `width`
</td>
<td align="center">

`number`

</td>
<td align="center">

`undefined`

</td>
<td align="left">

Width of the tool tip, you should set this if there is minimal change as the measurements for less jitteriness if wanted.

</td>
</tr>
</tbody>
</table>

### Types

#### Tool Tip Text Renderers Input:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `scaleX`
</td>
<td align="center">

```ts
ScaleTime<number, number> |
ScaleLinear<number, number>
```

</td>
<td align="center">

</td>
<td align="left">

The scaleX function used to draw the graph, combined with `.invert` and `x` a value can be determined for any cursor position.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `scaleY`
</td>
<td align="center">

```ts
ScaleLinear<number, number>
```

</td>
<td align="center">

</td>
<td align="left">

The scaleY function used to draw the graph, combined with `.invert` and `y` a value can be determined for any cursor position.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `selectedBarNumber`
</td>
<td align="center">

`number`

</td>
<td align="center">

`0`

</td>
<td align="left">

The `selectedBarNumber` of the bar chart, this is always `0` for the area chart.

</td>
</tr>
<tr>
<td align="center">
  
  ##### `x`
</td>
<td align="center">

`number`

</td>
<td align="center">

</td>
<td align="left">

Current `x` value of the cursor, use in combination with [scaleX](#scalex).

</td>
</tr>
<tr>
<td align="center">
  
  ##### `y`
</td>
<td align="center">

`number`

</td>
<td align="center">

</td>
<td align="left">

Current `y` value of the cursor, use in combination with [scaleY](#scaley).

</td>
</tr>
</tbody>
</table>

#### Gradient Props:

<table>
<thead>
<tr>
<td align="center">
  Prop
</td>
<td align="center">
  Type
</td>
<td align="center">
  Default
</td>
<td align="left">
  Note
</td>
</tr>
</thead>
<tbody>
<tr>
<td align="center">
  
  ##### `id`
</td>
<td align="center">

`string`

</td>
<td align="center">

</td>
<td align="left">

TODO: example
The `id` must be used as the key on the gradient `Defs` returned to designate it for use by the the graph as shown in the example.

</td>
</tr>
</tbody>
</table>

### Enums

#### YAxisLabelAlignment:

```ts
enum YAxisLabelAlignment {
  top = 'top',
  bottom = 'bottom',
  middle = 'middle',
  aboveTicks = 'aboveTicks',
}
```

#### XAxisLabelAlignment:

```ts
enum XAxisLabelAlignment {
  right = 'right',
  left = 'left',
  center = 'center',
}
```
