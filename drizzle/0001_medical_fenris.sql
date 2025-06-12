-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION add_peripheral_state() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO peripheral_state (peripheral_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER registerState AFTER INSERT ON "peripheral" 
  FOR EACH ROW
  EXECUTE FUNCTION add_peripheral_state();


CREATE OR REPLACE FUNCTION update_module_last_seen() RETURNS TRIGGER AS $$
BEGIN
  UPDATE module SET last_seen = NEW.registered_at
  WHERE uuid = (SELECT uuid from module join peripheral ON peripheral.parent_module = module.uuid WHERE peripheral.id = NEW.peripheral_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER updateModuleTime AFTER INSERT ON "data"
  FOR EACH ROW
  EXECUTE FUNCTION update_module_last_seen();