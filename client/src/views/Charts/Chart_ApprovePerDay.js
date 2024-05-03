import React, { useState } from "react";
import {Line} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";

function Chart_ApprovePerDay({props, month, year}) {
    const chartLabels = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ];

    const [data, setData] = useState({
        labels: chartLabels,
        datasets: [{
            label: `Số lượng sách được phân phối theo ngày trong tháng ${month} - ${year}`,
            data: chartLabels.map(day => {
                const item = props.find(item => item.day === day);
                return item ? item.amount : 0;
            })
        }]
    });

    return (
        <Line data={data} />
    )
}

export default Chart_ApprovePerDay;