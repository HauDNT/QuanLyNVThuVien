import React, { useState } from 'react';
import { Iso2709, Marc } from 'marcjs';

const ReadMarcFile = () => {
    const [inputFile, setInputFile] = useState('');

    const handleFileMarc = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target.result;
                const marcRecords = new Iso2709().parse(buffer);
                const jsonRecords = Marc.transform(marcRecords, Marc.MARCXML);

                setInputFile(JSON.stringify(jsonRecords, null, 2));
            };
            reader.readAsArrayBuffer(file);
        };
    };

    return (
        <div>
            <input type="file" onChange={handleFileMarc} />
            <textarea value={inputFile} readOnly rows="10" cols="50" />
        </div>
    )
};

export default ReadMarcFile;