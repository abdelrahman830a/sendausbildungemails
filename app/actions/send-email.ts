'use server'
import nodemailer from 'nodemailer';

export async function SendAusbildungEmails(emails: string[]) {
    console.log('Starting to send Ausbildung emails');

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        const errorMsg = 'Invalid email addresses provided';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    console.log(`Email addresses to send: ${emails.join(', ')}`);

    let transporter;
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('Transporter created successfully');
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw new Error('Failed to create transporter');
    }

    const subject = 'Ausbildung Zum Fachinformatiker';
    const message = `Sehr geehrte Damen und Herren,

über die Arbeitsagentur bin ich auf Ihre ausgeschriebene Stelle für den Ausbildungsplatz zum Fachinformatiker aufmerksam geworden und möchte mich hiermit gerne bewerben.

Im Anhang finden Sie meine Bewerbungsunterlagen als PDF-Datei.

Gerne stehe ich Ihnen für ein Vorstellungsgespräch zur Verfügung, um Ihnen weitere Fragen zu beantworten.

Mit freundlichen Grüßen

Abdelrahman Zaitoun
+201120195455
abdelrahmanzaitoun9@gmail.com`;

    // Use the Google Drive URL for the attachment
    const attachmentUrl = 'https://drive.google.com/uc?export=download&id=1EynLgdIm_6H5izNliyuY43nVd07t78gr';

    // Send individual emails for each recipient
    const results = [];
    for (const email of emails) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject,
                text: message,
                attachments: [{
                    filename: 'Bewerbung_AbdelrahmanZaitoun.pdf',
                    path: attachmentUrl,
                }],
            });
            console.log(`Email sent successfully to: ${email}`);
            results.push({ email, success: true });
        } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
            results.push({ email, success: false, error });
        }
    }

    return { success: true, results };
}
