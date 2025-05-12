
import { Button, Modal, Form, Input, DatePicker, Select } from "antd" 

function AddIncome(prop) {

    const [form] = Form.useForm(); 

    return (
        <Modal
           style={{ fontWeight: 600, fontFamily:"Montserrat", textAlign:"center"}}
            title={"Add Income"}
            open={prop.isIncomeModalVisible}
            onCancel={prop.handleIncomeCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    prop.onFininsh(values, "income")
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
                    rules={[{ required: true, message: "Please input the income amount!" }]}
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
                    rules={[{ required: true, message: "Please select the tag!" }]}
                >
                    <Select className="select-input-1">
                        <Select.Option value="Salary">Salary</Select.Option>
                        <Select.Option value="Freelance">Freelance</Select.Option>
                        <Select.Option value="Investment">Investment</Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button className="btn btn-blue" type="primary" htmlType="submit">Add Income</Button>
                </Form.Item>

            </Form>

        </Modal>
    )
}

export default AddIncome
