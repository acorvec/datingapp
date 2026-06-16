function hideUnneededButtons() {
    // hide the button whose href matches the current path
    const buttonIds = [
        "homeButton",
        "contactButton",
        "othersButton" ];
    const pathToMatch = pagePath();

    for (const index in buttonIds) {
        const id = buttonIds[index];
        const button = document.getElementById(id);
        const href = button.getAttribute("href");
        if (pathsEqual(href, pathToMatch)) button.remove();
    }
}

document.addEventListener('DOMContentLoaded', hideUnneededButtons);