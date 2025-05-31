import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const Categories = () => {
  const { categories, addCategory, updateCategoryById, deleteCategoryById } = useBudget();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#3b82f6'
  });

  const colorOptions = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategoryById(editingCategory.id, formData);
        setEditingCategory(null);
      } else {
        await addCategory(formData);
        setShowAddForm(false);
      }
      
      setFormData({
        name: '',
        type: 'expense',
        color: '#3b82f6'
      });
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color
    });
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#3b82f6'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryById(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  return (
    <div className="categories">
      <div className="page-header">
        <h1 className="page-title">
          <Tag size={24} />
          Categories
        </h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingCategory) && (
        <div className="card mb-6">
          <h2 className="card-title">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={editingCategory ? handleCancelEdit : () => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save size={20} />
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="card">
          <h2 className="card-title">
            Expense Categories ({expenseCategories.length})
          </h2>
          
          {expenseCategories.length === 0 ? (
            <div className="empty-state">
              <p>No expense categories yet</p>
            </div>
          ) : (
            <div className="categories-list">
              {expenseCategories.map(category => (
                <div key={category.id} className="category-item">
                  <div className="category-info">
                    <div 
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="category-name">{category.name}</span>
                  </div>
                  
                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn-icon"
                      title="Edit category"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn-icon btn-danger"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div className="card">
          <h2 className="card-title">
            Income Categories ({incomeCategories.length})
          </h2>
          
          {incomeCategories.length === 0 ? (
            <div className="empty-state">
              <p>No income categories yet</p>
            </div>
          ) : (
            <div className="categories-list">
              {incomeCategories.map(category => (
                <div key={category.id} className="category-item">
                  <div className="category-info">
                    <div 
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="category-name">{category.name}</span>
                  </div>
                  
                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn-icon"
                      title="Edit category"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn-icon btn-danger"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
