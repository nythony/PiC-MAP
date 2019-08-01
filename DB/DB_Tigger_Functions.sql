/* Create Default ChatRoom for Project initiating */


CREATE OR REPLACE FUNCTION Default_ChatRoom_Project() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        "ChatRoom"("Project_ID","ChatName","ChatDesc", "ChatRoomType")
        VALUES(NEW."Project_ID", 'General', NEW."ProjectName", 0);
	RAISE NOTICE 'New Chat Room created associate with Project: %', NEW."ProjectName";
           RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER Default_ChatRoom_Project()
     AFTER INSERT ON "Project"
     FOR EACH ROW
     EXECUTE PROCEDURE Default_ChatRoom_Project();

/*Check User and Password */

Create or replace function user_pass_match(
	user_name_arg VARCHAR(255),
	user_pass_arg VARCHAR(255)
)
RETURNS INTEGER AS
$func$
DECLARE
match_or_not_arg INTEGER;
BEGIN
/* Find if user exist 2 for exist but not match*/
select 2 into match_or_not_arg
where EXISTS(
    select true
    from "User"
    where "UserName" = user_name_arg
     );
/* Check if match: 1 stand for match */
IF match_or_not_arg = 2 THEN 
	select 1 into match_or_not_arg
	where EXISTS(
    select true
    from "User"
    where "UserName" = user_name_arg AND "Password" = user_pass_arg
     );
	 IF match_or_not_arg IS NULL THEN
	 match_or_not_arg := 2;
	 END IF;
/* Return 3 for user not exists */	 
	ELSE
	select 3 into match_or_not_arg;
   END IF;
   
RETURN match_or_not_arg;
END
$func$  LANGUAGE plpgsql;









/* Check NULL values NOT ON DB YET JUL 13*/

CREATE OR REPLACE FUNCTION enforce_project_T() RETURNS TRIGGER AS
$BODY$
BEGIN

/* join tables to find Users and related project on with it's related tasks */

IF (
SELECT *
FROM "AttachUserP" AS t1
LEFT JOIN "TaskTool" AS t2
ON t1."Project_ID" = t2."Project_ID"
FULL JOIN "Task" AS t3
ON t2."Task_ID" = t3 ."Task_ID"
WHERE t1."User_ID" = NEW."User_ID" AND
t2."Project_ID" = NEW."Project_ID"
) IS NULL THEN
RAISE EXCEPTION 'User is not attached to the project for inserting on related entity'
END IF;
RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER enforce_project_T()
BEFORE INSERT ON "AttachUserT"
FOR EACH ROW
EXECUTE PROCEDURE enforece_project();

/* Attach User when creating Project ON DB JUL24 */
CREATE OR REPLACE FUNCTION attach_default_project() RETURNS TRIGGER AS
$BODY$
BEGIN

/* join tables to find Users and related project attachment */
IF NEW."UserCreate" IS NOT NULL THEN
IF NOT EXISTS (
SELECT
FROM "AttachUserP" AS t1
LEFT JOIN "Project" AS t2
ON t1."Project_ID" = t2."Project_ID"
WHERE t1."User_ID" = NEW."UserCreate" AND
t2."Project_ID" = NEW."Project_ID"
) THEN
INSERT INTO
"AttachUserP"("User_ID", "Project_ID")
VALUES(NEW."UserCreate",NEW."Project_ID");
END IF;
END IF;

RETURN NEW;
END;
$BODY$
language plpgsql;

CREATE TRIGGER attach_default_project
AFTER INSERT OR UPDATE
ON public."Project"
FOR EACH ROW
EXECUTE PROCEDURE public.attach_default_project();


/* Check Due Date<Start Date ON DB JUL28 */

CREATE OR REPLACE FUNCTION check_due_date() RETURNS TRIGGER AS
$BODY$
DECLARE
cursor1 timestamp;
BEGIN

/* join tables to find Users and related project attachment */
IF NEW."StartDate" IS NOT NULL THEN

IF NEW."DueDate" IS NOT NULL THEN
IF NEW."DueDate" <= NEW."StartDate" THEN
NEW."DueDate" := NEW."StartDate";
RAISE NOTICE 'Due Date is earlier than Start Date, replacing with Start Date %', NEW."StartDate";
END IF;
END IF;

ELSE

IF NEW."DueDate" <= NEW."StartDate" THEN
SELECT "StartDate" INTO cursor1
FROM "Project"
WHERE "Project_ID" = NEW."Project_ID";
NEW."DueDate" := cursor1;
RAISE NOTICE 'Due Date is earlier than Start Date, replacing with Start Date %', cursor1;
END IF;


END IF;

RETURN NEW;
END;
$BODY$
language plpgsql;


-- Trigger: check_due_date

-- DROP TRIGGER check_due_date ON public."Project";

CREATE TRIGGER check_due_date
BEFORE INSERT OR UPDATE
ON public."Project"
FOR EACH ROW
EXECUTE PROCEDURE public.check_due_date();


/* AUG 1 Due date checks on Issues, Req, and Task */
CREATE OR REPLACE FUNCTION check_due_date_I() RETURNS TRIGGER AS
$BODY$
DECLARE
cursor1 timestamp;
BEGIN

IF NEW."DueDate" IS NOT NULL THEN
/* find StartDate */
SELECT "StartDate" into cursor1
FROM "Project" as t1
LEFT JOIN "Issue" as t2 ON
t1."Project_ID" = t2."Project_ID"
WHERE t2."Issue_ID" = NEW."Issue_ID";

IF NEW."DueDate" <= cursor1 THEN
NEW."DueDate" := cursor1;
RAISE NOTICE 'Due Date is earlier than Start Date, replacing with Start Date %', cursor1;
END IF;

END IF;
RETURN NEW;
END;
$BODY$
language plpgsql;



-- Trigger: check_due_date

-- DROP TRIGGER check_due_date ON public."Project";

CREATE TRIGGER check_due_date_I
BEFORE INSERT OR UPDATE
ON public."Issue"
FOR EACH ROW
EXECUTE PROCEDURE public.check_due_date_I();



/* Req */
CREATE OR REPLACE FUNCTION check_due_date_R() RETURNS TRIGGER AS
$BODY$
DECLARE
cursor1 timestamp;
BEGIN

IF NEW."DueDate" IS NOT NULL THEN
/* find StartDate */
SELECT "StartDate" into cursor1
FROM "Project" as t1
LEFT JOIN "Requirement" as t2 ON
t1."Project_ID" = t2."Project_ID"
WHERE t2."Req_ID" = NEW."Req_ID";

IF NEW."DueDate" <= cursor1 THEN
NEW."DueDate" := cursor1;
RAISE NOTICE 'Due Date is earlier than Start Date, replacing with Start Date %', cursor1;
END IF;

END IF;
RETURN NEW;
END;
$BODY$
language plpgsql;


-- Trigger: check_due_date

-- DROP TRIGGER check_due_date ON public."Project";

CREATE TRIGGER check_due_date_R
BEFORE INSERT OR UPDATE
ON public."Requirement"
FOR EACH ROW
EXECUTE PROCEDURE public.check_due_date_R();

/* Task */
CREATE OR REPLACE FUNCTION check_due_date_T() RETURNS TRIGGER AS
$BODY$
DECLARE
cursor1 timestamp;
BEGIN

IF NEW."DueDate" IS NOT NULL THEN
/* find StartDate */
SELECT "StartDate" into cursor1
FROM "Project" as t1
LEFT JOIN "TaskTool" as t2 ON
t1."Project_ID" = t2."Project_ID"
LEFT JOIN "Task" as t3 ON
t2."TaskTool_ID" = t3."TaskTool_ID"
WHERE t3."Task_ID" = NEW."Task_ID";

IF NEW."DueDate" <= cursor1 THEN
NEW."DueDate" := cursor1;
RAISE NOTICE 'Due Date is earlier than Start Date, replacing with Start Date %', cursor1;
END IF;

END IF;
RETURN NEW;
END;
$BODY$
language plpgsql;



-- Trigger: check_due_date

-- DROP TRIGGER check_due_date ON public."Project";

CREATE TRIGGER check_due_date_T
BEFORE INSERT OR UPDATE
ON public."Task"
FOR EACH ROW
EXECUTE PROCEDURE public.check_due_date_T();



