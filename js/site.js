$(document).ready(function() {

    $('#myMenuSlide').click(function(e) {

        $('.ui.sidebar')
            .sidebar('toggle');

    });


    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade');
        });

});

function focusPath() {
    var pathArray = window.location.pathname.split("/");
    var path = "";

    if (pathArray.length > 0) {
        path = pathArray[pathArray.length - 1].replace(".html", "");
        var p = document.querySelectorAll('#menuroot a');
        p.forEach(key => getHref(key, path));

    }
}

function getHref(key, newPathname) {
    key.classList.remove('active');
    key.classList.remove('linkactive');
    const link = key.getAttribute("href");
    if (!link) return;

    var replace = link.replace(".html", "").replace("./", "").toLowerCase();

    if (replace == newPathname.toLowerCase()) {
        key.classList.add('active');
        key.classList.add('linkactive');
    } else if (newPathname.length == 0) {

        var p = document.getElementById("home");
        p.classList.add('active');
        p.classList.add('linkactive');
    }
}


function resiz(media) {
    if (media.matches) {
        //document.body.style.background = 'red';
        var footer = document.getElementById("foo");
        if (footer) {
            footer.classList.remove("myfooter2");
            footer.classList.add("myfooter");
        }

    } else {
        //document.body.style.background = 'yellow';
        var footer = document.getElementById("foo");
        var foo3 = document.getElementById("foo3");

        if (footer) {
            footer.classList.remove("myfooter");
            footer.classList.add("myfooter2");
        }
    }
}

function resizeIndex(media) {
    if (media.matches) {
        //document.body.style.background = 'red';
        var fooidenx = document.getElementById("fooidenx");
        if (fooidenx) {

            fooidenx.classList.remove("myfooter2");
            fooidenx.classList.add("myfooter");
        }
    } else {
        //document.body.style.background = 'yellow';
        var fooidenx = document.getElementById("fooidenx");
        if (fooidenx) {
            fooidenx.classList.remove("myfooter");
            fooidenx.classList.add("myfooter2");
        }
    }
}


function resizeIndex2(media) {
    if (media.matches) {
        //document.body.style.background = 'red';
        var fooidenx = document.getElementById("fooidenx2");
        if (fooidenx) {
            fooidenx.classList.remove("myfooter2");
            fooidenx.classList.add("myfooter");
        }
    } else {
        //document.body.style.background = 'yellow';
        var fooidenx = document.getElementById("fooidenx2");
        if (fooidenx) {
            fooidenx.classList.remove("myfooter2");
            fooidenx.classList.add("myfooter");
        }
    }
}

function pisitivos() {

    var number = document.getElementById("numbers_suggestions").value;
    if (number < 0) {
        document.getElementById("numbers_suggestions").value = (number * -1);
    }

}


function em() {


    var mailform = $('#email_cf').val();
    var nameform = $('#name_cf').val();
    var subjectform = $('#subject_cf').val();
    var msgform = $('#msg_cf').val();

    $.ajax({
        url: "http://186.5.39.187:8050/envio.php",
        type: "POST", //send it through get method
        data: {
            email_contact: mailform,
            name_contact: nameform,
            subject_contact: subjectform,
            message_contact: msgform
        }
    }).then(function(data, status) {
        var obj = JSON.parse(data);

        if (obj.Messages[0].Status) {
            console.log("Status: " + obj.Messages[0].Status);
            if (obj.Messages[0].Status) {
                console.log("MessageID: " + obj.Messages[0].To[0].MessageID);
                $('#email_cf').val("");
                $('#name_cf').val("");
                $('#subject_cf').val("");
                $('#msg_cf').val("");
                alert("Your message has been sent successfully");
            } else {
                alert("We have problem try later");
            }
        } else {
            alert("We have problem try later");
        }
    });
}


var media = window.matchMedia('(min-width: 760px)')
    //var media2 = window.matchMedia('(min-width: 320px) and (max-width: 759px)')
var mediaIndex = window.matchMedia('(max-width: 760px)')
var mediaIndex2 = window.matchMedia('(min-width: 768px) and (max-width: 991px)')
var mediaIndex3 = window.matchMedia('(min-width: 100px) and (max-width: 560px)')
var mediaIndex4 = window.matchMedia('(min-width: 100px) and (max-width: 767px)')


//media2.addListener(resiz);
//resiz(media2);

media.addListener(resiz);
resiz(media);

mediaIndex.addListener(resizeIndex);
resizeIndex(mediaIndex);

mediaIndex2.addListener(resizeIndex);
resizeIndex(mediaIndex2);

mediaIndex3.addListener(resizeIndex);
resizeIndex(mediaIndex3);

mediaIndex4.addListener(resizeIndex2);
resizeIndex2(mediaIndex4);

window.addEventListener('onload', focusPath());