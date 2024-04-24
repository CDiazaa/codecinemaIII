
const form = document.getElementById("form");

const nombre = document.getElementById("name");
const email = document.getElementById("email");
const pass = document.getElementById("pass");

const parrafo = document.getElementById("alertcheck");
const alertNombre = document.getElementById("alertname");
const alertEmail = document.getElementById("alertemail");
const alertPass = document.getElementById("alertpass");

const btnRegis = document.getElementById("regisBtn");
const btnCPrev = document.querySelector(".carousel-control-prev");
const btnCNext = document.querySelector(".carousel-control-next");

function disableScrolling() {
    let x = window.scrollX;
    let y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
}

function enableScrolling() {
    window.onscroll = function () { };
}

document.querySelector("#close").addEventListener('click', function () {
    document.querySelector(".grayscreen").style.display = "none";
    document.body.style.overflow = 'auto';
})

form.addEventListener("submit", e => {
    e.preventDefault()
    let alerta = "";
    let entrar = false;
    let validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Expresion que sirve para validar en email.
    parrafo.innerHTML = "";
    alertNombre.innerHTML = "";
    alertEmail.innerHTML = "";
    alertPass.innerHTML = "";

    if (nombre.value.length < 8) {
        alertNombre.innerHTML = `Mín. 8 caractéres. <br>`;
        entrar = true;
    }
    // console.log(validateEmail.test(email.value));
    if (!validateEmail.test(email.value)) {
        alertEmail.innerHTML = `E-mail incorrecto. <br>`;
        entrar = true;
    }
    if (pass.value.length < 12) {
        alertPass.innerHTML = `Mín. 10 caractéres. <br>`;
        entrar = true;
    }
    if (entrar) {
        parrafo.innerHTML = 'Llene los campos nuevamente.';
    } else {
        parrafo.innerHTML = "Registro exitoso. Espere..."
        setTimeout(function () {
            document.querySelector(".grayscreen").style.display = "none";
            btnRegis.disabled = true;
            document.querySelector(".regisBtn").style.display = "none";
            btnCPrev.disabled = false;
            btnCNext.disabled = false;

            //Parrafo saludo usuario
            const newParagraph = document.createElement("p");
            newParagraph.textContent = `¡Bienvenido ${nombre.value}!`;
            newParagraph.classList.add("userHello");
            const newUserDiv = document.createElement("div");
            newUserDiv.classList.add("userDiv");
            newUserDiv.appendChild(newParagraph);
            const sliderContainer = document.getElementById("slider");
            const firstChild = sliderContainer.firstChild;
            sliderContainer.insertBefore(newUserDiv, firstChild);
            document.body.style.overflow = 'auto';
        }, 3000);
        localStorage.setItem('Datos de usuario', JSON.stringify(data))
    }
})

document.getElementById("regisBtn").addEventListener("click",
    function () {
        document.querySelector(".grayscreen").style.display = "flex";
        btnCPrev.disabled = true;
        btnCNext.disabled = true;
        document.body.style.overflow = 'hidden';
    });

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTRjMThkMzE4M2NhZGFjZDM1NjFlMDNiYzc3NTA3NiIsInN1YiI6IjY2MjZjOWEwMmRkYTg5MDE4N2UzZmY0OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lVoEnHyNXo3tou-4ahbO0DgbQF5s0EWvYjuPgIKqKFY'
    }
};

fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadMov(data.results);
    })
    .catch(err => console.error(err));

function loadMov(movies) {
    const contpeliculas = document.getElementById('contmovies');
    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie");
        const isFavorite = localStorage.getItem(`favorite_${movie.id}`);
        const redondear = movie.vote_average.toFixed(1);
        div.innerHTML = `
                    <img class="pelimagen" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" 
                    dataOverview="${movie.overview.replace(/"/g, '&quot;')}" data-id="${movie.id}">
                    <div class="peldetails">
                    <h3 class="peltitulo titulo">${movie.title} </h3>
                    <p class="pelyear">${movie.release_date}</p>
                    <p class="pelrt"> 
                        <i class="fa${isFavorite ? 's' : 'r'} fa-heart favorite-icon" data-id="${movie.id}"></i> 
                        ${redondear} popularidad
                    </p>
                    
                    </div>`;
        contpeliculas.append(div);
    });
    addFavorito();
    imageClickEvents();
}

function imageClickEvents() {
    const imagenes = document.querySelectorAll('.pelimagen');
    imagenes.forEach(imagen => {
        imagen.addEventListener('click', function () {
            const overview = imagen.getAttribute('dataOverview');
            const title = imagen.getAttribute('data-title');
            mostrarSweetAlert(imagen.src, title, overview);
        });
    });
}

function mostrarSweetAlert(imageUrl, title, overview) {
    Swal.fire({
        imageUrl: imageUrl,
        imageHeight: 600,
        imageAlt: 'Pelicula',
        title: title,
        text: overview,
        width: 600
    });
}

function addFavorito() {
    const favIcons = document.querySelectorAll('.favorite-icon');
    favIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            const movieId = icon.getAttribute('data-id');
            const isFavorite = localStorage.getItem(`favorite_${movieId}`);
            if (isFavorite) {
                localStorage.removeItem(`favorite_${movieId}`);
                localStorage.removeItem(`movieTitle_${movieId}`);
                localStorage.removeItem(`movieImage_${movieId}`);
                icon.classList.replace('fas', 'far');
            } else {
                const title = icon.closest('.peldetails').querySelector('.peltitulo').textContent;
                const image = icon.closest('.movie').querySelector('.pelimagen').src;
                localStorage.setItem(`favorite_${movieId}`, 'true');
                localStorage.setItem(`movieTitle_${movieId}`, title);
                localStorage.setItem(`movieImage_${movieId}`, image);
                icon.classList.replace('far', 'fas');
            }
            displayFavorites();
        });
    });
}


document.getElementById("busquedaB").addEventListener("click", function (event) {
    event.preventDefault();

    const input = document.getElementById("busqueda").value.toLowerCase();
    const titulos = document.querySelectorAll('.titulo');
    let found = false;

    titulos.forEach(function (titulo) {
        if (titulo.textContent.toLowerCase().includes(input)) {
            titulo.parentNode.parentNode.style.display = '';
            found = true;
        } else {
            titulo.parentNode.parentNode.style.display = 'none';
        }
    });

    if (!found) {
        titulos.forEach(function (titulo) {
            titulo.parentNode.parentNode.style.display = '';
        });
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Parece que esa película no se ecuentra",
        });
    }
});

document.getElementById('toggleFavorites').addEventListener('click', () => {
    const panel = document.getElementById('favoritesPanel');
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        displayFavorites();
    }
});


function displayFavorites() {
    const favoritesContent = document.querySelector('.favorites-content');
    favoritesContent.innerHTML = '<p class="parFavorite"> Tus favoritos</p>';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('favorite_')) {
            const movieId = key.split('_')[1];
            const movieTitle = localStorage.getItem(`movieTitle_${movieId}`);
            const movieImage = localStorage.getItem(`movieImage_${movieId}`);

            const div = document.createElement('div');
            div.innerHTML =
                `<img src="${movieImage}" alt="${movieTitle}" style="width: 100%;">
                <p class="parFtitle">${movieTitle}</p>`;
            favoritesContent.appendChild(div);
        }
    }
}
