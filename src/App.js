import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Layout from './Components/Layout';
import Dashboard from './Pages/Dashboard';
import Table from './Pages/Table';
import Behaviour from './Pages/BehaviourTable';
import Upload from './Pages/Uploade';
import Chat from './Pages/Chat';
import EmployeesForm from './Pages/EmployeesForm';


const App = () => {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Login & Register - No Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages - Wrapped with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/table" element={<Table />} />
                <Route path="/behaviourtable" element={<Behaviour />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/employee-form" element={<EmployeesForm />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;