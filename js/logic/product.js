// script.js
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let products = [];
let productToDelete = null;

// Cargar datos del localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    products = storedProducts ? JSON.parse(storedProducts) : [];
    displayProducts();
}

// Guardar en localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Mostrar products con paginación
function displayProducts() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.idProduct}</td>
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editProduct(${product.idProduct})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${product.idProduct})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination();
}

// Actualizar paginación
function updatePagination() {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Botón Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);

    // Páginas numeradas
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }

    // Botón Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Siguiente</a>`;
    pagination.appendChild(nextLi);
}

// Cambiar página
function changePage(page) {
    if (page < 1 || page > Math.ceil(products.length / ITEMS_PER_PAGE)) return;
    currentPage = page;
    displayProducts();
}

// Limpiar formulario
function clearForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('saveBtn').textContent = ' Guardar';
}

// Editar product
function editProduct(id) {
    const product = products.find(c => c.idProduct === id);
    console.log(product);
    if (product) {
        document.getElementById('productId').value = product.idProduct;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price.toFixed(2);
        document.getElementById('stock').value = product.stock;
        document.getElementById('saveBtn').textContent = ' Actualizar';
    }
}

// Mostrar modal de eliminación
function showDeleteModal(id) {
    productToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Form submit
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;
     
        if (productId) {
            // Actualizar
            const index = products.findIndex(c => c.idProduct === parseInt(productId));
            if (index !== -1) {
                products[index].name = name;
                products[index].price = price;
                products[index].stock = stock;
            }
        } else {
            // Nuevo product
            const product = new Product(name, price, stock);
            products.push(product);
        }

        saveProducts();
        displayProducts();
        clearForm();
    });

    // Cancelar
    document.getElementById('cancelBtn').addEventListener('click', clearForm);

    // Confirmar eliminación
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (productToDelete) {
            products = products.filter(c => c.idProduct !== productToDelete);
            saveProducts();
            displayProducts();
            productToDelete = null;
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        }
    });
});