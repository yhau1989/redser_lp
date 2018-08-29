const endpoint_intereses = 'https://resdec-solution-web.herokuapp.com/resdec/list_interests/?var_environment_id=1';
const endpoint_tags = 'https://resdec-solution-web.herokuapp.com/resdec/list_features/?relationship_type_id=1&var_environment_id=1&feature_name=';


$(document).ready(function() {

    //lenar combo de intereses
    $.getJSON(endpoint_intereses,
        function(data) {
            if (data.list_interests) {
                var json = data.list_interests;
                var x = document.getElementById("intereses");

                for (var clave in json) {
                    // Controlando que json realmente tenga esa propiedad
                    if (json.hasOwnProperty(clave)) {
                        // Mostrando en pantalla la clave junto a su valor
                        console.log("La clave es " + clave + " y el valor es " + json[clave]);
                        var option = document.createElement("option");
                        option.value = clave;
                        option.text = json[clave];
                        x.add(option);
                    }
                }
            }
        });

    //lenar combo de tags
    $.getJSON(endpoint_tags,
        function(data) {
            if (data.list_features) {
                var json = data.list_features;
                var x = document.getElementById("seach_tags");

                for (var clave in json) {
                    // Controlando que json realmente tenga esa propiedad
                    if (json.hasOwnProperty(clave)) {
                        // Mostrando en pantalla la clave junto a su valor
                        //console.log("La clave es " + clave + " y el valor es " + json[clave]);
                        var option = document.createElement("option");
                        option.value = clave;
                        option.text = json[clave];
                        x.add(option);
                    }
                }
            }
        });




});





function process() {

    console.log('process');
    var select_a = document.querySelectorAll('div.ui.fluid.search.dropdown.selection.multiple a');
    if (select_a) {
        select_a.forEach(function(x) {
                console.log(x.getAttribute("data-value"));
            })
            //console.log(select_a);
    }
}

function add() {
    var txtb = document.getElementById('numbers_suggestions');
    if (txtb) {
        if (txtb.value.length > 0) {
            var x = txtb.value;
            txtb.value = (Number(x) + 1);
        } else {
            txtb.value = 1;
        }
    }

}

function minus() {
    var txtb = document.getElementById('numbers_suggestions');
    if (txtb) {
        if (txtb.value.length > 0 && Number(txtb.value) > 1) {
            var x = txtb.value;
            txtb.value = (Number(x) - 1);
        } else {
            txtb.value = 1;
        }
    }
}

function rotate() {

    console.log('rotate');

}


const btSummit = document.getElementById('sub'); //.addEventListener("click", process);
const btplus = document.getElementById('plus_buton');
const btminus = document.getElementById('minus_buton');

btSummit.addEventListener("click", process);
btplus.addEventListener("click", add);
btminus.addEventListener("click", minus);

//document.getElementById('view_advance').addEventListener(', rotate);