// Funcionalidad para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Funcionalidad para el carrito de compras
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Actualizar contador del carrito
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        });
    }

    // Añadir al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const product = {
                id: Date.now().toString(),
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.product-price').textContent.replace('Q', '')),
                quantity: 1
            };

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.findIndex(item => item.name === product.name);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            // Guardar en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Mostrar mensaje de confirmación
            alert('¡Producto añadido al carrito!');
        });
    });

    // Inicializar contador del carrito
    updateCartCount();

    // Funcionalidad para la página de ordenar
    if (window.location.pathname.includes('ordenar.html')) {
        displayCartItems();
    }

    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
            totalElement.textContent = 'Q0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'summary-item';
            cartItem.innerHTML = `
                <div class="summary-item-name">
                    <span class="summary-item-quantity">${item.quantity}</span>
                    ${item.name}
                </div>
                <div class="summary-item-actions">
                    <div class="summary-item-price">Q${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Añadir event listeners a los botones de eliminar
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeCartItem(index);
            });
        });
        
        totalElement.textContent = `Q${total.toFixed(2)}`;
    }
    
    // Función para eliminar un producto del carrito
    function removeCartItem(index) {
        // Eliminar el producto del array del carrito
        cart.splice(index, 1);
        
        // Actualizar localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar la visualización del carrito
        updateCartCount();
        displayCartItems();
    }

    // Funcionalidad para el formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Te responderemos pronto.');
            contactForm.reset();
        });
    }

    // Funcionalidad para el formulario de pedido
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        // Añadir funcionalidad de selección a las opciones de pago
        const paymentOptions = document.querySelectorAll('.payment-option');
        let selectedPaymentMethod = null;
        
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Eliminar la clase 'selected' de todas las opciones
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Añadir la clase 'selected' a la opción clickeada
                this.classList.add('selected');
                
                // Guardar el método de pago seleccionado
                selectedPaymentMethod = this.querySelector('p').textContent;
                
                // Efecto de animación adicional
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            });
        });
        
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar si se ha seleccionado un método de pago
            if (!selectedPaymentMethod) {
                alert('Por favor, selecciona un método de pago antes de completar tu pedido.');
                return;
            }
            
            alert(`¡Gracias por tu pedido! Has seleccionado pagar con ${selectedPaymentMethod}. Recibirás una confirmación por correo electrónico.`);
            // Limpiar carrito después de enviar el pedido
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
});