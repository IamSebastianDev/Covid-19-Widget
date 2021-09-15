/** @format */

/**

Copyright 2021 Sebastian Heinz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/*

    Du kannst die folgenden variablen benutzen um dein Widget zu gestalten. Du kannst diese ändern, ohne dass das Widget nicht mehr funktioniert.

*/

/*

    Farbpalette

    - Farben können hier definiert werden. Du benötigst hierfür den Farbcode als HEX oder RGBA() wert.

*/

const HintergrundFarbe = '#000000';
const HintergrundFarbeSchattiert = '#242424';
const TextFarbe = '#FFFFFF';

// Farbe für positive Trends
const AkkzentPositiv = '#39A0ED';
// Farbe für negative Trends
const AkkzentNegativ = '#FF5A5F';
// Farbe für gleichbleibende Trends
const AkkzentNeutral = '#FFFFFF';
// Farbee für Kontrastierende Elemente
const AkkzentKontrast = '#FF5A5F';

// Für einen Verlauf kannst du hier beide Farben definieren.

const HintergrundVerlaufStop1 = undefined;
const HintergrundVerlaufStop2 = undefined;

/*

    Aussehen & Layout

    - Größe: Zulässige größen sind 'small', 'medium' & 'large'.
    - padding: Wie viel Platz um den Inhalt des Widgets sein soll. Nur numerische Werte sind zulässig.
    - Skalierungsfaktor: Dynamisches vergrößern oder verkleinern der Elemente kann mit diesem Faktor gesteuert werden.
    - Layout: Die Anordnung der Detail elemente

*/

const WidgetGröße = 'small';
const Padding = 8;
const Skalierungsfaktor = 1;
const Layout = ['Kapazität', 'Prozentanteil', 'Trend'];

/*

    Achtung! Ab hier nur noch werte ändern, wenn du weißt was du tust.

*/

class Colours {
	constructor(
		backgroundColor,
		backgroundShade,
		backgroundGradientStop1,
		backgroundGradientStop2,
		textColor,
		accentPositive,
		accentNegative,
		accentNeutral,
		accentContrast
	) {
		this.backgroundColor = new Color(backgroundColor);
		this.backgroundShade = new Color(backgroundShade);
		this.textColor = new Color(textColor);
		this.accentPositive = new Color(accentPositive);
		this.accentNegative = new Color(accentNegative);
		this.accentNeutral = new Color(accentNeutral);
		this.accentContrast = new Color(accentContrast);

		this.backgroundGradient = this.createGradient(
			backgroundGradientStop1,
			backgroundGradientStop2
		);
	}
	createGradient(stop1, stop2) {
		if (stop1 == undefined || stop2 == undefined) {
			return;
		}

		let gradient = new LinearGradient();
		gradient.colors = [new Color(stop1), new Color(stop2)];
		gradient.locations = [0, 1];

		return gradient;
	}
	get gradientSet() {
		return this.backgroundGradient ? true : false;
	}
}

class Widget {
	/**

        @constructor

        @param { Object } param1; 
        @param { {} } param1.colours - Object containing colours for the widget to use
        @param { Number } param1.padding - A Number describing the padding for the Element
        @param { String } param1.size - A String describing the supposed size of the widget
        @param { Number } param1.spacing - A Number describing the amount of space between Elements in the stack
        @param { Number } param1.scale - A Number describing the scale factor. All elements will be scaled by this amount
        @param { String } param1.url - the URL that will be opened by interacting with the widget

    */

	constructor({ colours, padding, size, scale = 1, url }) {
		this.widget = new ListWidget();
		this.size = size;
		this.colours = colours;
		this.padding = padding * scale;
		this.scale = scale;

		this.widget.url = url;

		this.styleWidget();
	}
	styleWidget() {
		this.widget.backgroundColor = this.colours.backgroundColor;
		this.widget.backgroundGradient = this.colours.gradientSet
			? this.colours.backgroundGradient
			: null;

		if (typeof this.padding !== 'number') {
			new TypeError(`Padding is not of type 'number'.`);
			this.padding = 6 * this.scale;
		}

		this.widget.setPadding(
			this.padding,
			this.padding,
			this.padding,
			this.padding
		);
	}
	setWidgetSize() {
		switch (this.size) {
			case 'small':
				this.widget.presentSmall();
				break;
			case 'medium':
				this.widget.presentMedium();
				break;
			case 'large':
				this.widget.presentLarge();
				break;
			default:
				break;
		}

		Script.complete();
	}
	present() {
		config.runsInWidget
			? Script.setWidget(this.widget)
			: this.setWidgetSize();
	}
}

// create a new Colourpalete

const colours = new Colours(
	HintergrundFarbe,
	HintergrundFarbeSchattiert,
	HintergrundVerlaufStop1,
	HintergrundVerlaufStop2,
	TextFarbe,
	AkkzentPositiv,
	AkkzentNegativ,
	AkkzentNeutral,
	AkkzentKontrast
);

// Url that is called when the widget is interacted with

const url = 'https://www.krankenhausampelbayern.de';

// create the new Widget by instanciating a new class and calling the present method.

const widget = new Widget({
	colours,
	padding: Padding,
	size: WidgetGröße,
	scale: Skalierungsfaktor,
	url,
});

class Helper {
	/*

	Helper method to retrieve symbols

	*/

	static createSymbol = (symbolName) => {
		let sym = SFSymbol.named(symbolName);
		sym.applySemiboldWeight();

		return sym;
	};
}

/*

	Class that handles UIElements represantation

*/

class UILayer {
	constructor({ widget }) {
		this.widget = widget.widget;
		this.uiVars = widget;
		this.shell = this.renderContainingLayer();
	}
	renderContainingLayer() {
		const layer = this.widget.addStack();
		layer.layoutVertically();
		layer.centerAlignContent();

		return layer;
	}
}

class UIText extends UILayer {
	constructor({ widget }) {
		super({ widget });
	}

	render(
		textString,
		{
			backgroundColor,
			textColour,
			textAlign = 'center',
			cornerRadius = 5,
			padding = [5, 3, 5, 3],
		} = {}
	) {
		const textLayer = this.shell.addStack();
		textLayer.layoutHorizontally();
		textLayer.backgroundColor = backgroundColor;

		const [top, left, bottom, right] = padding;

		textLayer.setPadding(
			top * this.uiVars.scale,
			left * this.uiVars.scale,
			bottom * this.uiVars.scale,
			right * this.uiVars.scale
		);
		textLayer.cornerRadius = cornerRadius;

		const text = textLayer.addText(textString);
		text.textColor = textColour;
		text.font = Font.mediumSystemFont(11 * this.uiVars.scale);
		text.minimumScaleFactor = 0.5;
		textAlign == 'center'
			? text.centerAlignText()
			: alginment == 'left'
			? text.leftAlignText()
			: text.rightAlignText();
	}
}

class UIDataLayer extends UILayer {
	constructor({ widget }) {
		super({ widget });
	}

	render(data, { spacer = 6 } = {}) {
		const dataLayer = this.shell.addStack();
		dataLayer.layoutVertically();
		dataLayer.setPadding(4, 0, 4, 0);

		const dataHeadingRow = dataLayer.addStack();
		dataHeadingRow.layoutHorizontally();
		dataHeadingRow.centerAlignContent();

		const dataHeading = dataHeadingRow.addText(
			`${
				data.id === 'incidence'
					? data.title.german.short
					: data.title.german.full
			}`
		);
		dataHeading.font = Font.mediumSystemFont(11);
		dataHeading.textColor = Colours.text;

		dataHeadingRow.addSpacer(spacer);

		const trendIndicatorSym =
			data.trend == 1
				? Helper.createSymbol(`arrow.up.right`)
				: data.trend == -1
				? Helper.createSymbol(`arrow.down.right`)
				: Helper.createSymbol(`arrow.right`);

		const trendIndicator = dataHeadingRow.addImage(trendIndicatorSym.image);
		trendIndicator.imageSize = new Size(8, 8);
		trendIndicator.tintColor =
			data.trend == 1
				? colours.accentNegative
				: data.trend == -1
				? colours.accentPositive
				: colours.accentNeutral;

		const details = dataLayer.addStack();
		details.layoutHorizontally();
		details.bottomAlignContent();

		const renderCapacity = (stack) => {
			const currentValue = stack.addText(
				data.threshold === undefined
					? `${data.value}`
					: `${data.value} / ${data.threshold}`
			);
			currentValue.font = Font.lightSystemFont(10);
			currentValue.textColor =
				data.threshold != undefined
					? data.value < data.threshold
						? colours.accentPositive
						: colours.accentNegative
					: colours.accentNeutral;

			stack.addSpacer(spacer);
		};

		const renderPercentage = (stack) => {
			const percentValue = stack.addText(
				data.threshold != undefined
					? `${((100 * data.value) / data.threshold).toFixed(2)}%`
					: ''
			);
			percentValue.font = Font.lightSystemFont(10);
			percentValue.textColor = colours.accentNeutral;
			stack.addSpacer(spacer);
		};

		const renderNewCases = (stack) => {
			const newCases = stack.addText(
				Number.isInteger(data.newCases)
					? data.newCases > 0
						? `+ ${data.newCases}`
						: `${data.newCases}`
					: data.newCases > 0
					? `+ ${data.newCases.toFixed(2)}`
					: `${data.newCases.toFixed(2)}`
			);
			newCases.font = Font.lightSystemFont(10);
			newCases.textColor =
				data.newCases > 0
					? colours.accentNegative
					: colours.accentPositive;

			stack.addSpacer(spacer);
		};

		Layout.forEach((elem) => {
			switch (elem) {
				case 'Kapazität':
					renderCapacity(details);
					break;
				case 'Prozentanteil':
					renderPercentage(details);
					break;
				case 'Trend':
					renderNewCases(details);
				default:
					break;
			}
		});
	}
}

/**

	@description Errorhandling class with a dispatch method to render Errors to the Widgetstack

*/

class UIError {
	constructor({ widget }) {
		this.widget = widget.widget;
	}

	/**

		@description method to render an error string to the widgetStack.

		@param { String } error - Errormessage to render

	*/

	dispatch(error) {
		// create the container for the error message

		const layer = this.widget.addStack();
		layer.setPadding(10, 10, 10, 10);
		layer.layoutHorizontally();
		layer.centerAlignContent();
		layer.borderWidth = 1;
		layer.borderColor = colours.accentNegative;

		// create and render the actual message to the container

		const message = layer.addText(`${error}`);
		message.font = Font.mediumSystemFont(10);
		message.textColor = colours.accentNegative;
		message.centerAlignText();
	}
}

// instance a new UIError as ErrorHandler

const ErrorHandler = new UIError({ widget });

/*

	Function to fetch the data from the API

*/

const fetchDataSet = async ({ endpoint = '' }) => {
	/*

        Await the response and try to parse it as JSON. If an error is thrown, render the Error to the widget in a readable format. This should prevent the widget from crashing if the API breaks because the lgl deceides to change up the website yet again.

    */

	try {
		const req = new Request(endpoint);
		return await req.loadJSON();
	} catch (e) {
		// if an error is thrown, log the error to the console and invoke the handle Error method

		console.log(e);
		ErrorHandler.dispatch(e);
	}
};

const endpoint = 'https://ampeldashboardbayern.herokuapp.com/api/data';
const DataSet = await fetchDataSet({ endpoint });

/*

	Render the necessary elements to the widget

*/

const Heading = new UIText({ widget });
Heading.render(`🚦Covid 19 - Bayern`.toUpperCase(), {
	backgroundColor: colours.backgroundShade,
	textColour: colours.textColor,
	padding: [5, 3, 5, 7],
});

try {
	const incidence = new UIDataLayer({ widget });
	incidence.render(DataSet.incidence, { Layout, spacer: 8 });
	const hospitalization = new UIDataLayer({ widget });
	hospitalization.render(DataSet.hospitalization, { Layout, spacer: 8 });
	const icuOccupancy = new UIDataLayer({ widget });
	icuOccupancy.render(DataSet.icuOccupancy, { Layout, spacer: 8 });
} catch (e) {
	ErrorHandler.dispatch(e);
}

widget.present();
