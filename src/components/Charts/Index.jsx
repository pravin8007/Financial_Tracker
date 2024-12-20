import { Line, Pie } from '@ant-design/charts';
import React from 'react';

function ChartComponent({ sortedTransactions }) {
    const data = sortedTransactions.map((item) => {
        return { date: item.date, amount: item.amount }
    });

    const spendingData = sortedTransactions.filter(
        (transaction) => {
            if (transaction.type == "expense") {
                return { tag: transaction.tag, amount: transaction.amount }
            }
        }
    );

    let finalSpending = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if (!acc[key]) {
            acc[key] = { tag: obj.tag, amount: obj.amount };
        } else {
            acc[key].amount += obj.amount;
        }
        return acc;
    }, {})

    const config = {
        data : data,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
    };

    const spendingConfig = {
        data : Object.values(finalSpending),
        autoFit: true,
        angleField: 'amount',
        colorField: 'tag',
    };

    let chart;
    let pieChart;


    return (
        <div className='charts-wrapper'>
            <div className='chart-1'>
                <h2>Financial Statistics</h2>
                <Line {...config} className={"stat"} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>
            <div className='chart-2'>
                <h2>Your Spending</h2>
                <Pie {...spendingConfig} className={"pie"} onReady={(chartInstance) => (pieChart = chartInstance)} />
            </div>
        </div>
    )
}

export default ChartComponent
