// We compute the path of this script
const scripts= document.getElementsByTagName('script');
const path= scripts[scripts.length-1].src.split('?')[0];
const _DIR_ = path.split('/').slice(0, -1).join('/')+'/';

/**
 *	JS Processor for MIU Snake Game
**/
function miuSnakeProcessor() {
	
	// A utility library by Zekeng
	if (typeof miuDomLib === 'undefined') {
		throw new Error('MIU DOM Library is required for MIU Snake');
	}


	// The snake
	this.snake = [];

	// Potential obstacles
	this.obstacles = [];

	// The chased animal
	this.tchop = null;

	// Current snake's direction
	this.direction = null;

	// The number of cells per row (could be parameter of the game)
	this.side = 32;

	// The speed of the game
	this.gameSpeed = 100;

	// The score of the player
	this.score = 0;
	
	// The running interval for the game
	this.gameInterval = null;
	
	/* The function that inits the game */
	this.initSnake = function(p) {
		// Including dynamically the stylesheet
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = _DIR_ + 'css/miu.snake.css';
		document.head.appendChild(link);
		
		// The width and height of each cell
		var sideSize = 10;

		// Creating and designing the game zone
		var selector;
		if (p && p.selector) {
			selector = p.selector;
		} else {
			selector = '#snake-game-zone';
		}
		var gameZone = document.querySelector(selector);
		if (!gameZone) {
			gameZone = document.createElement('div');
			gameZone.id = 'snake-game-zone';
			document.body.appendChild(gameZone);
		}
		miuDomLib.addClass(gameZone, 'snake-game-zone');
		gameZone.innerHTML = '<div id="snake-game-information">' +
								'<div class = "snake-game-score">' +
									'<span id = "snake-game-score-label">score:<span>' +
									'<span id = "snake-game-score">0</span>' + 
								'</div>' +
							 '</div>' +
							 '<div id="snake-game-inner"></div>' + 
							 '<div id="snake-game-controls">' + 
								'<button class="snake-game-controller" onclick="return miuSnake.start();">play</button>' +
								'<button class="snake-game-controller" onclick="return miuSnake.restart();">restart</button>' +
							 '</div>';
		const music = '<audio src="' + _DIR_ + 'audio/1.mp3" loop id="snake-game-song"></audio>';
		gameZone.innerHTML += music;

		var gameZoneInformation = document.querySelector('#snake-game-information');
		var gameZoneInner = document.querySelector('#snake-game-inner');
		var gameController = document.getElementsByClassName('snake-game-controller');
		gameZone.style.width = (this.side * sideSize + miuDomLib.getStyleVal(gameZoneInner, 'border-left-width') + miuDomLib.getStyleVal(gameZoneInner, 'border-right-width')) + 'px';
		gameZoneInformation.style.width = (this.side * sideSize) + 'px';
		gameZoneInner.style.width = (this.side * sideSize) + 'px';
		gameZoneInner.style.height = (this.side * sideSize) + 'px';

		var i = 1, x = 1, y = 1;
		for (; i <= this.side * this.side; i++, x = ((i - 1) % this.side) + 1, y = Math.floor((i - 1) / this.side) + 1) {
			var gameCell = document.createElement('div');
			gameCell.id = getGameCellId(x, y);
			miuDomLib.addClass(gameCell, 'snake-game-cell');
			gameCell.style.width = sideSize + 'px';
			gameCell.style.height = sideSize + 'px';
			gameZoneInner.appendChild(gameCell);
		}

		// Initializing the game objects
		this.snake.push({
			x: 1,
			y: 1,
		});
		this.direction = 'right';
		this.tchop = generateTchop(this.side, this.snake, this.obstacles);

		renderAll(this.side, this.snake, this.obstacles, this.tchop, this.direction);

		if (this.tchop === null) {
			weHaveAWinner();
		}

		window.addEventListener('keydown', keyPressed.bind(this));

	};

	// This function start the game
	this.start = function() {
		if(this.gameInterval === null) {
			putOnTheMusic(this);
		}
		var button_start = document.getElementsByClassName('snake-game-controller')[0];
		if(button_start.innerHTML.trim() === 'pause') {
			button_start.innerHTML = 'continue';
			pause(this);
			return true;
		} else {
			if(button_start.innerHTML.trim() === 'continue' || button_start.innerHTML.trim() === 'play') {
				button_start.innerHTML = 'pause';
				play(this);
				return true;
			}
		}
	};

	// This function pauses the game
	var pause = function(game) {
		clearInterval(game.gameInterval);
		game.gameInterval = null;
		putPauseTheMusic(game);
		return true;
	};
	
	// This function plays the game
	var play = function(game) {
		if (game.gameInterval !== null) {
			clearInterval(game.gameInterval);
			game.gameInterval = null;
		}
		game.gameInterval = setInterval(move.bind(game), game.gameSpeed);
		return true;
	};

	// This function restarts the game
	this.restart = function(){
		putOffTheMusic(this);
		var i = this.snake.length - 1;
		while(i > 0){
			this.snake.pop();
			i--;
		}
		const last_snake_head = document.querySelector('#' + getGameCellId(this.snake[0].x, this.snake[0].y));
		this.snake[0].x = 1;
		this.snake[0].y = 1;
		this.direction = 'right';
		const Final_Descision = 'score: ' + this.score;
		alert(Final_Descision);
		cleanCell(last_snake_head);
		this.score = 0;
		document.querySelector('#snake-game-score').innerHTML = this.score;
		document.getElementsByClassName('snake-game-controller')[0].innerHTML = 'play';
		generateTchop(this.side, this.snake, this.obstacles);
		renderAll(this.side, this.snake, this.obstacles, this.tchop, this.direction, this.score);
		pause(this);
		return true;
	};

	// Function to switch on the music of the game
	var putOnTheMusic = function() {
		var gameSong = document.querySelector('#snake-game-song');
		gameSong.play();
	};
	
	// Function to switch off the music of the game
	var putOffTheMusic = function(game) {
		var gameSong = document.querySelector('#snake-game-song');
		gameSong.pause();
		gameSong.currentTime = 0;
	};
	
	// Function to pause the music of the game
	var putPauseTheMusic = function() {
		var gameSong = document.querySelector('#snake-game-song');
		gameSong.pause();
	};

	// Function to switch on the music after tchop
	var putOnTheMusicAfterTchop = function(score) {
		var gameZone = document.querySelector('#snake-game-zone');
		var last_music = document.querySelector('#snake-game-tchop-song');
		const music = document.createElement('audio');
		music.src = _DIR_ + 'audio/2.mp3';
		music.id = 'snake-game-tchop-song';
		music.autoplay = true;
		if(last_music === null && score === 0) {
			gameZone.appendChild(music);
		} else 
			last_music = music;
	};

	// Function to listen to update after keyboard event
	var keyPressed = function(event) {
		var button_start = document.getElementsByClassName('snake-game-controller')[0];
		var onPause = button_start.innerHTML.trim() === 'continue' || button_start.innerHTML.trim() === 'play';
		switch (event.key) {
			case 'ArrowRight': {
				if (!onPause && this.direction !== 'left' && this.direction !== 'right') {
					this.direction = 'right';
				}
				break;
			}
			case 'ArrowDown': {
				if (!onPause && this.direction !== 'top' && this.direction !== 'bottom') {
					this.direction = 'bottom';
				}
				break;
			}
			case 'ArrowLeft': {
				if (!onPause && this.direction !== 'right' && this.direction !== 'left') {
					this.direction = 'left';
				}
				break;
			}
			case 'ArrowUp': {
				if (!onPause && this.direction !== 'bottom' && this.direction !== 'top') {
					this.direction = 'top';
				}
				break;
			}
			case 'p': {
				this.start();
				break;
			}
		}
	};

	var changeSpeed = function(game) {
		game.gameSpeed -= 10;
	};

	// Function to generate the Id of a cell
	var getGameCellId = function(x, y) {
		return 'snake-game-cell-' + x + '-' + y;
	};

	// Function to generate a random animal to be chased. the function returns null when the game is completed
	var generateTchop = function(_side, _snake, _obs) {
		const generated = [];
		while (true) {
			var _x = Math.floor(Math.random() * (_side - 1)) + 1;
			var _y = Math.floor(Math.random() * (_side - 1)) + 1;
			var used = false;
			for (const cell of generated) {
				if (_x === cell.x && _y === cell.y) {
					used = true;
					break;
				}
			}
			if (!used) {
				generated.push({
					x: _x,
					y: _y
				});
				for (const cell of _snake) {
					if (_x === cell.x && _y === cell.y) {
						used = true;
						break;
					}
				}
			}
			if (!used) {
				for (const cell of _obs) {
					if (_x === cell.x && _y === cell.y) {
						used = true;
						break;
					}
				}
			}
			if (!used) {
				return {
					x: _x,
					y: _y
				};
			} else {
				if (generated.length === this.side * this.side) {
					return null;
				}
			}
		}
	};

	// Function to announce the winner and stop the game
	var weHaveAWinner = function() {
		alert('You win!');
	};

	// Function to announce the lost
	var youLoose = function() {
		alert('You loose!');
	};

	// Function to update style of the whole game zone
	var renderAll = function(_side, _snake, _obs, _tchop, _dir,_score) {
		var i = 1, x = 1, y = 1;
		for (; i <= _side * _side; i++, x = ((i - 1) % _side) + 1, y = Math.floor((i - 1) / _side) + 1) {
			const cell = document.querySelector('#' + getGameCellId(x, y));
			cleanCell(cell);
		}
		i = 0;
		for (const _cell of _snake) {
			const cell = document.querySelector('#' + getGameCellId(_cell.x, _cell.y));
			if (i === 0) {
				miuDomLib.addClass(cell, 'snake-head');
				miuDomLib.addClass(cell, 'snake-head-dir-' + _dir);
			} else {
				miuDomLib.addClass(cell, 'snake-body');
				const nextCell = _snake[i];
				miuDomLib.addClass(cell, 'snake-body-dir-' + nextDirection(cell, nextCell));
			}
			i++;
		}
		for (const _cell of _obs) {
			const cell = document.querySelector('#' + getGameCellId(_cell.x, _cell.y));
			miuDomLib.addClass(cell, 'snake-obstacle');
		}
		const cell = document.querySelector('#' + getGameCellId(_tchop.x, _tchop.y));
		miuDomLib.addClass(cell, 'snake-tchop');
		this.score = _score;
	};

	var nextDirection = function(cell, nextCell) {
		if (nextCell.x > cell.x) {
			return 'right';
		}
		if (nextCell.x < cell.x) {
			return 'left';
		}
		if (nextCell.y > cell.y) {
			return 'top';
		}
		if (nextCell.y < cell.y) {
			return 'bottom';
		}
		return 'unknow';
	};

	// Function to move the snake
	var move = function() {
		if (canMove(this)) {
			var i = 0;
			var newSnakeQueue = null;
			var nextCell = null;
			for (const _cell of this.snake) {
				const cell = document.querySelector('#' + getGameCellId(_cell.x, _cell.y));
				if (i === 0) {
					const pos = getNextHeadPosition(_cell, this.direction);
					const newCell = document.querySelector('#' + getGameCellId(pos.x, pos.y));
					newSnakeQueue = tchopAndYamohIfPossible(this, pos);
					cleanCell(cell);
					cleanCell(newCell);

					miuDomLib.addClass(newCell, 'snake-head');
					miuDomLib.addClass(newCell, 'snake-head-dir-' + this.direction);
					nextCell = {
						x: _cell.x,
						y: _cell.y
					};
					_cell.x = pos.x;
					_cell.y = pos.y;
				} else {
					const newCell = document.querySelector('#' + getGameCellId(nextCell.x, nextCell.y));
					cleanCell(cell);
					cleanCell(newCell);
					miuDomLib.addClass(newCell, 'snake-body');
					var newCoord = {
						x: nextCell.x,
						y: nextCell.y
					};
					var tmp = {
						x: _cell.x,
						y: _cell.y
					};
					_cell.x = nextCell.x;
					_cell.y = nextCell.y;
					nextCell = tmp;

					var next = this.snake[i - 1];
					miuDomLib.addClass(newCell, 'snake-body-dir-' + nextDirection(newCoord, next));
				}
				i++;
			}
			if (newSnakeQueue !== null) {
				this.snake.push(newSnakeQueue);
				var newCell = document.querySelector('#' + getGameCellId(newSnakeQueue.x, newSnakeQueue.y));
				cleanCell(newCell);
				miuDomLib.addClass(newCell, 'snake-body');
				var next = this.snake[this.snake.length - 2];
				miuDomLib.addClass(newCell, 'snake-body-dir-' + nextDirection(newCell, next));

				this.score += 5;
				document.querySelector('#snake-game-score').innerHTML = this.score;
				putOnTheMusicAfterTchop(this.score);
				this.tchop = generateTchop(this.side, this.snake, this.obstacles);
				if (this.tchop === null) {
					weHaveAWinner();
				} else {
					newCell = document.querySelector('#' + getGameCellId(this.tchop.x, this.tchop.y));
					cleanCell(newCell);
					miuDomLib.addClass(newCell, 'snake-tchop');
				}
			}
		} else {
			putOffTheMusic(this);
			youLoose();
			gameover(this);
		}
	};

	// Function to "tchop" if possible
	var tchopAndYamohIfPossible = function(game, nextPos) {
		if (game.tchop.x === nextPos.x && game.tchop.y === nextPos.y) {
			return {
				x: game.snake[game.snake.length - 1].x,
				y: game.snake[game.snake.length - 1].y
			};
		}
		return null;
	};

	// Function to check if the move is possible
	var canMove = function(game) {
		const pos = getNextHeadPosition(game.snake[0], game.direction);
		if (pos.x >= 1 && pos.x <= game.side && pos.y >= 1 && pos.y <= game.side) {
			for (const _cell of game.snake) {
				if (_cell.x === pos.x && _cell.y === pos.y) {
					return false;
				}
			}
			for (const _cell of game.obstacles) {
				if (_cell.x === pos.x && _cell.y === pos.y) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	};

	var getNextHeadPosition = function(_head, _dir) {
		switch (_dir) {
			case 'right': {return {x: _head.x + 1, y: _head.y};}
			case 'bottom': {return {x: _head.x, y: _head.y + 1};}
			case 'left': {return {x: _head.x - 1, y: _head.y};}
			case 'top': {return {x: _head.x, y: _head.y - 1};}
		}
	};

	var cleanCell = function(cell) {
		miuDomLib.remClass(cell, 'snake-head');
		miuDomLib.remClass(cell, 'snake-body');
		miuDomLib.remClass(cell, 'snake-tchop');
		miuDomLib.remClass(cell, 'snake-obstacle');
		miuDomLib.remClass(cell, 'snake-head-dir-right');
		miuDomLib.remClass(cell, 'snake-head-dir-bottom');
		miuDomLib.remClass(cell, 'snake-head-dir-left');
		miuDomLib.remClass(cell, 'snake-head-dir-top');
		miuDomLib.remClass(cell, 'snake-body-dir-right');
		miuDomLib.remClass(cell, 'snake-body-dir-bottom');
		miuDomLib.remClass(cell, 'snake-body-dir-left');
		miuDomLib.remClass(cell, 'snake-body-dir-top');
	};

	// This function end the game
	var gameover = function(game){
		var i = game.snake.length - 1;
		while(i > 0){
			game.snake.pop();
			i--;
		}
		const last_snake_head = document.querySelector('#' + getGameCellId(game.snake[0].x, game.snake[0].y));
		game.snake[0].x = 1;
		game.snake[0].y = 1;
		game.direction = 'right';
		const Final_Descision = 'score: ' + game.score;
		alert(Final_Descision);
		document.getElementsByClassName('snake-game-controller')[0].innerHTML = 'play';
		cleanCell(last_snake_head);
		game.score = 0;
		document.querySelector('#snake-game-score').innerHTML = game.score;
		generateTchop(game.side,game.snake,game.obstacles);
		renderAll(game.side, game.snake, game.obstacles, game.tchop, game.direction,game.score);
		pause(game);
		return true;
	}

}

var miuSnake = new miuSnakeProcessor;