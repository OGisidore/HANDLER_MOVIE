
export var display = document.querySelector(".films_list")
display.innerHTML = "";
export var displaydetails = document.querySelector(".currentFilm")

displaydetails.innerHTML = "";
export var current_movie = undefined

export var url;

export class Film {
    constructor(title, realisateur, text, genre, annee, image) {
        this.title = title,
            this.realisateur = realisateur,
            this.text = text,
            this.genre = genre,
            this.annee = annee,
            this.image = image,
            this.films = [...filmData]
    }


    /******************method to display available movies*******************/

    display_availableMovies(newFilms = this.films) {
        this.films.forEach((film) => {
            
            display.innerHTML += `
                <div class="film" data-id="${film.id}">
                <img src="assets/${film.image}" alt="images du film ${film.title}">
                <svg id="delete" data-id="${film.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
                <svg id="edit" data-id="${film.id}" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path
                        d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
            </div>`
            const erases = document.querySelectorAll("#delete");
            erases.forEach((erase)=>{
               
                erase.onclick = this.handle_delete

            })
           
            var edits = document.querySelectorAll("#edit")
            edits.forEach((edit)=>{
                edit.onclick = this.handle_edit
            })
            var views = document.querySelectorAll(".film")
            views.forEach((view)=>{
                view.onclick = this.handle_details
            })
            
            

        })

    }


    /******************method to handle view details movies*******************/
    handle_details(event) {
       
        const id = event.target.dataset.id
        console.log(id);
        current_movie = filmData.find((film) => film.id == id)
        console.log(current_movie);
        displaydetails.innerHTML = `
        <div class="description">
        <div class="text">
            <h2>${current_movie.title}</h2>
            <span>Annee : ${current_movie.annee} </span>
            <span>Genre : ${current_movie.genre} </span>
            <span> Par : ${current_movie.realisateur} </span>
            <p>${current_movie.text} </p>
        </div>
        <div class="image">
            <img src="assets/${current_movie.image}" alt=" image ${current_movie.title}">
        </div>
    </div>
        `
       
    }

    /******************method to display current or latest movies*******************/
    display_currentMovies(newFilms = this.films[0]) {
        
        displaydetails.innerHTML = `
            <div class="description">
            <div class="text">
                <h2>${newFilms.title}</h2>
                <span>Annee : ${newFilms.annee} </span>
                <span>Genre : ${newFilms.genre} </span>
                <span> Par : ${newFilms.realisateur} </span>
                <p>${newFilms.text} </p>
            </div>
            <div class="image">
                <img src="${newFilms.image}" alt=" image ${newFilms.title}">
            </div>
        </div>
            `
    }

    /****************** methode to search for movies and display the corresponding movies*******************/

    search_forMovies(event) {
        event.preventDefault()
        console.log(sear);
        let value = event.target.value.trim();
        console.log(value);
        this.films = [...filmData]
        this.films = this.films.filter((film) => film.title.toLowerCase().search(value.toLowerCase()) !== -1)
        console.log(this.films);
        this.display_availableMovies(this.films)
    }

    /****************** method to filter movies by date, genre, and producer*******************/



    /*****1-method to filter by date*********/

    filter_byDate(event) {
        event.preventDefault
        let value = seach.elementss["search"].value.trim();
        this.films = [...filmData]
        this.films = this.films.filter((film) => film.annee.search(parseInt(value)) !== -1)
        this.display_availableMovies()



    }

    /*****2-method to filter by genre*********/

    filter_byGenre(event) {
        event.preventDefault()
        let value = filterSelect.value.trim();
        console.log(value);
        // this.films = [...filmData]
        this.films = filmData.filter((film) => film.genre.toLowerCase().search(value.toLowerCase()) !== -1)
        console.log(this.films);
        value === "tout" ? this.films = [...filmData] : null;
        this.display_availableMovies(this.films)



    }





    /*****1-method to filter by producer*********/

    // filter_byProducer() {



    // }

    /******************method to read files (banner) of movies *******************/

    read_andGetURL(event) {
        const file = event.target.files[0];
        const read = new FileReader()
        read.onload = (event) => {
            url = event.target.result
            console.log(url);
           
            preview.src = url
        }
        read.readAsDataURL(file)
    }

    /******************method to add movies*******************/

    add_movie(movie) {
        filmData.unshift(movie)
        this.films = [...filmData]
        console.log(this.films);
        
        this.display_availableMovies(this.films)
        this.display_currentMovies(movie)
    }

    /******************method to handle the event after edit btn pressed*******************/

    handle_edit(event) {
        const id = event.target.dataset.id
        current_movie = filmData.find((film) => film.id == id)
        form.elements["title"].value = current_movie.title
        url = current_movie.image
        form.elements["text"].value = current_movie.text
        form.elements["annee"].value = current_movie.annee
        form.elements["genre"].value = current_movie.genre
        console.log(current_movie);
        console.log(current_movie.genre);
        form.elements["realisateur"].value = current_movie.realisateur
        preview.src = url
        setEvent.displayModal()
        
    }

    /******************method to edit or modify available movies*******************/

    // edit_movies() {

    // }

    /******************method to update the modification or editing  of available movies*******************/

    update_Movies(id, film) {
        let index = filmData.findIndex((film) => film.id === id)
        if (index !== -1) {
            filmData[index] = { ...filmData[index], ...film }
        }
        this.films = [...filmData]
        this.display_availableMovies()
        this.display_currentMovies(film)
    }

    /****************** method to handle the event after delete btn pressed *******************/

    handle_delete(event) {
        const id = event.target.dataset.id
        console.log(id);
        current_movie = filmData.find((film) => film.id == id)
    }



    /******************method to handle the movies after confirmation to delete that*******************/

    handle_deletedMovie() {
        this.delete_movies(current_movie.id)
        this.display_availableMovies(this.films)

    }

    /******************method to delete movies*******************/

    delete_movies(id) {
        filmData.filter((film) => film.id !== id)
        this.films = [...filmData]
        this.display_availableMovies()

    }

    /******************method to validate movies data on form of edit and submited movies*******************/

    validate_movies() {



    }

    /******************method to displays error messages*******************/

    display_errorMessage() {



    }







    /******************method to submit movies data*******************/

    submit_data(event) {
        event.preventDefault()
        var newFilms = {
            title: form.elements["title"]?.value,
            image: url,
            text: form.elements["text"]?.value,
            realisateur: form.elements["realisateur"]?.value,
            annee: form.elements["annee"]?.value,
            genre:form.elements["genre"]?.value,
           

        }
        console.log(url);


        if (current_movie) {
            this.update_Movies(current_movie.id, newFilms)
            setEvent.closeModale()
        } else {
            newFilms.id = Math.ceil(Math.random() * 9999);
            this.add_movie(newFilms);
            setEvent.closeModale()

        }

    }


}

































