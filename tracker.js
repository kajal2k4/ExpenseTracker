// Retrieve existing transactions from localStorage or initialize an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editingIndex = -1; // Variable to track the index of the transaction being edited

// Define colors for each category to be used in the chart and UI
const categoryColors = {
    investment: '#ffd43b',
    expense: '#e64980',
    savings: '#05c4e6'
};

// Initialize the donut chart when the window loads
window.onload = function () {
    const ctx = document.getElementById('donutChart').getContext('2d');
    donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Investment', 'Expense', 'Savings'],
            datasets: [{
                data: [0, 0, 0], 
                backgroundColor: Object.values(categoryColors),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Update the UI with the current transactions
    updateUI(transactions);
};

// Function to add or update a transaction
function addTransaction() {
    const budget = document.getElementById('budget').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!budget){
        alert("Please set up the budget first!")
    }
    else if (amount>budget) {
        alert('Amount exceeds the budget limit!');
        return
    }
    else{
        if (!description || !category || !amount) {
            alert('Please fill all fields');
            return;
        }
    
        const date = new Date().toISOString().split('T')[0]; // Stores date as YYYY-MM-DD
        const transaction = { description, category, amount, date };
    
        if (editingIndex === -1) {
            transactions.push(transaction);
        } else {
            transactions[editingIndex] = transaction;
            editingIndex = -1;
            document.getElementById('submitBtn').textContent = 'Make Transaction';
        }
    
        localStorage.setItem('transactions', JSON.stringify(transactions));
    
        updateUI(transactions);
        clearForm();
        return;
    }

   

    // Validate input
    
}


// Function to edit an existing transaction
function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('description').value = transaction.description;
    document.getElementById('category').value = transaction.category;
    document.getElementById('amount').value = transaction.amount;
    editingIndex = index; // Set the editingIndex to the current transaction's index
    document.getElementById('submitBtn').textContent = 'Update Transaction';
}

// Function to delete a transaction
function deleteTransaction(index) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions.splice(index, 1); // Remove the transaction at the specified index
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI(transactions); // Update the UI after deletion
    }
}

// Function to apply filters based on category and date
function applyFilter() {
    const filterCategory = document.getElementById('filterCategory').value;
    const filterDate = document.getElementById('filterDate').value;

    let filteredTransactions = transactions;

    // Filter transactions by category
    if (filterCategory) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.category === filterCategory);
    }

    // Filter transactions by date (YYYY-MM-DD format)
    if (filterDate) {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.date === filterDate);
    }

    // Update the UI with the filtered transactions
    updateUI(filteredTransactions);
}

// Function to update the UI with the provided transactions
function updateUI(transactionsToDisplay) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    transactionsToDisplay.forEach((transaction, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="category-indicator" style="background: ${categoryColors[transaction.category]}"></div>
                <span>${transaction.description}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span>₹${transaction.amount}</span>
                <span>${transaction.date}</span>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
                </div>
            </div>
        `;
        historyList.appendChild(historyItem);
    });

    const totals = {
        investment: 0,
        expense: 0,
        savings: 0
    };

    // Calculate total amounts for each category
    transactions.forEach(t => {
        totals[t.category] += t.amount;
    });

    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    document.querySelector('.total-amount').textContent = `₹${total}`;

    // Calculate percentages for each category
    const percentages = {
        investment: total ? ((totals.investment / total) * 100).toFixed(2) : 0,
        expense: total ? ((totals.expense / total) * 100).toFixed(2) : 0,
        savings: total ? ((totals.savings / total) * 100).toFixed(2) : 0
    };

    // Update legend items with the calculated percentages
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems[0].querySelector('span').textContent = `Investment (${percentages.investment}%)`;
    legendItems[1].querySelector('span').textContent = `Expense (${percentages.expense}%)`;
    legendItems[2].querySelector('span').textContent = `Savings (${percentages.savings}%)`;

    // Update the donut chart with the new data
    donutChart.data.datasets[0].data = [totals.investment, totals.expense, totals.savings];
    donutChart.update();
}

// Function to clear the input form
function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
}