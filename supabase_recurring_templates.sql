-- 4. Recurring Templates Table
CREATE TABLE IF NOT EXISTS recurring_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
  next_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMPTZ
);

-- RLS POLICY
ALTER TABLE recurring_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own recurring templates" ON recurring_templates FOR ALL USING (auth.uid() = user_id);
