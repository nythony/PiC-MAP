CREATE TABLE "Project" (
  "Project_ID" SERIAL,
  "ProjectName" VARCHAR(255) DEFAULT 'Project Rename',
  "ProjectDesc" VARCHAR(255) DEFAULT 'Default Project Description',
  "UserCreate" INTEGER,
CONSTRAINT "Project_ID_PK" PRIMARY KEY ( "Project_ID" )
);

CREATE TABLE "User" (
  "User_ID" SERIAL,
  "UserName" VARCHAR(255),
  "UserEmail" VARCHAR(255),
  "Password" VARCHAR(255) NOT NULL,
  "UserFname" VARCHAR(255),
  "UserLname" VARCHAR(255),
  "Title" VARCHAR(255),
CONSTRAINT "User_ID_PK" PRIMARY KEY ( "User_ID" )
);

CREATE TABLE "Task" (
  "Task_ID" SERIAL,
  "Priority" INTEGER DEFAULT 1,
  "TaskName" VARCHAR(255) DEFAULT 'Task Rename',
  "TaskDesc" VARCHAR(255) DEFAULT 'Default Task Description',
  "DueDate" TIMESTAMP,
  "TaskCategory" INTEGER,
  "TasksLabel" INTEGER,
CONSTRAINT "Task_ID_PK" PRIMARY KEY ( "Task_ID" )
);

CREATE TABLE "Requirement" (
  "Req_ID" SERIAL,
  "Project_ID" INTEGER NOT NULL,
  "RequirementName" VARCHAR(255) DEFAULT 'Requirement Rename',
  "RequirementDesc" VARCHAR(255) DEFAULT 'Default Requirement Description',
  "RequirementCategrory" INTEGER,
  "RequirementLabel" INTEGER,
  "DueDate" TIMESTAMP,
CONSTRAINT "Req_ID_PK" PRIMARY KEY ( "Req_ID" )	
);

CREATE TABLE "Issue" (
  "Issue_ID" SERIAL,
  "Project_ID" INTEGER NOT NULL,
  "Priority" INTEGER,
  "IssueName" VARCHAR(255) DEFAULT 'Issue Rename',
  "IssueDesc" VARCHAR(255) DEFAULT 'Default Issue Description',
  "DueDate" TIMESTAMP,
  "IssueLabel" INTEGER,
  "IssueCategory" INTEGER,
CONSTRAINT "Issue_ID_PK" PRIMARY KEY ( "Issue_ID" )		
);



CREATE TABLE "ChatRoom" (
  "ChatRoom_ID" SERIAL,
  "Project_ID" INTEGER NOT NULL,
  "ChatName" VARCHAR(255) DEFAULT 'Chat Room Rename',
  "ChatRoomType" INTEGER NOT NULL,
  "ChatDesc" VARCHAR(255) DEFAULT 'Chat Room Description',
CONSTRAINT "ChatRoom_ID_PK" PRIMARY KEY ( "ChatRoom_ID" ),
CONSTRAINT "Project_ID_FK" FOREIGN KEY ("Project_ID")
REFERENCES "Project" ( "Project_ID" ) MATCH SIMPLE
);

CREATE TABLE "TaskTool" (
  "TaskTool_ID" SERIAL,
  "Project_ID " INTEGER NOT NULL,
  "TaskToolName" VARCHAR(255) DEFAULT 'Task_Rename',
CONSTRAINT "TaskTool_ID_PK" PRIMARY KEY ( "TaskTool_ID" )
);

CREATE TABLE "ChatMessage" (
  "ChatMessage_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "ChatRoom_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "Message" VARCHAR(255),
CONSTRAINT "ChatMessage_ID_PK" PRIMARY KEY ( "ChatMessage_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
 REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "ChatRoom_ID_FK" FOREIGN KEY ("ChatRoom_ID")
 REFERENCES "ChatRoom" ( "ChatRoom_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachCommentR" (
  "Comment_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Req_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Comment_ID_PK" PRIMARY KEY ( "Comment_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Req_ID_FK" FOREIGN KEY ("Req_ID")
REFERENCES "Requirement"( "Req_ID" ) MATCH SIMPLE	
);


CREATE TABLE "AttachCommentI" (
  "Comment_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Issue_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Comment_I_ID_PK" PRIMARY KEY ( "Comment_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
REFERENCES "Issue"( "Issue_ID" ) MATCH SIMPLE	
);

CREATE TABLE "AttachCommentT" (
  "Comment_ID" SERIAL NOT NULL,
  "User_ID" INTEGER NOT NULL,
  "Task_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Comment_T_ID_PK" PRIMARY KEY ( "Comment_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Task_ID_FK" FOREIGN KEY ("Task_ID")
REFERENCES "Task"( "Task_ID" ) MATCH SIMPLE	
);

CREATE TABLE "AttachStatusR" (
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "Req_ID" INTEGER,
  "Status" INTEGER,
CONSTRAINT "CPK_TIME_PK" PRIMARY KEY ( "Req_ID", "TimeStamp" ),
CONSTRAINT "Req_ID_FK" FOREIGN KEY ("Req_ID")
REFERENCES "Requirement" ( "Req_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachStatusI" (
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "Issue_ID" INTEGER,
  "Status" INTEGER,
CONSTRAINT "CPK_TIME_I_PK" PRIMARY KEY ( "Issue_ID", "TimeStamp" ),
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
REFERENCES "Issue" ( "Issue_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachStatusT" (
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "Task_ID" INTEGER,
  "Status" INTEGER,
CONSTRAINT "CPK_TIME_PK" PRIMARY KEY ( "Task_ID", "TimeStamp" ),
CONSTRAINT "Task_ID_FK" FOREIGN KEY ("Task_ID")
REFERENCES "Task_ID" ( "Task_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachUserR" (
  "Attach_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Req_ID" INTEGER NOT NULL,
  "Assigner_ID" INTEGER,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Attach_ID_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Req_ID_FK" FOREIGN KEY ("Req_ID")
REFERENCES "Requirement"( "Req_ID" ) MATCH SIMPLE
);

CREATE TABLE "JoinChatRoom" (
  "Join_ID" SERIAL,
  "ChatRoom_ID" INTEGER NOT NULL,
  "User_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Join_ID_PK" PRIMARY KEY ( "Join_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
 REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "ChatRoom_ID_FK" FOREIGN KEY ("ChatRoom_ID")
 REFERENCES "ChatRoom" ( "ChatRoom_ID" ) MATCH SIMPLE	
);

CREATE TABLE "AttachUserT" (
  "Attach_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Task_ID" INTEGER NOT NULL,
  "Assigner_ID" INTEGER,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Attach_ID_T_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Task_ID_FK" FOREIGN KEY ("Task_ID")
REFERENCES "Task"( "Task_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachUserI" (
  "Attach_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Issue_ID" INTEGER NOT NULL,
  "Assigner_ID" INTEGER,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Attach_ID_I_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Issue_ID_FK" FOREIGN KEY ("Issue_ID")
REFERENCES "Issue"( "Issue_ID" ) MATCH SIMPLE
);

CREATE TABLE "AttachUserP" (
  "Attach_ID" SERIAL,
  "User_ID" INTEGER NOT NULL,
  "Project_ID" INTEGER NOT NULL,
  "TimeStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT "Attach_ID_P_PK" PRIMARY KEY ( "Attach_ID" ),
CONSTRAINT "User_ID_FK" FOREIGN KEY ("User_ID")
REFERENCES "User"( "User_ID" ) MATCH SIMPLE,
CONSTRAINT "Project_ID_FK" FOREIGN KEY ("Project_ID")
REFERENCES "Project"( "Project_ID" ) MATCH SIMPLE
);


ALTER TABLE "Project"
ADD COLUMN "StartDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "DueDate" TIMESTAMP,
ADD COLUMN "Status" INTEGER
;


ALTER TABLE "AttachCommentR"
ADD COLUMN "Comment" VARCHAR(255);


ALTER TABLE "AttachCommentI"
ADD COLUMN "Comment" VARCHAR(255);


ALTER TABLE "AttachCommentT"
ADD COLUMN "Comment" VARCHAR(255);


ALTER TABLE "Task"
ADD COLUMN "TaskTool_ID" SERIAL NOT NULL,
ADD CONSTRAINT "TaskTool_ID_FK" FOREIGN KEY ("TaskTool_ID")
REFERENCES "TaskTool"( "TaskTool_ID" ) MATCH SIMPLE;


ALTER TABLE "Issue" ADD COLUMN "CreateDate" TIMESTAMP;
ALTER TABLE "Issue" ADD COLUMN "RootCause" VARCHAR(255);
ALTER TABLE "Issue" ADD COLUMN "Resolution" VARCHAR(255);
ALTER TABLE "Issue"
ALTER COLUMN "CreateDate" SET DEFAULT CURRENT_TIMESTAMP;

/* Update JUL 19*/
UPDATE "ChatMessage" SET "TimeStamp" = ("TimeStamp" AT TIME ZONE 'UTC') AT TIME ZONE 'EST';

ALTER TABLE "ChatMessage" ALTER COLUMN "TimeStamp" TYPE TIMESTAMP WITH TIME ZONE USING "TimeStamp" AT TIME ZONE 'America/New_York';

ALTER TABLE "AttachUserP" ADD CONSTRAINT "unique_attachP" UNIQUE ("User_ID", "Project_ID");

alter table "AttachUserP" alter column "User_ID" set NOT NULL;
alter table "AttachUserP" alter column "Project_ID" set NOT NULL;

ALTER TABLE "ChatMessage" ALTER COLUMN "Message" TYPE text;

CREATE TABLE "TaskCategory" (
  "TaskCategory" SERIAL ,
  "TaskTool_ID" INTEGER NOT NULL,
  "CategoryName" VARCHAR(255) NOT NULL,
CONSTRAINT "TaskCategory_PK" PRIMARY KEY ( "TaskCategory" ),
CONSTRAINT "TaskTool_ID_FK" FOREIGN KEY ("TaskTool_ID")
REFERENCES "TaskTool"( "TaskTool_ID" ) MATCH SIMPLE
);

ALTER TABLE "Task"
RENAME COLUMN "TaskCategory" TO "Category_ID";
ALTER TABLE "Task"
ALTER COLUMN "Category_ID" SET DEFAULT '1';


ALTER TABLE "TaskCategory"
RENAME COLUMN "TaskCategory" TO "Category_ID";

INSERT INTO "TaskCategory"("Category_ID", "CategoryName")
	VALUES ('1', 'To Do');
INSERT INTO "TaskCategory"("Category_ID", "CategoryName")
	VALUES ('2', 'Doing');	
INSERT INTO "TaskCategory"("Category_ID", "CategoryName")
	VALUES ('3', 'To Do');
	
ALTER TABLE "Task"
ADD CONSTRAINT "Category_FK" FOREIGN KEY ("Category_ID")
REFERENCES "TaskCategory"( "Category_ID" ) MATCH SIMPLE;

ALTER TABLE "Project"
ALTER COLUMN "DueDate" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Project"
ALTER COLUMN "DueDate" DROP DEFAULT;

ALTER TABLE "Project" ADD COLUMN "ProjectPassword" VARCHAR(255) DEFAULT '123';


ALTER TABLE public."TaskTool"
    ADD CONSTRAINT "Project_ID_FK" FOREIGN KEY ("Project_ID")
    REFERENCES public."Project" ("Project_ID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public."TaskTool"
   ALTER COLUMN "Project_ID" SET NOT NULL;


/* JUL 30 Update */

CREATE TABLE "IssueCategory" (
  "Category_ID" SERIAL ,
  "CategoryName" VARCHAR(255) NOT NULL,
CONSTRAINT "IssueCategory_PK" PRIMARY KEY ( "Category_ID" )
);

ALTER TABLE "Issue"
RENAME COLUMN "IssueCategory" TO "Category_ID";
ALTER TABLE "Issue"
ALTER COLUMN "Category_ID" SET DEFAULT '1';

INSERT INTO "IssueCategory"("Category_ID", "CategoryName")
	VALUES ('1', 'To Do');
INSERT INTO "IssueCategory"("Category_ID", "CategoryName")
	VALUES ('2', 'Doing');	
INSERT INTO "IssueCategory"("Category_ID", "CategoryName")
	VALUES ('3', 'To Do');
	
ALTER TABLE "Issue"
ADD CONSTRAINT "Category_FK" FOREIGN KEY ("Category_ID")
REFERENCES "IssueCategory"( "Category_ID" ) MATCH SIMPLE;


/* Cat for requirement */
CREATE TABLE "ReqCategory" (
  "Category_ID" SERIAL ,
  "CategoryName" VARCHAR(255) NOT NULL,
CONSTRAINT "ReqCategory_PK" PRIMARY KEY ( "Category_ID" )
);

ALTER TABLE "Requirement"
ADD COLUMN "Category_ID" INTEGER;
ALTER TABLE "Requirement"
ALTER COLUMN "Category_ID" SET DEFAULT '1';

INSERT INTO "ReqCategory"("Category_ID", "CategoryName")
	VALUES ('1', 'To Do');
INSERT INTO "ReqCategory"("Category_ID", "CategoryName")
	VALUES ('2', 'Doing');	
INSERT INTO "ReqCategory"("Category_ID", "CategoryName")
	VALUES ('3', 'To Do');
	
ALTER TABLE "Requirement"
ADD CONSTRAINT "Category_FK" FOREIGN KEY ("Category_ID")
REFERENCES "ReqCategory"( "Category_ID" ) MATCH SIMPLE;


ALTER TABLE public."User"
    ALTER COLUMN "UserName" SET NOT NULL;
	
ALTER TABLE public."User" ADD CONSTRAINT username_unique UNIQUE ("UserName");





