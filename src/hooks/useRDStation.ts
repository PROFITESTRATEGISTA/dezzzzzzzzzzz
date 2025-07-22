import { useEffect, useCallback } from 'react';

interface RDStationData {
  email?: string;
  name?: string;
  mobile_phone?: string;
  cf_idade?: string;
  cf_numero_familiares?: string;
  cf_interesse_telemedicina?: string;
  cf_farmacia?: string;
  cf_farmacia_endereco?: string;
  cf_funcionario?: string;
  cf_funcionario_cargo?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
}

export function useRDStation() {
  // Verificar se o RD Station está carregado
  const isRDStationLoaded = useCallback(() => {
    return typeof window !== 'undefined' && window.RDStationAnalytics;
  }, []);

  // Aguardar o carregamento do RD Station
  const waitForRDStation = useCallback(async (timeout = 5000): Promise<boolean> => {
    if (isRDStationLoaded()) {
      return true;
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        if (isRDStationLoaded()) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          console.warn('RD Station não carregou dentro do timeout');
          resolve(false);
        }
      }, 100);
    });
  }, [isRDStationLoaded]);

  // Enviar conversão para RD Station
  const sendConversion = useCallback(async (data: RDStationData) => {
    try {
      const isLoaded = await waitForRDStation();
      
      if (isLoaded && window.RDStationAnalytics) {
        window.RDStationAnalytics.conversion(data);
        console.log('✅ Conversão enviada para RD Station:', data);
        return true;
      } else {
        console.warn('❌ RD Station não disponível para envio de conversão');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar conversão para RD Station:', error);
      return false;
    }
  }, [waitForRDStation]);

  // Enviar evento customizado
  const sendEvent = useCallback(async (eventName: string, data?: Record<string, unknown>) => {
    try {
      const isLoaded = await waitForRDStation();
      
      if (isLoaded && window.RDStationAnalytics) {
        window.RDStationAnalytics.track(eventName, data);
        console.log('✅ Evento enviado para RD Station:', eventName, data);
        return true;
      } else {
        console.warn('❌ RD Station não disponível para envio de evento');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar evento para RD Station:', error);
      return false;
    }
  }, [waitForRDStation]);

  // Identificar usuário
  const identifyUser = useCallback(async (data: RDStationData) => {
    try {
      const isLoaded = await waitForRDStation();
      
      if (isLoaded && window.RDStationAnalytics) {
        window.RDStationAnalytics.identify(data);
        console.log('✅ Usuário identificado no RD Station:', data);
        return true;
      } else {
        console.warn('❌ RD Station não disponível para identificação');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao identificar usuário no RD Station:', error);
      return false;
    }
  }, [waitForRDStation]);

  // Verificar status do RD Station na inicialização
  useEffect(() => {
    const checkRDStation = async () => {
      const isLoaded = await waitForRDStation();
      if (isLoaded) {
        console.log('✅ RD Station carregado com sucesso');
      } else {
        console.warn('⚠️ RD Station não foi carregado');
      }
    };

    checkRDStation();
  }, [waitForRDStation]);

  return {
    isRDStationLoaded,
    waitForRDStation,
    sendConversion,
    sendEvent,
    identifyUser
  };
} 