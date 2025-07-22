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
  console.log(`🔍 [${requestId}] SMS Code Verification`);

  try {
    const { phoneNumber, code } = await req.json()
    console.log(`🔍 [${requestId}] Verifying:`, { phoneNumber, code });

    if (!phoneNumber || !code) {
      throw new Error('Número de telefone e código são obrigatórios');
    }

    if (!/^\d{6}$/.test(code)) {
      throw new Error('Código deve ter exatamente 6 dígitos');
    }

    // Verificar credenciais Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const verifyServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')
    
    const hasCredentials = accountSid && authToken && verifyServiceSid;
    const cleanPhone = normalizePhoneNumber(phoneNumber);

    console.log(`🔑 [${requestId}] Credentials check:`, {
      hasCredentials,
      phone: cleanPhone
    });

    // MODO DESENVOLVIMENTO - Aceitar qualquer código de 6 dígitos
    if (!hasCredentials) {
      console.log(`⚠️ [${requestId}] DEVELOPMENT MODE: Accepting any 6-digit code`);
      
      // Aceitar qualquer código de 6 dígitos em desenvolvimento
      if (code.length === 6) {
        console.log(`✅ [${requestId}] Code accepted in development mode`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            verified: true,
            method: 'development_mode',
            phone: cleanPhone,
            message: 'Código aceito em modo desenvolvimento'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      } else {
        throw new Error('Código deve ter 6 dígitos');
      }
    }

    // MODO PRODUÇÃO - Verificar via Twilio
    console.log(`🔄 [${requestId}] PRODUCTION MODE: Verifying with Twilio`);
    
    const result = await verifyWithTwilio(accountSid, authToken, verifyServiceSid, cleanPhone, code, requestId);
    
    if (result.status === 'approved') {
      console.log(`✅ [${requestId}] Code verified successfully via Twilio`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          method: 'twilio_verify',
          phone: cleanPhone
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      console.log(`❌ [${requestId}] Code rejected by Twilio:`, result.status);
      throw new Error('Código inválido ou expirado');
    }

  } catch (error) {
    console.error(`❌ [${requestId}] Verification error:`, error);
    
    let errorMessage = 'Código inválido ou expirado';
    
    if (error.message?.includes('20404')) {
      errorMessage = 'Verificação não encontrada. Solicite um novo código.';
    } else if (error.message?.includes('Código deve ter')) {
      errorMessage = error.message;
    } else if (error.message?.includes('obrigatórios')) {
      errorMessage = error.message;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        verified: false,
        error: errorMessage,
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

async function verifyWithTwilio(accountSid: string, authToken: string, serviceSid: string, phoneNumber: string, code: string, requestId: string) {
  const url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
  
  console.log(`📡 [${requestId}] Verifying with Twilio:`, { url, phoneNumber, code });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: phoneNumber,
      Code: code
    })
  });

  const responseData = await response.json();
  console.log(`📡 [${requestId}] Twilio verification response:`, responseData);

  if (!response.ok) {
    console.error(`❌ [${requestId}] Twilio verification error:`, responseData);
    throw new Error(`Twilio Error: ${responseData.message}`);
  }

  return responseData;
}