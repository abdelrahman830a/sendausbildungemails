'use server';

import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import path from 'path';

export async function SendAusbildungEmails(emails: string[]) {
    console.log('Starting to send Ausbildung emails');

    // Validate input
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        const errorMsg = 'Invalid email addresses provided';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    console.log(`Email addresses to send: ${emails.join(', ')}`);

    // Create transporter
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

    // Define email content
    const subject = 'Ausbildung Zum Fachinformatiker';
    const message = `Sehr geehrte Damen und Herren,

über die Arbeitsagentur bin ich auf Ihre ausgeschriebene Stelle für den Ausbildungsplatz zum Fachinformatiker aufmerksam geworden und möchte mich hiermit gerne bewerben.

Im Anhang finden Sie meine Bewerbungsunterlagen als PDF-Datei.

Gerne stehe ich Ihnen für ein Vorstellungsgespräch zur Verfügung, um Ihnen weitere Fragen zu beantworten.

Mit freundlichen Grüßen

Abdelrahman Zaitoun
+201120195455
abdelrahmanzaitoun9@gmail.com`;

    // Define attachment path
    const attachmentPath = path.join(
        'C:',
        'Users',
        'Zaitoun',
        'Downloads',
        'all',
        'Komplett',
        'Bewerbung_AbdelrahmanZaitoun.pdf'
    );

    // Verify attachment exists
    try {
        readFileSync(attachmentPath);
        console.log('Attachment found:', attachmentPath);
    } catch (error) {
        const errorMsg = 'Bewerbungsunterlagen nicht gefunden';
        console.error('Attachment error:', error);
        throw new Error(errorMsg);
    }

    // Send emails
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emails.join(', '),
            subject,
            text: message,
            attachments: [{
                filename: 'Bewerbung_AbdelrahmanZaitoun.pdf', // Updated filename
                path: attachmentPath,
            }],
        });
        console.log('Emails sent successfully to:', emails.join(', '));

        return { success: true, message: 'Emails sent successfully!' };
    } catch (error) {
        console.error('Error sending emails:', error);
        throw new Error('Fehler beim Senden der E-Mails');
    }
}
