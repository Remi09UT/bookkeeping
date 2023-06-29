import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProgressBar({
  file,
  setFile,
  transactions,
  setTransactions,
  setStatus,
}) {
  // TO-DO replace with real post HTTP request

  const [bucketFileName, setBucketFileName] = useState("");
  useEffect(() => {
    const JWT = sessionStorage.getItem("bookKeepingCredential");
    setStatus("loading picture~");

    // axios
    //   .get("127.0.0.1:3000/uploads/static/:file.name", {
    //     headers: {
    //       Authorization: `Bearer ${JWT}`,
    //       // Add any additional headers if required
    //     },
    //   })
    //   .then((response) => {
    //     // upload picture to GCP storage URL
    //     setBucketFileName(response.bucketFileName);
    //     axios.put(response.url),
    //       file,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           "Authorization": `Bearer ${JWT}`,
    //         },
    //       };
    //   })
    //   .then((response) => {
    //     // request analyze receipt
    //     setStatus("AI analyzing receipt~");
    //     axios.post("http://127.0.0.1:3000/receipts/" {
    //       headers: {
    //         "Authorization": `Bearer ${JWT}`,
    //         "fileType": "png",
    //         "bucketFileName": bucketFileName,
    //         // Add any additional headers if required
    //       },
    //     })
    //   })
    //   .then((response) => {
    //     //TODO: handle document AI result
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     alert(error.message);
    //   });

    setTimeout(() => {
      setFile(null);
      let trans = [...transactions];
      let newFakeData = {
        date: "06/16/2023",
        description: "fake",
        amount: -100.5,
      };
      trans.push(newFakeData);
      setTransactions(trans);
    }, 10000);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
