-- Drop the policy that allows users to view their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a new policy that only allows admins to view roles
CREATE POLICY "Only admins can view roles"
ON public.user_roles
FOR SELECT
USING (is_admin(auth.uid()));

-- Add comment explaining the security reasoning
COMMENT ON POLICY "Only admins can view roles" ON public.user_roles IS 
'Restricts role visibility to admins only. Regular users cannot see their own roles to prevent attackers from identifying admin accounts. Role checks are performed server-side using the is_admin() security definer function.';