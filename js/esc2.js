const endpoint_tags = 'https://resdec-solution-web.herokuapp.com/resdec/list_items/?var_environment_id=1&relationship_type_id=1&item=';


$(document).ready(function() {


    //lenar combo de tags
    $.getJSON(endpoint_tags,
        function(data) {
            if (data.list_items) {
                var json = data.list_items;
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



const btSummit = document.getElementById('sub'); //.addEventListener("click", process);
const btplus = document.getElementById('plus_buton');
const btminus = document.getElementById('minus_buton');

btSummit.addEventListener("click", process);
btplus.addEventListener("click", add);
btminus.addEventListener("click", minus);