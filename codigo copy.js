document.addEventListener("DOMContentLoaded", function () {
    const contenedorProducto = document.querySelector(".contenedor-productos");
    const catMenu = document.querySelector(".cat-menu");
    const tituloMain = document.querySelector(".titulo-main");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const agregarCarritoBtn = document.getElementById("agregar-carrito");
    const notasTextarea = document.getElementById("notas");

    let productoActual;
    let carrito = [];

    const timestamp = new Date().getTime();
    const jsonUrl = `./data/menu.json?timestamp=${timestamp}`;

    fetch("./data/menu.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(menuData => {

            cargarProductos(menuData.menu);
            actualizarTitulo("Todos los productos");

            catMenu.addEventListener("click", function (event) {
                const categoriaSeleccionada = event.target.textContent.trim().toLowerCase();
                catMenu.querySelectorAll(".boton-categoria").forEach(boton => {
                    if (boton.textContent.trim().toLowerCase() === categoriaSeleccionada) {
                        boton.classList.add("active");
                    } else {
                        boton.classList.remove("active");
                    }
                });
                const productosFiltrados = menuData.menu.filter(producto => {
                    return categoriaSeleccionada === "todos los productos" || producto.categoria === categoriaSeleccionada;
                });

                cargarProductos(productosFiltrados);
                actualizarTitulo(categoriaSeleccionada);
            });
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    function cargarProductos(productosElegidos) {
        contenedorProducto.innerHTML = "";

        productosElegidos.forEach(producto => {
            const divProducto = document.createElement("div");
            divProducto.classList.add("producto");

            const imagenProducto = document.createElement("img");
            imagenProducto.src = `./img/${producto.imagen}`;
            imagenProducto.alt = producto.nombre;
            imagenProducto.classList.add("producto-imagen");

            const detallesProducto = document.createElement("div");
            detallesProducto.classList.add("producto-detalles");

            const nombreProducto = document.createElement("h3");
            nombreProducto.textContent = producto.nombre;
            nombreProducto.classList.add("producto-titulo");

            const descripcionProducto = document.createElement("p");
            descripcionProducto.textContent = producto.descripcion;
            descripcionProducto.classList.add("producto-precio");

            const precioProducto = document.createElement("p");
            precioProducto.textContent = `Q${producto.precio.toFixed(2)}`;
            precioProducto.classList.add("producto-descripcion");

            const botonPedir = document.createElement("button");
            botonPedir.textContent = "Agregar al carrito";
            botonPedir.classList.add("producto-agregar");
            botonPedir.addEventListener("click", function () {
                productoActual = producto;
                cargarExtras(producto.extras);
                modal.style.display = "block";
            });

            detallesProducto.appendChild(nombreProducto);
            detallesProducto.appendChild(descripcionProducto);
            detallesProducto.appendChild(precioProducto);
            detallesProducto.appendChild(botonPedir);

            divProducto.appendChild(imagenProducto);
            divProducto.appendChild(detallesProducto);

            contenedorProducto.appendChild(divProducto);
        });
    }

    function cargarExtras(extras) {
        const extrasContainer = document.getElementById("extras-container");
        const extrasCheckboxes = document.getElementById("extras-checkboxes");
    
        extrasCheckboxes.innerHTML = "";

        if (extras && extras.length > 0) {
            extrasContainer.style.display = "block";
            extras.forEach(extra => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = extra.nombre.toLowerCase().replace(/\s+/g, "-");
                checkbox.value = extra.nombre;
                const label = document.createElement("label");
                label.htmlFor = checkbox.id;
                label.textContent = `${extra.nombre} (+Q${extra.precio.toFixed(2)})`;
    
                extrasCheckboxes.appendChild(checkbox);
                extrasCheckboxes.appendChild(label);
                extrasCheckboxes.appendChild(document.createElement("br"));
            });
        } else {
            extrasContainer.style.display = "none";
        }
    }


    function actualizarTitulo(categoria) {
        tituloMain.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    agregarCarritoBtn.addEventListener("click", function () {
        const notas = notasTextarea.value;
        const extrasSeleccionados = obtenerExtrasSeleccionados();

        const extrasTexto = extrasSeleccionados.length > 0
        ? `con extras: ${extrasSeleccionados.join(", ")}`
        : "";

        const productoEnCarrito = {
            nombre: productoActual.nombre,
            notas: notas,
            extras: extrasSeleccionados
        };
    
        carrito.push(productoEnCarrito);


        console.log(`Producto añadido al carrito: ${productoActual.nombre} con notas: ${notas} ${extrasTexto}`);
        modal.style.display = "none";
        notasTextarea.value = "";
        console.log(carrito)
    });

    function obtenerExtrasSeleccionados() {
        const extrasCheckboxes = document.querySelectorAll("#extras-checkboxes input[type='checkbox']:checked");
        const extrasSeleccionados = Array.from(extrasCheckboxes).map(checkbox => checkbox.value);
        return extrasSeleccionados;
    }

});

