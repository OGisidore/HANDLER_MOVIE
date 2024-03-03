import { LocalDatabase } from "./store_indexDB";

const database = new LocalDatabase('handle_movies', ['movies', 'users'], 1);



export const addMovies = (newFilmData) => {
    try {
        database.addData(newFilmData, 'movies')
        console.log("Movies successfully added.");
    } catch (error) {
        console.error("Error adding Movies:", error);
    }
    
};


export const updateMovies = (newFilmData) => {
    try {
        database.updateData(newFilmData, 'movies');
        console.log("Movies successfully updated.");
    } catch (error) {
        console.error("Error updating Movies:", error);
    }
    
};


export const deleteMovies = (id) => {
    
    try {
        database.deleteData(id, 'movies')
        console.log("Movies successfully deleted.");
    } catch (error) {
        console.error("Error deleting Movies:", error);
    }
};



export const initMovies = (Movies = []) => {
    let newFilmData = localStorage.getItem('Movies') ? JSON.parse(localStorage.getItem('Movies')) : [];
    
    if (newFilmData.length === 0) {
        newFilmData = Movies;
    }
    newFilmData.forEach((filmData) => {
        database.addData(filmData, 'movies');
    });
    
   
    
    
    return newFilmData;
};



export const getMovies = () => {
    let newFilmData = localStorage.getItem('Movies') ? JSON.parse(localStorage.getItem('Movies')) : [];
    
  
  
    return newFilmData;
};



export const saveMovies = (newFilmData) => {
    localStorage.setItem('Movies', JSON.stringify(newFilmData));
   
    return newFilmData;
}
