/*
  # Função para incrementar contador de leads

  1. Função
    - `increment_leads_count` - Incrementa o contador de leads do funcionário
  
  2. Segurança
    - Função pública para permitir chamadas do frontend
*/

CREATE OR REPLACE FUNCTION increment_leads_count(funcionario_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE funcionarios 
  SET leads_count = leads_count + 1 
  WHERE id = funcionario_id;
END;
$$;