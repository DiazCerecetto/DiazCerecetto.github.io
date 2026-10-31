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
