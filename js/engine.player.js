engine.player = {
    tileX: null,
    tileY: null,
    tileXStartPosition: 7,
    tileYStartPosition: 0,
    lastTileX: 0,
    lastTileY: 0,
    lastInput: null,
    nextStone: null,
    currentStone: null,
    lastStone: null,
    blockfactory: null
};

/**
 * initialisation of the Player
 * 
 * @param {tetris.blockfactory} blockfactory for block handling
 * @returns {void}
 */
engine.player.init = function(blockfactory){
    this.blockfactory = blockfactory;
    this.lastStone = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    ];
    this.nextStone = this.blockfactory.create();
    this.createNewStone();
    
}

/**
 * Create a new stone
 *
 * @returns {void}
 */
engine.player.createNewStone = function(){
    this.currentStone = this.nextStone;
    this.nextStone = this.blockfactory.create();
    engine.player.tileX = engine.player.tileXStartPosition;
    engine.player.tileY = engine.player.tileYStartPosition;
}

/**
 * Move the stone in a direction
 *
 * @param {string} direction the direction to move
 * @returns {void}
 */
engine.player.move = function(direction){
    this.lastInput = direction;
}


/**
 * Collision detection between a stone and the map if the stone is moving in x,y axis
 *
 * @param {Array} currentStone
 * @param {Array} currentMap
 * @param {integer} dTilesX check collision if currentStone is moved dTilesX in x-Axis
 * @param {integer} dTilesY check collision if currentStone is moved dTilesX in y-Axis
 * @returns boolean
 */
engine.player.collide = function(currentStone, currentMap, dTilesX, dTilesY){
    for(var y = 0; y < currentStone.length; y++){
        for(var x = 0; x < currentStone[0].length; x++){
            if(currentStone[y][x]){
                var newTilePosX = this.tileX + x + dTilesX;
                var newTilePosY = this.tileY + y + dTilesY;
                //collision border
                if(  newTilePosX >= currentMap[0].length || //collision right border
                    newTilePosX  < 0 || //collision left border
                    newTilePosY >= currentMap.length ){ //collision bottom border
                    return true;
                }
                //collision check horizontal with map
                if(currentMap[newTilePosY][newTilePosX]){
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Turns a stone
 *
 * @param {Array} currentStone
 * @param {String} direction 'right'|'left'
 * @return {Array} turnedStone
 */
engine.player.turnStone = function(currentStone, direction){
    var turnedStone = [];
    switch (currentStone.length) {
        case 2:
            turnedStone = [[],[]];
            break;
        case 3:
            turnedStone = [[],[],[]];
            break;
        case 4:
            turnedStone = [[],[],[],[]];
            break;
        default:
            break;
    }

    var newTilePosX;
    var newTilePosY;
    
    for(var y = 0; y < currentStone.length; y++){
        for(var x = 0; x < currentStone[0].length; x++){
            if(direction === 'right'){
                newTilePosX = currentStone.length - 1 - y;
                newTilePosY = x;
                turnedStone[newTilePosY][newTilePosX] = currentStone[y][x];
            }
            if(direction === 'left'){
                newTilePosX = y;
                newTilePosY = currentStone[0].length - 1 - x;
                turnedStone[newTilePosY][newTilePosX] = currentStone[y][x];
            }
        }
    }
    return turnedStone;
}

/**
 * Payer rendering
 *
 * @return {void} 
 */
engine.player.draw = function(){
    for(var y = 0; y < engine.player.currentStone.length; y++){
        for(var x = 0; x < engine.player.currentStone[0].length; x++){
            if(engine.player.currentStone[y][x]){
                engine.context.fillStyle = "rgb(200,0,0)";
                engine.context.fillRect (engine.screen.tilesX * x + engine.screen.tilesX * engine.player.tileX , engine.screen.tilesX * y + engine.screen.tilesX * engine.player.tileY, engine.screen.tilesX, engine.screen.tilesY);
            }
        }
    }
}

/**
 * Update Player logic
 *
 * @return {void} 
 */
engine.player.update = function(){
    this.lastTileX = this.tileX;
    this.lastTileY = this.tileY;
    this.lastStone = this.currentStone;
    var currentMap = engine.map.currentMap;
    
    switch(this.lastInput){
        
        case 'right':
            if(!this.collide(this.currentStone, currentMap, 1, 0)){
                this.tileX++;
            }
            break;
        case 'left':
            if(!this.collide(this.currentStone, currentMap, -1, 0)){
                this.tileX--;
            }
            break;
        case 'down':
            if(this.collide(this.currentStone, currentMap, 0, 1)){
                engine.map.fixStone(this.currentStone, currentMap);
                engine.map.reduceLines();
                this.createNewStone();
            }
            this.tileY++;
            break;
        case 'turn':
            var turnedStone = this.turnStone(this.currentStone, 'right');
            if(!this.collide(turnedStone, currentMap, 0, 0)){
                this.currentStone = this.turnStone(this.currentStone, 'right');
            }
            break;
        default:
            break;
    }
    this.lastInput = null;
}