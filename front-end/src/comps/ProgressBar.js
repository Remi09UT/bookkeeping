import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect } from "react";

export default function ProgressBar({
  file,
  setFile,
  transactions,
  setTransactions,
}) {
  // //TO-DO replace with real post HTTP request
  console.log(transactions);
  useEffect(() => {
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
    }, 1000);
  });

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
