import Title from "./comps/Title";
import UploadForm from "./comps/UploadForm";
import tranGenerator from "./fake_data/tranGenerator";

function App() {
  // fake transactions for testing only
  const transactions = tranGenerator();

  return (
    <div className="App">
      <Title transactions={transactions} />
      <UploadForm />
    </div>
  );
}

export default App;
