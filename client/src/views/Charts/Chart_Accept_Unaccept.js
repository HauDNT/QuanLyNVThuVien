import React, { useState } from "react";
import {Doughnut} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";

function Chart_Accept_Unaccept({accept, unaccept}) {
    const [data, setData] = useState({
        labels: ['Đã duyệt', 'Chưa duyệt'],
        datasets: [{
            data: [accept, unaccept],
            width: 50,
            height: 50,
            backgroundColor: ['#AEE2FF', '#FFC5C5'],
            borderColor: ['#6499E9', '#FD8A8A'] 
        }]
    });

    return (
        <div>
            <Doughnut 
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                }}
            />
        </div>
    )
}

export default Chart_Accept_Unaccept;