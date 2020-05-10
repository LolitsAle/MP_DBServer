const nodemailer = require('nodemailer')
const {hostMail, hostName , mailPassword, mailService} = require('./getWebdata')

const sendRecoverMail = function (userMail, recoverCode, callback) {

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
        text: 'Thank you for using our service, This is your password recover code:' + recoverCode
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

module.exports = sendRecoverMail