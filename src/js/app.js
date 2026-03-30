// переменная чтоб хранить текущую всплывашку
let currentPopover = null;

const popoverBtn = document.getElementById("popover-btn");

popoverBtn.addEventListener("click", () => {
  if (currentPopover) {
    currentPopover.remove();
    currentPopover = null;
    return;
  }

  // собираем верстку всплывашки
  const box = document.createElement("div");
  box.className = "popover-box";

  const header = document.createElement("h3");
  header.className = "popover-header";
  header.textContent = "Popover title";

  const body = document.createElement("div");
  body.className = "popover-body";
  body.textContent =
    "And here's some amazing content. It's very engaging. Right?";

  const arrow = document.createElement("div");
  arrow.className = "popover-arrow";

  box.appendChild(arrow);
  box.appendChild(header);
  box.appendChild(body);
  document.body.appendChild(box);

  // вычисляем где рисовать
  const coords = popoverBtn.getBoundingClientRect();

  const top = coords.top - box.offsetHeight - 11;
  const left = coords.left + coords.width / 2 - box.offsetWidth / 2;

  box.style.top = top + window.scrollY + "px";
  box.style.left = left + window.scrollX + "px";

  currentPopover = box;
});

// массив с данными товаров
let products = [
  { id: 1, name: "iPhone XR", price: 60000 },
  { id: 2, name: "Samsung Galaxy S10+", price: 80000 },
  { id: 3, name: "Huawei View", price: 50000 },
];

let editId = null;
let delId = null;

const tableBody = document.getElementById("table-body");
const formModal = document.getElementById("form-modal");
const delModal = document.getElementById("delete-modal");
const inputName = document.getElementById("input-name");
const inputPrice = document.getElementById("input-price");
const errName = document.getElementById("error-name");
const errPrice = document.getElementById("error-price");

// рендер таблицы
function render() {
  tableBody.innerHTML = "";
  products.forEach((item) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = item.name;

    const tdPrice = document.createElement("td");

    // форматируем цену с пробелами
    const formattedPrice = item.price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    tdPrice.textContent = formattedPrice;

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn";
    editBtn.textContent = "✎";
    editBtn.onclick = () => openModal(item.id);

    const delBtn = document.createElement("button");
    delBtn.className = "action-btn";
    delBtn.textContent = "✕";
    delBtn.onclick = () => openDelete(item.id);

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdActions);
    tableBody.appendChild(tr);
  });
}

// очистка формы
function clear() {
  inputName.value = "";
  inputPrice.value = "";
  errName.style.display = "none";
  errPrice.style.display = "none";
}

function openModal(id = null) {
  clear();
  editId = id;

  if (id) {
    const item = products.find((p) => p.id === id);
    inputName.value = item.name;
    inputPrice.value = item.price;
  }

  formModal.classList.remove("hidden");
}

function openDelete(id) {
  delId = id;
  delModal.classList.remove("hidden");
}

document.getElementById("add-btn").onclick = () => openModal();

document.getElementById("cancel-btn").onclick = () => {
  formModal.classList.add("hidden");
};

document.getElementById("save-btn").onclick = () => {
  const name = inputName.value.trim();
  const price = Number(inputPrice.value);
  let errors = false;

  if (!name) {
    errName.textContent = "введите название";
    errName.style.display = "block";
    errors = true;
  } else {
    errName.style.display = "none";
  }

  if (!price || price <= 0) {
    errPrice.textContent = "введите стоимость больше нуля";
    errPrice.style.display = "block";
    errors = true;
  } else {
    errPrice.style.display = "none";
  }

  if (errors) return;

  if (editId) {
    const item = products.find((p) => p.id === editId);
    item.name = name;
    item.price = price;
  } else {
    products.push({
      id: Date.now(),
      name,
      price,
    });
  }

  formModal.classList.add("hidden");
  render();
};

document.getElementById("confirm-delete").onclick = () => {
  products = products.filter((p) => p.id !== delId);
  delModal.classList.add("hidden");
  render();
};

document.getElementById("cancel-delete").onclick = () => {
  delModal.classList.add("hidden");
};

render();
