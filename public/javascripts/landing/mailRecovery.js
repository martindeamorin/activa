window.addEventListener("load", () => {
    let btnRecovery = document.querySelector("#sendRecovery");

    const urlParams = new URLSearchParams(window.location.search);
    const queryEmail = urlParams.get('recoverEmail');

    btnRecovery.addEventListener("click", (e) => {
        e.preventDefault()
        let recoverEmail = queryEmail || document.querySelector("#recoverEmail").value;
        fetch("https://activacoaching.com.ar/recoveryEmail", {
            method: "POST",
            body: JSON.stringify({recoverEmail}),
            headers: {
                "content-type" : "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 200){
                window.location.replace(`https://activacoaching.com.ar/recuperar-contrasena/pin?recoverEmail=${recoverEmail}`)
            } else {
                document.querySelector(".errorMessage").innerHTML = "Algo salio mal, por favor intentelo nuevamente."
            }
        })
    })
})