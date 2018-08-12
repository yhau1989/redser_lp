$(document).ready(function(){
  



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



window.addEventListener('onload ', focusPath());