const db = require("../../database/models/index")
const mercadopago = require ('mercadopago');
const fetch = require('node-fetch');
mercadopago.configure({
    access_token: 'APP_USR-5765622595730064-050520-35855fa999c8ebbfd22e50df278b4515-753205679'
});  
const nodemailer = require("nodemailer")

const paymentFunctions = {
  mailNotification : async (nombre_curso, email) => {

    let contentHTML = `
    <h3>Pago recibido con éxito.</h3>
    <p>¡Muchas gracias, por su compra!</p>
    <table cellspacing='0' style='width: 100%;'> 
        <tr> 
            <th>Información:</th>
            <td>${nombre_curso}</td> 
        </tr> 

        <tr style='background-color: #e0e0e0;'> 
            <th>Estado:</th>
            <td>Pagado</td> 
        </tr> 
    </table>

    <p>
        Su pago se ha procesado correctamente para ver el curso/mentoria dirijase a: https://activacoaching.com.ar/cursos
    </p>

    <p>
        La informacion sobre la reunion semanal se encontrará en el campus dentro de cada clase, en la parte superior. Si tiene alguna consulta o no puede acceder al curso, por favor escriba a: info@activacoaching.com.ar
    </p>
    `
    const transporter = nodemailer.createTransport({
      host: 'mail.activacoaching.com.ar',
      port: 465,
      secure: true,
      auth : {
        user: 'info@activacoaching.com.ar',
        pass: 'Fea5k6aY82'
      },
    tls: {rejectUnauthorized:true}})

      const info = await transporter.sendMail({
        from: "'Activa coaching' <info@activacoaching.com.ar>",
        cc: `${email}, info@activacoaching.com.ar`,
        subject:'Notificacion sobre pago - Activa coaching',
        html: contentHTML
      })
    if(info.response.includes("250" || "OK")){
        console.log("Email enviado con exito")     
    } else{
        console.log("Algo salió mal")
    }
  }
}

const paymentController = {
    viewCheckout : (req, res) => {
        res.render("system/checkout")
    },
    mpCheckout : (req, res) => {
    //    Crea un objeto de preferencia
    db.Course.findOne({where : {id : req.body.course_id}})
    .then( data => {
      let preference = {
        payer : {
          name : req.session.user.nombre,
          surname : req.session.user.apellido,
          email: req.session.user.email,
          identification : {
            type : "DNI",
            number : String(req.session.user.dni)
          }
        },
        items: [
          {
            title: data.nombre_curso,
            description : data.descripcion_corta,
            unit_price: data.costo_pesos,
            quantity: 1,
            currency_id : "ARS",
            id : data.id
          }
        ],
        back_urls: {
                  "success": "https://activacoaching.com.ar/cursos",
                  "pending": "https://activacoaching.com.ar/",
                  "failure": "https://activacoaching.com.ar/"
              },
              auto_return: 'approved',
        notification_url : "https://activacoaching.com.ar/mp-notification?source_news=ipn"
      };

      
      mercadopago.preferences.create(preference)
      .then(function(response){
        global.id = response.body.id;
        return res.json({id : global.id, status : 200})
      }).catch(function(error){
        res.json({msg : error, status : 400});
      });
    })
       
    },
    mpNotification : (req, res) => {
      mercadopago.ipn.manage(req).then(function (data) {

        switch(req.body.topic){
          case "payment":
            break;
          case "merchant_order":
            fetch(`https://api.mercadopago.com/checkout/preferences/${data.body.preference_id}`, {
                headers: {
                  "Authorization": "Bearer APP_USR-5765622595730064-050520-35855fa999c8ebbfd22e50df278b4515-753205679",
                  "Content-Type": "application/json",
                },
                method : "GET"
              })
              .then(response => response.json())
              .then(async response => {
                let Student = await db.Student.findOne({where : {email_alumno : response.payer.email}})
                let findOrder = await db.CourseStudent.findOne({where : {alumno_id : Student.id, curso_id : response.items[0].id}})
                if(!findOrder){
                await  db.CourseStudent.create({
                    alumno_id : Student.id,
                    curso_id : response.items[0].id,
                    estado_pago : data.body.order_status,
                    cancelado : String(data.body.cancelled),
                    total_pago : data.body.total_amount,
                    neto_pago : data.body.paid_amount,
                    id_comprador : data.body.payer.id,
                    pago_identificador : data.body.id,
                    plataforma_pago : "mercadopago",
                    id_preferencia : data.body.preference_id,
                    fecha_pago : data.body.date_created
                  })
                } else {
                await  db.CourseStudent.update({
                      estado_pago : data.body.order_status,
                      cancelado : String(data.body.cancelled),
                      total_pago : data.body.total_amount,
                      neto_pago : data.body.paid_amount,
                      pago_identificador : data.body.id,
                      plataforma_pago : "mercadopago",
                      id_comprador : data.body.payer.id,

                      id_preferencia : data.body.preference_id,
                      fecha_pago : data.body.date_created
                    }, 
                    {
                      where : 
                        {
                          alumno_id : Student.id,
                          curso_id : response.items[0].id,
                        }
                    })
                }

                if(data.body.order_status == "paid"){
                  paymentFunctions.mailNotification(response.items[0].title, Student.email_alumno)
                }
              })
              .catch(err => console.log(err))
            break
        }
        return res.status(200).end()
      }).catch(function (error) {
        console.log(error)
      });
    },

  }

module.exports = paymentController;