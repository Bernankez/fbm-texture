import React, { useEffect, useState } from "react";
import "./App.css";
import { type ParamsFn, type ParamsOptions, drawImageAsync } from "../../src";

function App() {
  const [canvasSrc, setCanvasSrc] = useState<string>();
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [options, setOptions] = useState<Omit<ParamsOptions[number], "color">>({
    numOctaves: 1.5,
    attenuation: 2,
    roughness: 4,
    startingOctave: 2,
  });
  const paramsOptions: ParamsFn = (color) => {
    return options;
  };
  const rangeOptions = [
    {
      name: "numOctaves",
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      name: "attenuation",
      min: 0,
      max: 10,
      step: 0.5,
    },
    {
      name: "roughness",
      min: 0,
      max: 10,
      step: 0.5,
    },
    {
      name: "startingOctave",
      min: 0,
      max: 2,
      step: 0.1,
    },
  ] as const;

  const [colors, setColors] = useState<{
    baseColor: [number, number, number, number];
    paletteColor: [number, number, number, number][];
  }>();

  function ColorPalette() {
    return <div className="shrink-0 leading-7">
      {colors
        ? <div>
          <div>Base: <span style={{
            color: rgba2hex(colors.baseColor),
          }}>{rgba2hex(colors.baseColor)}</span></div>
          {colors.paletteColor.map((color, index) => (
            <div key={index}>{index + 1}: (<span style={{
              color: rgba2hex(color),
            }}>{rgba2hex(color)}</span>)
            </div>
          ))}
        </div>
        : null}
      </div>;
  }

  function rgba2hex(rgba: [number, number, number, number]) {
    const [r, g, b, a] = rgba;
    return `#${[r, g, b, a].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }).join("")}`;
  }

  const [loading, setLoading] = useState(false);
  async function generate() {
    if (file) {
      setLoading(true);
      const { canvas, baseColor, paletteColor } = await drawImageAsync(file, {
        params: paramsOptions,
      });
      setCanvasSrc(canvas.toDataURL());
      setColors({
        baseColor,
        paletteColor,
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (file.type.includes("image")) {
        setFile(file);
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }
        const url = URL.createObjectURL(file);
        setFileUrl(url);
      }
    }
    e.target.value = "";
  }

  return (
    <div className="min-h-screen h-full flex flex-col gap-5 p-5 box-border">
      <a className="flex ml-auto link" href="https://github.com/Bernankez/fbm-texture" target="_blank">GitHub</a>
      <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-3">
            {rangeOptions.map(option => (
              <div className="flex gap-3 items-center w-full max-w-sm" key={option.name}>
                <span className="w-[16rem]">
                  {option.name}
                </span>
                <input
                  type="range"
                  min={option.min}
                  max={option.max}
                  value={options[option.name]}
                  className="range"
                  step={option.step}
                  onChange={e =>
                    setOptions(options => ({
                      ...options,
                      [option.name]: Number(e.target.value),
                    }))
                  }
                />
                <input
                  type="number"
                  className="input w-full max-w-[5rem]"
                  value={options[option.name]}
                  onChange={e =>
                    setOptions(options => ({
                      ...options,
                      [option.name]: Number(e.target.value),
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              accept="image/*"
              onChange={handleFile}
            />
            <button className="btn btn-primary w-full max-w-xs" onClick={generate}>
              generate
            </button>
          </div>
        </div>
        {fileUrl
          ? <div>
            <img src={fileUrl} className="w-full md:max-w-md" alt="origin" />
          </div>
          : <div className="w-[20rem] h-[20rem] border-neutral-200 border-2 border-solid"></div>}
      </div>
      {canvasSrc
        ? (<div className="flex gap-3 items-center justify-center h-full w-full">
        <img src={canvasSrc} className="flex-1 w-0 md:max-w-2xl" alt="fbm" />
          {ColorPalette()}
      </div>)
        : <div className="flex w-full h-full justify-center items-center">
            <div className="flex justify-center items-center w-[20rem] h-[20rem] border-neutral-200 border-2 border-solid">
            {loading ? <span className="loading loading-spinner loading-lg text-gray-400"></span> : null}
            </div>
        </div>}
    </div>
  );
}

export default App;
