import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";

const Paginate = ({data, applyPaginateData}) => {
    const [change, setChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = data.slice(firstIndex, lastIndex);
    const nPage = Math.ceil(data.length / recordsPerPage);
    const numbers = [...Array(nPage + 1).keys()].slice(1);

    useEffect(() => {
        applyPaginateData(records);
    }, [currentPage, data.length]);

    const nextPage = () => {
        if (currentPage !== numbers[numbers.length - 1]) {
            setCurrentPage(currentPage + 1);
            setChange(!change);
        }
    };

    const prevPage = () => {
        if (currentPage !== numbers[0]) {
            setCurrentPage(currentPage - 1);
            setChange(!change);
        }
    };

    const changePage = (id) => {
        setCurrentPage(id);
        setChange(!change);
    };

    return (
        <nav className="nav-paginate">
            <ul className="paginate">
                <li className="page-item">
                    <Link className="page-link special-page-link" onClick={() => prevPage()}>
                        <MdArrowBackIos />
                    </Link>
                </li>
                {
                    numbers.map((n, index) => (
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={index}>
                            <Link className="page-link" onClick={() => changePage(n)}>{n}</Link>
                        </li>
                    ))
                }
                <li className="page-item">
                    <Link className="page-link" onClick={() => nextPage()}>
                        <MdArrowForwardIos />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Paginate;