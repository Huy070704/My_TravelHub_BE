# Hệ thống Database Cập Nhật (Theo Code EF Core Models)

Dưới đây là sơ đồ cơ sở dữ liệu (Database Schema) đã được cập nhật lại khớp 100% với các Models và DbContext hiện tại của dự án TravelHub.

```sql
-- 1. Bảng Users (Đã cập nhật các trường mới như Role, IsPremium, RefreshToken, ...)
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NULL, 
    GoogleID NVARCHAR(100) NULL,     
    AvatarURL NVARCHAR(500) NULL,    
    FullName NVARCHAR(100) NULL,
    DateOfBirth DATETIME NULL,
    StudentCode NVARCHAR(20) NULL,
    Gender NVARCHAR(10) NULL,
    RefreshToken NVARCHAR(255) NULL,
    RefreshTokenExpiryTime DATETIME NULL,
    RegistrationDate DATETIME DEFAULT GETDATE(),
    LastOnline DATETIME NULL,
    Role NVARCHAR(20) DEFAULT 'Customer',
    IsPremium BIT DEFAULT 0,
    PremiumExpiryDate DATETIME NULL,
    IsBlocked BIT DEFAULT 0,
    AiGenerationCount INT DEFAULT 0,
    LastAiGenerationDate DATETIME NULL,
    TravelPoints INT DEFAULT 0,
    UserCode NVARCHAR(20) NULL
);

-- 1.5 Bảng TourGuideProfiles (Hồ sơ Hướng dẫn viên - Mới)
CREATE TABLE TourGuideProfiles (
    ProfileID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    DateOfBirth DATETIME NULL,
    Gender NVARCHAR(20) NULL,
    Phone NVARCHAR(20) NULL,
    Address NVARCHAR(255) NULL,
    Experience NVARCHAR(20) NULL,
    Languages NVARCHAR(255) NULL,
    Locations NVARCHAR(500) NULL,
    Bio NVARCHAR(1000) NULL,
    TourCategories NVARCHAR(500) NULL,
    IdFrontUrl NVARCHAR(500) NULL,
    IdBackUrl NVARCHAR(500) NULL,
    CertUrl NVARCHAR(500) NULL,
    GuideAvatarUrl NVARCHAR(500) NULL,
    IsVerified NVARCHAR(20) DEFAULT 'Pending',
    AdminNote NVARCHAR(1000) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 2. Bảng UserPreferences
CREATE TABLE UserPreferences (
    PreferenceID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    PreferredBudgetVND DECIMAL(18, 0) NULL,
    TravelStyle NVARCHAR(MAX) NULL,
    FavoriteActivities NVARCHAR(MAX) NULL,
    MaxDurationDays INT NULL,
    PreferredDestinations NVARCHAR(MAX) NULL,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 3. Bảng Destinations
CREATE TABLE Destinations (
    DestinationID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL,
    CityProvince NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Rate DECIMAL(18, 1) NULL,
    Image NVARCHAR(MAX) NULL,
    KeyMain NVARCHAR(MAX) NULL,
    EntranceFee DECIMAL(18, 0) NULL,
    AccommodationCost DECIMAL(18, 0) NULL,
    TotalTourCost DECIMAL(18, 0) NULL,
    TourPricePerPerson DECIMAL(18, 0) NULL
);

-- 4. Bảng Itineraries
CREATE TABLE Itineraries (
    ItineraryID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    TripName NVARCHAR(MAX) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    TotalBudgetEstimatedVND DECIMAL(18, 0) NULL,
    Status NVARCHAR(MAX) DEFAULT 'Planned',
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 5. Bảng ItineraryDetails
CREATE TABLE ItineraryDetails (
    DetailID INT IDENTITY(1,1) PRIMARY KEY,
    ItineraryID INT NOT NULL,
    DestinationID INT NOT NULL,
    DayNumber INT NOT NULL,
    TimeSlot NVARCHAR(MAX) NULL,
    ActivityDescription NVARCHAR(MAX) NULL,
    EstimatedCostVND DECIMAL(18, 0) NULL,
    
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID),
    FOREIGN KEY (DestinationID) REFERENCES Destinations(DestinationID)
);

-- 6. Bảng Budgets
CREATE TABLE Budgets (
    BudgetID INT IDENTITY(1,1) PRIMARY KEY,
    ItineraryID INT NOT NULL,
    Category NVARCHAR(MAX) NOT NULL,
    PlannedAmountVND DECIMAL(18, 0) NOT NULL,
    ActualAmountVND DECIMAL(18, 0) NULL,
    TransactionDate DATETIME NULL,
    Notes NVARCHAR(MAX) NULL,
    
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID)
);

-- 7. Bảng Posts
CREATE TABLE Posts (
    PostID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ItineraryID INT NULL,
    PostType NVARCHAR(MAX) NOT NULL,
    Title NVARCHAR(MAX) NOT NULL,
    Content NVARCHAR(MAX) NULL,
    LikesCount INT DEFAULT 0,
    IsHidden BIT DEFAULT 0,
    CreationDate DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ItineraryID) REFERENCES Itineraries(ItineraryID)
);

-- 7.5 Bảng PostLikes (Mới)
CREATE TABLE PostLikes (
    UserID INT NOT NULL,
    PostID INT NOT NULL,
    LikedDate DATETIME DEFAULT GETDATE(),
    
    PRIMARY KEY (UserID, PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
);

-- 8. Bảng Comments
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    Content NVARCHAR(MAX) NULL,
    CommentDate DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 9. Bảng Chats
CREATE TABLE Chats (
    ChatID INT IDENTITY(1,1) PRIMARY KEY,
    ChatName NVARCHAR(MAX) NULL,
    IsGroupChat BIT DEFAULT 0,
    CreationDate DATETIME DEFAULT GETDATE()
);

-- 10. Bảng ChatParticipants
CREATE TABLE ChatParticipants (
    ChatParticipantID INT IDENTITY(1,1) PRIMARY KEY,
    ChatID INT NOT NULL,
    UserID INT NOT NULL,
    JoinedDate DATETIME DEFAULT GETDATE(),
    
    UNIQUE (ChatID, UserID), 
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 11. Bảng Messages
CREATE TABLE Messages (
    MessageID BIGINT IDENTITY(1,1) PRIMARY KEY,
    ChatID INT NOT NULL,
    SenderID INT NOT NULL,
    Content NVARCHAR(MAX) NULL,
    SentDate DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID),
    FOREIGN KEY (SenderID) REFERENCES Users(UserID)
);

-- 12. Bảng TravelCompanions
CREATE TABLE TravelCompanions (
    CompanionID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT NULL,
    RequesterID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Status NVARCHAR(MAX) DEFAULT 'Pending',
    DateRequested DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (RequesterID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

-- 13. Bảng Tours (Mới)
CREATE TABLE Tours (
    TourID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Destination NVARCHAR(100) NOT NULL,
    DepartureLocation NVARCHAR(100) NOT NULL,
    DepartureDate DATETIME NOT NULL,
    DurationDays INT NOT NULL,
    DurationText NVARCHAR(50) NULL,
    PriceVND DECIMAL(18, 2) NOT NULL,
    ImageUrl NVARCHAR(MAX) NULL,
    Description NVARCHAR(MAX) NULL,
    NumberOfBookings INT DEFAULT 0,
    ProviderID INT NULL,
    
    FOREIGN KEY (ProviderID) REFERENCES Users(UserID)
);

-- 14. Bảng TourBookings (Mới)
CREATE TABLE TourBookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    TourID INT NOT NULL,
    TourTitle NVARCHAR(MAX) NOT NULL,
    Destination NVARCHAR(MAX) NOT NULL,
    ImageUrl NVARCHAR(MAX) NULL,
    DepartureDate DATETIME NOT NULL,
    FullName NVARCHAR(MAX) NOT NULL,
    Phone NVARCHAR(MAX) NOT NULL,
    Email NVARCHAR(MAX) NULL,
    Notes NVARCHAR(MAX) NULL,
    Guests INT NOT NULL,
    TotalPriceVND DECIMAL(18, 2) NOT NULL,
    BookingDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(MAX) NOT NULL,
    
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (TourID) REFERENCES Tours(TourID)
);

-- 15. Bảng Reports (Mới)
CREATE TABLE Reports (
    ReportID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT NOT NULL,
    ReporterID INT NOT NULL,
    Reason NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(MAX) DEFAULT 'Pending',
    ReportDate DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (ReporterID) REFERENCES Users(UserID)
);

-- 16. Bảng GuideApplications (Mới)
CREATE TABLE GuideApplications (
    ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
    GuideID INT NOT NULL,
    PostID INT NOT NULL,
    Status NVARCHAR(MAX) DEFAULT 'Pending',
    Message NVARCHAR(MAX) NULL,
    ProposedPriceVND DECIMAL(18, 0) NULL,
    AppliedDate DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (GuideID) REFERENCES Users(UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
);
```
