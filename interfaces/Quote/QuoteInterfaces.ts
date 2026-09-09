export interface Quote {
  quote_id: number;
  content: string;
  author: string;
  author_role: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
