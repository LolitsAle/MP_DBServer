const nodemailer = require('nodemailer')
const {hostMail, hostName , mailPassword, mailService} = require('./getWebdata')

const sendMail = function (userMail, activeCode, callback) {

    var transport = nodemailer.createTransport({
        service: mailService,
        auth: {
          user: hostMail,
          pass: mailPassword 
        }
      });
    
    var mailOptions = {
        from: hostName +' <' + hostMail + '>',
        to: userMail,
        subject: 'your activation code',
        text: 'Thank you for using our service, This is your activation code:' + activeCode
    };
    
    transport.sendMail(mailOptions, (error, response)=>{
        if(error){
            callback(error, undefined)
        }
        else{
            callback(undefined, {status : 'Success'})
        }    
    });
    
}

module.exports = sendMail

// sendMail('Tunggas000@gmail.com', "AGFSUYE", (error, response) => {
//     if(error) {
//         console.log('Failed to send email')
//     }
//     else{
//         console.log(response.status)
//     }
// })