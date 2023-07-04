import { useEffect, useState } from "react";
import Title from "./Title";
import UploadForm from "./UploadForm";
import tranGenerator from "../fake_data/tranGenerator";
import Table from "./Table";
import Modal from "./Modal";
import LoginPage from "./LoginPage";
import URL from "../config/URLConfig";

function Home() {
  const [img, setImg] = useState(null);

  // fake transactions for testing only
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    let fakeData = tranGenerator();
    setTransactions(fakeData);
    // axios get all receipts
    // axios.get(URL + "receipts", {
    //   headers: {
    //     Authorization: `Basic ${encodedValue}`,
    //   },
    // })
    // .then(
    //   setTransactions(fakeData);
    // )
    // .catch(error) {
    //   alert(error.message);
    // }
  }, []);

  // console.log(
  //   "home page + credential:" + sessionStorage.getItem("bookKeepingCredential")
  // );
  return (
    <div className="App">
      <Title transactions={transactions} />
      <UploadForm
        transactions={transactions}
        setTransactions={setTransactions}
      />
      <Table setImg={setImg} />
      {img && <Modal src={img} setImg={setImg} />}
    </div>
  );
}

export default Home;
