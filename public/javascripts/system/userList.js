$(document).ready( function () {
    let data = [];
    let datatable;


    let getData = () => {
        fetch("https://activacoaching.com.ar/dashboard/users", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                limite : "",
                email : "",
                orden : "DESC"
            })
            })
            .then(res => res.json())
            .then(res => {
                const {transactionData} = res;
                if(!(transactionData[0])){
                    document.querySelector("#courseInfo").innerHTML =  `<tr><td colspan="4">No se han encontrado usuarios</td></tr>`
                }else{
                    data = transactionData;
                    datatable = $('#table-id').DataTable({
                        data : data,
                        columns : [
                            {data : "nombre_alumno"},
                            {data : "apellido_alumno"},
                            {data : "email_alumno"},
                            {data : "newsletter"},
                        ]
                    });
                }
            })
    }


    getData();

        btnFiltrar.addEventListener("click", (e) => {
        console.log("A")
        e.preventDefault()
        let orden;
        if(document.querySelector("#ordenDESC").checked){
            orden = document.querySelector("#ordenDESC").value
        } else{
            orden = document.querySelector("#ordenASC").value
        }
        fetch("https://activacoaching.com.ar/dashboard/users", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                limite : document.querySelector("#limite").value,
                email : document.querySelector("#email").value,
                orden : orden
            })
        })
        .then(res => res.json())
        .then(res => {
            const {transactionData} = res;
            if(!(transactionData[0])){
                document.querySelector("#courseInfo").innerHTML =  `<tr><td colspan="4">No se han encontrado transacciones</td></tr>`
            }else{
                data = transactionData;
                datatable.clear();
                datatable.rows.add(data);
                datatable.draw();
            }
        })
    })
    
} );


