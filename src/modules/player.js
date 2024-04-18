import { Circle, Vector } from "./geometry.js";
import { AnimatedSprite } from "./sprites.js";

/**
 * Represents the player and the methods to control it
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
		this.circle = new Circle(this.x, this.y, collisionRadius);
		/**
		 * A reused vector that represents the motion of the player
		 */
		this.vector = new Vector(x, y, 0, 0);
	}

	move() {
		this.x += this.dx;
		this.y += this.dy;
	}

	/**
	 * @param {number} x
	 */
	set x(x) {
		super.x = x;
		this.vector.x = x;
		this.circle.x = x;
	}

	/**
	 * @param {number} y
	 */
	set y(y) {
		super.y = y;
		this.vector.y = y;
		this.circle.y = y;
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