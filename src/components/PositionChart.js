import React from 'react';
import { Line } from 'react-chartjs-2';

const PositionChart = ({ positions }) => {
    const data = {
        labels: positions.map((_, index) => `Joint ${index + 1}`),
        datasets: [
            {
                label: 'Position',
                data: positions,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default PositionChart;
