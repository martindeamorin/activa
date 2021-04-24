window.addEventListener("load", () => {
    let burguerIcon = document.querySelector("#burguerIcon")
    let menuMobile = document.querySelector("#menuMobile")
    let navContent = document.querySelector("#navContent")
    burguerIcon.addEventListener("click", () => {
        menuMobile.classList.toggle("hide")
        menuMobile.classList.toggle("show")
        navContent.classList.toggle("slideHide")
        navContent.classList.toggle("slideShow")

        console.log("Click");

    })
})