import React, { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload, Trash2, Save } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { exportData, importData, clearAllData } from '../utils/localStorage';

const Settings = () => {
  const { settings, updateAppSettings } = useBudget();
  const [formData, setFormData] = useState(settings);
  const [importing, setImporting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAppSettings(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const success = importData(data);
        
        if (success) {
          alert('Data imported successfully! Please refresh the page to see changes.');
          window.location.reload();
        } else {
          alert('Error importing data');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Invalid file format');
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (window.confirm('This will delete all transactions, categories, and settings. Are you absolutely sure?')) {
        try {
          clearAllData();
          alert('All data cleared successfully! The page will now reload.');
          window.location.reload();
        } catch (error) {
          console.error('Error clearing data:', error);
          alert('Error clearing data');
        }
      }
    }
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h1 className="page-title">
          <SettingsIcon size={24} />
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="card-title">General Settings</h2>
          
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateFormat" className="form-label">
                Date Format
              </label>
              <select
                id="dateFormat"
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="MM/dd/yyyy">MM/DD/YYYY (US)</option>
                <option value="dd/MM/yyyy">DD/MM/YYYY (EU)</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD (ISO)</option>
                <option value="MMM dd, yyyy">MMM DD, YYYY</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="theme" className="form-label">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={20} />
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="card-title">Data Management</h2>
          
          <div className="data-actions">
            <div className="action-item">
              <div className="action-info">
                <h3>Export Data</h3>
                <p>Download all your budget data as a JSON file for backup or transfer.</p>
              </div>
              <button onClick={handleExport} className="btn btn-secondary">
                <Download size={20} />
                Export
              </button>
            </div>

            <div className="action-item">
              <div className="action-info">
                <h3>Import Data</h3>
                <p>Import budget data from a previously exported JSON file.</p>
              </div>
              <label className="btn btn-secondary">
                <Upload size={20} />
                {importing ? 'Importing...' : 'Import'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                  disabled={importing}
                />
              </label>
            </div>

            <div className="action-item danger">
              <div className="action-info">
                <h3>Clear All Data</h3>
                <p>Permanently delete all transactions, categories, and settings. This cannot be undone.</p>
              </div>
              <button onClick={handleClearData} className="btn btn-danger">
                <Trash2 size={20} />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="card">
        <h2 className="card-title">About</h2>
        <div className="app-info">
          <p><strong>Budget Manager</strong> - A personal finance tracking application</p>
          <p>Built with React and localStorage for persistent data storage</p>
          <p>Features include transaction tracking, categorization, filtering, and data visualization</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
