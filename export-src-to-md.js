const fs = require('fs');
const path = require('path');

// Directorio del frontend de Angular
const srcDir = path.join(__dirname, 'front', 'src');
// Archivo de salida
const outputFile = path.join(__dirname, 'frontend-src.md');

// Función para leer recursivamente los archivos
function readFilesRecursively(dir) {
  let content = '';
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Si es un directorio, seguimos leyendo dentro
      content += readFilesRecursively(filePath);
    } else {
      // Si es un archivo, leemos su contenido y lo añadimos
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(srcDir, filePath).replace(/\\/g, '/');
      
      content += `--- Archivo: /src/${relativePath} ---\n\n`;
      content += '```' + (path.extname(file).substring(1) || 'text') + '\n';
      content += fileContent;
      content += '\n```\n\n';
    }
  });

  return content;
}

try {
  console.log(`Analizando el directorio: ${srcDir}`);
  const markdownContent = readFilesRecursively(srcDir);
  fs.writeFileSync(outputFile, markdownContent, 'utf8');
  console.log(`¡Éxito! El código del frontend ha sido exportado a: ${outputFile}`);
} catch (error) {
  console.error('Ocurrió un error al generar el archivo:', error);
}