import React, { useState, useEffect } from 'react';
import { Users, Building2, UserPlus, Phone, Mail, Calendar, MapPin, Heart, CheckCircle, AlertCircle, LogOut, Download, Filter, Search, Eye, Trash2, Activity, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { DezSaudeLogo } from './Logo';

interface Farmacia {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  created_at: string;
}

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  farmacia_id: string;
  leads_count: number;
  created_at: string;
  farmacia?: {
    nome: string;
    cidade: string;
  };
}

interface Lead {
  id: string;
  nome_cliente: string;
  email: string;
  telefone: string;
  telefone_verificado: boolean;
  idade: number;
  numero_familiares: number;
  interesse_telemedicina: string;
  created_at: string;
  farmacia?: {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  };
  funcionario?: {
    nome: string;
    cargo: string;
  };
}

export function AdminPanel() {
  const { signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('leads');
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [performanceData, setPerformanceData] = useState({
    funcionarios: [],
    farmacias: [],
    cidades: []
  });

  // Estados para formulários
  const [showAddFarmacia, setShowAddFarmacia] = useState(false);
  const [showAddFuncionario, setShowAddFuncionario] = useState(false);
  const [newFarmacia, setNewFarmacia] = useState({
    nome: '',
    endereco: '',
    bairro: '',
    cidade: ''
  });
  const [newFuncionario, setNewFuncionario] = useState({
    nome: '',
    cargo: '',
    farmacia_id: ''
  });

  useEffect(() => {
    loadData();
    loadPerformanceData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFarmacias(),
        loadFuncionarios(),
        loadLeads()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFarmacias = async () => {
    const { data, error } = await supabase
      .from('farmacias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setFarmacias(data || []);
  };

  const loadFuncionarios = async () => {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        farmacias!inner(nome, cidade)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setFuncionarios(data || []);
  };

  const loadLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        farmacia:farmacias(nome, endereco, bairro, cidade),
        funcionario:funcionarios(nome, cargo)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setLeads(data || []);
  };

  const loadPerformanceData = async () => {
    try {
      // Carregar dados reais de performance dos funcionários com contagem de leads
      const { data: funcionariosPerf, error: funcError } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          cargo,
          farmacias!inner(nome, cidade),
          leads!left(count)
        `)
        .order('created_at', { ascending: false });

      if (funcError) throw funcError;

      // Processar dados para incluir contagem de leads
      const funcionariosComLeads = funcionariosPerf?.map(func => ({
        ...func,
        leads_count: func.leads?.length || 0,
        farmacia: func.farmacias
      })).sort((a, b) => b.leads_count - a.leads_count) || [];

      // Carregar dados reais de performance das farmácias com contagem de leads
      const { data: farmaciasPerf, error: farmError } = await supabase
        .rpc('get_farmacia_performance');

      if (farmError) throw farmError;

      // Carregar dados reais de performance por cidade
      const { data: cidadesPerf, error: cidadeError } = await supabase
        .rpc('get_cidade_performance');

      if (cidadeError) throw cidadeError;

      setPerformanceData({
        funcionarios: funcionariosComLeads,
        farmacias: farmaciasPerf || [],
        cidades: cidadesPerf || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados de performance:', error);
    }
  };

  const addFarmacia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('farmacias')
        .insert([newFarmacia]);

      if (error) throw error;

      setNewFarmacia({ nome: '', endereco: '', bairro: '', cidade: '' });
      setShowAddFarmacia(false);
      loadFarmacias();
    } catch (error) {
      console.error('Erro ao adicionar farmácia:', error);
    }
  };

  const addFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('funcionarios')
        .insert([newFuncionario]);

      if (error) throw error;

      setNewFuncionario({ nome: '', cargo: '', farmacia_id: '' });
      setShowAddFuncionario(false);
      loadFuncionarios();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      loadLeads();
      loadPerformanceData();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Botão de logout clicado');
    
    if (loggingOut) {
      console.log('⏳ Logout já em andamento...');
      return;
    }
    
    const confirmLogout = confirm('Tem certeza que deseja sair do painel administrativo?');
    if (!confirmLogout) {
      console.log('❌ Logout cancelado pelo usuário');
      return;
    }
    
    setLoggingOut(true);
    
    try {
      await signOut();
    } catch (error) {
      console.error('❌ Erro no handleLogout:', error);
      // Fallback: redirecionar mesmo com erro
      window.location.href = '/admin';
    } finally {
      setLoggingOut(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Verificado', 'Idade', 'Familiares', 'Telemedicina', 'Farmácia', 'Funcionário', 'Data'],
      ...filteredLeads.map(lead => [
        lead.nome_cliente,
        lead.email,
        lead.telefone,
        lead.telefone_verificado ? 'Sim' : 'Não',
        lead.idade,
        lead.numero_familiares,
        lead.interesse_telemedicina,
        lead.farmacia?.nome || '',
        lead.funcionario?.nome || '',
        new Date(lead.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filtros para leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);
    
    const matchesCity = !filterCity || lead.farmacia?.cidade === filterCity;
    const matchesVerified = !filterVerified || 
      (filterVerified === 'verified' && lead.telefone_verificado) ||
      (filterVerified === 'unverified' && !lead.telefone_verificado);
    
    return matchesSearch && matchesCity && matchesVerified;
  });

  const cities = [...new Set(leads.map(lead => lead.farmacia?.cidade).filter(Boolean))];

  const getInterestLabel = (interest: string) => {
    const labels = {
      'muito_interessado': 'Muito Interessado',
      'interessado': 'Interessado',
      'pouco_interessado': 'Pouco Interessado',
      'nao_interessado': 'Não Interessado'
    };
    return labels[interest] || interest;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <DezSaudeLogo size="md" showPartnership={true} />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Painel Administrativo</span>
              <button
                onClick={handleLogout}
                disabled={loggingOut || authLoading}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    <span>Saindo...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Leads ({leads.length})</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Performance</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('farmacias')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'farmacias'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Farmácias ({farmacias.length})</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('funcionarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'funcionarios'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Funcionários ({funcionarios.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Header da seção de leads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" role="heading" aria-level="2">Leads Cadastrados Dez Saúde</h2>
                  <p className="text-gray-600">Gerencie todos os leads do Plano Dez Saúde</p>
                </div>
                
                <button
                  onClick={exportLeads}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Todas as cidades</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="verified">Telefone Verificado</option>
                  <option value="unverified">Não Verificado</option>
                </select>

                <div className="text-sm text-gray-600 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {filteredLeads.length} de {leads.length} leads
                </div>
              </div>
            </div>

            {/* Lista de leads */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Informações
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmácia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.nome_cliente}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.idade} anos • {lead.numero_familiares} familiares
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{lead.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{lead.telefone}</span>
                              {lead.telefone_verificado ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {getInterestLabel(lead.interesse_telemedicina)}
                              </span>
                            </div>
                            {lead.funcionario && (
                              <div className="text-sm text-gray-500">
                                Atendido por: {lead.funcionario.nome}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.farmacia && (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.farmacia.nome}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lead.farmacia.bairro} - {lead.farmacia.cidade}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum lead encontrado
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterCity || filterVerified 
                      ? 'Tente ajustar os filtros de busca'
                      : 'Os leads aparecerão aqui quando forem cadastrados'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Relatório de Performance
              </h2>
              <p className="text-gray-600">
                Análise detalhada de performance por funcionário, farmácia e cidade
              </p>
            </div>

            {/* Métricas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verificados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {leads.filter(l => l.telefone_verificado).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Farmácias Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{farmacias.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Funcionários</p>
                    <p className="text-2xl font-bold text-gray-900">{funcionarios.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance por Funcionário */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" role="heading" aria-level="3">
                Performance por Funcionário
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funcionário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmácia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ranking
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.funcionarios.map((funcionario, index) => (
                      <tr key={funcionario.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {funcionario.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {funcionario.cargo}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {funcionario.farmacias?.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {funcionario.farmacias?.cidade}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {funcionario.leads_count || 0} leads
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 && <Award className="h-4 w-4 text-yellow-500 mr-1" />}
                            <span className="text-sm font-medium text-gray-900">
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance por Farmácia */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" role="heading" aria-level="3">
                Performance por Farmácia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceData.farmacias.map((farmacia) => (
                  <div key={farmacia.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {farmacia.nome}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Localização:</span>
                        <span className="font-medium">{farmacia.cidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Funcionários:</span>
                        <span className="font-medium">
                          {farmacia.funcionarios_count || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Leads:</span>
                        <span className="font-medium text-green-600">
                          {farmacia.leads_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance por Cidade */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" role="heading" aria-level="3">
                Performance por Cidade
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verificados
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa Verificação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmácias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funcionários
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.cidades.map((cidade) => (
                      <tr key={cidade.cidade}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {cidade.cidade}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {cidade.total_leads}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-green-600 font-medium">
                            {cidade.leads_verificados}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${cidade.taxa_verificacao}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {cidade.taxa_verificacao}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {cidade.total_farmacias}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {cidade.total_funcionarios}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {performanceData.cidades.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum dado de cidade encontrado
                  </h3>
                  <p className="text-gray-600">
                    Os dados aparecerão aqui quando houver leads cadastrados
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'farmacias' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Farmácias</h2>
              <button
                onClick={() => setShowAddFarmacia(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Building2 className="h-4 w-4" />
                <span>Adicionar Farmácia</span>
              </button>
            </div>

            {/* Lista de farmácias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmacias.map((farmacia) => (
                <div key={farmacia.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {farmacia.nome}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{farmacia.endereco}</p>
                        <p>{farmacia.bairro} - {farmacia.cidade}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Criada em {new Date(farmacia.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Adicionar Farmácia */}
            {showAddFarmacia && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Adicionar Nova Farmácia
                  </h3>
                  
                  <form onSubmit={addFarmacia} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome da farmácia"
                      value={newFarmacia.nome}
                      onChange={(e) => setNewFarmacia({ ...newFarmacia, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Endereço"
                      value={newFarmacia.endereco}
                      onChange={(e) => setNewFarmacia({ ...newFarmacia, endereco: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={newFarmacia.bairro}
                      onChange={(e) => setNewFarmacia({ ...newFarmacia, bairro: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={newFarmacia.cidade}
                      onChange={(e) => setNewFarmacia({ ...newFarmacia, cidade: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddFarmacia(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'funcionarios' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Funcionários</h2>
              <button
                onClick={() => setShowAddFuncionario(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar Funcionário</span>
              </button>
            </div>

            {/* Lista de funcionários */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farmácia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {funcionario.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {funcionario.cargo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {funcionario.farmacias?.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {funcionario.farmacias?.cidade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {funcionario.leads_count || 0} leads
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(funcionario.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Adicionar Funcionário */}
            {showAddFuncionario && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Adicionar Novo Funcionário
                  </h3>
                  
                  <form onSubmit={addFuncionario} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome do funcionário"
                      value={newFuncionario.nome}
                      onChange={(e) => setNewFuncionario({ ...newFuncionario, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Cargo"
                      value={newFuncionario.cargo}
                      onChange={(e) => setNewFuncionario({ ...newFuncionario, cargo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <select
                      value={newFuncionario.farmacia_id}
                      onChange={(e) => setNewFuncionario({ ...newFuncionario, farmacia_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma farmácia</option>
                      {farmacias.map(farmacia => (
                        <option key={farmacia.id} value={farmacia.id}>
                          {farmacia.nome} - {farmacia.cidade}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddFuncionario(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}