function Game (id) {
	this.id = id;
	this.holder = null;
	this.drawer = new Drawer();
	this.generation = [];
	this.fieldSize = {
		w: 40,
		h: 40
	};
	this.cellState = {
		DEAD: 0,
		ALIVE: 1
	};
	this.clickedButton = null;
	this.isGameStarted = null;
	this.clickedButtonState = {
		start: 'start',
		step: 'step',
		clear: 'clear'
	};
}

Game.prototype =  {
	init : function () {
		this.holder = document.getElementById(this.id);

		this.startGame();
	},

	startGame : function () {
		var self = this;
		this.isGameStarted = false;

		this.clearHolder();
		this.drawer.init(this.holder, this.fieldSize, this.cellState);
		this.fillGameArray();
		this.drawer.draw(this.generation);

		this.drawer.field.addEventListener('click', function (e) {
			self.clickOnHolderEvent(e);
		});

		this.drawer.buttonsWrap.addEventListener('click', function (e) {
			self.getClickedButton(e);
		});
	},

	fillGameArray : function () {
		var i, j;
		for (i = 0; i < this.fieldSize.w; i++) {
			this.generation[i] = [];
			for (j = 0; j < this.fieldSize.h; j++) {
				this.generation[i][j] = this.cellState.DEAD;
			}
		}
	},

	clearHolder : function () {
		this.holder.innerHTML = "";
	},

	clickOnHolderEvent : function (e) {
		var clickedCellCoords = this.getCoords(e);

		if(!this.isGameStarted) {
			this.setCells(clickedCellCoords.x, clickedCellCoords.y);
		}
	},

	getCoords : function (e) {
		var offSetX = this.drawer.field.offsetLeft,
			offSetY = this.drawer.field.offsetTop,
			result;

		result = {
			x: Math.floor((e.clientX - offSetX)/this.drawer.cellSize.w),
			y: Math.floor((e.clientY - offSetY)/this.drawer.cellSize.h)
		};

		return result;
	},

	setCells : function (x, y) {
		switch (this.generation[x][y]) {
			case this.cellState.ALIVE:
				this.generation[x][y] = this.cellState.DEAD;
				break;
			default:
				this.generation[x][y] = this.cellState.ALIVE;
		}

		this.drawer.draw(this.generation);
	},

	getClickedButton : function (e) {
		this.clickedButton = e.target.getAttribute('button');
		this.changeGameState();
	},

	changeGameState : function () {
		switch (this.clickedButton) {
			case this.clickedButtonState.start:
				this.isGameStarted = true;
				console.log('start game function');
				break;
			case this.clickedButtonState.step:
				this.isGameStarted = true;
				console.log('step game function');
				break;
			case this.clickedButtonState.clear:
				this.startGame();
				console.log('clear timeout');
				break;
		}
	}
};

function pageLoaded () {
	var game = new Game('game-wrap');
	game.init();
}

window.addEventListener('DOMContentLoaded', pageLoaded);
