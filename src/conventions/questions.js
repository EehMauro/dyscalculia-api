export default [
  {
    id: 'q01',
    type: 'multiple-choice-question',
    label: '¿Cuál es menor: 27 o 32?',
    options: ['27', '32'],
    correctAnswer: '27'
  },
  {
    id: 'q02',
    type: 'multiple-choice-question',
    label: '¿Cuánto es el doble de 8?',
    options: ['16', '4', '10'],
    correctAnswer: '16'
  },
  {
    id: 'q03',
    type: 'multiple-choice-question',
    label: '¿Cuánto es 13 + 39?',
    options: ['26', '49', '52'],
    correctAnswer: '52'
  },
  {
    id: 'q04',
    type: 'multiple-choice-question',
    label: 'En un colectivo van veinticinco personas. En la primera parada se bajan seis y se suben dos. ¿Cuántas personas quedan en el colectivo?',
    options: ['21', '19', '17', '27'],
    correctAnswer: '21'
  },
  {
    id: 'q05',
    type: 'multiple-choice-question',
    label: '¿Qué número viene 5 números después de 49?',
    options: ['54', '44', '99'],
    correctAnswer: '54'
  },
  {
    id: 'q06',
    type: 'multiple-choice-question',
    label: '¿Qué número está más cerca del 31?',
    options: ['28', '40', '36'],
    correctAnswer: '28'
  },
  {
    id: 'q07',
    type: 'multiple-choice-question',
    label: '¿Cuántos huevos hay en dos docenas y media?',
    options: ['24 huevos', '36 huevos', '30 huevos'],
    correctAnswer: '30 huevos'
  },
  {
    id: 'q08',
    type: 'multiple-choice-question',
    label: 'Si un libro cuesta $380, ¿cuánto costará una decena de libros?',
    options: ['$38000', '$380', '$3800'],
    correctAnswer: '$3800'
  },
  {
    id: 'q09',
    type: 'multiple-choice-question',
    label: 'Tengo tres naranjas y media. ¿Cuántas medias naranjas tengo?',
    options: ['7 medias naranjas', '8 medias naranjas', '4 medias naranjas', '5 medias naranjas'],
    correctAnswer: '7 medias naranjas'
  },
  {
    id: 'q10',
    type: 'multiple-choice-question',
    label: 'Han bajado 183 pasajeros del subte y aún quedan dentro 328 pasajeros. ¿Cuántos pasajeros había en el subte?',
    options: ['511 pasajeros', '366 pasajeros', '145 pasajeros'],
    correctAnswer: '511 pasajeros'
  },
  {
    id: 'q11',
    type: 'multiple-choice-question',
    label: 'Un teatro tiene 12 secciones. Cada sección tiene 8 filas y cada fila tiene 10 asientos. ¿Cuántos asientos hay en total?',
    options: ['200 asientos', '960 asientos', '216 asientos'],
    correctAnswer: '960 asientos'
  },
  {
    id: 'q12',
    type: 'multiple-choice-question',
    label: '¿Qué expresión utilizaría para resolver este problema? La temperatura a las cuatro en punto era de 25°C. A las nueve de la noche, era de 13°C. ¿Cuánto bajó la temperatura?',
    options: ['9 - 4', '25 + 13', '25 - 13', '25 + 4 - 13'],
    correctAnswer: '25 - 13'
  },
  {
    id: 'q13',
    type: 'multiple-choice-question',
    label: '¿Qué diferencia es menor, la diferencia entre 99 y 92 o la diferencia entre 25 y 11?',
    options: ['La diferencia entre 99 y 92', 'La diferencia entre 25 y 11'],
    correctAnswer: 'La diferencia entre 99 y 92'
  },
  {
    id: 'q14',
    type: 'multiple-choice-question',
    label: 'En una clase hay 30 alumnos. El día que faltan 6, el porcentaje de inasistencias es...',
    options: ['6%', '5%', '2%', '20%'],
    correctAnswer: '20%'
  },
  {
    id: 'q15',
    type: 'multiple-choice-question',
    label: '¿Aproximadamente cuántos vasos estimás que hay?',
    image: '/images/glasses.png',
    options: ['Entre 50 y 100', 'Entre 0 y 20', 'Más de 200'],
    correctAnswer: 'Entre 50 y 100'
  },
  {
    id: 'q16',
    type: 'multiple-choice-question',
    label: 'Quiero comprar un reloj que cuesta $572 y un cuadro de $512, ¿Me alcanza $1000 para comprar ambos?',
    options: ['Si', 'No'],
    correctAnswer: 'No'
  },
  {
    id: 'q17',
    type: 'scale-question',
    label: 'Deslizá el círculo sobre la linea y ubicalo en la posición que corresponda al número 70',
    correctAnswer: 70
  },
  {
    id: 'q18',
    type: 'multiple-choice-question',
    label: '¿Que porcentaje de la figura está coloreada?',
    image: '/images/fraction.png',
    options: ['Menor a 10', 'Entre 10 y 25', 'Entre 25 y 50'],
    correctAnswer: 'Entre 10 y 25'
  },
  {
    id: 'q19',
    type: 'visuospatial-question',
    label: 'Seleccione la figura que es igual a la que se muestra a continuación',
    image: '/images/visuospatial.png',
    options: ['/images/visuospatial-answer-1.png', '/images/visuospatial-answer-2.png', '/images/visuospatial-answer-3.png'],
    correctAnswer: 1
  },
  {
    id: 'q20',
    type: 'mirror-question',
    label: '¿Son estas imágenes figuras espejadas una de la otra?',
    imageOriginal: '/images/mirror-1.png',
    imageMirrored: '/images/mirror-2.png',
    correctAnswer: 'Si'
  }
];
