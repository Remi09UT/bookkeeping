import { useEffect, useState } from "react";
import Title from "./Title";
import UploadForm from "./UploadForm";
import Table from "./Table";
import Modal from "./Modal";
import URL from "../config/URLConfig";
import axios from "axios";

function Home() {
  const [img, setImg] = useState(null);
  const [records, setRecords] = new useState(null);

  async function fetchRecords() {
    const JWT = sessionStorage.getItem("bookKeepingCredential");
    const rawRecords = await axios.get(URL + "receipts", {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    console.log(rawRecords);
    console.log(rawRecords.data.expenseSummary);
    setRecords(rawRecords);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    records && (
      <div className="App">
        <Title amount={records.data.expenseSummary.expenseSum} />
        <UploadForm />
        <Table setImg={setImg} records={records} />
        {img && <Modal src={img} setImg={setImg} />}
      </div>
    )
  );
}

export default Home;
