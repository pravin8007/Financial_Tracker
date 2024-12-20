import Header from "../components/Header/Index"
import Cards from "../components/Cards/Index"
import { useEffect, useState } from "react"
import AddExpense from "../components/Modal/AddExpense";
import AddIncome from "../components/Modal/AddIncome";
import { addDoc, collection, deleteDoc, getDocs, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, auth } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionsTable/Index";
import ChartComponent from "../components/Charts/Index";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFininsh = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      name: values.name,
      tag: values.tag
    }

    addTransaction(newTransaction);
  }

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBanlance();
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!")

    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransacactions();
  }, [user]);

  useEffect(() => {
    calculateBanlance();
  }, [transactions]);

  function calculateBanlance() {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }

  async function fetchTransacactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      console.log("Transaction Array : ", transactionArray);
      toast.success("Transaction Fetched !")
    }
    setLoading(false);

  }

  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  function resetBalance() {
    if (transactions.length == 0) return toast.error("No transactions should be present to reset the balance!");

    let confirm = window.confirm("Are you sure you want to reset the balance?");
    if (confirm) {
      setIncome(0);
      setExpense(0);
      setTotalBalance(0);

      transactions.forEach((transaction) => {
        deleteTransaction(transaction);
      });
      setTransactions([]);
      toast.success("Balance Reset!");
    }
  }

  async function deleteTransaction(transaction) {
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().date === transaction.date) {
        deleteDoc(doc.ref);
        let newArr = transactions.filter((item) => item.date !== transaction.date);
        setTransactions(newArr);
        calculateBanlance();

        toast.success("Transaction Deleted!");
      }
    });
  }

  return (
    <div>
      <Header />

      {
        loading ? (<div style={{ position: "fixed", top: "45%", left: "45%", fontSize: "20px" }}>Loading...</div>)
          : (
            <>
              <Cards
                income={income}
                expense={expense}
                totalBalance={totalBalance}
                resetBalance={resetBalance}
                showExpenseModal={showExpenseModal}
                showIncomeModal={showIncomeModal}
              />

              {
                transactions && transactions.length != 0 ? <ChartComponent sortedTransactions={sortedTransactions} />
                  : <NoTransactions />
              }

              <AddIncome
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFininsh={onFininsh}
              />

              <AddExpense
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFininsh={onFininsh}
              />

              <TransactionsTable
                transactions={transactions}
                addTransaction={addTransaction}
                fetchTransacactions={fetchTransacactions}
              />
            </>
          )
      }

    </div>
  )
}

export default Dashboard