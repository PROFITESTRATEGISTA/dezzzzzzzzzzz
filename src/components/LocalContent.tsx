import React from 'react';
import { MapPin, Users, Clock, Shield, Star, Award, ChevronDown, ChevronUp, Stethoscope, Ambulance } from 'lucide-react';

interface LocalContentProps {
  city?: string;
  neighborhood?: string;
}

export function LocalContent({ city = "São Paulo", neighborhood }: LocalContentProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Conteúdo específico por localização
  const locationData = {
    "São Paulo": {
      coverage: "Atendemos toda a capital paulista com tempo de resposta otimizado",
      hospitals: ["Hospital das Clínicas", "Hospital Sírio-Libanês", "Hospital Albert Einstein"],
      neighborhoods: [
        // Zona Leste
        "Brás", "Mooca", "Tatuapé", "Vila Formosa", "Penha", "Vila Matilde", 
        "Belém", "Carrão", "Vila Prudente", "Sapopemba", "São Mateus",
        // Zona Sul  
        "Vila Mariana", "Ipiranga", "Saúde", "Cursino", "Vila Clementino",
        "Jabaquara", "Santo Amaro", "Campo Belo", "Brooklin", "Moema",
        // Centro
        "Sé", "República", "Liberdade", "Bela Vista", "Consolação",
        "Santa Cecília", "Bom Retiro", "Cambuci", "Aclimação"
      ],
      population: "12 milhões de habitantes",
      description: "São Paulo, a maior metrópole do Brasil, conta com a cobertura completa do Plano Dez Saúde para emergências médicas 24h."
    },
    "Santo André": {
      coverage: "Cobertura completa no ABC paulista",
      hospitals: ["Hospital Municipal de Santo André", "Hospital Brasil"],
      neighborhoods: ["Centro", "Vila Assunção", "Jardim"],
      emergencyTime: "20-25 minutos",
      population: "720 mil habitantes",
      description: "Santo André e toda região do ABC contam com atendimento especializado do Plano Dez Saúde."
    },
    "Guarulhos": {
      coverage: "Atendimento especializado na segunda maior cidade de SP",
      hospitals: ["Hospital Municipal de Guarulhos", "Hospital Stella Maris"],
      neighborhoods: ["Centro", "Vila Galvão", "Jardim São Paulo"],
      emergencyTime: "18-22 minutos",
      population: "1.4 milhão de habitantes",
      description: "Guarulhos possui cobertura completa do Plano Dez Saúde com atendimento de emergência 24h."
    }
  };

  const currentLocation = locationData[city] || locationData["São Paulo"];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Plano Dez Saúde em {city}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {currentLocation.description}
        </p>
      </div>

      {/* Estatísticas locais */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Tempo Resposta</h3>
          <p className="text-blue-600 font-bold">{currentLocation.emergencyTime}</p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">População</h3>
          <p className="text-green-600 font-bold">{currentLocation.population}</p>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Cobertura</h3>
          <p className="text-purple-600 font-bold">100%</p>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Avaliação</h3>
          <p className="text-orange-600 font-bold">4.8/5</p>
        </div>
      </div>

      {/* Bairros atendidos */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Principais Bairros Atendidos em {city}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentLocation.neighborhoods.map((neighborhood, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 font-medium">{neighborhood}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hospitais parceiros */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Rede Hospitalar em {city}
        </h3>
        
        {/* Informação sobre atendimento */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Atendimento no Local</h4>
                <p className="text-blue-700 text-sm">
                  <strong>90% das emergências</strong> são resolvidas no local pela nossa equipe médica especializada, sem necessidade de hospitalização.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Ambulance className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Encaminhamento Hospitalar</h4>
                <p className="text-green-700 text-sm">
                  <strong>Quando necessário</strong>, nossa equipe encaminha você ao hospital de sua preferência ou ao mais adequado para seu caso.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hospitais Particulares Premium */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('premium')}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors mb-3"
          >
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-red-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Hospitais Particulares Premium (20 unidades)
              </h4>
            </div>
            {expandedSections.premium ? (
              <ChevronUp className="h-5 w-5 text-red-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-red-600" />
            )}
          </button>
          
          {expandedSections.premium && (
            <div className="grid md:grid-cols-2 gap-3 mb-3">
            {[
              "Hospital das Clínicas - HC FMUSP",
              "Hospital Sírio-Libanês",
              "Hospital Albert Einstein",
              "Hospital Oswaldo Cruz",
              "Hospital Santa Catarina",
              "Hospital São Luiz",
              "Hospital Beneficência Portuguesa",
              "Hospital Alemão Oswaldo Cruz",
              "Hospital Villa-Lobos",
              "Hospital São Camilo",
              "Hospital Samaritano",
              "Hospital 9 de Julho",
              "Hospital Bandeirantes",
              "Hospital Santa Paula",
              "Hospital São Rafael",
              "Hospital Leforte",
              "Hospital Moriah",
              "Hospital Santa Joana",
              "Hospital Pro Matre Paulista",
              "Hospital e Maternidade Santa Joana"
            ].map((hospital, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{hospital}</p>
                  <p className="text-xs text-red-600">Rede Particular</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Hospitais Particulares Populares */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('popular')}
            className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors mb-3"
          >
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Hospitais Particulares Populares (20 unidades)
              </h4>
            </div>
            {expandedSections.popular ? (
              <ChevronUp className="h-5 w-5 text-orange-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-orange-600" />
            )}
          </button>
          
          {expandedSections.popular && (
            <div className="grid md:grid-cols-2 gap-3 mb-3">
            {[
              "Hospital Brasil - Rede D'Or",
              "Hospital Bartira",
              "Hospital Stella Maris",
              "Hospital São Cristóvão",
              "Hospital Nipo-Brasileiro",
              "Hospital Santa Virgínia",
              "Hospital São Paulo",
              "Hospital Metropolitano",
              "Hospital Santa Lucinda",
              "Hospital Sancta Maggiore",
              "Hospital Santa Helena",
              "Hospital São José",
              "Hospital Vitória",
              "Hospital Regional do Brás",
              "Hospital Santa Cruz",
              "Hospital São Vicente",
              "Hospital Regional de Osasco",
              "Hospital Municipal de Barueri",
              "Hospital Geral de Guarulhos",
              "Hospital Regional do ABC"
            ].map((hospital, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{hospital}</p>
                  <p className="text-xs text-orange-600">Rede Popular</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

          {/* Hospitais Públicos e de Baixa Renda */}
          <div className="mt-6">
            <button
              onClick={() => toggleSection('public')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-3"
            >
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Hospitais Públicos e SUS (20 unidades)
                </h4>
              </div>
              {expandedSections.public ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              )}
            </button>
            
            {expandedSections.public && (
              <div className="grid md:grid-cols-2 gap-3 mb-3">
              {[
                "Hospital Municipal Dr. Arthur Ribeiro de Saboya",
                "Hospital Municipal do Tatuapé",
                "Hospital Municipal Tide Setúbal",
                "Hospital Municipal Prof. Mário Degni",
                "Hospital Municipal Infantil Menino Jesus",
                "Hospital Municipal Dr. José Soares Hungria",
                "Hospital Municipal Vereador José Storopolli",
                "Hospital Municipal Dr. Fernando Mauro Pires da Rocha",
                "Hospital Municipal Dr. Ignácio Proença de Gouvêa",
                "Hospital Municipal Dr. Moyses Deutsch",
                "Hospital Municipal Doutor Carmino Caricchio",
                "Hospital Municipal Vila Santa Catarina",
                "Hospital Municipal Cidade Tiradentes",
                "Hospital Municipal do Campo Limpo",
                "Hospital Municipal M'Boi Mirim",
                "Hospital Municipal Dr. Benedito Montenegro",
                "Hospital Municipal Doutor Alexandre Zaio",
                "Hospital Municipal Dr. Waldomiro de Paula",
                "Hospital Municipal Doutor José Pangella",
                "Hospital Municipal Doutor Alípio Corrêa Netto"
              ].map((hospital, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{hospital}</p>
                    <p className="text-xs text-blue-600">Atendimento SUS</p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
          
          {/* UPAs e Pronto Socorros */}
          <div className="mt-6">
            <button
              onClick={() => toggleSection('upas')}
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors mb-3"
            >
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  UPAs e Pronto Socorros 24h (12 unidades)
                </h4>
              </div>
              {expandedSections.upas ? (
                <ChevronUp className="h-5 w-5 text-green-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-600" />
              )}
            </button>
            
            {expandedSections.upas && (
              <div className="grid md:grid-cols-2 gap-3 mb-3">
              {[
                "UPA Zona Leste - Vila Alpina",
                "UPA Zona Sul - Jabaquara",
                "UPA Centro - Sé",
                "UPA Zona Norte - Vila Maria",
                "Pronto Socorro Municipal - Brás",
                "Pronto Socorro do Tatuapé",
                "Pronto Socorro da Mooca",
                "Pronto Socorro Vila Maria",
                "Pronto Socorro Sapopemba",
                "Pronto Socorro Campo Limpo",
                "Pronto Socorro Cidade Ademar",
                "Pronto Socorro Vila Prudente"
              ].map((upa, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{upa}</p>
                    <p className="text-xs text-green-600">Emergência 24h</p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
      </div>

      {/* Depoimentos locais */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          O que dizem nossos clientes em {city}
        </h3>
        <div className="space-y-4">
          <blockquote className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-700 italic">
              "O atendimento do Plano Dez Saúde em {city} foi excepcional. 
              Em menos de 20 minutos já estava sendo atendido no hospital."
            </p>
            <footer className="text-sm text-gray-600 mt-2">
              — Maria Silva, moradora de {city}
            </footer>
          </blockquote>
          
          <blockquote className="border-l-4 border-green-500 pl-4">
            <p className="text-gray-700 italic">
              "Recomendo o Plano Dez Saúde para todas as famílias de {city}. 
              A tranquilidade de ter atendimento 24h não tem preço."
            </p>
            <footer className="text-sm text-gray-600 mt-2">
              — João Santos, empresário em {city}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Schema markup para localização */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `Plano Dez Saúde em ${city}`,
            "description": `Atendimento de emergências médicas 24h em ${city} e região`,
            "provider": {
              "@type": "Organization",
              "name": "Dez Saúde - Emergências Médicas"
            },
            "areaServed": {
              "@type": "City",
              "name": city,
              "addressRegion": "SP",
              "addressCountry": "BR"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "servicePhone": "+551108005800293",
              "availableLanguage": "Portuguese"
            }
          })
        }}
      />
    </div>
  );
}