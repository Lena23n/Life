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
		this.generation = [];
		this.newGeneration = [];
		var i,
			arrayLength = this.fieldSize.w*this.fieldSize.h;

		for(i = 0; i < arrayLength; i++) {
			this.generation[i] = this.cellState.DEAD;
			this.newGeneration[i] = this.cellState.DEAD;
		}
		//var i, j;
		//for (i = 0; i < this.fieldSize.w; i++) {
		//	this.generation[i] = [];
		//	this.newGeneration[i] = [];
		//	for (j = 0; j < this.fieldSize.h; j++) {
		//		this.generation[i][j] = this.cellState.DEAD;
		//		this.newGeneration[i][j] = this.cellState.DEAD;
		//	}
		//}
	},

	clearHolder : function () {
		this.holder.innerHTML = "";
	},

	clickOnHolderEvent : function (e) {
		var clickedCellIndex = this.getCoords(e);

		if(!this.isGameStarted) {
			this.setCells(clickedCellIndex);
		}
	},

	getCoords : function (e) {
		var offSetX = this.drawer.field.offsetLeft,
			offSetY = this.drawer.field.offsetTop,
			result,
			x,
			y;

			x = Math.floor((e.clientX - offSetX)/this.drawer.cellSize.w);
			y = Math.floor((e.clientY - offSetY)/this.drawer.cellSize.h);

		result = y * this.fieldSize.w + x;

		return result;
	},

	setCells : function (i) {
		switch (this.generation[i]) {
			case this.cellState.ALIVE:
				this.generation[i] = this.cellState.DEAD;
				//this.newGeneration[i] = this.cellState.DEAD;
				break;
			default:
				this.generation[i] = this.cellState.ALIVE;
				//this.newGeneration[i] = this.cellState.ALIVE;
		}

		this.drawer.draw(this.generation);
	},

	getClickedButton : function (e) {
		this.clickedButton = e.target.getAttribute('button');
		this.changeGameState();
	},

	getSiblingIndices : function (i) {
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

	gameLoop : function () {
		var self = this;

		var gameStep = function () {
			//
			//var i = 19, count, key, siblings, siblingIndices, isSibling, isSiblingAlive, isCellAlive, isSib;
			//
			//siblings = this.findSiblings(i);
			//siblingIndices = this.getSiblingIndices(i);
			//
			//for (key in siblings) {
			//	isSibling = siblings[key] === true;
			//	isSib = this.generation[siblingIndices[key]] !== undefined;
			//	isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;
			//
			//	if (isSibling /*&& isSiblingAlive*/&& isSib ) {
			//			console.log(key,'hi');
			//	}
			//}

			//var i, count, key, siblings, siblingIndices, isSibling, isSiblingAlive, isCellDead;
			//
			//for (i = 0; i < this.generation.length; i++) {
			//	siblings = this.findSiblings(i);
			//	siblingIndices = this.getSiblingIndices(i);
			//	isCellDead = this.generation[i] == this.cellState.DEAD;
			//
			//	if (isCellDead) {
			//		count = 0;
			//		for (key in siblings) {
			//			isSibling = siblings[key] === true;
			//			var isCellDefined = this.generation[siblingIndices[key]] !== undefined;
			//			isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;
			//
			//			if (isSibling && isSiblingAlive && isCellDefined) {
			//				count++;
			//			}
			//		}
			//		if (count == 3) {
			//			this.newGeneration[i] = this.cellState.ALIVE;
			//		}
			//	}
			//	}
			//for (var k = 0; k < this.newGeneration.length; k++) {
			//	this.newGeneration[k] = this.cellState.DEAD;
			//}
			var i, count, key, siblings, siblingIndices, isSibling,
				isSiblingAlive, isCellAlive, isCellDefined;

			self.newGeneration = [];

			for (i = 0; i < self.generation.length; i++) {
				siblings = self.findSiblings(i);
				siblingIndices = self.getSiblingIndices(i);
				isCellAlive = self.generation[i] == self.cellState.ALIVE;
				count = 0;

				for (key in siblings) {
					isSibling = siblings[key] === true;
					isCellDefined = self.generation[siblingIndices[key]] !== undefined;
					isSiblingAlive = self.generation[siblingIndices[key]] == self.cellState.ALIVE;

					if (isSibling && isSiblingAlive && isCellDefined) {
						count++;
					}
				}

				if (!isCellAlive) {
					if (count == 3) {
						self.newGeneration[i] = self.cellState.ALIVE;
						console.log(i,'born');
					} else {
						self.newGeneration[i] = self.cellState.DEAD;
					}
				} else if (isCellAlive) {
					if (count < 2) {
						self.newGeneration[i] = self.cellState.DEAD;
						console.log(i,'DIE');
					} else if (count > 3) {
						self.newGeneration[i] = self.cellState.DEAD;
						console.log(i,'DIE');
					}
					else if ((count == 2) || (count == 3)) {
						self.newGeneration[i] = self.cellState.ALIVE;
						console.log(i,'Stay');
					}
				}

				//if ((count == 3) && (!isCellAlive)) {
				//	this.newGeneration[i] = this.cellState.ALIVE;
				//	console.log(i,'born');
				//} else if (((count < 2) && isCellAlive)) {
				//	this.newGeneration[i] = this.cellState.DEAD;
				//	console.log(i,'DIE');
				//} else if ((count > 3) && isCellAlive) {
				//	this.newGeneration[i] = this.cellState.DEAD;
				//	console.log(i,'DIE');
				//} else if ((isCellAlive) && ((count == 2) || (count == 3) )) {
				//	this.newGeneration[i] = this.cellState.ALIVE;
				//	console.log(i,'STay');
				//}

			}

			self.generation = self.newGeneration;
			self.drawer.draw(self.generation);
			//self.newGeneration = [];
			//for(var k = 0; k < self.fieldSize.w*self.fieldSize.h; k++) {
			//
			//	self.newGeneration[i] = self.cellState.DEAD;
			//}
		};

		gameStep();
		console.log(this.newGeneration);

		//this.gameLoop =  setInterval(gameStep, 1000);
		//this.gameStep();
		//this.gameStep2();
	},

	//gameStep2 : function () {
	//	var i, count, key, siblings, siblingIndices, isSibling, isSiblingAlive, isCellAlive;
	//
	//	for (i = 0; i < this.generation.length; i++) {
	//		siblings = this.findSiblings(i);
	//		siblingIndices = this.getSiblingIndices(i);
	//		isCellAlive = this.generation[i] == this.cellState.ALIVE;
	//
	//		if(isCellAlive) {
	//			count = 0;
	//			for (key in siblings) {
	//				isSibling = siblings[key] === true;
	//				var isCellDefined = this.generation[siblingIndices[key]] !== undefined;
	//				isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;
	//
	//				if (isSibling && isSiblingAlive && isCellDefined) {
	//					count++;
	//				}
	//			}
	//		console.log(count);
	//			if (count < 2 || count >= 3) {
	//				this.newGeneration[i] = this.cellState.DEAD;
	//			}
	//		}
	//	}
	//
	//	this.generation = this.newGeneration;
	//	this.drawer.draw(this.generation);
	//},

	gameStep : function () {
		//
		//var i = 19, count, key, siblings, siblingIndices, isSibling, isSiblingAlive, isCellAlive, isSib;
		//
		//siblings = this.findSiblings(i);
		//siblingIndices = this.getSiblingIndices(i);
		//
		//for (key in siblings) {
		//	isSibling = siblings[key] === true;
		//	isSib = this.generation[siblingIndices[key]] !== undefined;
		//	isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;
		//
		//	if (isSibling /*&& isSiblingAlive*/&& isSib ) {
		//			console.log(key,'hi');
		//	}
		//}

		//var i, count, key, siblings, siblingIndices, isSibling, isSiblingAlive, isCellDead;
		//
		//for (i = 0; i < this.generation.length; i++) {
		//	siblings = this.findSiblings(i);
		//	siblingIndices = this.getSiblingIndices(i);
		//	isCellDead = this.generation[i] == this.cellState.DEAD;
		//
		//	if (isCellDead) {
		//		count = 0;
		//		for (key in siblings) {
		//			isSibling = siblings[key] === true;
		//			var isCellDefined = this.generation[siblingIndices[key]] !== undefined;
		//			isSiblingAlive = this.generation[siblingIndices[key]] == this.cellState.ALIVE;
		//
		//			if (isSibling && isSiblingAlive && isCellDefined) {
		//				count++;
		//			}
		//		}
		//		if (count == 3) {
		//			this.newGeneration[i] = this.cellState.ALIVE;
		//		}
		//	}
		//	}
		//for (var k = 0; k < this.newGeneration.length; k++) {
		//	this.newGeneration[k] = this.cellState.DEAD;
		//}
		var self = this;
		var i, count, key, siblings, siblingIndices, isSibling,
			isSiblingAlive, isCellAlive, isCellDefined;

		for (i = 0; i < self.generation.length; i++) {
			siblings = self.findSiblings(i);
			siblingIndices = self.getSiblingIndices(i);
			isCellAlive = self.generation[i] == self.cellState.ALIVE;
			count = 0;

			for (key in siblings) {
				isSibling = siblings[key] === true;
				isCellDefined = self.generation[siblingIndices[key]] !== undefined;
				isSiblingAlive = self.generation[siblingIndices[key]] == self.cellState.ALIVE;

				if (isSibling && isSiblingAlive && isCellDefined) {
					count++;
				}
			}

			if (!isCellAlive) {
				if (count == 3) {
					self.newGeneration[i] = self.cellState.ALIVE;
						console.log(i,'born');
				} else {
					self.newGeneration[i] = self.cellState.DEAD;
				}
			} else if (isCellAlive) {
				if (count < 2) {
					self.newGeneration[i] = self.cellState.DEAD;
						console.log(i,'DIE');
				} else if (count > 3) {
					self.newGeneration[i] = self.cellState.DEAD;
					console.log(i,'DIE');
				}
				else if ((count == 2) || (count == 3)) {
					self.newGeneration[i] = self.cellState.ALIVE;
						console.log(i,'Stay');
				}
			}

			//if ((count == 3) && (!isCellAlive)) {
			//	this.newGeneration[i] = this.cellState.ALIVE;
			//	console.log(i,'born');
			//} else if (((count < 2) && isCellAlive)) {
			//	this.newGeneration[i] = this.cellState.DEAD;
			//	console.log(i,'DIE');
			//} else if ((count > 3) && isCellAlive) {
			//	this.newGeneration[i] = this.cellState.DEAD;
			//	console.log(i,'DIE');
			//} else if ((isCellAlive) && ((count == 2) || (count == 3) )) {
			//	this.newGeneration[i] = this.cellState.ALIVE;
			//	console.log(i,'STay');
			//}

		}

		self.generation = self.newGeneration;
		console.log(self.generation);
		this.drawer.draw(self.generation);

		for(var k = 0; k < self.newGeneration.length; k++) {
			self.newGeneration[i] = self.cellState.DEAD;
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
				this.gameLoop();
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
