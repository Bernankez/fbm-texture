# FBM Texture

[Online Demo](https://fbm.keke.cc/)

## Environment

Browser

## Install

```bash
$ pnpm add fbm-texture
```

## Usage

```ts
import { drawImageAsync } from "fbm-texture";

const image = new Image();
image.src = "image-path";
const { canvas } = await drawImageAsync(image);
document.body.appendChild(canvas);
```

## Type Declaration

```ts
type ParamsFn = (color: [number, number, number, number]) => {
  numOctaves: number;
  attenuation: number;
  roughness: number;
  startingOctave: number;
};

type ParamsOptions = {
  numOctaves: number;
  attenuation: number;
  roughness: number;
  startingOctave: number;
  color: [number, number, number, number];
}[];

interface DrawImageOptions {
  fn?: NoiseFn;
  width?: number;
  height?: number;
  baseColor?: [number, number, number, number];
  wrap?: boolean;
  params?: ParamsOptions | ParamsFn;
};

declare function drawImage(image: HTMLCanvasElement, options?: DrawImageOptions): void;

declare function drawImageAsync(image: HTMLImageElement | string | Blob | HTMLCanvasElement, options?: DrawImageOptions): void;
```