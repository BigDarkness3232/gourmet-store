-- Agregar el nuevo valor al enum en una transacción separada
ALTER TYPE "Role" ADD VALUE 'CLIENTE';

-- Confirmar antes de usar el nuevo valor
COMMIT;

-- Cambiar el valor por defecto
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENTE';