import { blobToURL, fileToBlob } from './lib/fileHelpers.js';
import { addFilm, deleteFilm, getFilm, initFilms, updateFilm } from './db/storage.js';
import { Film } from './models/Film.js';
// import { current_movie } from './tash/functions.js';

window.onload = async () => {

    const formModal = document.querySelector('.formModal')
    const form = document.querySelector('.formModal form')
    const closeFormModal = document.querySelector('.formModal #close')
    const addFilmButton = document.querySelector('.addFilmButton')
    const previewImg = document.querySelector('#preview')
    const searchByTitle = document.querySelector("#search")
    const searchGenre = document.querySelector("#filter_genre")
    const searchBy_date = document.querySelector("#filter_date")
    var currentFilm = undefined


    const toogleModal = () => {
        formModal.classList.toggle('d-none')
    }
    /**
     * 
     * @param {Array} films Tabeau des films à afficher
     */
    const displayFilms = async (movies) => {
        form.reset()
        const films_list = document.querySelector('.films_list')
        films_list.innerHTML = '';

        const films = await initFilms()
        films.forEach((data) => {
            const film = new Film(data._id, data.title, data.realisateur, data.text, data.genre, data.annee, data.image)
            films_list.innerHTML += film.getHTMLCode()


        })
        if (movies) {
            films_list.innerHTML = '';
            movies.forEach((film) => {
                const films = new Film(film._id, film.title, film.realisateur, film.text, film.genre, film.annee, film.image)
                films_list.innerHTML += films.getHTMLCode()
            })


        }

        viewFilm(films[0])

        const editFilmButtons = document.querySelectorAll('.editFilmButton')
        editFilmButtons.forEach(editFilm => {
            editFilm.onclick = handleEdit

        });
        const filmsView = document.querySelectorAll(".film")
        filmsView.forEach((filmView) => {
            filmView.onclick = handlecurentFilm
        })
        const deleteFilmButtons = document.querySelectorAll('.deleteFilmButton')
        deleteFilmButtons.forEach(deleteFilm => {
            deleteFilm.onclick = handleDelete

        });
    }

    const saveFilm = async (film) => {
        // filmData.unshift(film)
        if (currentFilm) {
            // update
            await updateFilm(film)
        } else {
            //add
            await addFilm(film)

        }
        viewFilm(film)

        await displayFilms()
        toogleModal()

    }
    const handlecurentFilm = async (event) => {
        let id = parseInt(event.target.dataset.id)
        console.log(id);
        if (id) {
            const film = await getFilm(id)
            viewFilm(film)
            console.log(film);

        }




    }

    const viewFilm = (film) => {
        console.log("hello");
        const movie = new Film(film._id, film.title, film.realisateur, film.text, film.genre, film.annee, film.image)
        // films_list.innerHTML += film.getHTMLCode()
        document.querySelector(".currentFilm").innerHTML = movie.getviewHtmlcode()


    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let fileBlob
        if (form.elements["image"].files[0]) {
            fileBlob = await fileToBlob(form.elements["image"].files[0])
        }

        var newFilm = new Film(
            '',
            form.elements["title"]?.value,
            form.elements["realisateur"]?.value,
            form.elements["text"]?.value,
            form.elements["genre"]?.value,
            form.elements["annee"]?.value,
            fileBlob
        )

        // Validation des données reçues
        if (!newFilm.isValid()) {
            // afficher les messages d'erreurs
        }

        if (currentFilm) {
            // update
            newFilm._id = currentFilm._id
            if (!form.elements["image"].files[0]) {
                newFilm.image = currentFilm.image
            }

        } else {
            //add
            newFilm.image

        }

        saveFilm(newFilm)
        // viewFilm(newFilm)







    }
    const handlesearch = {
        searchBy_title: async (event) => {

            event.preventDefault();
            let tag = searchByTitle.value.trim();
            console.log(tag);
            var films = await initFilms()


            films = films.filter(
                (t) => t.title.toLowerCase().search(tag.toLowerCase()) !== -1 || t.realisateur.toLowerCase().search(tag.toLowerCase()) !== -1
            );
            console.log({ films });
            displayFilms(films);

        },
        searchBy_genre: async (event) => {

            event.preventDefault();
            let tag = searchGenre.value.trim();
            console.log(tag);
            var films = await initFilms()
            if (tag !== "tout") {

                films = films.filter(
                    (t) => t.genre.toLowerCase().search(tag.toLowerCase()) !== -1
                );
            }




            console.log({ films });
            displayFilms(films);

        },
        search_by_date: async (event) => {

            event.preventDefault();
            let tag = parseInt(searchBy_date.value.trim());
            console.log(tag);
            var films = await initFilms()


            
            films = films.filter(
                (film) => film.annee === tag
            );





            console.log({ films });
            displayFilms(films);

        }

    }
    const handleEdit = async (event) => {
        try {
            console.log('target : ', event.target);
            let targetElement = event.target
            let id = targetElement.dataset.id;
            console.log(id);
            if (!id) {
                let parent = targetElement.closest('.editFilmButton')
                if (parent) {
                    id = parent.dataset.id
                }
            }

            const film = (await initFilms()).find(d => d._id == id)
            console.log({ film, id });
            if (film) {
                currentFilm = film
                console.log(currentFilm);
                document.querySelector(".currentFilm").innerHTML = currentFilm.getviewHtmlcode()
                form.elements["title"].value = currentFilm.title
                form.elements["realisateur"].value = currentFilm.realisateur
                form.elements["text"].value = currentFilm.text
                form.elements["genre"].value = currentFilm.genre
                form.elements["annee"].value = currentFilm.annee
                if (typeof currentFilm.image == "string") {
                    previewImg.src = currentFilm.image
                } else {
                    previewImg.src = blobToURL(currentFilm.image)
                }

                formModal.classList.remove('d-none')
            }

        } catch (error) {
            console.log(error)
        }

    }
    const handleDelete = async (event) => {
        try {

            let targetElement = event.target

            let id = targetElement.dataset.id;
            console.log(id);
            if (!id) {
                let parent = targetElement.closest('.deleteFilmButton')
                if (parent) {
                    id = parent.dataset.id
                }
            }
            id = parseInt(id)

            const film = (await initFilms()).find(d => d._id == id)
            console.log(film);

            const confirmDelete = confirm(`Êtes vous sûr de vouloir supprimer le film : ${film?.title}`)
            if (confirmDelete) {
                deleteFilm(id)

            }
            displayFilms()


        } catch (error) {
            console.log(error)
        }

    }





    displayFilms()
    addFilmButton.onclick = toogleModal
    searchByTitle.onkeyup = handlesearch.searchBy_title
    searchGenre.onchange = handlesearch.searchBy_genre
    searchBy_date.onkeyup = handlesearch.search_by_date
    closeFormModal.onclick = toogleModal
    form.onsubmit = handleSubmit

}