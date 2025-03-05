function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return "Data is stored with " + key;
}

function readFromLocaleStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the switch element
    let switchElm = document.querySelector("#switch");

    // If switch element exists, initialize dark mode
    if (switchElm) {
        let rootElm = document.documentElement;
        let userDark = readFromLocaleStorage("isDarkMode");
        let browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        let darkState = null;

        // Determine the dark mode state
        if (userDark === null) {
            darkState = browserDark;
        } else {
            darkState = userDark;
        }

        // Apply dark mode state
        if (darkState) {
            switchElm.checked = true;
            rootElm.setAttribute("data-dark", switchElm.checked);
        } else {
            switchElm.checked = false;
            rootElm.setAttribute("data-dark", switchElm.checked);
        }

        // Event listener for changing dark mode state
        switchElm.addEventListener("change", function() {
            if (switchElm.checked) {
                rootElm.setAttribute("data-dark", switchElm.checked);
                saveToLocalStorage("isDarkMode", switchElm.checked);
            } else {
                rootElm.setAttribute("data-dark", switchElm.checked);
                saveToLocalStorage("isDarkMode", switchElm.checked);
            }
        });
    } else {
        console.log('Switch element not found on this page.');
    }
});
