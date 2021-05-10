
window.addEventListener("load", () => {

  function readURLLanding(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      console.log(input)
      reader.onload = function(e) {
        document.querySelector('.showImgLanding').src=e.target.result
        document.querySelector('.showImgLanding').style.display = "block"
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  document.getElementById("imagenLanding").addEventListener("change", () => {
      readURLLanding(document.getElementById("imagenLanding"))
  });
  function readURLCampus(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        document.querySelector('.showImgCampus').src=e.target.result
        document.querySelector('.showImgCampus').style.display = "block"
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  document.getElementById("imagenCampus").addEventListener("change", () => {
      readURLCampus(document.getElementById("imagenCampus"))
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
      console.log(bodyPost)
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
      } else if(document.querySelector("#classInfo")){
        bodyPost.courseID = document.querySelector("#courseID").value
        fetch("https://activacoaching.com.ar/dashboard/class-enable", {
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

  let habilitarPago = document.querySelectorAll(".habilitarPago")
  for(let checkPago of habilitarPago){
    checkPago.addEventListener("change", () => {
      let bodyPost = {
        nombre : checkPago.parentElement.previousElementSibling.previousElementSibling.innerHTML
      }
      if(checkPago.checked == true){
        
        bodyPost.checkPago = 1
      } else{
        bodyPost.checkPago = 0
      }
        fetch("http://localhost:3001/dashboard/payment-enable", {
          headers : {
            "Content-Type" : "application/json"
          },
          method : "POST",
          body : JSON.stringify(bodyPost)
        })
        .then(data => data.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
      })
  }
  
})
