import React from 'react';
import { ArrowRight, MapPin, Users, Shield, Phone } from 'lucide-react';

interface InternalLinksProps {
  currentPage?: 'home' | 'pharmacy' | 'form' | 'admin';
}

export function InternalLinks({ currentPage = 'home' }: InternalLinksProps) {
  const links = {
    home: [
      {
        href: '#cobertura',
        text: 'Área de Cobertura em São Paulo',
        icon: MapPin,
        description: 'Veja todas as regiões atendidas'
      },
      {
        href: '#precos',
        text: 'Planos e Preços',
        icon: Shield,
        description: 'A partir de R$ 59,90/mês'
      },
      {
        href: '#emergencias',
        text: 'Emergências Cobertas',
        icon: Phone,
        description: 'Mais de 40 situações atendidas'
      }
    ],
    pharmacy: [
      {
        href: '/',
        text: 'Voltar aos Planos',
        icon: Shield,
        description: 'Ver preços e benefícios'
      },
      {
        href: '/#emergencias',
        text: 'Emergências Cobertas',
        icon: Phone,
        description: 'Situações atendidas 24h'
      }
    ],
    form: [
      {
        href: '/',
        text: 'Informações do Plano',
        icon: Shield,
        description: 'Benefícios e cobertura'
      },
      {
        href: '/#precos',
        text: 'Outros Planos',
        icon: MapPin,
        description: 'Compare opções'
      }
    ]
  };

  const currentLinks = links[currentPage] || [];

  if (currentLinks.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Links Úteis
      </h3>
      <div className="space-y-3">
        {currentLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
            rel="noopener"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <link.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {link.text}
              </p>
              <p className="text-sm text-gray-600">{link.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}