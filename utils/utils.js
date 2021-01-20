const sendgrid = require("@sendgrid/mail");

const sendConfirmationMail = async (email, link) => {
    sendgrid.setApiKey(process.env.EMAIL_API_KEY);

    const message = {
        to: email,
        from: 'lorenabaoperez@gmail.com',
        subject: 'Validate your account',
        text: `La dirección de verificación es: ${link}`,
        html: `
        <div>
          <h1> Valida tu registro </h1>
          <p> Si te has registrado en el sistema, accede al siguiente
          enlace para validar tu cuenta </p>

          ${link}
        </div>
      `,
    };

    // Enviar mensaje
    await sendgrid.send(message);
}


const sendRecoverMail = async (email, recoverCode) => {
  sendgrid.setApiKey(process.env.EMAIL_API_KEY);

  const message = {
      to: email,
      from: 'lorenabaoperez@gmail.com',
      subject: 'Recover password',
      text: `Tu código de recuperación es: ${recoverCode}`,
      html: `
      <div>
        <h1> Nueva contraseña </h1>
        <p> Si has pedido un cambio de contraseña, por favor introduce el siguiente código. Si no lo has hecho
        ignora este mensaje </p>

        ${recoverCode}
      </div>
    `,
  };

  // Enviar mensaje
  await sendgrid.send(message);
}

module.exports = {
    sendConfirmationMail,
    sendRecoverMail
}