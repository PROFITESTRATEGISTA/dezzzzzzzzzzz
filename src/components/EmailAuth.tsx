import React, { useState } from 'react';
import { Mail, Shield, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DezSaudeLogo } from './Logo';

interface EmailAuthProps {
  onAuthSuccess: () => void;
}

export function EmailAuth({ onAuthSuccess }: EmailAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      let result;
      
      if (isSignUp) {
        // Para registro, não precisamos de confirmação por email
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined // Desabilita confirmação por email
          }
        });
        
        if (result.error) throw result.error;
        
        if (result.data.user) {
          setSuccessMessage('Conta criada com sucesso! Fazendo login...');
          // Fazer login automaticamente após registro
          const loginResult = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (loginResult.error) throw loginResult.error;
          onAuthSuccess();
        }
      } else {
        // Para login
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (result.error) throw result.error;
        
        if (result.data.user) {
          onAuthSuccess();
        }
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      
      // Mensagens de erro mais amigáveis
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (err.message?.includes('User already registered')) {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else if (err.message?.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres');
      } else if (err.message?.includes('Unable to validate email address')) {
        setError('Email inválido');
      } else {
        setError(err.message || 'Erro na autenticação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <DezSaudeLogo size="lg" />
            </div>
            
            {/* Botão voltar ao site */}
            <div className="mb-4">
              <a
                href="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao site</span>
              </a>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Administrativo
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Criar conta administrativa' : 'Entre com suas credenciais'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dezsaude.com.br"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isSignUp ? 'Criando...' : 'Entrando...'}</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar agora'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Acesso Seguro</p>
                <p className="text-xs text-blue-700">
                  Sistema protegido para administradores autorizados da Dez Saúde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}