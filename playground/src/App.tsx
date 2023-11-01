import React, { useState } from "react";
import "./App.css";
import { drawImageAsync } from "../../src";

function App() {
  const [src, setSrc] = useState<string>();

  async function getFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const canvas = await drawImageAsync(file);
      setSrc(canvas.toDataURL());
    }
  }

  return (
    <>
      <input type="file" accept="image/*" onChange={getFile} />
      <img src={src} alt="fbm" />
    </>
  );
}

export default App;
