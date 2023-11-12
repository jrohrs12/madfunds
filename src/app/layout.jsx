"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import contractIdContext from "@/contexts/contractIdContext";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const getContractId = async () => {
    const res = await fetch("/api/fundraiser-constructor");
    if (res.status === 200) {
      alert("Constructor success");
      //console.log(res);
      const data = await res.json();
      console.log(data);
      return data.contractId;
    } else {
      alert("Constructor fail");
    }
  };

  const contractId = useMemo(() => getContractId(), []);

  //console.log(contractId);

  return (
    <contractIdContext.Provider value={contractId}>
      <html lang="en">
        <body className={inter.className}>
          {<Nav />}
          {children}
        </body>
      </html>
    </contractIdContext.Provider>
  );
}
