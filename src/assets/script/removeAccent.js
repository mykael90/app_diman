export default function removeAccent(texto) {
  texto = texto.replace(/[ÀÁÂÃÄÅ]/, 'A');
  texto = texto.replace(/[àáâãäå]/, 'a');
  texto = texto.replace(/[ÈÉÊË]/, 'E');
  texto = texto.replace(/[Ç]/, 'C');
  texto = texto.replace(/[ç]/, 'c');

  return texto;
}

console.log(removeAccent('água'));
