# Hệ thống Database Cập Nhật (Theo Code Drizzle ORM Models)

Dưới đây là sơ đồ cơ sở dữ liệu (Database Schema) đã được cập nhật lại khớp 100% với các schema hiện tại của dự án TravelHub, sử dụng PostgreSQL và Drizzle ORM.

```sql
-- 1. Bảng Users
CREATE TABLE Users (
    UserID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255), 
    GoogleID VARCHAR(100),     
    AvatarURL VARCHAR(500),    
    FullName VARCHAR(100),
    DateOfBirth TIMESTAMP,
    StudentCode VARCHAR(20),
    Gender VARCHAR(10),
    RefreshToken VARCHAR(255),
    RefreshTokenExpiryTime TIMESTAMP,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastOnline TIMESTAMP,
    Role VARCHAR(20) DEFAULT 'Customer',
    IsPremium BOOLEAN DEFAULT FALSE,
    PremiumExpiryDate TIMESTAMP,
    IsBlocked BOOLEAN DEFAULT FALSE,
    AiGenerationCount INT DEFAULT 0,
    LastAiGenerationDate TIMESTAMP,
    TravelPoints INT DEFAULT 0,
    UserCode VARCHAR(20)
);

-- 2 Bảng TourGuideProfiles
CREATE TABLE TourGuideProfiles (
    ProfileID SERIAL PRIMARY KEY,
    UserID UUID NOT NULL,
    DateOfBirth TIMESTAMP,
    Gender VARCHAR(20),
    Phone VARCHAR(20),
    Address VARCHAR(255),
    Experience VARCHAR(20),
    Languages VARCHAR(255),
    Locations VARCHAR(500),
    Bio TEXT,
    TourCategories VARCHAR(500),
    IdFrontUrl VARCHAR(500),
    IdBackUrl VARCHAR(500),
    CertUrl VARCHAR(500),
    GuideAvatarUrl VARCHAR(500),
    IsVerified VARCHAR(20) DEFAULT 'Pending',
    AdminNote TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 3. Bảng UserPreferences
CREATE TABLE UserPreferences (
    PreferenceID SERIAL PRIMARY KEY,
    UserID UUID NOT NULL,
    PreferredBudgetVND DECIMAL(18, 0),
    TravelStyle TEXT,
    FavoriteActivities TEXT,
    MaxDurationDays INT,
    PreferredDestinations TEXT,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 4. Bảng Destinations
CREATE TABLE Destinations (
    DestinationID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    CityProvince TEXT NOT NULL,
    Description TEXT,
    Rate DECIMAL(18, 1),
    Image TEXT,
    KeyMain TEXT,
    EntranceFee DECIMAL(18, 0),
    AccommodationCost DECIMAL(18, 0),
    TotalTourCost DECIMAL(18, 0),
    TourPricePerPerson DECIMAL(18, 0)
);

-- 5. Bảng Itineraries
CREATE TABLE Itineraries (
    ItineraryID SERIAL PRIMARY KEY,
    Slug VARCHAR(255) NOT NULL UNIQUE,
    UserID UUID NOT NULL,
    TripName TEXT NOT NULL,
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    TotalBudgetEstimatedVND DECIMAL(18, 0),
    Status TEXT DEFAULT 'Planned',
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 6. Bảng ItineraryDetails
CREATE TABLE ItineraryDetails (
    DetailID SERIAL PRIMARY KEY,
    ItineraryID INT NOT NULL,
    DestinationID INT NOT NULL,
    DayNumber INT NOT NULL,
    TimeSlot TEXT,
    ActivityDescription TEXT,
    EstimatedCostVND DECIMAL(18, 0),
    
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID),
    FOREIGN KEY (DestinationID) REFERENCES Destinations(DestinationID)
);

-- 7. Bảng Budgets
CREATE TABLE Budgets (
    BudgetID SERIAL PRIMARY KEY,
    ItineraryID INT NOT NULL,
    Category TEXT NOT NULL,
    PlannedAmountVND DECIMAL(18, 0) NOT NULL,
    ActualAmountVND DECIMAL(18, 0),
    TransactionDate TIMESTAMP,
    Notes TEXT,
    
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID)
);

-- 8. Bảng Posts
CREATE TABLE Posts (
    PostID SERIAL PRIMARY KEY,
    Slug VARCHAR(255) NOT NULL UNIQUE,
    UserID UUID NOT NULL,
    ItineraryID INT,
    PostType TEXT NOT NULL,
    Title TEXT NOT NULL,
    Content TEXT,
    LikesCount INT DEFAULT 0,
    IsHidden BOOLEAN DEFAULT FALSE,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID)
);

-- 9 Bảng PostLikes
CREATE TABLE PostLikes (
    UserID UUID NOT NULL,
    PostID INT NOT NULL,
    LikedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (UserID, PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
);

-- 10. Bảng Comments
CREATE TABLE Comments (
    CommentID SERIAL PRIMARY KEY,
    PostID INT NOT NULL,
    UserID UUID NOT NULL,
    Content TEXT,
    CommentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 11. Bảng Chats
CREATE TABLE Chats (
    ChatID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ChatName TEXT,
    IsGroupChat BOOLEAN DEFAULT FALSE,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Bảng ChatParticipants
CREATE TABLE ChatParticipants (
    ChatID UUID NOT NULL,
    UserID UUID NOT NULL,
    JoinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (ChatID, UserID),
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 13. Bảng Messages
CREATE TABLE Messages (
    MessageID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ChatID UUID NOT NULL,
    SenderID UUID NOT NULL,
    Content TEXT,
    SentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID),
    FOREIGN KEY (SenderID) REFERENCES Users(UserID)
);

-- 14. Bảng TravelCompanions
CREATE TABLE TravelCompanions (
    CompanionID SERIAL PRIMARY KEY,
    PostID INT,
    RequesterID UUID NOT NULL,
    ReceiverID UUID NOT NULL,
    Status TEXT DEFAULT 'Pending',
    DateRequested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (RequesterID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

-- 15. Bảng Tours
CREATE TABLE Tours (
    TourID SERIAL PRIMARY KEY,
    Slug VARCHAR(255) NOT NULL UNIQUE,
    Title VARCHAR(255) NOT NULL,
    Destination VARCHAR(100) NOT NULL,
    DepartureLocation VARCHAR(100) NOT NULL,
    DepartureDate TIMESTAMP NOT NULL,
    DurationDays INT NOT NULL,
    DurationText VARCHAR(50),
    PriceVND DECIMAL(18, 2) NOT NULL,
    ImageUrl TEXT,
    Description TEXT,
    NumberOfBookings INT DEFAULT 0,
    ProviderID UUID,
    
    FOREIGN KEY (ProviderID) REFERENCES Users(UserID)
);

-- 16. Bảng TourBookings
CREATE TABLE TourBookings (
    BookingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL,
    TourID INT NOT NULL,
    TourTitle TEXT NOT NULL,
    Destination TEXT NOT NULL,
    ImageUrl TEXT,
    DepartureDate TIMESTAMP NOT NULL,
    FullName TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Email TEXT,
    Notes TEXT,
    Guests INT NOT NULL,
    TotalPriceVND DECIMAL(18, 2) NOT NULL,
    BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status TEXT NOT NULL,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (TourID) REFERENCES Tours(TourID)
);

-- 17. Bảng Reports
CREATE TABLE Reports (
    ReportID SERIAL PRIMARY KEY,
    PostID INT NOT NULL,
    ReporterID UUID NOT NULL,
    Reason TEXT NOT NULL,
    Status TEXT DEFAULT 'Pending',
    ReportDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (ReporterID) REFERENCES Users(UserID)
);

-- 18. Bảng GuideApplications
CREATE TABLE GuideApplications (
    ApplicationID SERIAL PRIMARY KEY,
    GuideID UUID NOT NULL,
    PostID INT NOT NULL,
    Status TEXT DEFAULT 'Pending',
    Message TEXT,
    ProposedPriceVND DECIMAL(18, 0),
    AppliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (GuideID) REFERENCES Users(UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
);
```
