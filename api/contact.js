import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Dp3oV5C8_KMZGZnFFxxEwDds8NzXzPgf8';
const resend = new Resend(RESEND_API_KEY);

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const record = rateLimitStore.get(ip);
  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Contact form submission received:', req.body);
    
    // Check if API key is available
    if (!RESEND_API_KEY || RESEND_API_KEY === 'undefined') {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ 
        error: 'E-postkonfiguration saknas. Kontakta administratören.' 
      });
    }

    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (isRateLimited(clientIP)) {
      return res.status(429).json({ 
        error: 'För många förfrågningar. Försök igen om 15 minuter.' 
      });
    }

    const { name, email, phone, message, datum } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Alla obligatoriska fält måste fyllas i.' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ogiltig e-postadress.' 
      });
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'Nollettan Kontakt <noreply@resend.dev>',
      to: ['info@nollettan.se'],
      replyTo: email,
      subject: `Nytt meddelande från ${name} - nollettan.se`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nytt kontaktmeddelande</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Nytt kontaktmeddelande</h1>
            <p style="color: #666; margin: 0;">Från kontaktformuläret på nollettan.se</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Kontaktinformation</h2>
            
            <p><strong>Namn:</strong> ${name}</p>
            <p><strong>E-post:</strong> <a href="mailto:${email}" style="color: #3498db;">${email}</a></p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
            <p><strong>Datum:</strong> ${datum || new Date().toLocaleDateString('sv-SE')}</p>
            <p><strong>Skickat från:</strong> nollettan.se kontaktformulär</p>
            
            <h3 style="color: #2c3e50; margin-top: 30px;">Meddelande:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px; font-size: 14px; color: #666;">
            <p style="margin: 0;"><strong>Tips:</strong> Svara direkt på detta e-postmeddelande för att kontakta ${name} på ${email}</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return res.status(200).json({ 
      success: true, 
      message: 'Meddelandet har skickats framgångsrikt!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Ett fel uppstod vid skickandet av meddelandet.';
    
    if (error.message?.includes('Invalid API key')) {
      errorMessage = 'E-postkonfiguration är felaktig. Kontakta administratören.';
    } else if (error.message?.includes('network')) {
      errorMessage = 'Nätverksfel. Kontrollera din internetanslutning och försök igen.';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}