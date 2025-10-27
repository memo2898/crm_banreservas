DO $$ 
DECLARE 
    r RECORD;
BEGIN

    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'crm_banco') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
END $$;