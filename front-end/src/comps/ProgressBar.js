import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useRef } from "react";
import axios from "axios";
import URL from "../config/URLConfig";

export default function ProgressBar({
  file,
  setFile,
  setStatus,
  updateRecords,
}) {
  // TO-DO replace with real post HTTP request
  async function uploadReceipt(receipt) {
    try {
      setStatus("Uploading receipt~");
      const JWT = sessionStorage.getItem("bookKeepingCredential");
      const storageInfo = await axios.get(
        URL + "uploads/static/" + receipt.name,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );
      const bucketFileName = storageInfo.data.bucketFileName;
      const url = storageInfo.data.url;
      let uploadRes = await axios.put(url, receipt, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      console.log("below is analyzed result");
      console.log(uploadRes);
      setStatus("AI analyzing receipt~");
      let analyzeRes = await axios.post(
        URL + "receipts",
        {
          bucketFileName,
        },
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );
      updateRecords(analyzeRes);
      setFile(null);
      setStatus("Upload a picture!");
      // setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    uploadReceipt(file);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
