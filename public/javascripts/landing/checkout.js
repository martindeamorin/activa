
    window.addEventListener("load", () => {
        if(window.localStorage.getItem("returnURL")){
            window.localStorage.removeItem("returnURL")
        }
        if(!document.querySelector("#login")){
            const mp = new MercadoPago('APP_USR-80bbde56-b4ea-4e88-bf9d-a6f8e38ab686', {
                locale: 'es-AR'
          });
                fetch("http://activacoaching.com.ar/mp-checkout", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify({course_id : document.querySelector("#courseID").value})
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    mp.checkout({
                        preference: {
                            id: response.id
                        },
                        render: {
                              container: '.mercadopago-button', // Indica dónde se mostrará el botón de pago
                              label: 'MERCADOPAGO', // Cambia el texto del botón de pago (opcional)
                        }
                })
            })
            .catch(err => console.log(err))
        } else {
            document.querySelector("#log").addEventListener("click", (e) => {
                window.localStorage.setItem('returnURL', window.location.href);
            })
            document.querySelector("#reg").addEventListener("click", () => {
                window.localStorage.setItem('returnURL', window.location.href);
            })
        }
        
})