let canvasDiv = document.querySelector('.canvas-area')
let canvas = new fabric.Canvas('canvas-main');
let addedEnabled = true;
const minZoom = 0.4;
const maxZoom = 10;
resizeCanvas();

canvas.on('mouse:wheel', function(opt) {
	let delta = opt.e.deltaY;
	let zoom = canvas.getZoom();
	zoom *= 0.999 ** delta;
	if (zoom > maxZoom) zoom = maxZoom;
	if (zoom < minZoom) zoom = minZoom;
	canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
	opt.e.preventDefault();
	opt.e.stopPropagation();
});
canvas.on('mouse:down', function(opt) {
	var evt = opt.e;
	if (evt.shiftKey === true) {
		this.isDragging = true;
		this.selection = false;
		this.lastPosX = evt.clientX;
		this.lastPosY = evt.clientY;
	}
});
canvas.on('mouse:move', function(opt) {
	if (this.isDragging) {
		var e = opt.e;
		var vpt = this.viewportTransform;
		vpt[4] += e.clientX - this.lastPosX;
		vpt[5] += e.clientY - this.lastPosY;
		this.requestRenderAll();
		this.lastPosX = e.clientX;
		this.lastPosY = e.clientY;
	}
});
canvas.on('mouse:up', function(opt) {
	// on mouse up we want to recalculate new interaction
	// for all objects, so we call setViewportTransform
	if (addedEnabled) {
		let pointer = canvas.getPointer(opt.e, false);
		let insertElement = document.querySelector('.active img');
		let scrInstance = new fabric.Image(insertElement, {
			left: pointer.x,
			top: pointer.y,
			opacity: 0.85,
			originX: "center",
			originY: "bottom",
			centeredRotation: false,
		});
		scrInstance.setControlsVisibility({
			// mt: false,
			// mb: false,
			// ml: false,
			// mr: false,
			// bl: false,
			// br: false,
			// tl: false,
			// tr: false,
			//mtr: false,
		});
		//scrInstance.lockScalingX = scrInstance.lockScalingY = true;
		scrInstance.rotate(Math.atan2(scrInstance.top - canvas.getHeight()/2, scrInstance.left - canvas.getWidth()/2) * 180 / Math.PI + 90);
		canvas.add(scrInstance);
		canvas.renderAll();
	}
	else {
		this.setViewportTransform(this.viewportTransform);
		this.isDragging = false;
		this.selection = true;
	}
});

canvas.on('mouse:over', function(e) {
	if (addedEnabled) {
		e.target.selectable = false;
	}
	else {
		e.target.selectable = true;
	}
	canvas.renderAll();
});

canvas.on('object:moving', function(options) {
	if (options.target) {
		let obj = canvas.getActiveObject();
		obj.rotate(Math.atan2(obj.top - canvas.getHeight()/2, obj.left - canvas.getWidth()/2) * 180 / Math.PI + 90);

	}
});

const step = 25;
const addCircleButton = document.querySelector(`.addCircle`);
const removeCircleButton = document.querySelector(`.removeCircle`);
const downloadPdfButton = document.querySelector(`.download-pdf`);
let radius = step;
let circleGroup = new fabric.Group([], {
	width: 5000,
	height: 5000,
	selectable: false,
	hoverCursor: 'default',
	objectCaching: false,
	noScaleCache: false,
	statefullCache: true,
});
let circleNumberGroup = new fabric.Group([], {
	width: 5000,
	height: 5000,
	selectable: false,
	hoverCursor: 'default',
	objectCaching: false,
	noScaleCache: false,
	statefullCache: true,
});
window.onresize = resizeCanvas;

let crochets = document.querySelectorAll('.crochet');
let lastClicked = crochets[0];

for( let i = 0; i < crochets.length; i++ ){
	crochets[i].addEventListener('click', function(){
		lastClicked.classList.remove('active');
		this.classList.add('active');

		lastClicked = this;
	});
}

addCircleButton.addEventListener(`click`, () => {
	if (radius / step <= 100) {
		circleGroup.add(new fabric.Circle({
			fill: 'transparent',
			radius: radius,
			hasBorder: true,
			stroke: 'green',
			strokeWidth: 1,
			opacity: 0.4,
			originX: 'center',
			originY: 'center',
			objectCaching: false,
			noScaleCache: false,
		}));
		circleNumberGroup.add(new fabric.Text('' + (radius / step), {
			left: radius + 6,
			top: -11,
			fontSize: 10,
			stroke: 'darkmagenta',
			strokeWidth: 1,
			opacity: 0.4,
		}));
		radius += step;
		canvas.renderAll();
	}
});

removeCircleButton.addEventListener(`click`, () => {
	if (circleGroup.size() > 1) {
		circleGroup.remove(circleGroup.getObjects()[circleGroup.size() - 1]);
		circleNumberGroup.remove(circleNumberGroup.getObjects()[circleNumberGroup.size() - 1]);
		radius -= step;
	}
	canvas.renderAll();
});

downloadPdfButton.addEventListener(`click`, () => {
	let imgData = canvas.toDataURL("image/png");
	downloadImage(imgData, 'canvas.png');
});

// Save | Download image
function downloadImage(data, filename = 'untitled.png') {
	let a = document.createElement('a');
	a.href = data;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
}

function resizeCanvas() {
	canvas.setWidth(canvasDiv.clientWidth);
	canvas.setHeight(canvasDiv.clientHeight);
};

function initialize() {
	canvas.backgroundColor="white";

	canvas.add(new fabric.Line([0, 0, canvas.getWidth(), 0], {
		left: 0,
		top: canvas.getHeight() / 2,
		stroke: 'brown',
		strokeWidth: 1,
		opacity: 0.4,
		strokeDashArray: [5, 5],
		selectable: false,
		hoverCursor: 'default',
	}));

	canvas.add(new fabric.Line([0, 0, 0, canvas.getHeight()], {
		left: canvas.getWidth() / 2,
		top: 0,
		stroke: 'brown',
		strokeWidth: 1,
		opacity: 0.4,
		strokeDashArray: [5, 5],
		selectable: false,
		hoverCursor: 'default',
	}));

	circleGroup.add(new fabric.Circle({
		fill:'transparent',
		radius: 1,
		hasBorder: true,
		stroke: 'green',
		strokeWidth: 1,
		opacity: 0.4,
		originX: 'center',
		originY: 'center'
	}));

	// add to center canvas group of circles to count
	canvas.add(circleGroup);
	canvas.add(circleNumberGroup);
	circleGroup.center();
	circleNumberGroup.center();
};

initialize();

function adding() {
	let chbox;
	chbox=document.getElementById('adding');
	if (chbox.checked) {
		addedEnabled = true;
		canvas.hoverCursor = 'auto';
	}
	else {
		addedEnabled = false;
		canvas.hoverCursor = 'move';
	}
}