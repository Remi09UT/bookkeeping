import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import URL from "../config/URLConfig";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Table as UITable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export default function Table({ setImg, receipts }) {
  const [data, setData] = useState(null);

  async function getDocs() {
    const extractedData = receipts.map((receipt) => ({
      amount: receipt.analyzedResults.total_amount,
      description: (() => {
        const items = receipt.analyzedResults.line_items;
        let qxi = items.map(
          (item) => `${item.quantity || 1} x ${item.description}`
        );
        return (
          <ul>
            {qxi.map((detail) => (
              <li>{detail}</li>
            ))}
          </ul>
        );
      })(),
      date: (() => {
        const dateString = receipt.analyzedResults.invoice_date;
        return dateString;
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
      id: receipt._id
    }));
    setData(extractedData);
    // window.location.reload();
  }

  async function deletRequest(id) {
    try {
      const JWT = sessionStorage.getItem("bookKeepingCredential");
      await axios.delete(URL + "receipts/" + id, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });
      alert("Receipt removed successfully!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert(error.message);
    }
  }

  //Calls function only once (when it is onMount)
  function handleClick(id) {
    deletRequest(id);
  }

  useEffect(() => {
    getDocs();
  }, [receipts]);

  const dataTable =
    data == null ? (
      <></>
    ) : (
      data.map((item) => (
        <Tr key={item.id}>
          <Td>{item.date}</Td>
          <Td>{item.vendor}</Td>
          <Td>{item.description}</Td>
          <Td>{item.amount}</Td>
          <Td>{item.url}</Td>
          <Td>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => handleClick(item.id)}
            >
              <DeleteIcon />
            </Button>
          </Td>
        </Tr>
      ))
    );

  return (
    data && (
      <TableContainer>
        <UITable variant="striped" size="lg">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Vendor</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
              <Th>Image</Th>
              <Th/>
            </Tr>
          </Thead>
          <Tbody>{dataTable}</Tbody>
        </UITable>
      </TableContainer>
    )
  );
}
