import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const Paginate = ({ data, applyPaginateData, page }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = page;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);

  const nPage = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  useEffect(() => {
    applyPaginateData(records);
  }, [currentPage, data]);

  const nextPage = () => {
    if (currentPage !== numbers[numbers.length - 1]) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage !== numbers[0]) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePage = (id) => {
    setCurrentPage(id);
  };

  return (
    <nav className="nav-paginate">
      <ul className="paginate">
        <li className="page-item">
          <Link className="page-link special-page-link" onClick={prevPage}>
            <MdArrowBackIos />
          </Link>
        </li>
        {numbers.map((n) => (
          <li
            className={`page-item ${currentPage === n ? "active" : ""}`}
            key={n}
          >
            <Link className="page-link" onClick={() => changePage(n)}>
              {n}
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link className="page-link" onClick={nextPage}>
            <MdArrowForwardIos />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;
