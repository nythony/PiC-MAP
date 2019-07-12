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

