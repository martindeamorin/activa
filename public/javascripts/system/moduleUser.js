window.addEventListener("load", () => {
    let contenidoModulos = document.querySelectorAll(".moduleContent")
    let clasesModulos = document.querySelectorAll(".clasesModulo")

    for(let i = 0; i < contenidoModulos.length; i++){
        contenidoModulos[i].querySelector("button").addEventListener("click", () => {
            if(contenidoModulos[i].querySelector("button").innerHTML == "Ver clases"){
                contenidoModulos[i].querySelector("button").innerHTML = "Ocultar clases"
                clasesModulos[i].style.display = "block"
            } else {
                contenidoModulos[i].querySelector("button").innerHTML = "Ver clases"
                clasesModulos[i].style.display = "none"
            }

        })
    }

})