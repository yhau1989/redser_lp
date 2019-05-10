$(document).ready(function() {

    loadDataUser();

    //lenar combo de intereses
    getdata();

});


function loadDataUser() {

    var userLogon = sessionStorage.getItem("UserLoginResdec");
    if (userLogon.length > 0) {
        var urlApi = `http://190.15.128.131:8030/resdec/user_get/?username=${userLogon}`;
        console.log('load data user ' + urlApi);
        document.getElementById("name_user"), innerHTML = "";

        $.getJSON(urlApi,
            function(data) {
                if (data.user_data) {
                    console.log(data.user_data);

                    var json = data.user_data;
                    document.getElementById("name_user").innerHTML = json.first_name + ' ' + json.last_name;
                    document.getElementById("img_user").innerHTML = `<img src="http://www.resdec.com:8030${json.photo}">`;
                }
            });
    }

}

function getdata() {

    var userLogon = sessionStorage.getItem("UserLoginResdec");
    if (userLogon.length > 0) {
        var urlApi = `http://190.15.128.131:8030/resdec/list_last_items_used/?username=${userLogon}&var_environment_id=1&number_items=10`;
        document.getElementById("list_items"), innerHTML = "";
        $('#load_last_view').dimmer('show');
        $.getJSON(urlApi,
            function(data) {
                if (data.error == 0) {
                    var json = data.list_last_items_used;

                    for (var clave in json) {
                        // Controlando que json realmente tenga esa propiedad
                        if (json.hasOwnProperty(clave)) {
                            // Mostrando en pantalla la clave junto a su valor
                            console.log("La clave es " + clave + " y el valor es " + json[clave]);
                            loadDataByPuglings(json[clave]);
                        }
                    }
                }
            });
    }
}



function loadDataByPuglings(name_plugin) {

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
                setDataByPlugin(name, homepage, description, tags_details, downloaded, slug);
            }
        });

    $('#load_last_view').dimmer('hide');
}


function setDataByPlugin(name, homepage, description, tags, downloaded, slug) {


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
    document.getElementById("list_items").appendChild(item);
}



function exit() {

    var url = `http://190.15.128.131:8030/resdec/logout/`;
    $.ajax({
        url: url,
        success: function(response) {

            if (response.logout) {
                var userLogon = sessionStorage.getItem("UserLoginResdec");
                console.log('userLogin: ' + userLogon);
                sessionStorage.setItem("UserLoginResdec", "");
                sessionStorage.removeItem("UserLoginResdec");
                window.location = "./";
            }
        },
        error: function(e) {
            sessionStorage.removeItem("UserLoginResdec");
            console.log('error: ' + e);
        },
        statusCode: {
            404: function(ft) {
                sessionStorage.removeItem("UserLoginResdec");
                console.log('error 404: ' + ft);
            }
        }
    });
}