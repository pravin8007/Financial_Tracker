import { Radio, Select, Table } from "antd"
import { useState } from "react"
import "./Styles.css"
import searchImg from "../../assets/search.svg"
import { unparse, parse } from "papaparse"
import { toast } from "react-toastify"



function TransactionsTable({ transactions , addTransaction,  fetchTransactions }) {
    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("")

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        }

    ]

    let filterdTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
        &&
        item.type.includes(typeFilter)
    );

    let sortedTransaction = filterdTransactions.sort((a, b) => {
        if (sortKey === "amount") {
            return a.amount - b.amount
        }
        else if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date)
        }
        else {
            return 0
        }
    })

    function exportCSV() {
        var csv = unparse({
            fields: ["name", "amount", "tag", "type", "date"],
            data: transactions.map(({ name, amount, tag, type, date }) => [name, amount, tag, type, date]),
        });
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var csvUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = csvUrl;
        link.download = "Transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCsv(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    for(const trasaction of results.data){
                        console.log("Transactions ", trasaction);
                        const newTrans = {
                            ...trasaction,
                            amount : parseFloat(trasaction.amount),
                        }
                        await addTransaction(newTrans, true)
                        
                    }
                    console.log("Result Data >> ", results.data);
                }
            });
            toast.success("All Transactions Added !");
            fetchTransactions();
            event.target.files = null;
        }
        catch (e) {
            toast.error(e.message);

        }
    }

        return <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="input-flex">
                    <img src={searchImg} style={{ width: "16px" }} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Name" />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter by Type"
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expenses</Option>
                </Select>
            </div>

            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                        width: "100%",
                        marginBottom: "10px",
                    }}
                >
                    <h2>My Transactions</h2>
                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                    </Radio.Group>
                    <div style={{ display: "flex" }}>
                        <button className="btn" onClick={exportCSV}>Export To CSV</button>
                        <label htmlFor="file-csv" className="btn btn-blue" >Import To CSV</label>
                        <input type="file" id="file-csv" accept=".csv" onChange={importFromCsv} style={{ display: "none" }} required />
                    </div>
                </div>
                <Table className="table" dataSource={sortedTransaction} columns={columns} />
            </div>
        </>
}
export default TransactionsTable
