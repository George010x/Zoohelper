/* ========================================
   Zoohelper34 - FIXED E-commerce SPA
   SyntaxError Fixed | Real Photos
========================================= */

const STATE = {
    products: [
        { id: 1, name: 'Bach Rescue Remedy Pet 10мл', price: 1200, img: 'img/bach-rescue-remedy-pet.webp', desc: 'Антистресс для питомцев' },
        { id: 2, name: 'Gelacan Darling', price: 950, img: 'img/gelacan-darling.webp', desc: 'Жевательная паста' },
        { id: 3, name: 'TIAKI Slow Feeder Mandala', price: 1800, img: 'img/tiaki-slow-feeder-mandala.webp', desc: 'Медленный фидер' },
        { id: 4, name: 'Zesty Paws Healthy Aging', price: 2200, img: 'img/zesty-paws-healthy-aging.webp', desc: 'Для пожилых собак' },
        { id: 5, name: 'Eheim Substrat Pro 720г', price: 1100, img: 'img/eheim-substrat-pro.webp', desc: 'Биофильтр аквариум' },
        { id: 6, name: 'ZARAHOME Pet Bowl Stand', price: 1400, img: 'img/zarahome-pet-bowl-stand.webp', desc: 'Миска с подставкой' },
        { id: 7, name: 'Rojeco Интерактивный мяч', price: 750, img: 'img/rojeco-interactive-ball.webp', desc: 'Для кошек' },
        { id: 8, name: 'DERMOSCENT Крем для кожи', price: 1600, img: 'img/dermocent-skin-cream.webp', desc: 'Уход за кожей' },
        { id: 9, name: 'DERMOSCENT Pyoclean', price: 1300, img: 'img/dermocent-pyoclean.webp', desc: 'Очиститель ушей' },
        { id: 10, name: 'Trixie Пальто для собак', price: 1900, img: 'img/trixie-dog-coat.webp', desc: 'Теплая куртка' },
        { id: 11, name: 'Inodorina Песок 6L', price: 1000, img: 'img/inodorina-sand-6l.webp', desc: 'Без запаха' },
        { id: 12, name: 'Pro Plan Пробиотик кошки', price: 1700, img: 'img/pro-plan-cat-probiotic.webp', desc: 'Поддержка ЖКТ' },
        { id: 13, name: 'Ruffwear Харнес', price: 3500, img: 'img/ruffwear-universal-harness.webp', desc: 'Универсальный' }
    ],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || { name: '', phone: '', email: '' },
    orders: JSON.parse(localStorage.getItem('orders')) || []
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    initCabinet();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', debounce(searchProducts, 300));
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchProducts();
    });
}

function renderProducts(filter = '') {
    const grid = document.getElementById('productsGrid');
    const filtered = STATE.products.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/280x220/90EE90/000?text=Фото'">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price">${p.price.toLocaleString()}₽</div>
            <button onclick="addToCart(${p.id})">🛒 В корзину</button>
        </div>
    `).join('') || '<p style="grid-column:1/-1;text-align:center;color:#666;padding:50px;">Товары не найдены</p>';
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    renderProducts(query);
}

function addToCart(id) {
    const product = STATE.products.find(p => p.id === id);
    const existing = STATE.cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        STATE.cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(STATE.cart));
    updateCartUI();
    showToast('✅ Добавлено в корзину!');
}

function updateCartUI() {
    const count = STATE.cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').textContent = count || 0;
}

function renderCart() {
    const cartEl = document.getElementById('cartItems');
    if (STATE.cart.length === 0) {
        cartEl.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">Корзина пуста</p>';
    } else {
        cartEl.innerHTML = STATE.cart.map(item => `
            <div class="cart-item">
                <span>${item.name} × 
                    <input type="number" value="${item.qty}" min="1" 
                           onchange="updateQty(${item.id}, this.value)" style="width:60px;">
                </span>
                <span>${(item.price * item.qty).toLocaleString()}₽</span>
                <button onclick="removeFromCart(${item.id})">❌</button>
            </div>
        `).join('');
    }
    
    const total = STATE.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById('totalPrice').textContent = total.toLocaleString() || 0;
}

function updateQty(id, qty) {
    const item = STATE.cart.find(item => item.id === id);
    if (item) {
        item.qty = Math.max(1, parseInt(qty) || 1);
        localStorage.setItem('cart', JSON.stringify(STATE.cart));
        renderCart();
    }
}

function removeFromCart(id) {
    STATE.cart = STATE.cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(STATE.cart));
    renderCart();
    updateCartUI();
    showToast('🗑️ Удалено из корзины');
}

function initCabinet() {
    document.getElementById('userName').value = STATE.user.name;
    document.getElementById('userPhone').value = STATE.user.phone;
    document.getElementById('userEmail').value = STATE.user.email;
    renderOrders();
}

function saveProfile() {
    STATE.user.name = document.getElementById('userName').value;
    STATE.user.phone = document.getElementById('userPhone').value;
    STATE.user.email = document.getElementById('userEmail').value;
    localStorage.setItem('user', JSON.stringify(STATE.user));
    showToast('✅ Профиль сохранён!');
}

function renderOrders() {
    const ordersEl = document.getElementById('ordersList');
    if (STATE.orders.length === 0) {
        ordersEl.innerHTML = '<p style="text-align:center;color:#666;">Нет заказов</p>';
    } else {
        ordersEl.innerHTML = STATE.orders.map(order => `
            <div class="order-item">
                <strong>Заказ #${order.id} | ${new Date(order.date).toLocaleDateString('ru')} | ${order.total.toLocaleString()}₽</strong>
            </div>
        `).join('');
    }
}

function checkout() {
    if (STATE.cart.length === 0) {
        showToast('❌ Корзина пуста!');
        return;
    }
    saveOrder();
}

function saveOrder() {
    const total = STATE.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
        id: Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        total: total,
        items: STATE.cart.map(i => ({...i}))
    };
    STATE.orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(STATE.orders));
    
    STATE.cart = [];
    localStorage.setItem('cart', JSON.stringify(STATE.cart));
    
    updateCartUI();
    renderCart();
    showToast(`🎉 Заказ #${order.id} сохранён!`);
}

function showSection(sectionId) {
    document.querySelectorAll('.page-section, .catalog').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    
    if (sectionId === 'catalog') {
        document.getElementById('catalog').style.display = 'block';
    } else {
        const section = document.getElementById(sectionId);
        section.classList.add('active');
        section.style.display = 'block';
    }
    
    if (sectionId === 'cart') renderCart();
    if (sectionId === 'cabinet') initCabinet();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
