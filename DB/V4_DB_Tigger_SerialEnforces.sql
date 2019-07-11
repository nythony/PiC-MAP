/* Project, User, Task, Issue */
CREATE OR REPLACE FUNCTION force_serial_id_U()
  RETURNS trigger AS
$func$
BEGIN
   NEW."User_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'User_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_U
before insert on "User"
for each row
execute procedure force_serial_id_U();


CREATE OR REPLACE FUNCTION force_serial_id_P()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Project_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Project_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_P
before insert on "Project"
for each row
execute procedure force_serial_id_P();


CREATE OR REPLACE FUNCTION force_serial_id_T()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Task_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Task_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_T
before insert on "Task"
for each row
execute procedure force_serial_id_T();

CREATE OR REPLACE FUNCTION force_serial_id_I()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Issue_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Issue_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_I
before insert on "Issue"
for each row
execute procedure force_serial_id_I();


CREATE OR REPLACE FUNCTION force_serial_id_R()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Req_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Req_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_R
before insert on "Requirement"
for each row
execute procedure force_serial_id_R();

/* all attach users */
CREATE OR REPLACE FUNCTION force_serial_id_A()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Attach_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Attach_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;


create trigger force_serial_id_AUI
before insert on "AttachUserI"
for each row
execute procedure force_serial_id_A();


create trigger force_serial_id_AUR
before insert on "AttachUserR"
for each row
execute procedure force_serial_id_A();

create trigger force_serial_id_AUP
before insert on "AttachUserP"
for each row
execute procedure force_serial_id_A();

create trigger force_serial_id_AUT
before insert on "AttachUserT"
for each row
execute procedure force_serial_id_A();


/* all attach comment */
CREATE OR REPLACE FUNCTION force_serial_id_C()
  RETURNS trigger AS
$func$
BEGIN
   NEW."Comment_ID" := nextval(pg_get_serial_sequence(quote_ident(TG_TABLE_NAME), 'Comment_ID'));
   RAISE NOTICE 'Explicit insert into serial ID: ID is now replaced by trigger with incremented value %', NEW."User_ID";
	RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE trigger force_serial_id_CT
before insert on "AttachCommentT"
for each row
execute procedure force_serial_id_C();

CREATE trigger force_serial_id_CI
before insert on "AttachCommentI"
for each row
execute procedure force_serial_id_C();

CREATE trigger force_serial_id_CR
before insert on "AttachCommentR"
for each row
execute procedure force_serial_id_R();


