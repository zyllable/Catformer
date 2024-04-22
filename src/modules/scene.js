import { collideCircleVector } from "./collision.js";
import { twoPI } from "./reusables.js";

/**
 * A container for game level logic
 */
export class Scene {
	constructor() {
		this.collisions = [];
		this.entities = [];
		this.ui = [];
		this.player = null;

		/**
		 * The x offset of the camera (how far to the right it is moved)
		 */
		this.xOffset = 0;
		/**
		 * The y offset of the camera (how far up it is moved)
		 */
		this.yOffset = 0;
		/**
		 * The list of keys currently held down
		 * 
		 * Uses KeyboardEvent.code, not keyCode
		 * (like KeyW and KeyO)
		 */
		this.heldKeys = [];
		/**
		 * Amount of time elapsed in seconds
		 */
		this.timer = 0;
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
	render(ctx) {
		for (let entity of this.entities) {
			entity.render(context, this.xOffset, this.yOffset);
		}
		for (let ui of this.ui) {
			ui.render(context);
		}

		//debug
		//renders all collisions
		for (let collision of this.collisions) {
			ctx.moveTo(collision.x, collision.y);
			ctx.lineTo(collision.x + collision.dx, collision.y + collision.dy);
		}
		ctx.moveTo(this.player.circle.x, this.player.circle.y);
		ctx.arc(this.player.circle.x, this.player.circle.y, this.player.circle.r, 0, twoPI);
		ctx.stroke();
		ctx.beginPath();

		console.log(this.player.x, this.player.y, this.player.dx, this.player.dy)
	}

	/**
	 * determines if the player should bounce, priority is based on order of collision array
	 */
	doCollisions = () => {
		for (let collision of this.collisions) {
			if (collideCircleVector(this.player.circle, collision)) {

				if (collision.id) {
					const entity = this.entities[collision.id]; //collision is assumed to be an owned collision
					this.player.bounce(typeof entity.special !== "undefined" ? entity.special() : true) // if special, call special first
				} else {
					this.player.bounce(true);
				}
				return true
			}
		}
		return false
	}
	
	gameTick = () => {
		let didCollide = this.doCollisions();
		
		//Player movement logic
		for (let key in this.heldKeys) {
			switch(key) {
				case "KeyD":
					this.player.dx += 10;
					break;
				case "KeyA":
					this.player.dx -= 10;
					break;
				case "KeyW":
				case "Space": //if this tick had a collision
					if (didCollide) {
						this.player.dy += 200;
					}
					break;
			}
		}

		//gravity
		this.player.dy = this.player.dy - 10;
		this.player.vector.recalcMagnitude();

		this.player.move()

		this.timer += .2;
		this.xOffset = this.player.circle.x; //sets to the center of the player
		this.yOffset = this.player.circle.y;
	}
}