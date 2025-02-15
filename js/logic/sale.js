// Variables globales
let customers = [];
let sellers = [];
let products = [];
let sales = [];
let productsSold = [];
let ventaActual = null;

// Elementos del DOM
const customerSelect = document.getElementById('customerSelect');
const sellerSelect = document.getElementById('sellerSelect');
const btnAcceptSale = document.getElementById('btnAcceptSale');
const productSelect = document.getElementById('productSelect');
const quantityInput = document.getElementById('quantity');
const unitPriceInput = document.getElementById('unitPrice');
const btnAddProduct = document.getElementById('btnAddProduct');
const cartTableBody = document.getElementById('cartTableBody');
const totalAmountInput = document.getElementById('totalAmount');
const btnSell = document.getElementById('btnSell');
const btnCancel = document.getElementById('btnCancel');

// Modal elements
const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

// Función para mostrar mensaje modal
function showModal(title, message, showConfirmButton = false, confirmCallback = null) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    if (showConfirmButton) {
        modalConfirmBtn.style.display = 'block';
        modalConfirmBtn.onclick = confirmCallback;
    } else {
        modalConfirmBtn.style.display = 'none';
    }
    
    messageModal.show();
}

// Cargar datos del localStorage
function loadData() {
    if (localStorage.getItem('customers')) {
        customers = JSON.parse(localStorage.getItem('customers'));
    }
    if (localStorage.getItem('sellers')) {
        sellers = JSON.parse(localStorage.getItem('sellers'));
    }
    if (localStorage.getItem('products')) {
        products = JSON.parse(localStorage.getItem('products'));
    }
    if (localStorage.getItem('sales')) {
        sales = JSON.parse(localStorage.getItem('sales'));
    }
    if (localStorage.getItem('productsSold')) {
        productsSold = JSON.parse(localStorage.getItem('productsSold'));
    }
}

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('productsSold', JSON.stringify(productsSold));
}

// Llenar combos con datos
function populateSelects() {

    // Limpiar opciones existentes excepto la primera
    while (customerSelect.options.length > 1) {
        customerSelect.remove(1);
    }

    // Llenar combo de clientes
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.idCustomer;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    // Limpiar opciones existentes excepto la primera
    while (sellerSelect.options.length > 1) {
        sellerSelect.remove(1);
    }

    // Llenar combo de vendedores
    sellers.forEach(seller => {
        const option = document.createElement('option');
        option.value = seller.idSeller;
        option.textContent = seller.name;
        sellerSelect.appendChild(option);
    });
}

// Llenar combo de productos
function populateProductSelect() {
    // Limpiar opciones existentes excepto la primera
    while (productSelect.options.length > 1) {
        productSelect.remove(1);
    }
    
    // Llenar combo de productos
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.idProduct;
        option.textContent = product.name;
        option.dataset.price = product.price;
        productSelect.appendChild(option);
    });
}

// Actualizar tabla del carrito
function updateCartTable() {
    // Limpiar tabla
    cartTableBody.innerHTML = '';
    
    // Filtrar productos vendidos para la venta actual
    const currentSaleProducts = productsSold.filter(product => product.idSale === ventaActual);
    
    // Llenar tabla con productos de la venta actual
    currentSaleProducts.forEach(soldProduct => {
        const product = products.find(p => p.idProduct == soldProduct.idProduct);
        
        const row = document.createElement('tr');
        
        // Columna Producto
        const productCell = document.createElement('td');
        productCell.textContent = product ? product.name : 'Producto no encontrado';
        row.appendChild(productCell);
        
        // Columna Cantidad
        const quantityCell = document.createElement('td');
        quantityCell.textContent = soldProduct.quantity;
        row.appendChild(quantityCell);
        
        // Columna Precio Unitario
        const priceCell = document.createElement('td');
        priceCell.textContent = `$${soldProduct.unitPrice.toFixed(2)}`;
        row.appendChild(priceCell);
        
        // Columna Importe Parcial
        const amountCell = document.createElement('td');
        amountCell.textContent = `$${soldProduct.partialAmount.toFixed(2)}`;
        row.appendChild(amountCell);
        
        // Columna Acción
        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove';
        removeButton.innerHTML = '<i class="fas fa-trash"></i>';
        removeButton.onclick = function() {
            // Encontrar índice del producto en el array
            const index = productsSold.findIndex(p => 
                p.idSale === soldProduct.idSale && p.idProduct === soldProduct.idProduct
            );
            
            // Remover del array si se encuentra
            if (index !== -1) {
                productsSold.splice(index, 1);
                updateCartTable();
                updateTotal();
            }
        };
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);
        
        cartTableBody.appendChild(row);
    });
    
    // Actualizar total
    updateTotal();
    
    // Habilitar o deshabilitar botón Vender
    btnSell.disabled = currentSaleProducts.length === 0;
}

// Actualizar total a pagar
function updateTotal() {
    const currentSaleProducts = productsSold.filter(product => product.idSale === ventaActual);
    const total = currentSaleProducts.reduce((sum, product) => sum + product.partialAmount, 0);
    totalAmountInput.value = `$${total.toFixed(2)}`;
}

// Evento: Aceptar venta (Sección 1)
btnAcceptSale.addEventListener('click', function() {
    const customerId = customerSelect.value;
    const sellerId = sellerSelect.value;
    
    if (!customerId || !sellerId) {
        showModal('Error', 'Seleccione Correctamente');
        return;
    }
    
    // Crear nueva venta
    const newSale = new Sale(customerId, sellerId);
    sales.push(newSale);
    ventaActual = newSale.idSale;
    
    // Deshabilitar selects de cliente y vendedor
    customerSelect.disabled = true;
    sellerSelect.disabled = true;
    btnAcceptSale.disabled = true;
    
    // Habilitar sección de productos
    productSelect.disabled = false;
    quantityInput.disabled = false;
    btnAddProduct.disabled = false;
    
    // Inicializar tabla del carrito
    updateCartTable();
});

// Evento: Cambio en selección de producto
productSelect.addEventListener('change', function() {
    if (this.value) {
        const selectedOption = this.options[this.selectedIndex];
        unitPriceInput.value = selectedOption.dataset.price;
    } else {
        unitPriceInput.value = '';
    }
});

// Evento: Agregar producto al carrito
btnAddProduct.addEventListener('click', function() {
    const productId = productSelect.value;
    const quantity = parseInt(quantityInput.value);
    const unitPrice = parseFloat(unitPriceInput.value);
    
    if (!productId || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
        showModal('Error', 'Por favor, complete todos los campos correctamente');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingProduct = productsSold.find(product => 
        product.idSale === ventaActual && product.idProduct == productId
    );
    
    if (existingProduct) {
        showModal('Aviso', 'El producto ya se encuentra en el carrito de compras, elminelo y vuelvalo ingresar si desea algún cambio.');
        return;
    }
    
    // Crear nuevo producto vendido
    const newProductSold = new ProductSold(ventaActual, productId, unitPrice, quantity);
    productsSold.push(newProductSold);
    
    // Actualizar tabla
    updateCartTable();
    
    // Limpiar campos
    productSelect.selectedIndex = 0;
    quantityInput.value = 1;
    unitPriceInput.value = '';
});

// Evento: Botón Vender
btnSell.addEventListener('click', function() {
    // Guardar en localStorage
    saveData();
    
    showModal('Éxito', 'Venta realizada con éxito', false, null);
    
    // Al cerrar el modal, refrescar la página
    modalCloseBtn.onclick = function() {
        messageModal.hide();
        location.reload();
    };
});

// Evento: Botón Cancelar
btnCancel.addEventListener('click', function() {
    showModal('Confirmar', '¿Está seguro que desea cancelar la venta?', true, function() {
        messageModal.hide();
        location.reload();
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    populateSelects();
    populateProductSelect();
});