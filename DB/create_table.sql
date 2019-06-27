CREATE TABLE "Attachment" (
  "File_ID" serial NOT NULL,
  "_issueAttachments" VARCHAR(255),
CONSTRAINT "File_ID_PK" PRIMARY KEY ("File_ID") 
);

CREATE TABLE "User" (
  "User_ID" SERIAL NOT NULL,
  "_UserName" VARCHAR(255),
  "UserFname" VARCHAR(255),
  "UserLname" VARCHAR(255),
  "_UserEmail" VARCHAR(255),
  "_Password" VARCHAR(255),
  "UserLoginToken" VARCHAR(255),
  "UserEmailAddr" VARCHAR(255),
  "Title" VARCHAR(255),
CONSTRAINT "User_ID_PK" PRIMARY KEY ( "User_ID" )
);

CREATE TABLE "ChatMessage" (
  "ChatMessage_ID" SERIAL NOT NULL,
  "User_ID" INTEGER,
  "ChatRoom_ID" INTEGER,
  "_timestamp" TIMESTAMP,
  "_message" VARCHAR(255),
CONSTRAINT "ChatMessage_ID_PK" PRIMARY KEY ( "ChatMessage_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
 REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "ChatRoom_ID_FK" FOREIGN KEY ("ChatRoom_ID")
 REFERENCES "ChatRoom" ( "ChatRoom_ID" ) MATCH SIMPLE
);


CREATE TABLE "JoinChatRoom" (
  "Assign_ID"  SERIAL NOT NULL,
  "User_ID" INTEGER,
  "ChatRoom_ID" INTEGER,
	"TimeStamp" TIMESTAMP,
CONSTRAINT "Assign_ID_PK" PRIMARY KEY ( "Assign_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
 REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "ChatRoom_ID_FK" FOREIGN KEY ("ChatRoom_ID")
 REFERENCES "ChatRoom" ( "ChatRoom_ID" ) MATCH SIMPLE	
);

CREATE TABLE "ChatRoom" (
  "ChatRoom_ID" SERIAL NOT NULL,
  "_TopicChatName" VARCHAR(255),
  "_ChatRoomType" VARCHAR(255),
  "_TopicChatDescription" VARCHAR(255),
CONSTRAINT "ChatRoom_ID_PK" PRIMARY KEY ( "ChatRoom_ID" )
);

CREATE TABLE "AttachStatus" (
  "Status_ID"  SERIAL NOT NULL,
  "Issue_ID" INTEGER,
  "_status" VARCHAR(255),
  "StatusName" VARCHAR(255),
  "Time" TIMESTAMP,
CONSTRAINT "Status_ID_PK" PRIMARY KEY ( "Status_ID" ),
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
 REFERENCES "Issue"( "Issue_ID" ) MATCH SIMPLE	
);

CREATE TABLE "Requirement" (
  "Requirement_ID" SERIAL NOT NULL,
  "_RequirementName" VARCHAR(255),
  "_RequirementDescription" VARCHAR(255),
  "_Categrory" VARCHAR(255),
  "_label" VARCHAR(255),
CONSTRAINT "Requirement_ID_PK" PRIMARY KEY ( "Requirement_ID" )	
);

CREATE TABLE "AttachUser" (
  "Attach_ID"  SERIAL NOT NULL,
  "Issue_ID" INTEGER,
  "Assign_To_User_ID" INTEGER,
  "Time_Assign" TIMESTAMP,
  "Time_Due" TIMESTAMP,
  "Assigner_ID" INTEGER,
CONSTRAINT "Attach_ID_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "Assign_To_User_ID_FK" FOREIGN KEY ("Assign_To_User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE	
);

CREATE TABLE "AssignProject" (
  "Join_ID" SERIAL NOT NULL,
  "Project_ID" INTEGER,
  "Member_ID" INTEGER,
  "Join_Date" TIMESTAMP,
CONSTRAINT "Join_ID_PK" PRIMARY KEY ( "Join_ID" ),
CONSTRAINT "Member_ID_FK" FOREIGN KEY ("Member_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Project_ID_FK" FOREIGN KEY ("Project_ID")
REFERENCES "Project"( "Project_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachComment" (
  "Comment_ID" SERIAL NOT NULL,
  "Issue_ID" INTEGER,
  "User_ID" INTEGER,
  "_Comment" VARCHAR(255),
  "_status" VARCHAR(255),
  "Time" TIMESTAMP,
CONSTRAINT "Comment_ID_PK" PRIMARY KEY ( "Comment_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
REFERENCES "Issue"( "Issue_ID" ) MATCH SIMPLE	
);

CREATE TABLE "Issue" (
  "Issue_ID" SERIAL NOT NULL,
  "File_ID" INTEGER,
  "_Priority" VARCHAR(255),
  "_IssueName" VARCHAR(255),
  "_IssueDescription" VARCHAR(255),
  "_DueDate" TIMESTAMP,
  "_IssueLable" VARCHAR(255),
  "_IssueCategory" VARCHAR(255),
  "_requirement" VARCHAR(255),
CONSTRAINT "Issue_ID_PK" PRIMARY KEY ( "Issue_ID" ),
CONSTRAINT "File_ID_FK" FOREIGN KEY ("File_ID")
REFERENCES "Attachment"( "File_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachRequirment" (
  "Attach_ID"   SERIAL NOT NULL,
  "Issue_ID" INTEGER,
  "Requirement_ID" INTEGER,
  "User_ID" INTEGER,
CONSTRAINT "Attach_ID_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "Requirement_ID_FK" FOREIGN KEY ("Requirement_ID")
REFERENCES "Requirement"( "Requirement_ID" ) MATCH SIMPLE,
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
REFERENCES "Issue"( "Issue_ID" ) MATCH SIMPLE
);

CREATE TABLE "Project" (
  "Project_ID" SERIAL NOT NULL,
  "_ProjectName" VARCHAR(255),
  "Team_Leader" VARCHAR(255),
CONSTRAINT "Project_ID_PK" PRIMARY KEY ( "Project_ID" )
);