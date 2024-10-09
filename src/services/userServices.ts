import "dotenv/config";
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const create_UUID = () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

const createCodeVerifyEmail = () => {
    let code = '';
    for (let i = 1; i < 7; i++) {
        code += Math.floor(10 * Math.random());
    }
    return code;
};


const create_Html = (name: string, emailMessage: string, code: string) => {
    const html = `
    <section
          style="text-align: center; background: #eef1f7; margin: 0px; padding: 10px; border-radius: 5px; border: solid 1px #1f2b44;">
              <h1 style="font-size: 22px; font-weight: 600; color: #1f2b44"> Olá, ${name} </h1>
              <div style="font-size: 16px; font-weight: 300; color: #000000" line-height: 1; margin: 0 0 5px 0; padding: 0;> ${emailMessage} </div>
              <div style="font-size: 16px; font-weight: 300; color: #000000" line-height: 1; margin: 0 0 5px 0; padding: 0;> Ele só pode ser usado dentro dos próximos 10 minutos e deixará de ser válido em seguida: </div>
              <h1 style="font-size: 30px; font-weight: 800; color: #1f2b44"> ${code.charAt(0) + code.charAt(1)}  ${code.charAt(2) + code.charAt(3)}  ${code.charAt(4) + code.charAt(5)} </h1>
              <h2 style="font-size: 16px; font-weight: 300; color: #000000"> Informamos que, ao efetuar o login, sua sessão será válida por 100 horas. Aproveite! </h2>
              <div style="font-size: 16px; font-weight: 300; color: #000000; line-height: 1; margin: 10px 0 5px 0; padding: 0;">Atenciosamente,</div>
              <div style="font-size: 16px; font-weight: 300; color: #000000; line-height: 1; margin: 0 0 5px 0; padding: 0;">Projeto Ornitorrinco</div>
              <div style="font-size: 16px; font-weight: 300; color: #000000; line-height: 1; margin: 0 0 20px 0; padding: 0;">Desenvolvido por Victor Augusto.</div>

              <hr>
              <p style="font-size: 14px; font-weight: 100;">Se você não solicitou a verificação deste endereço, ignore
                  este e-mail.</p>
      </section>
  `;
    return html;
};


const sendEmailVerification = (nomeUser: string, emailUser: string, emailMessage: string, codUser: string) => {
    const tranportador = nodemailer.createTransport({
        host: process.env.Email_Users_HOST,
        port: process.env.Email_Users_PORT,
        secure: process.env.Email_Users_SECURE,
        auth: {
            user: process.env.Email_Users_USER,
            pass: process.env.Email_Users_PASS
        }
    } as SMTPTransport.Options);

    tranportador.sendMail({
        from: `Projeto Ornitorrinco < ${process.env.Email_Users_USER} >`,
        to: emailUser,
        subject: 'Verificação de Conta',
        html: create_Html(nomeUser, emailMessage, codUser)
    }).then(() => {
        return 'success'
    }).catch((error) => {
        return 'erro'
    })
};


export default { create_UUID, createCodeVerifyEmail, sendEmailVerification };