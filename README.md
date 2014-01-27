#WebScale v0.1.10

tools to customize a web page dimensions

@author Diono CORBEL http://www.diono.fr/

DEMO : http://www.dionoportfolio.com/WebScale/

##Introduction

WebScale is a tool to resize the web page based on the visible area defined.

It uses new CSS3 properties _transform_  and _transform-origin_

##How to use

WebScale is attached to window. we call directly or through window:

```javascript
WebScale();
```
or

```javascript
window.WebScale();
```

##What are the arguments it expects

The first argument is the DOM element that will be scaled and the second argument is the list of setup options

```javascript
WebScale(DOM, options);
```

• __DOM__ is the _DOM element_ that will be scaled to always show the visible area

!! WARNING !!
```javascript
// WebScale is written in pure JavaScript, it does not use any library like jQuery

WebScale($('#my_element')); // Doesn't works

// instead use :

WebScale($('#my_element')[0]); // access to the DOM element
```

• __OPTIONS__ is an _object_ that parameter :

```javascript
var options = {
	body: document.body, // [Object/String] reference for the display dimensions (by default, the body of the page)
	bodyOffsetWidth: 0, //  [Number]        total fixed width margins of the referent
	bodyOffsetHeight: 0, // [Number]        total fixed height margins of the referent
	minWidth: 450, //       [Number]        minimum width of the visible zone (0 to disable)
	minHeight: 450, //      [Number]        minimum height of the visible zone (0 to disable)
	maxWidth: 0, //         [Number]        maximum width of the visible zone (0 to disable)
	maxHeight: 0, //        [Number]        maximum height of the visible zone (0 to disable)
	top: 'center', //       [String/Number] vertical positioning of the visible area within its container (either in pixels or as a percentage or text: "top", "center", "bottom")
	left: 'center', //      [String/Number] horizontal positioning of the visible area within its container (either in pixels or as a percentage or text: "right", "center", "left")
	offsetTop: 450, //      [Number]        vertical offset of the visible area compared to the whole area
	offsetLeft: 450, //     [Number]        horizontal offset of the visible area compared to the whole area
	unlockWidth: false, //  [Boolean]       authorization resize the width to fit the refrence
	unlockHeight: false, // [Boolean]       authorization resize the height to fit the refrence
	unlockTop: true, //     [Boolean]       authorization to correct the vertical position of the visible area
	unlockLeft: true, //    [Boolean]       authorization to correct the horizontal position of the visible area
	reduce: true, //        [Boolean]       reduces visible if the reference area is too small
	enlarge: false, //      [Boolean]       increase the area visible if the reference is too high
	auto: true //           [Boolean]       if the reference listening for the event "resize", WebScale puts to automatically update the visible area (note only works on window or document or body)
}
```

##Extras

WebScale automatically detects whether the browser supports css3 _transform_ and _transform-origin_ properties.

Each instance of WebScale return detection in _available_ variable

```javascript
var compatible = WebScale(DOM, options).available;
// if this is true, the web browser supports css3 properties
```
