// Export data to CSV
export const exportTransactionsToCSV = (incomes = [], expenses = [], filename = 'expense-tracker-export.csv') => {
  const headers = ['Type', 'Date', 'Category/Source', 'Amount', 'Payment Method/Ref', 'Description/Notes'];

  const incomeRows = incomes.map(item => [
    'Income',
    item.date,
    `"${(item.source || '').replace(/"/g, '""')}"`,
    item.amount,
    `"${(item.reference || 'Direct').replace(/"/g, '""')}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`,
  ]);

  const expenseRows = expenses.map(item => [
    'Expense',
    item.date,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    item.amount,
    `"${(item.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(item.description || item.notes || '').replace(/"/g, '""')}"`,
  ]);

  const allRows = [headers.join(','), ...incomeRows.map(r => r.join(',')), ...expenseRows.map(r => r.join(','))];
  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(allRows.join('\n'));

  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Trigger browser print for reports
export const triggerPrintReport = () => {
  window.print();
};
