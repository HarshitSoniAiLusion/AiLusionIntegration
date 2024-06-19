import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

export default function sendMailSubscrib(username,useremail){

    let config={
        service:'gmail',
        auth:{
            user:'harshit@ailusion.in',
            pass:'erfs ubsn jzhv lkbt'
        }
    }
    // Create a transporter object
    let transporter = nodemailer.createTransport(config);
    
    let MailGenrator=new Mailgen({
       theme:'default',
       product:{
        name:'AiLusion',
        link:'https://ailusion.com'
       }
    });
    
    const response ={
        body:{
            name: username,
            intro: "We're thrilled to announce new subscription options to enhance your virtual try-on experience! Now, enjoy more flexibility and value with our updated plans.",
            table: {
                data: [
                    {
                        plan: 'Basic Plan',
                        price: '₹30',
                        description: 'Get 20 virtual try-ons for a month. Perfect for casual users.'
                    },
                    {
                        plan: 'Pro Plan',
                        price: '₹50',
                        description: 'Get 50 virtual try-ons for a month. Ideal for fashion enthusiasts and frequent users.'
                    }
                ],
                columns: {
                    customWidth: {
                        plan: '20%',
                        price: '15%',
                        description: '65%'
                    },
                    customAlignment: {
                        price: 'center',
                        description: 'left'
                    }
                }
            },
            action: {
                instructions: 'To upgrade, simply log in to your account and select your preferred plan.',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Upgrade Now',
                    link: 'https://AiLusion.com/upgrade'
                }
            },
            outro: 'If you have any questions or need assistance, feel free to contact our support team at ailusion.in. Thank you for being a valued member of our community. We look forward to continuing to provide you with a fantastic virtual try-on experience!',
            signature: 'Best regards,\nThe AiLusion Team',
            footer: {
                text: "P.S. Haven't tried our virtual try-on yet? Sign up today and get your first try-on free!",
                link: 'https://AiLusion.com/signup'
            }
        }
    };
    
    let mail=MailGenrator.generate(response);
    
    let message={
        from:process.env.emailId,
        to:useremail,
        subject:'Subscribed the AiLusion',
        html:mail
    }
    
    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
}