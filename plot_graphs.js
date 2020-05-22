// * Program to plot line charts on the basis of (x,y) coordinates supplied in JSON format
// * Made by: Mehul Ambastha
// * Last updated: 22-5-2020
// ? NEXT: how to make this whole application object oriented?

'use strict';

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let xhr = new XMLHttpRequest();

//xhr events
xhr.open('GET', 'sample_data.json', true);
xhr.send(); //send the request

//the line below replaces xhr.onload
xhr.addEventListener('load', fetchChartCoordinates); //fetchChartCoordinatesis a callback function

let chartPoints = {
	coordinates: [],
	lineCol: prompt('What color do you want the line chart to be?'),
};

//  Function to fetch the data from local json file
// eslint-disable-next-line no-unused-vars
function fetchChartCoordinates(_responseEvent) {
	if (this.status === 200 && this.readyState === 4) {
		chartPoints.coordinates = JSON.parse(this.responseText); //parsing the JSON and storing it in coordinates property of chartPoints

		let points = scaleCoordinates(chartPoints.coordinates); //assigning the scaled coordinates(returned from scaleCoordinates function) to points variable

		let axisMargin = 50; //this variable holds the margin of the whole chart from the left and bottom of the canvas

		drawAxes(points, axisMargin); //drawAxes() draws the x and y axes along with scale intervals
		drawChart(points, axisMargin); //calling the drawChart function with the scaled points array as argument
	} else {
		//if any error occurs, log the stutus and the ready state of AJAX call
		console.log(`Status: ${this.status}; Ready state: ${this.readyState}`);
	}
}

//This function scales the coordinates by a suitable scale factor(currently it just scales it 5 times and returns it)
function scaleCoordinates(data) {
	// TODO: Analyse the arguments and then decide a suitable scale factor and then scale the coordinates

	//iterating through coordinates array (containing fetched points) and incrementing every coordinate by a factor of X5
	data.forEach((element) => {
		element.x *= 5;
		element.y *= 5;
	});
	return data; //returning the scaled coordinates
}

//the main function which actually draws the chart/graph
function drawChart(coords, margin) {
	ctx.beginPath(); //beginning the path
	ctx.lineWidth = 5; //setting the linewidth
	ctx.strokeStyle = chartPoints.lineCol; //setting stroke color

	ctx.moveTo(margin + 3, canvas.height - (margin + 3)); // moving the pen to the middle-y position in canvas

	ctx.font = '15px Fira Code '; // setting the  and typeface
	ctx.fillStyle = 'black'; // setting the font color

	// iterating through coords array (containing scaled coordinates) and drawing line to each of the passed coordinate
	for (const [index] of coords.entries()) {
		//*const index holds the index of the current element during iteration

		// draws line to each of the coordinates passed
		ctx.lineTo(
			coords[index].x + margin,
			canvas.height - (coords[index].y + margin)
		);

		// * conditional to check whether the current element in iteration is the first element or not (it checks the element at index - 1 and sees if that exists)
		if (coords[index - 1]) {
			//another conditional to check if the 'y' coordinate of the previous point is greater or lower than the the 'y' coordinate of current point(current element in iteration)
			if (coords[index].y >= coords[index - 1].y) {
				// if the 'y' of current point is more/greater than that of previous point, i.e., current point is lower on canvas than previous point, then push the coordinate text by 30 pixels so that it doesn't overlap with the line
				ctx.fillText(
					`(${coords[index].x / 5},${coords[index].y / 5})`,
					coords[index].x + margin - 37,
					canvas.height - (coords[index].y + margin) - 12
				);
			} else {
				// else if the current point is higher on the canvas than the previous point, then pull the coordinate text up by 20 pixels to make it clear
				ctx.fillText(
					`(${coords[index].x / 5},${coords[index].y / 5})`,
					coords[index].x + margin - 37,
					canvas.height - (coords[index].y + margin) + 20
				);
			}
		} else {
			// * since the first point in a line graph/chart is always higher than the origin, there is no need to check the prev/next point's 'y' coordinate.

			//else if the current element in iteration is the first element, then pull the coordinate text by 20 pixels
			ctx.fillText(
				`(${coords[index].x / 5}, ${coords[index].y / 5})`,
				coords[index].x + margin - 37,
				canvas.height - (coords[index].y + margin) - 12
			);
		}
	}
	//finally stroke/render the lines.
	ctx.stroke();
}

//this function draws the x-y axes and renders the scale intervals on the axes
function drawAxes(data, margin) {
	ctx.fillStyle = 'black'; //the color of the text
	ctx.lineWidth = 3; //width of the axes(lines)
	ctx.lineCap = 'round'; //linecap-round so that it looks smooth

	ctx.moveTo(margin, canvas.height - margin); //move to the origin of the chart

	ctx.font = 'bold 20px Arial'; //specific font settings for the 'o' of origin
	ctx.fillText('O', margin - 20, canvas.height - (margin - 20)); //render 'O' at origin(subtracting 20 from both x and y positions so that it doesn't overlap with the axes)

	ctx.lineTo(margin, margin); //draws the y axis
	ctx.moveTo(margin, canvas.height - margin); //move to origin again
	ctx.lineTo(canvas.width - margin, canvas.height - margin); //draw the x axis
	ctx.font = 'bold 15px Lucida Console Regular'; //The best default font out there, you know!
	ctx.stroke(); //stroke the axes

	let axisMark = 10; // this is the number displayed alongside the x and y axes (the unit marks on the axes)
	let scaleInterval = 50; //this is the distance between successive axisMarks

	// *this loop creates the axis marks on both the axes
	for (var i = 0; i <= 17; i++) {
		// for the y axis
		ctx.fillText(
			`${axisMark}`,
			margin - 30, //  x-position is margin-30 so that it doesn't overlap with the y axis line
			canvas.height - (margin + scaleInterval) // y position of axis mark is at every scaleInterval
		);

		ctx.fillText(
			`${axisMark}`,
			margin + (scaleInterval - 7.5), //so that the actual point (at every scale interval)is axisMark's number's mid-point
			canvas.height - (margin - 25) // moving the axis mark below the x axis
		);

		axisMark += 10; //incrementing the axisMark (like 10, 20, 30)
		scaleInterval += 50; //incrementing scaleInterval so that every successive axisMark is 50 pixels ahead of the previous mark
		console.log(axisMark); //testing
	}
}
