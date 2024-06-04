import React, { createContext, useState } from 'react';
import MARCRecord from 'marc-record-js';
import { toast } from 'react-toastify';

const Marc21DataContext = createContext();

const Marc21Provider = ({ children }) => {
  const [records, setRecords] = useState([]);

  const handleReadFile = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const marcContent = e.target.result;
        const marcRecord = MARCRecord.fromString(marcContent);
        setRecords(marcRecord);
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
