import { collideCircleVector } from "./collision.js";

/**
 * A container for game level logic
 */
export class Scene {
	constructor() {
		this.collisions = [];
		this.entities = [];
		this.ui = [];
		this.player = null;
	}

	/**
	 * Adds collision to the scene
	 *
	 * Use referring classes for special collision
	 * @param {Vector|Sphere|ReferringVector|ReferringSphere} collision - The collision to be added
	 */
	addCollision(collision) {
		this.collisions.push(collision);
	}

	/**
	 *
	 * @param {Sprite|AnimatedSprite|SpecialEntity} entity - The entity to be added
	 * @param {true} special - Whether the entity is a SpecialEntity
	 */
	addEntity(entity, special) {
		this.entities.push(entity);
		if (special) {
			entity.parent = this;
		}
	}

	/**
	 * Adds an element to the UI
	 * @param {UIButton|UIText|Sprite|AnimatedSprite} ui - The element to be added
	 */
	addUI(ui) {
		this.ui.push(ui)
	}

	/**
	 * Renders the scene on the canvas
	 * @param {CanvasRenderingContext2D} context - The 2d rendering context to render on
	 */
	render(context) {
		for (let entity of this.entities) {
			entity.render(context);
		}
	}

	/**
	 * determines if the player should bounce, priority is based on order of collision array
	 */
	doCollisions() {
		for (let collision of this.collisions) {
			if (collideCircleVector(this.player.circle, vector)) {
				entity = this.entities[collision.id]; //collision is assumed to be an owned collision
				this.player.bounce(typeof entity.special !== "undefined" ? entity.special() : true) // if special, call special first
			}
		}
	}
}