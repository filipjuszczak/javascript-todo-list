'use strict';

const $body = document.querySelector('body');
const $wrapper = document.querySelector('.wrapper');

const $todoForm = document.querySelector('.form');
const $todoTitleInput = document.querySelector('.form__input');
const $todosWrapper = document.querySelector('.todos__wrapper');

const $modal = document.querySelector('.modal');
const $editForm = document.querySelector('.modal__form');
const $editFormTitleInput = document.querySelector('.modal__form-input');
const $editFormError = document.querySelector('.modal__error');
const $editFormSubmitBtn = document.querySelector('.modal__form-submit');
const $editFormCancelBtn = document.querySelector('.modal__form-cancel');

const $darkModeBtn = document.querySelector('.fa-adjust');

const toggleDarkMode = function () {
  $darkModeBtn.classList.toggle('spin');
  $darkModeBtn.classList.add('start');
  $body.classList.toggle('dark-mode');
};

$darkModeBtn.addEventListener('click', toggleDarkMode);

const showModal = function () {
  $modal.classList.add('active');
};

const hideModal = function () {
  $modal.classList.remove('active');
};

const showErrorMessage = function (error) {
  $editFormError.textContent = error;
  $editFormError.classList.add('active');
};

const hideErrorMessage = function () {
  $editFormError.textContent = '';
  $editFormError.classList.remove('active');
};

const clearInputs = function () {
  $todoTitleInput.value = '';
  $editFormTitleInput.value = '';
};

const editToDo = function (toDoTitle) {
  showModal();

  const handleEdit = function (e) {
    e.preventDefault();

    const newTitle = $editFormTitleInput.value;

    if (newTitle.length === 0) {
      return showErrorMessage('Title cannot be empty!');
    }

    const editedToDoIdx = todos.findIndex((todo) => todo.title === newTitle);

    if (editedToDoIdx !== -1) {
      return showErrorMessage('Title already exists!');
    }

    const toDoIdx = todos.findIndex((todo) => todo.title === toDoTitle);
    todos[toDoIdx].title = newTitle;

    saveToDos();
    refreshToDos();
    hideModal();
    clearInputs();

    $editFormSubmitBtn.removeEventListener('click', handleEdit);
  };

  const handleCancel = function (e) {
    e.preventDefault();
    hideModal();
    clearInputs();
    $editFormCancelBtn.removeEventListener('click', handleCancel);
  };

  $editFormSubmitBtn.addEventListener('click', handleEdit);
  $editFormCancelBtn.addEventListener('click', handleCancel);
};

const deleteToDo = function (toDoTitle) {
  const toDoIdx = todos.findIndex((todo) => todo.title === toDoTitle);
  todos.splice(toDoIdx, 1);

  saveToDos();
  refreshToDos();
};

const createToDoMarkup = function (toDoTitle) {
  return `
    <div class="todos__todo">
      <h3 class="todos__todo-title">${toDoTitle}</h3>
      <span class="todos__todo-delete">
        <i class="far fa-edit" data-title="${toDoTitle}" onclick="editToDo(this.dataset.title)"></i>
        <i class="fas fa-times" data-title="${toDoTitle}" onclick="deleteToDo(this.dataset.title)"></i>
      </span>
    </div>
  `;
};

const saveToDos = function () {
  const todosJSON = JSON.stringify(todos);
  localStorage.setItem('todos', todosJSON);
};

const loadToDos = function () {
  return JSON.parse(localStorage.getItem('todos'));
};

const refreshToDos = function () {
  $todosWrapper.innerHTML = '';

  todos.forEach((todo) => {
    renderToDo(todo.title);
  });
};

const restoreToDos = function () {
  todos.forEach((todo) => {
    renderToDo(todo.title);
  });
};

const renderToDo = function (toDoTitle) {
  const toDoMarkup = createToDoMarkup(toDoTitle);
  $todosWrapper.insertAdjacentHTML('beforeend', toDoMarkup);
};

let todos = loadToDos() || [];
todos && restoreToDos();

$todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const toDoExists = todos.find((todo) => todo.title === $todoTitleInput.value);

  if (toDoExists) {
    return alert('To do with that tile already exists!');
  }

  renderToDo($todoTitleInput.value);

  const newToDo = { title: $todoTitleInput.value };
  todos.push(newToDo);

  saveToDos();
  clearInputs();
});
