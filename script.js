let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.getElementById('date').valueAsDate = new Date();

document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (amount <= 0) {
        alert('Amount must be greater than zero!');
        return;
    }

    const newTransaction = {
        id: Date.now().toString(),
        type: type,
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    transactions.push(newTransaction);

    saveToLocalStorage();

    clearForm();
    renderTable();
    updateSummary();
});

function renderTable() {
    const tbody = document.getElementById('transactionTableBody');
    const noDataMsg = document.getElementById('noDataMessage');
    const filterType = document.getElementById('filterType').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    let filteredData = transactions.filter(t => {
        const matchesFilter = (filterType === 'All') || (t.type === filterType);
        const matchesSearch = t.description.toLowerCase().includes(searchText) || t.category.toLowerCase().includes(searchText);
        return matchesFilter && matchesSearch;
    });

    tbody.innerHTML = '';

    if (filteredData.length === 0) {
        noDataMsg.classList.remove('d-none');
    } else {
        noDataMsg.classList.add('d-none');
        
        filteredData.forEach(t => {
            const tr = document.createElement('tr');
            
            const typeBadge = t.type === 'Income' 
                ? '<span class="badge badge-income">Income</span>' 
                : '<span class="badge badge-expense">Expense</span>';
            
            const amountClass = t.type === 'Income' ? 'amount-income' : 'amount-expense';
            const sign = t.type === 'Income' ? '+' : '-';
            const formattedAmount = parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 });

            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${typeBadge}</td>
                <td>${t.category}</td>
                <td class="text-end ${amountClass}">${sign} LKR ${formattedAmount}</td>
                <td class="text-center">
                    <button class="btn-delete" onclick="deleteTransaction('${t.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'Income') {
            totalIncome += parseFloat(t.amount);
        } else {
            totalExpense += parseFloat(t.amount);
        }
    });

    const balance = totalIncome - totalExpense;

    const format = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('totalIncome').innerText = `LKR ${format(totalIncome)}`;
    document.getElementById('totalExpense').innerText = `LKR ${format(totalExpense)}`;
    document.getElementById('currentBalance').innerText = `LKR ${format(balance)}`;
}

function deleteTransaction(id) {
    if(confirm("Are you sure you want to delete this transaction?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTable();
        updateSummary();
    }
}

function clearForm() {
    document.getElementById('transactionForm').reset();
    document.getElementById('date').valueAsDate = new Date();
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

renderTable();
updateSummary();