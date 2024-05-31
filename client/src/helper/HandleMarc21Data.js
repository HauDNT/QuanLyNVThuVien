import React, { createContext, useState, useEffect } from "react";
import MARCRecord from "marc-record-js";

const Marc21DataContext = createContext();

const Marc21Provider = ({ children }) => {
  const [records, setRecords] = useState([]);

  const handleReadFile = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const marcContent = e.target.result;
        const marcRecords = MARCRecord.fromString(marcContent);
        setRecords(marcRecords);
      };

      reader.readAsText(file);
    }
  };

  return (
    <Marc21DataContext.Provider value={{ records, handleReadFile }}>
      {children}
    </Marc21DataContext.Provider>
  );
};

export { Marc21Provider, Marc21DataContext };
