// randoms
const p = Array.from(new Array(256), () => {
  return Math.floor(Math.random() * 256);
});

const perm = Array.from(new Array(512), (_, i) => {
  return p[i & 255];
});

// linear interpolation
function mix(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

const grad3: [number, number, number][] = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1],
  [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

// a special dot product function used in perlin noise calculations
function perlinDot(g: [number, number, number], x: number, y: number, z: number) {
  return g[0] * x + g[1] * y + g[2] * z;
}

export function generateNoise(x: number, y: number, z: number) {
  // Find unit grid cell containing point
  let X = Math.floor(x);
  let Y = Math.floor(y);
  let Z = Math.floor(z);

  // Get relative xyz coordinates of point within that cell
  x = x - X;
  y = y - Y;
  z = z - Z;

  // Wrap the integer cells at 255
  X &= 255;
  Y &= 255;
  Z &= 255;

  // Calculate a set of eight hashed gradient indices
  const gi000 = perm[X + perm[Y + perm[Z]]] % 12;
  const gi001 = perm[X + perm[Y + perm[Z + 1]]] % 12;
  const gi010 = perm[X + perm[Y + 1 + perm[Z]]] % 12;
  const gi011 = perm[X + perm[Y + 1 + perm[Z + 1]]] % 12;
  const gi100 = perm[X + 1 + perm[Y + perm[Z]]] % 12;
  const gi101 = perm[X + 1 + perm[Y + perm[Z + 1]]] % 12;
  const gi110 = perm[X + 1 + perm[Y + 1 + perm[Z]]] % 12;
  const gi111 = perm[X + 1 + perm[Y + 1 + perm[Z + 1]]] % 12;

  // Calculate noise contributions from each of the eight corners
  const n000 = perlinDot(grad3[gi000], x, y, z);
  const n100 = perlinDot(grad3[gi100], x - 1, y, z);
  const n010 = perlinDot(grad3[gi010], x, y - 1, z);
  const n110 = perlinDot(grad3[gi110], x - 1, y - 1, z);
  const n001 = perlinDot(grad3[gi001], x, y, z - 1);
  const n101 = perlinDot(grad3[gi101], x - 1, y, z - 1);
  const n011 = perlinDot(grad3[gi011], x, y - 1, z - 1);
  const n111 = perlinDot(grad3[gi111], x - 1, y - 1, z - 1);

  // Compute the ease curve value for each of x, y, z
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  // Interpolate (along x) the contributions from each of the corners
  const nx00 = mix(n000, n100, u);
  const nx01 = mix(n001, n101, u);
  const nx10 = mix(n010, n110, u);
  const nx11 = mix(n011, n111, u);

  // Interpolate the four results along y
  const nxy0 = mix(nx00, nx10, v);
  const nxy1 = mix(nx01, nx11, v);

  // Interpolate the last two results along z
  return mix(nxy0, nxy1, w);
};
