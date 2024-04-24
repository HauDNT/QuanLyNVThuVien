import {parse} from 'marc4js';

class HandleMarc21Data {
    async processData (file) {
        try {
            const data = await file.arrayBuffer();
            const records = await parse(data);

            return records;
        } catch (error) {
            alert('Error processing: ', error);
        }
    }
}

export default HandleMarc21Data;