/*
  # Funções de Performance para Relatórios

  1. Funções SQL
    - `get_farmacia_performance` - Performance por farmácia
    - `get_cidade_performance` - Performance por cidade
    - `increment_leads_count` - Incrementar contador de leads

  2. Segurança
    - Funções acessíveis para usuários autenticados
    - Dados agregados sem exposição de informações sensíveis
*/

-- Função para incrementar contador de leads do funcionário
CREATE OR REPLACE FUNCTION increment_leads_count(funcionario_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE funcionarios 
  SET leads_count = leads_count + 1 
  WHERE id = funcionario_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter performance por farmácia
CREATE OR REPLACE FUNCTION get_farmacia_performance()
RETURNS TABLE (
  id uuid,
  nome text,
  endereco text,
  bairro text,
  cidade text,
  funcionarios_count bigint,
  leads_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.nome,
    f.endereco,
    f.bairro,
    f.cidade,
    COALESCE(func_count.count, 0) as funcionarios_count,
    COALESCE(leads_count.count, 0) as leads_count
  FROM farmacias f
  LEFT JOIN (
    SELECT farmacia_id, COUNT(*) as count
    FROM funcionarios
    GROUP BY farmacia_id
  ) func_count ON f.id = func_count.farmacia_id
  LEFT JOIN (
    SELECT farmacia_id, COUNT(*) as count
    FROM leads
    GROUP BY farmacia_id
  ) leads_count ON f.id = leads_count.farmacia_id
  ORDER BY leads_count.count DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter performance por cidade
CREATE OR REPLACE FUNCTION get_cidade_performance()
RETURNS TABLE (
  cidade text,
  total_leads bigint,
  leads_verificados bigint,
  taxa_verificacao numeric,
  total_farmacias bigint,
  total_funcionarios bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.cidade,
    COALESCE(leads_stats.total_leads, 0) as total_leads,
    COALESCE(leads_stats.leads_verificados, 0) as leads_verificados,
    CASE 
      WHEN COALESCE(leads_stats.total_leads, 0) > 0 
      THEN ROUND((COALESCE(leads_stats.leads_verificados, 0)::numeric / leads_stats.total_leads::numeric) * 100, 1)
      ELSE 0
    END as taxa_verificacao,
    COALESCE(farmacia_count.count, 0) as total_farmacias,
    COALESCE(funcionario_count.count, 0) as total_funcionarios
  FROM (
    SELECT DISTINCT cidade FROM farmacias
  ) f
  LEFT JOIN (
    SELECT 
      far.cidade,
      COUNT(l.id) as total_leads,
      COUNT(CASE WHEN l.telefone_verificado = true THEN 1 END) as leads_verificados
    FROM farmacias far
    LEFT JOIN leads l ON far.id = l.farmacia_id
    GROUP BY far.cidade
  ) leads_stats ON f.cidade = leads_stats.cidade
  LEFT JOIN (
    SELECT cidade, COUNT(*) as count
    FROM farmacias
    GROUP BY cidade
  ) farmacia_count ON f.cidade = farmacia_count.cidade
  LEFT JOIN (
    SELECT 
      far.cidade, 
      COUNT(func.id) as count
    FROM farmacias far
    LEFT JOIN funcionarios func ON far.id = func.farmacia_id
    GROUP BY far.cidade
  ) funcionario_count ON f.cidade = funcionario_count.cidade
  ORDER BY total_leads DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir acesso às funções para usuários autenticados
GRANT EXECUTE ON FUNCTION increment_leads_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_farmacia_performance() TO authenticated;
GRANT EXECUTE ON FUNCTION get_cidade_performance() TO authenticated;