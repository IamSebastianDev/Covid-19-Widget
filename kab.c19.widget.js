/** @format */

/**

Copyright 2021 Sebastian Heinz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/**

   @description The widgetConfig object is used to configure the Widget to it's users preferences. The properties are explained below.

   @beschreibung Das widgetConfig Objekt enthält die Variablen die vom User verändert werden können. Eine genaue Erklärung der Werte findest du jeweils zugeordnet.

   @todo finish the rest of the german user documentation

*/

const widgetConfig = {
	/**

        @type { String } 
        @description the size property is used to either create a small or mediums sized Widget. Both values are possible. Content will be rendered depending on the size of the Widget.

		@beschreibung die größe des Widgets. Zulässige größen sind "small" & "medium". Das Widget hat unterschiedlichen Content je nachdem welche größe du wählst.

    */

	size: 'small',

	/**

        @type { {} }
        @description the colours property is used to declare colours used in the Widget. Colours are declared as hex values and will be parsed by a helper class.

    */

	colours: {
		background: '#000000',
		backgroundShade: '#242424',
		text: '#FFFFFF',
		textShade: '#8F8F8F',
		error: '#FF5A5F',
		blue: '#39A0ED',
		blueShade: '0A4470',
		teal: '13C4A3',
		tealShade: '0B6F5D',
		red: '#FF5A60',
		redShade: '8F0005',
	},

	/**

        @type { {} }
        @description the padding property is used to describe padding on elements. Changing this may have unwanted sideeffects. Paddingvalues are always numbers.

    */

	padding: {
		app: 8,
	},

	/**

        @type { Boolean }
        @description  a modifier to make working with a canvas easier. This will allow presice logging of information and other things. Set to false to use the widget, set to true if you need assistance debugging something

    */

	dev: false,
};

/*

	Configuring the canvas and layout

*/

const canvasConfig = {
	/**

		@type { Number }
		@description the degrees the circle shoud span. Any value between 1 & 359 is valid. Default is 220. Change this at your own risk, setting the number to higher then 260 will likely break layout.

	*/

	arcSpan: 220,

	/**

		@type { Number }
		@description the thickness of the arc. you can change this value to make the arcs slimmer.

	*/

	arcWidth: 8,

	/**

		@type { Number }
		@description the vertical shift of the circle and text elements

	*/

	offsetY: 6,
};

/**

    @description utility class containing methods not directly related to widget markup rendering

*/

class Utility {
	/**

		@description Helper method to retrieve symbols
		
		@param { String } symbolName - the name of the symbol

		@returns { Symbol } - the requested symbol

	*/

	static getSymbol(symbolName) {
		let sym = SFSymbol.named(symbolName);
		sym.applyBoldWeight();

		return sym;
	}
	/** 

        @description Helper method to log a payload to the console only if the dev mode is enabled

        @param { any } payload - the payload to log
        
    */

	static log(payload) {
		config.dev ? console.log(payload) : null;
	}

	/** 

        @description Helper method to get the widgetSize in px. 
        This script was found here: https://talk.automators.fm/t/get-available-widget-height-and-width-depending-on-the-devices-screensize/9258/4

        This appears to be the only way to figure out a accurate screen size for Widgets

        @param { String } widgetSize - the supposed size of the Widget

        @returns { Object } a scriptable Size object containg the widgt and height of the widget

    */

	static getWidgetSize(
		widgetSize = config.runsInWidget ? config.widgetFamily : null
	) {
		// RegExp to verify widgetSize
		const sizes = /^(?:small|medium|large)$/;
		// stringify device screen size
		const devSize = (({ width: w, height: h }) =>
			w > h ? `${h}x${w}` : `${w}x${h}`)(Device.screenSize());
		// screen size to widget size mapping for iPhone, excluding the latest iPhone 12 series. iPad size
		const sizeMap = {
			// iPad Mini 2/3/4, iPad 3/4, iPad Air 1/2. 9.7" iPad Pro
			// '768x1024': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// 10.2" iPad
			// '810x1080': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// 10.5" iPad Pro, 10.5" iPad Air 3rd Gen
			// '834x1112': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// 10.9" iPad Air 4th Gen
			// '820x1180': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// 11" iPad Pro
			'834x1194': {
				small: [155, 155],
				medium: [329, 155],
				large: [345, 329],
			},
			// 12.9" iPad Pro
			'1024x1366': {
				small: [170, 170],
				medium: [332, 170],
				large: [382, 332],
			},
			// 12 Pro Max
			// '428x926': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// XR, 11, 11 Pro Max
			'414x896': {
				small: [169, 169],
				medium: [360, 169],
				large: [360, 376],
			},
			// 12, 12 Pro
			// '390x844': { small: [0, 0], medium: [0, 0], large: [0, 0] },
			// X, XS, 11 Pro, 12 Mini
			'375x812': {
				small: [155, 155],
				medium: [329, 155],
				large: [329, 345],
			},
			// 6/7/8(S) Plus
			'414x736': {
				small: [159, 159],
				medium: [348, 159],
				large: [348, 357],
			},
			// 6/7/8(S) and 2nd Gen SE
			'375x667': {
				small: [148, 148],
				medium: [322, 148],
				large: [322, 324],
			},
			// 1st Gen SE
			'320x568': {
				small: [141, 141],
				medium: [291, 141],
				large: [291, 299],
			},
		};
		let widgetSizeInPoint = null;

		if (widgetSize && sizes.test(widgetSize)) {
			let mappedSize = sizeMap[devSize];
			if (mappedSize) {
				widgetSizeInPoint = new Size(...mappedSize[widgetSize]);
			}
		}
		return widgetSizeInPoint;
	}

	/**

		@description utility method to retrieve a percentage value from two givens
		
		@param { Number } value - the value that represents the amount
		@param { Number } totalValue - the value to compare the amount against

		@returns { Number } the percentage value

	*/

	static toPercentage(value, totalValue) {
		return ((100 * value) / totalValue).toFixed(2);
	}

	/**

		@description utility method to convert a percentage value to a real number

		@param { Number } value - the value that represents the amount
		@param { Number } totalValue - the value to compare the amount against

		@returns { Number } the no longer percentage value

	*/

	static fromPercentage(value, totalValue) {
		return (totalValue / 100) * value;
	}

	/*


	*/

	static calculateOrigin(position, size) {
		return new Point(
			position.x + size.width / 2,
			position.y + size.height / 2
		);
	}
}

/**

   @description Helper class to create a colour palette out of provided hexcodes

*/

class ColourPalette {
	/**

        @param { Object } colours - the object containging the Colour hex codes

        @returns { Object } - the object containing the colours

    */

	constructor(colours) {
		this.pallete = {};

		// itterate over the provided colours object and convert the hexcode to colorObjects

		for (const colorName in colours) {
			if (Object.hasOwnProperty.call(colours, colorName)) {
				const hexCode = colours[colorName];

				this._constructColour({ colorName, hexCode });
			}
		}

		// return the created palette instead of the class
		return this.pallete;
	}

	/**
        
        @description @private  method to construct a colorObject out of a provided hexcode and assign it to the pallete

        @param { {} } param1 - the object passed to the method containing the colorName & hexCode
        @param { String } param1.colorName - the identifier of the color
        @param { String } param1.hexCode - the hexcode with the colorcode

    */

	_constructColour({ colorName, hexCode }) {
		this.pallete[colorName] = new Color(hexCode);
	}
}

/**

    @description A utility class to provide static methods to create and style textStacks

*/

class UITextElement {
	/**

         @public @static @description method to create a textElement on a Stack

        @param { {} } element - the element to style
        @param { String } text - the content of the textElement
        @param { {} } param3 - Object passed to the method to style the newly created text
        @param { {} } param3.font - The Font of the element
        @param { {} } param3.color - Object containing the colour
        @param { String } param3.align - supposed text alignment

        @returns { {} } the created textStack Object

    */

	static createText(
		element,
		text,
		{
			font = Font.mediumSystemFont(10),
			color = undefined,
			align = 'left',
		} = {}
	) {
		const textElement = element.addText(`${text}`);
		textElement.font = font;
		textElement.textColor =
			color == undefined ? textElement.textColor : color;
		align == 'left'
			? textElement.leftAlignText()
			: align == 'center'
			? textElement.centerAlignText()
			: textElement.rightAlignText();

		return textElement;
	}

	/*
    
        @public @static @description method to set a shadow on a provided Element
    
        @param { {} } textElement - the element the shadow should be set on
        @param { {} } param2 - object passed to the method to define the shadow
        @param { {} } param2.color - the shadow colour
        @param { Number } param2.radius - the shadow radius
        @param { Point } param2.offset - the shadow offset

    */

	static addShadow(
		textElement,
		{ color = undefined, radius = 0, offset = new Point(0, 0) }
	) {
		textElement.shadowColor = color != undefined ? color : null;
		textElement.shadowRadius = radius;
		textElement.shadowOffset = offset;
	}
}

/**

   @description A utility class to provide static methods that can be used to style elements

*/

class UIElement {
	/**

        @public @static @description method to set and style the Border of a Stackelement

        @param { {} } element - the element to style
        @param { {} } param2 - object to configure the elements style
        @param { Number } param2.borderWidth - width of the border
        @param { {} } param2.borderColor - Object containing the colour
        @param { Number } param2.cornerRadius - radius of the border

    */

	static setBorder(
		element,
		{ borderWidth = 1, borderColor = undefined, cornerRadius = 0 } = {}
	) {
		element.borderWidth = borderWidth;
		element.borderColor =
			borderColor != undefined ? borderColor : element.borderColor;
		element.cornerRadius = cornerRadius;
	}

	/**
        
        @public @static @description method to set and style the Border of a Stackelement

        @param { {} } element - the element to align
        @param { {} } param2 - object to configure the elements style
        @param { String } param2.content - the elements content alingment
        @param { String } param2.layout - the elements layout

    */

	static alignElement(
		element,
		{ content = 'center', layout = 'horizontally' } = {}
	) {
		content == 'center'
			? element.centerAlignContent()
			: content == 'top'
			? element.topAlignContent()
			: element.bottomAlignContent();
		layout == 'horizontally'
			? element.layoutHorizontally()
			: element.layoutVertically();
	}
}

/**

    @description utility class containing methods to simplify drawing to a canvas

	@todo: improve documentation

*/

class UICanvasElement {
	// call the constructor to create a new instance of a canvas, assign a default width and height and create a drawContext
	constructor() {
		this._width = 0;
		this._height = 0;

		this.ctx = new DrawContext();
	}

	set width(width) {
		this._width = width;

		this.ctx.size = new Size(this._width, this._height);
	}
	get width() {
		return this.ctx.size.width;
	}

	set height(height) {
		this._height = height;

		this.ctx.size = new Size(this._width, this._height);
	}
	get height() {
		return this.ctx.size.height;
	}

	get center() {
		return new Point(this.ctx.size.width / 2, this.ctx.size.height / 2);
	}

	/**

		@description method to overwrite and clear a part of the canvas

		@param { Number } x - the x coordinate
		@param { Number } y - the y coordinate
		@param { Number } width - the width of the rect to clear
		@param { Number } height - the height of the rect to clear
		@param { Color } colour - the colour to use to overwrite

	*/

	clearCanvas(
		x = 0,
		y = 0,
		width = this.ctx.size.width,
		height = this.ctx.size.height,
		colour = new Color('#000000')
	) {
		const rect = new Rect(x, y, width, height);
		this.ctx.setFillColor(colour);
		this.ctx.fillRect(rect);
	}

	/**

		@description Helper methods to return a function that converts relative size to pixels depening on the viewPort / canvas width

		@returns { Function } the function that converts the values

	*/

	getViewPortWidthFunction() {
		return (rSize) => (this.ctx.size.width / 100) * rSize;
	}

	/**

		@description Helper methods to return a function that converts relative size to pixels depening on the viewPort / canvas height

		@returns { Function } the function that converts the values

	*/

	getViewPortHeightFunction() {
		return (rSize) => (this.ctx.size.height / 100) * rSize;
	}

	/*

		Method to retrieve the drawContext

	*/

	getDrawContext({ opaque = false, respectScreenScale = true }) {
		this.ctx.opaque = opaque;
		this.ctx.respectScreenScale = respectScreenScale;

		return this.ctx;
	}

	/**

        @public @description method to draw a circle at a specified center point using the provided parameters. You can either specify a stroke or fill color.

        @param { {} } param1 - the config object provided to the method
        @param { DrawContext } param1.ctx - the drawContext the method will work on
        @param { Point } param1.center - a point object with x & y coordinates that will be the center of the created arc
        @param { Number } param1.radius - the radius of the circle
        @param { Number } param1.strokeWidth - the width of the stroke
        @param { Color } param1.strokeColor - the color of the stroke 
        @param { Color } param1.fillColor - the color of the fill
        @param { Number } param1.start - the beginning of the arc
        @param { Number } param1.stop - the end of the arc


    */

	drawArc({
		ctx = this.ctx,
		center,
		radius = 0,
		strokeWidth = 1,
		strokeColor = undefined,
		fillColor = undefined,
		start = 0,
		stop = 360,
	} = {}) {
		/*

            Methods to convert degres?

        */

		const sinToDeg = (deg) => Math.sin((deg * Math.PI) / 180);
		const cosToDeg = (deg) => Math.cos((deg * Math.PI) / 180);

		/*

            Create a rectangle that originates from the specified center point and has twice radius width and height

        */

		fillColor != undefined ? ctx.setFillColor(fillColor) : null;
		strokeColor != undefined ? ctx.setStrokeColor(strokeColor) : null;
		ctx.setLineWidth(strokeWidth);

		// if the start is bigger then the stop, add 360 to draw the circle in the other direction

		const degree = start > stop ? stop + 360 : stop;

		for (let i = start; i < degree; i++) {
			let x = center.x + radius * sinToDeg(i) - strokeWidth / 2;
			let y = center.y - radius * cosToDeg(i) - strokeWidth / 2;
			let rectangle = new Rect(x, y, strokeWidth, strokeWidth);

			strokeColor != undefined ? ctx.strokeEllipse(rectangle) : null;
			fillColor != undefined ? ctx.fillEllipse(rectangle) : null;
		}
	}

	/**

		@public @description method to draw a text to a specified point

		@param { {} } param1 - the object passed to the method to configure the text to draw
		@param { DrawContext } param1.ctx - the context passed to the method
		@param { Point } param1.position - the topLeft position of the text or rectangle
		@param { Font } param1.font - the font used to create the text
		@param { Color } param1.textColor - a color passed to color the text
		@param { String } param1.align - aligns the text left, center or right
		@param { Rect } param1.rect - a created Rect Object

	*/

	drawText({
		ctx = this.ctx,
		text,
		position,
		font = Font.mediumSystemFont(10),
		textColor,
		align = 'left',
		rect = undefined,
	} = {}) {
		// set the font & color on the context;

		ctx.setFont(font);
		textColor != undefined ? ctx.setTextColor(textColor) : null;

		// if rect has a width or height value, create a new rectangle on the context

		rect != undefined
			? align == 'center'
				? ctx.setTextAlignedCenter()
				: align == 'left'
				? ctx.setTextAlignedLeft()
				: ctx.setTextAlignedRight()
			: null;

		// draw the text

		rect != undefined
			? ctx.drawTextInRect(text, rect)
			: ctx.drawText(text, position);
	}

	/**

		@description method to draw a line between two specified points

		@param { {} } param1 - the config object provided to the method
        @param { DrawContext } param1.ctx - the drawContext the method will work on
        @param { Point } param1.start - the beginning of the line
        @param { Point } param1.stop - the end of the line
        @param { Number } param1.strokeWidth - the width of the stroke
        @param { Color } param1.strokeColor - the color of the stroke 

	*/

	drawLine({ ctx = this.ctx, start, stop, strokeWidth, strokeColor } = {}) {
		ctx.setStrokeColor(strokeColor);
		ctx.setLineWidth(strokeWidth);

		const path = new Path();
		path.move(start);
		path.addLine(stop);
		ctx.addPath(path);
		ctx.strokePath();
	}

	/*

		@description method to draw an image at either a point or a rectangle

	*/

	drawImage({ ctx = this.ctx, position, image, rect = undefined } = {}) {
		rect
			? ctx.drawImageInRect(image, rect)
			: ctx.drawImageAtPoint(image, position);
	}

	/**

		@description method to draw a line between two specified points

		@param { {} } param1 - the config object provided to the method
        @param { DrawContext } param1.ctx - the drawContext the method will work on
        @param { Point } param1.position - the Postition of the rounded rectangle
        @param { Number } param1.cornerRadius - the radius of the corner
        @param { Color } param1.fillColor - the color of the fill
        @param { Color } param1.strokeColor - the color of the stroke 
        @param { {} } param1.rect - the rect to stroke

	*/

	drawRoundedRectangle({
		ctx = this.ctx,
		position,
		cornerRadius,
		fillColor = undefined,
		strokeColor = undefined,
		rect,
	} = {}) {
		// create a new path and move it to the starting position

		const path = new Path();
		path.move(position);

		fillColor != undefined ? ctx.setFillColor(fillColor) : null;
		strokeColor != undefined ? ctx.setStrokeColor(strokeColor) : null;

		path.addRoundedRect(rect, cornerRadius, cornerRadius);

		ctx.addPath(path);
		fillColor != undefined ? ctx.fillPath() : null;
		strokeColor != undefined ? ctx.strokePath() : null;
	}
}

class Widget {
	constructor({ size, colours, padding, canvasConfig } = {}) {
		this.size = size;
		this.dimensions = Utility.getWidgetSize(this.size);

		// create the colour palette

		this.colours = new ColourPalette(colours);

		this.padding = padding;

		this.canvasConfig = canvasConfig;

		// create a new Widget

		this.widget = new ListWidget();
		this.widget.setPadding(
			this.padding.app,
			this.padding.app,
			this.padding.app,
			this.padding.app
		);
		this.widget.backgroundColor = this.colours.background;

		// add a url tap target to the widget
		this.widget.url = 'https://krankenhausampelbayern.de';
	}

	/**

		@public	@description method to fetch data from a given endpoint and internalize it
		
		@param { {} } param1 - the object containg the endpoint property
		@param { String } param1.endpoint - a string used as endpoint for a request

    */

	async fetchData({ endpoint = '' }) {
		/*

            Await the response and try to parse it as JSON. If an error is thrown, render the Error to the widget in a readable format. This should prevent the widget from crashing if the API breaks because the lgl deceides to change up the website yet again.

        */

		try {
			// try to make the request, if the request is successfull interenalize the data to use inside the widget

			const req = new Request(endpoint);
			this._data = await req.loadJSON();
			Utility.log(this._data);
		} catch (errorMessage) {
			// if an error is thrown, log the error to the console and invoke the handle Error method

			this._handleError({ errorMessage });
			Utility.log(errorMessage);
		}
	}

	/**

        @description method to render the Widgets markup

    */

	renderWidget() {
		/*

			Create the main Data Layer that will hold the canvasStack and textStack 

		*/

		const mainLayer = this.widget.addStack();
		UIElement.alignElement(mainLayer, {
			content: 'top',
			layout: 'vertically',
		});

		// depending on the size, create the appropriate widget

		if (this.size == 'small') {
			this._renderSmallWidget(mainLayer);
		} else if (this.size == 'medium') {
			this._renderMediumWidget(mainLayer);
		} else {
			this._handleError({
				errorMessage: `${this.size} is not a recognized WidgetSize.`,
			});
		}
	}

	_formatData() {
		// extract the history

		const { numberOfDataSets, timeStamp, history } = this._data;

		const mostCurrentData = history[history.length - 1];

		return {
			timeStamp,
			numberOfDataSets,
			history,
			incData: mostCurrentData.hospitalizedIncidence,
			hosData: mostCurrentData.hospitalized7Days,
			icuData: mostCurrentData.icuOccupation,
			vacData: mostCurrentData.vaccination,
		};
	}

	_renderSmallWidget(targetLayer) {
		// get the data needed for the Widget

		const { hosData, icuData } = this._formatData();
		console.log({ hosData, icuData });

		/*

			Get the percentage values for the hospitalization and icuoccupancy rate

		*/

		const hosPercentage = Utility.toPercentage(
			hosData.value,
			hosData.threshold
		);
		const icuPercentage = Utility.toPercentage(
			icuData.value,
			icuData.threshold
		);

		/*

            Create a new UICanvasElement to draw to. 

        */

		const canvas = new UICanvasElement();

		const ctx = canvas.getDrawContext({
			respectScreenScale: true,
			opaque: false,
		});

		canvas.width = this.dimensions.width - this.padding.app * 2;
		canvas.height = this.dimensions.height - this.padding.app * 2;

		// clear the canvas of all previously drawn images

		canvas.clearCanvas();

		/*
	
				Helper funtctions to convert relative units to pixel units, this makes layouting for different widget sizes easier. 
	
			*/

		const vw = canvas.getViewPortWidthFunction();
		const vh = canvas.getViewPortHeightFunction();

		// define values to draw the two percentage circles

		const centerOffsetY = vh(this.canvasConfig.offsetY);
		const circlePoint = new Point(
			canvas.center.x,
			canvas.center.y + centerOffsetY
		);
		const arcSpan = this.canvasConfig.arcSpan;
		const start = 360 - arcSpan / 2;

		// calculate the radius according to the canvas width
		const r1 = vw(25);
		const r2 = vw(33);

		/*
	
				Calculate the necessary degrees out of the provided percentage values. Math.min is used to range the percentages to a maximum of 100
	
			*/

		const icuDegs = Math.min(
			Utility.fromPercentage(icuPercentage, arcSpan),
			arcSpan
		);

		const hospiDegs = Math.min(
			Utility.fromPercentage(hosPercentage, arcSpan),
			arcSpan
		);

		canvas.drawArc({
			center: circlePoint,
			radius: r1,
			strokeWidth: this.canvasConfig.arcWidth,
			fillColor: this.colours.redShade,
			start,
			stop: (start + arcSpan) % 360,
		});

		canvas.drawArc({
			center: circlePoint,
			radius: r1,
			strokeWidth: this.canvasConfig.arcWidth,
			fillColor: this.colours.red,
			start,
			stop: (start + icuDegs) % 360,
		});

		canvas.drawArc({
			center: circlePoint,
			radius: r2,
			strokeWidth: this.canvasConfig.arcWidth,
			fillColor: this.colours.blueShade,
			start,
			stop: (start + arcSpan) % 360,
		});

		canvas.drawArc({
			center: circlePoint,
			radius: r2,
			strokeWidth: this.canvasConfig.arcWidth,
			fillColor: this.colours.blue,
			start,
			stop: (start + hospiDegs) % 360,
		});

		/*
	
				Create the Labels and textElements
	
			*/

		canvas.drawText({
			text: `🚦Covid 19 - Bayern`.toUpperCase(),
			font: Font.semiboldSystemFont(11),
			textColor: this.colours.textShade,
			rect: new Rect(0, vh(1), canvas.width, vh(11)),
			align: 'center',
		});

		ctx.setLineWidth(2);
		ctx.setStrokeColor(this.colours.backgroundShade);
		ctx.strokeRect(new Rect(-1, -1, canvas.width + 2, vh(11) + vh(5)));

		canvas.drawText({
			text: `${icuData.value}`,
			font: Font.boldSystemFont(16),
			textColor: this.colours.red,
			align: 'center',
			rect: new Rect(
				0,
				canvas.center.y + vw(6) - vw(6) + centerOffsetY,
				canvas.width,
				16
			),
		});
		canvas.drawText({
			text: `${hosData.value}`,
			font: Font.boldSystemFont(16),
			textColor: this.colours.blue,
			align: 'center',
			rect: new Rect(
				0,
				canvas.center.y - vw(6) - vw(6) + centerOffsetY,
				canvas.width,
				16
			),
		});

		// get the new cases for the its and hospitalization

		const hosOldValue = hosData.lastValue != null ? hosData.lastValue : 0;
		const hosNewCases = hosData.value - hosOldValue;

		const icuOldValue = icuData.lastValue != null ? icuData.lastValue : 0;
		const icuNewCases = icuData.value - icuOldValue;

		canvas.drawText({
			text: `KH-Belegung: ${
				hosNewCases >= 0 ? `+${hosNewCases}` : hosNewCases
			}`,
			font: Font.semiboldSystemFont(10),
			textColor: this.colours.blue,
			rect: new Rect(
				vw(10),
				canvas.center.y + vh(19) + centerOffsetY,
				vw(80),
				vh(10)
			),
			align: 'center',
		});

		canvas.drawText({
			text: `ITS-Belegung: ${
				icuNewCases >= 0 ? `+${icuNewCases}` : icuNewCases
			}`,
			font: Font.semiboldSystemFont(10),
			textColor: this.colours.red,
			rect: new Rect(
				vw(10),
				canvas.center.y + vh(30) + centerOffsetY,
				vw(80),
				vh(10)
			),
			align: 'center',
		});

		/*
	
			Create a element that will hold the image exported from the canvas, and then attach the image to it
	
		*/

		const canvasStack = targetLayer.addStack();

		// in dev mode, add a border to the element to be better able to track the position of the element

		widgetConfig.dev
			? UIElement.setBorder(canvasStack, {
					borderColor: this.colours.error,
			  })
			: null;
		canvasStack.addImage(ctx.getImage());
	}

	_renderMediumWidget(targetLayer) {
		// get the needed data
		const { hosData, icuData, incData, vacData } = this._formatData();

		targetLayer.setPadding(4, 0, 4, 0);

		/*

            Create a new UICanvasElement to draw to. 

        */

		const canvas = new UICanvasElement();

		const ctx = canvas.getDrawContext({
			respectScreenScale: true,
			opaque: true,
		});

		canvas.width = this.dimensions.width - this.padding.app * 2;
		canvas.height = this.dimensions.height - this.padding.app * 2;

		// clear the canvas of all previously drawn images

		canvas.clearCanvas();

		/*
		
			Helper funtctions to convert relative units to pixel units, this makes layouting for different widget sizes easier. 
		
		*/

		const vw = canvas.getViewPortWidthFunction();
		const vh = canvas.getViewPortHeightFunction();

		/*

			Add a Heading to the Stack

		*/

		canvas.drawText({
			text: `🚦Covid 19 - Bayern`.toUpperCase(),
			font: Font.semiboldSystemFont(11),
			textColor: this.colours.textShade,
			rect: new Rect(0, vh(1), canvas.width, vh(15)),
			align: 'center',
		});

		canvas.drawLine({
			start: new Point(vw(5), vh(15)),
			stop: new Point(vw(95), vh(15)),
			strokeWidth: 2,
			strokeColor: this.colours.backgroundShade,
		});

		/*

			Create the details segments. The Segments consist of the value line and the percentage bar. 

			The Layout can be described as follows:

			The remaining height after the Heading is aproxamatley
			20vh - 100vh
			20vh to 55vh 	- Hospitalization values
			55vh to 90vh	- ICU values
			90vh to 100vh	- Vaccination & Incidence Values

		*/

		const createDetailSegments = ({ position, data, title, colors }) => {
			// calculate new cases

			const oldValue = data.lastValue != null ? data.lastValue : 0;
			const newCaseValue = data.value - oldValue;

			// create the strings to display
			const currentValues = `${data.value} / ${data.threshold}`;
			const newCases = `${
				newCaseValue >= 0 ? `+${newCaseValue}` : newCaseValue
			}`;

			/*

				The layout for the text segments 

				2vh		0vw - 35vw 	- 40vw - 55vw 		- 65vw - 90vw
				15vh	title		currentValues		newCases

				18vh	0vw - 100vw
				27vh	progressbar

			*/

			// draw the title

			canvas.drawText({
				text: `${title}:`,
				font: Font.boldSystemFont(14),
				textColor: colors.main,
				rect: new Rect(position.x, position.y + vh(2), vw(35), vh(13)),
			});

			// draw the currentValues

			canvas.drawText({
				text: currentValues,
				font: Font.semiboldSystemFont(13),
				textColor: this.colours.text,
				align: 'center',
				rect: new Rect(
					position.x + vw(37),
					position.y + vh(3.25),
					vw(26),
					vh(13)
				),
			});

			// draw the new values

			canvas.drawText({
				text: newCases,
				font: Font.boldSystemFont(13),
				textColor: newCases >= 0 ? this.colours.red : this.colours.blue,
				rect: new Rect(
					position.x + vw(70),
					position.y + vh(3.25),
					vw(15),
					vh(13)
				),
			});

			// draw the progress bar

			const percentage = Utility.toPercentage(data.value, data.threshold);

			canvas.drawRoundedRectangle({
				position: new Point(position.x, position.y + vh(19)),
				cornerRadius: 4,
				fillColor: colors.shade,
				rect: new Rect(
					position.x,
					position.y + vh(19),
					vw(100),
					vh(11)
				),
			});

			canvas.drawRoundedRectangle({
				position: new Point(position.x, position.y + vh(19)),
				cornerRadius: 4,
				fillColor: colors.main,
				rect: new Rect(
					position.x,
					position.y + vh(19),
					vw(percentage),
					vh(11)
				),
			});

			canvas.drawText({
				text: `${percentage}%`,
				font: Font.semiboldSystemFont(10),
				align: 'center',
				textColor: this.colours.text,
				rect: new Rect(
					position.x,
					position.y + vh(20),
					vw(100),
					vh(11)
				),
			});
		};

		// create the two details segments

		createDetailSegments({
			position: new Point(0, vh(18)),
			data: hosData,
			title: 'KH-Belegung',
			colors: {
				main: this.colours.blue,
				shade: this.colours.blueShade,
			},
		});

		createDetailSegments({
			position: new Point(0, vh(51)),
			data: icuData,
			title: 'ITS-Belegung',
			colors: {
				main: this.colours.red,
				shade: this.colours.redShade,
			},
		});

		// add the vacc and incidence text Line

		canvas.drawText({
			text: `KH-Inzidenz: ${incData.value.toFixed(1)}`,
			font: Font.semiboldSystemFont(12),
			textColor: this.colours.text,
			rect: new Rect(0, vh(88), vw(35), vh(13)),
		});

		const incOldValue = incData.lastValue != null ? incData.lastValue : 0;
		const incNewCases = incOldValue - incData.value;

		canvas.drawText({
			text: `${
				incNewCases >= 0
					? `+${incNewCases.toFixed(1)}`
					: incNewCases.toFixed(1)
			}`,
			font: Font.mediumSystemFont(9),
			textColor: this.colours.textShade,
			rect: new Rect(vw(35), vh(90), vw(15), vh(9)),
		});

		canvas.drawText({
			text: `Impfquote: ${vacData.value.toFixed(1)}%`,
			font: Font.semiboldSystemFont(12),
			textColor: this.colours.text,
			rect: new Rect(vw(45), vh(88), vw(40), vh(13)),
		});

		const vacOldValue = vacData.lastValue != null ? vacData.lastValue : 0;
		const vacNewCases = vacData.value - vacOldValue;

		canvas.drawText({
			text: `${
				vacNewCases >= 0
					? `+${vacNewCases.toFixed(1)}`
					: vacNewCases.toFixed(1)
			}%`,
			font: Font.mediumSystemFont(9),
			textColor: this.colours.textShade,
			rect: new Rect(vw(82), vh(90), vw(15), vh(9)),
		});

		/*
	
			Create a element that will hold the image exported from the canvas, and then attach the image to it
	
		*/

		const canvasStack = targetLayer.addStack();

		// in dev mode, add a border to the element to be better able to track the position of the element

		widgetConfig.dev
			? UIElement.setBorder(canvasStack, {
					borderColor: this.colours.error,
			  })
			: null;
		canvasStack.addImage(ctx.getImage());
	}

	/**

        @public @description method to present the Widget either as widget on the app screen or open the Widget as presenter. This Method is called to start the Widget

    */

	present() {
		// try to render the widget

		this.renderWidget();

		// present and complete the Widget

		config.runsInWidget
			? Script.setWidget(this.widget)
			: this._setWidgetWithSize();

		Script.complete();
	}

	/**

        @description @private method to create the Widget according to it's size

    */

	_setWidgetWithSize() {
		this.size == 'small'
			? this.widget.presentSmall()
			: this.widget.presentMedium();
	}

	/**

		@private @description method to dispatch and render a error message

		@param { {} } param1 - object passed to the methid
		@param { String } param1.errorMessage - the error message

	*/

	_handleError({ errorMessage }) {
		// create a new Stack attached to the Widget to hold the error message

		const errorStack = this.widget.addStack();
		UIElement.setBorder(errorStack, {
			borderWidth: 1,
			borderColor: this.colours.error,
		});
		UIElement.alignElement(errorStack, {
			content: 'center',
			layout: 'horizontal',
		});
		errorStack.setPadding(4, 4, 4, 4);

		// create and append the error message

		UITextElement.createText(errorStack, errorMessage, {
			color: this.colours.error,
			font: Font.mediumSystemFont(8),
			align: 'center',
		});
	}
}

// the api endpoint used to request the data from

const endpoint = 'https://ampeldashboardbayern.herokuapp.com/api/data';

// instanciate the widget and execute it

const widget = new Widget({ canvasConfig, ...widgetConfig });
await widget.fetchData({ endpoint });
widget.present();
