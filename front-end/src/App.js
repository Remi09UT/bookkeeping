import { useEffect, useState } from "react";
import Title from "./comps/Title";
import UploadForm from "./comps/UploadForm";
import tranGenerator from "./fake_data/tranGenerator";

function App() {
  // fake transactions for testing only
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    let fakeData = tranGenerator();
    setTransactions(fakeData);
  }, []);

  return (
    <div className="App">
      <Title transactions={transactions} />
      <UploadForm
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}

export default App;
