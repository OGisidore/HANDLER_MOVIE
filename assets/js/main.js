import { blobToURL, fileToBlob } from './lib/fileHelpers.js';
import { addFilm, deleteFilm, getFilm, initFilms, searchFilm, updateFilm } from './db/storage.js';
import { Film } from './models/Film.js';

window.onload = async () => {

    const formModal = document.querySelector('.formModal')
    const form = document.querySelector('.formModal form')
    const closeFormModal = document.querySelector('.formModal #close')
    const addFilmButton = document.querySelector('.addFilmButton')
    const previewImg = document.querySelector('#preview')
    const searchBox = document.querySelector('#search')
    var currentFilm = undefined


    const hideModal = () => {
        form.reset()
        previewImg.src = ''
        formModal.classList.add('d-none')
    }
    const showModal = () => {
        form.reset()
        previewImg.src = ''
        formModal.classList.remove('d-none')
    }
    const toogleModal = () => {
        formModal.classList.toggle('d-none')
    }
    /**
     * 
     * @param {Array} films Tabeau des films à afficher
     */
    const displayFilms = async (films = null) => {
        form.reset()
        const films_list = document.querySelector('.films_list')
        films_list.innerHTML = ''
        if(!films){
            films = await initFilms()
        }
        films.forEach((data) => {
            const film = new Film(data._id, data.title, data.realisateur, data.text, data.genre, data.annee, data.image)
            films_list.innerHTML += film.getHTMLCode()


        })

        const editFilmButtons = document.querySelectorAll('.editFilmButton')
        editFilmButtons.forEach(editFilm => {
            editFilm.onclick = handleEdit

        });

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
        await displayFilms()
        toogleModal()

    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let fileBlob
        if (form.elements["image"].files[0]) {
            fileBlob = await fileToBlob(form.elements["image"].files[0])
        }

        var newFilm = new Film(
            currentFilm?._id || '',
            form.elements["title"]?.value,
            form.elements["realisateur"]?.value,
            form.elements["text"]?.value,
            form.elements["genre"]?.value,
            form.elements["annee"]?.value,
            fileBlob
        )

        // Validation des données reçues
        if (!newFilm.validators.isValid) {
            // afficher les messages d'erreurs
            const errors = newFilm.validators.errors;
            errors.forEach(error => {
                const errorElement = document.querySelector('.error-' + error.target);
                if (errorElement) {
                    errorElement.innerHTML = error.errorMessage;
        
                    // Supprimer l'erreur après un certain temps (par exemple, 5 secondes)
                    setTimeout(() => {
                        errorElement.innerHTML = '';
                    }, 2000); // ajustez le délai en millisecondes selon vos besoins
                }
            });
            return;
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







    }
    const handleEdit = async (event) => {
        try {

            let targetElement = event.target
            let id = targetElement.dataset.id;
            if (!id) {
                let parent = targetElement.closest('.editFilmButton')
                if (parent) {
                    id = parent.dataset.id
                }
            }

            id = parseInt(id)
            const film = await getFilm(id)

            console.log({ film, id });
            if (film) {
                currentFilm = film
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
            if (!id) {
                let parent = targetElement.closest('.deleteFilmButton')
                if (parent) {
                    id = parent.dataset.id
                }
            }

            id = parseInt(id)
            const film = await getFilm(id)
            console.log(film);

            const confirmDelete = confirm(`Êtes vous sûr de vouloir supprimer le film : ${film?.title}`)
            if (confirmDelete) {
                deleteFilm(id)
                displayFilms()
            }



        } catch (error) {
            console.log(error)
        }

    }

    const handleFileChange = (event) => {
        const { files } = event.target
        if (files[0]) {
            previewImg.src = blobToURL(files[0])
        }
    }


    const handleSearch = async (event) => {
        const { value } = event.target
        const films = await searchFilm(value)
        displayFilms(films)
        
    }





    displayFilms()
    addFilmButton.onclick = showModal
    closeFormModal.onclick = hideModal
    form.onsubmit = handleSubmit
    searchBox.onkeyup = handleSearch
    form.querySelector("input[type='file']").onchange = handleFileChange

}