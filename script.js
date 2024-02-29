document.addEventListener("DOMContentLoaded", function() {
  const menuContainer = document.getElementById("menu");

  const timestamp = new Date().getTime();
  const jsonUrl = `./data/menu.json?timestamp=${timestamp}`;

  // Hacer una solicitud para cargar el archivo JSON
  fetch("./data/menu.json")
    .then(response => {
      
      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then(menuData => {
      
      menuData.menu.forEach(function(producto) {
       
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");

        const imagenProducto = document.createElement("img");
        imagenProducto.src = "img/" + producto.imagen; 
        imagenProducto.alt = producto.nombre;

        const nombreProducto = document.createElement("h3");
        nombreProducto.textContent = producto.nombre;

        const descripcionProducto = document.createElement("p");
        descripcionProducto.textContent = producto.descripcion;

        const precioProducto = document.createElement("p");
        precioProducto.textContent = `$${producto.precio.toFixed(2)}`;

        divProducto.appendChild(imagenProducto);
        divProducto.appendChild(nombreProducto);
        divProducto.appendChild(descripcionProducto);
        divProducto.appendChild(precioProducto);

        menuContainer.appendChild(divProducto);
      });
    })
    .catch(error => console.error("Error al cargar el menú:", error));
});
