'use strict';

const form = document.querySelector('.form');
const inputName = document.querySelector('.input-name');
const inputDate = document.querySelector('.input-date');
const inputValue = document.querySelector('.input-value');
const btnAdd = document.querySelector('.btn-add');
const expensesContainer = document.querySelector('.expenses');
const overlay = document.querySelector('.overlay');
const btnSortValue = document.querySelector('.btn-sort-value');
const btnSortDate = document.querySelector('.btn-sort-date');

const expensesArr = [];
let sortedByValue = false;
let sortedByDate = false;

class Expense {
  id = (Date.now() + '').slice(-10);
  constructor(name, date, value) {
    this.name = name;
    this.date = date;
    this.value = value;
  }
}

inputName.focus();

const sortByValue = function (arr) {
  return arr.slice().sort((a, b) => a.value - b.value);
};

const sortByDate = function (arr) {
  return arr.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
};

const formatDate = function (date) {
  const daysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24);

  const now = new Date();

  const days = daysPassed(now, date);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <= 7) return `${days} days ago`;

  return new Intl.DateTimeFormat(navigator.language).format(new Date(date));
};

const formatCurrency = function (value) {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const hideOptions = function () {
  overlay.classList.add('hidden');
  document
    .querySelectorAll('.expense-options')
    .forEach(options => options.remove());
};

const addExpense = function (expenses, sortValue = false, sortDate = false) {
  expensesContainer.innerHTML = '';
  let exps;

  if (sortValue) exps = sortByValue(expenses);
  else if (sortDate) exps = sortByDate(expenses);
  else exps = expenses;

  exps.forEach(function (exp) {
    const html = `
      <li class="expense" data-id="${exp.id}">
        <span class="expense-name${exp.className ? ' ' + exp.className : ''}">${
      exp.name
    }</span>
        <span class="expense-date">${formatDate(exp.date)}</span>
        <span class="expense-value">${formatCurrency(exp.value)}</span>
        <button class="btn btn-remove">Remove</button>
      </li>
      `;

    expensesContainer.insertAdjacentHTML('afterbegin', html);
  });
  if (document.documentElement.clientWidth <= 960)
    expensesContainer.style.boxShadow = '0 1.6rem 3.2rem rgba(0, 0, 0, 0.1)';
};

btnAdd.addEventListener('click', function (e) {
  e.preventDefault();

  const expenseName = inputName.value;
  const expenseDate = inputDate.value;
  const expenseValue = inputValue.value;
  if (!expenseName || !expenseDate || !expenseValue) return;

  const expense = new Expense(expenseName, expenseDate, +expenseValue);

  expensesArr.push(expense);
  addExpense(expensesArr);

  inputValue.value = inputDate.value = inputName.value = '';
});

expensesContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn-remove')) return;

  const { id } = e.target.closest('.expense').dataset;
  const index = expensesArr.findIndex(exp => exp.id === id);
  expensesArr.splice(index, 1);
  e.target.closest('.expense').remove();

  if (
    expensesContainer.querySelectorAll('.expense').length === 0 &&
    document.documentElement.clientWidth <= 960
  ) {
    expensesContainer.style.boxShadow = 'none';
  }
});

expensesContainer.addEventListener('click', function (e) {
  if (
    !e.target.classList.contains('expense-name') ||
    e.target.closest('.option')
  )
    return;

  let html = '<ul class="expense-options">';

  if (e.target.classList.contains('expense-name-green')) {
    html += ` <li class="option">
                <span class="expense-name">${e.target.textContent}</span>
                <p class="option-text">Regular</p>
              </li>`;
  } else
    html += `<li class="option" data-color="green">
                    <span class="expense-name expense-name-green">${e.target.textContent}</span>
                    <p class="option-text">Important</p>
                  </li>`;

  if (e.target.classList.contains('expense-name-yellow')) {
    html += ` <li class="option">
                <span class="expense-name">${e.target.textContent}</span>
                <p class="option-text">Regular</p>
              </li>`;
  } else
    html += `<li class="option" data-color="yellow">
                    <span class="expense-name expense-name-yellow">${e.target.textContent}</span>
                    <p class="option-text">Could've saved up</p>
                  </li>`;

  if (e.target.classList.contains('expense-name-red')) {
    html += ` <li class="option">
                <span class="expense-name">${e.target.textContent}</span>
                <p class="option-text">Regular</p>
              </li>`;
  } else
    html += `<li class="option" data-color="red">
                    <span class="expense-name expense-name-red">${e.target.textContent}</span>
                    <p class="option-text">A waste of money</p>
                  </li>`;

  html += '</ul>';

  overlay.classList.remove('hidden');
  e.target.insertAdjacentHTML('afterbegin', html);
});

expensesContainer.addEventListener('click', function (e) {
  const option = e.target.closest('.option');
  if (!option) return;

  const expenseName = option.closest('.expense-name');
  const { color } = option.dataset;

  expenseName.classList.remove(
    'expense-name-green',
    'expense-name-yellow',
    'expense-name-red'
  );

  const expenseObj = expensesArr.find(
    exp => exp.id === expenseName.closest('.expense').dataset.id
  );
  if (color) {
    expenseObj.className = `expense-name-${color}`;
    expenseName.classList.add(`expense-name-${color}`);
  } else {
    expenseObj.className = undefined;
  }

  hideOptions();
});

overlay.addEventListener('click', hideOptions);

btnSortValue.addEventListener('click', function () {
  sortedByDate = false;
  addExpense(expensesArr, !sortedByValue, sortedByDate);
  sortedByValue = !sortedByValue;
});

btnSortDate.addEventListener('click', function () {
  sortedByValue = false;
  addExpense(expensesArr, sortedByValue, !sortedByDate);
  sortedByDate = !sortedByDate;
});

if (
  expensesContainer.querySelectorAll('.expense').length === 0 &&
  document.documentElement.clientWidth <= 960
) {
  expensesContainer.style.boxShadow = 'none';
}
