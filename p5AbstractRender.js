//Code for abstract renderer for the webcam data

let videoIn;
let canvasOut;
let vScale = 30;
let renderPick;

function setup() {
  canvasOut = createCanvas(640, 480).id('canvasOut');
	//pixelDensity(0.45);
	videoIn = createCapture(VIDEO).id('videoIn');
	videoIn.size(width / vScale, height / vScale);
	videoIn.hide();
	//frameRate(10);

    thresButton = createButton("Threshold :");
    thresButton.position(0,505);
    thresButton.style('width', '100px')
    Threslider = createSlider(0, 220, 255);
    Threslider.position(100, 505);
    Threslider.style('width', '200px');

    renderButton = createButton("Render Type :");
    renderButton.position(0,482)
    renderButton.style('width', '100px');
	renderPick = createSelect();
    renderPick.position(100,482);
	renderPick.option('Bubbles', 0);
	renderPick.option('Rectangles', 1);
	renderPick.option('Crystals', 2);
	renderPick.option('Random Shape', 3);


}

function draw() {

	background(3);


	videoIn.loadPixels();

	for (var y = 0; y < videoIn.height; y++) {
		for (var x = 0; x < videoIn.width; x++) {
			var index = (videoIn.width - x - 1 + (y * videoIn.width)) * 4;
			var r = videoIn.pixels[index + 0];
			var g = videoIn.pixels[index + 1];
			var b = videoIn.pixels[index + 2];
			var bright = (r + g + b) / 3;
			var w = map(bright, 0, Threslider.value(), 0, vScale);
			var movementAdder = map(bright, 0, 255, 0, 75);
			stroke(r, g, b, bright);
			strokeCap(ROUND);
			noFill();

			renderType(renderPick.value(), movementAdder, vScale,
				x, y, w, bright, r, g, b);

		}
	}
}


function renderType(pick, movementAdder, vScale, x, y, w, bright, r, g, b) {
	if (pick == 0) {
		bubbles(movementAdder, vScale, x, y, w);
	} else if (pick == 1) {
		rectangles(movementAdder, vScale, x, y, w);
	} else if (pick == 2) {
		abstractLines(bright, vScale, x, y);
	} else if (pick == 3) {
		randShape(vScale, x, y, w, r, g, b);
	} else {
		alert("no rendering sellected");
	}
}

//RENDERING TYPES
function bubbles(movementAdder, vScale, x, y, w) {
	noFill();
	ellipseMode(CENTER);
	blendMode(DIFFERENCE);
	strokeWeight(1);
	ellipse(x * vScale, y * vScale,
		w + movementAdder, w + movementAdder);
}


function rectangles(movementAdder, vScale, x, y, w) {
	noFill();
	rectMode(CENTER);
	blendMode(DIFFERENCE);
	strokeWeight(1);
	rect(x * vScale, y * vScale,
		w , w );
}


function abstractLines(bright, vScale, x, y) {
	noFill();
	blendMode(DIFFERENCE)
	strokeWeight(4);
	let threshold = 50;
	let lineMulVar = 35; // can be mapped to movement (try with 1)
	let lineMulX = lineMulVar * map(bright, threshold, Threslider.value(), 0, 1);
	let lineMulY = lineMulVar * map(bright, threshold, Threslider.value(), 0, 1);
	line(x * vScale, y * vScale,
		x * vScale + random(-lineMulX, lineMulX),
		y * vScale + random(-lineMulY, lineMulY));
}


function randShape(vScale, x, y, w, r, g, b) {

    fill(r,g,b,255);

	blendMode(BLEND);
	let randomShaper = floor(random(0, 6));

	if (randomShaper == 0) {
		rectMode(CENTER);

		rect(x * vScale, y * vScale, w, w);
	} else if (randomShaper == 1) {
		ellipseMode(CENTER);

		ellipse(x * vScale, y * vScale, w, w);
	}
    else if (randomShaper == 2){
        noFill();
        arc(x*vScale, y*vScale, random(50), random(50), 10, PI, CHORD);
	}
    else {
    rectMode(CENTER);
		noFill();
		rect(x * vScale, y * vScale, w, w);
    }

}