import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import ProgressBar from "./ProgressBar";

export default function UploadForm({ updateRecords }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Upload a picture!");

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
        Upload
        <input type="file" hidden />
      </Button>
      <span> {status} </span>
      <div className="output">
        {error && <Alert severity="warning">{error}</Alert>}
        {file && <div className="file">{file.name}</div>}
        {file && (
          <ProgressBar
            file={file}
            setFile={setFile}
            setStatus={setStatus}
            updateRecords={updateRecords}
          />
        )}
      </div>
    </form>
  );
}
