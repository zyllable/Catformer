//TODO: collisions. default collision exists and contains a call to a bounce function

import { Circle, Vector } from "./geometry";

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