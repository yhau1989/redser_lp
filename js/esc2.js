const endpoint_tags = 'https://resdec-solution-web.herokuapp.com/resdec/list_items/?var_environment_id=1&relationship_type_id=2&item=';
const endpoint_algorithms = 'https://resdec-solution-web.herokuapp.com/resdec/list_algorithms/?relationship_type_id=2';


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
                        //console.log("La clave es " + clave + " y el valor es " + json[clave]); #
                        var option = document.createElement("option");
                        option.value = clave;
                        option.text = json[clave];
                        x.add(option);
                    }
                }
            }
        });
});



/*process scenario 2*/

function SetHtmlData(array) {

    document.getElementById("list_items").innerHTML = "";
    var numbersGrid = 0;
    var iter = 1;


    var item = document.createElement('div');
    item.classList.add('doubling', 'four', 'column', 'row');
    var html = "";

    //console.log('total: ' + array.length);
    for (let index = 0; index < array.length; index++) {
        //console.log('iteracion: ' + index);
        html = html + array[index];
        if (iter == 4) {
            item.innerHTML = html
            document.getElementById("list_items").appendChild(item);
            html = "";
            item = document.createElement('div');
            item.classList.add('doubling', 'four', 'column', 'row');
            iter = 1;
        }
        else{
            iter++;
        }

        if (index == (array.length - 1) && iter < 4)
        {
            item = document.createElement('div');
            item.classList.add('doubling', 'four', 'column', 'row');
            item.innerHTML = html
            document.getElementById("list_items").appendChild(item);
        }

    }

}





async function process() {
    
    //console.log('process');
    var select_plugin = $('#seach_tags').find(":selected").text();
    var id_algorithm = $('#ddl_method').find(":selected").val();
    var number_recomendation = $('#numbers_suggestions').val();

    document.getElementById('plugintSelectUser').innerText = `Recommended for you based on [${select_plugin}]`;

    if (select_plugin.length > 0 && id_algorithm.length > 0 && number_recomendation.length > 0) {

        loadRecomendations(id_algorithm, number_recomendation, select_plugin);
    }
    

}




async function loadRecomendations(algorithm_id, number_recommendations, item_evaluated) {

    $('#load_last_view').dimmer('show');

    var url_endpoint = `https://resdec-solution-web.herokuapp.com/resdec/transition_components_based_ratings/?relationship_type_id=2&var_environment_id=1&algorithm_id=${algorithm_id}&number_recommendations=${number_recommendations}&item_evaluated=${item_evaluated}`;
    var json = "";
    var iteracion = 0;
    var html = [];

    
    var json = await $.getJSON(url_endpoint).then(function(data) {
        
        var f = [];
        f[0] = data.tran_comp_rating_recommendation;
        f[1] = data.possible_interest_recommendations;
        return f;
        //return data.tran_comp_rating_recommendation;

    });

    //principales reocomendaciones-------
    for (var clave in json[0]) {
        if (json[0].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + json[0][clave] + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            if (!r.error); {
                var name = r.name;
                var homepage = r.homepage;
                var description = r.sections.description;
                var tags = r.tags;
                var downloaded = r.downloaded;
                var slug = r.slug;
                var tags_details = "";
                for (var clave in tags) {
                    if (tags.hasOwnProperty(clave)) {
                        tags_details += "<div class='ui label'>#" + tags[clave] + "</div>";
                    }
                }
                html[iteracion] = setDataByPlugin(name, homepage, description, tags_details, downloaded, slug);
                iteracion++;
            }
        }
    }
    SetHtmlData(html);


    //others reocomendaciones-------
    document.getElementById("list_items_others").innerHTML = "";
    for (var clave in json[1]) {
        if (json[1].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + json[1][clave] + ".json";
            var r = await $.getJSON(apiWordpress).then(function (data) {
                return data;
            });

            if (!r.error); {
                var name = r.name;
                var homepage = r.homepage;
                var description = r.sections.description;
                var tags = r.tags;
                var downloaded = r.downloaded;
                var slug = r.slug;
                var tags_details = "";
                for (var clave in tags) {
                    if (tags.hasOwnProperty(clave)) {
                        tags_details += "<div class='ui label'>#" + tags[clave] + "</div>";
                    }
                }
                setDataByPlugin_others(name, homepage, description, tags_details, downloaded, slug);
            }
        }
    }

    

    $('#load_last_view').dimmer('hide');

}





async function loadDataByPuglings(name_plugin) {

    const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + name_plugin + ".json";
    var r = "";
    var r = await $.getJSON(apiWordpress).then(function(data) {
        return data;
    });

    return r;
}



function setDataByPlugin(name, homepage, description, tags, downloaded, slug) {

    //var img = urlExistsImg(slug);


    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;

    var html = ` <div class="column">
                        <div class="ui cards">
                            <div class="ui centered card">
                                <div class="content">
                                    <img class="right floated mini ui image" src="https://ps.w.org/${slug}/assets/icon-128x128.png">
                                    <div class="header">
                                        ${name}
                                    </div>
                                    <div class="meta">
                                    Downloaded: ${downloaded}
                                    </div>
                                    <div class="description">
                                        ${htmlObject}
                                    </div>
                                </div>
                                <div class="content">
                                    <div class="summary">
                                        <a href="https://wordpress.org/plugins/${slug}/" target="_blank" rel="noopener noreferrer">View more</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
    return html;
};




function setDataByPlugin_others(name, homepage, description, tags, downloaded, slug) {


    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;


    var item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `<div class='ui tiny image'>
		<img src='https://ps.w.org/${slug}/assets/icon-128x128.png'>
	</div>
	<div class='content'>
		<a class='ui small header' href='${homepage}' target="_blank" rel="noopener noreferrer">${name}</a>
		<div class='meta'>
			<span class='cinema'>Downloaded: ${downloaded}</span>
		</div>
		<div class='description'>
			<p>${htmlObject}  <a href="https://wordpress.org/plugins/${slug}/" target="_blank" rel="noopener noreferrer">view more</a></p>
		</div>
		<div class='extra'>
			${tags}
		</div>
	</div>`;
    document.getElementById("list_items_others").appendChild(item);
};



/*process scenario 2*/

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


function loadAlgorthm() {

    $.getJSON(endpoint_algorithms,
        function(data) {
            if (data.list_algorithms) {
                var json = data.list_algorithms;
                var x = document.getElementById("ddl_method");

                for (var clave in json) {
                    // Controlando que json realmente tenga esa propiedad
                    if (json.hasOwnProperty(clave)) {
                        // Mostrando en pantalla la clave junto a su valor
                        //console.log("La clave es " + clave + " y el valor es " + json[clave]); #
                        var option = document.createElement("option");
                        option.value = clave;
                        option.text = json[clave];
                        x.add(option);
                    }
                }
            }
        });

}

const btSummit = document.getElementById('sub'); //.addEventListener("click", process);
const btplus = document.getElementById('plus_buton');
const btminus = document.getElementById('minus_buton');

btSummit.addEventListener("click", process);
btplus.addEventListener("click", add);
btminus.addEventListener("click", minus);

window.addEventListener('load', loadAlgorthm);