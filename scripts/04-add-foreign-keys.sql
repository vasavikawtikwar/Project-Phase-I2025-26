-- Add foreign key constraint if tables exist and constraint doesn't
ALTER TABLE analyses
DROP CONSTRAINT IF EXISTS analyses_user_id_fkey;

ALTER TABLE analyses
ADD CONSTRAINT analyses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
