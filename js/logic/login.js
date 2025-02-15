// script.js
function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Validación de credenciales
    if (username === 'Administrador' && password === 'Admin') {
        // Redirigir a la página principal
        window.location.href = 'main.html';
        return true;
    } else {
        // Mostrar mensaje de error
        errorMessage.classList.remove('d-none');
        
        // Limpiar campos
        document.getElementById('password').value = '';
        
        // Ocultar mensaje de error después de 3 segundos
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 3000);
        
        return false;
    }
}