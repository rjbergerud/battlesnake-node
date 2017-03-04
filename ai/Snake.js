'use strict';

const _ = require("underscore");

/**
 * @class Snake
 * Has all information about a snake (except name and taunts) given
 * by the request.  More importantly, it has some handy methods for
 * to explore its own possible future moves.
 * @param {Object} reqBody - might replace this with board
 * @param {string} uuid - snake's unique identifier
 */
module.exports = class Snake {

    constructor(reqBody, uuid, snake = null) {
        var me;

        //optionally can construct a clone from another snake
        if(snake !== null) {
          me = snake
        } else {
          for (var snake of reqBody.snakes) {
              if (snake.id == uuid) {
                  me = snake;
                  break;
              }
          }
        }


        // Want to clone everything so they can be modified
        // to explore future moves w/out overwriting
        // board/previous snakes's values

        this.uuid = me.uuid || me.id;
        this.id = me.uuid || me.id;
        this.health_points = me.health_points;
        this.coords = me.coords.map(_.clone);
        this.taunt = me.taunt;
        this.name = me.name;

    }

    get head() {
        return this.coords[0];
    }

    get tail() {
        return this.coords[this.coords.length - 1];
    }


    /**
     * Will return a copy of the snake who has moved in the direction
     * specified.  The direction will be taken whether or not its walkable,
     * it is the responsibility of the board keep track of snake, and tell
     * it on next turn whether or not it has died.
     * @param {string} direction - either of "up, "down", "left", "right"
     * @returns {Snake} a clone having taken the move.
     */
    move(direction) {
      var ghostSnake = this.clone()
      ghostSnake.health_points--;
      var nextCoord = []
      if(direction === 'left') {
        nextCoord[0] = ghostSnake.head[0] - 1;
        nextCoord[1] = ghostSnake.head[1];
        ghostSnake.coords.splice(0,0,nextCoord);
        ghostSnake.coords.pop()
      } else if(direction === 'right') {
        nextCoord[0] = ghostSnake.head[0] + 1;
        nextCoord[1] = ghostSnake.head[1];
        ghostSnake.coords.splice(0,0,nextCoord);
        ghostSnake.coords.pop()
      } else if(direction === 'up') {
        nextCoord[0] = ghostSnake.head[0];
        nextCoord[1] = ghostSnake.head[1] - 1;
        ghostSnake.coords.splice(0,0,nextCoord);
        ghostSnake.coords.pop()
      } else if(direction === 'down') {
        nextCoord[0] = ghostSnake.head[0];
        nextCoord[1] = ghostSnake.head[1] + 1;
        ghostSnake.coords.splice(0,0,nextCoord);
        ghostSnake.coords.pop()
      } else {
        throws("This is not a valid move", direction);
      }
      return ghostSnake;
    }

    clone() {
      return new Snake(null, null, this)
    }
}
