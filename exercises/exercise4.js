/* 
	Exercise 4 Description: 
		A game where the user tries to press and hold on as many shapes as possible
*/

// #region game canvas setup
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;

var gameCanvasHTML;

window.addEventListener("resize", function(){
	console.log("This be resizing matey!!")
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;

	gameCanvasHTML.style.width = gameWidth + "px";
	gameCanvasHTML.style.height = gameHeight + "px";
})

function setup() {
	createCanvas(gameWidth, gameHeight);

	gameCanvasHTML = document.getElementById("defaultCanvas0");

	generateShapeList(3, 100);
}

// #endregion


// #region Game Loop
let shapeList = [];

function generateShapeList(numShapes, sizeInPx){
	shapeList = [];

	for(let i = 0; i < numShapes; i++){
		// Determine properties for this shape
		let shapeClass = "circle";
		// Find an xPos within the range: [sizeInPx, gameWidth - sizeInPx]
		let xPos = sizeInPx + ((gameWidth -  2 * sizeInPx) * Math.random());
		// Find a yPos within the range: [sizeInPx, gameHeight - sizeInPx]
		let yPos = sizeInPx + ((gameHeight -  2 * sizeInPx) * Math.random());
		// Find a value between 0 and 360 degrees to rotate the shape by 
		let shapeRotation = Number( (360 * Math.random()).toFixed(2) );

		// Add this shape to the list
		shapeList.push({
			class: shapeClass,
			x: xPos,
			y: yPos,
			size: sizeInPx,
			rotation: shapeRotation,
		});
	}
}


function draw() {
	background(220);
}
// #endregion


// #region Helper functions
function percentToPx(percentNum){

}

// #endregion
