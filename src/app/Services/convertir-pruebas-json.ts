// import * as fs from "fs";
// import * as path from "path";



// // Carpeta donde se crearán los JSON
// const outputDir = path.join(__dirname, "jsons");

// // Crear la carpeta si no existe
// if (!fs.existsSync(outputDir)) {
//   fs.mkdirSync(outputDir);
// }

// // Recorrer cada prueba y crear un archivo JSON con el nombre del título
// Object.values(PRUEBAS_DATA).forEach((prueba) => {
//   // Reemplazar caracteres inválidos en el nombre de archivo
//   const nombreArchivo = prueba.titulo.replace(/[/\\?%*:|"<>]/g, "-") + ".json";
//   const filePath = path.join(outputDir, nombreArchivo);

//   fs.writeFileSync(filePath, JSON.stringify(prueba, null, 2), "utf-8");
//   console.log(`Archivo creado: ${filePath}`);
// });

// console.log("¡Todos los JSONs han sido generados!");