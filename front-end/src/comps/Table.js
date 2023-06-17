import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SmartTable from "react-next-table";
//import useFirestore from "../hooks/useFirestore";

const headCells = [
  {
    id: "date",
    numeric: false,
    label: "Date",
    width: 200,
  },
  {
    id: "category",
    numeric: false,
    label: "Category",
    width: 100,
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
    width: 300,
  },
  {
    id: "amount",
    numeric: true,
    //sortable: true,
    label: "Amount",
    width: 100,
  },
  {
    id: "url",
    numeric: false,
    label: "Image",
    width: 200,
  },
];

const dummy = [
  {
    _id: "6144e83a966145976c75cdfe",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2021-09-15",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "61439914086a4f4e9f9d87cd",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2021-09-17",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "61439887086a4f4e9f9d87cc",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2021-09-19",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "6143985d086a4f4e9f9d87cb",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2021-09-13",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "614397edcbfc69177da008c8",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2021-03-17",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "6143b810d713e67dfca4985c",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2020-09-17",
    url: <img src="https://picsum.photos/100/100" />,
  },
  {
    _id: "61439b2f0b93c171aa1cf475",
    category: "Clothing",
    amount: "55",
    description: "ahlannn",
    date: "2023-06-14",
    url: <img src="https://picsum.photos/100/100" />,
  },
];

export default function Table({setImg}) {
  //const { docs } = useFirestore('images');

  // const data = docs.map((each) => ({
  //   ...each,
  //   amount: (Math.random() * 100).toFixed(2),
  //   description: "blabla",
  //   date: new Date().toLocaleString(),
  //   category: 'Grocery',
  //   url: <img src={each.url} alt="receipt photo" onClick={() => setImg(each.url)} width="200" height="200"/>,
  // }));

  //console.log(data);
  return (
    <div>
        {dummy.length > 0 && <SmartTable
          data={dummy}
          headCells={headCells}
          // url="/api/admin/emails"
          // searchDebounceTime={800}
          // noPagination
        />}
      
    </div>
  );
}
