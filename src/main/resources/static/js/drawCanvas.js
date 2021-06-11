let canvasDiv = document.querySelector('.canvas-area')
let colorInput = document.getElementById('color-selector')
let canvas = new fabric.Canvas('canvas-main');
let addedEnabled = true;
const minZoom = 0.4;
const maxZoom = 10;
resizeCanvas();

document.addEventListener('keydown', function (e) {
	console.log(e);
	if (e.key === "Delete") {
		if(canvas.getActiveObject()) {
			canvas.remove(canvas.getActiveObject());
			canvas.renderAll();
		}
	}
}, false);

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
	let evt = opt.e;
	if (evt.shiftKey === true) {
		this.isDragging = true;
		this.selection = false;
		this.lastPosX = evt.clientX;
		this.lastPosY = evt.clientY;
	}
});
canvas.on('mouse:move', function(opt) {
	if (this.isDragging) {
		let e = opt.e;
		let vpt = this.viewportTransform;
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
	if (addedEnabled && !this.isDragging) {
		let pointer = canvas.getPointer(opt.e, false);
		let insertElement = document.querySelector('.active img').src;
		let xhr = new XMLHttpRequest();
		let svg;
		xhr.open('GET', insertElement);
		xhr.addEventListener('load', function(ev)
		{
			let xml = ev.target.response;
			let dom = new DOMParser();
			svg = dom.parseFromString(xml, 'image/svg+xml');

			let serializer = new XMLSerializer();
			svg.rootElement.style.stroke="blue";
			let paths = svg.getElementsByTagName("path");
			for (let element of paths) {
				element.setAttribute('stroke',colorInput.value);
			}
			let svgStr = serializer.serializeToString(svg.rootElement);
			fabric.loadSVGFromString(svgStr,function(objects, options) {
				let obj = fabric.util.groupSVGElements(objects, options);
				obj.set({
						left: pointer.x,
						top: pointer.y,
						originX: "center",
						originY: "bottom",
						centeredRotation: false,
						stroke: "red",
					})
					.setCoords();
				obj.scaleToHeight(20, true);
				obj.rotate(Math.atan2(obj.top - canvas.getCenter().top, obj.left - canvas.getCenter().left) * 180 / Math.PI + 90);
				canvas.add(obj).renderAll();
			});
		});
		xhr.send(null);
		canvas.renderAll();
	}
	else {
		this.setViewportTransform(this.viewportTransform);
		this.selection = true;
	}
	this.isDragging = false;
});

canvas.on('mouse:over', function(e) {
	e.target.selectable = !addedEnabled;
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
circleGroup.selectable = false;
circleGroup.lockScalingX = circleGroup.lockScalingY = true;
circleGroup.lockMovementX = circleGroup.lockMovementY = true;
circleGroup.lockRotation = true;

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
		let circle = new fabric.Circle({
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
		});
		circle.selectable = false;
		circle.lockScalingX = circle.lockScalingY = true;
		circle.lockMovementX = circle.lockMovementY = true;
		circleGroup.add(circle);
		let number = new fabric.Text('' + (radius / step), {
			left: radius + 6,
			top: -11,
			fontSize: 10,
			stroke: 'darkmagenta',
			strokeWidth: 1,
			opacity: 0.4,
		});
		number.selectable = false;
		number.lockScalingX = number.lockScalingY = true;
		number.lockMovementX = number.lockMovementY = true;
		number.lockRotation = true;
		circleGroup.add(number);
		radius += step;
		canvas.renderAll();
	}
});

removeCircleButton.addEventListener(`click`, () => {
	if (circleGroup.size() > 1) {
		circleGroup.remove(circleGroup.getObjects()[circleGroup.size() - 1]);
		circleGroup.remove(circleGroup.getObjects()[circleGroup.size() - 1]);
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
	canvas.calcOffset();
}

function initialize() {
	canvas.backgroundColor="white";
	canvas.hoverCursor = 'default';

	let lineX = new fabric.Line([0, 0, 5005, 0], {
		stroke: 'brown',
		strokeWidth: 1,
		opacity: 0.4,
		strokeDashArray: [5, 5],
		selectable: false,
		hoverCursor: 'default',
		objectCaching: false,
	});

	let lineY = new fabric.Line([0, 0, 0, 5005], {
		stroke: 'brown',
		strokeWidth: 1,
		opacity: 0.4,
		strokeDashArray: [5, 5],
		selectable: false,
		hoverCursor: 'default',
		objectCaching: false,
	});
	canvas.add(lineX);
	lineX.center();
	canvas.add(lineY);
	lineY.center();
	// add to center canvas group of circles to count
	canvas.add(circleGroup);
	circleGroup.center();
}

initialize();

function adding() {
	let checkBox;
	checkBox=document.getElementById('adding');
	if (checkBox.checked) {
		addedEnabled = true;
		canvas.hoverCursor = 'default';
	}
	else {
		addedEnabled = false;
		canvas.hoverCursor = 'move';
	}
}