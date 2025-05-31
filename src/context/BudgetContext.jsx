import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  getTransactions,
  getCategories,
  getSettings,
  saveTransaction,
  updateTransaction,
  deleteTransaction,
  saveCategory,
  updateCategory,
  deleteCategory,
  updateSettings
} from '../utils/localStorage';

// Initial state
const initialState = {
  transactions: [],
  categories: [],
  settings: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    theme: 'light'
  },
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_DATA: 'LOAD_DATA',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

// Reducer function
const budgetReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.LOAD_DATA:
      return {
        ...state,
        transactions: action.payload.transactions,
        categories: action.payload.categories,
        settings: action.payload.settings,
        loading: false
      };
    
    case actionTypes.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    
    case actionTypes.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    
    case actionTypes.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    
    case actionTypes.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    
    case actionTypes.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      };
    
    case actionTypes.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const BudgetContext = createContext();

// Provider component
export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        const transactions = getTransactions();
        const categories = getCategories();
        const settings = getSettings();
        
        dispatch({
          type: actionTypes.LOAD_DATA,
          payload: { transactions, categories, settings }
        });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    };

    loadData();
  }, []);

  // Action creators
  const actions = {
    addTransaction: async (transactionData) => {
      try {
        const newTransaction = saveTransaction(transactionData);
        dispatch({ type: actionTypes.ADD_TRANSACTION, payload: newTransaction });
        return newTransaction;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    updateTransactionById: async (id, updates) => {
      try {
        const updatedTransaction = updateTransaction(id, updates);
        dispatch({ type: actionTypes.UPDATE_TRANSACTION, payload: updatedTransaction });
        return updatedTransaction;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    deleteTransactionById: async (id) => {
      try {
        deleteTransaction(id);
        dispatch({ type: actionTypes.DELETE_TRANSACTION, payload: id });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    addCategory: async (categoryData) => {
      try {
        const newCategory = saveCategory(categoryData);
        dispatch({ type: actionTypes.ADD_CATEGORY, payload: newCategory });
        return newCategory;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    updateCategoryById: async (id, updates) => {
      try {
        const updatedCategory = updateCategory(id, updates);
        dispatch({ type: actionTypes.UPDATE_CATEGORY, payload: updatedCategory });
        return updatedCategory;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    deleteCategoryById: async (id) => {
      try {
        deleteCategory(id);
        dispatch({ type: actionTypes.DELETE_CATEGORY, payload: id });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    updateAppSettings: async (settingsData) => {
      try {
        const updatedSettings = updateSettings(settingsData);
        dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: updatedSettings });
        return updatedSettings;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    clearError: () => {
      dispatch({ type: actionTypes.SET_ERROR, payload: null });
    }
  };

  return (
    <BudgetContext.Provider value={{ ...state, ...actions }}>
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook to use the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
