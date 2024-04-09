import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {SERVER_PORT} from '../constance.js';

function Bills() {
    let {type} = useParams();
    const [listBills, setListBills] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:${SERVER_PORT}/bills/${type}`)
            .then((res) => {
                setListBills(res.data.receiveBills)
            });
    }, [type]);

    return (
        <div>
            <table>
                {listBills.map((bill) => {
                    return (
                        <tr key={bill.id}>
                            <td> {bill.NameBill} </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
}

export default Bills;