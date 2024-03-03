// Importez la fonction blobToURL depuis votre fichier fileHelpers
import { blobToURL } from "../lib/fileHelpers.js";


export class Film {
    /**
     * @param {string} id 
     * @param {string} title 
     * @param {string} realisateur 
     * @param {string} text 
     * @param {string} genre 
     * @param {number} annee 
     * @param {Blob | string} image 
     */
    constructor(id, title, realisateur, text, genre, annee, image) {
        this._id = id;
        this.title = title;
        this.realisateur = realisateur;
        this.text = text;
        this.genre = genre;
        this.annee = annee;
        this.image = image;
    }

    getHTMLCode() {
        if (typeof this.image !== 'string') {
            this.image = blobToURL(this.image);
        }

     
        return `
        <div class="film film-item" id="film-${this._id}" data-id="${this._id}">
            <img src="${this.image}" alt="images du film ${this.title}">
            <svg class="deleteFilmButton" data-id="${this._id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
            <svg class="editFilmButton" data-id="${this._id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
            </svg>
        </div>`;
    }

    display() {
        // Replace the console.log statement with the desired action
        console.log("Film details:", this);
        // For example, you could open a modal or navigate to a new page with more details
    }

     /**
     * Récupère les validateurs pour chaque champ
     * @return {Object} - un objet contenant les validateurs pour chaque champ.
     */
     get validators() {
        const minLengthTitle = 10;
        const minLengthText = 50;

        const errors = [];

        if (!this.title || this.title.length < minLengthTitle) {
            errors.push({
                target: "title",
                errorMessage: `Le champ 'title' doit contenir au moins ${minLengthTitle} caractères.`
            });
        }

        if (!this.realisateur) {
            errors.push({
                target: "realisateur",
                errorMessage: "Le champ 'realisateur' est obligatoire."
            });
        }

        if (!this.text || this.text.length < minLengthText) {
            errors.push({
                target: "text",
                errorMessage: `Le champ 'text' doit contenir au moins ${minLengthText} caractères.`
            });
        }

        if (!this.genre) {
            errors.push({
                target: "genre",
                errorMessage: "Le champ 'genre' est obligatoire."
            });
        }

        if (!this.annee || isNaN(this.annee)) {
            errors.push({
                target: "annee",
                errorMessage: "Le champ 'annee' doit être un nombre valide."
            });
        }

        if (!this._id && !this.image) {
            errors.push({
                target: "image",
                errorMessage: "Le champ 'image' est obligatoire."
            });
        }

        // Ajoutez d'autres conditions de validation selon vos besoins

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

}
