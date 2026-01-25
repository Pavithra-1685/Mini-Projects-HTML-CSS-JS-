const transactionList = document.querySelector(".transactions-list");

const totalExpensesEl = document.getElementById("total-expenses");
const monthExpensesEl = document.getElementById("month-expenses");
const topCategoryEl = document.getElementById("top-category");
const transactionCountEl = document.getElementById("transaction-count");

const searchInput = document.getElementById("search-input");
const dateFilter = document.getElementById("filter-date");
const categoryFilter = document.getElementById("filter-category");
const amountSort = document.getElementById("sort-amount");

const addExpenseBtn = document.getElementById("add-expense-btn");
const expenseModal = document.querySelector(".add-expense-modal");
const closeModalBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-expense-btn");

const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("expense-description");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const dateInput = document.getElementById("expense-date");

const chartCanvas = document.getElementById("expenseChart");
const categoryBreakdownEl = document.getElementById("category-breakdown");
const chartTotalAmountEl = document.getElementById("chart-total-amount");


let editingExpenseId = null;
let expenseChart = null;

const expenses = [];


const formatCurrency = amount =>
  amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const getCurrentMonthTotal = arr => {
  const now = new Date();
  return arr.reduce((sum, e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear()
      ? sum + e.amount
      : sum;
  }, 0);
};


function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
  const stored = localStorage.getItem("expenses");
  if (stored) {
    expenses.push(...JSON.parse(stored));
  } else {
    expenses.push(
      { id: 1, title: "Groceries", amount: 150, category: "Food", date: "2024-05-10" },
      { id: 2, title: "Electricity Bill", amount: 75.5, category: "Utilities", date: "2024-05-05" }
    );
    saveExpenses();
  }
}


function renderExpenses(arr) {
  if (!arr.length) {
    transactionList.innerHTML = `<p class="empty-state">No transactions found.</p>`;
    return;
  }

  transactionList.innerHTML = "";

  arr.forEach(({ id, title, amount, category, date }) => {
    const item = document.createElement("div");
    item.className = "transaction-item";

    item.innerHTML = `
      <div>
        <strong>${title}</strong>
        <small>${category}</small>
      </div>
      <div class="transaction-actions">
        ${formatCurrency(amount)}
        <small>${date}</small>
        <button class="edit-btn" data-id="${id}">Edit</button>
        <button class="delete-btn" data-id="${id}">Delete</button>
      </div>
    `;

    transactionList.appendChild(item);
  });
}

function updateSummary(arr) {
  const total = arr.reduce((sum, e) => sum + e.amount, 0);

  totalExpensesEl.textContent = formatCurrency(total);
  monthExpensesEl.textContent = formatCurrency(getCurrentMonthTotal(arr));
  transactionCountEl.textContent = arr.length;

  if (!arr.length) {
    topCategoryEl.textContent = "—";
    return;
  }

  const categoryTotals = arr.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  topCategoryEl.textContent = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function renderChart(arr) {
  if (expenseChart) expenseChart.destroy();
  if (!arr.length) return;

  const totals = arr.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const labels = Object.keys(totals);
  const data = Object.values(totals);
  const grandTotal = data.reduce((a, b) => a + b, 0);

  expenseChart = new Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#0f766e",
          "#14b8a6",
          "#22c55e",
          "#f59e0b",
          "#ef4444"
        ]
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  categoryBreakdownEl.innerHTML = "";
  labels.forEach((label, i) => {
    const percent = ((data[i] / grandTotal) * 100).toFixed(1);
    categoryBreakdownEl.innerHTML += `
      <span>
        <span>${label}</span>
        <span>${formatCurrency(data[i])} (${percent}%)</span>
      </span>
    `;
  });

  chartTotalAmountEl.textContent = formatCurrency(grandTotal);
}


function applyFilters() {
  let filtered = [...expenses];

  const q = searchInput.value.toLowerCase();
  if (q) {
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }

  if (dateFilter.value) {
    filtered = filtered.filter(e => e.date === dateFilter.value);
  }

  if (categoryFilter.value !== "all") {
    filtered = filtered.filter(e => e.category === categoryFilter.value);
  }

  if (amountSort.value) {
    filtered.sort((a, b) =>
      amountSort.value === "asc" ? a.amount - b.amount : b.amount - a.amount
    );
  }

  refreshUI(filtered);
}


searchInput.oninput =
dateFilter.onchange =
categoryFilter.onchange =
amountSort.onchange = applyFilters;

addExpenseBtn.onclick = () => expenseModal.classList.remove("hidden");
closeModalBtn.onclick = cancelBtn.onclick =
  () => expenseModal.classList.add("hidden");

transactionList.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains("edit-btn")) {
    const exp = expenses.find(x => x.id === id);
    if (!exp) return;

    editingExpenseId = id;
    descriptionInput.value = exp.title;
    amountInput.value = exp.amount;
    categoryInput.value = exp.category;
    dateInput.value = exp.date;
    expenseModal.classList.remove("hidden");
  }

  if (e.target.classList.contains("delete-btn")) {
    const i = expenses.findIndex(x => x.id === id);
    if (i !== -1) {
      expenses.splice(i, 1);
      saveExpenses();
      applyFilters();
    }
  }
});

expenseForm.addEventListener("submit", e => {
  e.preventDefault();

  const expenseData = {
    id: editingExpenseId ?? Date.now(),
    title: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value
  };

  if (editingExpenseId) {
    const i = expenses.findIndex(e => e.id === editingExpenseId);
    expenses[i] = expenseData;
    editingExpenseId = null;
  } else {
    expenses.push(expenseData);
  }

  saveExpenses();
  expenseForm.reset();
  expenseModal.classList.add("hidden");
  applyFilters();
});

function refreshUI(arr) {
  renderExpenses(arr);
  updateSummary(arr);
  renderChart(arr);
}

loadExpenses();
applyFilters();
