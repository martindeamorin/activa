
    window.addEventListener("load", () => {
        if(window.localStorage.getItem("returnURL")){
            window.localStorage.removeItem("returnURL")
        }
        if(!document.querySelector("#login")){
            const mp = new MercadoPago('APP_USR-5206199b-33fa-4500-b86a-e5bbb6036be3', {
                locale: 'es-AR'
          });
                fetch("https://activacoaching.com.ar/mp-checkout", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify({course_id : document.querySelector("#courseID").value})
                })
                .then(response => response.json())
                .then(response => {
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