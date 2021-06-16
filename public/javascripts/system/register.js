window.addEventListener("load", () => {
    let contenedorForm = document.querySelector(".contenedorForm")
   let inputsRegister = contenedorForm.querySelectorAll("input");
   let form = contenedorForm.querySelector("form")
   let btnRegister = document.querySelector("#btnRegister")
   let numbersRegex = new RegExp("^[^0-9]+$")
   let dniRegex = new RegExp("/\s/g")
   let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")

   if(window.localStorage.getItem("returnURL")){
        let inputRedirect = document.createElement("input")
        inputRedirect.type = "hidden"
        inputRedirect.value = window.localStorage.getItem("returnURL")
        inputRedirect.name = "returnURL"
        form.appendChild(inputRedirect)
    }

   for(let input of inputsRegister){
    input.addEventListener("keyup", () => {
        if((document.querySelector("#errorSubmit").innerHTML != "")){
            document.querySelector("#errorSubmit").innerHTML == ""
        }
        switch(input.id){
            case("apellido"):
                if(!(numbersRegex.test(input.value)) && (input.value.length <= 50 && input.value.length >= 1)){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `No puede ingresar numeros en su apellido`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
            case("nombre"):
                if(!(numbersRegex.test(input.value)) && (input.value.length <= 50 && input.value.length >= 1)){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `No puede ingresar numeros en su nombre`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
            break;
            case("emailRegister"):
                if(!(input.value.includes("@")) || !(input.value.includes(".") && (input.value.length <= 100 && input.value.length >= 1))){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Debe ingresar un email valido`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
            case("rptEmail"):
            if(input.value != document.querySelector("#emailRegister").value){
                input.style.border = "1px solid red"
                if(input.nextElementSibling.innerHTML == ""){
                    input.nextElementSibling.innerHTML = `Los correos electronicos no coinciden`
                }
            } else {
                if(input.nextElementSibling.innerHTML != ""){
                    input.nextElementSibling.innerHTML = "";
                }
                input.style.border = "1px solid green"
            }
                break;
            case("pwdRegister"):
                if(!(passwordRegex.test(input.value))){
                    input.style.border = "1px solid red"

                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Debe ingresar una contraseña con un minimo de 8 caracteres, una minuscula, una mayuscula`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
            case("repeatPwdRegister"):
                if(input.value != document.querySelector("#pwdRegister").value){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Las contraseñas no coinciden`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
            case("dni"):
                if((input.value.indexOf(' ') >= 0) && (input.value.length <= 20 && input.value.length >= 1)){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Introduzca su DNI sin espacios`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
        }
    })
   }
   btnRegister.addEventListener("click", (e) => {
       let errorCount = 0;
       for(input of inputsRegister){
           if(!(input.style.borderColor == "green") && (input.id != "newsletter")){
            console.log(input.id)
            errorCount = 1;
           }
       }

       if(errorCount == 1){
        e.preventDefault()
            if(document.querySelector("#errorSubmit").innerHTML == ""){
                document.querySelector("#errorSubmit").innerHTML = `Revise y rellene todos los campos`
            }
        }
   })


}) 