import { ReferringVector } from "./modules/collision.js";
import { Water } from "./modules/entities.js";
import { Vector } from "./modules/geometry.js";
import { Player } from "./modules/player.js";
import { createImage } from "./modules/reusables.js";
import { Scene } from "./modules/scene.js";
import { Sprite, SpriteSheet } from "./modules/sprites.js";

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
	const characterSheet = new SpriteSheet(characterImage, 128, 128)
	characterSheet.createFrameGroup(0);
	characterSheet.createFrameGroupInRange(0, 7);
	characterSheet.createFrameGroup(0, 7, 6, 5, 4, 3, 2, 1);
	characterSheet.createFrameGroup(8)
	scene.player = new Player(-1, -500, -300, 150, 150, characterSheet, 50)

	scene.player.startAnimation(false, 125)

	const waterEnd180Sheet = new SpriteSheet(waterEnd180Image, 128, 128);
	waterEnd180Sheet.createFrameGroup(0, 1)

	const waterEndSheet = new SpriteSheet(waterEndImage, 128, 128);
	waterEndSheet.createFrameGroup(0, 1);

	const waterSheet = new SpriteSheet(waterImage, 128, 128);
	waterSheet.createFrameGroup(0, 1)




	//refer to notebook for numbering
	//bottom water

	scene.addEntity(new Water(0, SpriteSheet.duplicateSpriteSheet(waterEnd180Sheet), -1280, 1000, 128, 128, 180), true);

	for (let i = -9; i < 50; i++) {
		scene.addEntity(new Water(i + 10, SpriteSheet.duplicateSpriteSheet(waterSheet), i * 128, 1000, 128, 128, 0), true);
	}

	scene.addEntity(new Water(51, SpriteSheet.duplicateSpriteSheet(waterEndSheet), 6400, 1000, 128, 128, 0), true);

	scene.addCollision(new ReferringVector(-1280, 1000, 7808, 0, 0))

	//starting floor

	scene.addEntity(new Sprite(52, -768, 0, groundEnd180Image, 128, 128))

	for (let i = -5; i < 11; i++) {
		scene.addEntity(new Sprite(i + 58, i * 128, 0, groundImage, 128, 128));
	}

	scene.addEntity(new Sprite(69, 1408, 0, groundCornerImage));

	scene.addCollision(new Vector(-768, 0, 1408 + 768 + 128, 0));

	//first jump

	scene.addEntity(new Sprite(70, 1408, -128, groundEnd90Image, 128, 128))

	scene.addCollision(new Vector(1408, 0, 0, -128));
	scene.addCollision(new Vector(1408, -128, 128, 0));

	//next island

	scene.addEntity(new Sprite(71, 1664, -128, groundEnd180Image, 128, 128));
	scene.addEntity(new Sprite(72, 1792, -128, groundEndImage, 128, 128));

	scene.addCollision(new Vector(1664, -128, 256, 0));
	scene.addCollision(new Vector(1664, -128, 0, 128));

	//last island before ricochet section

	scene.addEntity(new Sprite(73, 2048, -128, groundEnd180Image, 128, 128));
	scene.addEntity(new Sprite(74, 2176, -128, groundEndImage, 128, 128));

	scene.addCollision(new Vector(2048, -128, 256, 0));
	scene.addCollision(new Vector(2048, -128, 0, 128));

	//first ricochet wall

	scene.addEntity(new Sprite(75, 2304, -256, groundEnd90Image));

	for (let i = -1; i < 7; i++) {
		scene.addEntity(new Sprite(77 + i, 2304, 128 * i, ground90Image, 128, 128))
	}

	scene.addEntity(new Sprite(84, 2304, 896, groundEnd270Image, 128, 128));

	scene.addCollision(new Vector(2304, -256, 128, 0));
	scene.addCollision(new Vector(2304, -256, 0, 256 + 896));
	scene.addCollision(new Vector(2432, -256, 0, 256 + 896));

	//second ricochet wall

	scene.addEntity(new Sprite(85, 2304 + 1024, -256, groundEnd90Image));

	for (let i = -1; i < 7; i++) {
		scene.addEntity(new Sprite(87 + i, 2304 + 1024, 128 * i, ground90Image, 128, 128))
	}

	scene.addEntity(new Sprite(94, 2304 + 1024, 896, groundEnd270Image, 128, 128));

	scene.addCollision(new Vector(2304 + 1024, -256, 128, 0));
	scene.addCollision(new Vector(2304 + 1024, -256, 0, 256 + 896));
	scene.addCollision(new Vector(2432 + 1024, -256, 0, 256 + 896));

	//first layer

	scene.addEntity(new Sprite(95, 2432, -128, groundEnd180Image, 128, 128));

	for (let i = 1; i < 4; i++) {
		scene.addEntity(new Sprite(95 + i, 2432 + 128 * i, -128, groundImage, 128, 128));
	}

	scene.addEntity(new Sprite(99, 2432 + 128 * 4, -128, groundEndImage, 128, 128));

	scene.addCollision(new Vector(2432, -128, 128 * 5, 0))

	scene.addCollision(new Vector(2432 + 128 * 5, -128, 0, 128))

	//third layer

	scene.addEntity(new Sprite(100, 2432, 640, groundEnd180Image, 128, 128));

	for (let i = 1; i < 4; i++) {
		scene.addEntity(new Sprite(100 + i, 2432 + 128 * i, 640, groundImage, 128, 128));
	}

	scene.addEntity(new Sprite(104, 2432 + 128 * 4, 640, groundEndImage, 128, 128));

	scene.addCollision(new Vector(2432, 640, 128 * 5, 0))

	scene.addCollision(new Vector(2432 + 128 * 5, 640, 0, 128))

	//second layer

	scene.addEntity(new Sprite(105, 2432 + 256, 256, groundEnd180Image, 128, 128));

	for (let i = 1; i < 4; i++) {
		scene.addEntity(new Sprite(105 + i, 2432 + 256 + 128 * i, 256, groundImage, 128, 128));
	}

	scene.addEntity(new Sprite(109, 2432 + 128 * 6, 256, groundEndImage, 128, 128));

	scene.addCollision(new Vector(2432 + 256, 256, 128 * 5, 0))

	scene.addCollision(new Vector(2432 + 256, 256, 0, 128))

	//flag, uses water collision because i dont have the time to implement a level complete thing

	scene.addEntity(new Sprite(110, 2432 + 128 * 4, 640 - 128, flagImage, 128, 128));

	scene.addCollision(new ReferringVector(2432 + 128 * 4.5, 640, 0, -128, 0))

	//create loops
	const renderLoop = () => {

		context.resetTransform();
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.transform(1, 0, 0, 1, parseInt(canvas.width / 2 - scene.xOffset), parseInt(canvas.height / 2 - scene.yOffset));


		scene.render(context);

		requestAnimationFrame(renderLoop);
	}
	renderLoop();

	const gameTick = () => {
		scene.gameTick();
	}

	gameTick();

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
window.addEventListener("DOMContentLoaded", main);
const characterImage = createImage("./assets/cat.png");
const waterImage = createImage("./assets/water.png");
//const waterCornerImage = createImage("./assets/waterCorner.png"); //unused
const waterEndImage = createImage("./assets/waterEnd.png");
const waterEnd180Image = createImage("./assets/waterEnd180.png");

const groundImage = createImage("./assets/ground.png");
const ground90Image = createImage("./assets/ground90.png");
const ground180Image = createImage("./assets/ground180.png");
const ground270Image = createImage("./assets/ground270.png")

const groundCornerImage = createImage("./assets/groundCorner.png");
const groundCorner90Image = createImage("./assets/groundCorner90.png");
const groundCorner180Image = createImage("./assets/groundCorner180.png");
const groundCorner270Image = createImage("./assets/groundCorner270.png");

const groundEndImage = createImage("./assets/groundEnd.png");
const groundEnd90Image = createImage("./assets/groundEnd90.png");
const groundEnd180Image = createImage("./assets/groundEnd180.png");
const groundEnd270Image = createImage("./assets/groundEnd270.png");

const flagImage = createImage("./assets/flag.png")