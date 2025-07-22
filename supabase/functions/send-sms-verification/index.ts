const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const requestId = crypto.randomUUID().substring(0, 8);
  console.log(`🚀 [${requestId}] SMS Verification Request`);

  try {
    const { phoneNumber } = await req.json()
    console.log(`📱 [${requestId}] Phone:`, phoneNumber);

    if (!phoneNumber) {
      throw new Error('Número de telefone é obrigatório');
    }

    // Verificar credenciais Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const verifyServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')
    
    const hasCredentials = accountSid && authToken && verifyServiceSid;
    
    console.log(`🔑 [${requestId}] Credentials check:`, {
      accountSid: accountSid ? 'PRESENT' : 'MISSING',
      authToken: authToken ? 'PRESENT' : 'MISSING',
      verifyServiceSid: verifyServiceSid ? 'PRESENT' : 'MISSING',
      hasCredentials
    });

    // Normalizar telefone
    const cleanPhone = normalizePhoneNumber(phoneNumber);
    console.log(`📱 [${requestId}] Normalized:`, cleanPhone);

    // MODO DESENVOLVIMENTO - Simular envio quando credenciais ausentes
    if (!hasCredentials) {
      console.log(`⚠️ [${requestId}] DEVELOPMENT MODE: Simulating SMS send`);
      
      // Simular delay de envio real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          sid: `dev_simulation_${requestId}`,
          method: 'development_mode',
          phone: cleanPhone,
          message: 'SMS simulado - use código 123456 para verificar'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // MODO PRODUÇÃO - Enviar SMS real via Twilio
    console.log(`🔄 [${requestId}] PRODUCTION MODE: Sending real SMS via Twilio`);
    
    const result = await sendWithTwilio(accountSid, authToken, verifyServiceSid, cleanPhone, requestId);
    
    console.log(`✅ [${requestId}] SMS sent successfully - SID: ${result.sid}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        sid: result.sid,
        method: 'twilio_verify',
        phone: cleanPhone
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error(`❌ [${requestId}] Error:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Erro ao enviar SMS',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function normalizePhoneNumber(phone: string): string {
  let numbers = phone.replace(/\D/g, '');
  
  if (numbers.startsWith('0')) {
    numbers = numbers.substring(1);
  }
  
  if (!numbers.startsWith('55')) {
    if (numbers.length === 11) {
      numbers = '55' + numbers;
    } else if (numbers.length === 10) {
      numbers = '55' + numbers;
    } else if (numbers.length === 9) {
      numbers = '5511' + numbers;
    } else {
      numbers = '55' + numbers;
    }
  }
  
  return '+' + numbers;
}

async function sendWithTwilio(accountSid: string, authToken: string, serviceSid: string, phoneNumber: string, requestId: string) {
  const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
  
  console.log(`📡 [${requestId}] Sending to Twilio:`, { url, phoneNumber });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: phoneNumber,
      Channel: 'sms'
    })
  });

  const responseData = await response.json();
  console.log(`📡 [${requestId}] Twilio response:`, responseData);

  if (!response.ok) {
    console.error(`❌ [${requestId}] Twilio error:`, responseData);
    throw new Error(`Twilio Error: ${responseData.message}`);
  }

  return responseData;
}