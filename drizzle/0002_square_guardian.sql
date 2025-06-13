-- Custom SQL migration file, put your code below! --
INSERT INTO "permission"("role_type") VALUES
  ('admin'),
  ('user'),
  ('guest');