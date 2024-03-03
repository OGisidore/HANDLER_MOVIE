/**
 * Represents a local IndexedDB database.
 */
export class LocalDatabase {

    /**
     * Creates an instance of LocalDatabase.
     * @param {string} dbName - The name of the database.
     * @param {Array} dataStructure - The structure of the database including table names, indexes, and primary keys.
     * @param {number} [dbVersion=1] - The version of the database.
     */
    constructor(dbName, dataStructure, dbVersion = 1) {
        this.dbName = dbName;
        this.dataStructure = dataStructure;
        this.dbVersion = dbVersion;

        this.dbPromise = this.openDatabase();
    }

    /**
     * Opens the IndexedDB database and creates or upgrades the object stores based on the provided data structure.
     * @returns {Promise} A promise that resolves with the opened database.
     */
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (event) => {
                let db = event.target.result;

                if (this.dataStructure.length) {
                    this.dataStructure.forEach(tableData => {
                        const tableName = Object.keys(tableData)[0];
                        const indexes = tableData[tableName][0].indexes;
                        const primaryKey = tableData[tableName][0].primaryKey || '_id';

                        if (!db.objectStoreNames.contains(tableName)) {
                            const objectStore = db.createObjectStore(tableName, {
                                keyPath: primaryKey,
                                autoIncrement: true
                            });

                            if (indexes && indexes.length > 0) {
                                indexes.forEach(index => {
                                    const indexName = Object.keys(index)[0];
                                    const unique = index[indexName].unique;

                                    objectStore.createIndex(indexName, indexName, {
                                        unique: unique || false
                                    });
                                });
                            }
                        }
                    });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                const error = event.target.error;
                reject("Error when opening database:", error);
            };
        });
    }

    /**
     * Adds data to the specified table in the database.
     * @param {string} dbTable - The name of the table.
     * @param {Object} data - The data to be added.
     * @returns {Promise} A promise that resolves when data is added successfully.
     */
    async addData(dbTable, data) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            objectStore.add(data);

            transaction.oncomplete = () => {
                resolve('Data added successfully');
            };

            transaction.onerror = (event) => {
                reject('Error adding data:', event.target.errorCode);
            };
        });
    }

    /**
     * Updates data in the specified table in the database.
     * @param {string} dbTable - The name of the table.
     * @param {Object} data - The data to be updated.
     * @returns {Promise} A promise that resolves when data is updated successfully.
     */
    async updateData(dbTable, data) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            objectStore.put(data);

            transaction.oncomplete = () => {
                resolve('Data updated successfully');
            };

            transaction.onerror = (event) => {
                reject('Error updating data:', event.target.errorCode);
            };
        });
    }

    /**
     * Retrieves data from the specified table in the database based on the provided key.
     * @param {string} dbTable - The name of the table.
     * @param {any} key - The key to search for.
     * @returns {Promise} A promise that resolves with the retrieved data.
     */
    async getData(dbTable, key) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readonly');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.get(key);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error getting data:', event.target.errorCode);
            };
        });
    }

    /**
     * Retrieves all data from the specified table in the database.
     * @param {string} dbTable - The name of the table.
     * @returns {Promise} A promise that resolves with all retrieved data.
     */
    async getAllData(dbTable) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readonly');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error getting all data:', event.target.errorCode);
            };
        });
    }

    /**
     * Searches for records in a specified table based on a given index and value.
     * @param {string} tableName - The name of the table.
     * @param {string} indexName - The name of the index to search.
     * @param {any} searchValue - The value to search for.
     * @returns {Promise} A promise that resolves with the search results.
     */
    async search(tableName, indexName, searchValue) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);
            const index = objectStore.index(indexName);
            const request = index.openCursor(IDBKeyRange.only(searchValue));

            const results = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event) => {
                const error = event.target.error;
                reject("Error when searching:", error);
            };
        });
    }

    /**
     * Deletes data from the specified table in the database based on the provided key.
     * @param {string} dbTable - The name of the table.
     * @param {any} key - The key to identify the data to be deleted.
     * @returns {Promise} A promise that resolves when data is deleted successfully.
     */
    async deleteData(dbTable, key) {
        if (!this.db) {
            this.db = await this.dbPromise;
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.delete(key);

            transaction.oncomplete = () => {
                resolve('Data deleted successfully');
            };

            transaction.onerror = (event) => {
                reject('Error deleting data:', event.target.errorCode);
            };
        });
    }
}
