import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Users, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PhoneVerification } from './PhoneVerification';
import { DezSaudeLogo } from './Logo';
import { ThankYouPage } from './ThankYouPage';
import { LocalSEO } from './LocalSEO';
import { NAPConsistency } from './NAPConsistency';
import { useRDStation } from '../hooks/useRDStation';

interface Farmacia {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
}

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
}

interface LeadFormProps {
  pharmacy: Farmacia;
  onComplete: () => void;
  onBack: () => void;
}



export function LeadForm({ pharmacy, onComplete, onBack }: LeadFormProps) {
  const { sendConversion } = useRDStation();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [success, setSuccess] = useState(false);
  const [leadData, setLeadData] = useState<Record<string, unknown> | null>(null);

  const [formData, setFormData] = useState({
    nome_cliente: '',
    email: '',
    telefone: '',
    idade: '',
    numero_familiares: '',
    interesse_telemedicina: '',
    funcionario_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFuncionarios();
  }, [pharmacy.id]);

  const loadFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, nome, cargo')
        .eq('farmacia_id', pharmacy.id);

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome_cliente.trim()) {
      newErrors.nome_cliente = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\+55\d{2}-\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato +5511-97533-3355';
    }

    if (!formData.idade) {
      newErrors.idade = 'Idade é obrigatória';
    } else if (parseInt(formData.idade) < 18 || parseInt(formData.idade) > 120) {
      newErrors.idade = 'Idade deve estar entre 18 e 120 anos';
    }

    if (!formData.numero_familiares) {
      newErrors.numero_familiares = 'Número de familiares é obrigatório';
    }

    if (!formData.interesse_telemedicina) {
      newErrors.interesse_telemedicina = 'Selecione uma opção';
    }

    if (!formData.funcionario_id) {
      newErrors.funcionario_id = 'Selecione um profissional';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    let numbers = value.replace(/\D/g, '');
    
    // Se não começar com 55, adicionar
    if (!numbers.startsWith('55') && numbers.length > 0) {
      numbers = '55' + numbers;
    }
    
    // Limitar a 13 dígitos (55 + 11 dígitos)
    if (numbers.length > 13) {
      numbers = numbers.slice(0, 13);
    }
    
    // Formatação: +5511-97533-3355
    if (numbers.length >= 4) {
      const country = numbers.slice(0, 2); // 55
      const area = numbers.slice(2, 4); // 11
      const part1 = numbers.slice(4, 9); // 97533
      const part2 = numbers.slice(9, 13); // 3355
      
      let formatted = `+${country}${area}`;
      if (part1) formatted += `-${part1}`;
      if (part2) formatted += `-${part2}`;
      
      return formatted;
    }
    
    return numbers ? `+${numbers}` : '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  const getCleanPhoneNumber = (phone: string) => {
    // Remove formatação e garante que tenha +55
    const numbers = phone.replace(/\D/g, '');
    if (numbers.startsWith('55')) {
      return `+${numbers}`;
    }
    return `+55${numbers}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Primeiro, verificar o telefone
    setShowPhoneVerification(true);
  };

  const handlePhoneVerificationComplete = async (verified: boolean) => {
    if (!verified) {
      setShowPhoneVerification(false);
      return;
    }

    setSubmitting(true);
    
    try {
      // Buscar dados do funcionário selecionado
      const funcionarioSelecionado = funcionarios.find(f => f.id === formData.funcionario_id);
      
      // Criar lead no Supabase
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([{
          nome_cliente: formData.nome_cliente,
          email: formData.email,
          telefone: getCleanPhoneNumber(formData.telefone),
          telefone_verificado: true,
          idade: parseInt(formData.idade),
          numero_familiares: parseInt(formData.numero_familiares),
          interesse_telemedicina: formData.interesse_telemedicina,
          farmacia_id: pharmacy.id,
          funcionario_id: formData.funcionario_id
        }])
        .select()
        .single();

      if (leadError) throw leadError;
      
      console.log('✅ Lead criado com sucesso:', leadData);

      // Enviar para RD Station usando o hook
      try {
        const rdStationData = {
          email: formData.email,
          name: formData.nome_cliente,
          mobile_phone: getCleanPhoneNumber(formData.telefone),
          cf_idade: formData.idade,
          cf_numero_familiares: formData.numero_familiares,
          cf_interesse_telemedicina: formData.interesse_telemedicina,
          cf_farmacia: pharmacy.nome,
          cf_farmacia_endereco: `${pharmacy.endereco}, ${pharmacy.bairro} - ${pharmacy.cidade}`,
          cf_funcionario: funcionarioSelecionado?.nome || 'Não informado',
          cf_funcionario_cargo: funcionarioSelecionado?.cargo || 'Não informado',
          tags: ['dez-saude', 'droga-leste', pharmacy.cidade.toLowerCase()]
        };

        await sendConversion(rdStationData);
      } catch (rdError) {
        console.error('Erro ao enviar para RD Station:', rdError);
        // Não bloquear o fluxo se RD Station falhar
      }

      // Preparar dados para página de obrigado
      setSuccess(true);
      setLeadData({
        customer: formData.nome_cliente,
        pharmacy: pharmacy,
        funcionario: funcionarioSelecionado || { nome: 'Não informado', cargo: 'Não informado' }
      } as Record<string, unknown>);
      
      // Chamar callback de conclusão
      onComplete();
      
    } catch (error: unknown) {
      console.error('Erro ao enviar formulário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrors({ submit: `Erro ao enviar formulário: ${errorMessage}. Tente novamente.` });
    } finally {
      setSubmitting(false);
      setShowPhoneVerification(false);
    }
  };

  if (showPhoneVerification) {
    return (
      <PhoneVerification
        phoneNumber={getCleanPhoneNumber(formData.telefone)}
        onVerificationComplete={handlePhoneVerificationComplete}
        onBack={() => setShowPhoneVerification(false)}
      />
    );
  }

  if (success && leadData) {
    return (
      <ThankYouPage 
        customerName={leadData.customer as string}
        pharmacy={leadData.pharmacy as Farmacia}
        funcionario={leadData.funcionario as Funcionario}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* SEO Local com dados da farmácia */}
      <LocalSEO page="form" pharmacy={pharmacy} />
      
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informações da Farmácia */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" role="heading" aria-level={2}>
                Farmácia Selecionada
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg" role="heading" aria-level={3}>{pharmacy.nome}</h3>
                  <p className="text-gray-600">{pharmacy.endereco}</p>
                  <p className="text-gray-600">{pharmacy.bairro} - {pharmacy.cidade}</p>
                </div>

                {funcionarios.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3" role="heading" aria-level={4}>Profissionais Disponíveis Dez Saúde:</h4>
                    <div className="space-y-2">
                      {funcionarios.map(funcionario => (
                        <div key={funcionario.id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{funcionario.nome}</p>
                            <p className="text-sm text-gray-600">{funcionario.cargo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefícios do Plano */}
            <div className="space-y-6">
              <NAPConsistency variant="contact" />
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" aria-level={3}>
                  Benefícios do Plano Dez Saúde em {pharmacy.cidade}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700"><strong>Atendimento 24h</strong> em {pharmacy.cidade}</span>
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
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" role="heading" aria-level={2}>
                Contrate o Plano Dez Saúde
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nome_cliente}
                      onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.nome_cliente ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  {errors.nome_cliente && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome_cliente}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.telefone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+55 (11) 99999-9999"
                      maxLength={17}
                    />
                  </div>
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                  )}
                </div>

                {/* Idade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <input
                    type="number"
                    value={formData.idade}
                    onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.idade ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Sua idade"
                    min="18"
                    max="120"
                  />
                  {errors.idade && (
                    <p className="mt-1 text-sm text-red-600">{errors.idade}</p>
                  )}
                </div>

                {/* Número de Familiares */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantas pessoas moram com você? *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.numero_familiares}
                      onChange={(e) => setFormData({ ...formData, numero_familiares: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.numero_familiares ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="1">Apenas eu</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                      <option value="5">5 pessoas</option>
                      <option value="6">6 ou mais pessoas</option>
                    </select>
                  </div>
                  {errors.numero_familiares && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_familiares}</p>
                  )}
                </div>

                {/* Interesse em Telemedicina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tem interesse em consultas por telemedicina? *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={formData.interesse_telemedicina}
                      onChange={(e) => setFormData({ ...formData, interesse_telemedicina: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.interesse_telemedicina ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="muito_interessado">Muito interessado</option>
                      <option value="interessado">Interessado</option>
                      <option value="pouco_interessado">Pouco interessado</option>
                      <option value="nao_interessado">Não interessado</option>
                    </select>
                  </div>
                  {errors.interesse_telemedicina && (
                    <p className="mt-1 text-sm text-red-600">{errors.interesse_telemedicina}</p>
                  )}
                </div>

                {/* Profissional Responsável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profissional que irá atendê-lo *
                  </label>
                  <select
                    value={formData.funcionario_id}
                    onChange={(e) => setFormData({ ...formData, funcionario_id: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.funcionario_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um profissional</option>
                    {funcionarios.map(funcionario => (
                      <option key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome} - {funcionario.cargo}
                      </option>
                    ))}
                  </select>
                  {errors.funcionario_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.funcionario_id}</p>
                  )}
                </div>

                {/* Erro de submissão */}
                {errors.submit && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{errors.submit}</span>
                  </div>
                )}

                {/* Botão de envio */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Contratar Plano Dez Saúde</span>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Ao enviar, você concorda com nossos termos de uso e política de privacidade.
                  Seu telefone será verificado por SMS para segurança.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}