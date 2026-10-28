/* 
	Exercise 4 Description: 
		A game where the user tries to press and hold on as many shapes as possible.
		The game gets hard by adding more shapes and adding moving shapes as the rounds continue.
*/

// #region global variables
	// Vars for handling the game's html canvas
	let gameWidth = window.innerWidth;
	let gameHeight = window.innerHeight;
	var gameCanvasHTML;

	// Vars for the game's core functionality
	let inGame = false;
	let inRound = false;
	let timeRemaining = 0; //time remaining in the round in ms
	let roundNum = 0;

	let shapeList = [];
	const totalHoldTimeMS = 3000;
	let totalProgress = 0;

	// Vars for calculating deltaTime
	var lastFrame;
	var thisFrame;
	var deltams = 0;
// #endregion

// #region game setup
// Game canvas setup
window.addEventListener("resize", function(){
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;

	gameCanvasHTML.style.width = gameWidth + "px";
	gameCanvasHTML.style.height = gameHeight + "px";
})

// #region Pointer tracking setup and functions
	// Create a collection of pointers that show where the user is pressing the touch screen
	const pointerMap = new Map();

	window.addEventListener("pointerdown", (evt) =>{
		if (evt.pointerType != "mouse"){
			let pointerObj = {
				x: evt.x,
				y: evt.y,
			};

			pointerMap.set(evt.pointerId, pointerObj);
		}
	});
	window.addEventListener("pointermove", (evt) =>{
		if (evt.pointerType != "mouse"){
			pointerMap.get(evt.pointerId).x = evt.x;
			pointerMap.get(evt.pointerId).y = evt.y;
		}
	});
	window.addEventListener("pointerup", (evt) =>{
		if (evt.pointerType != "mouse"){
			pointerMap.delete(evt.pointerId);
		}
	});
// #endregion

// Start new game function
function startGame(){
	roundNum = 1;
	inRound = true;
	timeRemaining = 60000;
	generateShapeList(3, 150);
	
	$("#instructions-panel").hide();
	updateRoundInfoPane();
	$("#round-info-pane").show();
	inGame = true;
}

// p5.js Setup
function setup() {
	createCanvas(gameWidth, gameHeight);

	gameCanvasHTML = document.getElementById("defaultCanvas0");

	// This is required for the site to handle more than 3 touches at the same time
	gameCanvasHTML.style.touchAction = "none";

	// Show instructions panel
	$(document).ready(() => {
		$("#instructions-panel").show();
		$("#round-info-pane").hide();
		$("round-complete-panel").hide();
	});
}
// #endregion


// #region Game Loop

// Function to create a new shape list
function generateShapeList(numShapes, sizeInPx){
	// Reset shape list
	shapeList = [];

	// Check to see if a new shape intersects with any existing shapes
	function checkIntersections(xPos, yPos){
		// false means there is no intersection
		// true means there is an intersection
		if(shapeList.length == 0){
			return false;
		}

		// Loop through each shape to check for intersections
		for(let shape of shapeList){
			if(circleOverlapTest(xPos, yPos, shape.x, shape.y, sizeInPx / 2, shape.size / 2)){
				return true;
			}
		}

		return false;
	}

	// Loop to create numShapes shapes
	for(let i = 0; i < numShapes; i++){
		// Determine properties for this shape
		let shapeClass = "circle";

		// Find a position that does not intersect with other shapes
		var xPos;
		var yPos;
		let iterations = 0;

		do{
			// Find an xPos within the range: [sizeInPx, gameWidth - sizeInPx]
			xPos = sizeInPx + ((gameWidth -  2 * sizeInPx) * Math.random());
			// Find a yPos within the range: [sizeInPx, gameHeight - sizeInPx]
			yPos = sizeInPx + ((gameHeight -  2 * sizeInPx) * Math.random());

			iterations++;

			// If we cannot find a shape that doesn't intersect, make the shapes smaller and try again
			if(iterations > 20){
				// If the shapes would be too smaller after making smaller just don't add any more shapes
				if(!(sizeInPx - 50 < 25)){
					generateShapeList(numShapes, sizeInPx - 50);
				}
				return;
			}
		}
		while(checkIntersections(xPos, yPos))

		// Find a value between 0 and 360 degrees to rotate the shape by 
		let shapeRotation = Number( (360 * Math.random()).toFixed(2) );

		// Add this shape to the list
		shapeList.push({
			class: shapeClass,
			x: xPos,
			y: yPos,
			size: sizeInPx,
			rotation: shapeRotation,
			touching: false,
		});
	}
}

// Function to draw the shapes in the shapeList to the screen
function drawShapeList(){
	// draw each shape
	for(const shape of shapeList){
		// Each shape class has its own drawing method
		
		// Draw shapes
		let fillColor = (shape.touching)? "#CFE2F3" : "#FFFFFF";
		fill(fillColor);
		stroke("#000000");
		strokeWeight(3);

		switch(shape.class){
			case "circle":
				circle(shape.x, shape.y, shape.size);
				break;
			default:
				console.log("Unknown shape class; cannot draw shape");
				break;
		}

		// Draw shape progress
		if(totalProgress <= 0){continue;}

		fill("#6AA84F");
		stroke("#000000");
		strokeWeight(0);

		switch(shape.class){
			case "circle":
				circle(shape.x, shape.y, (totalProgress / 100) * shape.size);
				break;
			default:
				console.log("Unknown shape class; cannot draw shape");
				break;
		}
	}
}

// Function to update the round's progress
function updateShapeProgress(){
	let touchingAllShapes = true;

	for(const shape of shapeList){
		shape.touching = false;

		for([pID, pObj] of pointerMap){
			if(circleOverlapTest(shape.x, shape.y, pObj.x, pObj.y, shape.size / 2, 1)){
				shape.touching = true;
				break;
			}
		}

		if(shape.touching == false){
			touchingAllShapes = false;
		}
	}

	if(touchingAllShapes){
		let newProgress = totalProgress;
		newProgress += 100 * (deltams / totalHoldTimeMS);

		if(newProgress >= 100){newProgress = 100;}

		totalProgress = newProgress
	}
	else{
		totalProgress = 0;
	}	
}

// Update the round info pane
function updateRoundInfoPane(){
	$("#round-label").text(`Round: ${roundNum}`);
	$("#time-label").text(Math.round(timeRemaining / 1000.0));
}

function showRoundCompletePanel(){
	// Update panel contents
	if(timeRemaining == 0){
		// The user lost the round
		$("#round-complete-text").text(`Good job, you made it through ${roundNum} rounds!!`)
	}
	else{
		// The user won the round and show go to the next one
		timeLeft = new Decimal(timeRemaining / 1000);
		$("#round-complete-text").text(`You made it through round #${roundNum}!!! It took you ${timeLeft.toFixed(1)} seconds!`)
	}

	$("#round-complete-panel").show();
}

// TODO
function nextRound(){

}

// #region Primary Draw Function
	function draw() {
		// Update delta time
		lastFrame = thisFrame;
		thisFrame = new Date();

		deltams = thisFrame - lastFrame;
		
		// Clear the screen
		background(220);

		// If not in a game, make sure the correct panels are show and don't process the game
		if(!inGame){
			$("#instructions-panel").show();
			$("#round-info-pane").hide();
			$("#round-complete-panel").hide();
			return;
		}
		
		// Calculate shape progress
		if(inRound){
			updateShapeProgress();
			
			if(totalProgress >= 100){
				// The user has won this round
				inRound = false;
				showRoundCompletePanel();
				return;
			}
			
			// Update timer
			if(timeRemaining <= 0){
				// The loser has lost
				timeRemaining = 0;
				inRound = false;
				showRoundCompletePanel();
				return;
			}
			else{
				timeRemaining -= deltams;
			}

			updateRoundInfoPane();
		}
		else{

		}

		// Draw shapes to the screen
		drawShapeList();
	}
// #endregion

// #endregion


// #region Helper functions

function circleOverlapTest(x1, y1, x2, y2, r1, r2){
	// false means there is no intersection
	// true means there is an intersection

	let distanceSquared = ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
	let radiiSumSquared = (r1 + r2) * (r1 + r2);

	return (distanceSquared <= radiiSumSquared);
}

function percentToPx(percentNum){

}

// #endregion
