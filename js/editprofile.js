$(document).ready(function() {

    loadDataUser();

});

function loadDataUser() {

    var userLogon = sessionStorage.getItem("UserLoginResdec");
    if (userLogon.length > 0) {
        var urlApi = `http://186.5.39.187:8030/resdec/user_get/?username=${userLogon}`;
        console.log('load data user ' + urlApi);
        document.getElementById("name_user"), innerHTML = "";

        $.getJSON(urlApi,
            function(data) {
                if (data.user_data) {
                    console.log(data.user_data);

                    var json = data.user_data;

                    if (document.getElementById("name_user"))
                        document.getElementById("name_user").innerHTML = json.first_name + ' ' + json.last_name;

                    if (document.getElementById("name"))
                        document.getElementById("name").value = json.first_name;

                    if (document.getElementById("last_name"))
                        document.getElementById("last_name").value = json.last_name;

                    if (document.getElementById("email"))
                        document.getElementById("email").value = json.email;
                }
            });
    }

}


function save() {

    var nform = $('#name').val();
    var lnform = $('#last_name').val();
    var eform = $('#email').val();
    //var passform = $('#pswd').val();
    var userLogon = sessionStorage.getItem("UserLoginResdec");
    var url = `http://186.5.39.187:8030/resdec/user_put/?username=${userLogon}&first_name=${nform}&last_name=${lnform}&email=${eform}`;

    $.ajax({
        url: url,
        type: "GET" //, //send it through get method
            /*data: {
                username: userLogon,
                first_name: nform,
                last_name: lnform,
                email: eform,
                password: passform
            }*/
    }).then(function(data, status) {
        console.log(data);
        if (data.error == 0) {
            alert('Data saved successfully');
        } else {
            alert(data.err_msg);
        }
        loadDataUser();
    });

}

function savepws() {

    var passform = $('#pswd').val();
    var repassform = $('#re-pswd').val();

    if (passform === repassform) {
        var userLogon = sessionStorage.getItem("UserLoginResdec");
        var url = `http://186.5.39.187:8030/resdec/user_upd_pass/?username=${userLogon}&password=${passform}`;

        $.ajax({
            url: url,
            type: "GET" //, //send it through get method
                /*data: {
                    username: userLogon,
                    first_name: nform,
                    last_name: lnform,
                    email: eform,
                    password: passform
                }*/
        }).then(function(data, status) {
            console.log(data);
            if (data.error == 0) {
                $('#pswd').val("");
                $('#re-pswd').val("");
                alert('Change password successfully');
            } else {
                alert(data.err_msg);
            }
            loadDataUser();
        });
    } else {
        alert('The fields "Password" and "Repeat new Password" are different.');
    }






}