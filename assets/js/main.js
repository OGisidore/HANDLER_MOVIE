import { Film, display, displaydetails, url, current_movie } from "./functions.js";

window.onload = ()=>{
    
    
    console.log(form.elements["title"]);
    console.log(form);
    let isMouseDown = false;
    let startX;
    const filmsList = document.querySelector('.films_list');

    filmsList.addEventListener('mousedown', function(event) {
        isMouseDown = true;
        startX = event.clientX;
    });

    filmsList.addEventListener('mouseup', function() {
        isMouseDown = false;
    });

    filmsList.addEventListener('mousemove', function(event) {
        if (!isMouseDown) return;

        const currentX = event.clientX;
        const scrollDistance = startX - currentX;

        // Faites défiler la liste horizontalement en ajustant la position de défilement
        filmsList.scrollLeft += scrollDistance;

        startX = currentX;
    });
    const movies = new Film()

    movies.display_availableMovies()
    movies.display_currentMovies()
    document.querySelector("#image").addEventListener("change", movies.read_andGetURL)
    form.onsubmit = movies.submit_data.bind(movies)
    filterSelect.onchange = movies.filter_byGenre.bind(movies)
    sear.onkeyup = movies.search_forMovies.bind(movies)
    // document.querySelector('form').addEventListener('submit', obj.submit_data.bind(obj));


}