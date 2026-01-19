-- Explain existing KeyStatus.USED enum value safely

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'USED'
      AND enumtypid = 'KeyStatus'::regtype
  ) THEN
    ALTER TYPE "KeyStatus" ADD VALUE 'USED';
  END IF;
END
$$;
