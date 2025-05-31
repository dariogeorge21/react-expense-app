# Budget Manager - React Expense Tracking Application

A comprehensive, responsive budget management application built with React.js, React Router, and localStorage for persistent data storage. Track your income, expenses, and visualize your spending patterns with an intuitive, mobile-friendly interface.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Real-time budget summary with income, expenses, and net balance
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category System**: Organize transactions with customizable categories and colors
- **Advanced Filtering**: Search and filter transactions by type, category, date, and amount
- **Data Visualization**: Interactive pie charts showing spending patterns by category
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Data Management
- **Persistent Storage**: All data saved to browser localStorage
- **Data Export/Import**: Backup and restore your budget data as JSON files
- **Settings Management**: Customize currency, date format, and theme preferences

### User Experience
- **Intuitive Navigation**: Clean sidebar navigation with React Router
- **Real-time Updates**: Instant feedback and state management with React Context
- **Mobile-First Design**: Touch-friendly interface with responsive layouts
- **Visual Feedback**: Color-coded categories and transaction types

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx          # Main layout with sidebar navigation
│   │   └── Layout.css          # Layout-specific styles
│   ├── Charts/
│   │   └── ExpenseChart.jsx    # Pie chart for expense visualization
│   └── Transactions/
│       └── RecentTransactions.jsx  # Recent transactions component
├── pages/
│   ├── Dashboard.jsx           # Main dashboard with overview
│   ├── AddTransaction.jsx      # Form for adding income/expenses
│   ├── TransactionHistory.jsx  # Transaction list with filtering
│   ├── Categories.jsx          # Category management
│   └── Settings.jsx            # App settings and data management
├── context/
│   └── BudgetContext.jsx       # Global state management
├── utils/
│   └── localStorage.js         # localStorage utility functions
├── App.jsx                     # Main app component with routing
├── main.jsx                    # App entry point
└── index.css                   # Global styles and CSS variables
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.1
- **State Management**: React Context API with useReducer
- **Data Persistence**: Browser localStorage
- **Charts**: Recharts 2.8.0
- **Icons**: Lucide React 0.294.0
- **Date Handling**: date-fns 2.30.0
- **Build Tool**: Vite 5.0.0
- **Styling**: CSS3 with CSS Variables

## 📱 Component Hierarchy

### Layout Structure
```
App (BrowserRouter)
└── BudgetProvider (Context)
    └── Layout
        ├── Sidebar Navigation
        ├── Header
        └── Main Content
            └── Route Components
```

### State Management
```
BudgetContext
├── transactions[]      # All transaction records
├── categories[]        # Income/expense categories
├── settings{}          # App configuration
└── actions{}           # CRUD operations
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd react-expense-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 🗄️ Data Management Approach

### localStorage Schema
```javascript
// Storage Keys
budget_transactions    // Array of transaction objects
budget_categories     // Array of category objects  
budget_settings       // Settings object

// Transaction Object
{
  id: "unique_id",
  type: "income|expense",
  amount: 100.00,
  description: "Transaction description",
  categoryId: "category_id",
  date: "2024-01-15",
  notes: "Optional notes",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}

// Category Object
{
  id: "unique_id",
  name: "Category Name",
  type: "income|expense",
  color: "#3b82f6"
}
```

### Default Categories
The app comes with pre-configured categories:
- **Expenses**: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education
- **Income**: Salary, Freelance, Investment, Other Income

## 🎨 Routing Setup (React Router 7.3)

```javascript
// Route Configuration
/                    → Dashboard (overview)
/add-income         → Add Income Form
/add-expense        → Add Expense Form  
/transactions       → Transaction History
/categories         → Category Management
/settings           → App Settings
```

### Navigation Features
- **Responsive Sidebar**: Collapsible on mobile devices
- **Active Route Highlighting**: Visual indication of current page
- **Breadcrumb Navigation**: Clear page titles and back buttons
- **Deep Linking**: All routes are bookmarkable

## 📊 Features Deep Dive

### Dashboard
- Monthly income/expense summary
- Net balance calculation
- Top 5 spending categories chart
- Recent transactions list
- Quick action buttons

### Transaction Management
- Form validation with error handling
- Category selection with color coding
- Date picker with default to today
- Optional notes field
- Immediate localStorage persistence

### Filtering & Search
- Text search across descriptions and categories
- Filter by transaction type (income/expense)
- Filter by category
- Filter by month/date range
- Sort by date, amount, or description

### Data Visualization
- Interactive pie charts using Recharts
- Color-coded categories
- Responsive chart sizing
- Tooltip with detailed information

## 🎯 Best Practices Implemented

### Performance
- React Context for efficient state management
- Memoized calculations with useMemo
- Optimized re-renders with proper dependencies
- Lazy loading considerations for future scaling

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

### Code Organization
- Modular component structure
- Separation of concerns
- Reusable utility functions
- Consistent naming conventions
- Comprehensive error handling

### Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized for various screen sizes

## 🔮 Future Enhancement Ideas

- **Data Sync**: Cloud storage integration
- **Budgeting**: Set monthly budget limits per category
- **Recurring Transactions**: Automated recurring income/expenses
- **Advanced Charts**: Trend analysis and monthly comparisons
- **Export Options**: PDF reports and CSV exports
- **Multi-Currency**: Support for multiple currencies
- **Dark Mode**: Theme switching capability
- **Notifications**: Budget alerts and reminders

## 🐛 Troubleshooting

### Common Issues
1. **Data not persisting**: Check if localStorage is enabled in browser
2. **Charts not displaying**: Ensure Recharts dependency is installed
3. **Mobile navigation issues**: Verify touch event handling
4. **Date formatting errors**: Check date-fns locale settings

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Built with ❤️ using React and modern web technologies**
# react-expense-app
