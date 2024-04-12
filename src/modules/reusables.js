/**
 * The default interval for movement and animations (1 "tick")
 */
export const STANDARD_INTERVAL = 20; //50 times per second

/**
 * Returns the maximum index of an array
 * @param {array} array - The array to be used
 * @returns Number
 */
export const indexLength = (array) => {
	return array.length - 1;
}

/**
 * A function to be used for sorting a list of boxes from top to bottom
 * @param {Box} a
 * @param {Box} b
 * @returns
 */
export const compareBoxes = (a, b) => {
	return (a.y + a.height) - (b.y + b.height);
}

/**
 * Creates an image object from a URL - not guaranteed to be loaded once returned
 * @param {string} url - the url to be used
 * @returns
 */
export const createImage = (url) => {
	let image = new Image();
	image.src = url;
	return image;
}

/**
 * Creates an array containing integers inclusively from start to end
 * @param {number} start
 * @param {number} end
 * @returns
 */
export const getIntegerRange = (start, end) => {
	let range = []
	for (let i = start; i <= end; i++) {
		range.push(i);
	}
	return range;
}