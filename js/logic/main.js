// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Manejo de enlaces del menú
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            document.querySelectorAll('.list-unstyled li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Agregar clase active al item seleccionado
            this.parentElement.classList.add('active');
            
            // Cargar la página en el iframe
            const page = this.getAttribute('data-page');
            document.getElementById('contentFrame').src = page;
            
            // En móviles, cerrar el sidebar después de seleccionar una opción
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.add('active');
            }
        });
    });

    // Manejar resize de la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.add('active');
        }
    });

    // Prevenir que los enlaces del menú naveguen fuera del iframe
    document.querySelectorAll('#sidebar a:not([data-page])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.hasAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
});