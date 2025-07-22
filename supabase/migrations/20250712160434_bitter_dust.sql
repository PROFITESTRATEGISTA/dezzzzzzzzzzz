/*
  # Create increment function for leads count

  1. Function
    - `increment_leads_count` function to safely increment leads count for funcionarios
  
  2. Security
    - Function is accessible to authenticated users
*/

CREATE OR REPLACE FUNCTION increment_leads_count(funcionario_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE funcionarios 
  SET leads_count = leads_count + 1 
  WHERE id = funcionario_id;
END;
$$;