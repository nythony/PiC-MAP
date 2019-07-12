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
