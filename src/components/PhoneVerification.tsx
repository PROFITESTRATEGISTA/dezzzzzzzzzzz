import React, { useState } from 'react';
import { Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerificationComplete: (verified: boolean) => void;
  onBack: () => void;
}

export function PhoneVerification({ phoneNumber, onVerificationComplete, onBack }: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [smsMethod, setSmsMethod] = useState<string>('');

  const sendVerificationCode = async () => {
    setSendingCode(true);
    setError('');
    
    try {
      console.log('🚀 [SMS_SEND] Iniciando envio para:', phoneNumber);
      console.log('🔧 [SMS_SEND] Environment check:', {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'PRESENTE' : 'AUSENTE',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'AUSENTE',
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log('📡 [SMS_SEND] Response status:', response.status);
      console.log('📡 [SMS_SEND] Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Capturar resposta raw antes de processar JSON
      const responseText = await response.text();
      console.log('📡 [SMS_SEND] Response raw:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ [SMS_SEND] JSON Parse Error:', parseError);
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('📱 [SMS_SEND] Response parsed:', data);
      
      if (data.success) {
        setCodeSent(true);
        setSmsMethod(data.method || 'unknown');
        
        if (data.fallback) {
          console.log('🔧 [SMS_SEND] Fallback mode active - Use code: 123456');
          setError(''); // Limpar erro anterior
        } else {
          console.log(`✅ [SMS_SEND] Success via ${data.method} - SID: ${data.sid}`);
        }
      } else {
        console.error('❌ [SMS_SEND] API returned error:', data);
        
        // Análise detalhada do erro retornado
        const errorDetails = {
          apiError: data.error,
          debug: data.debug,
          timestamp: data.timestamp,
          originalError: data.debug?.originalError,
          errorType: data.debug?.errorType,
          hasCredentials: data.debug?.hasCredentials
        };
        
        console.error('🔍 [SMS_SEND] Error analysis:', errorDetails);
        
        // Determinar mensagem específica baseada no erro
        let specificError = data.error || 'Erro desconhecido na API';
        
        if (data.debug?.originalError?.includes('20003')) {
          specificError = 'Número de telefone inválido ou não autorizado pelo Twilio';
        } else if (data.debug?.originalError?.includes('21211')) {
          specificError = 'Formato de telefone inválido. Use: +5511999999999';
        } else if (data.debug?.originalError?.includes('21614')) {
          specificError = 'Este número não pode receber SMS';
        } else if (!data.debug?.hasCredentials) {
          specificError = 'Credenciais Twilio não configuradas no servidor';
        }
        
        throw new Error(specificError);
      }
    } catch (err) {
      console.error('❌ [SMS_SEND] Critical error:', err);
      
      // Log detalhado do erro para debugging enterprise
      const errorAnalysis = {
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause,
        timestamp: new Date().toISOString(),
        phoneNumber: phoneNumber,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.error('🔍 [SMS_SEND] Full error analysis:', errorAnalysis);
      
      let errorMessage = 'Erro ao enviar SMS. Tente novamente.';
      
      // Tratamento específico baseado no tipo de erro
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message?.includes('Credenciais Twilio')) {
        errorMessage = 'Serviço SMS temporariamente indisponível. Contate o suporte.';
      } else if (err.message?.includes('Resposta inválida')) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
      } else if (err.message?.includes('20003')) {
        errorMessage = 'Número de telefone inválido ou não autorizado.';
      } else if (err.message?.includes('21211')) {
        errorMessage = 'Formato de telefone inválido. Use: (11) 99999-9999';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Timeout na conexão. Tente novamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Log para monitoramento (Sentry/Datadog integration point)
      console.error('📊 [MONITORING] SMS Send Failed:', {
        error: errorMessage,
        originalError: err.message,
        phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*'), // Mascarar número para logs
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100)
      });
      
      setError(errorMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Verificando código:', verificationCode);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-sms-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      const data = await response.json();
      console.log('✅ Resposta verificação:', data);
      
      if (data.success && data.verified) {
        console.log(`✅ Código verificado via ${data.method || 'unknown'}`);
        console.log('🔄 Chamando onVerificationComplete(true)...');
        onVerificationComplete(true);
      } else {
        console.log('❌ Verificação falhou:', data);
        throw new Error(data.error || 'Código inválido ou expirado');
      }
    } catch (err) {
      console.error('❌ Erro verificação:', err);
      setError(err.message || 'Código inválido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!codeSent) {
      sendVerificationCode();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verificação de Telefone
            </h2>
            <p className="text-gray-600">
              Enviamos um código de verificação para
            </p>
            <p className="font-semibold text-blue-600 text-lg">
              {phoneNumber}
            </p>
          </div>

          {!codeSent || sendingCode ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              {smsMethod === 'development_mode' ? (
                <div className="mt-2">
                  <p className="text-green-600 text-sm">
                    🔧 Modo desenvolvimento ativo
                  </p>
                  <p className="text-blue-600 text-sm font-medium">
                    Use o código: <strong>123456</strong>
                  </p>
                </div>
              ) : (
                <p className="text-green-600 text-sm mt-1">
                  Verifique sua caixa de mensagens
                </p>
              )}
              
              {sendingCode && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    ⏳ Conectando com Twilio... Isso pode levar alguns segundos.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">✅ SMS enviado com sucesso!</p>
                <p className="text-green-600 text-sm mt-1">
                  Verifique sua caixa de mensagens
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificação
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={verifyCode}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verificar Código</span>
                    </>
                  )}
                </button>

                <button
                  onClick={sendVerificationCode}
                  disabled={isLoading || sendingCode}
                  className="w-full text-blue-600 font-medium py-2 hover:text-blue-700 transition-colors"
                >
                  {sendingCode ? 'Enviando...' : 'Reenviar código'}
                </button>

                <button
                  onClick={onBack}
                  className="w-full text-gray-600 font-medium py-2 hover:text-gray-700 transition-colors"
                >
                  ← Voltar e alterar telefone
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Segurança Garantida</p>
                <p className="text-xs text-green-700">
                  Seus dados estão protegidos e a verificação é necessária para sua segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}