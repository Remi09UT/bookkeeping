import { useEffect, useState } from "react";
import Title from "./comps/Title";
import UploadForm from "./comps/UploadForm";
import tranGenerator from "./fake_data/tranGenerator";
import Table from "./comps/Table";
import Modal from "./comps/Modal";
import LoginPage from "./comps/LoginPage";

function Home({credential}) {
  const[img, setImg] = useState(null);

  // fake transactions for testing only
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    let fakeData = tranGenerator();
    setTransactions(fakeData);
  }, []);

  console.log(credential);
  if(!credential) {
    return <LoginPage />
  }
  return (
    <div className="App">
      <Title transactions={transactions} />
      <UploadForm
        transactions={transactions}
        setTransactions={setTransactions}
      />
      <Table setImg = {setImg}/>
      {img && <Modal src = {img} setImg = {setImg}/>}
    </div>
  );
}

export default Home;
