import quantize from "quantize";
import core from "./core";

/*
 * Color Thief v2.3.2
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

/*
 * getColor(sourceImage[, quality])
 * returns {r: num, g: num, b: num}
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar
 * colors and return the base color from the largest cluster.
 *
 * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster a color will be returned but the greater the likelihood that it will not be the visually
 * most dominant color.
 *
 * */
export function getColor(canvas: HTMLCanvasElement) {
  const palette = getPalette(canvas, 5, 10);
  const dominantColor = palette?.[0];
  return dominantColor;
}

export function getPalette(canvas: HTMLCanvasElement, colorCount?: number, quality?: number) {
  const options = core.validateOptions({
    colorCount,
    quality,
  });

  const pixelCount = canvas.width * canvas.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not get canvas context");
  }
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixelArray = core.createPixelArray(imageData, pixelCount, options.quality);

  // Send array to quantize function which clusters values
  // using median cut algorithm
  const cmap = quantize(pixelArray, options.colorCount);
  const palette = cmap ? cmap.palette() : null;

  return palette;
}
