import { STANDARD_INTERVAL } from "./reusables.js";

/**
 * Represents a rectangle
 */
export class Rectangle {
	/**
	 *
	 * @param {number} x - The x coordinate of the rectangle
	 * @param {number} y - The y coordinate of the rectangle
	 * @param {number} width - The width of the rectangle
	 * @param {number} height - The height of the rectangle
	 */
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

/**
 * Represents a rectangle with functions for moving
 */
export class Box extends Rectangle {
	/**
	 *
	 * @param {number} id - An id to refer to the rectangle
	 * @param {number} x - The x coordinate of the rectangle
	 * @param {number} y - The y coordinate of the rectangle
	 * @param {number} width - The width of the rectangle
	 * @param {number} height - The height of the rectangle
	 */
	constructor(id, x = 0, y = 0, width = 0, height = 0) {
		super(x, y, width, height)
		this.id = id;
	}

	/**
	 * Moves the box instantly by a certain distance
	 * @param {number} dx - The amount of x units to move
	 * @param {number} dy - The amount of y units to move
	 */
	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	/**
	 * Move the box instantly to specific coordinates
	 * @param {number} x - The x coordinate to move to
	 * @param {number} y - The y coordinate to move to
	 */
	moveTo(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		this.move(dx, dy);
	}

	/**
	 * Moves the box over time by a certain distance
	 * @param {number} dx - The amount of x units to move
	 * @param {number} dy - The amount of y units to move
	 * @param {number} time - The amount of time in milliseconds to move
	 * @param {number} dt - The amount of time in milliseconds between each movement
	 */
	moveTimed(dx, dy, time, dt = STANDARD_INTERVAL) {
		//n = repetitions
		let n = time / dt;
		dx = dx / n;
		dy = dy / n;
		let counter = 1;
		let loop;
		const moveLoop = async () => {
			if (counter == n) {
				clearInterval(loop);
			}
			this.move(dx, dy);
			counter++;
		}
		loop = setInterval(moveLoop, dt);
	}

	/**
	 * Moves the box over time to specific coordinates
	 * @param {number} x - The x coordinate to move to
	 * @param {number} y - The y coordinate to move to
	 * @param {number} time - The amount of time in milliseconds to move
	 * @param {number} interval - The amount of time in milliseconds between each movement
	 */
	moveToTimed(x, y, time, interval = STANDARD_INTERVAL) {
		let dx = x - this.x;
		let dy = y - this.y;
		this.moveTimed(dx, dy, time, interval);
	}
}

/**
 * Represents a circle
 */
export class Circle {
	/**
	 *
	 * @param {number} x - The x coordinate of the sphere
	 * @param {number} y - The y coordinate of the sphere
	 * @param {number} r - The radius of the sphere
	 */
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}
}
/**
 * Represents a coordinate pair and a corresponding pair of distances
 */
export class Vector {
	/**
	 *
	 * @param {number} x - The x coordinate of the vector
	 * @param {number} y - The y coordinate of the vector
	 * @param {number} dx - The x magnitude of the vector
	 * @param {number} dy - The y magnutide of the vector
	 */
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		/**
		 * The angle (in radians) from -pi to pi of the vector compared to a {1, 0} unit vector
		 */
		this.angle = Math.atan(dy, dx);
		/**
		 * The magnitude of the vector
		 */
		this.magnitude = Math.sqrt((dx ** 2) + (dy ** 2));
	}

	/**
	 * Recalculates the magnitude
	 * 
	 * Required any time the vector's magnitude changes
	 * 
	 * Not used in setters due to the problem of changing both vectors at the same time calling it twice
	 */
	recalcMagnitude() {
		this.magnitude = Math.sqrt((this.dx ** 2) + (this.dy ** 2));
	}

	/**
	 * Finds the dot product between two vectors
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 * @returns {Number}
	 */
	static dotProduct(vector1, vector2) {
		return vector1.dx * vector2.dx + vector1.dy * vector2.dy;
	}

	/**
	 * Same as Vector.dotProduct but uses two arrays of [dx, dy]
	 */
	static simpleDotProduct(vector1, vector2) {
		return vector1[0] * vector2[0] + vector1[1] * vector2[1];
	}

	getUnitVector() {
		return new Vector(this.x, this.y, this.dx / this.magnitude, this.dy / this.magnitude);
	}

	/**
	 * Adds the magnitudes of the vectors together, does not change starting x and y
	 * @param {Vector} vector - The vector to add to the current vector
	 */
	add(vector) {
		this.dx += vector.dx;
		this.dy += vector.dy;
	}

	/**
	 * Multiplies the magnitudes of the vectors by a number
	 * @param {number} num - The number to multiply the magnitudes by
	 */
	multiply(num) {
		this.dx *= num;
		this.dy *= num;
	}

	//TODO: make a static method that produces a vector from coordinates, an angle, and a magnitude
	//TODO: make a static method that produces a vector from 2 pairs of coordinates (start and end)
	//both of these are static because the constructor cant be overloaded

	static getVectorFromAngle(x, y, angle, magnitude) {
		return new Vector(x, y, Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
	}
}

/**
 * projects a point on to a vector
 * returns an array of [x, y]
 */
export const getProjectedPoint = (x, y, vector) => {
	//this uses simplified vectors of [dx, dy] for speed instead of a class with (x, y, dx, dy)
	//refer to chart in notebook for explanation
	let abVector = [vector.dx, vector.dy]; //base vector
	let acVector = [x - vector.x, y - vector.y] //dx and dy between starting point of vector and point

	let dotABAC = Vector.simpleDotProduct(abVector, acVector);
	let dotACAB = Vector.simpleDotProduct(acVector, abVector);
	let adVector = [abVector[0] * dotABAC / dotACAB, abVector[1] * dotABAC / dotACAB]//vector between a and d, the projected point
	return [vector.x + adVector[0], vector.y + adVector[1]];
}

/**
 * returns the result of the pythagorean theorem from 2 sides of a right triangle (can be a dx and dy to get distance)
 */
export const pythagoreanTheorem = (side1, side2) => {
	return Math.sqrt(side1 ** 2 + side2 ** 2);
}