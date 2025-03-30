const readline = require('readline');

// Configuración de readline para entrada de usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Arreglos para almacenar los datos
const nombres = [];
const notasEstudiantes = [];
const promedios = [];
let aprobados = 0;
let reprobados = 0;

// Función para ingresar el nombre del estudiante
function ingresarNombre() {
  return new Promise((resolve) => {
    rl.question('Ingrese el nombre completo del estudiante: ', (nombre) => {
      resolve(nombre);
    });
  });
}

// Función para ingresar las 4 notas del estudiante
function ingresarNotas() {
  return new Promise((resolve) => {
    const notas = [];
    let contador = 0;

    function pedirNota() {
      if (contador < 4) {
        rl.question(`Ingrese la nota ${contador + 1} (0-10): `, (nota) => {
          const notaNum = parseFloat(nota);
          
          if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
            console.log('Por favor ingrese una nota válida entre 0 y 10');
            pedirNota();
          } else {
            notas.push(notaNum);
            contador++;
            pedirNota();
          }
        });
      } else {
        resolve(notas);
      }
    }

    pedirNota();
  });
}

// Función para calcular el promedio
function calcularPromedio(notas) {
  const suma = notas.reduce((total, nota) => total + nota, 0);
  return suma / notas.length;
}

// Función principal del programa
async function main() {
  // Solicitar cantidad de estudiantes
  const cantidadEstudiantes = await new Promise((resolve) => {
    rl.question('¿Cuántos estudiantes desea registrar? ', (cantidad) => {
      resolve(parseInt(cantidad));
    });
  });

  // Validar entrada
  if (isNaN(cantidadEstudiantes) || cantidadEstudiantes <= 0) {
    console.log('Debe ingresar un número válido de estudiantes');
    rl.close();
    return;
  }

  // Registrar cada estudiante
  for (let i = 0; i < cantidadEstudiantes; i++) {
    console.log(`\nRegistro del estudiante ${i + 1}:`);
    
    const nombre = await ingresarNombre();
    const notas = await ingresarNotas();
    const promedio = calcularPromedio(notas);

    // Almacenar datos
    nombres.push(nombre);
    notasEstudiantes.push(notas);
    promedios.push(promedio);

    // Contar aprobados/reprobados
    if (promedio >= 7) {
      aprobados++;
    } else {
      reprobados++;
    }
  }

  // Mostrar reporte individual
  console.log('\n=== Reporte de Estudiantes ===');
  for (let i = 0; i < nombres.length; i++) {
    console.log(`\nEstudiante: ${nombres[i]}`);
    console.log(`Notas: ${notasEstudiantes[i].join(', ')}`);
    console.log(`Promedio: ${promedios[i].toFixed(2)}`);
    console.log(`Estado: ${promedios[i] >= 7 ? 'APROBADO' : 'REPROBADO'}`);
  }

  // Mostrar resumen general
  console.log('\n=== Resumen General ===');
  console.log(`Total de estudiantes: ${nombres.length}`);
  console.log(`Aprobados: ${aprobados}`);
  console.log(`Reprobados: ${reprobados}`);

  rl.close();
}

// Ejecutar el programa
main();