// Tema claro u oscuro: sigue al sistema hasta que el visitante elige uno con el botón.
// Se carga en el <head> para aplicar el tema guardado antes de pintar la página.

const raiz = document.documentElement;
const consultaOscuro = matchMedia("(prefers-color-scheme: dark)");

try {
  const guardado = localStorage.getItem("tema");
  if (guardado === "claro" || guardado === "oscuro") raiz.dataset.tema = guardado;
} catch {}

function temaActual() {
  return raiz.dataset.tema ?? (consultaOscuro.matches ? "oscuro" : "claro");
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector(".cambiar-tema");
  if (!boton) return;

  function actualizarBoton() {
    const texto = temaActual() === "oscuro" ? "Pasar a modo claro" : "Pasar a modo oscuro";
    boton.setAttribute("aria-label", texto);
    boton.title = texto;
  }

  function cambiar() {
    const nuevo = temaActual() === "oscuro" ? "claro" : "oscuro";
    raiz.dataset.tema = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {}
    actualizarBoton();
  }

  actualizarBoton();
  consultaOscuro.addEventListener("change", actualizarBoton);

  boton.addEventListener("click", () => {
    const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || sinMovimiento) {
      cambiar();
      return;
    }

    // El tema nuevo se abre en un círculo que nace del botón
    const caja = boton.getBoundingClientRect();
    const x = caja.left + caja.width / 2;
    const y = caja.top + caja.height / 2;
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(cambiar).ready.then(() => {
      raiz.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  });
});
