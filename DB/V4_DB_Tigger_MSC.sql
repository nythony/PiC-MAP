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