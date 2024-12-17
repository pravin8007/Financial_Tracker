/* eslint-disable react/prop-types */
import { Card, Row } from "antd"
import "./Styles.css"
import Button from "../Button"


function Cards({showExpenseModal , showIncomeModal, resetBalance, income , expense ,totalBalance}) {
    return (
        <div>
            <Row className="my-row">

                <Card className="my-card" title="Current Balance" bordered={true} hoverable >
                    <p>₹ {totalBalance}</p>
                    <Button text="Reset Balance" blue={true} onClick={resetBalance}/>
                </Card>

                <Card className="my-card" title="Total Income" bordered={true} hoverable >
                    <p>₹ {income}</p>
                    <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
                </Card>

                <Card className="my-card" title="Total Expenses" bordered={true} hoverable >
                    <p>₹ {expense}</p>
                    <Button text="Add Expenses" blue={true} onClick={showExpenseModal}/>
                </Card>

            </Row>
        </div>
    )
}

export default Cards