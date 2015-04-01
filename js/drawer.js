function Drawer () {
	this.field = null;
	this.ctx = null;
	this.fieldWidth = 500;
	this.fieldHeight = 500;
	this.fieldSize = {
		w: null,
		h: null
	};
	this.holder = null;
	this.buttonsWrap = null;
	this.cellState = null;
	this.cellSize = {
		w: null,
		h: null
	};
	this.countWrap = null;
}

Drawer.prototype = {
	init : function (holder, fieldSize, cellState) {
		this.holder = holder;
		this.cellState = cellState;

		this.generateField();
		this.generateButtons();
		this.generateTimeBlock();

		this.fieldSize.w = fieldSize.w;
		this.fieldSize.h = fieldSize.h;

		this.cellSize.w = this.fieldWidth / this.fieldSize.w;
		this.cellSize.h = this.fieldHeight / this.fieldSize.h;
	},

	generateField : function () {
		this.field = document.createElement('canvas');
		this.field.id = 'canvas';
		this.ctx = this.field.getContext('2d');
		this.field.width = this.fieldWidth;
		this.field.height = this.fieldHeight;

		this.attachToDOM(this.holder, this.field);
	},

	generateButtons : function () {
		this.buttonsWrap = document.createElement('div');
		this.buttonsWrap.setAttribute('class','button-wrap');
		this.attachToDOM(this.holder, this.buttonsWrap);

		this.generateDOMElement('div', 'Start', 'button', 'start', 'class', 'button');
		this.generateDOMElement('div', 'Step', 'button', 'step', 'class', 'button');
		this.generateDOMElement('div', 'Clear', 'button', 'clear', 'class', 'button');
	},

	generateDOMElement : function (tag, text, attribute1, value1, attribute2, value2) {
		var div = document.createElement(tag);

		div.setAttribute(attribute1, value1);
		div.setAttribute(attribute2, value2);
		div.innerHTML = text;

		this.attachToDOM(this.buttonsWrap, div);
	},

	generateTimeBlock : function () {
		var div = document.createElement('div');
		this.countWrap = document.createElement('span');

		div.setAttribute('class', 'generation');
		div.innerHTML = 'Generation: ';

		this.attachToDOM(this.buttonsWrap, div);
		this.attachToDOM(div, this.countWrap);

	},

	attachToDOM : function (holder, child) {
		holder.appendChild(child);
	},

	draw : function (array) {
		var i, x, y, text;

		for(i = 0; i < array.length; i++) {
			x = (i % this.fieldSize.w) * this.cellSize.w;
			y = (Math.floor(i / this.fieldSize.h)) * this.cellSize.h;
			text = array[i];
			this.drawCell(x, y, text);
		}

	},

	drawCell : function (x, y, text) {

		switch (text) {
			case this.cellState.DEAD:
				this.ctx.fillStyle = 'black';
				this.ctx.strokeStyle = '#333';
				break;
			case this.cellState.ALIVE:
				this.ctx.fillStyle = '#14D868';
				this.ctx.strokeStyle = '#386C4F';
				break;
		}

		this.ctx.fillRect(x, y, this.cellSize.w, this.cellSize.h);
		this.ctx.strokeRect(x, y, this.cellSize.w, this.cellSize.h);
	}
};
