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
		 * The previous 5 ticks of camera movement
		 */
		this.history = []
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
		this.entities[entity.id] = entity;
		if (special) {
			console.log(entity)
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
			entity.render(ctx, this.xOffset, this.yOffset);
		}
		this.player.render(ctx)
		for (let ui of this.ui) {
			ui.render(ctx);
		}

		//debug
		//renders all collisions
		/*for (let collision of this.collisions) {
			ctx.moveTo(collision.x, collision.y);
			ctx.lineTo(collision.x + collision.dx, collision.y + collision.dy);
		}
		ctx.moveTo(this.player.circle.x, this.player.circle.y);
		ctx.arc(this.player.circle.x, this.player.circle.y, this.player.circle.r, 0, twoPI);
		ctx.moveTo(this.player.circle.x, this.player.circle.y);
		ctx.lineTo(this.player.circle.x + this.player.dx, this.player.circle.y + this.player.dy)
		ctx.stroke();
		ctx.beginPath();*/
	}

	/**
	 * determines if the player should bounce, priority is based on order of collision array
	 */
	doCollisions = () => {
		let result = false;
		for (let collision of this.collisions) {
			let [collided, rejectionDistance] = collideCircleVector(this.player.circle, collision)
			if (collided) {
				if (!isNaN(collision.id)) {
					const entity = this.entities[collision.id]; //collision is assumed to be an owned collision
					this.player.bounce(entity.special(), collision, rejectionDistance) // if special, call special first
				} else {
					this.player.bounce(true, collision, rejectionDistance);
				}
				result = true;
			}
		}
		return result;
	}

	gameTick = () => {
		let didCollide = this.doCollisions();

		//Player movement logic
		let velocityCurve = 25 / this.player.vector.magnitude
		if (velocityCurve == Infinity) {
			velocityCurve = 1;
		}
		for (let key of this.heldKeys) {
			switch (key) {
				case "KeyD":
					this.player.dx += velocityCurve;
					break;
				case "KeyA":
					this.player.dx -= velocityCurve;
					break;
				case "KeyW":
				case "Space": //if this tick had a collision
					if (didCollide) {
						this.player.dy -= 10;
					}
					break;
			}
		}

		//gravity
		if (!didCollide) {
			this.player.dy = this.player.dy + 2;
		}
		this.player.vector.recalcMagnitude();

		this.player.move()

		this.timer += .2;

		if (this.player.dx > 0) {
			this.player.switchAnimationCheap(1);
		} else if (this.player.dx < 0) {
			this.player.switchAnimationCheap(2);
		} else {
			this.player.switchAnimationCheap(0);
		}

		this.xOffset = this.player.circle.x;
		this.yOffset = this.player.circle.y;

		//TODO: fix floaty camera to make it actually track

		/*let length = this.history.length;

		this.xOffset = 0;
		this.yOffset = 0;
		if (this.history.length > 6) {
			this.history.pop();
		}
		this.history.unshift([this.player.circle.x, this.player.circle.y])
		for (const coord of this.history) {
			this.xOffset += coord[0];
			this.yOffset += coord[1];
		}
		this.xOffset /= length;
		this.xOffset += this.player.dx;
		this.yOffset /= length;
		this.yOffset += this.player.dy*/

	}
	/**
	 * resets the player's position
	 * currently hardcoded to make it easier for me
	 */
	killPlayer() {
		this.player.dx = 0;
		this.player.dy = 0;
		this.player.x = -500;
		this.player.y = -300;
	}
}