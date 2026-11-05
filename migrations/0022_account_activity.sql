CREATE INDEX audit_actor_time ON audit_log(actor_id,created_at DESC);
CREATE INDEX audit_resource_time ON audit_log(resource_id,created_at DESC);
CREATE TRIGGER audit_successful_login AFTER INSERT ON auth_sessions
BEGIN
  INSERT INTO audit_log(id,actor_id,action,resource_id)
  VALUES(lower(hex(randomblob(16))),NEW.account_id,'auth.login',NEW.account_id);
END;
