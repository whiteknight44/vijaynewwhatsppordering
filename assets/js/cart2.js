// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to body
    document.body.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 2000
    });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        document.body.removeChild(toast);
    });
}

// Function to add item to cart
function addToCart(itemName, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${itemName} quantity updated to ${existingItem.quantity}`);
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
        showToast(`${itemName} added to cart`);
    }
    
    saveCart();
    updateCart();
}

// Function to remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    saveCart();
    updateCart();
}

// Function to update item quantity
function updateQuantity(itemName, newQuantity) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        }
    }
    saveCart();
    updateCart();
}

// Function to calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to generate random order number
function generateOrderNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // Generate 3 random letters
    for (let i = 0; i < 1; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 5 random numbers
    for (let i = 0; i < 4; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
}

// Function to update cart display
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="text-center">Your cart is empty</p>';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            let html = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            cart.forEach(item => {
                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>₹${item.price}</td>
                        <td>
                            <div class="input-group" style="width: 120px;">
                                <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                                <input type="number" class="form-control text-center" value="${item.quantity}" 
                                       onchange="updateQuantity('${item.name}', this.value)" min="1">
                                <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                            </div>
                        </td>
                        <td>₹${item.price * item.quantity}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.name}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                        <td colspan="2"><strong>₹${calculateTotal()}</strong></td>
                    </tr>
                </tfoot>
            </table>`;
            
            cartItemsDiv.innerHTML = html;
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
}

// Function to handle checkout
function handleCheckout() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    if (!name || !phone || !address) {
        showToast('Please fill in all customer details');
        return;
    }

    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }

    const orderNumber = generateOrderNumber();
    const phoneNumber = '7051189082';
    
    let message = `*New Order #${orderNumber}*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `*Order Items:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n*Total Amount: ₹${calculateTotal()}*\n\n`;
    message += `Thank you for your order!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart and form after successful order
    cart = [];
    saveCart();
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    updateCart();
    showToast('Order sent successfully!');
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
}); 