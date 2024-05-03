import React, { useState } from "react";
import {Bar} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";


function Chart_CatalogPerMonth({props, year}) {
    const chartLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const [data, setData] = useState({
        labels: chartLabels,
        datasets: [{
            label: `Số lượng sách được biên mục theo tháng trong năm ${year}`,
            data: chartLabels.map(month => {
                const item = props.find(item => item.month === month);
                return item ? item.amount : 0;
            }),
            // Trong 12 tháng, tìm xem tháng nào có data trong props thì đổ ra
            // còn không thì cho data = 0

            backgroundColor: ['#4766f4'],
            borderRadius: 5,
        }]
    });

    return (
        <Bar data={data} />
    )
}

export default Chart_CatalogPerMonth;