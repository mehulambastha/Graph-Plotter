// * Program to plot line charts on the basis of (x,y) coordinates supplied in JSON format
// * Made by: Mehul Ambastha
// * Last updated: 11-5-2020
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

		//assigning the scaled coordinates(returned from scaleCoordinates function) to points variable
		let points = scaleCoordinates(chartPoints.coordinates);
		let axisMargin = 60;
		drawAxes(points, axisMargin);
		drawChart(points, axisMargin); //calling the drawChart function with the scaled points array as argument
	} else {
		//if any error occurs, log the stutus and the ready state of AJAX call
		console.log(`Status: ${this.status}; Ready state: ${this.readyState}`);
	}
}

//This function scales the coordinates by a suitable scale factor(currently it just scales it 5 times)
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
					`(${coords[index].x / 5}, ${coords[index].y / 5})`,
					coords[index].x + margin - 37,
					canvas.height - (coords[index].y + margin) - 20
				);
			} else {
				// else if the current point is higher on the canvas than the previous point, then pull the coordinate text up by 20 pixels to make it clear
				ctx.fillText(
					`(${coords[index].x / 5}, ${coords[index].y / 5})`,
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
				canvas.height - (coords[index].y + margin) - 20
			);
		}
	}
	//finally stroke the lines.
	ctx.stroke();
}

function drawAxes(data, margin) {
	ctx.fillStyle = 'black';
	ctx.lineWidth = 3;
	ctx.lineCap = 'round';
	ctx.font = 'bold 20px Lucida Console Regular';

	ctx.moveTo(margin, canvas.height - margin);
	ctx.fillText('0', margin - 20, canvas.height - (margin - 20));
	ctx.lineTo(margin, 40);
	ctx.moveTo(margin, canvas.height - margin);
	ctx.lineTo(canvas.width - 40, canvas.height - margin);

	ctx.stroke();
}
