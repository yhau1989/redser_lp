$(document).ready(function() {

    loadDataUser();

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

                    if (document.getElementById("name_user"))
                        document.getElementById("name_user").innerHTML = json.first_name + ' ' + json.last_name;

                    if (document.getElementById("name"))
                        document.getElementById("name").value = json.first_name;

                    if (document.getElementById("last_name"))
                        document.getElementById("last_name").value = json.last_name;

                    if (document.getElementById("email"))
                        document.getElementById("email").value = json.email;

                    document.getElementById("img_user").innerHTML = `<img src="http://www.resdec.com:8030${json.photo}">`;
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
    var url = `http://190.15.128.131:8030/resdec/user_put/?username=${userLogon}&first_name=${nform}&last_name=${lnform}&email=${eform}`;

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
        var url = `http://190.15.128.131:8030/resdec/user_upd_pass/?username=${userLogon}&password=${passform}`;

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


function saveImg() {

    console.log("--saveImg");
    $('#loading_panel').dimmer('show');
    var userLogon = sessionStorage.getItem("UserLoginResdec");
    var myFileInput = document.getElementById("photo_pic");
    var formData = new FormData();

    formData.append('photo', myFileInput.files[0]);
    formData.append('username', userLogon);

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        url: 'http://190.15.128.131:8030/resdec/user_photo_upload/',
        data: formData,
        success: function(data) {

            console.log("-- result saveImg");
            console.log(data);
            var js = data;
            loadDataUser();
            $('#loading_panel').dimmer('hide');
            if (js.error == 0) {
                alert("Successfully updated image");
            } else {
                alert("Sorry we could not update your image");
            }
            document.getElementById("div_preview").innerHTML = "<p>No files currently selected for upload</p>";
        }
    });


}