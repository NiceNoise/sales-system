// script.js
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let sellers = [];
let sellerToDelete = null;

// Formatear fecha a dd/mm/yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Cargar datos del localStorage
function loadSellers() {
    const storedSellers = localStorage.getItem('sellers');
    sellers = storedSellers ? JSON.parse(storedSellers) : [];
    displaySellers();
}

// Guardar en localStorage
function saveSellers() {
    localStorage.setItem('sellers', JSON.stringify(sellers));
}

// Mostrar sellers con paginación
function displaySellers() {
    const tableBody = document.getElementById('sellerTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedSellers = sellers.slice(startIndex, endIndex);

    paginatedSellers.forEach(seller => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${seller.idSeller}</td>
            <td>${seller.name}</td>
            <td>${seller.email}</td>
            <td>${seller.phone}</td>
            <td>${formatDate(seller.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editSeller(${seller.idSeller})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${seller.idSeller})">
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
    const totalPages = Math.ceil(sellers.length / ITEMS_PER_PAGE);
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
    if (page < 1 || page > Math.ceil(sellers.length / ITEMS_PER_PAGE)) return;
    currentPage = page;
    displaySellers();
}

// Limpiar formulario
function clearForm() {
    document.getElementById('sellerForm').reset();
    document.getElementById('sellerId').value = '';
    document.getElementById('saveBtn').textContent = ' Guardar';
}

// Editar seller
function editSeller(id) {
    const seller = sellers.find(c => c.idSeller === id);
    if (seller) {
        document.getElementById('sellerId').value = seller.idSeller;
        document.getElementById('name').value = seller.name;
        document.getElementById('email').value = seller.email;
        document.getElementById('phone').value = seller.phone;
        document.getElementById('saveBtn').textContent = ' Actualizar';
    }
}

// Mostrar modal de eliminación
function showDeleteModal(id) {
    sellerToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSellers();

    // Form submit
    document.getElementById('sellerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const sellerId = document.getElementById('sellerId').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (sellerId) {
            // Actualizar
            const index = sellers.findIndex(c => c.idSeller === parseInt(sellerId));
            if (index !== -1) {
                sellers[index].name = name;
                sellers[index].email = email;
                sellers[index].phone = phone;
            }
        } else {
            // Nuevo seller
            const seller = new Seller(name, email, phone);
            sellers.push(seller);
        }

        saveSellers();
        displaySellers();
        clearForm();
    });

    // Cancelar
    document.getElementById('cancelBtn').addEventListener('click', clearForm);

    // Confirmar eliminación
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (sellerToDelete) {
            sellers = sellers.filter(c => c.idSeller !== sellerToDelete);
            saveSellers();
            displaySellers();
            sellerToDelete = null;
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        }
    });
});