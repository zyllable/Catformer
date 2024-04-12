import { AnimatedSprite } from './sprites.js';

/**
 * A game object with a function to execute when collided with
 *
 * Child classes MUST override the "special()" function
 * @extends AnimatedSprite
 */
export class SpecialEntity extends AnimatedSprite {
	constructor(id, spriteSheet, x, y, width, height) {
		super(id, spriteSheet, x, y, width, height);
		/**
		 * The parent scene of the entity, not defined until after it is added to the scene
		 */
		this.parent = null;
	}

	/**
	 *
	 * @returns {boolean} doBounce - Determines if the contact should result in collision detection
	 */
	special() {
		console.warn("Special entity " + this.id + " does not have a special() function.")
		return true;
	}
}

// Specific entity classes

/**
 * Water hazard
 */
export class Water extends SpecialEntity {
	special() {
		this.parent.killPlayer();
		return true;
	}
}

/**
 * Sets player mode to cloud mode
 */
export class CloudBerry extends SpecialEntity {
	special() {
		this.parent.playerMode = 1; //player mode of 1 is cloud, 0 is default
		return false;
	}
}

/**
 * Resets player mode to standard
 */
export class Fish extends SpecialEntity {
	special() {
		this.parent.playerMode = 0;
		return false;
	}
}

/**
 * Supports tracks
 */
class PathedSpecialEntity extends SpecialEntity {
	/**
	 * An array of coordinate pair arrays [x, y], indicating the one way path the track moves on
	 */
	track = [];

	special() {
		this.parent.currentTrack = this.track;
		this.parent.moveMode = 1 //moveMode of 0 is normal, 1 is track, 2 is twine, 3 is exiting 1 or 2
	}
}

/**
 * A track entity of a path the player can escape from
 */
export class Hook extends PathedSpecialEntity {
	special() {
		super.special();
		this.parent.trackMode = 1; //track mode of 1 is hook, 0 is pipe
		return false;
	}
}

/**
 * A track entity of a path the player cannot escape from
 */
export class Pipe extends PathedSpecialEntity {
	special() {
		super.special();
		this.parent.trackMode = 0;
		return false;
	}
}

/**
 * Stops the player from changing direction manually
 */
export class Ice extends SpecialEntity {
	special() {
		this.parent.onIce = true;
		return true;
	}
}

/**
 * Disables gravity
 */
export class Twine extends SpecialEntity {
	special() {
		this.parent.moveMode = 2;
		return false;
	}
}