import { getProjectedPoint, pythagoreanTheorem, Vector, Circle } from "./geometry.js";

/**
 * A vector with an ID that refers to the entity it is part of
 */
export class ReferringVector extends Vector {
	constructor(x, y, dx, dy, id) {
		super(x, y, dx, dy);
		this.id = id;
	}
}

/**
 * A circle with an ID that refers to the entity it is part of
 */
export class ReferringCircle extends Circle {
	constructor(x, y, r, id) {
		super(x, y, r);
		this.id = id;
	}
}

/**
 * Determines if a circle and a vector collide, returns true if they do
 * @param {Circle} circle
 * @param {Vector} vector
 */
export const collideCircleVector = (circle, vector) => {
	const [x, y] = getProjectedPoint(circle.x, circle.y, vector); //x and y of the nearest point on the vector to the center of the sphere
	const dx = circle.x - x;
	const dy = circle.y - y;
	const pth = pythagoreanTheorem(dx, dy)
	return circle.r >= pth;
}