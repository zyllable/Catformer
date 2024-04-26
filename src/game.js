import { ReferringVector } from "./modules/collision.js";
import { Player } from "./modules/player.js";
import { createImage } from "./modules/reusables.js";
import { Scene } from "./modules/scene.js";
import { SpriteSheet } from "./modules/sprites.js";

const main = () => {
	//Get canvas and context
	const canvas = document.querySelector("#gameCanvas");
	const context = canvas.getContext("2d");


	//resizes the canvas automatically
	let observer = new ResizeObserver((entries) => {
		let entry = entries[0].devicePixelContentBoxSize[0];
		if (Math.abs(canvas.height - entry.blockSize) > 2) { //prevents from slowly shrinking
			canvas.width = entry.inlineSize;
			canvas.height = entry.blockSize;
		}
		context.strokeStyle = "white";
	});

	observer.observe(canvas)

	//create objects in scene
	const scene = new Scene();
	scene.player = new Player(0, -25, -500, 100, 100, new SpriteSheet(preloadedImage, 512, 512), 50)
	scene.addCollision(new ReferringVector(1000, 300, -2000, 0, 0))
	scene.addCollision(new ReferringVector(1000, 300, 0, -1000, 0))

	//create loops
	const renderLoop = () => {

		context.resetTransform();
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.transform(1, 0, 0, 1, parseInt(canvas.width / 2 - scene.xOffset), parseInt(canvas.height / 2 - scene.yOffset));


		scene.render(context);

		//requestAnimationFrame(renderLoop);
	}
	renderLoop();

	const gameTick = () => {
		scene.gameTick();
		renderLoop()
	}

	setInterval(gameTick, 20)

	//create listeners for keys
	document.addEventListener("keydown", (e) => {
		if (!e.repeat) {
			scene.heldKeys.push(e.code);
		}
	})
	document.addEventListener("keyup", (e) => {
		const index = scene.heldKeys.indexOf(e.code);
		if (index != -1) {
			scene.heldKeys.splice(index, 1)
		}
	})
}
window.addEventListener("DOMContentLoaded", main)
const preloadedImage = createImage("./testingAssets/characterSpriteSheet.png")