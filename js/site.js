$(document).ready(function() {

    $('#myMenuSlide').click(function(e) {

        $('.ui.sidebar')
            .sidebar('toggle');

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
    if (link.replace(".html", "").replace("./", "").toLowerCase() == newPathname.toLowerCase()) {
        key.classList.add('active');
        key.classList.add('linkactive');
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


var media = window.matchMedia('(min-width: 720px)')
var mediaIndex = window.matchMedia('(max-width: 720px)')

media.addListener(resiz);
resiz(media);

mediaIndex.addListener(resizeIndex);
resizeIndex(mediaIndex);

window.addEventListener('onload', focusPath());