export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const mul = (a, b) => a && b && a * b;
export const div = (a, b) => a && (b || NaN) && a / b;
export const sqr = a => a && a * a;
export const cube = a => a && a * a * a;
export const scale = f => a => mul(a, f);

const uuid_part = (
	size = 3,
	chunk = "000" + (random_int(46656, 66654) | 0)
) =>
	chunk.toString(36).slice(-size);

const cubic_parts = [
	_dist => cube(_dist),
	(_dist, t) => t * sqr(_dist) * 3,
	(_dist, t) => sqr(t) * _dist * 3,
	(_dist, t) => cube(t)
];
export const cubic = (
	cubic = [0, 0, 1, 1],
	origin = 0,
	target = 1,
	dist = target - origin
) => {
	const cp = cubic_parts
				.map((f, i) => {
					const p = cubic[i];
					return p === 0 ? null : p === 1 ? f : (_dist, t) => p * f(_dist, t)
				})
				.filter(f => f);
	return (t, _dist = 1 - t) => origin + dist * cp.map(f => f(_dist, t)).reduce(add);
}

export const random = (a = 0, b = 1) => Math.random() * (b - a) + a;
export const random_int = (a, b) => Math.round(random(a, b));
export const random_item = list => list[random_int(0, list.length - 1)];

export const uuid = (_parts = 2, _output = "") =>
	_parts ? uuid(_parts - 1, _output + uuid_part()) : _output;


export class Vector extends Array {
	get x() {
		return this[0];
	}
	get y() {
		return this[1];
	}
	get z() {
		return this[2];
	}

	constructor(...args) {
		super(...args);
	}

	concat(vector, operator = add) {
		if (vector.length !== this.length)
			throw "ERROR: vectors are not of the same size.";
		return this.map((x, i) => operator(x, vector[i]));
	}
	add(vector) {
		return this.concat(vector);
	}
	sub(vector) {
		return this.concat(vector, sub);
	}
	mul(vector) {
		return this.concat(vector, mul);
	}
	div(vector) {
		return this.concat(vector, div);
	}
	scale(factor) {
		return this.map(scale(factor));
	}

	abs() {
		return this.map(Math.abs);
	}
	mag_sq() {
		return this.map(sqr).reduce(add);
	}
	mag() {
		return sqr(this.mag_sq());
	}

	dist(vector) {
		return this.mag(this.sub(vector));
	}
	norm(mag_sq = this.mag_sq()) {
		return this.map(x => x / mag_sq);
	}

	equals(vector) {
		return this.every((x, i) => x === vector[i]);
	}
}