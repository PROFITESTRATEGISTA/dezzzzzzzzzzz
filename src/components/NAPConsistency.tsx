import React from 'react';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

interface NAPConsistencyProps {
  variant?: 'header' | 'footer' | 'contact' | 'inline';
  showIcons?: boolean;
  className?: string;
}

export function NAPConsistency({ variant = 'contact', showIcons = true, className = '' }: NAPConsistencyProps) {
  // Dados NAP consistentes em todo o site
  const napData = {
    name: "Dez Saúde - Emergências Médicas",
    address: {
      full: "R. Carneiro Leão, 670 - Brás, São Paulo - SP, 03102-050",
      street: "R. Carneiro Leão, 670",
      city: "São Paulo",
      state: "SP",
      zip: "03102-050"
    },
    phone: {
      display: "(11) 0800-580-0293",
      tel: "+551108005800293",
      emergency: "0800 580 0293"
    },
    email: "contato@dezemergencias.com.br",
    hours: "24 horas por dia, 7 dias por semana"
  };

  if (variant === 'header') {
    return (
      <div className={`flex items-center space-x-6 ${className}`}>
        <div className="hidden md:flex items-center space-x-2 text-blue-600">
          <Phone className="h-4 w-4" />
          <span className="text-sm font-medium">
            EMERGÊNCIA 24h: {napData.phone.emergency}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-4">Contato Dez Saúde</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Emergência 24h: {napData.phone.emergency}</span>
          </li>
          <li className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{napData.address.full}</span>
          </li>
          <li className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{napData.email}</span>
          </li>
          <li className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{napData.hours}</span>
          </li>
        </ul>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={className}>
        {napData.name} - {napData.phone.display} - {napData.address.city}, {napData.address.state}
      </span>
    );
  }

  // Variant 'contact' (padrão)
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Contato {napData.name}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          {showIcons && (
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mt-1">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">Emergência 24h</p>
            <a 
              href={`tel:${napData.phone.tel}`}
              className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors"
            >
              {napData.phone.emergency}
            </a>
            <p className="text-sm text-gray-600">Atendimento imediato em São Paulo</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          {showIcons && (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mt-1">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">Endereço</p>
            <address className="text-gray-700 not-italic">
              {napData.address.street}<br />
              {napData.address.city} - {napData.address.state}<br />
              CEP: {napData.address.zip}
            </address>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          {showIcons && (
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mt-1">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">Email</p>
            <a 
              href={`mailto:${napData.email}`}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              {napData.email}
            </a>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          {showIcons && (
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">Horário de Funcionamento</p>
            <p className="text-gray-700">{napData.hours}</p>
            <p className="text-sm text-gray-600">Emergências médicas em São Paulo e Grande SP</p>
          </div>
        </div>
      </div>

      {/* Schema markup para contato */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPoint",
            "telephone": napData.phone.tel,
            "contactType": "emergency services",
            "areaServed": "São Paulo, SP, Brazil",
            "availableLanguage": "Portuguese",
            "hoursAvailable": "Mo-Su 00:00-23:59"
          })
        }}
      />
    </div>
  );
}