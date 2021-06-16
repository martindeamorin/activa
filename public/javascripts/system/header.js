window.addEventListener("load", () => {
    const profile = document.querySelector(".profile");
    const dropdownContent = document.querySelector(".dropdown-profile")
    profile.addEventListener("click", () => {
        if(dropdownContent.style.display == "block"){
            dropdownContent.style.display = "none"
        }else{
            dropdownContent.style.display = "block"
        }
    })
})