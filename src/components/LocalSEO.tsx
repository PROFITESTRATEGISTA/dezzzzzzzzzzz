import React from 'react';

interface LocalSEOProps {
  page?: 'home' | 'pharmacy' | 'form' | 'admin';
  pharmacy?: {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  };
}

export function LocalSEO({ page = 'home', pharmacy }: LocalSEOProps) {
  // Dados NAP consistentes
  const businessData = {
    name: "Dez Saúde - Emergências Médicas",
    address: {
      streetAddress: "R. Carneiro Leão, 670 - Brás",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "03102-050",
      addressCountry: "BR"
    },
    phone: "+55 11 0800-580-0293",
    email: "contato@dezemergencias.com.br",
    website: "https://dezsaudefarma.com.br",
    emergencyPhone: "0800 580 0293"
  };

  // Structured Data para Local Business
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://dezsaudefarma.com.br/#organization",
    "name": businessData.name,
    "alternateName": ["Dez Saúde", "Plano Dez Emergências", "Dez Emergências Médicas"],
    "description": "Plano de emergências médicas 24h em São Paulo e Grande SP. Atendimento de urgência, orientação médica e proteção completa para sua família.",
    "url": businessData.website,
    "telephone": businessData.phone,
    "email": businessData.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address.streetAddress,
      "addressLocality": businessData.address.addressLocality,
      "addressRegion": businessData.address.addressRegion,
      "postalCode": businessData.address.postalCode,
      "addressCountry": businessData.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-23.5505",
      "longitude": "-46.6333"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Grande São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      },
      {
        "@type": "City",
        "name": "Santo André",
        "addressRegion": "SP"
      },
      {
        "@type": "City",
        "name": "São Bernardo do Campo",
        "addressRegion": "SP"
      },
      {
        "@type": "City",
        "name": "São Caetano do Sul",
        "addressRegion": "SP"
      },
      {
        "@type": "City",
        "name": "Guarulhos",
        "addressRegion": "SP"
      },
      {
        "@type": "City",
        "name": "Osasco",
        "addressRegion": "SP"
      },
      {
        "@type": "City",
        "name": "Barueri",
        "addressRegion": "SP"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "-23.5505",
        "longitude": "-46.6333"
      },
      "geoRadius": "50000"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": businessData.phone,
        "contactType": "emergency services",
        "availableLanguage": "Portuguese",
        "areaServed": "BR",
        "hoursAvailable": "Mo-Su 00:00-23:59"
      },
      {
        "@type": "ContactPoint",
        "telephone": businessData.phone,
        "contactType": "customer service",
        "availableLanguage": "Portuguese",
        "areaServed": "BR"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Planos Dez Saúde",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Mensal Dez Saúde",
            "description": "Atendimento de emergências médicas 24h em São Paulo"
          },
          "price": "59.90",
          "priceCurrency": "BRL",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "59.00",
            "priceCurrency": "BRL",
            "unitText": "MONTH"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Anual Dez Saúde",
            "description": "Atendimento de emergências médicas 24h em São Paulo com 20% de desconto"
          },
          "price": "47.92",
          "priceCurrency": "BRL",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "47.20",
            "priceCurrency": "BRL",
            "unitText": "MONTH"
          }
        }
      ]
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "MedicalService",
          "name": "Atendimento de Emergência Médica 24h",
          "description": "Serviço de emergências médicas 24 horas em São Paulo e Grande SP",
          "provider": {
            "@type": "Organization",
            "name": businessData.name
          }
        },
        "areaServed": businessData.address.addressLocality
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Maria Silva"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excelente atendimento de emergência em São Paulo. Equipe muito profissional e rápida.",
        "datePublished": "2024-01-15"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/dezsaude",
      "https://www.instagram.com/dezsaude",
      "https://www.linkedin.com/company/dezsaude"
    ]
  };

  // Schema para Farmácias Droga Leste (quando aplicável)
  const pharmacySchema = pharmacy ? {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": pharmacy.nome,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": pharmacy.endereco,
      "addressLocality": pharmacy.cidade,
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Droga Leste",
      "url": "https://www.drogaleste.com.br"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Planos Dez Saúde",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Plano Dez Saúde",
            "description": `Atendimento de emergências médicas 24h disponível em ${pharmacy.cidade}`
          }
        }
      ]
    }
  } : null;

  // Schema para Breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://dezsaudefarma.com.br/"
      },
      ...(page === 'pharmacy' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": "Selecionar Farmácia",
        "item": "https://dezsaudefarma.com.br/#farmacias"
      }] : []),
      ...(page === 'form' ? [{
        "@type": "ListItem",
        "position": 3,
        "name": "Contratar Plano",
        "item": "https://dezsaudefarma.com.br/#contrato"
      }] : [])
    ]
  };

  // FAQ Schema para SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O Plano Dez Saúde atende em São Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, o Plano Dez Saúde atende em toda São Paulo capital e Grande São Paulo, incluindo ABC, Guarulhos, Osasco e Barueri, com atendimento de emergências médicas 24 horas a partir de R$ 59,00/mês."
        }
      },
      {
        "@type": "Question",
        "name": "Qual o preço do Plano Dez Saúde em São Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Plano Dez Saúde em São Paulo custa a partir de R$ 59,00 por mês no plano mensal, com descontos de até 40% nos planos anuais e bianuais."
        }
      },
      {
        "@type": "Question",
        "name": "Quais emergências são cobertas pelo Plano Dez Saúde?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Plano Dez Saúde cobre mais de 40 tipos de emergências médicas, incluindo infarto, AVC, fraturas, queimaduras, intoxicações, crises asmáticas e outras situações de urgência."
        }
      },
      {
        "@type": "Question",
        "name": "Como contratar o Plano Dez Saúde em uma farmácia Droga Leste?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Você pode contratar o Plano Dez Saúde em qualquer farmácia Droga Leste em São Paulo. Nossos profissionais especializados irão orientá-lo sobre os planos disponíveis."
        }
      }
    ]
  };

  return (
    <>
      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />

      {/* Pharmacy Schema (quando aplicável) */}
      {pharmacySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pharmacySchema)
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* FAQ Schema */}
      {page === 'home' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      {/* Meta tags específicas para SEO local */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
      <meta name="geo.position" content="-23.5505;-46.6333" />
      <meta name="ICBM" content="-23.5505, -46.6333" />
      
      {/* Meta tags específicas por página */}
      {page === 'home' && (
        <>
          <meta name="description" content="Plano de emergências médicas 24h em São Paulo e Grande SP. Atendimento de urgência, orientação médica e proteção completa para sua família. A partir de R$ 59,90/mês." />
          <meta name="keywords" content="plano de saúde São Paulo, emergência médica SP, atendimento 24h São Paulo, urgência médica Grande SP, Dez Saúde, Droga Leste" />
        </>
      )}
      
      {page === 'pharmacy' && (
        <>
          <meta name="description" content="Selecione sua farmácia Droga Leste em São Paulo para contratar o Plano Dez Saúde. Atendimento personalizado e emergências médicas 24h." />
          <meta name="keywords" content="farmácia Droga Leste São Paulo, contratar plano saúde SP, emergência médica farmácia" />
        </>
      )}
    </>
  );
}