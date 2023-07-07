import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useRef } from "react";
import axios from "axios";
import URL from "../config/URLConfig";

export default function ProgressBar({
  file,
  setFile,
  transactions,
  setTransactions,
  setStatus,
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
      console.log(analyzeRes);
      setFile(null);
      setStatus("Upload a picture!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    uploadReceipt(file);
  }, []);
  // let bucketFileName;
  // useEffect(() => {
  //   const JWT = sessionStorage.getItem("bookKeepingCredential");
  //   setStatus("loading picture~");

  //   axios
  //     .get(URL + "uploads/static/" + file.name, {
  //       headers: {
  //         Authorization: `Bearer ${JWT}`,
  //       },
  //     })
  //     .then(async (response) => {
  //       // upload picture to GCP storage URL
  //       bucketFileName = response.data.bucketFileName;
  //       const curResponse = await axios.put(response.data.url, file, {
  //         headers: {
  //           "Content-Type": "application/octet-stream",
  //         },
  //       });
  //       console.log("step2: upload picture to GCP");
  //       console.log(response);
  //       return curResponse;
  //     })
  //     .then(async (response) => {
  //       // request document AI analyze receipt
  //       setStatus("AI analyzing receipt~");
  //       console.log(bucketFileName);
  //       const curResponse = await axios.post(
  //         URL + "receipts/",
  //         { bucketFileName, fileType: "png" },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${JWT}`,
  //             ContentType: "application/json",
  //             // Add any additional headers if required
  //           },
  //         }
  //       );
  //       console.log("step3: request document AI");
  //       console.log(response);
  //       return curResponse;
  //     })
  //     .then((response) => {
  //       //TODO: handle document AI result
  //       console.log("step4: show AI result");
  //       console.log(response);
  //       setFile(null);
  //       setStatus("Upload a picture!");
  //     })
  //     .catch((error) => {
  //       // Handle error
  //       alert(error.message);
  //     });
  // }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
