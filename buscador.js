document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchResults = document.getElementById("search-results");
    const allProducts = document.getElementById("all-products");
    const cart = document.getElementById("cart");
    const totalSpan = document.getElementById("total-price");
    const buyButton = document.getElementById("buy-button");
    const removeButtons = document.querySelectorAll(".remove-button");
    const paymentMethodRadio = document.getElementsByName("payment-method");

    let productos = []; // Almacenará los productos cargados desde el JSON.
    let cartItems = []; // Almacenará los productos seleccionados en el carrito.
    let paymentMethod = "cash"; // Método de pago predeterminado.

    // Cargar los productos desde el archivo JSON y manejar errores.
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud del archivo JSON.");
            }
            return response.json();
        })
        .then(data => {
            productos = data.productos;
            displayAllProducts(productos);
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON: ", error.message);
        });

    // Manejar la búsqueda cuando se hace clic en el botón de búsqueda
    searchButton.addEventListener("click", function () {
        performSearch();
    });

    // Manejar la búsqueda cuando se presiona Enter en el campo de búsqueda
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // Cambiar el método de pago cuando se selecciona un radio input
    paymentMethodRadio.forEach(input => {
        input.addEventListener("change", function () {
            paymentMethod = input.value;
            updateTotal();
        });
    });

    // ...

    // Actualizar el total cuando se cambia el método de pago
    function updateTotal() {
        let totalPrice = calculateTotal();
        if (paymentMethod === "cash") {
            totalPrice *= 0.9; // Aplicar descuento del 10% para pago en efectivo.
        } else if (paymentMethod === "credit") {
            totalPrice *= 1.07; // Aplicar aumento del 7% para pago con crédito.
        }
        totalSpan.textContent = `Total de la compra: $${totalPrice.toFixed(2)}`; // Mostrar el total con dos decimales.
    }

// ...


    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productos.filter(producto => {
            // Personaliza el criterio de búsqueda según tus necesidades.
            return producto.nombre.toLowerCase().includes(searchTerm);
        });

        displaySearchResults(filteredProducts);
    }

    function displaySearchResults(results) {
        // Limpiar los resultados anteriores
        searchResults.innerHTML = "";

        if (results.length === 0) {
            searchResults.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        // Crear un list-group para mostrar los resultados
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        results.forEach(producto => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            const addButton = document.createElement("button");
            addButton.className = "btn btn-success float-right";
            addButton.textContent = "✔️";
            addButton.dataset.productId = producto.id;

            // Verificar si hay suficiente cantidad en el stock
            if (producto.cantidad > 0) {
                addButton.addEventListener("click", function () {
                    addToCart(producto);
                });
            } else {
                addButton.disabled = true; // Desactivar el botón si no hay stock.
                addButton.title = "No hay stock disponible";
            }

            listItem.innerHTML = `
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.costo.toFixed(2)} pesos
            `;
            listItem.appendChild(addButton);
            listGroup.appendChild(listItem);
        });

        searchResults.appendChild(listGroup);
    }

    function displayAllProducts(productsToDisplay) {
        // Limpiar los productos anteriores
        allProducts.innerHTML = "";

        // Crear un list-group para mostrar todos los productos disponibles
        const listGroup = document.createElement("ul");
        listGroup.className = "list-group";

        productsToDisplay.forEach(producto => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            const addButton = document.createElement("button");
            addButton.className = "btn btn-success float-right";
            addButton.textContent = "✔️";
            addButton.dataset.productId = producto.id;

            // Verificar si hay suficiente cantidad en el stock
            if (producto.cantidad > 0) {
                addButton.addEventListener("click", function () {
                    addToCart(producto);
                });
            } else {
                addButton.disabled = true; // Desactivar el botón si no hay stock.
                addButton.title = "No hay stock disponible";
            }

            listItem.innerHTML = `
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.costo.toFixed(2)} pesos
            `;
            listItem.appendChild(addButton);
            listGroup.appendChild(listItem);
        });

        allProducts.appendChild(listGroup);
    }

    // Función para agregar productos al carrito
    function addToCart(producto) {
        const existingCartItem = cartItems.find(item => item.id === producto.id);
    
        if (existingCartItem) {
            if (producto.cantidad > 0) {
                // Verificar si hay suficiente cantidad en el stock antes de agregar al carrito
                cartItems.push({
                    id: producto.id,
                    name: producto.nombre,
                    cost: producto.costo,
                    quantity: 1
                });
    
                // Actualizar el stock del producto en el JSON
                producto.cantidad--;
                // Actualizar la lista de productos disponibles
                displayAllProducts(productos);
            } else {
                alert("No hay suficiente cantidad en el stock.");
            }
        } else {
            if (producto.cantidad > 0) {
                // Si es un nuevo producto, agregarlo al carrito si hay suficiente cantidad en el stock
                cartItems.push({
                    id: producto.id,
                    name: producto.nombre,
                    cost: producto.costo,
                    quantity: 1
                });
                // Actualizar el stock del producto en el JSON
                producto.cantidad--;
                // Actualizar la lista de productos disponibles
                displayAllProducts(productos);
            } else {
                alert("No hay suficiente cantidad en el stock.");
            }
        }
    
        // Actualizar el carrito
        displayCartItems();
        // Calcular el costo total de la compra y mostrarlo
        updateTotal();
    }
    

    // Función para mostrar los productos en el carrito
    function displayCartItems() {
        cart.innerHTML = ""; // Limpiar el contenido del carrito.

        cartItems.forEach((item) => {
            const cartItem = document.createElement("div");
            cartItem.innerHTML = `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.cost} pesos</span>
                        <button class="btn btn-danger remove-button" data-productId="${item.id}">Eliminar</button>
                    </div>
                </div>
            `;
            cart.appendChild(cartItem);
        });

        // Agregar eventos de eliminación a los botones "Eliminar"
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const productId = button.getAttribute("data-productId");
                removeFromCart(productId);
            });
        });

        // Mostrar el botón "Comprar" y su funcionalidad
        buyButton.style.display = "block";
        buyButton.addEventListener("click", function () {
            const totalPrice = calculateTotal();
            let finalTotal = totalPrice;
        
            if (paymentMethod === "cash") {
                finalTotal *= 0.9; // Aplicar descuento del 10% para pago en efectivo.
            } else if (paymentMethod === "credit") {
                finalTotal *= 1.07; // Aplicar aumento del 7% para pago con crédito.
            }
        
            alert(`Total de la compra: $${finalTotal.toFixed(2)}`);
        });
    }

    // Función para calcular el costo total de la compra
    function calculateTotal() {
        return cartItems.reduce((total, item) => total + item.cost * item.quantity, 0);
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        const index = cartItems.findIndex(item => item.id === productId);

        if (index !== -1) {
            const removedItem = cartItems.splice(index, 1)[0];
            // Incrementar la cantidad en el stock del producto en el JSON
            const product = productos.find(item => item.id === productId);
            product.cantidad += removedItem.quantity;
            // Actualizar la lista de productos disponibles
            displayAllProducts(productos);
            // Actualizar el carrito
            displayCartItems();
            // Calcular el costo total de la compra y mostrarlo
            updateTotal();
        }
    }

    // Llamar a la función para mostrar los productos en el carrito al cargar la página.
    displayCartItems();
});
