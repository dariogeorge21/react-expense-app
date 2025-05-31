import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  return (
    <BudgetProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-income" element={<AddTransaction type="income" />} />
          <Route path="/add-expense" element={<AddTransaction type="expense" />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BudgetProvider>
  );
}

export default App;
