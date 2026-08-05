CREATE OR REPLACE FUNCTION public.can_manage_roles(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.is_admin(auth.uid())
$function$;