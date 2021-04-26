const db = require("../../database/models/index")
const mercadopago = require ('mercadopago');
const fetch = require('node-fetch');
mercadopago.configure({
    access_token: 'APP_USR-7767459944473453-041919-da2b0362a11e964ee5469ccbd1f2fb1f-746406038'
});  

const paymentFunctions = {
  mailNotification : async (nombre_usuario, email, estado_pago, identificador_pago) => {

    let contentHTML = `
    <h3>¡Buenos dias, ${nombre_usuario}!</h3>
    <p>Le notificamos que su pago (id: ${identificador_pago}) ha sido </p>
    `
    const transporter = nodemailer.createTransport({
      host: 'mail.activacoaching.com.ar',
      port: 465,
      secure: true,
      auth : {
        user: 'contacto@activacoaching.com.ar',
        pass: 'Fea5k6aY82'
      },
    tls: {rejectUnauthorized:true}})

      const info = await transporter.sendMail({
        from: "'Activa coaching' <contacto@activacoaching.com.ar>",
        bcc: `${email}, contacto@activacoaching.com.ar`,
        subject:'Notificacion sobre pago - Activa coaching',
        html: contentHTML
      })
    if(info.response.includes("250" || "OK")){
        console.log(info)
        return res.redirect(`/recuperar-contrasena/pin`)            
    } else{
        return res.render("system/viewRecovery", {error : "Algo salio mal, intentelo de nuevo"})
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
      console.log(req.session.user.email)
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
            console.log(data)
            break;
          case "merchant_order":
            fetch(`https://api.mercadopago.com/checkout/preferences/${data.body.preference_id}`, {
                headers: {
                  "Authorization": "Bearer APP_USR-7767459944473453-041919-da2b0362a11e964ee5469ccbd1f2fb1f-746406038",
                  "Content-Type": "application/json",
                },
                method : "GET"
              })
              .then(response => response.json())
              .then(async response => {
                let Student = await db.Student.findOne({where : {email_alumno : response.payer.email}})
                let findOrder = await db.CourseStudent.findOne({where : {alumno_id : Student.id, curso_id : response.items[0].id}})
                if(!findOrder){
                  db.CourseStudent.create({
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
                  db.CourseStudent.update({
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
              })
              .catch(err => console.log(err))
            break
        }
        return res.status(200).end()
      }).catch(function (error) {
        console.log(error)
      });
    },
    ppNotification : (req, res) => {
      let postreq = 'cmd=_notify-validate';

      for(let key in req.body){
        postreq += `&${key}=${req.body[key]}`;
      }

      fetch("https://ipnpb.sandbox.paypal.com/cgi-bin/webscr", {
       body : postreq,
       encoding : "utf-8",
       method : "POST",
       headers : {
        'Content-Length': postreq.length,
       }
      })
      .then(data => data.text())
      .then(data => {
        
        if(data == "VERIFIED"){
          let Student = await db.Student.findOne({where : {email_alumno : response.payer.email}})
          let findOrder = await db.CourseStudent.findOne({where : {alumno_id : Student.id, curso_id : response.items[0].id}})
          if(!findOrder){
            db.CourseStudent.create({
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
            db.CourseStudent.update({
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
        }
      })
      .catch(err => console.log(err))
      console.log(req.body)
      return res.status(200).end()
    
}

  }

module.exports = paymentController;