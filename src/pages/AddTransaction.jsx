import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { format } from 'date-fns';

const AddTransaction = ({ type = 'expense' }) => {
  const navigate = useNavigate();
  const { categories, addTransaction } = useBudget();
  
  const [formData, setFormData] = useState({
    type,
    amount: '',
    description: '',
    categoryId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Filter categories by type
  const filteredCategories = categories.filter(category => category.type === type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      await addTransaction(transactionData);
      
      // Reset form
      setFormData({
        type,
        amount: '',
        description: '',
        categoryId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
      
      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const isIncome = type === 'income';
  const pageTitle = isIncome ? 'Add Income' : 'Add Expense';
  const icon = isIncome ? Plus : Minus;
  const IconComponent = icon;

  return (
    <div className="add-transaction">
      <div className="page-header">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="page-title">
          <IconComponent size={24} />
          {pageTitle}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card">
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount *
                </label>
                <div className="input-group">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`form-input ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`form-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder={`Enter ${type} description`}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoryId" className="form-label">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`form-select ${errors.categoryId ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${isIncome ? 'btn-success' : 'btn-danger'}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading" />
                ) : (
                  <Save size={20} />
                )}
                {loading ? 'Saving...' : `Add ${isIncome ? 'Income' : 'Expense'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
