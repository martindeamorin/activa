
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
    input.addEventListener("change", () => {
        if((document.querySelector("#errorSubmit").innerHTML != "")){
            document.querySelector("#errorSubmit").innerHTML == ""
        }
        switch(input.id){
            case("emailLogin"):
                if(input.value.length < 0){
                    input.style.border = "1px solid red"
                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Debe ingresar un email`
                    }
                } else {
                    if(input.nextElementSibling.innerHTML != ""){
                        input.nextElementSibling.innerHTML = "";
                    }
                    input.style.border = "1px solid green"
                }
                break;
            case("pwdLogin"):
                if(input.value.length < 0){
                    input.style.border = "1px solid red"

                    if(input.nextElementSibling.innerHTML == ""){
                        input.nextElementSibling.innerHTML = `Debe ingresar una contraseña`
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
           if(!(input.style.borderColor == "green") && input.id != "rememberMe"){
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