import React, { useState, useEffect } from 'react';
import { MapPin, Users, ArrowLeft, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DezSaudeLogo } from './Logo';
import { Breadcrumbs } from './Breadcrumbs';
import { LocalSEO } from './LocalSEO';
import { NAPConsistency } from './NAPConsistency';
import { LocalContent } from './LocalContent';
import { OptimizedImage } from './ImageOptimizer';
import { ImageSEO } from './ImageSEO';

interface Farmacia {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  funcionarios_count?: number;
}

interface PharmacySelectionProps {
  onPharmacySelect: (pharmacy: Farmacia) => void;
  onBack: () => void;
}

export function PharmacySelection({ onPharmacySelect, onBack }: PharmacySelectionProps) {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBairro, setSelectedBairro] = useState('');

  // Imagens das farmácias para SEO
  const pharmacyImages = [
    {
      url: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
      alt: "Farmácia Droga Leste parceira do Plano Dez Saúde em São Paulo",
      title: "Farmácia Droga Leste - Parceira Dez Saúde São Paulo",
      caption: "Rede de farmácias parceiras para contratação do Plano Dez Saúde",
      width: 800,
      height: 600
    }
  ];
  useEffect(() => {
    loadFarmacias();
  }, []);

  const loadFarmacias = async () => {
    try {
      // Carregar farmácias com contagem de funcionários
      const { data: farmaciasData, error } = await supabase
        .from('farmacias')
        .select(`
          *,
          funcionarios(count)
        `);

      if (error) throw error;

      // Processar dados para incluir contagem de funcionários
      const farmaciasComContagem = farmaciasData?.map(farmacia => ({
        ...farmacia,
        funcionarios_count: farmacia.funcionarios?.[0]?.count || 0
      })) || [];

      setFarmacias(farmaciasComContagem);
    } catch (error) {
      console.error('Erro ao carregar farmácias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmacias = farmacias.filter(farmacia => {
    const matchesSearch = 
      farmacia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmacia.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmacia.bairro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = !selectedCity || farmacia.cidade === selectedCity;
    const matchesBairro = !selectedBairro || farmacia.bairro === selectedBairro;
    
    return matchesSearch && matchesCity && matchesBairro;
  });

  const cities = [...new Set(farmacias.map(f => f.cidade))];
  const bairros = [...new Set(farmacias
    .filter(f => !selectedCity || f.cidade === selectedCity)
    .map(f => f.bairro)
  )];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* SEO Local */}
      <LocalSEO page="pharmacy" />
      
      {/* SEO para Imagens */}
      <ImageSEO 
        images={pharmacyImages}
        pageTitle="Farmácias Droga Leste - Plano Dez Saúde São Paulo"
        pageUrl="https://dezsaudefarma.com.br/farmacias"
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <DezSaudeLogo size="md" showPartnership={true} />
            <NAPConsistency variant="header" />
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Planos', href: '/' },
            { label: 'Selecionar Farmácia', current: true }
          ]}
          className="mb-8"
        />
        
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Escolha sua Farmácia Droga Leste
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            <strong>Encontre a farmácia</strong> mais próxima de você.
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Contrate o Plano Dez Saúde com atendimento personalizado.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Cidade */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedBairro(''); // Reset bairro quando cidade muda
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas as cidades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Filtro por Bairro */}
            <select
              value={selectedBairro}
              onChange={(e) => setSelectedBairro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!selectedCity}
            >
              <option value="">Todos os bairros</option>
              {bairros.map(bairro => (
                <option key={bairro} value={bairro}>{bairro}</option>
              ))}
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>{filteredFarmacias.length} farmácias encontradas</span>
            {(searchTerm || selectedCity || selectedBairro) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('');
                  setSelectedBairro('');
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Lista de Farmácias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmacias.map((farmacia) => (
            <div
              key={farmacia.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => onPharmacySelect(farmacia)}
            >
              <div className="p-6">
                {/* Header da farmácia */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {farmacia.nome}
                    </h3>
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p>{farmacia.endereco}</p>
                        <p>{farmacia.bairro} - {farmacia.cidade}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Profissionais disponíveis</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {farmacia.funcionarios_count || 0} funcionários
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Selecionar Farmácia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredFarmacias.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma farmácia encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedBairro('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Por que escolher uma farmácia Droga Leste?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Atendimento Especializado</h4>
                <p className="text-sm text-gray-600">Profissionais treinados para orientar sobre o Plano Dez Saúde</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Localização Estratégica</h4>
                <p className="text-sm text-gray-600">Farmácias em pontos estratégicos de São Paulo e Grande SP</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Suporte Personalizado</h4>
                <p className="text-sm text-gray-600">Acompanhamento dedicado durante todo o processo</p>
              </div>
            </div>
          </div>
        </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <NAPConsistency variant="contact" />
          </div>
        </div>
      </div>
    </div>
  );
}