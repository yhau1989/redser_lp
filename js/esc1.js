const endpoint_intereses = 'http://186.5.39.187:8030/resdec/list_interests/?var_environment_id=1';
const endpoint_tags = 'http://186.5.39.187:8030/resdec/list_features/?relationship_type_id=1&var_environment_id=1&feature_name=';


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
                        //console.log("La clave es " + clave + " y el valor es " + json[clave]);
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


    //console.log('process');
    var number_recommendations = $('#numbers_suggestions').val();
    var select_a = document.querySelectorAll('div.ui.fluid.search.dropdown.selection.multiple a');
    var id_interest = $('#intereses').find(":selected").val();

    if (id_interest.length > 0 && number_recommendations.length > 0) {

        searchByInterest(id_interest, number_recommendations).then(response => {
            $('#load_last_view').dimmer('hide');
        }).catch(e => {
            $('#load_last_view').dimmer('hide');
            console.log('error');
        });
    } else if (select_a.length > 0 && number_recommendations.length > 0) {
        var tags = [];
        select_a.forEach(function(x) {
            tags.push(x.textContent);
        })

        searchByTags(tags, number_recommendations).then(response => {
            $('#load_last_view').dimmer('hide');
        }).catch(e => {

            $('#load_last_view').dimmer('hide');
            console.log('error');
        });
    }
}



async function searchByTags(tags, number_recommendations) {

    $('#load_last_view').dimmer('show');
    const url = 'http://186.5.39.187:8030/resdec/cold_start_features/'
    var relationship_type_id = 1;
    var var_environment_id = 1;
    var selected_features = tags;

    var json = "";
    var iteracion = 0;
    var html = [];

    var json = await $.ajax({
        url: url,
        type: "get", //send it through get method
        data: {
            relationship_type_id: relationship_type_id,
            var_environment_id: var_environment_id,
            selected_features: selected_features,
            number_recommendations: number_recommendations
        }
    }).then(function(data) {

        console.log(data);
        var f = [];
        f[0] = data.cold_start_recommendations;
        f[1] = data.possible_interest_recommendations;
        return f;

    });


    preparehtml(json, 0).then(response => {
        SetHtmlData(response);
    });


    //others reocomendaciones-------

    for (var clave in json[1]) {
        if (json[1].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + clave + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            var img_icon = "<div>no existe</div>";

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
                setDataByPlugin_others(name, homepage, description, tags_details, downloaded, slug, img_icon);
            }
        }
    }

    loadImgOther();



}




function setDataByPlugin_others(name, homepage, description, tags, downloaded, slug, img_icon) {

    console.log('list_items_others inicio: ' + name);
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
    console.log('list_items_others fin: ' + name);
};



async function searchByInterest(id_ineterest, number_recommendations) {

    $('#load_last_view').dimmer('show');

    var endpoint = `http://186.5.39.187:8030/resdec/cold_start_interest/?relationship_type_id=1&var_environment_id=1&interest_id=${id_ineterest}&number_recommendations=${number_recommendations}`;
    var json = "";
    var iteracion = 0;
    var html = [];

    var json = await $.getJSON(endpoint).then(function(data) {
        var f = [];
        f[0] = data.cold_start_recommendations;
        f[1] = data.possible_interest_recommendations;
        return f;

    });

    console.log(json);
    preparehtml(json, 0).then(response => { SetHtmlData(response); });

    //others reocomendaciones-------
    document.getElementById("list_items_others").innerHTML = "";


    for (var clave in json[1]) {
        if (json[1].hasOwnProperty(clave)) {

            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + clave + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            var img_icon = "<div>no existe</div>";

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
                setDataByPlugin_others(name, homepage, description, tags_details, downloaded, slug, img_icon);
            }
        }
    }

    loadImgOther();

}



function setDataByPlugin(name, homepage, description, tags, downloaded, slug, img_icon, raitig) {

    var descripmini = description;
    var temp = document.createElement('div');
    temp.innerHTML = descripmini;
    var htmlObject = temp.firstChild.innerHTML;
    img_icon = "#"

    var rating_round = parseFloat(raitig).toFixed(2);

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
                    <span>
                        <i class="blue angle right icon"></i>
                        <a href="https://wordpress.org/plugins/${slug}/" target="_blank" rel="noopener noreferrer">View more</a>
                    </span>
                    
                    <span class="right floated">
                    <i class="yellow star icon" title="total rating"></i>${rating_round}
                    </span>
                    </div>`;
    return html;
};




function SetHtmlData(array) {

    if (array.length > 0) {
        document.getElementById("htop").classList.remove('hdide');
    } else {
        document.getElementById("htop").classList.add('hdide');
    }


    document.getElementById("list_items").innerHTML = "";
    var item = document.createElement('div');
    item.classList.add('ui', 'centered', 'card');

    for (let index = 0; index < array.length; index++) {

        item.innerHTML = array[index];
        document.getElementById("list_items").appendChild(item);
        html = "";
        item = document.createElement('div');
        item.classList.add('ui', 'centered', 'card');
    }

    loadImage();
}


function loadImage() {

    var imgs = document.querySelectorAll('img.right.floated.mini.ui.image');
    imgs.forEach(element => {
        var id = element.id;


        $.ajax({
            type: 'GET',
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
            type: 'GET',
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

async function preparehtml(json, iter) {
    var html = [];
    var iteracion = 0;
    for (var clave in json[iter]) {
        if (json[iter].hasOwnProperty(clave)) {
            const apiWordpress = "https://api.wordpress.org/plugins/info/1.0/" + clave + ".json";
            var r = await $.getJSON(apiWordpress).then(function(data) {
                return data;
            });

            var img_icon = "<div>no existe</div>";

            if (!r.error); {
                var name = r.name;
                var homepage = r.homepage;
                var description = r.sections.description;
                var tags = r.tags;
                var downloaded = r.downloaded;
                var slug = r.slug;
                var tags_details = "";
                var raitig = json[iter][clave];
                for (var clave in tags) {
                    if (tags.hasOwnProperty(clave)) {
                        tags_details += "<div class='ui label'>#" + tags[clave] + "</div>";
                    }
                }
                html[iteracion] = setDataByPlugin(name, homepage, description, tags_details, downloaded, slug, img_icon, raitig);
                iteracion++;
            }
        }
    }

    return html;
}




const btSummit = document.getElementById('sub');
const btplus = document.getElementById('plus_buton');
const btminus = document.getElementById('minus_buton');

btSummit.addEventListener("click", process);
btplus.addEventListener("click", add);
btminus.addEventListener("click", minus);