import { createCanvas } from "./canvas";
import { getPalette } from "./color-thief";
import type { NoiseFn } from "./noise/FBM";
import { drawTexture } from "./texture";
export * from "./texture";

export type ParamsFn = (color: [number, number, number, number]) => {
  numOctaves: number;
  attenuation: number;
  roughness: number;
  startingOctave: number;
};

export type ParamsOptions = {
  numOctaves: number;
  attenuation: number;
  roughness: number;
  startingOctave: number;
  color: [number, number, number, number];
}[];

export interface DrawImageOptions {
  fn?: NoiseFn;
  width?: number;
  height?: number;
  baseColor?: [number, number, number, number];
  wrap?: boolean;
  params?: ParamsOptions | ParamsFn;
};

export async function drawImageAsync(image: HTMLImageElement | string | Blob | HTMLCanvasElement, options?: DrawImageOptions) {
  let canvas: HTMLCanvasElement;
  if (image instanceof HTMLCanvasElement) {
    canvas = image;
  } else {
    const loadImage = () => new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      if (image instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.readAsDataURL(image);
      } else if (typeof image === "string") {
        img.src = image;
      } else if (image instanceof HTMLImageElement) {
        img.src = image.src;
      }
    });
    const img = await loadImage();
    canvas = createCanvas();
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context");
    }
    context.drawImage(img, 0, 0);
  }
  return drawImage(canvas, options);
}

export function drawImage(image: HTMLCanvasElement, options?: DrawImageOptions) {
  let { fn, width, height, baseColor, wrap, params } = options || {};
  if (width && height && baseColor && params && typeof params === "object") {
    return drawTexture({
      fn,
      width,
      height,
      baseColor,
      wrap,
      noise: params,
    });
  }
  const palette = getPalette(image);
  if (!palette) {
    throw new Error("Could not get palette");
  }
  baseColor = baseColor || [...palette[0], 255];
  const restColors = palette.slice(1);
  let paramsOptions: ParamsOptions = [];
  if (params) {
    if (typeof params === "function") {
      const _params = params as ParamsFn;
      restColors.forEach((color) => {
        paramsOptions.push({
          ..._params([...color, 255]),
          color: [...color, 255],
        });
      });
    } else {
      paramsOptions = params;
    }
  } else {
    paramsOptions = restColors.map(color => ({
      numOctaves: 1.5,
      attenuation: 2,
      roughness: 4,
      startingOctave: 2,
      color: [...color, Math.floor(Math.random() * 255)],
    }));
  }
  return drawTexture({
    fn,
    width: width || image.width,
    height: height || image.height,
    baseColor,
    wrap,
    noise: paramsOptions,
  });
}
