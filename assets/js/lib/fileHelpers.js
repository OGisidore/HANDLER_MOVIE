/**
 * 
 * @param {File} file Fichier
 * @returns Promesse de blob
 */
export const fileToBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Écouteur d'événement qui sera déclenché lorsque la lecture du fichier est terminée
    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      resolve(blob);
    };

    // Gestionnaire d'erreur
    reader.onerror = (error) => {
      reject(error);
    };

    // Lecture du fichier en tant que ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 
 * @param {Blob} blob Fichier au format blob
 * @returns L'url d'affichage du fichier
 */
export const blobToURL = (blob) => {
  return URL.createObjectURL(blob);
}