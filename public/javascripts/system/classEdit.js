window.addEventListener("load", () => {
    let input = document.querySelector('input[type="file"]')
    let selectedFiles = document.querySelector(".selectedFiles")
    input.addEventListener("change", () => {
        selectedFiles.innerHTML = "";
        for(let file of input.files){
            console.log(file)
            selectedFiles.innerHTML += `<span>${file.name}</span><br>`
        }

    })
})