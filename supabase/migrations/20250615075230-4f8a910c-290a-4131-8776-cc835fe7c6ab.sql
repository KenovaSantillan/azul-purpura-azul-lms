
UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) IN ('administracion@kenova.xyz', 'santillan@kenova.xyz', 'francisco.santillan@cetis14.edu.mx');
