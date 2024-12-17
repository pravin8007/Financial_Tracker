import { Button, Modal, Form, Input, DatePicker, Select } from "antd"

function AddExpense(prop) {

    const [form] = Form.useForm();

    return (
        <Modal
            style={{ fontWeight: 600, fontFamily: "Montserrat", textAlign: "center" }}
            title={"Add Expense"}
            open={prop.isExpenseModalVisible}
            onCancel={prop.handleExpenseCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    prop.onFininsh(values, "expense")
                    form.resetFields()
                }}>

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please input the name of transaction!" }]}
                >
                    <Input type="text" className="custom-input" />
                </Form.Item>

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Please input the expense amount!" }]}
                >
                    <Input type="number" className="custom-input" />
                </Form.Item>

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: "Please input the date of transaction!" }]}
                >
                    <DatePicker className="custom-input" format="YYYY-MM-DD " />
                </Form.Item>

                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Tag"
                    name="tag"
                    rules={[{ required: true, message: "Please select the category of transaction!" }]}
                >
                    <Select className="selcet-input-2">
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="Education">Education</Select.Option>
                        <Select.Option value="rent">Rent</Select.Option>
                        <Select.Option value="travel">Travel</Select.Option>
                        <Select.Option value="others">Others</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button className="btn btn-blue" type="primary" htmlType="submit">Add Expense</Button>
                </Form.Item>

            </Form>

        </Modal>
    )
}

export default AddExpense
