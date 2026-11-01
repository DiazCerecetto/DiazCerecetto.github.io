const buscador = document.querySelector("#buscar-habilidad");
const grupos = document.querySelectorAll(".grupo");
const sinResultados = document.querySelector(".sin-resultados");

function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

buscador.addEventListener("input", () => {
  const consulta = normalizar(buscador.value.trim());
  let total = 0;

  for (const grupo of grupos) {
    const coincideGrupo = normalizar(grupo.querySelector("h3").textContent).includes(consulta);
    let enGrupo = 0;

    for (const habilidad of grupo.querySelectorAll("li")) {
      const visible = coincideGrupo || normalizar(habilidad.textContent).includes(consulta);
      habilidad.hidden = !visible;
      if (visible) enGrupo++;
    }

    grupo.hidden = enGrupo === 0;
    total += enGrupo;
  }

  sinResultados.hidden = total > 0;
});

// Miniaturas: un clic (o Enter) abre la imagen en grande

const enIngles = document.documentElement.lang === "en";
const textoCerrar = enIngles ? "Close" : "Cerrar";
const textoAmpliar = enIngles ? "Enlarge image" : "Ampliar imagen";

const visor = document.createElement("dialog");
visor.className = "visor";
visor.innerHTML = `<img alt=""><p></p><button class="cerrar" type="button" aria-label="${textoCerrar}">×</button>`;
document.body.append(visor);

const imagenVisor = visor.querySelector("img");
const pieVisor = visor.querySelector("p");

function tituloDe(miniatura) {
  return miniatura.closest("li, .item").querySelector("h3, a")?.textContent.trim() ?? "";
}

function abrir(miniatura) {
  const titulo = tituloDe(miniatura);
  imagenVisor.src = miniatura.querySelector("img").src;
  imagenVisor.alt = titulo;
  pieVisor.textContent = titulo;
  visor.showModal();
}

for (const miniatura of document.querySelectorAll(".miniatura")) {
  miniatura.tabIndex = 0;
  miniatura.setAttribute("role", "button");
  miniatura.setAttribute("aria-label", `${textoAmpliar}: ${tituloDe(miniatura)}`);
  miniatura.addEventListener("click", () => abrir(miniatura));
  miniatura.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter" && evento.key !== " ") return;
    evento.preventDefault();
    abrir(miniatura);
  });
}

visor.querySelector(".cerrar").addEventListener("click", () => visor.close());

// Un clic afuera de la imagen (en el fondo oscuro) también cierra
visor.addEventListener("click", (evento) => {
  if (evento.target === visor) visor.close();
});

// Barras de créditos: se llenan y cuentan cuando entran en pantalla

const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

function llenar(barra) {
  const final = Number(barra.dataset.final);
  const etiqueta = barra.nextElementSibling;
  const texto = etiqueta.textContent;
  const inicio = performance.now();
  const duracion = 1200;

  function paso(ahora) {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const valor = Math.round(final * (1 - (1 - t) ** 3));
    barra.value = valor;
    etiqueta.textContent = texto.replace(/^\d+/, valor);
    if (t < 1) requestAnimationFrame(paso);
  }

  requestAnimationFrame(paso);
}

if (!sinMovimiento && "IntersectionObserver" in window) {
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      observador.unobserve(entrada.target);
      llenar(entrada.target);
    }
  }, { threshold: 0.6 });

  for (const barra of document.querySelectorAll(".avance progress")) {
    const etiqueta = barra.nextElementSibling;
    etiqueta.style.minWidth = `${etiqueta.offsetWidth}px`;
    etiqueta.textContent = etiqueta.textContent.replace(/^\d+/, 0);
    barra.dataset.final = barra.value;
    barra.value = 0;
    observador.observe(barra);
  }
}
