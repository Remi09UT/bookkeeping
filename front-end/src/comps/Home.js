import { useEffect, useState } from "react";
import Title from "./Title";
import UploadForm from "./UploadForm";
import Table from "./Table";
import Modal from "./Modal";
import URL from "../config/URLConfig";
import axios from "axios";

function Home() {
  const [img, setImg] = useState(null);
  const [receipts, setReceipts] = new useState([]);
  const [amount, setAmount] = new useState(0);

  async function fetchRecords() {
    const JWT = sessionStorage.getItem("bookKeepingCredential");
    const rawRecords = await axios.get(URL + "receipts", {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    setReceipts(rawRecords.data.receiptRecords);
    setAmount(rawRecords.data.expenseSummary.expenseSum);
  }

  function updateRecords(receipt) {
    const newReceipts = [...receipts, ...receipts];
    // const newReceipts = [...receipts, receipt];
    console.log("my updateRecords is called");
    console.log(newReceipts);
    setReceipts(newReceipts);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    receipts && (
      <div className="App">
        <Title amount={amount} />
        <UploadForm updateRecords={updateRecords} />
        <Table setImg={setImg} receipts={receipts} />
        {img && <Modal src={img} setImg={setImg} />}
      </div>
    )
  );
}

export default Home;
