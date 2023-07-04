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

  const bucketFileName = useRef("");
  useEffect(() => {
    const JWT = sessionStorage.getItem("bookKeepingCredential");
    setStatus("loading picture~");
    // let callback = async function () {
    //   let response;
    //   try {
    //     response = await axios.get(URL + "uploads/static/" + file.name, {
    //       headers: {
    //         Authorization: `Bearer ${JWT}`,
    //       },
    //     });

    //     // upload picture to GCP storage URL
    //     // bucketFileName.current = response.data.bucketFileName;
    //     //     await axios.put(response.data.url, file, {
    //     //       headers: {
    //     //         "Content-Type": "application/octet-stream",
    //     //       },
    //     //     });
    //     //     console.log("step2: upload picture to GCP");
    //     //     console.log(response);
    //   } catch (error) {
    //     console.log(error.message);
    //   }

    //   console.log(response);
    // };

    // callback();

    axios
      .get(URL + "uploads/static/" + file.name, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      })
      .then(async (response) => {
        // upload picture to GCP storage URL
        bucketFileName.current = response.data.bucketFileName;
        const curResponse = await axios.put(response.data.url, file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
        console.log("step2: upload picture to GCP");
        console.log(response);
        return curResponse;
      })
      .then(async (response) => {
        // request document AI analyze receipt
        setStatus("AI analyzing receipt~");
        console.log(bucketFileName.current);
        const curResponse = await axios.post(
          URL + "receipts/",
          { bucketFileName: bucketFileName.current, fileType: "png" },
          {
            headers: {
              Authorization: `Bearer ${JWT}`,
              ContentType: "application/json",
              // Add any additional headers if required
            },
          }
        );
        console.log("step3: request document AI");
        console.log(response);
        return curResponse;
      })
      .then((response) => {
        //TODO: handle document AI result
        console.log("step4: show AI result");
        console.log(response);
      })
      .catch((error) => {
        // Handle error
        alert(error.message);
      });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
