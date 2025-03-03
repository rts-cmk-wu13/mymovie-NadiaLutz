function saveToLocalStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
    return "Data is stored with " + key;
}

function readFromLocaleStorage(key){
    return JSON.parse(localStorage.getItem(key));
}

document.addEventListener("DOMContentLoaded", function() {
    let rootElm = document.documentElement;
    let switchElm = document.querySelector("#switch");
    let userDark = readFromLocaleStorage("isDarkMode");
    let browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let darkState = null;

    if(userDark === null) {
        darkState = browserDark;
    } else {
        darkState = userDark;
    }

    if(darkState){
        switchElm.checked = true;
        rootElm.setAttribute("data-dark", switchElm.checked);
    } else {
        switchElm.checked = false;
        rootElm.setAttribute("data-dark", switchElm.checked);
    }

    switchElm.addEventListener("change", function(){
        if(switchElm.checked) {
            rootElm.setAttribute("data-dark", switchElm.checked);
            saveToLocalStorage("isDarkMode", switchElm.checked);
        } else {
            rootElm.setAttribute("data-dark", switchElm.checked);
            saveToLocalStorage("isDarkMode", switchElm.checked);
        }
    });
});
