import React, { useEffect, useState } from 'react';
import { CheckCircle, Heart, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { DezSaudeLogo } from './Logo';

interface ThankYouPageProps {
  customerName: string;
  pharmacy: {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  };
  funcionario: {
    nome: string;
    cargo: string;
  };
}

export function ThankYouPage({ customerName, pharmacy, funcionario }: ThankYouPageProps) {
  const [countdown, setCountdown] = useState(10);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = 'https://www.dezemergencias.com.br';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirectNow = () => {
    setRedirecting(true);
    window.location.href = 'https://www.dezemergencias.com.br';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <DezSaudeLogo size="md" showPartnership={true} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {/* Ícone de sucesso */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Título principal */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" role="heading" aria-level="2">
            Parabéns {customerName}!
          </h2>
          
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
            <strong>Cadastro realizado</strong> no Plano Dez Saúde!
          </p>
          <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
            Sua família está protegida com emergências médicas 24h em São Paulo.
          </p>

          {/* Status de verificação */}
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="h-4 w-4" />
            <span>Telefone verificado via SMS</span>
          </div>
        </div>

        {/* Informações do cadastro */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Informações da farmácia */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900" role="heading" aria-level="3">Farmácia Droga Leste Selecionada</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900" role="heading" aria-level="4">{pharmacy.nome}</h4>
                <p className="text-gray-600">{pharmacy.endereco}</p>
                <p className="text-gray-600">{pharmacy.bairro} - {pharmacy.cidade}</p>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">Profissional responsável:</p>
                <p className="font-medium text-gray-900">{funcionario.nome}</p>
                <p className="text-sm text-gray-600">{funcionario.cargo}</p>
              </div>
            </div>
          </div>

          {/* Próximos passos */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900" role="heading" aria-level="3">Próximos Passos Plano Dez Saúde</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contato da equipe</p>
                  <p className="text-sm text-gray-600">Nossa equipe entrará em contato em até 24h para finalizar sua contratação</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ativação do plano</p>
                  <p className="text-sm text-gray-600">Após a confirmação, seu plano será ativado imediatamente</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Proteção 24h</p>
                  <p className="text-sm text-gray-600">Sua família estará protegida com atendimento de emergência 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios do plano */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center" role="heading" aria-level="3">Sua Família Agora Está Protegida com Dez Saúde</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2" role="heading" aria-level="4">Atendimento Emergência 24h</h4>
              <p className="text-sm text-blue-100">Emergências médicas a qualquer hora do dia</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2" role="heading" aria-level="4">Cobertura São Paulo</h4>
              <p className="text-sm text-blue-100">São Paulo e Grande SP completamente cobertos</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2" role="heading" aria-level="4">Orientação Médica Dez Saúde</h4>
              <p className="text-sm text-blue-100">Orientação médica imediata por telefone</p>
            </div>
          </div>
        </div>

        {/* Redirecionamento */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4" role="heading" aria-level="3">
            Conheça Mais Sobre a Dez Saúde
          </h3>
          
          <p className="text-gray-600 mb-6">
            Você será redirecionado para nosso site oficial em <strong>{countdown} segundos</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleRedirectNow}
              disabled={redirecting}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {redirecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Redirecionando...</span>
                </>
              ) : (
                <>
                  <span>Ir para Dez Emergências Agora</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            
            {!redirecting && (
              <div className="text-sm text-gray-500">
                ou aguarde o redirecionamento automático
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Guarde este número para emergências: <strong>0800 580 0293</strong>
            </p>
            
            {redirecting && (
              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-green-700">
                  🔄 Abrindo site da Dez Emergências... Se não abrir automaticamente, clique no link acima.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}