-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE TRIGGER registerState AFTER INSERT ON "peripheral" 
  FOR EACH ROW
  WHEN (NEW.p_type = 'valve' OR NEW.p_type='other')
  EXECUTE FUNCTION add_peripheral_state();