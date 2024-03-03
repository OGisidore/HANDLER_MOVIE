import { filmData } from "../datas.js";
import { LocalDatabase } from "./LocalDatabase.js";

const dbStructure = [
    {
        'films': [
            {
                primaryKey: '_id',
                indexes: [
                    { title: { unique: true } },
                    { genre: { unique: true } },
                    { annee: { unique: true } },
                ]
            }
        ]
    },
    {
        'users': [
            {
                primaryKey: '_id',
                indexes: []
            }
        ]
    },
    {
        'products': [
            {
                primaryKey: '_id',
                indexes: []
            }
        ]
    }
]
const database = new LocalDatabase('mudey', dbStructure,  2 )

export const initFilms = async () => {
    let films =  await database.getAllData('films')
    if(!films.length){
        await Promise.all(filmData.map(async(film) => await addFilm(film)))
        films =  await database.getAllData('films')
    }
    return films
}
export const getFilm = async (id) => {
    return await database.getData('films', id)
}
export const addFilm = async (newFilms) => {
    delete newFilms._id
    await database.addData('films', newFilms)
}
export const updateFilm = async (newFilms) => {
    await database.updateData('films', newFilms)
}
export const searchFilm = async (tag, indexName='title') => {
    return await database.search('films',indexName, tag)
}
export const deleteFilm = async (id) => {
    await database.deleteData('films', id)
}