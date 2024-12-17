import './App.css'
import Signup from './pages/Signup'
import DashBoard from './pages/Dashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/Dashboard" element={<DashBoard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
