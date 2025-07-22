/*
  # Corrigir política RLS para inserção de leads

  1. Problema
    - Usuários anônimos não conseguem inserir leads
    - Política atual só permite para usuários autenticados
    - Formulário público precisa inserir dados

  2. Solução
    - Remover política restritiva atual
    - Criar nova política que permite inserção para role 'anon'
    - Manter segurança para outras operações
*/

-- Remover política atual que está bloqueando inserções
DROP POLICY IF EXISTS "Permitir inserção de leads para todos" ON leads;

-- Criar nova política específica para inserção por usuários anônimos
CREATE POLICY "Permitir inserção de leads para usuários anônimos"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Manter política de leitura apenas para usuários autenticados
DROP POLICY IF EXISTS "Permitir leitura de leads para usuários autenticados" ON leads;
CREATE POLICY "Permitir leitura de leads para usuários autenticados"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Manter política de atualização apenas para usuários autenticados
DROP POLICY IF EXISTS "Permitir atualização de leads para usuários autenticados" ON leads;
CREATE POLICY "Permitir atualização de leads para usuários autenticados"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);