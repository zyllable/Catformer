const main = () => {
	const canvas = document.querySelector("#gameCanvas");
	console.log(canvas)
	const context = canvas.getContext("2d");
	console.log(context)
	context.strokeStyle = "white"
	console.log(context.strokeStyle)

	const doTheThing = () => {
		context.strokeRect(1, 1, 200, 200);
		requestAnimationFrame(doTheThing)
	}

	doTheThing()

	let redoObserve = true;
	let canvasPreviousHeight = canvas.height;

	let observer = new ResizeObserver((entries) => {
		let entry = entries[0].devicePixelContentBoxSize[0];
		if (Math.abs(canvas.height - entry.blockSize) > 2) { //prevents from slowly shrinking
			canvas.width = entry.inlineSize;
			canvas.height = entry.blockSize;
		}
		context.strokeStyle = "white";
	});

	observer.observe(canvas)
}
window.addEventListener("DOMContentLoaded", main)