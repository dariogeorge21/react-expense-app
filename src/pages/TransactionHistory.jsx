import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const TransactionHistory = () => {
  const { transactions, categories, deleteTransactionById } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, amount, description
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Get unique months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = format(date, 'yyyy-MM');
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesDescription = transaction.description.toLowerCase().includes(searchLower);
        const categoryName = categories.find(c => c.id === transaction.categoryId)?.name || '';
        const matchesCategory = categoryName.toLowerCase().includes(searchLower);
        if (!matchesDescription && !matchesCategory) return false;
      }

      // Type filter
      if (filterType !== 'all' && transaction.type !== filterType) return false;

      // Category filter
      if (filterCategory !== 'all' && transaction.categoryId !== filterCategory) return false;

      // Month filter
      if (filterMonth !== 'all') {
        const transactionDate = new Date(transaction.date);
        const filterDate = new Date(filterMonth + '-01');
        const monthStart = startOfMonth(filterDate);
        const monthEnd = endOfMonth(filterDate);
        if (!isWithinInterval(transactionDate, { start: monthStart, end: monthEnd })) return false;
      }

      return true;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, categories, searchTerm, filterType, filterCategory, filterMonth, sortBy, sortOrder]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransactionById(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transaction-history">
      <div className="page-header">
        <h1 className="page-title">
          <Calendar size={24} />
          Transaction History
        </h1>
        <Link to="/add-expense" className="btn btn-primary">
          <Plus size={20} />
          Add Transaction
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card summary-mini">
          <div className="summary-mini-content">
            <span className="summary-mini-label">Total Income</span>
            <span className="summary-mini-value income">{formatCurrency(totalIncome)}</span>
          </div>
        </div>
        <div className="card summary-mini">
          <div className="summary-mini-content">
            <span className="summary-mini-label">Total Expenses</span>
            <span className="summary-mini-value expense">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
        <div className="card summary-mini">
          <div className="summary-mini-content">
            <span className="summary-mini-label">Net Balance</span>
            <span className={`summary-mini-value ${totalIncome - totalExpenses >= 0 ? 'income' : 'expense'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-grid">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="form-select"
            >
              <option value="all">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {format(new Date(month + '-01'), 'MMMM yyyy')}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="form-select"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="description-asc">Description (A-Z)</option>
              <option value="description-desc">Description (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} className="empty-icon" />
            <p>No transactions found</p>
            {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterMonth !== 'all' ? (
              <p>Try adjusting your filters</p>
            ) : (
              <Link to="/add-expense" className="btn btn-primary">
                Add Your First Transaction
              </Link>
            )}
          </div>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <span>Transaction</span>
              <span>Category</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>
            
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const categoryColor = getCategoryColor(transaction.categoryId);
              
              return (
                <div key={transaction.id} className="table-row">
                  <div className="transaction-info">
                    <div className="transaction-icon">
                      <div 
                        className="category-indicator"
                        style={{ backgroundColor: categoryColor }}
                      />
                      {isIncome ? (
                        <TrendingUp size={16} className="status-income" />
                      ) : (
                        <TrendingDown size={16} className="status-expense" />
                      )}
                    </div>
                    <div>
                      <div className="transaction-description">
                        {transaction.description}
                      </div>
                      {transaction.notes && (
                        <div className="transaction-notes">
                          {transaction.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="transaction-category">
                    {getCategoryName(transaction.categoryId)}
                  </div>
                  
                  <div className="transaction-date">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </div>
                  
                  <div className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                  
                  <div className="transaction-actions">
                    <button 
                      className="btn-icon"
                      title="Edit transaction"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
