import React, { useEffect, useRef, useState } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);

  function upload() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  async function generate() {
    if (file) {
      const canvas = await drawImageAsync(file, {
        params: paramsOptions,
      });
      setCanvasSrc(canvas.toDataURL());
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
  }

  return (
    <div className="min-h-screen flex flex-col gap-5 p-5 box-border">
      <button className="btn btn-primary" onClick={upload}>
        upload
      </button>
      <button className="btn btn-primary" onClick={generate}>
        generate
      </button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <div className="flex flex-col gap-5">
        {fileUrl ? <img src={fileUrl} alt="origin" /> : null}
        {canvasSrc ? <img src={canvasSrc} alt="fbm" /> : null}
      </div>
    </div>
  );
}

export default App;
