import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { format } from 'date-fns';

const RecentTransactions = ({ limit = 10 }) => {
  const { transactions, categories } = useBudget();

  // Sort transactions by date (newest first) and limit
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

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

  if (recentTransactions.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} className="empty-icon" />
        <p>No transactions yet</p>
        <Link to="/add-expense" className="btn btn-primary">
          Add Your First Transaction
        </Link>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="transactions-list">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const categoryColor = getCategoryColor(transaction.categoryId);
          
          return (
            <div key={transaction.id} className="transaction-item">
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
              
              <div className="transaction-details">
                <div className="transaction-description">
                  {transaction.description}
                </div>
                <div className="transaction-meta">
                  <span className="transaction-category">
                    {getCategoryName(transaction.categoryId)}
                  </span>
                  <span className="transaction-date">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </div>
      
      {transactions.length > limit && (
        <div className="transactions-footer">
          <Link to="/transactions" className="btn btn-secondary">
            View All Transactions
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
