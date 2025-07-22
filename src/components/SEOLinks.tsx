import React from 'react';

export function SEOLinks() {
  return (
    <div className="hidden">
      {/* Links internos para SEO - não visíveis mas indexáveis */}
      <nav aria-label="Links de navegação SEO">
        <ul>
          <li><a href="/" title="Plano Dez Saúde - Emergências Médicas 24h">Página Inicial</a></li>
          <li><a href="/#cobertura" title="Cobertura São Paulo e Grande SP">Área de Atendimento</a></li>
          <li><a href="/#precos" title="Preços dos Planos de Emergência">Planos e Preços</a></li>
          <li><a href="/#emergencias" title="Lista de Emergências Cobertas">Emergências Atendidas</a></li>
          <li><a href="/#beneficios" title="Benefícios do Plano Dez Saúde">Benefícios</a></li>
        </ul>
      </nav>
    </div>
  );
}