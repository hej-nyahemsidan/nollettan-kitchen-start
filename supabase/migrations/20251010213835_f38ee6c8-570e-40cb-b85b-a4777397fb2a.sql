-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to run keep-alive function every 6 days
-- Schedule: 0 0 */6 * * (at midnight every 6 days)
SELECT cron.schedule(
  'keep-alive-db',
  '0 0 */6 * *',
  $$
  SELECT
    net.http_post(
        url:='https://jndaqmhxbtmwbvcwxnhi.supabase.co/functions/v1/keep-alive',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZGFxbWh4YnRtd2J2Y3d4bmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTc1NzUsImV4cCI6MjA3NTY5MzU3NX0.GoR3Sv_DUnIywo1U9FXeZ3dWZDDXz-TC78pw5xxRw9o"}'::jsonb,
        body:=concat('{"triggered_at": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
