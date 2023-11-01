export type NoiseFn = (x: number, y: number, z: number) => number;

export function fbm(fn: NoiseFn, numOctaves: number, attenuation: number, roughness: number, startingOctave: number) {
  function noise(x: number, y: number, z: number) {
    let a = attenuation ** -startingOctave;
    let f = roughness ** startingOctave;
    let m = 0;
    for (let i = startingOctave; i < numOctaves + startingOctave; i++) {
      m += fn(x * f, y * f, z * f) * a;
      a /= attenuation;
      f *= roughness;
    }
    return m / numOctaves;
  }

  return noise;
}
