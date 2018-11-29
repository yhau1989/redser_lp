function interaccion(area) {

    //console.log(area);
    console.log(`area seleccionada: ${area.target.id}`);
    console.log(`plugins: ${area.target.dataset.plugins}`);

    setViewPluginsByCaseStudi_cs(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bor(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bof(area.target.dataset.plugins);

}

const areas = document.querySelectorAll("area");
areas.forEach(area => {
    area.addEventListener("click", interaccion)
});