import Twilio from 'twilio';

export const generateToken = (identity: string): string => {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const twilioApiKey = process.env.TWILIO_API_KEY || '';
    const twilioApiSecret = process.env.TWILIO_API_SECRET || '';
  
    const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;
    const pushNotificationSid = process.env.PUSH_CREDENTIAL_SID;
  
    const token = new Twilio.jwt.AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity, ttl: 60 * 60 * 3 }
    );
  
    const chatGrant = new Twilio.jwt.AccessToken.ChatGrant({
      serviceSid,
    });
    if (pushNotificationSid) {
      chatGrant.pushCredentialSid = pushNotificationSid;
    }
    token.addGrant(chatGrant);
  
    return token.toJwt();
  }