import React, { useState, useEffect } from 'react';
import { Shield, Clock, MapPin, Phone, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { DezSaudeLogo } from './Logo';
import { PharmacySelection } from './PharmacySelection';
import { LeadForm } from './LeadForm';
import { LocalSEO } from './LocalSEO';
import { NAPConsistency } from './NAPConsistency';
import { LocalContent } from './LocalContent';
import { OptimizedImage } from './ImageOptimizer';
import { ImageSEO } from './ImageSEO';
import { useRDStation } from '../hooks/useRDStation';

export function LandingPage() {
  const { sendEvent } = useRDStation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Record<string, unknown> | null>(null);

  // Rastrear carregamento da página
  useEffect(() => {
    sendEvent('page_view', {
      page: 'landing',
      title: 'Plano Dez Saúde São Paulo - Emergências Médicas 24h'
    });
  }, [sendEvent]);

  // Imagens otimizadas para SEO
  const pageImages = [
    {
      url: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg",
      alt: "Médico e enfermeira do Plano Dez Saúde atendendo emergência médica em São Paulo",
      title: "Equipe médica Dez Saúde - Atendimento 24h São Paulo",
      caption: "Profissionais especializados em emergências médicas 24h",
      width: 800,
      height: 600
    },
    {
      url: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg",
      alt: "Ambulância do Plano Dez Saúde atendendo emergência em São Paulo",
      title: "Ambulância Dez Saúde - Emergências São Paulo",
      caption: "Atendimento rápido em emergências médicas",
      width: 800,
      height: 600
    }
  ];
  const handlePharmacySelect = (pharmacy: { id: string; nome: string; endereco: string; bairro: string; cidade: string }) => {
    setSelectedPharmacy(pharmacy);
    setCurrentStep(3);
    
    // Rastrear seleção de farmácia
    sendEvent('pharmacy_selected', {
      pharmacy_name: pharmacy.nome,
      pharmacy_city: pharmacy.cidade,
      step: 'selection'
    });
  };

  const handleFormComplete = () => {
    setCurrentStep(1);
    setSelectedPharmacy(null);
  };

  if (currentStep === 2) {
    return (
      <PharmacySelection 
        onPharmacySelect={handlePharmacySelect}
        onBack={() => setCurrentStep(1)}
      />
    );
  }

  if (currentStep === 3 && selectedPharmacy) {
    return (
      <LeadForm 
        pharmacy={selectedPharmacy as { id: string; nome: string; endereco: string; bairro: string; cidade: string }}
        onComplete={handleFormComplete}
        onBack={() => setCurrentStep(2)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Local e Structured Data */}
      <LocalSEO page="home" />
      
      {/* SEO para Imagens */}
      <ImageSEO 
        images={pageImages}
        pageTitle="Plano Dez Saúde São Paulo - Emergências Médicas 24h"
        pageUrl="https://dezsaudefarma.com.br/"
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <DezSaudeLogo size="md" showPartnership={true} />
            <NAPConsistency variant="header" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                Proteção 24h em São Paulo
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Emergências médicas 24h<br/>
                em <span className="text-blue-600">São Paulo</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                <strong>Proteja sua família</strong> com o Plano Dez Saúde.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ✅ Atendimento médico 24h em São Paulo<br/>
                ✅ Mais de 40 emergências cobertas<br/>
                ✅ A partir de R$ 59,00 por mês
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Atendimento 24h</p>
                    <p className="text-sm text-gray-600">Emergências a qualquer hora</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">SP e Grande SP</p>
                    <p className="text-sm text-gray-600">Cobertura completa</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-lg"
                  aria-label="Contratar Plano Dez Saúde - Emergências Médicas 24h"
                >
                  <span>Contratar Agora</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="text-sm">A partir de</span>
                  <span className="text-2xl font-bold text-green-600">R$ 59,00</span>
                  <span className="text-sm">/mês</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <OptimizedImage
                src={pageImages[0].url}
                alt={pageImages[0].alt}
                title={pageImages[0].title}
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
                width={800}
                height={600}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              />
              
              {/* Caption para SEO */}
              <div className="sr-only">
                <p>{pageImages[0].caption}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cobertura Section */}
      <section id="cobertura" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Onde Atendemos em São Paulo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <strong>Cobertura completa</strong> em São Paulo capital e Grande SP.
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mt-2">
              Tempo de resposta: <strong>15 a 25 minutos</strong> em emergências.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Área de Atendimento</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">São Paulo Capital</h4>
                      <p className="text-blue-700 text-sm">
                        <strong>Todas as regiões</strong> da capital.<br/>
                        <strong>Cobertura completa</strong> em toda a cidade.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Grande São Paulo</h4>
                      <p className="text-green-700 text-sm">
                        <strong>ABC, Guarulhos, Osasco, Diadema, Barueri</strong> e mais cidades.<br/>
                        <strong>Atendimento 24h</strong> em toda a região.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cidades Atendidas</h3>
                <p className="text-gray-600">Cobertura completa na região</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Zona Leste</p>
                  <p className="text-xs text-gray-600">Brás, Mooca, Tatuapé</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Zona Sul</p>
                  <p className="text-xs text-gray-600">Ipiranga, Saúde, Moema</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Centro</p>
                  <p className="text-xs text-gray-600">Sé, República, Liberdade</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Grande SP</p>
                  <p className="text-xs text-gray-600">ABC, Guarulhos, Osasco, Diadema, Barueri</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Planos a partir de</span>
                  <span className="text-lg font-bold text-green-600">R$ 59,00</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Proteção de urgência e emergência 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços Section */}
      <section id="precos" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Planos Dez Saúde - Preços
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Escolha seu plano</strong> de emergências médicas.
            </p>
            <p className="text-base text-gray-600">
              Proteção 24h para toda família em São Paulo a partir de R$ 59,00/mês.
            </p>
          </div>

          <div className="flex justify-center">
            {/* Plano Mensal */}
            <div className="bg-white rounded-2xl shadow-lg p-8 relative mx-auto max-w-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mensal</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">R$ 59,00</span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
                <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block">
                  ✅ Plano Completo
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700"><strong>Atendimento 24h</strong> em São Paulo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700"><strong>Mais de 40</strong> emergências cobertas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700"><strong>Orientação médica</strong> por telefone</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700"><strong>Rede credenciada</strong> em São Paulo</span>
                </li>
              </ul>

              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                aria-label="Contratar Plano Mensal Dez Saúde"
              >
                Contratar Agora
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              💳 <strong>Plano mensal:</strong> Apenas cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Local Específico */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocalContent city="São Paulo" />
        </div> 
      </section>

      {/* Emergências Cobertas */}
      <section id="emergencias" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
           Mais de 40 Especialidades Médicas Atendidas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              <strong>Âmbito de Cobertura a Situações</strong> Urgência e Emergência
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Cobertura completa em São Paulo e Grande SP.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Infarto agudo do miocárdio', 'Acidente vascular cerebral (AVC)', 'Crise hipertensiva', 'Crise asmática grave',
              'Convulsões', 'Traumatismo craniano', 'Fraturas expostas', 'Hemorragias graves',
              'Intoxicação aguda', 'Queimaduras graves', 'Cólica renal', 'Apendicite aguda',
              'Pneumonia grave', 'Edema agudo de pulmão', 'Choque anafilático', 'Desmaios e síncopes',
              'Dores torácicas intensas', 'Abdome agudo', 'Politraumatismo', 'Emergências obstétricas',
              'Crises diabéticas', 'Emergências psiquiátricas', 'Picadas de animais peçonhentos', 'Afogamento',
              'Parada cardiorrespiratória', 'Emergências pediátricas', 'Crise de pânico severa', 'Overdose medicamentosa',
              'Emergências geriátricas', 'Acidentes domésticos graves', 'Emergências neurológicas', 'Crises epilépticas',
              'Emergências urológicas', 'Emergências oftalmológicas', 'Emergências otorrinolaringológicas', 'Emergências dermatológicas graves',
              'Emergências ortopédicas', 'Emergências vasculares', 'Emergências respiratórias', 'Outras emergências médicas'
            ].map((emergencia, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{emergencia}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentStep(2)}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
              aria-label="Contratar Proteção Completa - Plano Dez Saúde"
            >
              Contratar Proteção Completa
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      {/* CTA Final */}
      <section id="contato" className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Proteja sua família hoje mesmo
          </h2>
          <p className="text-lg text-blue-100 mb-4">
            <strong>Contrate agora</strong> o Plano Dez Saúde.
          </p>
          <p className="text-base text-blue-100 mb-8">
            Tranquilidade em emergências médicas em São Paulo.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Orientação 24h</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cobertura SP</h3>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Atendimento imediato</h3>
            </div>
          </div>

          <button 
            onClick={() => setCurrentStep(2)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            aria-label="Contratar Plano Dez Emergências - Proteção 24h São Paulo"
          >
            <span>Contratar Plano Dez Emergências</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}