import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SmartTable from "react-next-table";
import { useState, useEffect } from "react";
//import useFirestore from "../hooks/useFirestore";

const headCells = [
  {
    id: "date",
    numeric: false,
    label: "Date",
    width: 200,
  },
  {
    id: "vendor",
    numeric: false,
    label: "Vendor",
    width: 200,
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
    width: 200,
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
  {
    id: "delete",
    numeric: false,
    label: "",
    width: 100,
  },
];

// const dummy = [
//   {
//     _id: "6144e83a966145976c75cdfe",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2021-09-15",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "61439914086a4f4e9f9d87cd",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2021-09-17",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "61439887086a4f4e9f9d87cc",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2021-09-19",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "6143985d086a4f4e9f9d87cb",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2021-09-13",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "614397edcbfc69177da008c8",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2021-03-17",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "6143b810d713e67dfca4985c",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2020-09-17",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
//   {
//     _id: "61439b2f0b93c171aa1cf475",
//     category: "Clothing",
//     amount: "55",
//     description: "ahlannn",
//     date: "2023-06-14",
//     url: <img src="https://picsum.photos/100/100" />,
//   },
// ];

export default function Table({ setImg, receipts }) {
  const [data, setData] = useState(null);

  async function getDocs() {
    console.log("below is receipts in table page");
    console.log(receipts);

    const extractedData = receipts.map((receipt) => ({
      amount: receipt.analyzedResults.total_amount,
      description: (() => {
        const items = receipt.analyzedResults.line_items;
        let qxi = items.map((item) => `${item.quantity} x ${item.description}`);
        return (
          <ul>
            {qxi.map((detail) => (
              <li>{detail}</li>
            ))}
          </ul>
        );
      })(),
      date: (() => {
        const dateString = receipt.dateAdded;
        const [datePart, timePart] = dateString.split("T");

        // Remove the milliseconds from the time part
        const formattedTimePart = timePart.split(".")[0];

        // Create the formatted date string by replacing the "T" with a space
        const formattedDate = `${datePart} ${formattedTimePart}`;
        return formattedDate;
      })(),
      vendor: receipt.analyzedResults.supplier_name,
      url: (
        <img
          src={receipt.imageURL}
          alt="receipt photo"
          onClick={() => setImg(receipt.imageURL)}
          width="200"
          height="200"
        />
      ),
      delete: <button onClick={() => handleClick(receipt._id)}>Delete</button>,
    }));
    console.log("below is extractedData in table page");
    console.log(extractedData);
    //console.log(extractedData);
    setData(extractedData);
  }

  //Calls function only once (when it is onMount)
  function handleClick(id) {}

  useEffect(() => {
    getDocs();
  }, [receipts]);

  return (
    data && (
      <div>
        {data.length > 0 && (
          <SmartTable
            data={data}
            headCells={headCells}
            // url="/api/admin/emails"
            searchDebounceTime={800}
            // noPagination
          />
        )}
      </div>
    )
  );
}
