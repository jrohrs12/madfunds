"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import contractIdContext from "@/contexts/contractIdContext";
import { useEffect, useMemo, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [contractIdState, setContractIdState] = useState();
  const fetchContractId = async () => {
    const res = await fetch("http://localhost:3000/api/fundraiser-constructor");
    if (res.status === 200) {
      // src\app\api\fundraiser-constructor
      //alert("Constructor success");
      //console.log(res);
      const data = await res.json();
      console.log(data);

      return data.contractId;
    } else {
      //alert("Constructor fail");
    }
  };

  useEffect(() => {
    const getContractId = async () => {
      setContractIdState(await fetchContractId());
    };
    if (!contractIdState) {
      getContractId();
    }
  });
  //console.log(contractId);

  return (
    <contractIdContext.Provider value={contractIdState}>
      <html lang="en">
        <body className={inter.className}>
          {<Nav />}
          {children}
        </body>
      </html>
    </contractIdContext.Provider>
  );
}
