-- Add USED value to KeyStatus enum (safe for shadow + prod)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'USED'
      AND enumtypid = 'keystatus'::regtype
  ) THEN
    ALTER TYPE "KeyStatus" ADD VALUE 'USED';
  END IF;
END
$$;
