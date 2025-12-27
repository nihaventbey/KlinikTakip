--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.0

-- Started on 2025-12-27 12:13:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 37 (class 2615 OID 16494)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 23 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 35 (class 2615 OID 16574)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 34 (class 2615 OID 16563)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 12 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 13 (class 2615 OID 16555)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 38 (class 2615 OID 16542)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 32 (class 2615 OID 16603)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 6 (class 3079 OID 16639)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 16443)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16604)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4832 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1234 (class 1247 OID 16738)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1258 (class 1247 OID 16879)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1231 (class 1247 OID 16732)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1228 (class 1247 OID 16727)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1276 (class 1247 OID 16982)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1288 (class 1247 OID 17055)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1270 (class 1247 OID 16960)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1279 (class 1247 OID 16992)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1264 (class 1247 OID 16921)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1409 (class 1247 OID 17494)
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointment_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'ongoing'
);


ALTER TYPE public.appointment_status OWNER TO postgres;

--
-- TOC entry 1412 (class 1247 OID 17506)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'paid',
    'pending',
    'overdue'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 1415 (class 1247 OID 17514)
-- Name: tooth_condition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tooth_condition AS ENUM (
    'healthy',
    'caries',
    'filling',
    'implant',
    'missing',
    'crown'
);


ALTER TYPE public.tooth_condition OWNER TO postgres;

--
-- TOC entry 1406 (class 1247 OID 17485)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'doctor',
    'assistant',
    'receptionist',
    'SUPER_ADMIN',
    'ADMIN',
    'accountant',
    'SUPERADMIN'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 1361 (class 1247 OID 17122)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1297 (class 1247 OID 17082)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1300 (class 1247 OID 17097)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1379 (class 1247 OID 17218)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1364 (class 1247 OID 17135)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1397 (class 1247 OID 17415)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 487 (class 1255 OID 16540)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 4833 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 564 (class 1255 OID 16709)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 446 (class 1255 OID 16539)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 4836 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 458 (class 1255 OID 16538)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 4838 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 479 (class 1255 OID 16547)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 551 (class 1255 OID 16568)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 551
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 438 (class 1255 OID 16549)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 576 (class 1255 OID 16559)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 566 (class 1255 OID 16560)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 545 (class 1255 OID 16570)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 545
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 489 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 536 (class 1255 OID 23028)
-- Name: check_appointment_validity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_appointment_validity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    availability_count INTEGER;
    overlap_count INTEGER;
    appointment_day INTEGER;
BEGIN
    -- 1. Randevunun haftanın hangi günü olduğunu bul (0=Pazar, 1=Pazartesi...)
    appointment_day := EXTRACT(DOW FROM NEW.start_time);

    -- 2. Mesai Saati Kontrolü
    SELECT COUNT(*) INTO availability_count
    FROM public.staff_availability
    WHERE staff_id = NEW.doctor_id
      AND day_of_week = appointment_day
      AND is_active = true
      AND NEW.start_time::time >= start_time
      AND NEW.end_time::time <= end_time;

    IF availability_count = 0 THEN
        RAISE EXCEPTION 'Seçilen saatler doktorun mesai saatleri dışındadır.';
    END IF;

    -- 3. Çakışan Randevu Kontrolü (Overlap)
    SELECT COUNT(*) INTO overlap_count
    FROM public.appointments
    WHERE doctor_id = NEW.doctor_id
      AND status != 'cancelled' -- İptal edilenlerle çakışabilir
      AND id != NEW.id -- Güncelleme yapıyorsak kendisiyle çakışmasın
      AND (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time);

    IF overlap_count > 0 THEN
        RAISE EXCEPTION 'Bu doktorun belirtilen saatlerde başka bir randevusu bulunmaktadır.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_appointment_validity() OWNER TO postgres;

--
-- TOC entry 483 (class 1255 OID 25961)
-- Name: fn_auto_create_purchase_order(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_auto_create_purchase_order() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Stok kritik seviyenin altına düştü mü ve zaten açık bir sipariş yok mu?
    IF (NEW.stock <= NEW.min_level AND OLD.stock > NEW.min_level) THEN
        -- Eğer bu ürün için zaten 'pending' (bekleyen) bir sipariş yoksa yeni oluştur
        IF NOT EXISTS (
            SELECT 1 FROM public.purchase_orders po
            JOIN public.form_submissions fs ON po.form_submission_id = fs.id
            WHERE fs.submission_data->>'inventory_id' = NEW.id::text 
            AND po.status = 'pending'
        ) THEN
            INSERT INTO public.purchase_orders (
                clinic_id,
                status,
                total_amount,
                order_date
            ) VALUES (
                NEW.clinic_id,
                'pending',
                0, -- Fiyat sonra tedarikçi ile güncellenir
                CURRENT_DATE
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_auto_create_purchase_order() OWNER TO postgres;

--
-- TOC entry 562 (class 1255 OID 26121)
-- Name: fn_create_notification_from_template(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_create_notification_from_template() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    template_content text;
    final_message text;
    user_name text;
BEGIN
    -- 1. İlgili şablonu bul (Örn: 'geri_bildirim_cozuldu' isimli şablon)
    SELECT content_body INTO template_content 
    FROM public.notification_templates 
    WHERE name = 'geri_bildirim_cozuldu' AND type = 'in-app'
    LIMIT 1;

    -- 2. Değişkenleri çek (Kullanıcı adı vb.)
    SELECT full_name INTO user_name FROM public.profiles WHERE id = NEW.user_id;

    -- 3. Placeholder'ları ({{...}}) gerçek verilerle değiştir
    final_message := REPLACE(template_content, '{{kullanici_adi}}', user_name);
    final_message := REPLACE(final_message, '{{konu}}', NEW.subject);

    -- 4. Bildirimi oluştur
    IF (NEW.status = 'Çözüldü' AND OLD.status != 'Çözüldü') THEN
        INSERT INTO public.notifications (
            clinic_id,
            user_id,
            type,
            title,
            content
        ) VALUES (
            NEW.clinic_id,
            NEW.user_id,
            'in-app',
            'İşlem Tamamlandı',
            final_message
        );
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_create_notification_from_template() OWNER TO postgres;

--
-- TOC entry 498 (class 1255 OID 26103)
-- Name: fn_create_notification_on_resolve(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_create_notification_on_resolve() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Durum 'Çözüldü'ye geçtiğinde bildirim oluştur
    IF (NEW.status = 'Çözüldü' AND OLD.status != 'Çözüldü') THEN
        INSERT INTO public.notifications (
            clinic_id,
            user_id,
            type,
            title,
            content
        ) VALUES (
            NEW.clinic_id,
            NEW.user_id,
            'in-app', -- Varsayılan uygulama içi, backend servisi bunu SMS'e çevirebilir
            'Geri Bildiriminiz Çözüldü',
            '[' || NEW.subject || '] konulu bildiriminiz süperadmin tarafından çözüldü.'
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_create_notification_on_resolve() OWNER TO postgres;

--
-- TOC entry 497 (class 1255 OID 25997)
-- Name: fn_log_data_changes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_log_data_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        clinic_id
    )
    VALUES (
        auth.uid(), -- İşlemi yapan kullanıcının UUID'si
        TG_OP,      -- İşlem tipi (UPDATE, DELETE vb.)
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        to_jsonb(OLD), -- Eski veri (Old data)
        to_jsonb(NEW), -- Yeni veri (New data)
        COALESCE(NEW.clinic_id, OLD.clinic_id)
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_log_data_changes() OWNER TO postgres;

--
-- TOC entry 486 (class 1255 OID 24623)
-- Name: fn_sync_patient_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_sync_patient_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- GELİR (income) gelirse hastanın borcu azalır (bakiye düşer)
    -- GİDER (expense/iade) olursa hastanın borcu artar (bakiye artar)
    IF (NEW.status = 'completed') THEN
        IF NEW.type = 'income' THEN
            UPDATE public.patients SET balance = balance - NEW.amount WHERE id = NEW.patient_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE public.patients SET balance = balance + NEW.amount WHERE id = NEW.patient_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_sync_patient_balance() OWNER TO postgres;

--
-- TOC entry 531 (class 1255 OID 25996)
-- Name: fn_transfer_patient_to_new_doctor(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- 1. Gelecek randevuları devret
    UPDATE public.appointments 
    SET doctor_id = p_new_doctor_id 
    WHERE patient_id = p_patient_id AND status = 'pending' AND start_time > now();

    -- 2. Henüz tamamlanmamış (planned/active) tedavi planlarını devret
    UPDATE public.treatment_plans 
    SET doctor_id = p_new_doctor_id 
    WHERE patient_id = p_patient_id AND status IN ('planned', 'active');
END;
$$;


ALTER FUNCTION public.fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid) OWNER TO postgres;

--
-- TOC entry 472 (class 1255 OID 26053)
-- Name: fn_update_status_on_admin_response(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_update_status_on_admin_response() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Yanıt verildiğinde ana tablodaki durumu 'İnceleniyor' olarak güncelle
    UPDATE public.system_feedback
    SET status = 'İnceleniyor'
    WHERE id = NEW.feedback_id AND status = 'Beklemede';
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_update_status_on_admin_response() OWNER TO postgres;

--
-- TOC entry 445 (class 1255 OID 26244)
-- Name: get_my_clinic_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_my_clinic_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid();
$$;


ALTER FUNCTION public.get_my_clinic_id() OWNER TO postgres;

--
-- TOC entry 533 (class 1255 OID 26245)
-- Name: get_my_roles(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_my_roles() RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT roles FROM public.profiles WHERE id = auth.uid();
$$;


ALTER FUNCTION public.get_my_roles() OWNER TO postgres;

--
-- TOC entry 481 (class 1255 OID 26148)
-- Name: get_user_context(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_context() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'roles', roles, -- 'role' yerine 'roles' (array)
    'clinic_id', clinic_id,
    'tenant_id', tenant_id
  ) INTO result
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN result;
END;
$$;


ALTER FUNCTION public.get_user_context() OWNER TO postgres;

--
-- TOC entry 527 (class 1255 OID 26139)
-- Name: get_user_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_data() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'roles', roles,
    'clinic_id', clinic_id
  ) INTO result
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN result;
END;
$$;


ALTER FUNCTION public.get_user_data() OWNER TO postgres;

--
-- TOC entry 508 (class 1255 OID 25990)
-- Name: handle_new_clinic(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_clinic() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- clinic_settings tablosunda 'clinic_name' kolonu yok, 
  -- bu yüzden sadece 'clinic_id' ekliyoruz.
  INSERT INTO public.clinic_settings (clinic_id, logo_url, currency)
  VALUES (new.id, NULL, '₺');
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_clinic() OWNER TO postgres;

--
-- TOC entry 503 (class 1255 OID 17658)
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, clinic_id, roles)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    (new.raw_user_meta_data->>'clinic_id')::uuid,
    -- Gelen tekil rolü diziye çevirir (varsayılan: doctor)
    ARRAY[COALESCE(new.raw_user_meta_data->>'role', 'doctor')]::text[] 
  );
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- TOC entry 500 (class 1255 OID 21425)
-- Name: is_super_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_super_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND 'SUPER_ADMIN' = ANY(roles)
  );
END;
$$;


ALTER FUNCTION public.is_super_admin() OWNER TO postgres;

--
-- TOC entry 462 (class 1255 OID 17654)
-- Name: log_audit_event(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_audit_event() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  values (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    coalesce(new.id, old.id),
    case when TG_OP = 'DELETE' then row_to_json(old) else null end,
    case when TG_OP in ('INSERT', 'UPDATE') then row_to_json(new) else null end
  );
  return null;
end;
$$;


ALTER FUNCTION public.log_audit_event() OWNER TO postgres;

--
-- TOC entry 463 (class 1255 OID 24461)
-- Name: log_sensitive_data_view(uuid, text, uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        clinic_id,
        new_data -- Kimin neyi gördüğüne dair ek bilgi (isteğe bağlı)
    ) VALUES (
        p_user_id,
        'view',
        p_table_name,
        p_record_id,
        p_clinic_id,
        jsonb_build_object('accessed_at', now(), 'reason', 'Medical Case Review')
    );
END;
$$;


ALTER FUNCTION public.log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer) OWNER TO postgres;

--
-- TOC entry 543 (class 1255 OID 24499)
-- Name: process_inventory_transfer(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_inventory_transfer() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Sadece durum 'completed' olduğunda stokları güncelle
    IF (NEW.status = 'completed' AND OLD.status != 'completed') THEN
        -- Kaynak depodan düş
        UPDATE public.inventory 
        SET stock = stock - NEW.quantity 
        WHERE id = NEW.source_inventory_id;

        -- Hedef depoya ekle
        UPDATE public.inventory 
        SET stock = stock + NEW.quantity 
        WHERE id = NEW.destination_inventory_id;
        
        NEW.received_at = now();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.process_inventory_transfer() OWNER TO postgres;

--
-- TOC entry 484 (class 1255 OID 21142)
-- Name: sync_staff_role_to_profile(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_staff_role_to_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.profiles
  SET roles = ARRAY[NEW.role]::text[]
  WHERE id = (SELECT id FROM auth.users WHERE email = NEW.email);
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_staff_role_to_profile() OWNER TO postgres;

--
-- TOC entry 437 (class 1255 OID 24358)
-- Name: update_inventory_stock(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_inventory_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.transaction_type = 'in') THEN
            UPDATE public.inventory SET stock = stock + NEW.quantity WHERE id = NEW.inventory_id;
        ELSIF (NEW.transaction_type = 'out' OR NEW.transaction_type = 'adjustment') THEN
            UPDATE public.inventory SET stock = stock + NEW.quantity WHERE id = NEW.inventory_id;
            -- Not: adjustment durumunda NEW.quantity negatif gönderilmelidir.
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_inventory_stock() OWNER TO postgres;

--
-- TOC entry 465 (class 1255 OID 17206)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 538 (class 1255 OID 17386)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 510 (class 1255 OID 17223)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 493 (class 1255 OID 17119)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 540 (class 1255 OID 17114)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 509 (class 1255 OID 17219)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 467 (class 1255 OID 17241)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 501 (class 1255 OID 17113)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 532 (class 1255 OID 17385)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 521 (class 1255 OID 17111)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 515 (class 1255 OID 17195)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 542 (class 1255 OID 17379)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 443 (class 1255 OID 17368)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 568 (class 1255 OID 17242)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 522 (class 1255 OID 17433)
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 537 (class 1255 OID 17369)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 499 (class 1255 OID 17372)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 496 (class 1255 OID 17412)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 453 (class 1255 OID 17177)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 452 (class 1255 OID 17176)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 541 (class 1255 OID 17175)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 464 (class 1255 OID 17347)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 477 (class 1255 OID 17366)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 565 (class 1255 OID 17367)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 461 (class 1255 OID 17410)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 459 (class 1255 OID 17322)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 574 (class 1255 OID 17284)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 569 (class 1255 OID 17432)
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 556 (class 1255 OID 17434)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 466 (class 1255 OID 17371)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 554 (class 1255 OID 17435)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 504 (class 1255 OID 17441)
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 507 (class 1255 OID 17411)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 575 (class 1255 OID 17339)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 524 (class 1255 OID 17436)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 550 (class 1255 OID 17370)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 455 (class 1255 OID 17215)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 480 (class 1255 OID 17405)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 441 (class 1255 OID 17404)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 573 (class 1255 OID 17431)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 558 (class 1255 OID 17224)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 350 (class 1259 OID 16525)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 364 (class 1259 OID 16883)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 355 (class 1259 OID 16681)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 355
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 349 (class 1259 OID 16518)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 359 (class 1259 OID 16770)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 358 (class 1259 OID 16758)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 357 (class 1259 OID 16745)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 357
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 367 (class 1259 OID 16995)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- TOC entry 369 (class 1259 OID 17068)
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 366 (class 1259 OID 16965)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 368 (class 1259 OID 17028)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- TOC entry 365 (class 1259 OID 16933)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 348 (class 1259 OID 16507)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 347 (class 1259 OID 16506)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 347
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 362 (class 1259 OID 16812)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 363 (class 1259 OID 16830)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 351 (class 1259 OID 16533)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 356 (class 1259 OID 16711)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 356
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 356
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 356
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 361 (class 1259 OID 16797)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 360 (class 1259 OID 16788)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 360
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 346 (class 1259 OID 16495)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 346
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 411 (class 1259 OID 24569)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    patient_id uuid,
    doctor_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    status text DEFAULT 'pending'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 387 (class 1259 OID 17640)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    performed_at timestamp with time zone DEFAULT now(),
    clinic_id uuid
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 389 (class 1259 OID 18003)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    type text,
    status text DEFAULT 'active'::text,
    sent_count integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    discount_percentage integer DEFAULT 0,
    end_date date,
    name text,
    start_date date,
    is_active boolean DEFAULT true,
    clinic_id uuid
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 434 (class 1259 OID 29649)
-- Name: clinic_api_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_api_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid NOT NULL,
    provider text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.clinic_api_credentials OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 434
-- Name: TABLE clinic_api_credentials; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.clinic_api_credentials IS 'Kliniklerin 3. parti API entegrasyon ayarlarını (anahtarlar hariç) tutar.';


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 434
-- Name: COLUMN clinic_api_credentials.provider; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.clinic_api_credentials.provider IS 'Entegrasyon sağlayıcısının benzersiz adı (örn: "mutlucell_sms", "openai")';


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 434
-- Name: COLUMN clinic_api_credentials.metadata; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.clinic_api_credentials.metadata IS 'API anahtarı DIŞINDAKİ, hassas olmayan diğer ayarlar (örn: SMS başlığı, AI model versiyonu vb.)';


--
-- TOC entry 436 (class 1259 OID 30843)
-- Name: clinic_expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_expenses (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    clinic_id uuid NOT NULL,
    description text NOT NULL,
    amount numeric NOT NULL,
    expense_date date DEFAULT now() NOT NULL,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    category text
);


ALTER TABLE public.clinic_expenses OWNER TO postgres;

--
-- TOC entry 435 (class 1259 OID 30842)
-- Name: clinic_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.clinic_expenses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.clinic_expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 415 (class 1259 OID 24670)
-- Name: clinic_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_settings (
    clinic_id uuid NOT NULL,
    logo_url text,
    currency text DEFAULT '₺'::text,
    theme_settings jsonb DEFAULT '{"font": "Inter", "primary": "#007bff"}'::jsonb,
    social_links jsonb DEFAULT '{}'::jsonb,
    allow_before_after_display boolean DEFAULT false,
    sms_api_key_id uuid,
    whatsapp_api_key_id uuid,
    gemini_api_key_id uuid
);


ALTER TABLE public.clinic_settings OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 415
-- Name: COLUMN clinic_settings.sms_api_key_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.clinic_settings.sms_api_key_id IS 'ID of the secret in vault.secrets for SMS provider API key';


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 415
-- Name: COLUMN clinic_settings.whatsapp_api_key_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.clinic_settings.whatsapp_api_key_id IS 'ID of the secret in vault.secrets for WhatsApp provider API key';


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 415
-- Name: COLUMN clinic_settings.gemini_api_key_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.clinic_settings.gemini_api_key_id IS 'ID of the secret in vault.secrets for Google Gemini API key';


--
-- TOC entry 416 (class 1259 OID 24686)
-- Name: clinic_working_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic_working_hours (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    day_of_week integer,
    opening_time time without time zone,
    closing_time time without time zone,
    is_closed boolean DEFAULT false,
    CONSTRAINT clinic_working_hours_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


ALTER TABLE public.clinic_working_hours OWNER TO postgres;

--
-- TOC entry 394 (class 1259 OID 20638)
-- Name: clinical_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinical_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    note text,
    updated_at timestamp with time zone DEFAULT now(),
    clinic_id uuid,
    doctor_id uuid
);


ALTER TABLE public.clinical_notes OWNER TO postgres;

--
-- TOC entry 408 (class 1259 OID 24522)
-- Name: clinics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    name character varying NOT NULL,
    address text,
    phone_number character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.clinics OWNER TO postgres;

--
-- TOC entry 403 (class 1259 OID 23009)
-- Name: communication_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communication_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    type text,
    content text,
    status text,
    sent_at timestamp with time zone DEFAULT now(),
    clinic_id uuid
);


ALTER TABLE public.communication_logs OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 20758)
-- Name: dicom_annotations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dicom_annotations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    file_id uuid,
    tool_state jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.dicom_annotations OWNER TO postgres;

--
-- TOC entry 402 (class 1259 OID 22994)
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text,
    amount numeric NOT NULL,
    description text,
    expense_date date DEFAULT CURRENT_DATE,
    clinic_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- TOC entry 428 (class 1259 OID 26034)
-- Name: feedback_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feedback_id uuid NOT NULL,
    admin_id uuid NOT NULL,
    response_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.feedback_responses OWNER TO postgres;

--
-- TOC entry 418 (class 1259 OID 24713)
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    clinic_id uuid,
    submitted_by uuid,
    submission_data jsonb,
    related_record_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.form_submissions OWNER TO postgres;

--
-- TOC entry 417 (class 1259 OID 24699)
-- Name: form_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    title text NOT NULL,
    category text,
    content_schema jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.form_templates OWNER TO postgres;

--
-- TOC entry 429 (class 1259 OID 26060)
-- Name: integrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    provider_name text NOT NULL,
    integration_type text NOT NULL,
    config jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT integrations_integration_type_check CHECK ((integration_type = ANY (ARRAY['sms'::text, 'email'::text, 'push'::text])))
);


ALTER TABLE public.integrations OWNER TO postgres;

--
-- TOC entry 421 (class 1259 OID 24779)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    parent_inventory_id uuid,
    name text NOT NULL,
    stock integer DEFAULT 0,
    min_level integer DEFAULT 5
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 422 (class 1259 OID 24799)
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inventory_id uuid,
    type text,
    quantity integer NOT NULL,
    performed_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT inventory_transactions_type_check CHECK ((type = ANY (ARRAY['in'::text, 'out'::text, 'adjustment'::text])))
);


ALTER TABLE public.inventory_transactions OWNER TO postgres;

--
-- TOC entry 423 (class 1259 OID 25429)
-- Name: inventory_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transfers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_inventory_id uuid NOT NULL,
    destination_inventory_id uuid NOT NULL,
    quantity integer NOT NULL,
    status text DEFAULT 'pending'::text,
    sender_id uuid,
    receiver_id uuid,
    shipped_at timestamp with time zone,
    received_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT inventory_transfers_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT inventory_transfers_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'in_transit'::text, 'completed'::text, 'cancelled'::text])))
);


ALTER TABLE public.inventory_transfers OWNER TO postgres;

--
-- TOC entry 392 (class 1259 OID 20449)
-- Name: lab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item text NOT NULL,
    lab_name text NOT NULL,
    status text,
    due_date date,
    created_at timestamp with time zone DEFAULT now(),
    patient_id uuid,
    clinic_id uuid NOT NULL,
    CONSTRAINT lab_status_check CHECK ((status = ANY (ARRAY['ordered'::text, 'in-progress'::text, 'shipped'::text, 'arrived'::text])))
);


ALTER TABLE public.lab OWNER TO postgres;

--
-- TOC entry 390 (class 1259 OID 18015)
-- Name: marketing_leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketing_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    phone text,
    source text,
    status text DEFAULT 'new'::text,
    interest text,
    created_at timestamp with time zone DEFAULT now(),
    clinic_id uuid,
    converted_patient_id uuid
);


ALTER TABLE public.marketing_leads OWNER TO postgres;

--
-- TOC entry 405 (class 1259 OID 24208)
-- Name: medical_conditions_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_conditions_catalog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    condition_name text NOT NULL,
    category text,
    severity_level text DEFAULT 'low'::text,
    alert_message text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.medical_conditions_catalog OWNER TO postgres;

--
-- TOC entry 414 (class 1259 OID 24651)
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid NOT NULL,
    blood_type text,
    allergies jsonb DEFAULT '[]'::jsonb,
    chronic_diseases jsonb DEFAULT '[]'::jsonb,
    current_medications text,
    is_high_risk boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- TOC entry 398 (class 1259 OID 21145)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    label text NOT NULL,
    path text NOT NULL,
    allowed_roles text[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    required_package text,
    clinic_id uuid
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- TOC entry 397 (class 1259 OID 21144)
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 397
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- TOC entry 431 (class 1259 OID 26106)
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    name text NOT NULL,
    type text NOT NULL,
    subject text,
    content_body text NOT NULL,
    available_variables jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_templates_type_check CHECK ((type = ANY (ARRAY['sms'::text, 'email'::text, 'push'::text, 'in-app'::text])))
);


ALTER TABLE public.notification_templates OWNER TO postgres;

--
-- TOC entry 430 (class 1259 OID 26076)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text,
    content text NOT NULL,
    status text DEFAULT 'pending'::text,
    error_message text,
    integration_id uuid,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['sms'::text, 'email'::text, 'push'::text, 'in-app'::text])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 419 (class 1259 OID 24737)
-- Name: patient_consents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_consents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    template_id uuid,
    treatment_plan_id uuid,
    signed_content_snapshot text NOT NULL,
    is_signed boolean DEFAULT false,
    signed_at timestamp with time zone,
    clinic_id uuid
);


ALTER TABLE public.patient_consents OWNER TO postgres;

--
-- TOC entry 393 (class 1259 OID 20524)
-- Name: patient_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    patient_id uuid,
    file_name text,
    file_url text,
    file_type text
);


ALTER TABLE public.patient_files OWNER TO postgres;

--
-- TOC entry 432 (class 1259 OID 26173)
-- Name: patient_medical_conditions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_medical_conditions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid NOT NULL,
    condition_id uuid NOT NULL,
    notes text,
    diagnosed_at date,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.patient_medical_conditions OWNER TO postgres;

--
-- TOC entry 410 (class 1259 OID 24552)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    full_name text NOT NULL,
    phone text,
    balance numeric DEFAULT 0,
    ltv numeric DEFAULT 0,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    primary_doctor_id uuid,
    address text,
    birth_date text,
    identity_number text,
    email text,
    gender text,
    notes text,
    tc_number character varying(11)
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 395 (class 1259 OID 20678)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    drugs jsonb,
    created_at timestamp with time zone DEFAULT now(),
    clinic_id uuid
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- TOC entry 409 (class 1259 OID 24536)
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    clinic_id uuid,
    full_name text,
    specialty text,
    commission_rate integer DEFAULT 0,
    phone text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    tenant_id uuid,
    roles text[] DEFAULT ARRAY['doctor'::text],
    email text
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- TOC entry 400 (class 1259 OID 21366)
-- Name: saas_campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saas_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    discount_percent numeric NOT NULL,
    valid_until timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.saas_campaigns OWNER TO postgres;

--
-- TOC entry 399 (class 1259 OID 21357)
-- Name: saas_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saas_packages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    duration_months integer NOT NULL,
    max_users integer NOT NULL,
    features text[],
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.saas_packages OWNER TO postgres;

--
-- TOC entry 407 (class 1259 OID 24512)
-- Name: saas_tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saas_tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_name text NOT NULL,
    domain text,
    package_id uuid,
    status text,
    campaign_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT saas_tenants_status_check CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'pending'::text])))
);


ALTER TABLE public.saas_tenants OWNER TO postgres;

--
-- TOC entry 401 (class 1259 OID 22976)
-- Name: staff_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_id uuid,
    day_of_week integer,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_active boolean DEFAULT true,
    clinic_id uuid,
    CONSTRAINT staff_availability_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


ALTER TABLE public.staff_availability OWNER TO postgres;

--
-- TOC entry 420 (class 1259 OID 24766)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    name text NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 427 (class 1259 OID 26005)
-- Name: system_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid NOT NULL,
    user_id uuid NOT NULL,
    category text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    priority text DEFAULT 'Orta'::text,
    status text DEFAULT 'Beklemede'::text,
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT system_feedback_category_check CHECK ((category = ANY (ARRAY['Hata Bildirimi'::text, 'Öneri'::text, 'Arayüz/Deneyim'::text, 'Performans'::text, 'Diğer'::text]))),
    CONSTRAINT system_feedback_priority_check CHECK ((priority = ANY (ARRAY['Düşük'::text, 'Orta'::text, 'Yüksek'::text, 'Acil'::text]))),
    CONSTRAINT system_feedback_status_check CHECK ((status = ANY (ARRAY['Beklemede'::text, 'İnceleniyor'::text, 'Çözüldü'::text, 'Reddedildi'::text])))
);


ALTER TABLE public.system_feedback OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 18084)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    priority text,
    status text DEFAULT 'pending'::text,
    assignee text,
    due_date date,
    created_at timestamp with time zone DEFAULT now(),
    assignee_id uuid,
    clinic_id uuid NOT NULL,
    CONSTRAINT tasks_priority_check CHECK ((priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 386 (class 1259 OID 17592)
-- Name: teeth_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teeth_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid NOT NULL,
    tooth_number integer NOT NULL,
    condition public.tooth_condition DEFAULT 'healthy'::public.tooth_condition,
    notes text,
    updated_at timestamp with time zone DEFAULT now(),
    condition_id uuid,
    treatment_plan_id uuid,
    is_initial_state boolean DEFAULT true,
    surface_map jsonb
);


ALTER TABLE public.teeth_records OWNER TO postgres;

--
-- TOC entry 406 (class 1259 OID 24443)
-- Name: tenant_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    brand_name text,
    global_logo_url text,
    primary_color text DEFAULT '#007bff'::text,
    secondary_color text DEFAULT '#6c757d'::text,
    global_kvkk_text text,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tenant_settings OWNER TO postgres;

--
-- TOC entry 404 (class 1259 OID 24149)
-- Name: tooth_conditions_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tooth_conditions_catalog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    color_code text,
    icon_url text,
    is_pathological boolean DEFAULT true
);


ALTER TABLE public.tooth_conditions_catalog OWNER TO postgres;

--
-- TOC entry 412 (class 1259 OID 24594)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clinic_id uuid,
    patient_id uuid,
    doctor_id uuid,
    amount numeric NOT NULL,
    type text,
    status text DEFAULT 'completed'::text,
    transaction_date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now(),
    treatment_plan_id uuid,
    description text,
    deleted_at timestamp with time zone,
    category text,
    payee text,
    CONSTRAINT transactions_type_check CHECK ((type = ANY (ARRAY['income'::text, 'expense'::text])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 413 (class 1259 OID 24625)
-- Name: treatment_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.treatment_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    patient_id uuid,
    clinic_id uuid,
    treatment_catalog_id uuid,
    tooth_number integer,
    price numeric,
    status text DEFAULT 'planned'::text,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    doctor_id uuid,
    CONSTRAINT treatment_plans_status_check CHECK ((status = ANY (ARRAY['planned'::text, 'active'::text, 'completed'::text, 'cancelled'::text])))
);


ALTER TABLE public.treatment_plans OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 17927)
-- Name: treatments_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.treatments_catalog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text,
    price numeric DEFAULT 0,
    duration_min integer DEFAULT 30,
    created_at timestamp with time zone DEFAULT now(),
    clinic_id uuid,
    description text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.treatments_catalog OWNER TO postgres;

--
-- TOC entry 424 (class 1259 OID 25941)
-- Name: v_critical_stock_alerts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_critical_stock_alerts AS
 SELECT i.id AS inventory_id,
    i.name AS item_name,
    i.stock AS current_stock,
    i.min_level,
    c.name AS clinic_name,
    i.clinic_id,
        CASE
            WHEN (i.stock <= 0) THEN 'Tükendi'::text
            WHEN ((i.stock)::numeric <= ((i.min_level)::numeric * 0.5)) THEN 'Kritik Seviye'::text
            ELSE 'Eşik Altında'::text
        END AS stock_status,
    ((i.min_level * 2) - i.stock) AS suggested_reorder_quantity
   FROM (public.inventory i
     JOIN public.clinics c ON ((i.clinic_id = c.id)))
  WHERE (i.stock <= i.min_level)
  ORDER BY i.stock;


ALTER VIEW public.v_critical_stock_alerts OWNER TO postgres;

--
-- TOC entry 425 (class 1259 OID 25946)
-- Name: v_inventory_flow; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_inventory_flow AS
 SELECT i.name AS item_name,
    sum(
        CASE
            WHEN (it.type = 'in'::text) THEN it.quantity
            ELSE 0
        END) AS total_received,
    sum(
        CASE
            WHEN (it.type = 'out'::text) THEN abs(it.quantity)
            ELSE 0
        END) AS total_consumed,
    i.stock AS remaining_stock,
    i.clinic_id
   FROM (public.inventory i
     LEFT JOIN public.inventory_transactions it ON ((i.id = it.inventory_id)))
  GROUP BY i.id, i.name, i.stock, i.clinic_id;


ALTER VIEW public.v_inventory_flow OWNER TO postgres;

--
-- TOC entry 426 (class 1259 OID 25956)
-- Name: v_patient_noshow_analysis; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_patient_noshow_analysis AS
 SELECT p.id AS patient_id,
    p.full_name AS patient_name,
    p.clinic_id,
    count(a.id) AS total_appointments,
    count(a.id) FILTER (WHERE (a.status = 'no-show'::text)) AS noshow_count,
    round((((count(a.id) FILTER (WHERE (a.status = 'no-show'::text)))::numeric / (count(a.id))::numeric) * (100)::numeric), 2) AS noshow_rate
   FROM (public.patients p
     JOIN public.appointments a ON ((p.id = a.patient_id)))
  GROUP BY p.id, p.full_name, p.clinic_id
 HAVING (count(a.id) > 0);


ALTER VIEW public.v_patient_noshow_analysis OWNER TO postgres;

--
-- TOC entry 433 (class 1259 OID 26193)
-- Name: v_tenant_admin_dashboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_tenant_admin_dashboard AS
 SELECT tenant_id,
    id AS clinic_id,
    name AS clinic_name,
    ( SELECT count(*) AS count
           FROM public.patients p
          WHERE (p.clinic_id = c.id)) AS total_patients,
    ( SELECT COALESCE(sum(t.amount), (0)::numeric) AS "coalesce"
           FROM public.transactions t
          WHERE ((t.clinic_id = c.id) AND (t.type = 'income'::text) AND (t.status = 'completed'::text))) AS total_revenue,
    ( SELECT COALESCE(sum(e.amount), (0)::numeric) AS "coalesce"
           FROM public.expenses e
          WHERE (e.clinic_id = c.id)) AS total_expenses,
    ( SELECT count(*) AS count
           FROM public.appointments a
          WHERE ((a.clinic_id = c.id) AND (a.status = 'pending'::text) AND (a.start_time >= now()))) AS upcoming_appointments,
    ( SELECT count(*) AS count
           FROM public.inventory i
          WHERE ((i.clinic_id = c.id) AND (i.stock <= i.min_level))) AS low_stock_alerts
   FROM public.clinics c;


ALTER VIEW public.v_tenant_admin_dashboard OWNER TO postgres;

--
-- TOC entry 382 (class 1259 OID 17392)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 370 (class 1259 OID 17076)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 373 (class 1259 OID 17099)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 372 (class 1259 OID 17098)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 376 (class 1259 OID 17147)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 376
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 383 (class 1259 OID 17420)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 384 (class 1259 OID 17447)
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- TOC entry 375 (class 1259 OID 17138)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 377 (class 1259 OID 17157)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 377
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 381 (class 1259 OID 17350)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- TOC entry 379 (class 1259 OID 17287)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 380 (class 1259 OID 17301)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 385 (class 1259 OID 17457)
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- TOC entry 3909 (class 2604 OID 16510)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3998 (class 2604 OID 21148)
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- TOC entry 4741 (class 0 OID 16525)
-- Dependencies: 350
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- TOC entry 4752 (class 0 OID 16883)
-- Dependencies: 364
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- TOC entry 4743 (class 0 OID 16681)
-- Dependencies: 355
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
3f7c116d-6196-47dc-9243-7f5412990067	3f7c116d-6196-47dc-9243-7f5412990067	{"sub": "3f7c116d-6196-47dc-9243-7f5412990067", "email": "admin@klinik.com", "email_verified": false, "phone_verified": false}	email	2025-12-19 19:11:03.919103+00	2025-12-19 19:11:03.919175+00	2025-12-19 19:11:03.919175+00	d79c1481-e4a1-4e66-8d3b-d03273e222a1
a8dd5be8-5256-47b8-ac72-9ecd7187095d	a8dd5be8-5256-47b8-ac72-9ecd7187095d	{"sub": "a8dd5be8-5256-47b8-ac72-9ecd7187095d", "email": "resulyilmaz@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-12-21 21:23:15.218366+00	2025-12-21 21:23:15.218439+00	2025-12-21 21:23:15.218439+00	c331c0e1-f31c-48f5-8452-1ec4e67f447c
76b66663-3bad-4d65-ad9d-d7588df1da35	76b66663-3bad-4d65-ad9d-d7588df1da35	{"sub": "76b66663-3bad-4d65-ad9d-d7588df1da35", "email": "demo@kliniktakip.com", "email_verified": false, "phone_verified": false}	email	2025-12-22 21:50:05.990585+00	2025-12-22 21:50:05.990654+00	2025-12-22 21:50:05.990654+00	5fec5ab9-fc74-40d6-9ff3-7170f0455de7
\.


--
-- TOC entry 4740 (class 0 OID 16518)
-- Dependencies: 349
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4747 (class 0 OID 16770)
-- Dependencies: 359
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
b91bd267-9932-4d78-a62b-3d3f2efc4cf8	2025-12-27 07:04:05.045692+00	2025-12-27 07:04:05.045692+00	password	bf413295-1810-494b-bfae-4f281416ad98
eb61e1f9-389f-4604-9175-6891351fb34d	2025-12-27 08:55:29.710712+00	2025-12-27 08:55:29.710712+00	password	ff1424b9-a0bf-495f-b93f-68a6b81bdcb7
23e06ec2-163d-4e2e-9b72-17749fbd1105	2025-12-22 06:24:15.576639+00	2025-12-22 06:24:15.576639+00	password	a89f975b-fde7-44a2-a485-b075dae5eb9b
a017dcb2-4672-4f18-8622-01e0138ce2ed	2025-12-22 19:31:42.039552+00	2025-12-22 19:31:42.039552+00	password	2b0c2d36-96f2-4896-ad33-5515cf229cda
9981ae13-9eca-422b-9c21-cd75b386dcd9	2025-12-22 21:10:36.09179+00	2025-12-22 21:10:36.09179+00	password	bce64774-9719-4ac7-96f0-acf3a5a21662
fd8d865f-7075-4305-a8b2-48856371985b	2025-12-22 21:26:10.140306+00	2025-12-22 21:26:10.140306+00	password	8994d97d-7c25-4db0-a045-c0a68e12edf1
634a29ce-dfc0-4616-99f3-b398b5e0fec5	2025-12-22 21:26:23.603632+00	2025-12-22 21:26:23.603632+00	password	0f27916b-f262-4a11-9815-a27dd4ad9ea4
3b3a7598-1bdc-443e-a523-04a4f8dec130	2025-12-25 15:11:07.665623+00	2025-12-25 15:11:07.665623+00	password	d99be378-6964-4c5b-a205-87391cbdc625
22a91633-b42c-4d1c-a46e-4c7df4e24356	2025-12-27 07:03:28.60021+00	2025-12-27 07:03:28.60021+00	password	539de267-deaa-466f-9579-f0e4d7a108ff
\.


--
-- TOC entry 4746 (class 0 OID 16758)
-- Dependencies: 358
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4745 (class 0 OID 16745)
-- Dependencies: 357
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- TOC entry 4755 (class 0 OID 16995)
-- Dependencies: 367
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- TOC entry 4757 (class 0 OID 17068)
-- Dependencies: 369
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- TOC entry 4754 (class 0 OID 16965)
-- Dependencies: 366
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- TOC entry 4756 (class 0 OID 17028)
-- Dependencies: 368
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- TOC entry 4753 (class 0 OID 16933)
-- Dependencies: 365
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4739 (class 0 OID 16507)
-- Dependencies: 348
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	198	pqqewh5mbnbq	76b66663-3bad-4d65-ad9d-d7588df1da35	f	2025-12-27 07:04:05.043041+00	2025-12-27 07:04:05.043041+00	\N	b91bd267-9932-4d78-a62b-3d3f2efc4cf8
00000000-0000-0000-0000-000000000000	197	uljulscmyn7r	76b66663-3bad-4d65-ad9d-d7588df1da35	t	2025-12-27 07:03:28.594905+00	2025-12-27 08:01:50.076976+00	\N	22a91633-b42c-4d1c-a46e-4c7df4e24356
00000000-0000-0000-0000-000000000000	200	h4jimg5oexxv	76b66663-3bad-4d65-ad9d-d7588df1da35	f	2025-12-27 08:55:29.700115+00	2025-12-27 08:55:29.700115+00	\N	eb61e1f9-389f-4604-9175-6891351fb34d
00000000-0000-0000-0000-000000000000	199	v76lov73trxh	76b66663-3bad-4d65-ad9d-d7588df1da35	t	2025-12-27 08:01:50.10417+00	2025-12-27 09:04:58.582212+00	uljulscmyn7r	22a91633-b42c-4d1c-a46e-4c7df4e24356
00000000-0000-0000-0000-000000000000	201	lpouifgle3x7	76b66663-3bad-4d65-ad9d-d7588df1da35	f	2025-12-27 09:04:58.605603+00	2025-12-27 09:04:58.605603+00	v76lov73trxh	22a91633-b42c-4d1c-a46e-4c7df4e24356
00000000-0000-0000-0000-000000000000	174	wkdkcczvmkh3	a8dd5be8-5256-47b8-ac72-9ecd7187095d	f	2025-12-25 15:11:07.663015+00	2025-12-25 15:11:07.663015+00	\N	3b3a7598-1bdc-443e-a523-04a4f8dec130
00000000-0000-0000-0000-000000000000	124	k7q2eheue4uc	3f7c116d-6196-47dc-9243-7f5412990067	f	2025-12-22 06:24:15.573553+00	2025-12-22 06:24:15.573553+00	\N	23e06ec2-163d-4e2e-9b72-17749fbd1105
00000000-0000-0000-0000-000000000000	125	wior72k44e65	3f7c116d-6196-47dc-9243-7f5412990067	f	2025-12-22 19:31:41.983947+00	2025-12-22 19:31:41.983947+00	\N	a017dcb2-4672-4f18-8622-01e0138ce2ed
00000000-0000-0000-0000-000000000000	126	bzq5pubngm6l	3f7c116d-6196-47dc-9243-7f5412990067	f	2025-12-22 21:10:36.073021+00	2025-12-22 21:10:36.073021+00	\N	9981ae13-9eca-422b-9c21-cd75b386dcd9
00000000-0000-0000-0000-000000000000	131	kv3jcdbtmhvz	3f7c116d-6196-47dc-9243-7f5412990067	f	2025-12-22 21:26:10.123912+00	2025-12-22 21:26:10.123912+00	\N	fd8d865f-7075-4305-a8b2-48856371985b
00000000-0000-0000-0000-000000000000	132	aks2xqltzstx	3f7c116d-6196-47dc-9243-7f5412990067	f	2025-12-22 21:26:23.602429+00	2025-12-22 21:26:23.602429+00	\N	634a29ce-dfc0-4616-99f3-b398b5e0fec5
\.


--
-- TOC entry 4750 (class 0 OID 16812)
-- Dependencies: 362
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4751 (class 0 OID 16830)
-- Dependencies: 363
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4742 (class 0 OID 16533)
-- Dependencies: 351
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
\.


--
-- TOC entry 4744 (class 0 OID 16711)
-- Dependencies: 356
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
23e06ec2-163d-4e2e-9b72-17749fbd1105	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-22 06:24:15.571229+00	2025-12-22 06:24:15.571229+00	\N	aal1	\N	\N	Mozilla/5.0 (Android 12; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0	46.154.131.191	\N	\N	\N	\N	\N
a017dcb2-4672-4f18-8622-01e0138ce2ed	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-22 19:31:41.92551+00	2025-12-22 19:31:41.92551+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.63	\N	\N	\N	\N	\N
9981ae13-9eca-422b-9c21-cd75b386dcd9	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-22 21:10:36.050965+00	2025-12-22 21:10:36.050965+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.63	\N	\N	\N	\N	\N
fd8d865f-7075-4305-a8b2-48856371985b	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-22 21:26:10.102246+00	2025-12-22 21:26:10.102246+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.63	\N	\N	\N	\N	\N
634a29ce-dfc0-4616-99f3-b398b5e0fec5	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-22 21:26:23.601382+00	2025-12-22 21:26:23.601382+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.63	\N	\N	\N	\N	\N
b91bd267-9932-4d78-a62b-3d3f2efc4cf8	76b66663-3bad-4d65-ad9d-d7588df1da35	2025-12-27 07:04:05.041072+00	2025-12-27 07:04:05.041072+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0	176.88.38.171	\N	\N	\N	\N	\N
eb61e1f9-389f-4604-9175-6891351fb34d	76b66663-3bad-4d65-ad9d-d7588df1da35	2025-12-27 08:55:29.674209+00	2025-12-27 08:55:29.674209+00	\N	aal1	\N	\N	Mozilla/5.0 (Android 12; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0	176.88.38.171	\N	\N	\N	\N	\N
22a91633-b42c-4d1c-a46e-4c7df4e24356	76b66663-3bad-4d65-ad9d-d7588df1da35	2025-12-27 07:03:28.582956+00	2025-12-27 09:04:58.629983+00	\N	aal1	\N	2025-12-27 09:04:58.629275	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.171	\N	\N	\N	\N	\N
3b3a7598-1bdc-443e-a523-04a4f8dec130	a8dd5be8-5256-47b8-ac72-9ecd7187095d	2025-12-25 15:11:07.661317+00	2025-12-25 15:11:07.661317+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	176.88.38.171	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4749 (class 0 OID 16797)
-- Dependencies: 361
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4748 (class 0 OID 16788)
-- Dependencies: 360
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4737 (class 0 OID 16495)
-- Dependencies: 346
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	743ab7e2-0ae6-4c06-934e-65da39f73aad	authenticated	authenticated	super@dentcare.com	$2a$06$6HMZtVg9ilTzl7dCfbk8COyBslUW9rOoms9Nl3KhOhV.c8UQ1nJzS	2025-12-20 21:16:15.026034+00	\N		\N		\N	\N	\N	\N	\N	{"provider": "email", "providers": ["email"]}	{"full_name": "Sistem Yöneticisi"}	t	2025-12-20 21:16:15.026034+00	2025-12-20 21:16:15.026034+00	\N	\N			\N		0	\N		\N	f	\N	f
\N	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	\N	authenticated	arda@klinik.com	pass_hash	2025-12-22 13:06:11.194531+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "doctor", "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Dr. Arda Yılmaz"}	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	d2222222-e8fe-49fe-8e7d-1c3c62ca60db	\N	authenticated	selin@klinik.com	pass_hash	2025-12-22 13:06:11.194531+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "doctor", "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc", "full_name": "Dr. Selin Demir"}	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	a1111111-e8fe-49fe-8e7d-1c3c62ca60db	\N	authenticated	asli@klinik.com	pass_hash	2025-12-22 13:06:11.194531+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "assistant", "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Asistan Aslı Ak"}	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	76b66663-3bad-4d65-ad9d-d7588df1da35	authenticated	authenticated	demo@kliniktakip.com	$2a$10$ku2xmGi3IL.yvGtn3pDPDeKywx0latTPRuVFYKIKF3rsaWAiokNla	2025-12-22 21:50:05.997514+00	\N		\N		\N			\N	2025-12-27 08:55:29.673492+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-22 21:50:05.978924+00	2025-12-27 09:04:58.619906+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3f7c116d-6196-47dc-9243-7f5412990067	authenticated	authenticated	admin@klinik.com	$2a$10$./.6ZEYiFXciugNsw3PlfO1AP25b9LyHY.gu/E7AX7bSIiegk5zF.	2025-12-19 19:11:03.934751+00	\N		\N		\N			\N	2025-12-22 21:26:23.597202+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	t	2025-12-19 19:11:03.858321+00	2025-12-22 21:26:23.603329+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a8dd5be8-5256-47b8-ac72-9ecd7187095d	authenticated	authenticated	resulyilmaz@gmail.com	$2a$10$qBF1Z22e5tkJ85LOL9PeSe0cKm6fvtDJz1tN9Fcw9270yqJgic4Zi	2025-12-21 21:23:15.222161+00	\N		\N		\N			\N	2025-12-25 15:11:07.661202+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-21 21:23:15.202248+00	2025-12-25 15:11:07.665282+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4795 (class 0 OID 24569)
-- Dependencies: 411
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, clinic_id, patient_id, doctor_id, start_time, end_time, status, notes, created_at, deleted_at) FROM stdin;
dba6b017-61d6-446a-b415-c129c02735e5	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	308af675-918f-45b9-8513-8c5b0b461ec9	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	2025-12-26 15:59:00+00	2025-12-26 17:02:00+00	pending	Randevu güncellendi.	2025-12-24 21:59:57.481273+00	\N
\.


--
-- TOC entry 4771 (class 0 OID 17640)
-- Dependencies: 387
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, old_data, new_data, performed_at, clinic_id) FROM stdin;
5ddcb34f-fa44-46ec-a281-aa4e52169eba	\N	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "phone": "05051112233", "status": "active", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "phone": "05051112233", "status": "active", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-22 16:24:55.859194+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
208aad36-fc00-48a2-a8a3-799da7775370	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": null, "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "66666666666", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-23 17:06:44.747193+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
3341fcc1-29ca-4ef4-985e-899fd02888ed	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": null, "phone": "05051112233", "gender": null, "status": "active", "address": null, "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": null, "birth_date": null, "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": null, "phone": "05051112233", "gender": null, "status": "active", "address": null, "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": null, "birth_date": null, "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": "2025-12-23T20:08:13.339+00:00", "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-23 20:08:14.415238+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
fef14805-47d2-4021-9a24-3b5a290a716d	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": null, "phone": "05051112233", "gender": null, "status": "active", "address": null, "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": null, "birth_date": null, "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": "2025-12-23T20:08:13.339+00:00", "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": null, "phone": "05051112233", "gender": null, "status": "active", "address": null, "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": null, "birth_date": null, "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-24 21:12:22.135644+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
be460072-42b6-40b0-97ef-452ed428d1c2	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "66666666666", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-24 22:50:07.562199+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
4f3253de-92e1-4bd7-b69b-050275827fbe	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": null, "phone": "05051112233", "gender": null, "status": "active", "address": null, "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": null, "birth_date": null, "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": "", "phone": "05051112233", "gender": "male", "status": "active", "address": "", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": "60277334642", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-25 21:00:18.665715+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
6bd70254-6f5f-4361-ae08-65542fad0f79	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": "", "phone": "05051112233", "gender": "male", "status": "active", "address": "", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Mehmet Yılmaz", "tc_number": "60277334642", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": "Düzenli müşterimizdir.", "phone": "05051112233", "gender": "female", "status": "active", "address": "", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-25 21:14:08.931869+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
691102ab-2194-4360-ba7c-33d1e3223171	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 5000, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-25 22:07:51.220795+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
024d6adc-0499-4c71-97d7-b83cb15def02	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 5000, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-25 22:07:51.89362+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
f140f71e-b311-4060-9275-21f7d5cd2dc9	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": -23100, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-27 08:08:30.176663+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
d5822929-3ba6-43f7-be7e-ee26143d0a42	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": -23100, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-27 08:08:30.915311+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
bebffed6-ecfa-4ee8-8f64-fc33b76e3b71	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": -5000, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-27 08:10:08.025744+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
18a3e061-cfb0-4b4d-bec4-2871fbc3687c	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	308af675-918f-45b9-8513-8c5b0b461ec9	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": -5000, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	{"id": "308af675-918f-45b9-8513-8c5b0b461ec9", "ltv": 0, "email": "melikekaplan@gmail.com", "notes": "", "phone": "05445596622", "gender": "female", "status": "active", "address": "Gölbaşı, ANKARA", "balance": -10000, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Melike Yılmaz", "tc_number": "60277334642", "birth_date": "1984-11-27", "created_at": "2025-12-22T22:16:02.078129+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": null}	2025-12-27 08:10:08.562708+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
320a61d7-f6e6-4f6a-bef8-7f687d85f3da	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": null, "notes": "Düzenli müşterimizdir.", "phone": "05051112233", "gender": "female", "status": "active", "address": "", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": "elmasyilmaz@gmail.com", "notes": "Düzenli müşterimizdir.", "phone": "05051112233", "gender": "female", "status": "active", "address": "Ankara", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-27 08:46:05.174578+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
c649432f-c3b7-4afd-bde1-abe394233681	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": "elmasyilmaz@gmail.com", "notes": "Düzenli müşterimizdir.", "phone": "05051112233", "gender": "female", "status": "active", "address": "Ankara", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": "elmasyilmaz@gmail.com", "notes": "asdasdasd", "phone": "05051112233", "gender": "female", "status": "active", "address": "Ankara", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-27 08:46:11.419951+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
99774609-4176-4a78-8396-91888ac63a93	76b66663-3bad-4d65-ad9d-d7588df1da35	UPDATE	patients	01111111-e8fe-49fe-8e7d-1c3c62ca60db	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": "elmasyilmaz@gmail.com", "notes": "asdasdasd", "phone": "05051112233", "gender": "female", "status": "active", "address": "Ankara", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	{"id": "01111111-e8fe-49fe-8e7d-1c3c62ca60db", "ltv": 0, "email": "elmasyilmaz@gmail.com", "notes": "Hızlı not alanııııııııııııııııı", "phone": "05051112233", "gender": "female", "status": "active", "address": "Ankara", "balance": 0, "clinic_id": "b28beac8-e8fe-49fe-8e7d-1c3c62ca60db", "full_name": "Elmas Yılmaz", "tc_number": "60325333016", "birth_date": "1986-02-18", "created_at": "2025-12-22T16:18:14.099883+00:00", "deleted_at": null, "identity_number": null, "primary_doctor_id": "d2222222-e8fe-49fe-8e7d-1c3c62ca60db"}	2025-12-27 08:46:17.318814+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
\.


--
-- TOC entry 4773 (class 0 OID 18003)
-- Dependencies: 389
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, title, type, status, sent_count, conversion_rate, created_at, discount_percentage, end_date, name, start_date, is_active, clinic_id) FROM stdin;
ce1f25c2-bfb4-422b-9b0c-f17ccbbfc0bb	hoşgeldin	\N	active	0	0	2025-12-19 23:32:01.025072+00	10	2025-12-27	\N	2025-12-20	t	\N
\.


--
-- TOC entry 4814 (class 0 OID 29649)
-- Dependencies: 434
-- Data for Name: clinic_api_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_api_credentials (id, clinic_id, provider, is_active, metadata, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4816 (class 0 OID 30843)
-- Dependencies: 436
-- Data for Name: clinic_expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_expenses (id, created_at, clinic_id, description, amount, expense_date, is_deleted, deleted_at, category) FROM stdin;
1	2025-12-27 08:11:48.299762+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	tset	4444	2025-12-27	t	2025-12-27 08:12:13.94+00	\N
2	2025-12-27 08:18:23.545093+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Aralık	5000	2025-12-27	f	\N	Elektrik
\.


--
-- TOC entry 4799 (class 0 OID 24670)
-- Dependencies: 415
-- Data for Name: clinic_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_settings (clinic_id, logo_url, currency, theme_settings, social_links, allow_before_after_display, sms_api_key_id, whatsapp_api_key_id, gemini_api_key_id) FROM stdin;
b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	\N	₺	{"font": "Inter", "primary": "#007bff"}	{}	f	\N	\N	\N
\.


--
-- TOC entry 4800 (class 0 OID 24686)
-- Dependencies: 416
-- Data for Name: clinic_working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinic_working_hours (id, clinic_id, day_of_week, opening_time, closing_time, is_closed) FROM stdin;
7cbaad46-c489-4b35-b2ca-e7962fa4592d	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	1	09:00:00	18:00:00	f
7c621aad-27ae-42b7-a3ab-99809750f537	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	2	09:00:00	18:00:00	f
16f5257e-aaa7-4c7b-9e35-2c3f9625bd95	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	3	09:00:00	18:00:00	f
c1303e3a-3a06-4d9e-87fb-e9cdaccad197	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	4	09:00:00	18:00:00	f
32f4e595-8f62-430c-96e4-7075d9bdc38d	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	5	09:00:00	18:00:00	f
ba0e7f7e-5940-4ea9-a620-4fa388c529f5	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	6	01:32:00	02:33:00	t
c622196a-7c87-46ea-8996-c3fa6ef11d3a	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	0	\N	\N	t
\.


--
-- TOC entry 4778 (class 0 OID 20638)
-- Dependencies: 394
-- Data for Name: clinical_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinical_notes (id, patient_id, note, updated_at, clinic_id, doctor_id) FROM stdin;
\.


--
-- TOC entry 4792 (class 0 OID 24522)
-- Dependencies: 408
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, tenant_id, name, address, phone_number, created_at) FROM stdin;
b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	f18beac8-e8fe-49fe-8e7d-1c3c62ca60db	Ankara Diş - Kızılay Şubesi	Atatürk Bulvarı No:45, Ankara	03122223344	2025-12-22 13:01:51.611309+00
b28beac8-e8fe-49fe-8e7d-1c3c62ca60dd	f18beac8-e8fe-49fe-8e7d-1c3c62ca60dc	Gülüş Tasarımı - İstanbul Şubesi	Nişantaşı, İstanbul	02125556677	2025-12-22 13:01:51.611309+00
f2bd0012-9dc3-49e2-80ea-a4b0666a0918	41764a5e-490f-4490-a70a-95432f39f2fa	Demo Diş Kliniği Şubesi	İstanbul / Kadıköy Demo Cad. No:1	0555 123 45 67	2025-12-22 21:39:08.25373+00
b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	a18beac8-e8fe-49fe-8e7d-1c3c62ca60db	Burak ÇİNTAŞ Diş Kliniği	Çankaya Cad. No:10, Ankara	+903123121212	2025-12-22 12:15:43.344322+00
\.


--
-- TOC entry 4787 (class 0 OID 23009)
-- Dependencies: 403
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communication_logs (id, patient_id, type, content, status, sent_at, clinic_id) FROM stdin;
\.


--
-- TOC entry 4780 (class 0 OID 20758)
-- Dependencies: 396
-- Data for Name: dicom_annotations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dicom_annotations (id, file_id, tool_state, created_at) FROM stdin;
\.


--
-- TOC entry 4786 (class 0 OID 22994)
-- Dependencies: 402
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, category, amount, description, expense_date, clinic_id, created_at) FROM stdin;
\.


--
-- TOC entry 4809 (class 0 OID 26034)
-- Dependencies: 428
-- Data for Name: feedback_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback_responses (id, feedback_id, admin_id, response_text, created_at) FROM stdin;
78f67ebd-3df6-4c31-9cca-427ee006a30e	f1bc7bb8-cf65-476f-8911-7167bb13d81e	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	Bildiriminiz için teşekkürler. Yazılım ekibimiz hatayı incelemeye aldı, bir sonraki güncellemede düzeltilecektir.	2025-12-22 16:28:57.095741+00
\.


--
-- TOC entry 4802 (class 0 OID 24713)
-- Dependencies: 418
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_submissions (id, template_id, clinic_id, submitted_by, submission_data, related_record_id, created_at) FROM stdin;
\.


--
-- TOC entry 4801 (class 0 OID 24699)
-- Dependencies: 417
-- Data for Name: form_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_templates (id, clinic_id, title, category, content_schema, created_at) FROM stdin;
\.


--
-- TOC entry 4810 (class 0 OID 26060)
-- Dependencies: 429
-- Data for Name: integrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integrations (id, clinic_id, provider_name, integration_type, config, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4805 (class 0 OID 24779)
-- Dependencies: 421
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, clinic_id, parent_inventory_id, name, stock, min_level) FROM stdin;
\.


--
-- TOC entry 4806 (class 0 OID 24799)
-- Dependencies: 422
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transactions (id, inventory_id, type, quantity, performed_by, created_at) FROM stdin;
\.


--
-- TOC entry 4807 (class 0 OID 25429)
-- Dependencies: 423
-- Data for Name: inventory_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transfers (id, source_inventory_id, destination_inventory_id, quantity, status, sender_id, receiver_id, shipped_at, received_at, created_at) FROM stdin;
\.


--
-- TOC entry 4776 (class 0 OID 20449)
-- Dependencies: 392
-- Data for Name: lab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab (id, item, lab_name, status, due_date, created_at, patient_id, clinic_id) FROM stdin;
200c78b0-6fc7-4bdb-819e-2c122c0bfbc6	Zirkonyum Kuron	Referans Lab	ordered	2025-12-30	2025-12-22 16:18:21.90817+00	01111111-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
\.


--
-- TOC entry 4774 (class 0 OID 18015)
-- Dependencies: 390
-- Data for Name: marketing_leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marketing_leads (id, full_name, phone, source, status, interest, created_at, clinic_id, converted_patient_id) FROM stdin;
9bbd7f61-7380-4f6c-b092-6add4eb3e7c4	Burak Yılmaz	0532 111 22 33	Instagram	converted	İmplant	2025-12-17 13:52:23.500157+00	\N	\N
40754ba9-82f7-4429-8f97-e0474d0b3556	Resul	5442693217	Website	converted	test	2025-12-19 20:59:21.048+00	\N	\N
\.


--
-- TOC entry 4789 (class 0 OID 24208)
-- Dependencies: 405
-- Data for Name: medical_conditions_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_conditions_catalog (id, condition_name, category, severity_level, alert_message, created_at) FROM stdin;
\.


--
-- TOC entry 4798 (class 0 OID 24651)
-- Dependencies: 414
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, patient_id, blood_type, allergies, chronic_diseases, current_medications, is_high_risk, updated_at) FROM stdin;
04906977-b91d-49e3-b90e-05e5973d3a0f	308af675-918f-45b9-8513-8c5b0b461ec9	0+	["penisilin"]	["Grip", "Nezle"]	gripin, yüksek sadakat, pilli bebek	f	2025-12-24 21:39:10.88311+00
9cbc1963-3b2f-4884-b62c-1103547a7da3	01111111-e8fe-49fe-8e7d-1c3c62ca60db		[]	[]		t	2025-12-25 20:59:42.257596+00
\.


--
-- TOC entry 4782 (class 0 OID 21145)
-- Dependencies: 398
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, label, path, allowed_roles, created_at, required_package, clinic_id) FROM stdin;
1	Panel (Dashboard)	/	{admin,doctor,secretary,assistant,accountant}	2025-12-20 11:28:33.381167+00	\N	\N
2	Randevu Takvimi	/calendar	{admin,doctor,secretary}	2025-12-20 11:28:33.381167+00	\N	\N
3	Hasta Kayıtları	/patients	{admin,doctor,secretary,assistant}	2025-12-20 11:28:33.381167+00	\N	\N
4	Finansal Raporlar	/financials	{admin,accountant}	2025-12-20 11:28:33.381167+00	\N	\N
5	Personel Listesi	/admin/staff	{admin}	2025-12-20 11:28:33.381167+00	\N	\N
6	Personel Ekle	/admin/add-user	{admin}	2025-12-20 11:28:33.381167+00	\N	\N
7	Ayarlar	/settings	{admin}	2025-12-20 12:55:37.193853+00	\N	\N
\.


--
-- TOC entry 4812 (class 0 OID 26106)
-- Dependencies: 431
-- Data for Name: notification_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_templates (id, clinic_id, name, type, subject, content_body, available_variables, created_at) FROM stdin;
7fc3a2a6-1f3c-4e1a-ba67-c30143deb552	\N	randevu_onay	sms	\N	Sayın {{hasta_adi}}, {{tarih}} tarihindeki randevunuz onaylanmıştır. Sağlıklı günler dileriz.	["hasta_adi", "tarih"]	2025-12-22 16:33:53.710553+00
002f96fa-b31f-4985-a837-ef8c8fa60c2f	\N	geri_bildirim_cozuldu	in-app	Geri Bildirim Güncellemesi	Merhaba {{kullanici_adi}}, "{{konu}}" hakkındaki bildiriminiz süperadmin tarafından çözüme kavuşturulmuştur.	["kullanici_adi", "konu"]	2025-12-22 16:33:53.710553+00
291e2fc9-63bf-4dd3-b98b-a3d8121c2de7	\N	stok_uyarisi	push	Kritik Stok Alarmı	Dikkat! {{malzeme_adi}} stoğu {{miktar}} altına düşmüştür.	["malzeme_adi", "miktar"]	2025-12-22 16:33:53.710553+00
\.


--
-- TOC entry 4811 (class 0 OID 26076)
-- Dependencies: 430
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, clinic_id, user_id, type, title, content, status, error_message, integration_id, sent_at, created_at) FROM stdin;
\.


--
-- TOC entry 4803 (class 0 OID 24737)
-- Dependencies: 419
-- Data for Name: patient_consents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_consents (id, patient_id, template_id, treatment_plan_id, signed_content_snapshot, is_signed, signed_at, clinic_id) FROM stdin;
\.


--
-- TOC entry 4777 (class 0 OID 20524)
-- Dependencies: 393
-- Data for Name: patient_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_files (id, created_at, patient_id, file_name, file_url, file_type) FROM stdin;
\.


--
-- TOC entry 4813 (class 0 OID 26173)
-- Dependencies: 432
-- Data for Name: patient_medical_conditions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_medical_conditions (id, patient_id, condition_id, notes, diagnosed_at, created_at) FROM stdin;
\.


--
-- TOC entry 4794 (class 0 OID 24552)
-- Dependencies: 410
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, clinic_id, full_name, phone, balance, ltv, status, created_at, deleted_at, primary_doctor_id, address, birth_date, identity_number, email, gender, notes, tc_number) FROM stdin;
02222222-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	Ayşe Demir	05054445566	0	0	active	2025-12-22 16:18:14.099883+00	\N	\N	\N	\N	\N	\N	\N	\N	\N
308af675-918f-45b9-8513-8c5b0b461ec9	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Melike Yılmaz	05445596622	-10000	0	active	2025-12-22 22:16:02.078129+00	\N	\N	Gölbaşı, ANKARA	1984-11-27	\N	melikekaplan@gmail.com	female		60277334642
01111111-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Elmas Yılmaz	05051112233	0	0	active	2025-12-22 16:18:14.099883+00	\N	d2222222-e8fe-49fe-8e7d-1c3c62ca60db	Ankara	1986-02-18	\N	elmasyilmaz@gmail.com	female	Hızlı not alanııııııııııııııııı	60325333016
\.


--
-- TOC entry 4779 (class 0 OID 20678)
-- Dependencies: 395
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, patient_id, drugs, created_at, clinic_id) FROM stdin;
\.


--
-- TOC entry 4793 (class 0 OID 24536)
-- Dependencies: 409
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, clinic_id, full_name, specialty, commission_rate, phone, is_active, created_at, tenant_id, roles, email) FROM stdin;
d2222222-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	Dr. Selin Demir	\N	0	\N	t	2025-12-22 13:06:11.194531+00	f18beac8-e8fe-49fe-8e7d-1c3c62ca60db	{doctor}	\N
a8dd5be8-5256-47b8-ac72-9ecd7187095d	\N	Resul Yılmaz	\N	0	\N	t	2025-12-22 21:22:34.117846+00	\N	{SUPER_ADMIN}	\N
76b66663-3bad-4d65-ad9d-d7588df1da35	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Burak ÇİNTAŞ	\N	0	+905469063355	t	2025-12-22 21:50:05.978599+00	a18beac8-e8fe-49fe-8e7d-1c3c62ca60db	{admin}	cintasdisklinigi@gmail.com
a1111111-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Azra Soyadı	\N	0	5555555555	t	2025-12-22 13:06:11.194531+00	a18beac8-e8fe-49fe-8e7d-1c3c62ca60db	{assistant}	azrasoyad@gmail.com
d1111111-e8fe-49fe-8e7d-1c3c62ca60db	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Buse ÇİNTAŞ	\N	0	+905418988308	t	2025-12-22 13:06:11.194531+00	a18beac8-e8fe-49fe-8e7d-1c3c62ca60db	{admin}	busecintas@gmail.com
\.


--
-- TOC entry 4784 (class 0 OID 21366)
-- Dependencies: 400
-- Data for Name: saas_campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saas_campaigns (id, code, discount_percent, valid_until, is_active, created_at) FROM stdin;
6e0d37e0-9e5c-4c6e-8d9e-1c3c62ca60db	HOSGELDIN2025	15	\N	t	2025-12-22 12:15:43.344322+00
c10d37e0-9e5c-4c6e-8d9e-1c3c62ca60db	YENIYIL2026	20.0	2026-01-31 20:59:59+00	t	2025-12-22 12:48:49.556728+00
c10d37e0-9e5c-4c6e-8d9e-1c3c62ca60dc	DENTIST_SPECIAL	15.0	2025-12-31 20:59:59+00	t	2025-12-22 12:48:49.556728+00
\.


--
-- TOC entry 4783 (class 0 OID 21357)
-- Dependencies: 399
-- Data for Name: saas_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saas_packages (id, name, price, duration_months, max_users, features, created_at) FROM stdin;
7139bf84-c84b-4691-bdbc-17c39c523f97	Premium Plus	1500	12	20	{"Tüm Modüller","7/24 Destek","AI Analiz"}	2025-12-22 12:15:43.344322+00
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	Başlangıç Paketi	499.00	1	3	{"Randevu Takibi","Hasta Kayıt"}	2025-12-22 12:48:49.556728+00
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	Profesyonel Paket	1299.00	12	10	{"Randevu Takibi","Hasta Kayıt","Finansal Analiz","Stok Takibi"}	2025-12-22 12:48:49.556728+00
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13	Kurumsal Paket	4999.00	12	50	{"Tüm Modüller","Çoklu Şube","Özel Domain"}	2025-12-22 12:48:49.556728+00
\.


--
-- TOC entry 4791 (class 0 OID 24512)
-- Dependencies: 407
-- Data for Name: saas_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saas_tenants (id, clinic_name, domain, package_id, status, campaign_id, created_at) FROM stdin;
a18beac8-e8fe-49fe-8e7d-1c3c62ca60db	Gülüş Tasarımı Merkezi	\N	\N	active	6e0d37e0-9e5c-4c6e-8d9e-1c3c62ca60db	2025-12-22 12:15:43.344322+00
f18beac8-e8fe-49fe-8e7d-1c3c62ca60db	Ankara Diş Polikliniği	ankara-dis.com	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	active	c10d37e0-9e5c-4c6e-8d9e-1c3c62ca60db	2025-12-22 13:00:36.592884+00
f18beac8-e8fe-49fe-8e7d-1c3c62ca60dc	Gülüş Tasarımı Atölyesi	gulus-tasarimi.io	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13	active	\N	2025-12-22 13:00:36.592884+00
41764a5e-490f-4490-a70a-95432f39f2fa	Demo Diş Kliniği	\N	\N	active	\N	2025-12-22 21:39:08.25373+00
\.


--
-- TOC entry 4785 (class 0 OID 22976)
-- Dependencies: 401
-- Data for Name: staff_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_availability (id, staff_id, day_of_week, start_time, end_time, is_active, clinic_id) FROM stdin;
4039be3c-7f08-45fc-87a9-40cc2bd2d7a1	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	1	09:00:00	17:00:00	t	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
ad52ed87-79a8-41f6-9842-1956b1f44122	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	2	09:00:00	17:00:00	t	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
7cd20bb5-dc7a-4511-83e4-63dd9126a440	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	3	09:00:00	17:00:00	t	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
18f04a6d-ef80-47f4-a94b-bb421fd65da7	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	4	09:00:00	17:00:00	t	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
7bf21860-79da-4843-8f5f-4f422e7c98f0	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	5	09:00:00	17:00:00	t	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
\.


--
-- TOC entry 4804 (class 0 OID 24766)
-- Dependencies: 420
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, clinic_id, name) FROM stdin;
\.


--
-- TOC entry 4808 (class 0 OID 26005)
-- Dependencies: 427
-- Data for Name: system_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_feedback (id, clinic_id, user_id, category, subject, content, priority, status, admin_notes, created_at) FROM stdin;
6f7faced-176c-4ec0-a5c7-3156b43c5468	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	d1111111-e8fe-49fe-8e7d-1c3c62ca60db	Öneri	Koyu Tema İsteği	Gece nöbetlerinde göz yormaması için dark mode özelliği eklenebilir mi?	Düşük	Beklemede	\N	2025-12-22 16:27:05.886016+00
f1bc7bb8-cf65-476f-8911-7167bb13d81e	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	d2222222-e8fe-49fe-8e7d-1c3c62ca60db	Hata Bildirimi	Reçete Yazdırma Hatası	PDF oluşturulurken hastanın T.C. kimlik numarası bazen kayıyor.	Yüksek	İnceleniyor	\N	2025-12-22 16:27:05.886016+00
\.


--
-- TOC entry 4775 (class 0 OID 18084)
-- Dependencies: 391
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, priority, status, assignee, due_date, created_at, assignee_id, clinic_id) FROM stdin;
364c07db-0544-487c-b893-1b792f584b2a	Sterilizasyon ünitesini kontrol et	high	pending	Hemşire Fatma	\N	2025-12-19 19:38:41.811548+00	\N	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
892a89a1-7e09-492e-ba4e-b16d6767e4af	Yeni gelen implant setlerini say ve kaydet	medium	completed	Dr. Resul	\N	2025-12-19 19:38:41.811548+00	\N	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
3206e446-09a0-40cc-a0bc-2c0959c27e0c	Hasta onam formlarını dijitale aktar	low	pending	Resepsiyon Pelin	\N	2025-12-19 19:38:41.811548+00	\N	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
23a3dc36-4f0e-4aa5-b1ea-999f89cbf8ad	Dr. Ahmet hasta dosyaları arşivlenecek	medium	completed	Burcu	2025-12-16	2025-12-17 14:08:24.645484+00	\N	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db
\.


--
-- TOC entry 4770 (class 0 OID 17592)
-- Dependencies: 386
-- Data for Name: teeth_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teeth_records (id, patient_id, tooth_number, condition, notes, updated_at, condition_id, treatment_plan_id, is_initial_state, surface_map) FROM stdin;
cb04600e-4708-4d75-aa0f-eff43a0abedc	01111111-e8fe-49fe-8e7d-1c3c62ca60db	18	healthy	Derin çürük gözlemlendi.	2025-12-22 16:18:21.90817+00	c1111111-e8fe-49fe-8e7d-1c3c62ca60db	\N	t	\N
974bea74-9344-4f7e-bfbe-c90b59bd5dd5	02222222-e8fe-49fe-8e7d-1c3c62ca60db	21	healthy	Konjenital eksiklik.	2025-12-22 16:18:21.90817+00	c3333333-e8fe-49fe-8e7d-1c3c62ca60db	\N	t	\N
\.


--
-- TOC entry 4790 (class 0 OID 24443)
-- Dependencies: 406
-- Data for Name: tenant_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_settings (id, tenant_id, brand_name, global_logo_url, primary_color, secondary_color, global_kvkk_text, updated_at) FROM stdin;
14863f84-e48a-49c1-8262-7f1bc6314a77	f18beac8-e8fe-49fe-8e7d-1c3c62ca60db	Ankara Diş	\N	#2C3E50	#E74C3C	KVKK Aydınlatma Metni: Verileriniz Ankara Diş güvencesindedir.	2025-12-22 13:00:36.592884+00
40d3524c-227c-4986-b8f5-d1e8d29aa0ad	f18beac8-e8fe-49fe-8e7d-1c3c62ca60dc	Gülüş Atölyesi	\N	#16A085	#F1C40F	KVKK Aydınlatma Metni: Kişisel verileriniz 6698 sayılı kanun kapsamında işlenmektedir.	2025-12-22 13:00:36.592884+00
\.


--
-- TOC entry 4788 (class 0 OID 24149)
-- Dependencies: 404
-- Data for Name: tooth_conditions_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tooth_conditions_catalog (id, name, color_code, icon_url, is_pathological) FROM stdin;
c1111111-e8fe-49fe-8e7d-1c3c62ca60db	Çürük	#FF0000	\N	t
c2222222-e8fe-49fe-8e7d-1c3c62ca60db	Dolgu	#0000FF	\N	f
c3333333-e8fe-49fe-8e7d-1c3c62ca60db	Eksik Diş	#000000	\N	f
\.


--
-- TOC entry 4796 (class 0 OID 24594)
-- Dependencies: 412
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, clinic_id, patient_id, doctor_id, amount, type, status, transaction_date, created_at, treatment_plan_id, description, deleted_at, category, payee) FROM stdin;
93cfc396-e290-4602-b8dd-d1370e3ec86c	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	\N	\N	500	expense	completed	2025-12-26	2025-12-26 12:25:50.563189+00	\N	fatura\n	2025-12-26 12:45:36.934+00	\N	\N
92dbadfc-f940-4797-a812-66452b97fd28	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	308af675-918f-45b9-8513-8c5b0b461ec9	\N	-5000	income	completed	2025-12-25	2025-12-25 22:07:51.220795+00	\N		2025-12-27 08:04:26.604+00	\N	\N
7c4830fa-0d60-46bc-8015-980e9c6d207e	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	308af675-918f-45b9-8513-8c5b0b461ec9	\N	23100	income	completed	2025-12-27	2025-12-27 08:08:30.176663+00	\N		\N	\N	\N
297355e9-6896-4b63-970b-219415ac2aae	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	308af675-918f-45b9-8513-8c5b0b461ec9	\N	-5000	expense	completed	2025-12-27	2025-12-27 08:10:08.025744+00	\N		\N	\N	\N
\.


--
-- TOC entry 4797 (class 0 OID 24625)
-- Dependencies: 413
-- Data for Name: treatment_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.treatment_plans (id, patient_id, clinic_id, treatment_catalog_id, tooth_number, price, status, created_at, deleted_at, doctor_id) FROM stdin;
\.


--
-- TOC entry 4772 (class 0 OID 17927)
-- Dependencies: 388
-- Data for Name: treatments_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.treatments_catalog (id, name, category, price, duration_min, created_at, clinic_id, description, deleted_at) FROM stdin;
bd1bbc10-303f-4d22-9cfb-1278758fa41a	Diş Muayenesi	Genel	450.00	20	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	\N	\N
857d4e08-a4ae-46fd-b00d-2b64a6d38cc5	Panoramik Röntgen	Radyoloji	350.00	10	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	\N	\N
838f1f4f-1396-423c-a9a9-2ffcb937159b	Diş Taşı Temizliği (Detertraj)	Periodontoloji	1000.00	30	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60dc	\N	\N
e9f241c7-1417-4540-a04d-e3825148ccbc	deneme	Genelle	1232	30	2025-12-24 21:09:56.751235+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	444	2025-12-24 21:12:04.491+00
76428221-9021-47bb-9d48-d8674d03f764	dasdas	asdasd	123123	30	2025-12-24 21:13:17.462575+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	asdfasdas	2025-12-24 21:14:09.256+00
f05e883f-9c85-43fd-97a7-fb74d5368adf	sxxxxxxxxx	asda	333	30	2025-12-24 21:13:40.550833+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	z	2025-12-24 21:14:13.059+00
5c8036c6-1775-472e-8101-8a317d4c31c5	İmplant Uygulaması	Cerrahi	15000	60	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Yerli	\N
2c563c94-e3dc-40b2-aaf4-94152a28abd2	Kanal Tedavisi	Endodonti	2500	60	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Tek Kanal	\N
2e05e1dd-53bd-4ec6-a9ba-d11d779e7fc0	Diş Beyazlatma	Estetik	4500	90	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Office Bleaching 	\N
51b082e7-f894-42f2-89be-041cf1723103	Kompozit Dolgu	Restoratif	1200	45	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Zirkonyum Kaplama	\N
5df43281-7a14-4e40-99db-b5a6203c705a	Diş Muayenesi	Genel	0.01	20	2025-12-22 13:07:26.431091+00	b28beac8-e8fe-49fe-8e7d-1c3c62ca60db	Genel Ücretsiz Muayene	\N
\.


--
-- TOC entry 4758 (class 0 OID 17076)
-- Dependencies: 370
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-12-17 06:10:40
20211116045059	2025-12-17 06:10:40
20211116050929	2025-12-17 06:10:40
20211116051442	2025-12-17 06:10:40
20211116212300	2025-12-17 06:10:40
20211116213355	2025-12-17 06:10:40
20211116213934	2025-12-17 06:10:40
20211116214523	2025-12-17 06:10:40
20211122062447	2025-12-17 06:10:40
20211124070109	2025-12-17 06:10:40
20211202204204	2025-12-17 06:10:40
20211202204605	2025-12-17 06:10:40
20211210212804	2025-12-17 06:10:40
20211228014915	2025-12-17 06:10:40
20220107221237	2025-12-17 06:10:40
20220228202821	2025-12-17 06:10:40
20220312004840	2025-12-17 06:10:40
20220603231003	2025-12-17 06:10:40
20220603232444	2025-12-17 06:10:40
20220615214548	2025-12-17 06:10:40
20220712093339	2025-12-17 06:10:40
20220908172859	2025-12-17 06:10:40
20220916233421	2025-12-17 06:10:40
20230119133233	2025-12-17 06:10:40
20230128025114	2025-12-17 06:10:40
20230128025212	2025-12-17 06:10:40
20230227211149	2025-12-17 06:10:40
20230228184745	2025-12-17 06:10:41
20230308225145	2025-12-17 06:10:41
20230328144023	2025-12-17 06:10:41
20231018144023	2025-12-17 06:10:41
20231204144023	2025-12-17 06:10:41
20231204144024	2025-12-17 06:10:41
20231204144025	2025-12-17 06:10:41
20240108234812	2025-12-17 06:10:41
20240109165339	2025-12-17 06:10:41
20240227174441	2025-12-17 06:10:41
20240311171622	2025-12-17 06:10:41
20240321100241	2025-12-17 06:10:41
20240401105812	2025-12-17 06:10:41
20240418121054	2025-12-17 06:10:41
20240523004032	2025-12-17 06:10:41
20240618124746	2025-12-17 06:10:41
20240801235015	2025-12-17 06:10:41
20240805133720	2025-12-17 06:10:41
20240827160934	2025-12-17 06:10:41
20240919163303	2025-12-17 06:10:41
20240919163305	2025-12-17 06:10:41
20241019105805	2025-12-17 06:10:41
20241030150047	2025-12-17 06:10:41
20241108114728	2025-12-17 06:10:41
20241121104152	2025-12-17 06:10:41
20241130184212	2025-12-17 06:10:41
20241220035512	2025-12-17 06:10:41
20241220123912	2025-12-17 06:10:41
20241224161212	2025-12-17 06:10:41
20250107150512	2025-12-17 06:10:41
20250110162412	2025-12-17 06:10:41
20250123174212	2025-12-17 06:10:41
20250128220012	2025-12-17 06:10:41
20250506224012	2025-12-17 06:10:41
20250523164012	2025-12-17 06:10:41
20250714121412	2025-12-17 06:10:41
20250905041441	2025-12-17 06:10:41
20251103001201	2025-12-17 06:10:41
\.


--
-- TOC entry 4760 (class 0 OID 17099)
-- Dependencies: 373
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4762 (class 0 OID 17147)
-- Dependencies: 376
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
patient-files	patient-files	\N	2025-12-19 21:40:58.152752+00	2025-12-19 21:40:58.152752+00	t	f	\N	\N	\N	STANDARD
doctor-profiles	doctor-profiles	\N	2025-12-20 08:28:42.516294+00	2025-12-20 08:28:42.516294+00	t	f	\N	\N	\N	STANDARD
\.


--
-- TOC entry 4767 (class 0 OID 17420)
-- Dependencies: 383
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- TOC entry 4768 (class 0 OID 17447)
-- Dependencies: 384
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4761 (class 0 OID 17138)
-- Dependencies: 375
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-17 06:10:40.62369
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-17 06:10:40.641535
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-12-17 06:10:40.64795
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-17 06:10:40.674545
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-17 06:10:40.737187
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-17 06:10:40.744349
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-12-17 06:10:40.753441
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-17 06:10:40.759401
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-17 06:10:40.764088
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-12-17 06:10:40.787682
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-12-17 06:10:40.804113
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-17 06:10:40.877514
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-17 06:10:40.899583
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-17 06:10:40.90852
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-17 06:10:40.922969
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-17 06:10:40.999302
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-17 06:10:41.094471
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-17 06:10:41.105196
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-17 06:10:41.114126
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-17 06:10:41.181782
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-17 06:10:41.187931
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-17 06:10:41.195733
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-17 06:10:41.223787
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-17 06:10:41.242647
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-17 06:10:41.248973
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-17 06:10:41.255832
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-12-17 06:10:41.263325
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-12-17 06:10:41.282746
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-12-17 06:10:41.375946
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-12-17 06:10:41.381437
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-12-17 06:10:41.38793
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-12-17 06:10:41.395806
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-12-17 06:10:41.408554
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-12-17 06:10:41.46148
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-12-17 06:10:41.464085
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-12-17 06:10:41.470331
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-12-17 06:10:41.475042
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-17 06:10:41.482023
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-12-17 06:10:41.487301
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-12-17 06:10:41.496335
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-12-17 06:10:41.502018
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-12-17 06:10:41.510422
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-12-17 06:10:41.516136
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-12-17 06:10:41.524649
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-17 06:10:41.529635
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-17 06:10:41.53469
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-17 06:10:41.549165
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-17 06:10:41.559099
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-12-17 06:10:41.564946
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2025-12-19 17:29:29.060415
\.


--
-- TOC entry 4763 (class 0 OID 17157)
-- Dependencies: 377
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
2c16ebc8-3f3f-421e-a91c-7fc36d8760e1	patient-files	4106654a-5019-456b-a54f-42479852ac02/1766183535515_mubi.jpg	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-19 22:32:18.755045+00	2025-12-19 22:32:18.755045+00	2025-12-19 22:32:18.755045+00	{"eTag": "\\"c34ce55ce2d594730739267e3b8af64a\\"", "size": 884156, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-19T22:32:19.000Z", "contentLength": 884156, "httpStatusCode": 200}	4b72a6c8-8979-47cf-9051-556647294605	3f7c116d-6196-47dc-9243-7f5412990067	{}	2
f9fc9aec-dc9d-4f93-9f84-6c0d7687ab10	patient-files	4106654a-5019-456b-a54f-42479852ac02/1766228628136_image_00000.dcm	3f7c116d-6196-47dc-9243-7f5412990067	2025-12-20 11:03:55.94048+00	2025-12-20 11:03:55.94048+00	2025-12-20 11:03:55.94048+00	{"eTag": "\\"766ea434d89656bbabc32ca030ba7a86-2\\"", "size": 8223508, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-12-20T11:03:56.000Z", "contentLength": 8223508, "httpStatusCode": 200}	82658455-5f79-4065-8be2-f18db6f0b71a	3f7c116d-6196-47dc-9243-7f5412990067	{}	2
\.


--
-- TOC entry 4766 (class 0 OID 17350)
-- Dependencies: 381
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
patient-files	4106654a-5019-456b-a54f-42479852ac02	2025-12-19 21:50:24.105917+00	2025-12-19 21:50:24.105917+00
\.


--
-- TOC entry 4764 (class 0 OID 17287)
-- Dependencies: 379
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4765 (class 0 OID 17301)
-- Dependencies: 380
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4769 (class 0 OID 17457)
-- Dependencies: 385
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3899 (class 0 OID 16608)
-- Dependencies: 352
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 347
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 201, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 435
-- Name: clinic_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clinic_expenses_id_seq', 2, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 397
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 7, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 372
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4189 (class 2606 OID 16783)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4158 (class 2606 OID 16531)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4212 (class 2606 OID 16889)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4167 (class 2606 OID 16907)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4169 (class 2606 OID 16917)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4156 (class 2606 OID 16524)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4191 (class 2606 OID 16776)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4187 (class 2606 OID 16764)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4179 (class 2606 OID 16957)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4181 (class 2606 OID 16751)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4225 (class 2606 OID 17016)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- TOC entry 4227 (class 2606 OID 17014)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- TOC entry 4229 (class 2606 OID 17012)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4239 (class 2606 OID 17074)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4222 (class 2606 OID 16976)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4233 (class 2606 OID 17038)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4235 (class 2606 OID 17040)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- TOC entry 4216 (class 2606 OID 16942)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4150 (class 2606 OID 16514)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4153 (class 2606 OID 16694)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4201 (class 2606 OID 16823)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4203 (class 2606 OID 16821)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4208 (class 2606 OID 16837)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4161 (class 2606 OID 16537)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4174 (class 2606 OID 16715)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4198 (class 2606 OID 16804)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4193 (class 2606 OID 16795)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4143 (class 2606 OID 16877)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4145 (class 2606 OID 16501)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4337 (class 2606 OID 24578)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 4285 (class 2606 OID 17648)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4289 (class 2606 OID 18014)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 4379 (class 2606 OID 29661)
-- Name: clinic_api_credentials clinic_api_credentials_clinic_provider_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_api_credentials
    ADD CONSTRAINT clinic_api_credentials_clinic_provider_unique UNIQUE (clinic_id, provider);


--
-- TOC entry 4381 (class 2606 OID 29659)
-- Name: clinic_api_credentials clinic_api_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_api_credentials
    ADD CONSTRAINT clinic_api_credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4383 (class 2606 OID 30852)
-- Name: clinic_expenses clinic_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_expenses
    ADD CONSTRAINT clinic_expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 4347 (class 2606 OID 24680)
-- Name: clinic_settings clinic_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_settings
    ADD CONSTRAINT clinic_settings_pkey PRIMARY KEY (clinic_id);


--
-- TOC entry 4349 (class 2606 OID 29648)
-- Name: clinic_working_hours clinic_working_hours_clinic_id_day_of_week_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_working_hours
    ADD CONSTRAINT clinic_working_hours_clinic_id_day_of_week_key UNIQUE (clinic_id, day_of_week);


--
-- TOC entry 4351 (class 2606 OID 24693)
-- Name: clinic_working_hours clinic_working_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_working_hours
    ADD CONSTRAINT clinic_working_hours_pkey PRIMARY KEY (id);


--
-- TOC entry 4299 (class 2606 OID 20646)
-- Name: clinical_notes clinical_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4329 (class 2606 OID 24530)
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- TOC entry 4317 (class 2606 OID 23017)
-- Name: communication_logs communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4303 (class 2606 OID 20766)
-- Name: dicom_annotations dicom_annotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dicom_annotations
    ADD CONSTRAINT dicom_annotations_pkey PRIMARY KEY (id);


--
-- TOC entry 4315 (class 2606 OID 23003)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 4369 (class 2606 OID 26042)
-- Name: feedback_responses feedback_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_pkey PRIMARY KEY (id);


--
-- TOC entry 4355 (class 2606 OID 24721)
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4353 (class 2606 OID 24707)
-- Name: form_templates form_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT form_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 4371 (class 2606 OID 26070)
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4361 (class 2606 OID 24788)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 4363 (class 2606 OID 24808)
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4365 (class 2606 OID 25440)
-- Name: inventory_transfers inventory_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_pkey PRIMARY KEY (id);


--
-- TOC entry 4295 (class 2606 OID 20458)
-- Name: lab lab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab
    ADD CONSTRAINT lab_pkey PRIMARY KEY (id);


--
-- TOC entry 4291 (class 2606 OID 18024)
-- Name: marketing_leads marketing_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing_leads
    ADD CONSTRAINT marketing_leads_pkey PRIMARY KEY (id);


--
-- TOC entry 4321 (class 2606 OID 24217)
-- Name: medical_conditions_catalog medical_conditions_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_conditions_catalog
    ADD CONSTRAINT medical_conditions_catalog_pkey PRIMARY KEY (id);


--
-- TOC entry 4343 (class 2606 OID 24664)
-- Name: medical_records medical_records_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_patient_id_key UNIQUE (patient_id);


--
-- TOC entry 4345 (class 2606 OID 24662)
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4305 (class 2606 OID 21153)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4375 (class 2606 OID 26115)
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 4373 (class 2606 OID 26087)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4357 (class 2606 OID 24745)
-- Name: patient_consents patient_consents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_consents
    ADD CONSTRAINT patient_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4297 (class 2606 OID 20532)
-- Name: patient_files patient_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_files
    ADD CONSTRAINT patient_files_pkey PRIMARY KEY (id);


--
-- TOC entry 4377 (class 2606 OID 26181)
-- Name: patient_medical_conditions patient_medical_conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_medical_conditions
    ADD CONSTRAINT patient_medical_conditions_pkey PRIMARY KEY (id);


--
-- TOC entry 4335 (class 2606 OID 24563)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 4301 (class 2606 OID 20686)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4331 (class 2606 OID 30871)
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- TOC entry 4333 (class 2606 OID 24546)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4309 (class 2606 OID 21377)
-- Name: saas_campaigns saas_campaigns_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_campaigns
    ADD CONSTRAINT saas_campaigns_code_key UNIQUE (code);


--
-- TOC entry 4311 (class 2606 OID 21375)
-- Name: saas_campaigns saas_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_campaigns
    ADD CONSTRAINT saas_campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 4307 (class 2606 OID 21365)
-- Name: saas_packages saas_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_packages
    ADD CONSTRAINT saas_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4327 (class 2606 OID 24521)
-- Name: saas_tenants saas_tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_tenants
    ADD CONSTRAINT saas_tenants_pkey PRIMARY KEY (id);


--
-- TOC entry 4313 (class 2606 OID 22983)
-- Name: staff_availability staff_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_pkey PRIMARY KEY (id);


--
-- TOC entry 4359 (class 2606 OID 24773)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 4367 (class 2606 OID 26018)
-- Name: system_feedback system_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_feedback
    ADD CONSTRAINT system_feedback_pkey PRIMARY KEY (id);


--
-- TOC entry 4293 (class 2606 OID 18094)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4281 (class 2606 OID 20637)
-- Name: teeth_records teeth_records_patient_tooth_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teeth_records
    ADD CONSTRAINT teeth_records_patient_tooth_unique UNIQUE (patient_id, tooth_number);


--
-- TOC entry 4283 (class 2606 OID 17601)
-- Name: teeth_records teeth_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teeth_records
    ADD CONSTRAINT teeth_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4323 (class 2606 OID 24453)
-- Name: tenant_settings tenant_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 4325 (class 2606 OID 24455)
-- Name: tenant_settings tenant_settings_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_tenant_id_key UNIQUE (tenant_id);


--
-- TOC entry 4319 (class 2606 OID 24157)
-- Name: tooth_conditions_catalog tooth_conditions_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tooth_conditions_catalog
    ADD CONSTRAINT tooth_conditions_catalog_pkey PRIMARY KEY (id);


--
-- TOC entry 4339 (class 2606 OID 24605)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4341 (class 2606 OID 24635)
-- Name: treatment_plans treatment_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_plans
    ADD CONSTRAINT treatment_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 4287 (class 2606 OID 17937)
-- Name: treatments_catalog treatments_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatments_catalog
    ADD CONSTRAINT treatments_catalog_pkey PRIMARY KEY (id);


--
-- TOC entry 4271 (class 2606 OID 17408)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4244 (class 2606 OID 17107)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4241 (class 2606 OID 17080)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4273 (class 2606 OID 17480)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4252 (class 2606 OID 17155)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4276 (class 2606 OID 17456)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- TOC entry 4247 (class 2606 OID 17145)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4249 (class 2606 OID 17143)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4260 (class 2606 OID 17167)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4268 (class 2606 OID 17360)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 4265 (class 2606 OID 17310)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4263 (class 2606 OID 17295)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4279 (class 2606 OID 17466)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- TOC entry 4159 (class 1259 OID 16532)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4133 (class 1259 OID 16704)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4134 (class 1259 OID 16706)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4135 (class 1259 OID 16707)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4177 (class 1259 OID 16785)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4210 (class 1259 OID 16893)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4165 (class 1259 OID 16873)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 4165
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4170 (class 1259 OID 16701)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4213 (class 1259 OID 16890)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4237 (class 1259 OID 17075)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- TOC entry 4214 (class 1259 OID 16891)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4185 (class 1259 OID 16896)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4182 (class 1259 OID 16757)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4183 (class 1259 OID 16902)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4223 (class 1259 OID 17027)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- TOC entry 4220 (class 1259 OID 16980)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4230 (class 1259 OID 17053)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4231 (class 1259 OID 17051)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4236 (class 1259 OID 17052)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- TOC entry 4217 (class 1259 OID 16949)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4218 (class 1259 OID 16948)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4219 (class 1259 OID 16950)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4136 (class 1259 OID 16708)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4137 (class 1259 OID 16705)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4146 (class 1259 OID 16515)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4147 (class 1259 OID 16516)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4148 (class 1259 OID 16700)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4151 (class 1259 OID 16787)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4154 (class 1259 OID 16892)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4204 (class 1259 OID 16829)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4205 (class 1259 OID 16894)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4206 (class 1259 OID 16844)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4209 (class 1259 OID 16843)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4171 (class 1259 OID 16895)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4172 (class 1259 OID 17065)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- TOC entry 4175 (class 1259 OID 16786)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4196 (class 1259 OID 16811)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4199 (class 1259 OID 16810)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4194 (class 1259 OID 16796)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4195 (class 1259 OID 16958)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4184 (class 1259 OID 16955)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4176 (class 1259 OID 16784)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4138 (class 1259 OID 16864)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 4138
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4139 (class 1259 OID 16702)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4140 (class 1259 OID 16505)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4141 (class 1259 OID 16919)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4242 (class 1259 OID 17440)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4269 (class 1259 OID 17482)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4245 (class 1259 OID 17205)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 4250 (class 1259 OID 17156)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4253 (class 1259 OID 17173)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4274 (class 1259 OID 17481)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- TOC entry 4261 (class 1259 OID 17321)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4254 (class 1259 OID 17378)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 4255 (class 1259 OID 17285)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4256 (class 1259 OID 17388)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 4266 (class 1259 OID 17390)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 4257 (class 1259 OID 17174)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4258 (class 1259 OID 17387)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 4277 (class 1259 OID 17472)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- TOC entry 4484 (class 2620 OID 17659)
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- TOC entry 4498 (class 2620 OID 26054)
-- Name: feedback_responses trg_after_admin_response; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_after_admin_response AFTER INSERT ON public.feedback_responses FOR EACH ROW EXECUTE FUNCTION public.fn_update_status_on_admin_response();


--
-- TOC entry 4493 (class 2620 OID 25998)
-- Name: patients trg_audit_patients; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_patients AFTER UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.fn_log_data_changes();


--
-- TOC entry 4495 (class 2620 OID 25999)
-- Name: treatment_plans trg_audit_treatment_plans; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_treatment_plans AFTER UPDATE ON public.treatment_plans FOR EACH ROW EXECUTE FUNCTION public.fn_log_data_changes();


--
-- TOC entry 4496 (class 2620 OID 25962)
-- Name: inventory trg_auto_purchase_on_low_stock; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_purchase_on_low_stock AFTER UPDATE OF stock ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.fn_auto_create_purchase_order();


--
-- TOC entry 4497 (class 2620 OID 26104)
-- Name: system_feedback trg_on_feedback_resolved; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_on_feedback_resolved AFTER UPDATE ON public.system_feedback FOR EACH ROW EXECUTE FUNCTION public.fn_create_notification_on_resolve();


--
-- TOC entry 4494 (class 2620 OID 24624)
-- Name: transactions trg_transaction_balance_sync; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_transaction_balance_sync AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.fn_sync_patient_balance();


--
-- TOC entry 4485 (class 2620 OID 17112)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4486 (class 2620 OID 17413)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4487 (class 2620 OID 17444)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4488 (class 2620 OID 17374)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 4489 (class 2620 OID 17443)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- TOC entry 4491 (class 2620 OID 17409)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 4492 (class 2620 OID 17445)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4490 (class 2620 OID 17225)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4385 (class 2606 OID 16688)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4390 (class 2606 OID 16777)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4389 (class 2606 OID 16765)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4388 (class 2606 OID 16752)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4396 (class 2606 OID 17017)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4397 (class 2606 OID 17022)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4398 (class 2606 OID 17046)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4399 (class 2606 OID 17041)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4395 (class 2606 OID 16943)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4384 (class 2606 OID 16721)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4392 (class 2606 OID 16824)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4393 (class 2606 OID 16897)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4394 (class 2606 OID 16838)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4386 (class 2606 OID 17060)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4387 (class 2606 OID 16716)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4391 (class 2606 OID 16805)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4440 (class 2606 OID 24579)
-- Name: appointments appointments_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4441 (class 2606 OID 24589)
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id);


--
-- TOC entry 4442 (class 2606 OID 24584)
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4409 (class 2606 OID 25319)
-- Name: audit_logs audit_logs_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4410 (class 2606 OID 17649)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- TOC entry 4412 (class 2606 OID 25488)
-- Name: campaigns campaigns_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4482 (class 2606 OID 29662)
-- Name: clinic_api_credentials clinic_api_credentials_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_api_credentials
    ADD CONSTRAINT clinic_api_credentials_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4483 (class 2606 OID 30853)
-- Name: clinic_expenses clinic_expenses_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_expenses
    ADD CONSTRAINT clinic_expenses_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4452 (class 2606 OID 24681)
-- Name: clinic_settings clinic_settings_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_settings
    ADD CONSTRAINT clinic_settings_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4453 (class 2606 OID 24694)
-- Name: clinic_working_hours clinic_working_hours_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic_working_hours
    ADD CONSTRAINT clinic_working_hours_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4420 (class 2606 OID 26152)
-- Name: clinical_notes clinical_notes_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4421 (class 2606 OID 25344)
-- Name: clinical_notes clinical_notes_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4434 (class 2606 OID 24531)
-- Name: clinics clinics_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.saas_tenants(id);


--
-- TOC entry 4430 (class 2606 OID 25324)
-- Name: communication_logs communication_logs_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4425 (class 2606 OID 20767)
-- Name: dicom_annotations dicom_annotations_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dicom_annotations
    ADD CONSTRAINT dicom_annotations_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.patient_files(id) ON DELETE CASCADE;


--
-- TOC entry 4429 (class 2606 OID 25329)
-- Name: expenses expenses_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4473 (class 2606 OID 26048)
-- Name: feedback_responses feedback_responses_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id);


--
-- TOC entry 4474 (class 2606 OID 26043)
-- Name: feedback_responses feedback_responses_feedback_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback_responses
    ADD CONSTRAINT feedback_responses_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.system_feedback(id) ON DELETE CASCADE;


--
-- TOC entry 4422 (class 2606 OID 28521)
-- Name: clinical_notes fk_clinical_notes_doctor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT fk_clinical_notes_doctor FOREIGN KEY (doctor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- TOC entry 4455 (class 2606 OID 24727)
-- Name: form_submissions form_submissions_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4456 (class 2606 OID 24732)
-- Name: form_submissions form_submissions_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.profiles(id);


--
-- TOC entry 4457 (class 2606 OID 24722)
-- Name: form_submissions form_submissions_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.form_templates(id);


--
-- TOC entry 4454 (class 2606 OID 24708)
-- Name: form_templates form_templates_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT form_templates_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4475 (class 2606 OID 26071)
-- Name: integrations integrations_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4463 (class 2606 OID 24789)
-- Name: inventory inventory_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4464 (class 2606 OID 24794)
-- Name: inventory inventory_parent_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_parent_inventory_id_fkey FOREIGN KEY (parent_inventory_id) REFERENCES public.inventory(id);


--
-- TOC entry 4465 (class 2606 OID 24809)
-- Name: inventory_transactions inventory_transactions_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_inventory_id_fkey FOREIGN KEY (inventory_id) REFERENCES public.inventory(id);


--
-- TOC entry 4466 (class 2606 OID 24814)
-- Name: inventory_transactions inventory_transactions_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.profiles(id);


--
-- TOC entry 4467 (class 2606 OID 25446)
-- Name: inventory_transfers inventory_transfers_destination_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_destination_inventory_id_fkey FOREIGN KEY (destination_inventory_id) REFERENCES public.inventory(id);


--
-- TOC entry 4468 (class 2606 OID 25483)
-- Name: inventory_transfers inventory_transfers_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id);


--
-- TOC entry 4469 (class 2606 OID 25478)
-- Name: inventory_transfers inventory_transfers_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id);


--
-- TOC entry 4470 (class 2606 OID 25441)
-- Name: inventory_transfers inventory_transfers_source_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_source_inventory_id_fkey FOREIGN KEY (source_inventory_id) REFERENCES public.inventory(id);


--
-- TOC entry 4417 (class 2606 OID 26222)
-- Name: lab lab_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab
    ADD CONSTRAINT lab_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4418 (class 2606 OID 25349)
-- Name: lab lab_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab
    ADD CONSTRAINT lab_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4413 (class 2606 OID 25463)
-- Name: marketing_leads marketing_leads_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing_leads
    ADD CONSTRAINT marketing_leads_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4414 (class 2606 OID 26162)
-- Name: marketing_leads marketing_leads_converted_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing_leads
    ADD CONSTRAINT marketing_leads_converted_patient_id_fkey FOREIGN KEY (converted_patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4451 (class 2606 OID 24665)
-- Name: medical_records medical_records_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4426 (class 2606 OID 25468)
-- Name: menu_items menu_items_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4479 (class 2606 OID 26116)
-- Name: notification_templates notification_templates_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4476 (class 2606 OID 26088)
-- Name: notifications notifications_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4477 (class 2606 OID 26098)
-- Name: notifications notifications_integration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_integration_id_fkey FOREIGN KEY (integration_id) REFERENCES public.integrations(id);


--
-- TOC entry 4478 (class 2606 OID 26093)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- TOC entry 4458 (class 2606 OID 24761)
-- Name: patient_consents patient_consents_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_consents
    ADD CONSTRAINT patient_consents_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4459 (class 2606 OID 24746)
-- Name: patient_consents patient_consents_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_consents
    ADD CONSTRAINT patient_consents_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4460 (class 2606 OID 24751)
-- Name: patient_consents patient_consents_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_consents
    ADD CONSTRAINT patient_consents_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.form_templates(id);


--
-- TOC entry 4461 (class 2606 OID 24756)
-- Name: patient_consents patient_consents_treatment_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_consents
    ADD CONSTRAINT patient_consents_treatment_plan_id_fkey FOREIGN KEY (treatment_plan_id) REFERENCES public.treatment_plans(id);


--
-- TOC entry 4419 (class 2606 OID 25359)
-- Name: patient_files patient_files_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_files
    ADD CONSTRAINT patient_files_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4438 (class 2606 OID 24564)
-- Name: patients patients_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4439 (class 2606 OID 25991)
-- Name: patients patients_primary_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_primary_doctor_id_fkey FOREIGN KEY (primary_doctor_id) REFERENCES public.profiles(id);


--
-- TOC entry 4480 (class 2606 OID 26187)
-- Name: patient_medical_conditions pmc_condition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_medical_conditions
    ADD CONSTRAINT pmc_condition_id_fkey FOREIGN KEY (condition_id) REFERENCES public.medical_conditions_catalog(id) ON DELETE CASCADE;


--
-- TOC entry 4481 (class 2606 OID 26182)
-- Name: patient_medical_conditions pmc_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_medical_conditions
    ADD CONSTRAINT pmc_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4423 (class 2606 OID 26157)
-- Name: prescriptions prescriptions_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4424 (class 2606 OID 25354)
-- Name: prescriptions prescriptions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4435 (class 2606 OID 24547)
-- Name: profiles profiles_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4436 (class 2606 OID 25396)
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4437 (class 2606 OID 26143)
-- Name: profiles profiles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.saas_tenants(id);


--
-- TOC entry 4432 (class 2606 OID 25503)
-- Name: saas_tenants saas_tenants_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_tenants
    ADD CONSTRAINT saas_tenants_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.saas_campaigns(id);


--
-- TOC entry 4433 (class 2606 OID 25498)
-- Name: saas_tenants saas_tenants_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saas_tenants
    ADD CONSTRAINT saas_tenants_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.saas_packages(id);


--
-- TOC entry 4427 (class 2606 OID 25339)
-- Name: staff_availability staff_availability_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4428 (class 2606 OID 25364)
-- Name: staff_availability staff_availability_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_availability
    ADD CONSTRAINT staff_availability_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.profiles(id);


--
-- TOC entry 4462 (class 2606 OID 24774)
-- Name: suppliers suppliers_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4471 (class 2606 OID 26019)
-- Name: system_feedback system_feedback_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_feedback
    ADD CONSTRAINT system_feedback_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON DELETE CASCADE;


--
-- TOC entry 4472 (class 2606 OID 26024)
-- Name: system_feedback system_feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_feedback
    ADD CONSTRAINT system_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4415 (class 2606 OID 25473)
-- Name: tasks tasks_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.profiles(id);


--
-- TOC entry 4416 (class 2606 OID 26132)
-- Name: tasks tasks_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4406 (class 2606 OID 24159)
-- Name: teeth_records teeth_records_condition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teeth_records
    ADD CONSTRAINT teeth_records_condition_id_fkey FOREIGN KEY (condition_id) REFERENCES public.tooth_conditions_catalog(id);


--
-- TOC entry 4407 (class 2606 OID 25916)
-- Name: teeth_records teeth_records_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teeth_records
    ADD CONSTRAINT teeth_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4408 (class 2606 OID 25921)
-- Name: teeth_records teeth_records_treatment_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teeth_records
    ADD CONSTRAINT teeth_records_treatment_plan_id_fkey FOREIGN KEY (treatment_plan_id) REFERENCES public.treatment_plans(id);


--
-- TOC entry 4431 (class 2606 OID 25508)
-- Name: tenant_settings tenant_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.saas_tenants(id);


--
-- TOC entry 4443 (class 2606 OID 24606)
-- Name: transactions transactions_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4444 (class 2606 OID 24616)
-- Name: transactions transactions_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id);


--
-- TOC entry 4445 (class 2606 OID 24611)
-- Name: transactions transactions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4446 (class 2606 OID 25926)
-- Name: transactions transactions_treatment_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_treatment_plan_id_fkey FOREIGN KEY (treatment_plan_id) REFERENCES public.treatment_plans(id);


--
-- TOC entry 4447 (class 2606 OID 24641)
-- Name: treatment_plans treatment_plans_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_plans
    ADD CONSTRAINT treatment_plans_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4448 (class 2606 OID 25931)
-- Name: treatment_plans treatment_plans_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_plans
    ADD CONSTRAINT treatment_plans_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id);


--
-- TOC entry 4449 (class 2606 OID 24636)
-- Name: treatment_plans treatment_plans_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_plans
    ADD CONSTRAINT treatment_plans_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- TOC entry 4450 (class 2606 OID 24646)
-- Name: treatment_plans treatment_plans_treatment_catalog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_plans
    ADD CONSTRAINT treatment_plans_treatment_catalog_id_fkey FOREIGN KEY (treatment_catalog_id) REFERENCES public.treatments_catalog(id);


--
-- TOC entry 4411 (class 2606 OID 25334)
-- Name: treatments_catalog treatments_catalog_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatments_catalog
    ADD CONSTRAINT treatments_catalog_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- TOC entry 4400 (class 2606 OID 17168)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4404 (class 2606 OID 17361)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4401 (class 2606 OID 17296)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4402 (class 2606 OID 17316)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4403 (class 2606 OID 17311)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4405 (class 2606 OID 17467)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- TOC entry 4654 (class 0 OID 16525)
-- Dependencies: 350
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4665 (class 0 OID 16883)
-- Dependencies: 364
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4656 (class 0 OID 16681)
-- Dependencies: 355
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4653 (class 0 OID 16518)
-- Dependencies: 349
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4660 (class 0 OID 16770)
-- Dependencies: 359
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4659 (class 0 OID 16758)
-- Dependencies: 358
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4658 (class 0 OID 16745)
-- Dependencies: 357
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4666 (class 0 OID 16933)
-- Dependencies: 365
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4652 (class 0 OID 16507)
-- Dependencies: 348
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4663 (class 0 OID 16812)
-- Dependencies: 362
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4664 (class 0 OID 16830)
-- Dependencies: 363
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4655 (class 0 OID 16533)
-- Dependencies: 351
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4657 (class 0 OID 16711)
-- Dependencies: 356
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4662 (class 0 OID 16797)
-- Dependencies: 361
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4661 (class 0 OID 16788)
-- Dependencies: 360
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4651 (class 0 OID 16495)
-- Dependencies: 346
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4725 (class 3256 OID 29716)
-- Name: clinic_settings Allow authenticated users to read clinic_settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to read clinic_settings" ON public.clinic_settings FOR SELECT TO authenticated USING (true);


--
-- TOC entry 4730 (class 3256 OID 29717)
-- Name: clinic_settings Allow clinic members to manage their own clinic_settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow clinic members to manage their own clinic_settings" ON public.clinic_settings USING ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id));


--
-- TOC entry 4724 (class 3256 OID 29670)
-- Name: clinic_settings Clinics can update their own settings.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Clinics can update their own settings." ON public.clinic_settings FOR UPDATE USING ((clinic_id = ( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));


--
-- TOC entry 4723 (class 3256 OID 29669)
-- Name: clinic_settings Clinics can view their own settings.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Clinics can view their own settings." ON public.clinic_settings FOR SELECT USING ((clinic_id = ( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));


--
-- TOC entry 4732 (class 3256 OID 30859)
-- Name: clinic_expenses Enable insert for clinic members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for clinic members" ON public.clinic_expenses FOR INSERT TO authenticated WITH CHECK ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id));


--
-- TOC entry 4731 (class 3256 OID 30858)
-- Name: clinic_expenses Enable read access for clinic members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for clinic members" ON public.clinic_expenses FOR SELECT TO authenticated USING ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id));


--
-- TOC entry 4727 (class 3256 OID 29645)
-- Name: clinics Enable read access for own clinic; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for own clinic" ON public.clinics FOR SELECT USING ((id = public.get_my_clinic_id()));


--
-- TOC entry 4717 (class 3256 OID 29667)
-- Name: clinic_api_credentials Enable read access for own clinic API credentials; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for own clinic API credentials" ON public.clinic_api_credentials FOR SELECT USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4734 (class 3256 OID 30862)
-- Name: clinic_expenses Enable soft delete for clinic members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable soft delete for clinic members" ON public.clinic_expenses FOR UPDATE TO authenticated USING ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id)) WITH CHECK ((is_deleted = true));


--
-- TOC entry 4722 (class 3256 OID 29668)
-- Name: clinic_api_credentials Enable update access for clinic API admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update access for clinic API admins" ON public.clinic_api_credentials USING ((clinic_id = public.get_my_clinic_id())) WITH CHECK (((clinic_id = public.get_my_clinic_id()) AND (public.get_my_roles() && ARRAY['ADMIN'::text])));


--
-- TOC entry 4728 (class 3256 OID 29646)
-- Name: clinics Enable update access for clinic admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update access for clinic admins" ON public.clinics FOR UPDATE USING ((id = public.get_my_clinic_id())) WITH CHECK (((id = public.get_my_clinic_id()) AND (public.get_my_roles() && ARRAY['ADMIN'::text])));


--
-- TOC entry 4733 (class 3256 OID 30860)
-- Name: clinic_expenses Enable update for clinic members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for clinic members" ON public.clinic_expenses FOR UPDATE TO authenticated USING ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id)) WITH CHECK ((( SELECT profiles.clinic_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = clinic_id));


--
-- TOC entry 4735 (class 3256 OID 30863)
-- Name: clinic_expenses Prevent hard delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Prevent hard delete" ON public.clinic_expenses FOR DELETE TO authenticated USING (false);


--
-- TOC entry 4729 (class 3256 OID 29671)
-- Name: clinic_settings Super Admins have full access.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super Admins have full access." ON public.clinic_settings USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ('SUPER_ADMIN'::text = ANY (profiles.roles)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ('SUPER_ADMIN'::text = ANY (profiles.roles))))));


--
-- TOC entry 4718 (class 3256 OID 26281)
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- TOC entry 4713 (class 3256 OID 26257)
-- Name: profiles admin_full_access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY admin_full_access ON public.profiles USING (('admin'::text = ANY (public.get_my_roles())));


--
-- TOC entry 4694 (class 0 OID 24569)
-- Dependencies: 411
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4702 (class 3256 OID 26248)
-- Name: appointments appointments_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY appointments_clinic_isolation ON public.appointments USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4679 (class 0 OID 18003)
-- Dependencies: 389
-- Name: campaigns; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4698 (class 0 OID 29649)
-- Dependencies: 434
-- Name: clinic_api_credentials; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clinic_api_credentials ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4699 (class 0 OID 30843)
-- Dependencies: 436
-- Name: clinic_expenses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clinic_expenses ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4696 (class 0 OID 24670)
-- Dependencies: 415
-- Name: clinic_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4684 (class 0 OID 20638)
-- Dependencies: 394
-- Name: clinical_notes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4704 (class 3256 OID 26250)
-- Name: clinical_notes clinical_notes_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY clinical_notes_clinic_isolation ON public.clinical_notes USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4721 (class 3256 OID 28528)
-- Name: clinical_notes clinical_notes_delete_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY clinical_notes_delete_policy ON public.clinical_notes FOR DELETE USING (((clinic_id = public.get_my_clinic_id()) AND (doctor_id = auth.uid())));


--
-- TOC entry 4719 (class 3256 OID 28526)
-- Name: clinical_notes clinical_notes_insert_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY clinical_notes_insert_policy ON public.clinical_notes FOR INSERT WITH CHECK (((clinic_id = public.get_my_clinic_id()) AND (doctor_id = auth.uid())));


--
-- TOC entry 4720 (class 3256 OID 28527)
-- Name: clinical_notes clinical_notes_update_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY clinical_notes_update_policy ON public.clinical_notes FOR UPDATE USING (((clinic_id = public.get_my_clinic_id()) AND (doctor_id = auth.uid())));


--
-- TOC entry 4691 (class 0 OID 24522)
-- Dependencies: 408
-- Name: clinics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4690 (class 0 OID 23009)
-- Dependencies: 403
-- Name: communication_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4686 (class 0 OID 20758)
-- Dependencies: 396
-- Name: dicom_annotations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.dicom_annotations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4689 (class 0 OID 22994)
-- Dependencies: 402
-- Name: expenses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4710 (class 3256 OID 26254)
-- Name: expenses expenses_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY expenses_clinic_isolation ON public.expenses USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4697 (class 0 OID 24779)
-- Dependencies: 421
-- Name: inventory; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4709 (class 3256 OID 26253)
-- Name: inventory inventory_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY inventory_clinic_isolation ON public.inventory USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4682 (class 0 OID 20449)
-- Dependencies: 392
-- Name: lab; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lab ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4707 (class 3256 OID 26252)
-- Name: lab lab_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lab_clinic_isolation ON public.lab USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4680 (class 0 OID 18015)
-- Dependencies: 390
-- Name: marketing_leads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4712 (class 3256 OID 26256)
-- Name: menu_items menu_access_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY menu_access_policy ON public.menu_items FOR SELECT USING ((allowed_roles && public.get_my_roles()));


--
-- TOC entry 4687 (class 0 OID 21145)
-- Dependencies: 398
-- Name: menu_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4683 (class 0 OID 20524)
-- Dependencies: 393
-- Name: patient_files; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patient_files ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4693 (class 0 OID 24552)
-- Dependencies: 410
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4703 (class 3256 OID 26249)
-- Name: patients patients_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY patients_clinic_isolation ON public.patients USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4685 (class 0 OID 20678)
-- Dependencies: 395
-- Name: prescriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4692 (class 0 OID 24536)
-- Dependencies: 409
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4700 (class 3256 OID 26246)
-- Name: profiles profiles_select_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_select_policy ON public.profiles FOR SELECT USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4701 (class 3256 OID 26247)
-- Name: profiles profiles_update_self; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- TOC entry 4688 (class 0 OID 22976)
-- Dependencies: 401
-- Name: staff_availability; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4681 (class 0 OID 18084)
-- Dependencies: 391
-- Name: tasks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4677 (class 0 OID 17592)
-- Dependencies: 386
-- Name: teeth_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.teeth_records ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4695 (class 0 OID 24594)
-- Dependencies: 412
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4706 (class 3256 OID 26251)
-- Name: transactions transactions_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY transactions_clinic_isolation ON public.transactions USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4711 (class 3256 OID 26255)
-- Name: treatment_plans treatment_plans_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY treatment_plans_clinic_isolation ON public.treatment_plans USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4678 (class 0 OID 17927)
-- Dependencies: 388
-- Name: treatments_catalog; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.treatments_catalog ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4726 (class 3256 OID 27412)
-- Name: treatments_catalog treatments_catalog_clinic_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY treatments_catalog_clinic_isolation ON public.treatments_catalog FOR SELECT USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4716 (class 3256 OID 28520)
-- Name: treatments_catalog treatments_catalog_delete_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY treatments_catalog_delete_policy ON public.treatments_catalog FOR DELETE USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4714 (class 3256 OID 28518)
-- Name: treatments_catalog treatments_catalog_insert_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY treatments_catalog_insert_policy ON public.treatments_catalog FOR INSERT WITH CHECK ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4715 (class 3256 OID 28519)
-- Name: treatments_catalog treatments_catalog_update_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY treatments_catalog_update_policy ON public.treatments_catalog FOR UPDATE USING ((clinic_id = public.get_my_clinic_id()));


--
-- TOC entry 4673 (class 0 OID 17392)
-- Dependencies: 382
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4708 (class 3256 OID 21123)
-- Name: objects Profil Fotoları Herkese Açık; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Profil Fotoları Herkese Açık" ON storage.objects FOR SELECT USING ((bucket_id = 'doctor-profiles'::text));


--
-- TOC entry 4705 (class 3256 OID 20590)
-- Name: objects Public Access to Patient Files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Access to Patient Files" ON storage.objects USING ((bucket_id = 'patient-files'::text)) WITH CHECK ((bucket_id = 'patient-files'::text));


--
-- TOC entry 4668 (class 0 OID 17147)
-- Dependencies: 376
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4674 (class 0 OID 17420)
-- Dependencies: 383
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4675 (class 0 OID 17447)
-- Dependencies: 384
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4667 (class 0 OID 17138)
-- Dependencies: 375
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4669 (class 0 OID 17157)
-- Dependencies: 377
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4672 (class 0 OID 17350)
-- Dependencies: 381
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4670 (class 0 OID 17287)
-- Dependencies: 379
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4671 (class 0 OID 17301)
-- Dependencies: 380
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4676 (class 0 OID 17457)
-- Dependencies: 385
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4736 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 4822 (class 0 OID 0)
-- Dependencies: 37
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 4823 (class 0 OID 0)
-- Dependencies: 23
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 39
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 38
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 32
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 4834 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 4835 (class 0 OID 0)
-- Dependencies: 564
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 4837 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 4839 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 4840 (class 0 OID 0)
-- Dependencies: 495
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 526
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 516
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 4843 (class 0 OID 0)
-- Dependencies: 505
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 4844 (class 0 OID 0)
-- Dependencies: 506
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4845 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4846 (class 0 OID 0)
-- Dependencies: 544
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 519
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 523
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 447
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 581
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 4853 (class 0 OID 0)
-- Dependencies: 577
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 551
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 449
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 561
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 530
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 571
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 520
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 482
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 476
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 552
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 555
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 567
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 563
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 485
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 547
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 549
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 488
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 553
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 548
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 580
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 502
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 557
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 576
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 566
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 545
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 534
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 517
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 559
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 511
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 518
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 560
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 536
-- Name: FUNCTION check_appointment_validity(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_appointment_validity() TO anon;
GRANT ALL ON FUNCTION public.check_appointment_validity() TO authenticated;
GRANT ALL ON FUNCTION public.check_appointment_validity() TO service_role;


--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 483
-- Name: FUNCTION fn_auto_create_purchase_order(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_auto_create_purchase_order() TO anon;
GRANT ALL ON FUNCTION public.fn_auto_create_purchase_order() TO authenticated;
GRANT ALL ON FUNCTION public.fn_auto_create_purchase_order() TO service_role;


--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 562
-- Name: FUNCTION fn_create_notification_from_template(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_create_notification_from_template() TO anon;
GRANT ALL ON FUNCTION public.fn_create_notification_from_template() TO authenticated;
GRANT ALL ON FUNCTION public.fn_create_notification_from_template() TO service_role;


--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 498
-- Name: FUNCTION fn_create_notification_on_resolve(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_create_notification_on_resolve() TO anon;
GRANT ALL ON FUNCTION public.fn_create_notification_on_resolve() TO authenticated;
GRANT ALL ON FUNCTION public.fn_create_notification_on_resolve() TO service_role;


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 497
-- Name: FUNCTION fn_log_data_changes(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_log_data_changes() TO anon;
GRANT ALL ON FUNCTION public.fn_log_data_changes() TO authenticated;
GRANT ALL ON FUNCTION public.fn_log_data_changes() TO service_role;


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 486
-- Name: FUNCTION fn_sync_patient_balance(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_sync_patient_balance() TO anon;
GRANT ALL ON FUNCTION public.fn_sync_patient_balance() TO authenticated;
GRANT ALL ON FUNCTION public.fn_sync_patient_balance() TO service_role;


--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 531
-- Name: FUNCTION fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid) TO anon;
GRANT ALL ON FUNCTION public.fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.fn_transfer_patient_to_new_doctor(p_patient_id uuid, p_new_doctor_id uuid) TO service_role;


--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION fn_update_status_on_admin_response(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.fn_update_status_on_admin_response() TO anon;
GRANT ALL ON FUNCTION public.fn_update_status_on_admin_response() TO authenticated;
GRANT ALL ON FUNCTION public.fn_update_status_on_admin_response() TO service_role;


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION get_my_clinic_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_my_clinic_id() TO anon;
GRANT ALL ON FUNCTION public.get_my_clinic_id() TO authenticated;
GRANT ALL ON FUNCTION public.get_my_clinic_id() TO service_role;


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 533
-- Name: FUNCTION get_my_roles(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_my_roles() TO anon;
GRANT ALL ON FUNCTION public.get_my_roles() TO authenticated;
GRANT ALL ON FUNCTION public.get_my_roles() TO service_role;


--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION get_user_context(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_context() TO anon;
GRANT ALL ON FUNCTION public.get_user_context() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_context() TO service_role;


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 527
-- Name: FUNCTION get_user_data(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_data() TO anon;
GRANT ALL ON FUNCTION public.get_user_data() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_data() TO service_role;


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION handle_new_clinic(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_clinic() TO anon;
GRANT ALL ON FUNCTION public.handle_new_clinic() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_clinic() TO service_role;


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 503
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 500
-- Name: FUNCTION is_super_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_super_admin() TO anon;
GRANT ALL ON FUNCTION public.is_super_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_super_admin() TO service_role;


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION log_audit_event(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_audit_event() TO anon;
GRANT ALL ON FUNCTION public.log_audit_event() TO authenticated;
GRANT ALL ON FUNCTION public.log_audit_event() TO service_role;


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer) TO anon;
GRANT ALL ON FUNCTION public.log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.log_sensitive_data_view(p_user_id uuid, p_table_name text, p_record_id uuid, p_clinic_id integer) TO service_role;


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 543
-- Name: FUNCTION process_inventory_transfer(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.process_inventory_transfer() TO anon;
GRANT ALL ON FUNCTION public.process_inventory_transfer() TO authenticated;
GRANT ALL ON FUNCTION public.process_inventory_transfer() TO service_role;


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 484
-- Name: FUNCTION sync_staff_role_to_profile(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sync_staff_role_to_profile() TO anon;
GRANT ALL ON FUNCTION public.sync_staff_role_to_profile() TO authenticated;
GRANT ALL ON FUNCTION public.sync_staff_role_to_profile() TO service_role;


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 437
-- Name: FUNCTION update_inventory_stock(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_inventory_stock() TO anon;
GRANT ALL ON FUNCTION public.update_inventory_stock() TO authenticated;
GRANT ALL ON FUNCTION public.update_inventory_stock() TO service_role;


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 465
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 538
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 510
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 540
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 509
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 501
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 532
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 521
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 515
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 542
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 494
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 347
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 411
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.appointments TO anon;
GRANT ALL ON TABLE public.appointments TO authenticated;
GRANT ALL ON TABLE public.appointments TO service_role;


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE campaigns; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.campaigns TO anon;
GRANT ALL ON TABLE public.campaigns TO authenticated;
GRANT ALL ON TABLE public.campaigns TO service_role;


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 434
-- Name: TABLE clinic_api_credentials; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinic_api_credentials TO anon;
GRANT ALL ON TABLE public.clinic_api_credentials TO authenticated;
GRANT ALL ON TABLE public.clinic_api_credentials TO service_role;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 436
-- Name: TABLE clinic_expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinic_expenses TO anon;
GRANT ALL ON TABLE public.clinic_expenses TO authenticated;
GRANT ALL ON TABLE public.clinic_expenses TO service_role;


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 435
-- Name: SEQUENCE clinic_expenses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.clinic_expenses_id_seq TO anon;
GRANT ALL ON SEQUENCE public.clinic_expenses_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.clinic_expenses_id_seq TO service_role;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 415
-- Name: TABLE clinic_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinic_settings TO anon;
GRANT ALL ON TABLE public.clinic_settings TO authenticated;
GRANT ALL ON TABLE public.clinic_settings TO service_role;


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 416
-- Name: TABLE clinic_working_hours; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinic_working_hours TO anon;
GRANT ALL ON TABLE public.clinic_working_hours TO authenticated;
GRANT ALL ON TABLE public.clinic_working_hours TO service_role;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 394
-- Name: TABLE clinical_notes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinical_notes TO anon;
GRANT ALL ON TABLE public.clinical_notes TO authenticated;
GRANT ALL ON TABLE public.clinical_notes TO service_role;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 408
-- Name: TABLE clinics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinics TO anon;
GRANT ALL ON TABLE public.clinics TO authenticated;
GRANT ALL ON TABLE public.clinics TO service_role;


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 403
-- Name: TABLE communication_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.communication_logs TO anon;
GRANT ALL ON TABLE public.communication_logs TO authenticated;
GRANT ALL ON TABLE public.communication_logs TO service_role;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE dicom_annotations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.dicom_annotations TO anon;
GRANT ALL ON TABLE public.dicom_annotations TO authenticated;
GRANT ALL ON TABLE public.dicom_annotations TO service_role;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 402
-- Name: TABLE expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expenses TO anon;
GRANT ALL ON TABLE public.expenses TO authenticated;
GRANT ALL ON TABLE public.expenses TO service_role;


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 428
-- Name: TABLE feedback_responses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.feedback_responses TO anon;
GRANT ALL ON TABLE public.feedback_responses TO authenticated;
GRANT ALL ON TABLE public.feedback_responses TO service_role;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 418
-- Name: TABLE form_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.form_submissions TO anon;
GRANT ALL ON TABLE public.form_submissions TO authenticated;
GRANT ALL ON TABLE public.form_submissions TO service_role;


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 417
-- Name: TABLE form_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.form_templates TO anon;
GRANT ALL ON TABLE public.form_templates TO authenticated;
GRANT ALL ON TABLE public.form_templates TO service_role;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 429
-- Name: TABLE integrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.integrations TO anon;
GRANT ALL ON TABLE public.integrations TO authenticated;
GRANT ALL ON TABLE public.integrations TO service_role;


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 421
-- Name: TABLE inventory; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory TO anon;
GRANT ALL ON TABLE public.inventory TO authenticated;
GRANT ALL ON TABLE public.inventory TO service_role;


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 422
-- Name: TABLE inventory_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_transactions TO anon;
GRANT ALL ON TABLE public.inventory_transactions TO authenticated;
GRANT ALL ON TABLE public.inventory_transactions TO service_role;


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 423
-- Name: TABLE inventory_transfers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_transfers TO anon;
GRANT ALL ON TABLE public.inventory_transfers TO authenticated;
GRANT ALL ON TABLE public.inventory_transfers TO service_role;


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE lab; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lab TO anon;
GRANT ALL ON TABLE public.lab TO authenticated;
GRANT ALL ON TABLE public.lab TO service_role;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE marketing_leads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.marketing_leads TO anon;
GRANT ALL ON TABLE public.marketing_leads TO authenticated;
GRANT ALL ON TABLE public.marketing_leads TO service_role;


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 405
-- Name: TABLE medical_conditions_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.medical_conditions_catalog TO anon;
GRANT ALL ON TABLE public.medical_conditions_catalog TO authenticated;
GRANT ALL ON TABLE public.medical_conditions_catalog TO service_role;


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 414
-- Name: TABLE medical_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.medical_records TO anon;
GRANT ALL ON TABLE public.medical_records TO authenticated;
GRANT ALL ON TABLE public.medical_records TO service_role;


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 398
-- Name: TABLE menu_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_items TO anon;
GRANT ALL ON TABLE public.menu_items TO authenticated;
GRANT ALL ON TABLE public.menu_items TO service_role;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 397
-- Name: SEQUENCE menu_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.menu_items_id_seq TO anon;
GRANT ALL ON SEQUENCE public.menu_items_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.menu_items_id_seq TO service_role;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 431
-- Name: TABLE notification_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_templates TO anon;
GRANT ALL ON TABLE public.notification_templates TO authenticated;
GRANT ALL ON TABLE public.notification_templates TO service_role;


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 430
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 419
-- Name: TABLE patient_consents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patient_consents TO anon;
GRANT ALL ON TABLE public.patient_consents TO authenticated;
GRANT ALL ON TABLE public.patient_consents TO service_role;


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 393
-- Name: TABLE patient_files; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patient_files TO anon;
GRANT ALL ON TABLE public.patient_files TO authenticated;
GRANT ALL ON TABLE public.patient_files TO service_role;


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 432
-- Name: TABLE patient_medical_conditions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patient_medical_conditions TO anon;
GRANT ALL ON TABLE public.patient_medical_conditions TO authenticated;
GRANT ALL ON TABLE public.patient_medical_conditions TO service_role;


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 410
-- Name: TABLE patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patients TO anon;
GRANT ALL ON TABLE public.patients TO authenticated;
GRANT ALL ON TABLE public.patients TO service_role;


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 395
-- Name: TABLE prescriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prescriptions TO anon;
GRANT ALL ON TABLE public.prescriptions TO authenticated;
GRANT ALL ON TABLE public.prescriptions TO service_role;


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 409
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 400
-- Name: TABLE saas_campaigns; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.saas_campaigns TO anon;
GRANT ALL ON TABLE public.saas_campaigns TO authenticated;
GRANT ALL ON TABLE public.saas_campaigns TO service_role;


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 399
-- Name: TABLE saas_packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.saas_packages TO anon;
GRANT ALL ON TABLE public.saas_packages TO authenticated;
GRANT ALL ON TABLE public.saas_packages TO service_role;


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 407
-- Name: TABLE saas_tenants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.saas_tenants TO anon;
GRANT ALL ON TABLE public.saas_tenants TO authenticated;
GRANT ALL ON TABLE public.saas_tenants TO service_role;


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 401
-- Name: TABLE staff_availability; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.staff_availability TO anon;
GRANT ALL ON TABLE public.staff_availability TO authenticated;
GRANT ALL ON TABLE public.staff_availability TO service_role;


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 420
-- Name: TABLE suppliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.suppliers TO anon;
GRANT ALL ON TABLE public.suppliers TO authenticated;
GRANT ALL ON TABLE public.suppliers TO service_role;


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 427
-- Name: TABLE system_feedback; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_feedback TO anon;
GRANT ALL ON TABLE public.system_feedback TO authenticated;
GRANT ALL ON TABLE public.system_feedback TO service_role;


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE tasks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE teeth_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teeth_records TO anon;
GRANT ALL ON TABLE public.teeth_records TO authenticated;
GRANT ALL ON TABLE public.teeth_records TO service_role;


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 406
-- Name: TABLE tenant_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tenant_settings TO anon;
GRANT ALL ON TABLE public.tenant_settings TO authenticated;
GRANT ALL ON TABLE public.tenant_settings TO service_role;


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 404
-- Name: TABLE tooth_conditions_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tooth_conditions_catalog TO anon;
GRANT ALL ON TABLE public.tooth_conditions_catalog TO authenticated;
GRANT ALL ON TABLE public.tooth_conditions_catalog TO service_role;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 412
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO anon;
GRANT ALL ON TABLE public.transactions TO authenticated;
GRANT ALL ON TABLE public.transactions TO service_role;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 413
-- Name: TABLE treatment_plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.treatment_plans TO anon;
GRANT ALL ON TABLE public.treatment_plans TO authenticated;
GRANT ALL ON TABLE public.treatment_plans TO service_role;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE treatments_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.treatments_catalog TO anon;
GRANT ALL ON TABLE public.treatments_catalog TO authenticated;
GRANT ALL ON TABLE public.treatments_catalog TO service_role;


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 424
-- Name: TABLE v_critical_stock_alerts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_critical_stock_alerts TO anon;
GRANT ALL ON TABLE public.v_critical_stock_alerts TO authenticated;
GRANT ALL ON TABLE public.v_critical_stock_alerts TO service_role;


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 425
-- Name: TABLE v_inventory_flow; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_inventory_flow TO anon;
GRANT ALL ON TABLE public.v_inventory_flow TO authenticated;
GRANT ALL ON TABLE public.v_inventory_flow TO service_role;


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 426
-- Name: TABLE v_patient_noshow_analysis; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_patient_noshow_analysis TO anon;
GRANT ALL ON TABLE public.v_patient_noshow_analysis TO authenticated;
GRANT ALL ON TABLE public.v_patient_noshow_analysis TO service_role;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 433
-- Name: TABLE v_tenant_admin_dashboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_tenant_admin_dashboard TO anon;
GRANT ALL ON TABLE public.v_tenant_admin_dashboard TO authenticated;
GRANT ALL ON TABLE public.v_tenant_admin_dashboard TO service_role;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 382
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 372
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 376
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 384
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 381
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 379
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 385
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2711 (class 826 OID 16553)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2712 (class 826 OID 16554)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2710 (class 826 OID 16552)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2721 (class 826 OID 16632)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2720 (class 826 OID 16631)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2719 (class 826 OID 16630)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2724 (class 826 OID 16587)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2723 (class 826 OID 16586)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2722 (class 826 OID 16585)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2716 (class 826 OID 16567)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2718 (class 826 OID 16566)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2717 (class 826 OID 16565)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2703 (class 826 OID 16490)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2704 (class 826 OID 16491)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2702 (class 826 OID 16489)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2706 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2701 (class 826 OID 16488)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2705 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2714 (class 826 OID 16557)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2715 (class 826 OID 16558)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2713 (class 826 OID 16556)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2709 (class 826 OID 16546)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2708 (class 826 OID 16545)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2707 (class 826 OID 16544)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3892 (class 3466 OID 16571)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 3897 (class 3466 OID 16650)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 3891 (class 3466 OID 16569)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 3898 (class 3466 OID 16653)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 3893 (class 3466 OID 16572)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 3894 (class 3466 OID 16573)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2025-12-27 12:15:03

--
-- PostgreSQL database dump complete
--

