-- Add pasta column to weekly_lunch table for storing daily pasta specials
ALTER TABLE weekly_lunch 
ADD COLUMN pasta jsonb DEFAULT '{"name": "", "description": ""}'::jsonb;