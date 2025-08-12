/**
 * Script to capitalize the first letter of genitive and spanishTranslation fields
 * in vocabulary-normalized.json
 */

const fs = require('fs');
const path = require('path');

// Función para capitalizar la primera letra
function capitalizeFirst(str) {
  if (!str) return str;
  // Manejar casos especiales con macrones (ā, ē, ī, ō, ū)
  if (str[0] === 'ā') return 'Ā' + str.slice(1);
  if (str[0] === 'ē') return 'Ē' + str.slice(1);
  if (str[0] === 'ī') return 'Ī' + str.slice(1);
  if (str[0] === 'ō') return 'Ō' + str.slice(1);
  if (str[0] === 'ū') return 'Ū' + str.slice(1);
  
  // Capitalización normal
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Leer el archivo
const filePath = path.join(__dirname, '..', 'vocabulary-normalized.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Procesar cada palabra
const updatedData = data.map(word => {
  return {
    ...word,
    genitive: capitalizeFirst(word.genitive),
    spanishTranslation: capitalizeFirst(word.spanishTranslation)
  };
});

// Escribir el archivo actualizado
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log('✅ Archivo actualizado exitosamente');
console.log(`📊 Total de palabras procesadas: ${updatedData.length}`);

// Mostrar algunos ejemplos
console.log('\n📝 Ejemplos de cambios:');
for (let i = 0; i < 5; i++) {
  console.log(`  ${updatedData[i].nominative}:`);
  console.log(`    Genitivo: ${updatedData[i].genitive}`);
  console.log(`    Traducción: ${updatedData[i].spanishTranslation}`);
}