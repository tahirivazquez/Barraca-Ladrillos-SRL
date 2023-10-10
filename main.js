document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("product-form");
  const cart = document.getElementById("cart");
  const totalSpan = document.getElementById("total-price");
  const buyButton = document.getElementById("buy-button");

  // Obtener productos del Local Storage o inicializar un array vacío si no existen
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Función para mostrar los productos en el carrito
  function displayCartItems() {
      cart.innerHTML = ""; // Limpiar el contenido del carrito.

      cartItems.forEach((item) => {
          const cartItem = document.createElement("div");
          cartItem.innerHTML = `
              <div class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                      <span>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.cost} pesos</span>
                      <div>
                          <button class="btn btn-danger btn-sm" onclick="removeItem('${item.id}')">Eliminar</button>
                          <button class="btn btn-success btn-sm" onclick="toggleItem('${item.id}')">${item.selected ? '✅' : '❌'}</button>
                      </div>
                  </div>
              </div>
          `;
          cart.appendChild(cartItem);
      });

      // Calcular el costo total de la compra y mostrarlo.
      const totalPrice = cartItems.reduce((total, item) => total + item.cost, 0);
      totalSpan.textContent = totalPrice.toFixed(2); // Mostrar el total con dos decimales.
  }

  // Función para eliminar un producto del carrito
  function removeItem(productId) {
      cartItems = cartItems.filter((item) => item.id !== productId);
      displayCartItems();
      updateLocalStorage();
  }

  // Función para alternar la selección de un producto
  function toggleItem(productId) {
      const selectedItem = cartItems.find((item) => item.id === productId);
      if (selectedItem) {
          selectedItem.selected = !selectedItem.selected;
          displayCartItems();
          updateLocalStorage();
      }
  }

  // Actualizar el Local Storage con los productos del carrito
  function updateLocalStorage() {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const productId = document.getElementById("product-id").value;
      const productName = document.getElementById("product-name").value;
      const productDescription = document.getElementById("product-description").value;
      const productQuantity = parseInt(document.getElementById("product-quantity").value);
      const productCost = parseFloat(document.getElementById("product-cost").value);

      // Validar que no exista un producto con la misma identificación.
      if (cartItems.some((item) => item.id === productId)) {
          alert("Ya existe un producto con esta identificación en el carrito.");
          return;
      }

      const newProduct = {
          id: productId,
          name: productName,
          description: productDescription,
          quantity: productQuantity,
          cost: productCost,
          selected: false, // Agregar una propiedad para indicar si está seleccionado o no.
      };

      cartItems.push(newProduct);
      displayCartItems();
      updateLocalStorage();
  });

  // Llamar a la función para mostrar los productos en el carrito al cargar la página.
  displayCartItems();

  buyButton.addEventListener("click", function () {
      // Implementa aquí la lógica para realizar la compra y aplicar descuentos o aumentos según el método de pago.
      // Actualiza el stock de productos registrados y realiza otras acciones necesarias.
      alert("Compra realizada con éxito.");
      // Limpia el carrito después de la compra.
      cartItems = [];
      displayCartItems();
      updateLocalStorage();
  });
});
