const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
});

// === Hàm gửi email ===
module.exports = {
    sendMail: async function (to, url) {
        try {
            const templatePath = path.join(__dirname, '../templates/mailForgotpassword.html');
            const template = fs.readFileSync(templatePath, 'utf8');

            const htmlContent = template
                .replace(/{{reset_link}}/g, url)
                .replace(/{{expiry_hours}}/g, '1')
                .replace(/{{company_name}}/g, 'Your Company');

            const info = await transporter.sendMail({
                from: process.env.MAIL_FROM, // ✅ Lấy từ .env
                to,
                subject: "🔑 Đặt lại mật khẩu của bạn",
                html: htmlContent,
            });

            console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error("❌ Error sending email:", error.message);
            throw error;
        }
    }
};
