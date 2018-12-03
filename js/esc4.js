function interaccion(area) {

    //console.log(area);
    console.log(`area seleccionada: ${area.target.id}`);
    console.log(`area alt: ${area.target.alt}`);
    console.log(`plugins: ${area.target.dataset.plugins}`);
    console.log(`plugins: ${area.target.dataset.plugins}`);



    SeeNodeSelected(area.target.alt);
    setViewPluginsByCaseStudi_cs(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bor(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bof(area.target.dataset.plugins);

}

const areas = document.querySelectorAll("area");
areas.forEach(area => {
    area.addEventListener("click", interaccion)
});



function SeeNodeSelected(node) {
    var div = document.getElementById("NodeSelected");
    if (node && node.length > 0) {
        div.classList.add("ui", "red", "label")
        div.innerHTML = node;
    } else {
        div.classList.remove("ui", "red", "label")
        div.innerHTML = "";
    }
}