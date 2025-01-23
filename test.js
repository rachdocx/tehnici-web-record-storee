function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function carucior() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    updateCartCount();
}

function addToCart(albumId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.includes(albumId)) {
        cart.push(albumId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
        showNotification('Album adaugat in cos!');
    } else {
        showNotification('Albumul este deja in cos!');
    }
}

function removeFromCart(albumId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== albumId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}
async function displayCart() {
    const cartContent = document.getElementById('cartContent');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    try {
        const response = await fetch('albums.json');
        const data = await response.json();
        
        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart-message">Cosul este gol!</p>';
            return;
        }

        let totalPrice = 0;
        const cartHtml = cart.map(albumId => {
            const album = data.albums.find(a => a.id === albumId);
            if (!album) return '';
            totalPrice += album.price;
            return `
                <div class="cart-item">
                    <img src="${album.previewImage}" alt="${album.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${album.title}</h3>
                        <p>${album.artist}</p>
                        <p class="price">$${album.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCart(${album.id})" class="remove-from-cart">×</button>
                </div>
            `;
        }).join('');

        cartContent.innerHTML = `
            ${cartHtml}
            <div class="cart-total">
                <h3>Total: $${totalPrice.toFixed(2)}</h3>
                <button onclick="checkout()" class="checkout-button">Checkout</button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading cart:', error);
        cartContent.innerHTML = '<p>Error loading cart</p>';
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('open');
    if (cartModal.classList.contains('open')) {
        displayCart();
    }
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Cosul este gol!');
        return;
    }
    alert('Comanda a fost trimisa!');
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    displayCart();
    document.getElementById('cartModal').classList.remove('open');
}
async function afisarealbume() {
    try {
        const response = await fetch('albums.json');
        const data = await response.json();
        
        const content = `
            <div class="albums-grid">
                ${data.albums.map(album => `
                    <div class="album-card">
                        <a href="?id=${album.id}" class="album-image-link">
                            <img src="${album.previewImage}" alt="${album.title}">
                        </a>
                        <div class="album-card-info">
                            <h3>${album.title}</h3>
                            <p>${album.artist}</p>
                            <p class="price">$${album.price.toFixed(2)}</p>
                            <button onclick="addToCart(${album.id})" class="add-to-cart-button">Add to Cart</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('albumDetails').innerHTML = content;
    } catch (error) {
        console.error('Error loading albums:', error);
        document.getElementById('albumDetails').innerHTML = '<div class="error">Error loading albums</div>';
    }
}

async function incarcarealbum() {
    try {
        const albumId = getUrlParam('id');
        if (!albumId) {
            return afisarealbume
        ();
        }

        const response = await fetch('albums.json');
        const data = await response.json();
        
        const album = data.albums.find(a => a.id === parseInt(albumId));
        if (!album) {
            throw new Error('Album not found');
        }

        const content = `
            <div class="albumssmth">
                <div class="album-images">
                    <img src="${album.previewImage}" alt="${album.title}" class="main-image" id="mainImage">
                    <div class="image-gallery">
                        ${album.images.map(img => `
                            <img src="${img}" alt="${album.title}" class="gallery-image" onclick="updateMainImage('${img}')">
                        `).join('')}
                    </div>
                </div>
                <div class="album-info">
                    <div class="album-header">
                        <h1 class="album-title">${album.title}</h1>
                        <h2 class="album-artist">${album.artist}</h2>
                        <div class="album-price">$${album.price.toFixed(2)}</div>
                        <button onclick="addToCart(${album.id})" class="add-to-cart-button">Add to Cart</button>
                    </div>
                    <h3>Tracklist:</h3>
                    <ol class="tracklist">
                        ${album.tracklist.map(track => `<li>${track}</li>`).join('')}
                    </ol>
                    <iframe class="spotify-embed" 
                            src="${album.spotifyEmbed}" 
                            allowfullscreen 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                    </iframe>
                </div>
            </div>
        `;

        document.getElementById('albumDetails').innerHTML = content;
    } catch (error) {
        console.error('Error loading album details:', error);
        document.getElementById('albumDetails').innerHTML = `
            <div class="error">
                <h2>Error loading album details</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function updateMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}
function cautare() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchBar';
    searchInput.placeholder = 'Cauta...';
    searchInput.className = 'search-bar';
    
    document.querySelector('.container').insertBefore(searchInput, document.querySelector('.album-details'));

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log(searchTerm); 
        const albums = document.querySelectorAll('.album-card');
        
        albums.forEach(album => {
            const title = album.querySelector('h3').textContent.toLowerCase();
            const artist = album.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                album.style.display = '';
            } else {
                album.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carucior();
    incarcarealbum();
    cautare();
});
