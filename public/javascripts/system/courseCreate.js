
window.addEventListener("load", () => {

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        document.querySelector('.showImg').src=e.target.result
        document.querySelector('.showImg').style.display = "block"
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  document.getElementById("imagenCurso").addEventListener("change", () => {
      readURL(document.getElementById("imagenCurso"))
  });
  let habilitarCheck = document.querySelectorAll(".habilitar")
  for(let habilitar of habilitarCheck){

    habilitar.addEventListener("change", () => {
      let bodyPost = {
        nombre : habilitar.parentElement.previousElementSibling.innerHTML
      }
      if(habilitar.checked == true){
        
        bodyPost.habilitar = 1
      } else{
        bodyPost.habilitar = 0
      }
      if(document.querySelector("#courseInfo")){
        fetch("https://activacoaching.com.ar/dashboard/course-enable", {
          headers : {
            "Content-Type" : "application/json"
          },
          method : "POST",
          body : JSON.stringify(bodyPost)
        })
        .then(data => data.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
      } else if(document.querySelector("#moduleInfo")){
        bodyPost.courseID = document.querySelector("#courseID").value
        fetch("https://activacoaching.com.ar/dashboard/module-enable", {
          headers : {
            "Content-Type" : "application/json"
          },
          method : "POST",
          body : JSON.stringify(bodyPost)
        })
        .then(data => data.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
      }

    })
  }

})
