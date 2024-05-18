import React, { useEffect, useState } from "react";
import {Line} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";
import {renderDays} from "../../utils/RenderDays";

function Chart_ApprovePerDay({props, month, year}) {
    const chartLabels = renderDays(month, year);

    const [data, setData] = useState({
        labels: chartLabels,
        datasets: [{
            label: `Số lượng sách được phân phối theo ngày trong tháng ${month} trong ${year}`,
            data: chartLabels.map(day => {
                const item = props.find(item => item.day === day);
                return item ? item.amount : 0;
            })
        }]
    });

    useEffect(() => {
        const updateData = () => {
            const newData = {
                labels: chartLabels,
                datasets: [{
                    label: `Số lượng sách được phân phối theo ngày trong tháng ${month} trong ${year}`,
                    data: chartLabels.map(day => {
                        const item = props.find(item => item.day === day);
                        return item ? item.amount : 0;
                    })
                }]
            };

            setData(newData);
        };

        updateData();
    }, [props, month, year]);

    return (
        <Line data={data} />
    )
}

export default Chart_ApprovePerDay;