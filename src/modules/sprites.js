import { Box } from "./geometry.js";
import { getIntegerRange } from "./reusables.js";

/**
 * An image that can be rendered
 * @extends Box
 */
export class Sprite extends Box {
	/**
	 *
	 * @param {number} id - An id to refer to the sprite
	 * @param {number} x - The y coordinate of the sprite
	 * @param {number} y -The x coordinate of the sprite
	 * @param {HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap|OffscreenCanvas|VideoFrame} image - Any valid canvas image source
	 * @param {number} width - The width of the sprite
	 * @param {number} height - The height of the sprite
	 */
	constructor(id, x, y, image, width, height) {
		if (!width) {
			width = image.width;
		}
		if (!height) {
			height = image.height;
		}
		super(id, x, y, width, height);
		this.image = image;
	}

	constructor(sprite) {
		this.id = sprite.id;
		this.x = sprite.x;
		this.y = sprite.y;
		this.image = sprite.image;
		this.width = sprite.width;
		this.height = sprite.height;
	}

	/**
	 * Renders the sprite onto the canvas
	 * @param {CanvasRenderingContext2D} context - The 2d context to render the sprite with
	 */
	render(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

/**
 * A representation of a sprite sheet and groups of its frames as individual animations
 * Frame groups must be created using the createFrameGroup() method
 * See individual methods' documentation for functionality
 */
export class SpriteSheet {
	/**
	 *
	 * @param {HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap|OffscreenCanvas|VideoFrame} image - The image to load the spritesheet from - Can be any any valid canvas image source
	 * @param {number} frameWidth - The width of each frame
	 * @param {number} frameHeight - The height of each frame
	 */
	constructor(image, frameWidth, frameHeight) {
		this.image = image;
		let width = image.width;
		let height = image.height;

		/**
		 * The height of each frame
		 */
		this.frameWidth = frameWidth;

		/**
		 * The width of each frame
		 */
		this.frameHeight = frameHeight;

		this.frames = []
		this.frameGroups = [];
		this.currentFrameGroup = 0;
		this.currentFrameIndex = 0;
		let columns = Math.floor(width / frameWidth)
		let rows = Math.floor(height / frameHeight);
		if (!columns || !rows) { throw Error(`Image too small for specified frame height/width\nImage size: ${width}x${height}\nFrame size: ${frameWidth}x${frameHeight}`) }
		for (let i = 0; i < rows; i++) {
			for (let ii = 0; ii < columns; ii++) {
				this.frames.push(new Box(undefined, frameWidth * ii, frameHeight * i, frameWidth, frameHeight))
			}
		}
		this.currentFrame = this.frames[0];
	}
	constructor(spriteSheet) {
		this(spriteSheet.image, spriteSheet.frameWidth, spriteSheet.frameHeight);
		for (let frameGroup in spriteSheet.frameGroups) {
			this.frameGroups.push(frameGroup);
		}
	}

	/**
	 * Creates a frame group from the specified frame indexes
	 * @param  {...number} frames - A frame index to add the the group starting from 0
	 */
	createFrameGroup(...frames) {
		let newGroup = this.frameGroups[this.frameGroups.push([]) - 1]
		for (let frame of frames) {
			newGroup.push(this.frames[frame]);
		}
	}

	/**
	 * Creates a frame group from the frames between the specified indexes
	 * @param {number} start
	 * @param {number} end
	 */
	createFrameGroupInRange(start, end) {
		this.frameGroups[this.frameGroups.length] = getIntegerRange(start, end);
	}

	/**
	 * Changes the current frame in the frame group to index i
	 * @param {number} i
	 */
	toFrame(i) {
		this.currentFrameIndex = i;
		this.currentFrame = this.frameGroups[this.currentFrameGroup][this.currentFrameIndex];
	}

	/**
	 * Changes the current frame group to index i and sets the current frame to the first in the group
	 * @param {number} i
	 */
	switchGroup(i) {
		this.currentFrameGroup = i;
		this.toFrame(0);
	}

	/**
	 * Moves to the previous frame in the frame group
	 * @returns Boolean - Whether the animation looped or not
	 */
	nextFrame() {
		this.currentFrameIndex++;
		if (this.currentFrameIndex == this.frameGroups[this.currentFrameGroup].length) {
			this.currentFrameIndex = 0;
		}
		this.currentFrame = this.frameGroups[this.currentFrameGroup][this.currentFrameIndex];
		if (this.currentFrameIndex == 0) {
			return true;
		}
		return false;
	}
	/**
	 * Moves to the previous frame in the frame group
	 * @returns Boolean - Whether the animation looped or not
	 */
	previousFrame() {
		this.currentFrameIndex--;
		if (this.currentFrameIndex == -1) {
			this.currentFrameIndex = this.frameGroups[this.currentFrameGroup].length - 1;
		}
		this.currentFrame = this.frameGroups[this.currentFrameGroup][this.currentFrameIndex];
		if (this.currentFrameIndex == 0) {
			return true;
		}
		return false;
	}
}

/**
 * A sprite that supports animation through a sprite sheet
 * @extends Sprite
 */
export class AnimatedSprite extends Sprite {
	/**
	 *
	 * @param {number} id - An id to refer to the sprite
	 * @param {SpriteSheet} spriteSheet - The sprite sheet to load
	 * @param {number} x - The x coordinate of the sprite
	 * @param {number} y - The y coordinate of the sprite
	 * @param {number} width - The width of the sprite
	 * @param {number} height - The height of the sprite
	 * @param {number} angle - The angle in **radians** that the sprite is rotated by, counterclockwise
	 */
	constructor(id, spriteSheet, x, y, width, height, angle = 0) {
		super(id, x, y, undefined, width, height);
		this.spriteSheet = spriteSheet;
		this.angle = angle;
	}

	/**
	 * Renders the sprite on the canvas
	 * @param {CanvasRenderingContext2D} context - The 2d context to render the sprite with
	 */
	render(context) {
		context.save();
		context.rotate(-this.angle); //negative otherwise it works clockwise
		context.drawImage(this.spriteSheet.image,
			this.spriteSheet.currentFrame.x,
			this.spriteSheet.currentFrame.y,
			this.spriteSheet.frameWidth,
			this.spriteSheet.frameHeight,
			this.x,
			this.y,
			this.width,
			this.height
		)
		context.restore
	}

	//stores the interval for frameswaps
	animationInterval;

	/**
	 * Starts the current animation of the sprite - Supports chaining
	 * @param {boolean} reverse - Whether the animation runs in reverse or not
	 * @param {number} interval - The interval in milliseconds between each frome
	 * @returns this
	 */
	startAnimation(reverse = false, interval = STANDARD_INTERVAL) {
		if (!reverse) {
			this.animationInterval = setInterval(() => { this.spriteSheet.nextFrame() }, interval);
		} else {
			this.animationInterval = setInterval(() => { this.spriteSheet.previousFrame() }, interval);
		}
		return this
	}

	/**
	 * Stops the current animation of the sprite -
	 * Supports Chaining
	 * @returns this
	 */
	stopAnimation() {
		clearInterval(this.animationInterval);
		return this;
	}

	/**
	 * Switches to a specific frame in the current group and optionally to a different frame group - Supports chaining
	 * @param {number} frame - The frame index to switch to
	 * @param {number} group - The frame group to switch to
	 * @returns this
	 */
	toFrame(frame, group = undefined) {
		if (group) {
			this.spriteSheet.switchGroup(group)
		}
		this.spriteSheet.toFrame(frame);
		return this
	}

	/**
	 * Switches to a specific animation - Supports chaining
	 * @param {number} frameGroup - The animation to switch to
	 * @returns this
	 */
	switchAnimation(frameGroup) {
		this.spriteSheet.switchGroup(frameGroup);
		return this;
	}

	/**
	 * Loops through the current animation
	 * @param {number} reps - The amount of times the animation will repeat
	 * @param {number} interval - The amount of time between each frame in milliseconds
	 * @param {boolean} reverse - Whether the animation will play in reverse or not
	 */
	loopAnimation(reps, interval = STANDARD_INTERVAL, reverse = false) {
		let counter = 0;
		let totalFrames = reps * this.spriteSheet.currentFrameGroup.length;
		let loopInterval;
		let countFrame;
		if (!reverse) {
			countFrame = () => {
				this.spreadSheet.nextFrame();
				counter++;
				if (counter == totalFrames) {
					clearInterval(loopInterval)
					return this
				}
			}
		} else {
			countFrame = () => {
				this.spreadSheet.previousFrame();
				counter++;
				if (counter == totalFrames) {
					clearInterval(loopInterval)
					return this
				}
			}
		}
		loopInterval = setInterval(countFrame, interval);
	}
}
