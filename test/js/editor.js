

const TILE_SIZE = 30;
const GRID_X = 16;
const GRID_Y = 20;
const NUM_SWATCHES = 9;
const SWATCH_LIGHTNESS_STEP = Math.ceil(255 / NUM_SWATCHES); //29 for 9 swatches;
const LIGHT_GREY  = 'rgba(200, 200, 200, 1)';
const WHITE = 'rgba(255, 255, 255, 1)';
const GRID_BG_COLORS = [LIGHT_GREY, WHITE];

// Editor Canvases
var myDataRef    = new Firebase('flickering-fire-2267.firebaseIO.com');
var spriteRef    = myDataRef.child('sprites');

var overlay = document.getElementById("overlay");
var bg      = document.getElementById("bg");
var preview = document.getElementById("preview");

// var oCTX    = overlay.getContext("2d");
// var pCTX    = preview.getContext("2d");
// var bgCTX   = bg.getContext("2d");
bg.width    = overlay.width  = TILE_SIZE * GRID_X;
bg.height   = overlay.height = TILE_SIZE * GRID_Y;
preview.width  = TILE_SIZE * GRID_X;
preview.height = TILE_SIZE * GRID_Y;

// Color Picker & Swatches
var picker    = document.getElementById("color-picker-canvas");
var pickerCTX = picker.getContext("2d");
var swatches  = document.querySelectorAll('.swatch');
var swatchParent = document.querySelector('.swatch').parentNode;


// adjust size of picker & swatches
picker.width  = $(picker.parentNode).width();
picker.height = 255;
$('.swatch').width($(swatchParent).width() / swatches.length);
var colorMap = new Image();
colorMap.onload = function() {
	pickerCTX.drawImage(colorMap, 0, 0, picker.width, picker.height);
};
colorMap.crossOrigin = "anonymous"; // CORS bullshit
colorMap.src = "http://localhost:8000/images/map-saturation.png"; // CORS bullshit
var colorPickerData = pickerCTX.getImageData(0, 0, picker.width, picker.height);

// Controls
// var gridSliderX  = document.getElementById("input-grid-slider-x");
// var gridSliderY  = document.getElementById("input-grid-slider-y");
var $gridSliderX = $('#gridSliderX');
var $gridSliderY = $('#gridSliderY');
var $dimensions  = $('.grid-dimensions');

// Color Variables
var selectedColor = 'rgba(0,0,0,1)';
var colorCounter = 0;

var Grid = MyGrid.grid;
var bgGrid = new Grid(bg, GRID_X, GRID_Y, 30);
var oGrid  = new Grid(overlay, GRID_X, GRID_Y, 30);
var pGrid  = new Grid(preview, GRID_X, GRID_Y, 13);

window.oGrid = oGrid;
window.pGrid = pGrid;
window.drawTile = drawTile;
window.bgGrid = bgGrid;
window.drawTile = drawTile;


bgGrid.init();
oGrid.init();
pGrid.init();
bgGrid.draw();

var $bg      = $(bg);
var $overlay = $(overlay);
var $picker  = $(picker);
var $preview = $(preview);
var $name    = $('#name-input');

// button listeners
$('#button-clear').on('click', function(e) {

	oGrid.clear();
	pGrid.clear();
});

$('#button-save').on('click', function(e) {
	if (oGrid.save($name.val(), spriteRef)) $name.val('');
});

// $('#button-resize').on('click', function(e) {
// 	if (confirm('Erase grid  and change dimensions forrealz?')) {
// 		var x = $gridSliderX.val();
// 		var y = $gridSliderY.val();
// 		resizeGrid(x, y, oGrid);
// 		resizeGrid(x, y, pGrid);
// 		resizeGrid(x, y, bgGrid);
// 		bgGrid.draw();
// 	}
// });

// DOM listeners

$(".controls-sliders input").on('click', function(e) {
	var x = $gridSliderX.val();
	var y = $gridSliderY.val();
	updateDimensions(x, y, $dimensions);
});

$('.swatch').on('click', function(e) {
	selectedColor = $(this).css('background-color');
});

$picker.on('click', function(e) {
	selectedColor = getPixelColor(e.offsetX, e.offsetY);
	updateSwatches();
});

$overlay.on('contextmenu', function(e) {
	e.preventDefault();
	drawTile(getTile(e, oGrid), 'erase');
	drawTile(getTile(e, pGrid), 'erase');
});

$overlay.on('mousedown', function(e) {
	e.preventDefault();

	var tile  = getTile(e, oGrid);
	var pTile = pGrid.tiles[tile.y][tile.x];
	drawTile(tile, 'draw');
	drawTile(pTile, 'draw');

	$(this).on('mouseup', function(e) {
		$(this).unbind('mousemove');
	});

	$(this).on('mousemove', function(e) {
		e.preventDefault();
		var currentTile = getTile(e, oGrid);

		if (currentTile.x !== tile.x || currentTile.y !== tile.x) {
			var newTile = oGrid.tiles[currentTile.y][currentTile.x];
			var newPTile = pGrid.tiles[currentTile.y][currentTile.x];
			newTile.color = selectedColor;

			drawTile(newTile, 'draw');
			drawTile(newPTile, 'draw');
		}
		$(this).on('mouseout', function(e) {$(this).off('mousemove')});
		$(this).on('mouseup', function(e) {$(this).unbind('mousemove')});
	});
});

function updateDimensions(x, y, el) {
	console.log(x, y);
	el.html(x + ' x ' + y);
}

// function resizeGrid(x, y, grid, render) {
// 	grid.clear();
// 	grid.width = x;
// 	grid.height = y;
// 	render ? grid.init(render) : grid.init();
// }

function updatePreview() {
	$.extend(pGrid.tiles, oGrid.tiles);
	for (var row in pGrid.tiles) {
		for (var col in pGrid.tiles[row]) {
			pGrid.tiles[row][col].scale = pGrid.scale;
		}
	}
	pGrid.draw('render');
}

function getTile(e, grid) {
	var gridX = Math.floor((e.offsetX - 1)/ TILE_SIZE);
	var gridY = Math.floor((e.offsetY - 1)/ TILE_SIZE);
	return grid.tiles[gridY][gridX];
}

function drawTile(t, action) {
	t.color = selectedColor;
	t.render(action, t.color);
}

function getPixelColor(x, y) {
	var rgba = pickerCTX.getImageData(x, y, 1, 1).data;
	return "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
}

function rgbaLighten(str, mult) {
	str = str.substring(5, str.length-1).split(',');
	str[str.indexOf('0')] = mult * SWATCH_LIGHTNESS_STEP;
	return "rgba(" + str.join(',') + ")";
}

function updateSwatches() {
	var klass = ".swatch-";
	for (var i = 0; i < NUM_SWATCHES; i++) {
		var $swatch = $(klass + i);
		var newColor = rgbaLighten(selectedColor, i);
		$swatch.css('background-color', newColor);
	}
}

