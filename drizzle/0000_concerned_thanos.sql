CREATE TABLE "Budgets" (
	"BudgetID" serial PRIMARY KEY NOT NULL,
	"ItineraryID" integer NOT NULL,
	"Category" text NOT NULL,
	"PlannedAmountVND" numeric(18, 0) NOT NULL,
	"ActualAmountVND" numeric(18, 0),
	"TransactionDate" timestamp,
	"Notes" text
);
--> statement-breakpoint
CREATE TABLE "ChatParticipants" (
	"ChatParticipantID" serial PRIMARY KEY NOT NULL,
	"ChatID" integer NOT NULL,
	"UserID" integer NOT NULL,
	"JoinedDate" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Unique_ChatID_UserID" UNIQUE("ChatID","UserID")
);
--> statement-breakpoint
CREATE TABLE "Chats" (
	"ChatID" serial PRIMARY KEY NOT NULL,
	"ChatName" text,
	"IsGroupChat" boolean DEFAULT false,
	"CreationDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Comments" (
	"CommentID" serial PRIMARY KEY NOT NULL,
	"PostID" integer NOT NULL,
	"UserID" integer NOT NULL,
	"Content" text,
	"CommentDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Destinations" (
	"DestinationID" serial PRIMARY KEY NOT NULL,
	"Name" text NOT NULL,
	"CityProvince" text NOT NULL,
	"Description" text,
	"Rate" numeric(18, 1),
	"Image" text,
	"KeyMain" text,
	"EntranceFee" numeric(18, 0),
	"AccommodationCost" numeric(18, 0),
	"TotalTourCost" numeric(18, 0),
	"TourPricePerPerson" numeric(18, 0)
);
--> statement-breakpoint
CREATE TABLE "GuideApplications" (
	"ApplicationID" serial PRIMARY KEY NOT NULL,
	"GuideID" integer NOT NULL,
	"PostID" integer NOT NULL,
	"Status" text DEFAULT 'Pending',
	"Message" text,
	"ProposedPriceVND" numeric(18, 0),
	"AppliedDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Itineraries" (
	"ItineraryID" serial PRIMARY KEY NOT NULL,
	"UserID" integer NOT NULL,
	"TripName" text NOT NULL,
	"StartDate" timestamp NOT NULL,
	"EndDate" timestamp NOT NULL,
	"TotalBudgetEstimatedVND" numeric(18, 0),
	"Status" text DEFAULT 'Planned'
);
--> statement-breakpoint
CREATE TABLE "ItineraryDetails" (
	"DetailID" serial PRIMARY KEY NOT NULL,
	"ItineraryID" integer NOT NULL,
	"DestinationID" integer NOT NULL,
	"DayNumber" integer NOT NULL,
	"TimeSlot" text,
	"ActivityDescription" text,
	"EstimatedCostVND" numeric(18, 0)
);
--> statement-breakpoint
CREATE TABLE "Messages" (
	"MessageID" bigserial PRIMARY KEY NOT NULL,
	"ChatID" integer NOT NULL,
	"SenderID" integer NOT NULL,
	"Content" text,
	"SentDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "PostLikes" (
	"UserID" integer NOT NULL,
	"PostID" integer NOT NULL,
	"LikedDate" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "PostLikes_UserID_PostID_pk" PRIMARY KEY("UserID","PostID")
);
--> statement-breakpoint
CREATE TABLE "Posts" (
	"PostID" serial PRIMARY KEY NOT NULL,
	"UserID" integer NOT NULL,
	"ItineraryID" integer,
	"PostType" text NOT NULL,
	"Title" text NOT NULL,
	"Content" text,
	"LikesCount" integer DEFAULT 0,
	"IsHidden" boolean DEFAULT false,
	"CreationDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Reports" (
	"ReportID" serial PRIMARY KEY NOT NULL,
	"PostID" integer NOT NULL,
	"ReporterID" integer NOT NULL,
	"Reason" text NOT NULL,
	"Status" text DEFAULT 'Pending',
	"ReportDate" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "TourBookings" (
	"BookingID" serial PRIMARY KEY NOT NULL,
	"UserID" integer NOT NULL,
	"TourID" integer NOT NULL,
	"TourTitle" text NOT NULL,
	"Destination" text NOT NULL,
	"ImageUrl" text,
	"DepartureDate" timestamp NOT NULL,
	"FullName" text NOT NULL,
	"Phone" text NOT NULL,
	"Email" text,
	"Notes" text,
	"Guests" integer NOT NULL,
	"TotalPriceVND" numeric(18, 2) NOT NULL,
	"BookingDate" timestamp DEFAULT CURRENT_TIMESTAMP,
	"Status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TourGuideProfiles" (
	"ProfileID" serial PRIMARY KEY NOT NULL,
	"UserID" integer NOT NULL,
	"DateOfBirth" timestamp,
	"Gender" varchar(20),
	"Phone" varchar(20),
	"Address" varchar(255),
	"Experience" varchar(20),
	"Languages" varchar(255),
	"Locations" varchar(500),
	"Bio" varchar(1000),
	"TourCategories" varchar(500),
	"IdFrontUrl" varchar(500),
	"IdBackUrl" varchar(500),
	"CertUrl" varchar(500),
	"GuideAvatarUrl" varchar(500),
	"IsVerified" varchar(20) DEFAULT 'Pending',
	"AdminNote" varchar(1000),
	"CreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Tours" (
	"TourID" serial PRIMARY KEY NOT NULL,
	"Title" varchar(255) NOT NULL,
	"Destination" varchar(100) NOT NULL,
	"DepartureLocation" varchar(100) NOT NULL,
	"DepartureDate" timestamp NOT NULL,
	"DurationDays" integer NOT NULL,
	"DurationText" varchar(50),
	"PriceVND" numeric(18, 2) NOT NULL,
	"ImageUrl" text,
	"Description" text,
	"NumberOfBookings" integer DEFAULT 0,
	"ProviderID" integer
);
--> statement-breakpoint
CREATE TABLE "TravelCompanions" (
	"CompanionID" serial PRIMARY KEY NOT NULL,
	"PostID" integer,
	"RequesterID" integer NOT NULL,
	"ReceiverID" integer NOT NULL,
	"Status" text DEFAULT 'Pending',
	"DateRequested" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "UserPreferences" (
	"PreferenceID" serial PRIMARY KEY NOT NULL,
	"UserID" integer NOT NULL,
	"PreferredBudgetVND" numeric(18, 0),
	"TravelStyle" text,
	"FavoriteActivities" text,
	"MaxDurationDays" integer,
	"PreferredDestinations" text
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"UserID" serial PRIMARY KEY NOT NULL,
	"Username" varchar(50) NOT NULL,
	"Email" varchar(100) NOT NULL,
	"PasswordHash" varchar(255),
	"GoogleID" varchar(100),
	"AvatarURL" varchar(500),
	"FullName" varchar(100),
	"DateOfBirth" timestamp,
	"StudentCode" varchar(20),
	"Gender" varchar(10),
	"RefreshToken" varchar(255),
	"RefreshTokenExpiryTime" timestamp,
	"RegistrationDate" timestamp DEFAULT CURRENT_TIMESTAMP,
	"LastOnline" timestamp,
	"Role" varchar(20) DEFAULT 'Customer',
	"IsPremium" boolean DEFAULT false,
	"PremiumExpiryDate" timestamp,
	"IsBlocked" boolean DEFAULT false,
	"AiGenerationCount" integer DEFAULT 0,
	"LastAiGenerationDate" timestamp,
	"TravelPoints" integer DEFAULT 0,
	"UserCode" varchar(20),
	CONSTRAINT "Users_Username_unique" UNIQUE("Username"),
	CONSTRAINT "Users_Email_unique" UNIQUE("Email")
);
--> statement-breakpoint
ALTER TABLE "Budgets" ADD CONSTRAINT "Budgets_ItineraryID_Itineraries_ItineraryID_fk" FOREIGN KEY ("ItineraryID") REFERENCES "public"."Itineraries"("ItineraryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatParticipants" ADD CONSTRAINT "ChatParticipants_ChatID_Chats_ChatID_fk" FOREIGN KEY ("ChatID") REFERENCES "public"."Chats"("ChatID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChatParticipants" ADD CONSTRAINT "ChatParticipants_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_PostID_Posts_PostID_fk" FOREIGN KEY ("PostID") REFERENCES "public"."Posts"("PostID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GuideApplications" ADD CONSTRAINT "GuideApplications_GuideID_Users_UserID_fk" FOREIGN KEY ("GuideID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GuideApplications" ADD CONSTRAINT "GuideApplications_PostID_Posts_PostID_fk" FOREIGN KEY ("PostID") REFERENCES "public"."Posts"("PostID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Itineraries" ADD CONSTRAINT "Itineraries_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ItineraryDetails" ADD CONSTRAINT "ItineraryDetails_ItineraryID_Itineraries_ItineraryID_fk" FOREIGN KEY ("ItineraryID") REFERENCES "public"."Itineraries"("ItineraryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ItineraryDetails" ADD CONSTRAINT "ItineraryDetails_DestinationID_Destinations_DestinationID_fk" FOREIGN KEY ("DestinationID") REFERENCES "public"."Destinations"("DestinationID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ChatID_Chats_ChatID_fk" FOREIGN KEY ("ChatID") REFERENCES "public"."Chats"("ChatID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_SenderID_Users_UserID_fk" FOREIGN KEY ("SenderID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_PostID_Posts_PostID_fk" FOREIGN KEY ("PostID") REFERENCES "public"."Posts"("PostID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_ItineraryID_Itineraries_ItineraryID_fk" FOREIGN KEY ("ItineraryID") REFERENCES "public"."Itineraries"("ItineraryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_PostID_Posts_PostID_fk" FOREIGN KEY ("PostID") REFERENCES "public"."Posts"("PostID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_ReporterID_Users_UserID_fk" FOREIGN KEY ("ReporterID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TourBookings" ADD CONSTRAINT "TourBookings_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TourBookings" ADD CONSTRAINT "TourBookings_TourID_Tours_TourID_fk" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TourGuideProfiles" ADD CONSTRAINT "TourGuideProfiles_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tours" ADD CONSTRAINT "Tours_ProviderID_Users_UserID_fk" FOREIGN KEY ("ProviderID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TravelCompanions" ADD CONSTRAINT "TravelCompanions_PostID_Posts_PostID_fk" FOREIGN KEY ("PostID") REFERENCES "public"."Posts"("PostID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TravelCompanions" ADD CONSTRAINT "TravelCompanions_RequesterID_Users_UserID_fk" FOREIGN KEY ("RequesterID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TravelCompanions" ADD CONSTRAINT "TravelCompanions_ReceiverID_Users_UserID_fk" FOREIGN KEY ("ReceiverID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_UserID_Users_UserID_fk" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE no action ON UPDATE no action;