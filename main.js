document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const cart = document.getElementById("cart");
    const totalSpan = document.getElementById("total-price");
    const buyButton = document.getElementById("buy-button");
  
    const products = []; // Aquí almacenaremos los productos registrados.
    let cartItems = []; // Aquí almacenaremos los productos en el carrito.
  
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const productId = document.getElementById("product-id").value;
      const productName = document.getElementById("product-name").value;
      const productDescription = document.getElementById("product-description").value;
      const productQuantity = parseInt(document.getElementById("product-quantity").value);
      const productCost = parseFloat(document.getElementById("product-cost").value);
  
      // Validar que no exista un producto con la misma identificación.
      if (products.some((product) => product.id === productId)) {
        alert("Ya existe un producto con esta identificación.");
        return;
      }
  
      const newProduct = {
        id: productId,
        name: productName,
        description: productDescription,
        quantity: productQuantity,
        cost: productCost,
      };
  
      products.push(newProduct);
      // Agregar el producto a la lista de productos registrados.
  
      // Limpiar los campos del formulario después de registrar el producto.
      productForm.reset();
  
      // Llamar a una función para mostrar los productos en el carrito.
      displayCartItems();
    });
  
    function displayCartItems() {
      cart.innerHTML = ""; // Limpiar el contenido del carrito.
  
      cartItems.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
          <p>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.cost.toFixed(2)} pesos</p>
          <button onclick="removeItem('${item.id}')">Eliminar</button>
        `;
        cart.appendChild(cartItem);
      });
  
      // Calcular el costo total de la compra y mostrarlo.
      const totalPrice = cartItems.reduce((total, item) => total + item.cost, 0);
      totalSpan.textContent = totalPrice.toFixed(2); // Mostrar el total con dos decimales.
    }
  
    function removeItem(productId) {
      // Eliminar el producto del carrito por su identificación.
      cartItems = cartItems.filter((item) => item.id !== productId);
      displayCartItems();
    }
  
    buyButton.addEventListener("click", function () {
      // Implementa aquí la lógica para realizar la compra y aplicar descuentos o aumentos según el método de pago.
      // Actualiza el stock de productos registrados y realiza otras acciones necesarias.
      alert("Compra realizada con éxito.");
      // Limpia el carrito después de la compra.
      cartItems = [];
      displayCartItems();
    });
  });
  