const preguntas = [
  "¿Cuál es mi nombre?",
  "¿Qué color es mi favorito?",
  "¿Qué comida me gusta?",
  "¿Qué estudio?",
  "¿Qué animal me gusta?",
  "¿Qué prefiero, el frío o el calor?",
  "¿Cuál es mi pasatiempo favorito?",
  "¿Prefiero motos o carro?",
  "¿Madrugar o transnochar?",
  "¿Qué películas prefiero?",
];

const opciones = [
  ["Mateo", "Dilan", "Juan", "Andrés"],
  ["Rojo", "Azul", "Morado", "Verde"],
  ["Pizza", "Salchipapas", "Hamburguesa", "Tacos"],
  ["Medicina", "Derecho", "Programación", "Arquitectura"],
  ["Gatos", "Perros", "Pájaros", "Conejos"],
  ["Frío", "Calor", "Ambos", "Ninguno"],
  ["Dormir", "Fútbol", "Dibujar", "TV"],
  ["Carro", "Motos", "Bicicleta", "Caminar"],
  ["Transnochar", "Dormir tarde", "Madrugar", "Depende"],
  ["Invasión", "Comedia", "Terror", "Romance"],
];

const respuestas = ["B", "C", "B", "C", "B", "A", "C", "B", "C", "C"];
const letras = ["A", "B", "C", "D"];

let actual = 0;
let intentos = 1;
let bloqueado = false;

const $ = (id) => document.getElementById(id);
const pantallas = { inicio: $("inicio"), juego: $("juego"), final: $("final") };

function mostrar(nombre) {
  Object.values(pantallas).forEach((p) => p.classList.remove("activa"));
  pantallas[nombre].classList.add("activa");
}

function pintarPregunta() {
  bloqueado = false;
  $("contador").textContent = `Pregunta ${actual + 1} de ${preguntas.length}`;
  $("intentos").textContent = `Intentos: ${intentos}`;
  $("progreso-relleno").style.width = `${(actual / preguntas.length) * 100}%`;
  $("pregunta").textContent = preguntas[actual];
  $("mensaje").textContent = "";
  $("mensaje").className = "mensaje";

  const cont = $("opciones");
  cont.innerHTML = "";
  opciones[actual].forEach((texto, i) => {
    const b = document.createElement("button");
    b.className = "opcion";
    b.dataset.l = letras[i];
    b.innerHTML = `<span class="letra">${letras[i]}</span><span></span>`;
    b.lastChild.textContent = texto;
    b.addEventListener("click", () => responder(letras[i], b));
    cont.appendChild(b);
  });
}

function responder(letra, boton) {
  if (bloqueado) return;
  bloqueado = true;
  const botones = [...document.querySelectorAll(".opcion")];
  botones.forEach((b) => (b.disabled = true));
  const msg = $("mensaje");

  if (letra === respuestas[actual]) {
    boton.classList.add("correcta");
    msg.textContent = "✅ ¡Respuesta correcta!";
    msg.classList.add("ok");
    setTimeout(() => {
      actual++;
      if (actual >= preguntas.length) terminar();
      else pintarPregunta();
    }, 900);
  } else {
    boton.classList.add("incorrecta");
    msg.textContent = "❌ Incorrecta. Vuelves al inicio.";
    msg.classList.add("mal");
    setTimeout(() => {
      actual = 0;
      intentos++;
      pintarPregunta();
    }, 1500);
  }
}

function terminar() {
  $("progreso-relleno").style.width = "100%";
  $("resumen").textContent =
    intentos === 1
      ? "¡A la primera, sin fallar!"
      : `Lo lograste en ${intentos} intentos.`;
  mostrar("final");
  lanzarConfeti();
}

function empezar() {
  actual = 0;
  intentos = 1;
  mostrar("juego");
  pintarPregunta();
}

$("btn-empezar").addEventListener("click", empezar);
$("btn-reiniciar").addEventListener("click", empezar);

// Atajos de teclado: A, B, C, D
document.addEventListener("keydown", (e) => {
  if (!pantallas.juego.classList.contains("activa")) return;
  const i = letras.indexOf(e.key.toUpperCase());
  if (i >= 0) document.querySelectorAll(".opcion")[i]?.click();
});

// Confeti
function lanzarConfeti() {
  const c = $("confeti");
  const ctx = c.getContext("2d");
  c.width = innerWidth;
  c.height = innerHeight;
  const colores = ["#ff4d8d", "#ffc93c", "#22c58b", "#4dabf7", "#a66bff"];
  const piezas = Array.from({ length: 160 }, () => ({
    x: Math.random() * c.width,
    y: -Math.random() * c.height,
    r: 5 + Math.random() * 6,
    vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    color: colores[Math.floor(Math.random() * colores.length)],
  }));
  let frames = 0;
  (function anim() {
    ctx.clearRect(0, 0, c.width, c.height);
    piezas.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.r, p.r * 1.6);
    });
    if (++frames < 260) requestAnimationFrame(anim);
    else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
