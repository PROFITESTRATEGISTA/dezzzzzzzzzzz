/*
  # Corrigir função get_cidade_performance

  1. Correções
    - Remover ambiguidade na coluna 'cidade'
    - Qualificar todas as colunas com nome da tabela
    - Garantir que a função funcione corretamente

  2. Função
    - `get_cidade_performance()` - Retorna performance por cidade sem ambiguidade
*/

-- Remover função existente se houver
DROP FUNCTION IF EXISTS get_cidade_performance();

-- Criar função corrigida
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
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.telefone_verificado = true THEN 1 END) as leads_verificados,
    CASE 
      WHEN COUNT(l.id) > 0 THEN 
        ROUND((COUNT(CASE WHEN l.telefone_verificado = true THEN 1 END)::numeric / COUNT(l.id)::numeric) * 100, 1)
      ELSE 0 
    END as taxa_verificacao,
    COUNT(DISTINCT f.id) as total_farmacias,
    COUNT(DISTINCT func.id) as total_funcionarios
  FROM farmacias f
  LEFT JOIN funcionarios func ON func.farmacia_id = f.id
  LEFT JOIN leads l ON l.farmacia_id = f.id
  GROUP BY f.cidade
  ORDER BY total_leads DESC;
END;
$$ LANGUAGE plpgsql;