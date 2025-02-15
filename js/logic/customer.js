// script.js
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let customers = [];
let customerToDelete = null;

// Formatear fecha a dd/mm/yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Cargar datos del localStorage
function loadCustomers() {
    const storedCustomers = localStorage.getItem('customers');
    customers = storedCustomers ? JSON.parse(storedCustomers) : [];
    displayCustomers();
}

// Guardar en localStorage
function saveCustomers() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Mostrar customers con paginación
function displayCustomers() {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    paginatedCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.idCustomer}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${formatDate(customer.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editCustomer(${customer.idCustomer})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${customer.idCustomer})">
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
    const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
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
    if (page < 1 || page > Math.ceil(customers.length / ITEMS_PER_PAGE)) return;
    currentPage = page;
    displayCustomers();
}

// Limpiar formulario
function clearForm() {
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    document.getElementById('saveBtn').textContent = ' Guardar';
}

// Editar customer
function editCustomer(id) {
    const customer = customers.find(c => c.idCustomer === id);
    if (customer) {
        document.getElementById('customerId').value = customer.idCustomer;
        document.getElementById('name').value = customer.name;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone;
        document.getElementById('saveBtn').textContent = ' Actualizar';
    }
}

// Mostrar modal de eliminación
function showDeleteModal(id) {
    customerToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();

    // Form submit
    document.getElementById('customerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        console.log(customers);
        const customerId = document.getElementById('customerId').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (customerId) {
            // Actualizar
            const index = customers.findIndex(c => c.idCustomer === parseInt(customerId));
            if (index !== -1) {
                customers[index].name = name;
                customers[index].email = email;
                customers[index].phone = phone;
            }
        } else {
            // Nuevo customer
            const customer = new Customer(name, email, phone);
            customers.push(customer);
        }

        saveCustomers();
        displayCustomers();
        clearForm();
    });

    // Cancelar
    document.getElementById('cancelBtn').addEventListener('click', clearForm);

    // Confirmar eliminación
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (customerToDelete) {
            customers = customers.filter(c => c.idCustomer !== customerToDelete);
            saveCustomers();
            displayCustomers();
            customerToDelete = null;
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        }
    });
});