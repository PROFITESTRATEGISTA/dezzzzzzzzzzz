import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erro na verificação de sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('🚪 Iniciando logout...');
    setLoading(true);
    
    try {
      // 1. Fazer logout no Supabase
      console.log('🔐 Fazendo logout no Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout Supabase:', error);
        // Mesmo com erro, continuar com limpeza local
      } else {
        console.log('✅ Logout Supabase realizado');
      }
      
      // 2. Limpar estado local imediatamente
      console.log('🧹 Limpando estado local...');
      setUser(null);
      
      // 3. Limpar localStorage se houver dados
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Storage limpo');
      } catch (storageError) {
        console.warn('⚠️ Erro ao limpar storage:', storageError);
      }
      
      // 4. Redirecionar para página de login
      console.log('🔄 Redirecionando...');
      window.location.href = '/admin';
      
    } catch (error) {
      console.error('❌ Erro crítico no logout:', error);
      
      // Fallback: forçar limpeza e redirecionamento
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/admin';
      
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signOut
  };
}