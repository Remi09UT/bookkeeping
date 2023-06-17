import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
// import ProgressBar from "./ProgressBar";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ["image/png", "image/jpeg"];
  const changeHandler = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image (png or jpeg)");
    }
  };
  return (
    <form>
      <Button variant="contained" component="label" onChange={changeHandler}>
        Upload File
        <input type="file" hidden />
      </Button>
      <div className="output">
        {error && <Alert severity="warning">{error}</Alert>}
        {file && <div className="file">{file.name}</div>}
        {/* {file && <ProgressBar file = {file} setFile = {setFile} />} */}
      </div>
    </form>
  );
}
