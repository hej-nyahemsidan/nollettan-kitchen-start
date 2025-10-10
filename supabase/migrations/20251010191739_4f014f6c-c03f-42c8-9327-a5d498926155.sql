-- Create function to check if any admin exists
CREATE OR REPLACE FUNCTION public.any_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  )
$$;

-- Create function to allow first admin creation or admin-only role management
CREATE OR REPLACE FUNCTION public.can_manage_roles(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Allow if user is admin
    public.is_admin(auth.uid())
    OR
    -- Allow if no admin exists yet AND user is creating their own admin role
    (NOT public.any_admin_exists() AND target_user_id = auth.uid())
$$;

-- Add INSERT policy: only admins can add roles, except for first admin
CREATE POLICY "Only admins can insert roles (or first admin setup)"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_roles(user_id));

-- Add UPDATE policy: only admins can update roles
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Add DELETE policy: only admins can delete roles
CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create trigger to prevent users from removing the last admin
CREATE OR REPLACE FUNCTION public.prevent_last_admin_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the last admin being deleted
  IF OLD.role = 'admin' THEN
    IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'Cannot remove the last admin user';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER prevent_last_admin_deletion
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_admin_removal();