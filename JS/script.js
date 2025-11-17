// =====================================================
// DEFAULT PRODUCT DATA
// =====================================================
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kopi Cappuccino", price: 30000, stock: 50 },
  { id: 2, name: "Hazelnut Latte", price: 25000, stock: 30 },
  { id: 3, name: "Brown Sugar Milk Tea", price: 28000, stock: 20 }
];

function ensureProducts() {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
  }
}

// =====================================================
// LOGIN SYSTEM
// =====================================================
function isLoggedIn() {
  return sessionStorage.getItem("login") === "true";
}

function protectPage() {
  const page = location.pathname.split("/").pop();
  if ((page === "dashboard.html" || page === "products.html") && !isLoggedIn()) {
    location.href = "index.html";
  }
}

function loginInit() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    const allowedEmail = "najwagiar@gmail.com";
    const allowedPassword = "24090082";

    if (!email || !pass) {
      return alert("Email & Password wajib diisi!");
    }

    if (email !== allowedEmail) {
      return alert("Email tidak terdaftar! Akses ditolak.");
    }

    if (pass !== allowedPassword) {
      return alert("Password salah!");
    }

    sessionStorage.setItem("login", "true");
    location.href = "dashboard.html";
  });
}

// =====================================================
// DASHBOARD
// =====================================================
function dashboardInit() {
  const totalProducts = document.getElementById("totalProducts");
  if (!totalProducts) return;

  ensureProducts();
  const list = JSON.parse(localStorage.getItem("products"));

  totalProducts.textContent = list.length;
}

// =====================================================
// PRODUCT TABLE RENDER
// =====================================================
function renderProducts() {
  const table = document.querySelector("#productsTable tbody");
  if (!table) return;

  ensureProducts();
  const list = JSON.parse(localStorage.getItem("products"));

  table.innerHTML = "";

  list.forEach((p, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick='openEditModal(${JSON.stringify(p)})'>
            <i class="fa-solid fa-pen"></i>
          </button>
          <button onclick="deleteProduct(${p.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// =====================================================
// DELETE PRODUCT
// =====================================================
function deleteProduct(id) {
  let list = JSON.parse(localStorage.getItem("products"));
  list = list.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(list));
  renderProducts();
}

// =====================================================
// EDIT PRODUCT MODAL
// =====================================================
let editID = null;

function openEditModal(product) {
  editID = product.id;

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editStock").value = product.stock;

  document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
  let list = JSON.parse(localStorage.getItem("products"));

  const name = document.getElementById("editName").value.trim();
  const price = parseInt(document.getElementById("editPrice").value);
  const stock = parseInt(document.getElementById("editStock").value);

  list = list.map(p => {
    if (p.id === editID) {
      return { ...p, name, price, stock };
    }
    return p;
  });

  localStorage.setItem("products", JSON.stringify(list));

  closeModal();
  renderProducts();
}

// =====================================================
// LOGOUT + VIEW PRODUCT BUTTON
// =====================================================
function logoutInit() {
  document.querySelectorAll("#logoutBtn, #logoutBtnProducts").forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        sessionStorage.clear();
        location.href = "index.html";
      });
    }
  });
}

function viewProductsInit() {
  const viewBtn = document.getElementById("viewProductsBtn");
  if (viewBtn) {
    viewBtn.addEventListener("click", () => {
      window.location.href = "products.html";
    });
  }
}

// =====================================================
// INITIALIZE APPLICATION
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  loginInit();
  dashboardInit();
  renderProducts();
  logoutInit();
  viewProductsInit();
});

// =====================================================
// EVENT LISTENERS
// =====================================================
document.getElementById("saveEdit")?.addEventListener("click", saveEdit);
document.getElementById("closeModal")?.addEventListener("click", closeModal);

// ADD PRODUCT
// ================================
// DOM READY
// ================================
document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  dashboardInit();
  renderProducts();
  addProductInit();
  viewProductsInit();
  logoutInit();
});

function addProductInit() {
  const addBtn = document.getElementById("addProductBtn");
  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    const name = document.getElementById("newName").value;
    const price = document.getElementById("newPrice").value;
    const stock = document.getElementById("newStock").value;

    if (!name || !price || !stock) {
      alert("Semua field harus diisi!");
      return;
    }

    addProduct(name, price, stock);

    // kosongkan input
    document.getElementById("newName").value = "";
    document.getElementById("newPrice").value = "";
    document.getElementById("newStock").value = "";

    // sembunyikan form setelah tambah produk
    document.getElementById("addProductCard").style.display = "none";
  });
}

function toggleAddProductForm() {
  const form = document.getElementById("addProductCard");

  if (form.style.display === "block") {
    form.style.display = "none";
  } else {
    form.style.display = "block";
  }
}

document.getElementById("showAddForm")?.addEventListener("click", toggleAddProductForm);

// ================================
// POPUP TAMBAH PRODUCT
// ================================

// BUKA POPUP
document.getElementById("openAddForm")?.addEventListener("click", () => {
  document.getElementById("addForm").style.display = "flex";
});

// TUTUP POPUP
document.getElementById("closeForm")?.addEventListener("click", () => {
  document.getElementById("addForm").style.display = "none";
});

// ================================
// SIMPAN PRODUK BARU (DARI POPUP)
// ================================
document.getElementById("saveProduct")?.addEventListener("click", () => {
  
  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const stock = document.getElementById("newStock").value.trim();

  if (name === "" || price === "" || stock === "") {
    alert("Semua field harus diisi!");
    return;
  }

  // Ambil data lama
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const newProduct = {
    id: Date.now(),
    name,
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Produk berhasil ditambahkan!");

  // Reset input
  document.getElementById("newName").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newStock").value = "";

  // Tutup popup
  document.getElementById("addForm").style.display = "none";

  // Refresh tabel
  renderProducts();
});