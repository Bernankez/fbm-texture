import { type NoiseFn, fbm } from "./noise/FBM";
import { perlin } from "./noise/Perlin";
import { createCanvas } from "./canvas";

export interface DrawTextureOptions {
  fn?: NoiseFn;
  width: number;
  height: number;
  baseColor: [number, number, number, number];
  wrap?: boolean;
  noise: {
    numOctaves: number;
    attenuation: number;
    roughness: number;
    startingOctave: number;
    color: [number, number, number, number];
  }[];
}

export function drawTexture(options: DrawTextureOptions) {
  const { fn = perlin, width, height, baseColor, wrap, noise } = options || {};
  const canvas = createCanvas();
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not get canvas context");
  }
  // fill with base color
  const imageDataObject = context.createImageData(width, height);
  const imageData = imageDataObject.data;
  for (let i = 0; i < width * height * 4; i += 4) {
    imageData[i] = baseColor[0];
    imageData[i + 1] = baseColor[1];
    imageData[i + 2] = baseColor[2];
    imageData[i + 3] = baseColor[3];
  }
  const twoPi = Math.PI * 2;
  const at = 1;
  const ct = 4;
  for (let i = 0; i < noise.length; i++) {
    // add noise
    const k = noise[i];
    const n = fbm(fn, k.numOctaves, k.attenuation, k.roughness, k.startingOctave);
    let p = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const xt = (ct + at * Math.cos(twoPi * y / height)) * Math.cos(twoPi * x / width);
        const yt = (ct + at * Math.cos(twoPi * y / height)) * Math.sin(twoPi * x / width);
        const zt = at * Math.sin(twoPi * y / height);
        // generate noise at current x and y coordinates (z is set to 0)
        const v = Math.abs(wrap ? n(xt, yt, zt) : n(x / width, y / height, 0));
        for (let c = 0; c < 3; c++, p++) {
          // use noiseColor's alpha channel to blend with base color
          imageData[p] = Math.floor(imageData[p] + v * k.color[c] * k.color[3] / 255);
        }
        p++;
      }
    }
  }
  context.putImageData(imageDataObject, 0, 0);

  return {
    canvas,
    baseColor,
    paletteColor: noise.map(n => n.color),
  };
}
