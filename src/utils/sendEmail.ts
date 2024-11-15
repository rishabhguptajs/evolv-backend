import nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const account = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        const message = {
            from: `Evolv <${account.user}>`,
            to: email,
            subject: subject,
            text: text
        }

        const info = await transporter.sendMail(message);

        const previewURL = nodemailer.getTestMessageUrl(info);

        return previewURL;
    } catch (error: any) {
        console.error(error);
    }
}

export default sendEmail;