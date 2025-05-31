// localStorage utility functions for budget management

const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_transactions',
  CATEGORIES: 'budget_categories',
  SETTINGS: 'budget_settings'
};

// Default categories
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food & Dining', type: 'expense', color: '#ef4444' },
  { id: '2', name: 'Transportation', type: 'expense', color: '#f59e0b' },
  { id: '3', name: 'Shopping', type: 'expense', color: '#8b5cf6' },
  { id: '4', name: 'Entertainment', type: 'expense', color: '#06b6d4' },
  { id: '5', name: 'Bills & Utilities', type: 'expense', color: '#64748b' },
  { id: '6', name: 'Healthcare', type: 'expense', color: '#ec4899' },
  { id: '7', name: 'Education', type: 'expense', color: '#10b981' },
  { id: '8', name: 'Other Expenses', type: 'expense', color: '#6b7280' },
  { id: '9', name: 'Salary', type: 'income', color: '#22c55e' },
  { id: '10', name: 'Freelance', type: 'income', color: '#3b82f6' },
  { id: '11', name: 'Investment', type: 'income', color: '#8b5cf6' },
  { id: '12', name: 'Other Income', type: 'income', color: '#06b6d4' }
];

// Get data from localStorage with fallback
export const getStorageData = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Set data to localStorage
export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

// Transaction management
export const getTransactions = () => {
  return getStorageData(STORAGE_KEYS.TRANSACTIONS, []);
};

export const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: transaction.id || Date.now().toString(),
    createdAt: transaction.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedTransactions = [...transactions, newTransaction];
  setStorageData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
  return newTransaction;
};

export const updateTransaction = (id, updates) => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(transaction =>
    transaction.id === id
      ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
      : transaction
  );
  setStorageData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
  return updatedTransactions.find(t => t.id === id);
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
  setStorageData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
  return true;
};

// Category management
export const getCategories = () => {
  const categories = getStorageData(STORAGE_KEYS.CATEGORIES, []);
  if (categories.length === 0) {
    setStorageData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return categories;
};

export const saveCategory = (category) => {
  const categories = getCategories();
  const newCategory = {
    ...category,
    id: category.id || Date.now().toString()
  };
  
  const updatedCategories = [...categories, newCategory];
  setStorageData(STORAGE_KEYS.CATEGORIES, updatedCategories);
  return newCategory;
};

export const updateCategory = (id, updates) => {
  const categories = getCategories();
  const updatedCategories = categories.map(category =>
    category.id === id ? { ...category, ...updates } : category
  );
  setStorageData(STORAGE_KEYS.CATEGORIES, updatedCategories);
  return updatedCategories.find(c => c.id === id);
};

export const deleteCategory = (id) => {
  const categories = getCategories();
  const updatedCategories = categories.filter(category => category.id !== id);
  setStorageData(STORAGE_KEYS.CATEGORIES, updatedCategories);
  return true;
};

// Settings management
export const getSettings = () => {
  return getStorageData(STORAGE_KEYS.SETTINGS, {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    theme: 'light'
  });
};

export const updateSettings = (settings) => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  setStorageData(STORAGE_KEYS.SETTINGS, updatedSettings);
  return updatedSettings;
};

// Data export/import
export const exportData = () => {
  return {
    transactions: getTransactions(),
    categories: getCategories(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
};

export const importData = (data) => {
  try {
    if (data.transactions) {
      setStorageData(STORAGE_KEYS.TRANSACTIONS, data.transactions);
    }
    if (data.categories) {
      setStorageData(STORAGE_KEYS.CATEGORIES, data.categories);
    }
    if (data.settings) {
      setStorageData(STORAGE_KEYS.SETTINGS, data.settings);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
