$(document).ready( function () {
    let data = [];
    let datatable;


    let getData = () => {
        fetch("https://activacoaching.com.ar/dashboard/transactions", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                curso : "todos",
                limite : "",
                email : "",
                orden : "DESC"
            })
            })
        .then(res => res.json())
        .then(res => {
            const {transactionData} = res;
            console.log(transactionData)
            if(!(transactionData[0])){
                document.querySelector("#courseInfo").innerHTML =  `<tr><td colspan="4">No se han encontrado transacciones</td></tr>`
            }else{
                data = transactionData;
                for(transaction of data){
                    let id = transaction.id;
                    transaction.id = `<a style="text-align: center;" href="/dashboard/transactions/${id}"><button class="claseButton btnDashboard">DETALLE</button></a>`
                }
                datatable = $('#table-id').DataTable({
                    data : data,
                    columns : [
                        {data : "student.email_alumno"},
                        {data : "course.nombre_curso"},
                        {data : "estado_pago"},
                        {data : "id"},
                    ]
                });
            }
        })
    }


    getData();

    btnFiltrar.addEventListener("click", (e) => {
        e.preventDefault()
        let orden;
        if(document.querySelector("#ordenDESC").checked){
            orden = document.querySelector("#ordenDESC").value
        } else{
            orden = document.querySelector("#ordenASC").value
        }
        fetch("https://activacoaching.com.ar/dashboard/transactions", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                curso : document.querySelector("#curso").value,
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
                for(transaction of data){
                    let id = transaction.id;
                    transaction.id = `<a style="text-align: center;" href="/dashboard/transactions/${id}"><button class="claseButton btnDashboard">DETALLE</button></a>`
                }
                datatable.clear();
                datatable.rows.add(data);
                datatable.draw();
            }
        })
    })
    
} );


