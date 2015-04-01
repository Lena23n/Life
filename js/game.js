function Game(id) {
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
	this.speed = 100;
	this.newSpeed = null;
	this.generationCount = null;
	this.isMouseHolded = false;
	this.isGameLoopActive = false;
}

Game.prototype = {
	init: function () {
		this.holder = document.getElementById(this.id);

		this.startGame();
	},

	startGame: function () {
		var self = this;

		this.isGameStarted = false;
		this.generationCount = '0';
		this.newSpeed = 0;

		this.clearHolder();
		this.drawer.init(this.holder, this.fieldSize, this.cellState);
		this.fillGameArray();
		this.drawer.countWrap.innerHTML = this.generationCount;
		this.drawer.draw(this.generation);


		this.drawer.field.addEventListener('click', function (e) {
			self.clickOnHolderEvent(e);
		});

		this.drawer.buttonsWrap.addEventListener('click', function (e) {
			self.getClickedButton(e);
		});

		this.drawer.speedController.wrap.addEventListener('mousedown', function (e) {
			self.isMouseHolded = true;
			self.mouseMoveEvent(e);
		});

		window.addEventListener('mousemove', function (e) {
			self.mouseMoveEvent(e);
		});

		window.addEventListener('mouseup', function () {
			self.isMouseHolded = false;
			self.changeSpeed();
		});
	},

	fillGameArray: function () {
		this.generation = [];
		this.newGeneration = [];
		var i,
			arrayLength = this.fieldSize.w * this.fieldSize.h;

		for (i = 0; i < arrayLength; i++) {
			this.generation[i] = this.cellState.DEAD;
			this.newGeneration[i] = this.cellState.DEAD;
		}
	},

	clearHolder: function () {
		this.holder.innerHTML = "";
	},

	clickOnHolderEvent: function (e) {
		var clickedCellIndex = this.getCoords(e);

		if (!this.isGameStarted) {
			this.setCells(clickedCellIndex);
		}
	},

	getCoords: function (e) {
		var offSetX = this.drawer.field.offsetLeft,
			offSetY = this.drawer.field.offsetTop,
			result,
			x,
			y;

		x = Math.floor((e.clientX - offSetX) / this.drawer.cellSize.w);
		y = Math.floor((e.clientY - offSetY) / this.drawer.cellSize.h);

		result = y * this.fieldSize.w + x;

		return result;
	},

	setCells: function (i) {
		switch (this.generation[i]) {
			case this.cellState.ALIVE:
				this.generation[i] = this.cellState.DEAD;
				break;
			default:
				this.generation[i] = this.cellState.ALIVE;
		}

		this.drawer.draw(this.generation);
	},

	getClickedButton: function (e) {
		this.clickedButton = e.target.getAttribute('button');
		this.changeGameState();
	},

	getSiblingIndices: function (i) {
		var w = this.fieldSize.w;

		//sibling cell index
		var sibling = {
			left: i - 1,
			topLeft: i - w - 1,
			top: (i - w),
			topRight: i - w + 1,
			right: i + 1,
			bottomRight: i + w + 1,
			bottom: i + w,
			bottomLeft: i + w - 1
		};

		return sibling;
	},

	findSiblings: function (i) {
		var w = this.fieldSize.w,
			result,
			siblings = this.getSiblingIndices(i),
			difference,
			currentCellX = i % w,
			currentCellY = Math.floor(i / w),
			map = {},
			key,
			obj,
			isSibling = {},
			realDifferenceX,
			realDifferenceY;

		//Necessary difference between current cell's x, y and its siblings x, y to be siblings
		difference = {
			left: [-1, 0],
			topLeft: [-1, -1],
			top: [0, -1],
			topRight: [1, -1],
			right: [1, 0],
			bottomRight: [1, 1],
			bottom: [0, 1],
			bottomLeft: [-1, 1]
		};

		//Difference between sibling cell's X and Y and current cell's X and Y
		for (key in siblings) {
			map[key] = [];
			map[key].push((siblings[key] % w) - currentCellX);
			map[key].push((Math.floor(siblings[key] / w) - currentCellY));
		}

		//check real difference
		for (obj in map) {
			realDifferenceX = map[obj][0] == difference[obj][0];
			realDifferenceY = map[obj][1] == difference[obj][1];

			isSibling[obj] = realDifferenceX && realDifferenceY;
		}

		result = isSibling;
		return result;
	},

	gamePlay: function () {
		var self = this,
			startTime = 0,
			dTime = 0,
			now = 0,
			tick;


		if (this.isGameLoopActive) {
			return false
		}

		startTime = Date.now();

		tick = function () {
			now = Date.now();
			dTime = now - startTime;

			if (dTime > self.speed) {
				startTime = now;
				console.log(self.speed);
				self.gameStep();
			}

			if (self.isGameStarted) {
				requestAnimationFrame(tick);
			} else if (!self.isGameStarted) {
				self.gameStep();
			}
		};

		tick();
	},

	gameStep : function () {
		var i, count, key, siblings, siblingIndices, isSibling,
			isSiblingAlive, isCellAlive, isCellDefined;
		this.newGeneration = [];

		for (i = 0; i < this.generation.length; i++) {
			siblings = this.findSiblings(i);
			siblingIndices = this.getSiblingIndices(i);
			isCellAlive = this.generation[i] == this.cellState.ALIVE;
			count = 0;

			for (key in siblings) {
				isSibling = siblings[key] === true;
				isCellDefined = this.generation[siblingIndices[key]] !== undefined;
				isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;

				if (isSibling && isSiblingAlive && isCellDefined) {
					count++;
				}
			}

			switch (isCellAlive) {
				case true:
					if (count < 2) {
						this.newGeneration[i] = this.cellState.DEAD;
					} else if (count > 3) {
						this.newGeneration[i] = this.cellState.DEAD;
					}
					else if ((count == 2) || (count == 3)) {
						this.newGeneration[i] = this.cellState.ALIVE;
					}
					break;
				default:
					if (count == 3) {
						this.newGeneration[i] = this.cellState.ALIVE;
					} else {
						this.newGeneration[i] = this.cellState.DEAD;
					}
			}
		}
		this.generation = this.newGeneration;

		this.drawer.draw(this.generation);
		this.generationCount++;
		this.drawer.countWrap.innerHTML = this.generationCount;
	},

	mouseMoveEvent : function (e) {
		var offSetX, speedButton, x, speedPerPixel;

		offSetX = this.drawer.speedController.wrap.offsetLeft;

		x = e.clientX - offSetX;

		if (x < 0) {
			x = 0;
		} else if (x > this.drawer.fieldWidth) {
			x = this.drawer.fieldWidth;
		}

		if(this.isMouseHolded) {
			speedButton = this.drawer.speedController.button;
			speedButton.style.left = x - 9 + 'px';
			speedPerPixel = 200/this.drawer.fieldWidth;

			this.newSpeed = Math.round(x*speedPerPixel);
			console.log(this.newSpeed);
		}
	},

	changeSpeed : function () {
		this.speed = this.newSpeed;
	},

	changeGameState: function () {
		switch (this.clickedButton) {
			case this.clickedButtonState.start:
				this.isGameStarted = true;
				this.gamePlay();
				this.isGameLoopActive = true;
				break;

			case this.clickedButtonState.step:
				this.isGameStarted = false;
				this.isGameLoopActive = false;
				this.gamePlay();
				break;

			case this.clickedButtonState.clear:
				this.isGameStarted = false;
				this.isGameLoopActive = false;
				this.startGame();
				break;
		}
	}
};

function pageLoaded() {
	var game = new Game('game-wrap');
	game.init();
}

window.addEventListener('DOMContentLoaded', pageLoaded);
