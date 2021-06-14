window.addEventListener("load", () => {
    let botonFiltrar = document.querySelector("#btnFiltrar")

    var state = {
        'querySet': [],
    
        'page': 1,
        'rows': 15,
        'window': 5,
    }

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
                if(!(transactionData[0])){
                    document.querySelector("#courseInfo").innerHTML =  `<tr><td colspan="4">No se han encontrado transacciones</td></tr>`
                }else{
                    state.querySet = transactionData
                    buildTable()
                }
            })
   

    botonFiltrar.addEventListener("click", (e) => {
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
                state.querySet = transactionData
                buildTable()
            }
        })
    })

    
    function pagination(querySet, page, rows) {
    
        var trimStart = (page - 1) * rows
        var trimEnd = trimStart + rows
    
        var trimmedData = querySet.slice(trimStart, trimEnd)
    
        var pages = Math.round(querySet.length / rows);
    
        return {
            'querySet': trimmedData,
            'pages': pages,
        }
    }
    
    function pageButtons(pages) {
        var wrapper = document.getElementById('pagination-wrapper')
    
        wrapper.innerHTML = ``
        console.log('Pages:', pages)
    
        var maxLeft = (state.page - Math.floor(state.window / 2))
        var maxRight = (state.page + Math.floor(state.window / 2))
    
        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = state.window
        }
    
        if (maxRight > pages) {
            maxLeft = pages - (state.window - 1)
            
            if (maxLeft < 1){
                maxLeft = 1
            }
            maxRight = pages
        }
        
        
    
        for (var page = maxLeft; page <= maxRight; page++) {
            wrapper.innerHTML += `<button value=${page} class="page">${page}</button>`
        }
        if(pages == 0){
            wrapper.innerHTML = `<button value=${1} class="page">1</button>` + wrapper.innerHTML
        }
    
        if (state.page != 1) {
            wrapper.innerHTML = `<button value=${1} class="page">&#171; Primero</button>` + wrapper.innerHTML
        }
    
        if ((state.page != pages) && (pages > state.window )) {
            wrapper.innerHTML += `<button value=${pages} class="page">Ultimo &#187;</button>`
        }
    
        $('.page').on('click', function() {
            $('#courseInfo').empty()
    
            state.page = Number($(this).val())
    
            buildTable()
        })
    
    }
    
    
    function buildTable() {
        var table = $('#courseInfo')
        $('#courseInfo').empty()
        var data = pagination(state.querySet, state.page, state.rows)
        var myList = data.querySet
    
        for (var i = 1 in myList) {
            //Keep in mind we are using "Template Litterals to create rows"
            var row = `<tr>
                      <td>${myList[i].student.email_alumno}</td>
                      <td>${myList[i].course.nombre_curso}</td>
                      <td>${myList[i].estado_pago}</td>
                      <td><a style="text-align: center;" href="/dashboard/transactions/${myList[i].id}"><button class="claseButton btnDashboard">DETALLE</button></a></td>
                      </tr>
                      `
            table.append(row)
        }
    
        pageButtons(data.pages)
    }
})