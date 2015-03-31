function Game (id) {
	this.id = id;
	this.holder = null;
	this.drawer = new Drawer();
	this.generation = [];
	this.newGeneration = [];
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
			this.newGeneration[i] = [];
			for (j = 0; j < this.fieldSize.h; j++) {
				this.generation[i][j] = this.cellState.DEAD;
				this.newGeneration[i][j] = this.cellState.DEAD;
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

	findSiblings : function (x, y) {

		var map = {
			left: [-1, 0],
			topLeft: [-1, -1],
			top: [0, -1],
			topRight: [1, -1],
			right: [1, 0],
			bottomRight: [1, 1],
			bottom: [0, 1],
			bottomLeft: [-1, 1]
		};

		var test = [];
		for (var key in map) {
			var siblingX = (x+map[key][0]),
				siblingY = (y+map[key][1]);

			if ((siblingX >= 0 && siblingY >= 0) && (siblingX < this.fieldSize.w && siblingY < this.fieldSize.w )) {
				test.push([siblingX, siblingY])
			}
		}
		return test;
	},

	gameLoop : function () {
		this.findCellsToBirth();
		this.drawer.draw(this.newGeneration);
	},

	findCellsToBirth : function () {
		var i, j, l, siblings,
			count = 0;

		for(i = 0; i < this.fieldSize.w; i++) {
			for (j = 0; j < this.fieldSize.h; j++) {
				siblings = this.findSiblings(i,j);

				for (l = 0; l < siblings.length; l++) {
					var x = siblings[l][0],
						y = siblings[l][1];

					if (this.generation[x][y] == this.cellState.ALIVE) {
						count++;
					}
					console.log(count)
					if (count == 3) {
						console.log('hi');
						this.newGeneration[i][j] == this.cellState.ALIVE;
					}
				}

			}
		}
	},

	changeGameState : function () {
		switch (this.clickedButton) {
			case this.clickedButtonState.start:
				this.isGameStarted = true;
				console.log('start game function');
				this.gameLoop();
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
