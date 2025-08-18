drop extension if exists "pg_net";


  create table "public"."admin_settings" (
    "id" bigint generated always as identity not null,
    "setting_name" text not null,
    "setting_value" jsonb
      );


alter table "public"."admin_settings" enable row level security;


  create table "public"."leads" (
    "name" text,
    "email" text,
    "company" text,
    "message" text
      );



  create table "public"."prices" (
    "id" text not null,
    "product_id" text,
    "active" boolean,
    "description" text,
    "unit_amount" bigint,
    "currency" text,
    "type" text,
    "interval" text,
    "interval_count" bigint,
    "trial_period_days" text,
    "metadata" jsonb
      );


alter table "public"."prices" enable row level security;


  create table "public"."products" (
    "id" text not null,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb
      );


alter table "public"."products" enable row level security;


  create table "public"."subscriptions" (
    "id" text not null,
    "user_id" uuid,
    "status" text,
    "price_id" text,
    "quantity" bigint,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "ended_at" text,
    "cancel_at" text,
    "canceled_at" text,
    "trial_start" text,
    "trial_end" text,
    "metadata" jsonb
      );


alter table "public"."subscriptions" enable row level security;


  create table "public"."user_roles" (
    "user_id" uuid not null,
    "is_admin" boolean not null default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
      );


alter table "public"."user_roles" enable row level security;

CREATE UNIQUE INDEX admin_settings_pkey ON public.admin_settings USING btree (id);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_id);

alter table "public"."admin_settings" add constraint "admin_settings_pkey" PRIMARY KEY using index "admin_settings_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_price_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_admin_role(admin_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user ID for the given email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = admin_email;

    -- Check if user exists
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;

    -- Upsert the admin role
    INSERT INTO user_roles (user_id, is_admin)
    VALUES (target_user_id, true)
    ON CONFLICT (user_id) DO UPDATE 
    SET is_admin = true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Insert a default non-admin role when a new user is created
    INSERT INTO user_roles (user_id, is_admin)
    VALUES (NEW.id, false)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT COALESCE(
        (SELECT is_admin FROM user_roles WHERE user_id = auth.uid()), 
        false
    );
$function$
;

CREATE OR REPLACE FUNCTION public.remove_admin_role(admin_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user ID for the given email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = admin_email;

    -- Check if user exists
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;

    -- Update to remove admin status
    UPDATE user_roles 
    SET is_admin = false 
    WHERE user_id = target_user_id;
END;
$function$
;

grant delete on table "public"."admin_settings" to "anon";

grant insert on table "public"."admin_settings" to "anon";

grant references on table "public"."admin_settings" to "anon";

grant select on table "public"."admin_settings" to "anon";

grant trigger on table "public"."admin_settings" to "anon";

grant truncate on table "public"."admin_settings" to "anon";

grant update on table "public"."admin_settings" to "anon";

grant delete on table "public"."admin_settings" to "authenticated";

grant insert on table "public"."admin_settings" to "authenticated";

grant references on table "public"."admin_settings" to "authenticated";

grant select on table "public"."admin_settings" to "authenticated";

grant trigger on table "public"."admin_settings" to "authenticated";

grant truncate on table "public"."admin_settings" to "authenticated";

grant update on table "public"."admin_settings" to "authenticated";

grant delete on table "public"."admin_settings" to "service_role";

grant insert on table "public"."admin_settings" to "service_role";

grant references on table "public"."admin_settings" to "service_role";

grant select on table "public"."admin_settings" to "service_role";

grant trigger on table "public"."admin_settings" to "service_role";

grant truncate on table "public"."admin_settings" to "service_role";

grant update on table "public"."admin_settings" to "service_role";

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Only admins can access settings"
  on "public"."admin_settings"
  as permissive
  for all
  to authenticated
using (is_admin());



  create policy "Allow public read access to prices"
  on "public"."prices"
  as permissive
  for select
  to public
using (true);



  create policy "Allow authenticated users to read products"
  on "public"."products"
  as permissive
  for select
  to public
using (true);



  create policy "Service role can manage roles"
  on "public"."user_roles"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Users can view their own role"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



