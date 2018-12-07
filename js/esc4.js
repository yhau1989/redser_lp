function interaccion(area) {

    //console.log(area);
    console.log(`area seleccionada: ${area.target.id}`);
    console.log(`area alt: ${area.target.alt}`);
    console.log(`plugins: ${area.target.dataset.plugins}`);
    console.log(`plugins: ${area.target.dataset.plugins}`);

    SeeNodeSelected(area.target.alt);


    $('#seach_tags_cs')
        .find('option')
        .remove()
        .end()
        .append('<option value="">tags</option>')
        .val('');

    $('#seach_tags_bor')
        .find('option')
        .remove()
        .end()
        .append('<option value="">Name used plugin</option>')
        .val('');

    $('#seach_tags_bof')
        .find('option')
        .remove()
        .end()
        .append('<option value="">Name used plugin</option>')
        .val('');



    setViewPluginsByCaseStudi_cs(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bor(area.target.dataset.plugins);
    setViewPluginsByCaseStudi_bof(area.target.dataset.plugins);

}

const areas = document.querySelectorAll("area");
areas.forEach(area => {
    area.addEventListener("click", interaccion)
});



function SeePop() {
    $('.ui.modal')
        .modal({
            blurring: true
        })
        .modal('show');
}



function SeeNodeSelected(node) {
    var div = document.getElementById("NodeSelected");
    if (node && node.length > 0) {
        div.classList.add("ui", "red", "label")
        div.innerHTML = node + ", now you can use any of the 3 scenarios.";
    } else {
        div.classList.remove("ui", "red", "label")
        div.innerHTML = "";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function checkCookie() {
    var user = getCookie("viewMessage");
    console.log("checkCookie:" + user)
    if (user == "") {
        SeePop();
    }

}


$(document).ready(function() {



    $('#viewPopMsgOk').click(function() {
        document.cookie = `viewMessage=si; expires=${new Date('2019-01-31')}; path=/`;
    });




    $('#seach_tags_bof').dropdown({
        onChange: function(text, value) {
            var select_plugin_val = value;
            console.log(select_plugin_val);
            loadTagsByPlugin_bof(select_plugin_val);
        }
    });

    $('#seach_tags_cs').dropdown();
    $('#seach_tags_bor').dropdown();
    $('#ddl_method_bor').dropdown();
    $('#ddl_method_bof').dropdown();

    //esc 4
    $('.menu .item')
        .tab();


    $('.ui.sticky')
        .sticky({
            offset: 50,
            bottomOffset: 50,
            context: '#context'
        });




});