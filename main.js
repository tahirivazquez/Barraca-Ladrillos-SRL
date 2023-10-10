document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("product-form");
  const cart = document.getElementById("cart");
  const totalSpan = document.getElementById("total-price");
  const buyButton = document.getElementById("buy-button");

  const products = []; // Aquí almacenaremos los productos registrados.
  let cartItems = []; // Aquí almacenaremos los productos en el carrito.

  const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

  const url_api = 'https://api.example.com/data'; // Reemplaza esto con la URL de la API que deseas consultar.

  fetch(url_api)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de la solicitud.');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error al realizar la solicitud:', error);
    });

  productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const productId = document.getElementById("product-id").value;
    const productName = document.getElementById("product-name").value;
    const productDescription = document.getElementById("product-description").value;
    const productQuantity = parseInt(document.getElementById("product-quantity").value);
    const productCost = parseFloat(document.getElementById("product-cost").value);

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

    productForm.reset();

    displayCartItems();
  });

  function displayCartItems() {
    cart.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
          <p>${item.name} - Cantidad: ${item.quantity} - Precio: ${item.cost.toFixed(2)} pesos</p>
          <button onclick="removeItem('${item.id}')">Eliminar</button>
        `;
      cart.appendChild(cartItem);
    });


    const totalPrice = cartItems.reduce((total, item) => total + item.cost, 0);
    totalSpan.textContent = totalPrice.toFixed(2);
  }

  function removeItem(productId) {
    cartItems = cartItems.filter((item) => item.id !== productId);
    displayCartItems();
  }

  buyButton.addEventListener("click", function () {
    // acá va la lógica para realizar la compra y aplicar descuentos o aumentos según el método de pago.
    // y se actualizaría el stock de productos registrados y realiza otras acciones necesarias.
    alert("Compra realizada con éxito.");
    // se limpia el carrito después de la compra.
    cartItems = [];
    displayCartItems();
  });
});
