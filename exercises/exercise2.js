/* 
	Exercise 2 Description: Cooking game where you slice ingredients and drag them to cook
*/
let homePage = true;
let pressed = false;
let info = false;
let game = false;
let finalScreen = false;
let cutting = false;
let dragging = false;

let img;

let l = 0;
let s = true;

let carrot; 
let fryingPan;
let cuttingBoard;
let cutCarrot1;
let cutCarrot2;
let cutCarrot3;
let cutCarrot4;
let cutCarrot5;

let carrotTop;
let carrotSlice2;
let carrotSlice3;
let carrotSlice4;
let carrotSlice5;

let sauteedCarrots;

let carrotCut = false;

let carrotX;
let carrotY;

let dragX;
let dragY;
let slice2X;
let slice2Y;
let slice3X;
let slice3Y;
let slice4X;
let slice4Y;
let slice5X;
let slice5Y;

let draggingPiece = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let carrotTopPlaced = false;
let carrotSlice2Unlocked = false;
let carrotSlice2Placed = false;
let carrotSlice3Unlocked = false;
let carrotSlice3Placed = false;
let carrotSlice4Unlocked = false;
let carrotSlice4Placed = false;
let carrotSlice5Unlocked = false;
let carrotSlice5Placed = false;

let targetY;
let targetLeft;
let targetRight;
let sceneScale;

const referenceWidth = 1904;
const referenceHeight = 1080;
const boardWidth = 473;
const boardHeight = 800;
const ingredientWidth = 676;
const ingredientHeight = 712;
let boardX;
let boardY;

let cutProgress = 0;
let cuts = 0;

function preload(){
	img = loadImage('exercise2Instructions.png');
	carrot = loadImage('Full Carrot.png');	
	fryingPan = loadImage('fryingPan.png');
	cuttingBoard = loadImage('cuttingBoard.png');
	cutCarrot1 = loadImage('CarrotSliced1.png');
	cutCarrot2 = loadImage('CarrotSliced2.png');
	cutCarrot3 = loadImage('CarrotSliced3.png');
	cutCarrot4 = loadImage('CarrotSliced4.png');
	cutCarrot5 = loadImage('CarrotSliced5.png');
	carrotTop = loadImage('CarrotTop.png');
	carrotSlice2 = loadImage('CarrotSlice2.png');
	carrotSlice3 = loadImage('CarrotSlice3.png');
	carrotSlice4 = loadImage('CarrotSlice4.png');
	carrotSlice5 = loadImage('CarrotSlice5.png');
	sauteedCarrots = loadImage('SauteedCarrots.png');
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(240);

	setSceneLayout();

	let j = false;

}

function setSceneLayout(){
	sceneScale = Math.min(width / referenceWidth, height / referenceHeight, 1);
	boardX = width * 290 / referenceWidth;
	boardY = height * 100 / referenceHeight;
	carrotX = boardX + (boardWidth / 2 - 350) * sceneScale;
	carrotY = boardY + 170 * sceneScale;

	dragX = carrotX;
	dragY = carrotY + 5 * sceneScale;
	slice2X = carrotX + 5 * sceneScale;
	slice2Y = carrotY;
	slice3X = carrotX;
	slice3Y = carrotY - 50 * sceneScale;
	slice4X = carrotX;
	slice4Y = carrotY - 30 * sceneScale;
	slice5X = carrotX - 3 * sceneScale;
	slice5Y = carrotY - 20 * sceneScale;
	targetY = carrotY + 100 * sceneScale;
	targetLeft = carrotX + 250 * sceneScale;
	targetRight = carrotX + 400 * sceneScale;
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	setSceneLayout();
}

function draw(){
	
	if(homePage)
	{
		drawHome();
	}

	if(info){
		drawInfo();
	}

	if(game){		
		if(l == 0){
			console.log("erased");
			background(240);
			l = 1;
			cutting = true;
		}
		drawGame1();				
	}

	

}

function erase(){
	window.location.reload();
	console.log("erased");
}

function drawHome(){

	strokeWeight(2);
	stroke(4);
	fill(71, 133, 145);
	rect(width/2-100, height/2-300, 300, 150, 20);
	
	strokeWeight(0);
	fill(255)
	textSize(50)
	text('Play', width/2,height/2-220)
	
}

function drawInfo(){

	image(img, width/2-400,height/2-50)

	strokeWeight(2);
	stroke(4);
	fill(71, 133, 145);
	rect(width/2-100, height/2-300, 300, 150, 20);

	strokeWeight(0);
	fill(255)
	textSize(20)
	text('Begin Cooking: Sauteed Carrots', width/2-90,height/2-220)
	text('(Note: drag slowly while cutting)', width/2-90,height/2-190)

}

function checkCut(){

    let tolerance = 15;

    if(
        mouseY > targetY - tolerance &&
        mouseY < targetY + tolerance &&
        mouseX > targetLeft &&
        mouseX < targetRight){
        cutProgress++;
		console.log("cutProgress: ", cutProgress)
    }

    if (cutProgress > 60){
        carrotCut = true;
		background(240);
    }
}


function drawGame1() {

	background(240);

	image(fryingPan, width/2, height/6, 900, 900);

	


    if (carrotCut){
		cuts++;
		cutProgress = 0;
		carrotCut = false;

		console.log("cutProgress: ", cutProgress, " Cuts: ", cuts)
    }

	image(cuttingBoard, boardX, boardY, boardWidth * sceneScale, boardHeight * sceneScale);
	drawIngredient(carrot, carrotX, carrotY);
	//image(cuts >= 2 ? carrotSlice2, carrotX, carrotY);


	if(cuts == 1){
		carrot = cutCarrot1;
		targetY = carrotY + 150 * sceneScale;
	}
	if(cuts >= 2){
		carrot = cutCarrot2;
		targetY = carrotY + 200 * sceneScale;
		
		drawIngredient(carrotSlice2, slice2X, slice2Y);
	}
	 if(cuts >= 3){
		carrot = cutCarrot3;
		targetY = carrotY + 290 * sceneScale;

	 	if(!carrotSlice3Unlocked){
	 		drawIngredient(carrotSlice3, slice3X, slice3Y);
	 	}
	}
	 if(cuts >= 4){
		carrot = cutCarrot4;
		targetY = carrotY + 350 * sceneScale;

	 	if(!carrotSlice4Unlocked){
	 		drawIngredient(carrotSlice4, slice4X, slice4Y);
	 	}
	}
	 if (cuts == 5){
		carrot = cutCarrot5;
		targetY = carrotY + 400 * sceneScale;
		
	 	if(!carrotSlice5Unlocked){
	 		drawIngredient(carrotSlice5, slice5X, slice5Y);
	 	}
	}
	 if(cuts >= 5){
		cutting = false;
		dragging = true;
	}

	if(!dragging){
		drawIngredient(carrotTop, carrotX, carrotY + 5 * sceneScale);
	}

	if(cutting){
		stroke(255, 0, 0);
		strokeWeight(4 * sceneScale);
		line(targetLeft, targetY, targetRight, targetY);
	}

	if(dragging){
		drawIngredient(carrotTop, dragX, dragY);
		if(carrotSlice2Unlocked){
			drawIngredient(carrotSlice2, slice2X, slice2Y);
		}
		if(carrotSlice3Unlocked){
			drawIngredient(carrotSlice3, slice3X, slice3Y);
		}
		if(carrotSlice4Unlocked){
			drawIngredient(carrotSlice4, slice4X, slice4Y);
		}
		if(carrotSlice5Unlocked){
			drawIngredient(carrotSlice5, slice5X, slice5Y);
		}
	}

	if (mouseIsPressed && cutting && !carrotCut){

        stroke(0);
        strokeWeight(5);

        line(
            mouseX - 10,
            mouseY,
            mouseX + 10,
            mouseY);
    }

	if(carrotSlice5Placed){
		background(240);
		image(sauteedCarrots,0,height/3);

		textSize(50);
		fill(30);
		text("Nicely Done! You made Sauteed Carrots! ", width/2-300, height/2-400);
		
		strokeWeight(2);
		stroke(4);
		fill(71, 133, 145);
		rect(width/2-100, height/2-300, 300, 150, 20);

		strokeWeight(0);
		fill(255)
		textSize(26)
		text('Restart (SCREEN WIP)', width/2-80, height/2-220)

		finalScreen = true;
		

	}
}

function drawIngredient(ingredient, x, y){
	image(ingredient, x, y, ingredientWidth * sceneScale, ingredientHeight * sceneScale);
}

function mouseClicked(){

	console.log(mouseX, mouseY);
	console.log("home:", homePage, "info:", info, "game:", game)

	if(homePage){

		if(mouseX > width/2-100 && 
			mouseX < width/2+200 && 
			mouseY > height/2-300 && 
			mouseY < height/2 -150){
				
			homePage = false;
			info = true;

			return;
		}
	}

	if(info){

		console.log("Info clicked");

		if(mouseX > width/2-100 &&
		mouseX < width/2+200 &&
		mouseY > height/2-300 &&
		mouseY < height/2-150){

			console.log("Recipe 1 button clicked");

			info = false;
			game = true;

			return;
		}
	}

	if(finalScreen){
		if(mouseX > width/2-100 &&
		mouseX < width/2+200 &&
		mouseY > height/2-300 &&
		mouseY < height/2-150){

			erase();
			window.location.reload()
			console.log("Restart button clicked");
			return;
		}


	}

}

function mousePressed(){
	if(!game || !dragging){
		return;
	}

	if(!carrotTopPlaced &&
		mouseX >= dragX && mouseX <= dragX + carrotTop.width * sceneScale &&
		mouseY >= dragY && mouseY <= dragY + carrotTop.height * sceneScale){
		draggingPiece = 'carrotTop';
		dragOffsetX = mouseX - dragX;
		dragOffsetY = mouseY - dragY;
	}else if(carrotSlice2Unlocked &&
		!carrotSlice2Placed &&
		mouseX >= slice2X && mouseX <= slice2X + carrotSlice2.width * sceneScale &&
		mouseY >= slice2Y && mouseY <= slice2Y + carrotSlice2.height * sceneScale){
		draggingPiece = 'carrotSlice2';
		dragOffsetX = mouseX - slice2X;
		dragOffsetY = mouseY - slice2Y;
	}else if(carrotSlice3Unlocked &&
		!carrotSlice3Placed &&
		mouseX >= slice3X && mouseX <= slice3X + carrotSlice3.width * sceneScale &&
		mouseY >= slice3Y && mouseY <= slice3Y + carrotSlice3.height * sceneScale){
		draggingPiece = 'carrotSlice3';
		dragOffsetX = mouseX - slice3X;
		dragOffsetY = mouseY - slice3Y;
	}else if(carrotSlice4Unlocked &&
		!carrotSlice4Placed &&
		mouseX >= slice4X && mouseX <= slice4X + carrotSlice4.width * sceneScale &&
		mouseY >= slice4Y && mouseY <= slice4Y + carrotSlice4.height * sceneScale){
		draggingPiece = 'carrotSlice4';
		dragOffsetX = mouseX - slice4X;
		dragOffsetY = mouseY - slice4Y;
	}else if(carrotSlice5Unlocked &&
		!carrotSlice5Placed &&
		mouseX >= slice5X && mouseX <= slice5X + carrotSlice5.width * sceneScale &&
		mouseY >= slice5Y && mouseY <= slice5Y + carrotSlice5.height * sceneScale){
		draggingPiece = 'carrotSlice5';
		dragOffsetX = mouseX - slice5X;
		dragOffsetY = mouseY - slice5Y;
	}
}

function mouseDragged(){

    if (game && cutting && !carrotCut){

        stroke(0);
        strokeWeight(5);

        checkCut();
    }

	if(draggingPiece === 'carrotTop'){
		dragX = mouseX - dragOffsetX;
		dragY = mouseY - dragOffsetY;
	}else if(draggingPiece === 'carrotSlice2'){
		slice2X = mouseX - dragOffsetX;
		slice2Y = mouseY - dragOffsetY;
	}else if(draggingPiece === 'carrotSlice3'){
		slice3X = mouseX - dragOffsetX;
		slice3Y = mouseY - dragOffsetY;
	}else if(draggingPiece === 'carrotSlice4'){
		slice4X = mouseX - dragOffsetX;
		slice4Y = mouseY - dragOffsetY;
	}else if(draggingPiece === 'carrotSlice5'){
		slice5X = mouseX - dragOffsetX;
		slice5Y = mouseY - dragOffsetY;
	}
}

function mouseReleased(){
	cutProgress = 0;

	if(draggingPiece === 'carrotTop' && isInsidePan(
		dragX + carrotTop.width * sceneScale / 2,
		dragY + carrotTop.height * sceneScale / 2)){
		carrotTopPlaced = true;
		carrotSlice2Unlocked = true;
	}else if(draggingPiece === 'carrotSlice2' && isInsidePan(
		slice2X + carrotSlice2.width * sceneScale / 2,
		slice2Y + carrotSlice2.height * sceneScale / 2)){
		carrotSlice2Placed = true;
		carrotSlice3Unlocked = true;
	}else if(draggingPiece === 'carrotSlice3' && isInsidePan(
		slice3X + carrotSlice3.width * sceneScale / 2,
		slice3Y + carrotSlice3.height * sceneScale / 2)){
		carrotSlice3Placed = true;
		carrotSlice4Unlocked = true;
	}else if(draggingPiece === 'carrotSlice4' && isInsidePan(
		slice4X + carrotSlice4.width * sceneScale / 2,
		slice4Y + carrotSlice4.height * sceneScale / 2)){
		carrotSlice4Placed = true;
		carrotSlice5Unlocked = true;
	}else if(draggingPiece === 'carrotSlice5' && isInsidePan(
		slice5X + carrotSlice5.width * sceneScale / 2,
		slice5Y + carrotSlice5.height * sceneScale / 2)){
		carrotSlice5Placed = true;
	}
	draggingPiece = null;
}

function isInsidePan(x, y){
	const panCenterX = width / 2 + 500;
	const panCenterY = height / 6 + 500;
	const normX = (x - panCenterX) / 250;
	const normY = (y - panCenterY) / 230;
	return normX * normX + normY * normY <= 1;
}