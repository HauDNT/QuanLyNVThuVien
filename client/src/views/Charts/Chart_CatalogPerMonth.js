import React, { useEffect, useState } from "react";
import {Bar} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";
import {renderMonths} from "../../utils/RenderMonths.js";

function Chart_CatalogPerMonth({props, year}) {
    const chartLabels = renderMonths();

    const [data, setData] = useState({
        labels: chartLabels,
        datasets: [{
            label: `Số lượng sách được biên mục theo từng tháng trong năm ${year}`,
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

    // Cập nhật lại nếu có thay đổi về năm:
    useEffect(() => {
        const updateData = () => {
            const newData = {
                labels: chartLabels,
                datasets: [{
                    label: `Số lượng sách được biên mục theo tháng trong năm ${year}`,
                    data: chartLabels.map(month => {
                        const item = props.find(item => item.month === month);
                        return item ? item.amount : 0;
                    }),
    
                    backgroundColor: ['#4766f4'],
                    borderRadius: 5,
                }]
            };
            
            setData(newData);
        };

        updateData();
    }, [props, year]);
        
    return (
        <Bar data={data} />
    )
}

export default Chart_CatalogPerMonth;