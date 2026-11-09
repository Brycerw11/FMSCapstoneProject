/* 
	Exercise 4 Title: Shape Balancing
	Exercise 4 Description: 
		A game where the user tries to press and hold on as many shapes as possible.
		The game gets hard by adding more shapes and adding moving shapes as the rounds continue.
*/

// #region global variables
	// Vars for handling the game's html canvas
	let gameWidth = window.innerWidth;
	let gameHeight = window.innerHeight;
	var gameCanvasHTML;

	// Sound source for future attribution: https://pixabay.com/sound-effects/film-special-effects-success-340660/
	const successSound = new Audio("../assets/audio/success-sfx.mp3");
	successSound.volume = .75;
	// Sound source for future attribution: https://pixabay.com/sound-effects/film-special-effects-balloon-inflate-4-184055/
	const balloonInflateSound = new Audio("../assets/audio/balloon-inflate-3s.mp3");
	balloonInflateSound.volume = .75 / 2;

	// Vars for the game's core functionality
	let inGame = false;
	let inRound = false;
	let timeRemaining = 0; //time remaining in the round in ms
	let globalMoveSpeed = 0; //the speed at which the shapes move in units/second
	let roundNum = 0;

	let shapeList = [];
	const totalHoldTimeMS = 3000;
	let totalProgress = 0;
	let highestRoundProgress = 0;

	// Vars for calculating deltaTime
	var lastFrame;
	var thisFrame;
	var deltams = 0;

	// Vars for tracking the games metrics
	let metricsListObj = JSON.parse(localStorage.getItem("Shape Balancing Metrics"));
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
	timeRemaining = roundProgression[0].time;
	totalProgress = 0;
	highestRoundProgress = 0;
	generateShapeList(roundProgression[0].numShapes, 150);
	
	$("#instructions-panel").hide();
	updateRoundInfoPane();
	$("#round-info-pane").show();
	inGame = true;
}

// p5.js Setup
function setup() {
	// Set up game canvas
	createCanvas(gameWidth, gameHeight);

	gameCanvasHTML = document.getElementById("defaultCanvas0");

	// This is required for the site to handle more than 3 touches at the same time
	gameCanvasHTML.style.touchAction = "none";

	// Get settings from local storage
	let settingsObj = JSON.parse(localStorage.getItem("settings"));
	if(settingsObj != null){
		if(settingsObj.audioToggle === false){
			successSound.volume = 0;
			balloonInflateSound.volume = 0;
		}
		else if(settingsObj.volume != undefined){
			successSound.volume = (settingsObj.volume / 100);
			balloonInflateSound.volume = (settingsObj.volume / 100) / 2;
		}
	}

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
		while(checkIntersections(xPos, yPos, sizeInPx))

		// Find a value between 0 and 360 degrees to rotate the shape by 
		let shapeDirection = (2 * Math.PI * Math.random());

		// Add this shape to the list
		shapeList.push({
			class: shapeClass,
			x: xPos,
			y: yPos,
			size: sizeInPx,
			direction: shapeDirection,
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

		totalProgress = newProgress;
		if(totalProgress > highestRoundProgress){
			highestRoundProgress = totalProgress;
		}

		if(balloonInflateSound.paused || balloonInflateSound.ended){
			balloonInflateSound.currentTime = 0;
			balloonInflateSound.play();
		}
	}
	else{
		totalProgress = 0;
		balloonInflateSound.pause();
	}	
}

function moveShapes(){
	for(const shape of shapeList){
		shape.direction += -(Math.PI / 4) + Math.random() * (Math.PI / 2);

		let moveAngle = shape.direction;
		let currX = shape.x;
		let currY = shape.y;

		let nextX = shape.x + globalMoveSpeed * (deltams / 1000) * Math.cos(moveAngle);
		let nextY = shape.y + globalMoveSpeed * (deltams / 1000) * Math.sin(moveAngle);

		nextX = clamp(nextX, shape.size, gameWidth - shape.size);
		nextY = clamp(nextY, shape.size, gameHeight - shape.size);

		// Move the shape out of the way before checking for intersections
		shape.x = -200;
		shape.y = -200;

		if(checkIntersections(nextX, nextY, shape.size)){
			// The shape would move into another shape so don't move it
			shape.x = currX;
			shape.y = currY;
		}
		else{
			shape.x = nextX;
			shape.y = nextY;
		}
	}
}

// Update the round info pane
function updateRoundInfoPane(){
	$("#round-label").text(`Round: ${roundNum}`);
	$("#time-label").text(Math.round(timeRemaining / 1000.0));
}

function showRoundCompletePanel(){
	balloonInflateSound.pause();

	// Update panel contents
	if(timeRemaining == 0){
		// The user lost the round
		$("#round-complete-header").text("Round Over");
		$("#round-complete-text").text(`Good job, you completed ${roundNum - 1} rounds and made it through ${highestRoundProgress.toFixed(2)}% of round ${roundNum}!!`);
		$("#next-round-info-text").text("Press the Play Again button to restart or use the nav bar to go somewhere else.");
		
		$("#next-round-button").text("Play Again");

		addGameToMetrics();
	}
	else{
		// The user won the round and show go to the next one
		$("#round-complete-header").text("Round Complete!");

		let thisRoundsTimer = (roundNum - 1 < roundProgression.length)? roundProgression[roundNum - 1].time : 45000;
		timeLeft = (thisRoundsTimer - timeRemaining) / 1000;
		$("#round-complete-text").text(`You made it through Round ${roundNum}!!! It took you ${timeLeft.toFixed(1)} seconds!`);
		
		// Find and show the status of the next round
		let nextRoundShapes = (roundNum < roundProgression.length)? roundProgression[roundNum].numShapes : roundProgression[roundProgression.length -1].numShapes;
		let nextRoundTimer = (roundNum < roundProgression.length)? roundProgression[roundNum].time : roundProgression[roundProgression.length -1].time;
		let nextRoundShapeSize = (roundNum < roundProgression.length)? roundProgression[roundNum].shapeSize : roundProgression[roundProgression.length -1].shapeSize;
		let nextRoundShapeSpeed = (roundNum < roundProgression.length)? roundProgression[roundNum].shapeSpeed : roundProgression[roundProgression.length -1].shapeSpeed;

		let nextRoundShapeSizeLabel = `${nextRoundShapeSize * 100}%`;
		let nextRoundShapeSpeedLabel = (nextRoundShapeSpeed == 0)? `` : `, moving at ${nextRoundShapeSpeed} units/second`;

		let nextRoundStatusString = `Round ${roundNum + 1} is next! It will have ${nextRoundShapes} shapes at ${nextRoundShapeSizeLabel} of their maximum size${nextRoundShapeSpeedLabel}. You'll have ${nextRoundTimer / 1000} seconds to complete it.`;
		$("#next-round-info-text").show();
		$("#next-round-info-text").text(nextRoundStatusString);
		$("#next-round-button").text("Next Round")
		roundNum++;

		successSound.play();
	}

	// Show the round complete panel
	$("#round-complete-panel").show();
}


const roundProgression = [
	{numShapes: 3, time: 60000, shapeSpeed: 0, shapeSize: 1,},    //round 1
	{numShapes: 4, time: 60000, shapeSpeed: 0, shapeSize: 1,},    //round 2
	{numShapes: 5, time: 60000, shapeSpeed: 0, shapeSize: 1,},    //round 3
	{numShapes: 5, time: 50000, shapeSpeed: 0, shapeSize: 1,},    //round 4
	{numShapes: 6, time: 50000, shapeSpeed: 0, shapeSize: 1,},    //round 5
	{numShapes: 5, time: 50000, shapeSpeed: 10, shapeSize: 1,},   //round 6
	{numShapes: 5, time: 40000, shapeSpeed: 15, shapeSize: 1,},   //round 7
	{numShapes: 6, time: 50000, shapeSpeed: 15, shapeSize: 1,},   //round 8
	{numShapes: 7, time: 50000, shapeSpeed: 15, shapeSize: 1,},   //round 9
	{numShapes: 7, time: 45000, shapeSpeed: 15, shapeSize: 1,},   //round 9
	{numShapes: 7, time: 45000, shapeSpeed: 15, shapeSize: 0.9,}, //round 10
	{numShapes: 7, time: 45000, shapeSpeed: 20, shapeSize: 0.8,}, //round 11
	{numShapes: 7, time: 45000, shapeSpeed: 25, shapeSize: 0.75,}, //round 12
	{numShapes: 7, time: 45000, shapeSpeed: 30, shapeSize: 0.75,}, //round 13(+)
]
function nextRound(){
	$("#round-complete-panel").hide();

	// If the game is currently over, start a new one at round 1
	if(timeRemaining <= 0){
		roundNum = 1;
	}
	
	let nextRoundShapes = (roundNum -1 < roundProgression.length)? roundProgression[roundNum - 1].numShapes : roundProgression[roundProgression.length -1].numShapes;
	timeRemaining = (roundNum -1 < roundProgression.length)? roundProgression[roundNum - 1].time : roundProgression[roundProgression.length -1].time;

	let nextRoundShapeSize = (roundNum < roundProgression.length)? roundProgression[roundNum].shapeSize : roundProgression[roundProgression.length -1].shapeSize;
	let nextRoundShapeSpeed = (roundNum < roundProgression.length)? roundProgression[roundNum].shapeSpeed : roundProgression[roundProgression.length -1].shapeSpeed;

	generateShapeList(nextRoundShapes, 150 * nextRoundShapeSize);

	totalProgress = 0;
	highestRoundProgress = 0;
	globalMoveSpeed = nextRoundShapeSpeed;
	inRound = true;

	pointerMap.clear();
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
			if(globalMoveSpeed > 0){
				moveShapes();
			}

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

// Check to see if a new shape intersects with any existing shapes
function checkIntersections(xPos, yPos, sizeInPx){
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

function clamp(value, min, max){
	return Math.min(Math.max(value, min), max);
}

function addGameToMetrics(){
	if(metricsListObj === null){
		metricsListObj = {gameList: []}
	}

	metricsListObj.gameList.push({
		completedRounds: roundNum - 1,
		finalRoundProgress: Number(highestRoundProgress.toFixed(2)),
	});

	localStorage.setItem("Shape Balancing Metrics", JSON.stringify(metricsListObj));
}

// #endregion
