


function interaccion(area) 
{

    const url = window.location.href.replace("#","");
    var esc1 = url.replace("4","1");
    var esc2 = url.replace("4","2");
    var esc3 = url.replace("4","3");

    //window.location = `${esc2}?esc=${area.target.dataset.plugins}`;

    document.getElementById("esc1_url").href = `${esc1}?esc=${area.target.dataset.plugins}`;
    document.getElementById("esc2_url").href = `${esc2}?esc=${area.target.dataset.plugins}`;
    document.getElementById("esc3_url").href = `${esc3}?esc=${area.target.dataset.plugins}`;
    
    


/*
    console.log(`url esc1: ${esc1}?esc=${area.target.dataset.plugins}`);
    console.log(`url esc2: ${esc2}?esc=${area.target.dataset.plugins}`);
    console.log(`url esc3: ${esc3}?esc=${area.target.dataset.plugins}`);*/

}

const areas = document.querySelectorAll("area");
areas.forEach(area => {
    area.addEventListener("click", interaccion)
});


