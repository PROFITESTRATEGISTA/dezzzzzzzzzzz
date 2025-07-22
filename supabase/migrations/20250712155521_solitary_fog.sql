/*
  # Criação das tabelas para o sistema Dez Saúde + FármaLeste

  1. Novas Tabelas
    - `farmacias`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `endereco` (text)
      - `bairro` (text)
      - `cidade` (text)
      - `created_at` (timestamp)
    
    - `funcionarios`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `cargo` (text)
      - `farmacia_id` (uuid, foreign key)
      - `leads_count` (integer, default 0)
      - `created_at` (timestamp)
    
    - `leads`
      - `id` (uuid, primary key)
      - `nome_cliente` (text)
      - `email` (text)
      - `telefone` (text)
      - `telefone_verificado` (boolean, default false)
      - `idade` (integer)
      - `numero_familiares` (integer)
      - `interesse_telemedicina` (text)
      - `farmacia_id` (uuid, foreign key)
      - `funcionario_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Adicionar políticas para usuários autenticados
*/

-- Criar tabela de farmácias
CREATE TABLE IF NOT EXISTS farmacias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  endereco text NOT NULL,
  bairro text NOT NULL,
  cidade text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cargo text NOT NULL,
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE,
  leads_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  telefone_verificado boolean DEFAULT false,
  idade integer NOT NULL,
  numero_familiares integer NOT NULL,
  interesse_telemedicina text NOT NULL,
  farmacia_id uuid REFERENCES farmacias(id) ON DELETE CASCADE,
  funcionario_id uuid REFERENCES funcionarios(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE farmacias ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para farmacias
CREATE POLICY "Permitir leitura de farmácias para todos"
  ON farmacias
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserção de farmácias para usuários autenticados"
  ON farmacias
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de farmácias para usuários autenticados"
  ON farmacias
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de farmácias para usuários autenticados"
  ON farmacias
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para funcionarios
CREATE POLICY "Permitir leitura de funcionários para todos"
  ON funcionarios
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserção de funcionários para usuários autenticados"
  ON funcionarios
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de funcionários para usuários autenticados"
  ON funcionarios
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de funcionários para usuários autenticados"
  ON funcionarios
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para leads
CREATE POLICY "Permitir leitura de leads para usuários autenticados"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir inserção de leads para todos"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de leads para usuários autenticados"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Inserir dados iniciais
INSERT INTO farmacias (nome, endereco, bairro, cidade) VALUES
  ('FármaLeste Central', 'Rua das Flores, 123', 'Centro', 'São Paulo'),
  ('FármaLeste Paulista', 'Av. Paulista, 456', 'Bela Vista', 'São Paulo'),
  ('FármaLeste ABC', 'Rua Augusta, 789', 'Centro', 'Santo André'),
  ('FármaLeste Guarulhos', 'Av. Monteiro Lobato, 321', 'Centro', 'Guarulhos'),
  ('FármaLeste Osasco', 'Rua Antonio Agu, 654', 'Centro', 'Osasco');

-- Inserir funcionários (usando IDs das farmácias)
INSERT INTO funcionarios (nome, cargo, farmacia_id, leads_count) 
SELECT 'Ana Silva', 'Enfermeira', id, 15 FROM farmacias WHERE nome = 'FármaLeste Central'
UNION ALL
SELECT 'Carlos Santos', 'Enfermeiro', id, 12 FROM farmacias WHERE nome = 'FármaLeste Central'
UNION ALL
SELECT 'Maria Oliveira', 'Enfermeira', id, 18 FROM farmacias WHERE nome = 'FármaLeste Paulista'
UNION ALL
SELECT 'João Pereira', 'Enfermeiro', id, 14 FROM farmacias WHERE nome = 'FármaLeste ABC';