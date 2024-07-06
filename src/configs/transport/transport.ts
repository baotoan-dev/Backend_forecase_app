import logging from "../../utils/logging";
import nodemailer from "nodemailer";

const nodeMailerTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD
    }
});

const sendEmailToUser = (options: any, callback: Function = () => { }) => {
    logging.info("Send OTP start ...")

    const mailOptions = {
        from: {
            name: "Jobs",
            address: process.env.NODE_MAILER_EMAIL
        },
        ...options
    };

    // console.log(mailOptions)

    nodeMailerTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logging.error("OTP sent to email failed");
            console.log(error)
            callback(false);
        } else {
            logging.info("OTP sent to email");
            callback(true);
        }
    });
};



export { sendEmailToUser, nodeMailerTransporter};