document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchResults = document.getElementById("search-results");
    const allProducts = document.getElementById("all-products");

    let productos = []; // Almacenará los productos cargados desde el JSON.

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
            const productCount = getProductCount(producto.id);
            listItem.innerHTML = `
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.costo.toFixed(2)} pesos
                <span class="badge badge-primary badge-pill">${productCount}</span>
                <button class="btn btn-success float-right" data-product-id="${producto.id}">✔️</button>
                <button class="btn btn-danger float-right mr-2" data-product-id="${producto.id}">❌</button>
            `;
            listGroup.appendChild(listItem);
        });

        searchResults.appendChild(listGroup);
        setupProductButtons(); // Configurar los botones de agregar/quitar
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
            const productCount = getProductCount(producto.id);
            listItem.innerHTML = `
                ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.costo.toFixed(2)} pesos
                <span class="badge badge-primary badge-pill">${productCount}</span>
                <button class="btn btn-success float-right" data-product-id="${producto.id}">✔️</button>
                <button class="btn btn-danger float-right mr-2" data-product-id="${producto.id}">❌</button>
            `;
            listGroup.appendChild(listItem);
        });

        allProducts.appendChild(listGroup);
        setupProductButtons(); // Configurar los botones de agregar/quitar
    }

    // Función para agregar o quitar un producto seleccionado
    function updateProduct(productId, operation) {
        const product = productos.find(producto => producto.id === productId);
        if (product) {
            const storedProducts = localStorage.getItem("selectedProducts") || "[]";
            const selectedProducts = JSON.parse(storedProducts);

            const existingProduct = selectedProducts.find(p => p.id === productId);
            if (existingProduct) {
                if (operation === "add") {
                    existingProduct.count++;
                } else if (operation === "remove") {
                    if (existingProduct.count > 1) {
                        existingProduct.count--;
                    } else {
                        selectedProducts.splice(selectedProducts.indexOf(existingProduct), 1);
                    }
                }
            } else {
                if (operation === "add") {
                    product.count = 1;
                    selectedProducts.push(product);
                }
            }

            localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
            updateProductCounts();
        }
    }

    // Event listeners para los botones de agregar y quitar productos
    function setupProductButtons() {
        const addButtons = document.querySelectorAll(".btn-success");
        addButtons.forEach(button => {
            button.addEventListener("click", function () {
                const productId = button.getAttribute("data-product-id");
                updateProduct(productId, "add");
            });
        });

        const removeButtons = document.querySelectorAll(".btn-danger");
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const productId = button.getAttribute("data-product-id");
                updateProduct(productId, "remove");
            });
        });
    }

    // Función para obtener la cantidad de un producto del Local Storage
    function getProductCount(productId) {
        const storedProducts = localStorage.getItem("selectedProducts");
        if (storedProducts) {
            const selectedProducts = JSON.parse(storedProducts);
            const existingProduct = selectedProducts.find(p => p.id === productId);
            return existingProduct ? existingProduct.count : 0;
        }
        return 0;
    }

    // Actualizar los contadores de productos en la lista
    function updateProductCounts() {
        const badgeElements = document.querySelectorAll(".badge");
        badgeElements.forEach(badge => {
            const productId = badge.nextElementSibling.nextElementSibling.getAttribute("data-product-id");
            const productCount = getProductCount(productId);
            badge.textContent = productCount;
        });
    }

    // Cargar productos seleccionados al cargar la página
    loadSelectedProducts();
    // Actualizar los contadores de productos
    updateProductCounts();
});
