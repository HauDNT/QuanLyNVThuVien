import React, { useState } from "react";
import {Line} from 'react-chartjs-2';
import {Chart as Chartjs} from "chart.js/auto";
import {UserData} from "../../Data";

function LineChart() {
    const [userData, setUserData] = useState({
        labels: UserData.map(data => data.userGain),
        datasets: [{
          label: "Users Losted",
          data: UserData.map(data => data.userLost),
          backgroundColor: ["red", "green", "blue"],
        //   borderColor: "black",
        //   borderWidth: 3
        }]
    });

    return (
        <Line data={userData}/>
    );
};

export default LineChart;