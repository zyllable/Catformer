import { collideCircleVector } from "./modules/collision.js";
import { Circle, Vector } from "./modules/geometry.js";

let circle = new Circle(2, 2, 1);
let line = new Vector(1, 1, 1, 1);

console.log("Does circle and line intersect (should be false): " + collideCircleVector(circle, line));

circle = new Circle(2, 2, 1);
line = new Vector(1, 1, 4, 3);

console.log("Does circle and line intersect (should be true): " + collideCircleVector(circle, line));