const products = [
    { id: 1, name: "Wireless Mouse", category: "Electronics", price: 599, image: "mouse.jpg" },
    { id: 2, name: "Mechanical Keyboard", category: "Electronics", price: 1499, image: "keyboard.jpg" },
    { id: 3, name: "Cotton T-Shirt", category: "Fashion", price: 399, image: "tshirt.jpg" },
    { id: 4, name: "Denim Jacket", category: "Fashion", price: 1299, image: "jacket.jpg" },
    { id: 5, name: "Spiral Notebook", category: "Stationery", price: 120, image: "notebook.jpg" },
    { id: 6, name: "Gel Pen Set (Pack of 10)", category: "Stationery", price: 150, image: "pen.jpg" },
    { id: 7, name: "Bluetooth Earphones", category: "Electronics", price: 999, image: "earphone.jpg" },
    { id: 8, name: "Running Shoes", category: "Fashion", price: 1899, image: "shoes.jpg" }
];

let cart = [];
let appliedCoupon = null;

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayProducts(productList) {
    const productContainer = document.getElementById("product-list");
    removeAllChildren(productContainer);

    if (productList.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No products found.";
        productContainer.appendChild(p);
        return;
    }

    productList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        card.appendChild(img);

        const h3 = document.createElement("h3");
        h3.textContent = product.name;

        const tag = document.createElement("span");
        tag.className = "category-tag";
        tag.textContent = product.category;

        const priceP = document.createElement("p");
        priceP.className = "price";
        priceP.textContent = "₹" + product.price;

        const btn = document.createElement("button");
        btn.className = "add-btn";
        btn.textContent = "Add to Cart";
        btn.addEventListener("click", () => addToCart(product.id));

        card.appendChild(h3);
        card.appendChild(tag);
        card.appendChild(priceP);
        card.appendChild(btn);

        productContainer.appendChild(card);
    });
}

function filterAndSortProducts() {
    const searchText = document.getElementById("search-input").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value;
    const sortBy = document.getElementById("sort-select").value;

    let filtered = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (sortBy === "low-to-high") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayProducts(filtered);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");

    removeAllChildren(cartContainer);

    let totalItems = 0;
    let subtotal = 0;

    if (cart.length === 0) {
        const emptyP = document.createElement("p");
        emptyP.className = "empty-msg";
        emptyP.textContent = "Your cart is empty.";
        cartContainer.appendChild(emptyP);
    } else {
        cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;

            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";

            const infoDiv = document.createElement("div");
            infoDiv.className = "cart-item-info";

            const h4 = document.createElement("h4");
            h4.textContent = item.name;

            const descP = document.createElement("p");
            descP.textContent = `₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}`;

            infoDiv.appendChild(h4);
            infoDiv.appendChild(descP);

            const qtyDiv = document.createElement("div");
            qtyDiv.className = "qty-controls";

            const minusBtn = document.createElement("button");
            minusBtn.className = "qty-btn";
            minusBtn.textContent = "-";
            minusBtn.addEventListener("click", () => changeQuantity(item.id, -1));

            const spanQty = document.createElement("span");
            spanQty.textContent = item.quantity;

            const plusBtn = document.createElement("button");
            plusBtn.className = "qty-btn";
            plusBtn.textContent = "+";
            plusBtn.addEventListener("click", () => changeQuantity(item.id, 1));

            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "X";
            removeBtn.addEventListener("click", () => removeFromCart(item.id));

            qtyDiv.appendChild(minusBtn);
            qtyDiv.appendChild(spanQty);
            qtyDiv.appendChild(plusBtn);
            qtyDiv.appendChild(removeBtn);

            cartItemDiv.appendChild(infoDiv);
            cartItemDiv.appendChild(qtyDiv);

            cartContainer.appendChild(cartItemDiv);
        });
    }

    cartCount.textContent = totalItems;

    let discount = 0;
    if (appliedCoupon === "SAVE10") {
        discount = Math.round(subtotal * 0.10);
    } else if (appliedCoupon === "FLAT100" && subtotal >= 500) {
        discount = 100;
    }

    const finalTotal = Math.max(0, subtotal - discount);

    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("discount").textContent = discount;
    document.getElementById("final-total").textContent = finalTotal;
    document.getElementById("modal-total-amt").textContent = finalTotal;
}

function applyCoupon() {
    const code = document.getElementById("coupon-input").value.trim().toUpperCase();
    const msg = document.getElementById("coupon-msg");

    if (cart.length === 0) {
        msg.style.color = "red";
        msg.textContent = "Add items to cart first!";
        return;
    }

    if (code === "SAVE10") {
        appliedCoupon = "SAVE10";
        msg.style.color = "green";
        msg.textContent = "Coupon SAVE10 applied (10% Off)!";
    } else if (code === "FLAT100") {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal >= 500) {
            appliedCoupon = "FLAT100";
            msg.style.color = "green";
            msg.textContent = "Coupon FLAT100 applied (₹100 Off)!";
        } else {
            appliedCoupon = null;
            msg.style.color = "red";
            msg.textContent = "FLAT100 requires a minimum subtotal of ₹500.";
        }
    } else {
        appliedCoupon = null;
        msg.style.color = "red";
        msg.textContent = "Invalid coupon code!";
    }

    updateCartUI();
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some items before checking out.");
        return;
    }
    document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

function placeOrder(event) {
    event.preventDefault();
    const name = document.getElementById("cust-name").value;
    const total = document.getElementById("final-total").textContent;

    alert(`Thank you, ${name}! Your order of ₹${total} has been placed successfully.`);

    cart = [];
    appliedCoupon = null;
    document.getElementById("coupon-input").value = "";
    document.getElementById("coupon-msg").textContent = "";
    document.getElementById("checkout-form").reset();
    closeCheckout();
    updateCartUI();
}

document.getElementById("search-input").addEventListener("input", filterAndSortProducts);
document.getElementById("category-filter").addEventListener("change", filterAndSortProducts);
document.getElementById("sort-select").addEventListener("change", filterAndSortProducts);
document.getElementById("apply-coupon-btn").addEventListener("click", applyCoupon);
document.getElementById("checkout-open-btn").addEventListener("click", openCheckout);
document.getElementById("checkout-cancel-btn").addEventListener("click", closeCheckout);
document.getElementById("checkout-form").addEventListener("submit", placeOrder);

displayProducts(products);