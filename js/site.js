$(document).ready(function(){
  
    $('#myMenuSlide').click(function (e) {

        $('.ui.sidebar')
             .sidebar('toggle');

    });

});

function focusPath() {
    var pathArray = window.location.pathname.split("/");
    var path = "";

    if (pathArray.length > 0)
    {
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
    if (link.replace(".html", "").replace("./","").toLowerCase() == newPathname.toLowerCase()) {
        key.classList.add('active');
        key.classList.add('linkactive');
    }
}


function resiz(media)
{
    if (media.matches)
    {
        //document.body.style.background = 'red';
        var footer = document.getElementById("foo");
        console.log(footer);
        footer.classList.remove("myfooter2");
        footer.classList.add("myfooter");
    }
    else
    {
        //document.body.style.background = 'yellow';
        var footer = document.getElementById("foo");
        footer.classList.remove("myfooter");
        footer.classList.add("myfooter2");
    }
}


var media = window.matchMedia('(min-width: 767px)')

media.addListener(resiz);
resiz(media);

window.addEventListener('onload', focusPath());
