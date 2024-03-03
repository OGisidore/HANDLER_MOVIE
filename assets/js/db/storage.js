import { LocalDatabase } from "./LocalDatabase.js";

const dbStructure = [
    {
        'films': [
            {
                primaryKey: '_id',
                indexes: [
                    { name: { unique: true } }
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
const database = new LocalDatabase('mudey', dbStructure,  3 )

export const initFilms = async () => {
    return await database.getAllData('films')
}
export const addFilm = async (newFilms) => {
    delete newFilms._id
    await database.addData('films', newFilms)
}
export const updateFilm = async (newFilms) => {
    await database.updateData('films', newFilms)
}
export const deleteFilm = async (id) => {
    await database.deleteData('films', id)
}