import { Circle, Vector } from "./geometry.js";
import { AnimatedSprite } from "./sprites.js";

/**
 * Represents the player and the methods to control it
 * 
 * x and y should not be directly changed, call updateX() and updateY() instead
 *
 * Spritesheet information:
 *
 * Group 0 is an idle animation or frame
 *
 * Group 1 is for right rolling
 *
 * Group 2 is for left rolling
 *
 * Group 3 is for air/track move right
 *
 * Group 4 is for air/track move up
 *
 * Group 5 is for air/track move left
 *
 * Group 6 is for air/track move down
 *
 * Group 7 is for the death animation
 */
export class Player extends AnimatedSprite {
	/**
	 *
	 * @param {number} id - An id to refer to the player as
	 * @param {number} x - The x of the player
	 * @param {number} y - The y of the player
	 * @param {number} width - The width of the player
	 * @param {number} height - The height of the player
	 * @param {SpriteSheet} spriteSheet - The spritesheet of the player
	 * @param {Number} collisionRadius - The radius of the player's bounding sphere
	 */
	constructor(id, x, y, width, height, spriteSheet, collisionRadius) {
		super(id, spriteSheet, x, y, width, height);
		/**
		 * A circle representing the collision of the player
		 */
		this.centerOffsetX = width / 2;
		this.centerOffsetY = height / 2;

		this.circle = new Circle(this.x + this.centerOffsetX, this.y + this.centerOffsetY, collisionRadius);
		/**
		 * A reused vector that represents the motion of the player
		 * 
		 * Coordinates are set to 0 and are not used
		 */
		this.vector = new Vector(0, 0, 0, 0);
	}


	move() {
		this.updateX(this.x + this.vector.dx);
		this.updateY(this.y + this.vector.dy);
	}

	/**
	 * @param {number} x
	 */
	updateX(x) {
		this.x = x;
		this.circle.x = x + this.centerOffsetX;
	}

	/**
	 * @param {number} y
	 */
	updateY(y) {
		this.y = y;
		this.circle.y = y + this.centerOffsetY;
	}

	get dx() {
		return this.vector.dx
	}

	get dy() {
		return this.vector.dy
	}

	/**
	 * @param {number} dx
	 */
	set dx(dx) {
		this.vector.dx = dx;
	}

	/**
	 * @param {number} dy
	 */
	set dy(dy) {
		this.vector.dy = dy;
	}

	/**
	 * Bounces the sphere off of a line (vector)
	 * @param {Vector} collidedVector - The vector the player collided with
	 */
	bounce(collidedVector) {
		//collided vector's angle
		let collidedAngle = collidedVector.angle;
		//moving vector's angle
		let moveAngle = this.vector.angle;
		//the angle between the two vectors
		let angleBetween = moveAngle - collidedAngle;
		//ending movement vector's angle
		let finalAngle = (Math.PI / 2 - Math.abs(2 * angleBetween) * Math.sign(angleBetween) + Math.PI);
		this.dx = Math.cos(finalAngle) * this.vector.magnitude;
		this.dy = Math.sin(finalAngle) * this.vector.magnitude;
	}
}