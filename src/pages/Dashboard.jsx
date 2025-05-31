import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Minus,
  Calendar,
  PieChart
} from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import ExpenseChart from '../components/Charts/ExpenseChart';
import RecentTransactions from '../components/Transactions/RecentTransactions';

const Dashboard = () => {
  const { transactions, categories } = useBudget();

  // Calculate current month's data
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance,
      transactionCount: currentMonthTransactions.length
    };
  }, [transactions]);

  // Calculate category spending for current month
  const categorySpending = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const currentMonthExpenses = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === 'expense' && 
             isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    const categoryTotals = {};
    currentMonthExpenses.forEach(transaction => {
      const categoryId = transaction.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += transaction.amount;
    });

    return Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          amount,
          color: category?.color || '#6b7280'
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  }, [transactions, categories]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview for {currentMonth}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card summary-card income-card">
          <div className="summary-header">
            <div className="summary-icon income">
              <TrendingUp size={24} />
            </div>
            <div className="summary-info">
              <h3>Total Income</h3>
              <p className="summary-amount">{formatCurrency(currentMonthData.income)}</p>
            </div>
          </div>
        </div>

        <div className="card summary-card expense-card">
          <div className="summary-header">
            <div className="summary-icon expense">
              <TrendingDown size={24} />
            </div>
            <div className="summary-info">
              <h3>Total Expenses</h3>
              <p className="summary-amount">{formatCurrency(currentMonthData.expenses)}</p>
            </div>
          </div>
        </div>

        <div className="card summary-card balance-card">
          <div className="summary-header">
            <div className={`summary-icon ${currentMonthData.balance >= 0 ? 'income' : 'expense'}`}>
              <DollarSign size={24} />
            </div>
            <div className="summary-info">
              <h3>Net Balance</h3>
              <p className={`summary-amount ${currentMonthData.balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(currentMonthData.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="card-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/add-income" className="btn btn-success">
            <Plus size={20} />
            Add Income
          </Link>
          <Link to="/add-expense" className="btn btn-danger">
            <Minus size={20} />
            Add Expense
          </Link>
          <Link to="/transactions" className="btn btn-secondary">
            <Calendar size={20} />
            View Transactions
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Chart */}
        <div className="card">
          <h2 className="card-title">
            <PieChart size={20} />
            Spending by Category
          </h2>
          {categorySpending.length > 0 ? (
            <ExpenseChart data={categorySpending} />
          ) : (
            <div className="empty-state">
              <p>No expenses recorded this month</p>
              <Link to="/add-expense" className="btn btn-primary">
                Add Your First Expense
              </Link>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="card-title">Recent Transactions</h2>
          <RecentTransactions limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
