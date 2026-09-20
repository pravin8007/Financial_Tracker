import { Line, Pie } from '@ant-design/charts';
import PropTypes from 'prop-types';

function ChartComponent({ sortedTransactions }) {
    const data = sortedTransactions.map((item) => {
        return { date: item.date, amount: item.amount }
    });

    const spendingData = sortedTransactions.filter(
        (transaction) => {
        if (transaction.type == "expense") {
            return { tag: transaction.tag, amount: transaction.amount };
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

    return (
        <div className='charts-wrapper'>
            <div className='chart-1'>
                <h2>Financial Statistics</h2>
                <Line {...config} className={"stat"} />
            </div>
            <div className='chart-2'>
                <h2>Your Spending</h2>
                <Pie {...spendingConfig} className={"pie"}/>
            </div>
        </div>
    )
}

ChartComponent.propTypes = { 
    sortedTransactions: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        amount: PropTypes.number,
        type: PropTypes.string,
        tag: PropTypes.string,
    })),
};

ChartComponent.defaultProps = {
    sortedTransactions: [],
};

export default ChartComponent
