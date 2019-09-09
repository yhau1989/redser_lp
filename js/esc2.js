const endpoint_tags = 'http://190.15.128.150:8030/resdec/list_items/?var_environment_id=1&relationship_type_id=2&item=';
const endpoint_algorithms = 'http://190.15.128.150:8030/resdec/list_algorithms/?relationship_type_id=2';


function getAllUrlParams() {

    // get query string from url (optional) or window
    var queryString = window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}




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


    //loadLastView
    loadLastView();
});



/*process scenario 2*/

function SetHtmlData(array) {

    if (array.length > 0) {
        document.getElementById("htop").classList.remove('hdide');
        document.getElementById("list_items").innerHTML = "";

    } else {
        document.getElementById("htop").classList.add('hdide');
        document.getElementById("list_items").innerHTML = "The main results have not been found in WordPress, but you may be interested in other plugins";
    }

    var item = document.createElement('div');
    item.classList.add('ui', 'centered', 'card');

    //console.log('total: ' + array.length);
    for (let index = 0; index < array.length; index++) {

        item.innerHTML = array[index];
        document.getElementById("list_items").appendChild(item);

        item = document.createElement('div');
        item.classList.add('ui', 'centered', 'card');

    }

}


function process() {

    console.log('inicio process');
    var select_plugin = $('#seach_tags').find(":selected").text();
    var select_plugin_val = $('#seach_tags').find(":selected").val();
    var id_algorithm = $('#ddl_method').find(":selected").val();
    var number_recomendation = $('#numbers_suggestions').val();

    document.getElementById('htop').innerHTML = `Recommended for you based on <span class="ui red">${select_plugin}</span>`;


    if (select_plugin_val.length > 0 && id_algorithm.length > 0 && number_recomendation.length > 0 && parseInt(number_recomendation) > 0) {

        document.getElementById("list_items_last").innerHTML = "";
        document.getElementById("list_items").innerHTML = "";
        document.getElementById("list_items_others").innerHTML = "";
        document.getElementById("segment_last").classList.add('hdide');

        loadRecomendations(id_algorithm, number_recomendation, select_plugin).then(response => {
            console.log(response);
            $('#load_last_view').dimmer('hide');
            loadImage();
            loadImgOther();
            console.log('fin process');
        }).catch(e => {
            $('#load_last_view').dimmer('hide');
            loadImage();
            loadImgOther();
            console.log('fin process');
        });
    } else {
        var fielsd = [select_plugin_val, id_algorithm, number_recomendation];

        evaluarRequired(fielsd);

    }


}



function evaluarRequired(fields) {

    var field1 = (fields[0].length <= 0) ? "<li>Field 'Used plugin' required</li>" : "";
    var field2 = (fields[1].length <= 0) ? "<li>Field 'Recommender method' required</li>" : "";
    var field3 = (fields[2].length <= 0 || parseInt(fields[2]) <= 0) ? "<li>Field 'Total Suggestions' required and number positive</li>" : "";

    document.getElementById('list_error').classList.remove('hidden');
    document.getElementById('items_error').innerHTML = field1 + field2 + field3;
}


async function loadRecomendations(algorithm_id, number_recommendations, item_evaluated) {

    $('#load_last_view').dimmer('show');
    var userLogon = sessionStorage.getItem("UserLoginResdec");
    console.log('userLogin: ' + userLogon);

    var url_endpoint = `http://190.15.128.150:8030/resdec/transition_components_based_ratings/?relationship_type_id=2&var_environment_id=1&algorithm_id=${algorithm_id}&username=${userLogon}&number_recommendations=${number_recommendations}&item_evaluated=${item_evaluated}`;
    console.log(url_endpoint);
    var json = "";
    var iteracion = 0;
    var html = [];

    var json = await $.getJSON(url_endpoint).then(function(data) {
        console.log(data);
        var f = [];
        f[0] = data.tran_comp_rating_recommendation;
        f[1] = data.possible_interest_recommendations;
        return f;
    });

    //principales reocomendaciones-------
    for (var clave in json[0]) {
        if (json[0].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + json[0][clave] + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            var img_icon = "<div>no existe</div>";

            if (!r.error) {
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
                html[iteracion] = setDataByPlugin(name, homepage, description, tags_details, downloaded, slug, img_icon);
                iteracion++;
            } else {
                console.log('plugin: ' +
                    json[0][clave] + ' ' + apiWordpress + ' no existe');

            }
        }
    }

    SetHtmlData(html);

    //others reocomendaciones-------
    document.getElementById("list_items_others").innerHTML = "";
    for (var clave in json[1]) {
        if (json[1].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + json[1][clave] + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            var img_icon = "<div>no existe</div>";

            if (!r.error) {
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
                setDataByPlugin_others(name, homepage, description, tags_details, downloaded, slug, img_icon);
            } else {
                console.log('plugin: ' +
                    json[1][clave] + ' ' + apiWordpress + ' no existe');

            }
        }
    }

}


async function loadDataByPuglings(name_plugin) {
    const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + name_plugin + ".json";
    var r = "";
    var r = await $.getJSON(apiWordpress).then(function(data) {
        return data;
    });
    return r;
}


function setDataByPlugin(name, homepage, description, tags, downloaded, slug, img_icon) {

    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;
    img_icon = "#"
    var html = `<div class="content">
                        <img id="${slug}" class="right floated mini ui image" src="${img_icon}">
                        <div class="header">
                            ${name}
                        </div>
                        <div class="meta">
                        <i class="black cloud download icon" title="total downloads"></i> ${downloaded}
                        </div>
                        <div class="description">
                            ${htmlObject}
                            
                        </div>
                    </div>
                    <div class="extra content">
                    <i class="blue angle right icon"></i>
                    <a href="https://wordpress.org/plugins/${slug}/" target="_blank" rel="noopener noreferrer">View more</a>
                    </div>`;
    return html;
}


function loadImage() {

    var imgs = document.querySelectorAll('img.right.floated.mini.ui.image');
    imgs.forEach(element => {
        var id = element.id;
        $.ajax({

            url: `https://cors-anywhere.herokuapp.com/http://plugins.svn.wordpress.org/${id}/assets/`,
            success: function(response) {
                var temp = document.createElement('div');
                temp.innerHTML = response;
                var li = temp.querySelectorAll(`a[href*='icon']`);
                if (li.length > 0) {
                    element.src = `https://ps.w.org/${id}/assets/${li[0].innerHTML}`
                } else {
                    element.src = `https://s.w.org/plugins/geopattern-icon/${id}_bdc7cb.svg`;
                }
            },
            error: function() {
                element.src = `https://s.w.org/plugins/geopattern-icon/${id}.svg`;

            },
            statusCode: {
                404: function() {
                    element.src = `https://s.w.org/plugins/geopattern-icon/${id}.svg`;
                }
            }
        });

    });
}


function loadImgOther() {
    var imgs = document.querySelectorAll('#list_items_others div.item div.ui.tiny.image img');
    if (imgs.length > 0) {
        document.getElementById("hlike").classList.remove('hdide');
        console.log('f[1].length > 0');
    } else {
        console.log('f[1].length < 0');
        document.getElementById("hlike").classList.add('hdide');
    }

    imgs.forEach(element => {
        var id = element.id;

        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/http://plugins.svn.wordpress.org/${id}/assets/`,
            success: function(response) {
                var temp = document.createElement('div');
                temp.innerHTML = response;
                var li = temp.querySelectorAll(`a[href*='icon']`);
                if (li.length > 0) {
                    element.src = `https://ps.w.org/${id}/assets/${li[0].innerHTML}`
                } else {
                    element.src = `https://s.w.org/plugins/geopattern-icon/${id}_bdc7cb.svg`;
                }
            },
            error: function() {
                element.src = `https://s.w.org/plugins/geopattern-icon/${id}.svg`;
            },
            statusCode: {
                404: function() {
                    element.src = `https://s.w.org/plugins/geopattern-icon/${id}.svg`;
                }
            }
        });

    });
}



function setDataByPlugin_others(name, homepage, description, tags, downloaded, slug, img_icon) {


    var tempo = document.createElement('div');
    tempo.innerHTML = img_icon;
    var li = tempo.querySelectorAll(`a[href*='icon']`);
    if (li.length > 0) {
        img_icon = `https://ps.w.org/${slug}/assets/${li[0].innerHTML}`
    } else {
        img_icon = `https://s.w.org/plugins/geopattern-icon/${slug}_bdc7cb.svg`;
    }



    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;


    var item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `<div class='ui tiny image'>
		<img id="${slug}" src='#'>
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
}



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


function loadLastView() {

    var userLogon = sessionStorage.getItem("UserLoginResdec");
    if (userLogon.length > 0) {
        document.getElementById("list_items_last").innerHTML = "";
        var url_last_view = `http://190.15.128.150:8030/resdec/list_last_items_used/?username=${userLogon}&var_environment_id=1&number_items=10`;
        console.log('iniciando loadLastView');
        console.log(url_last_view);

        $.getJSON(url_last_view,
            function(data) {
                if (data.error == 0) {
                    var json = data.list_last_items_used;
                    console.log(data);

                    if (Object.values(json).length > 0) {
                        document.getElementById("segment_last").classList.remove('hdide');
                    } else {
                        console.log('loadLastView < 0');
                        document.getElementById("segment_last").classList.add('hdide');
                    }

                    for (var clave in json) {
                        // Controlando que json realmente tenga esa propiedad
                        if (json.hasOwnProperty(clave)) {
                            // Mostrando en pantalla la clave junto a su valor
                            loadDataByPuglingsLast(json[clave]);
                        }
                    }
                }
            });

        console.log('fin loadLastView');
    }
}

function loadDataByPuglingsLast(name_plugin) {

    const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + name_plugin + ".json";
    $.getJSON(apiWordpress,
        function(data) {
            if (!data.error) {
                var name = data.name;
                var homepage = data.homepage;
                var description = data.sections.description;
                var tags = data.tags;
                var downloaded = data.downloaded;
                var slug = data.slug;
                var tags_details = "";
                for (var clave in tags) {
                    if (tags.hasOwnProperty(clave)) {
                        tags_details += "<div class='ui label'>#" + tags[clave] + "</div>";
                    }
                }
                setDataByPluginLast(name, homepage, description, tags_details, downloaded, slug);
            }
        });

}


function setDataByPluginLast(name, homepage, description, tags, downloaded, slug) {


    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;

    var item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `<div class='ui small image'>
		<img src='https://ps.w.org/${slug}/assets/icon-256x256.png'>
	</div>
	<div class='content'>
		<a class='header' href='${homepage}' target="_blank" rel="noopener noreferrer">${name}</a>
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
    document.getElementById("list_items_last").appendChild(item);
}





const btSummit = document.getElementById('sub');
const btplus = document.getElementById('plus_buton');
const btminus = document.getElementById('minus_buton');

btSummit.addEventListener("click", process);
btplus.addEventListener("click", add);
btminus.addEventListener("click", minus);

window.addEventListener('load', loadAlgorthm);