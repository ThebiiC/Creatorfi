-- Create the CreatorFi database, then build the tables.
-- In SSMS: open this file and execute it against your SQL Server instance.
-- Pointed at localhost\SQLEXPRESS, the same instance shown in SSMS.
IF DB_ID(N'CreatorFi') IS NULL
BEGIN
    CREATE DATABASE [CreatorFi];
END
GO
USE [CreatorFi];
GO

IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [ActivityItems] (
        [Id] int NOT NULL IDENTITY,
        [Text] nvarchar(max) NOT NULL,
        [TimeLabel] nvarchar(max) NOT NULL,
        [Type] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_ActivityItems] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Applications] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Avatar] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Handle] nvarchar(max) NOT NULL,
        [Followers] nvarchar(max) NOT NULL,
        [Platform] nvarchar(max) NOT NULL,
        [Niche] nvarchar(max) NOT NULL,
        [AppliedDate] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [Portfolio] nvarchar(max) NOT NULL,
        [Engagement] decimal(18,2) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [IdDocumentUrl] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Applications] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Brands] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Industry] nvarchar(max) NOT NULL,
        [Budget] nvarchar(max) NOT NULL,
        [Campaigns] int NOT NULL,
        [Influencers] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Logo] nvarchar(max) NOT NULL,
        [Rating] decimal(18,2) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Brands] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Campaigns] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Brand] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Progress] int NOT NULL,
        [Budget] nvarchar(max) NOT NULL,
        [Spent] nvarchar(max) NOT NULL,
        [Influencers] int NOT NULL,
        [Reach] nvarchar(max) NOT NULL,
        [StartDate] nvarchar(max) NOT NULL,
        [EndDate] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Campaigns] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [CoachingRecords] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Avatar] nvarchar(max) NOT NULL,
        [Handle] nvarchar(max) NOT NULL,
        [Stage] nvarchar(max) NOT NULL,
        [Progress] int NOT NULL,
        [Coach] nvarchar(max) NOT NULL,
        [Sessions] int NOT NULL,
        [NextSession] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_CoachingRecords] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Courses] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Duration] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [Tag] nvarchar(max) NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_Courses] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [CreatorBrands] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Logo] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Importance] nvarchar(max) NOT NULL,
        [NextDue] nvarchar(max) NOT NULL,
        [Fee] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_CreatorBrands] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [CreatorCoaching] (
        [Id] int NOT NULL IDENTITY,
        [Stage] nvarchar(max) NOT NULL,
        [Progress] int NOT NULL,
        [Coach] nvarchar(max) NOT NULL,
        [Sessions] int NOT NULL,
        [NextSession] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_CreatorCoaching] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [CreatorProfiles] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Handle] nvarchar(max) NOT NULL,
        [Avatar] nvarchar(max) NOT NULL,
        [Plan] nvarchar(max) NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [IdVerified] bit NOT NULL,
        [IdMasked] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_CreatorProfiles] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Influencers] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Handle] nvarchar(100) NOT NULL,
        [Avatar] nvarchar(max) NOT NULL,
        [Followers] nvarchar(max) NOT NULL,
        [Engagement] decimal(18,2) NOT NULL,
        [Platform] nvarchar(max) NOT NULL,
        [Niche] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Campaigns] int NOT NULL,
        [Earnings] nvarchar(max) NOT NULL,
        [Plan] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Influencers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Payments] (
        [Id] int NOT NULL IDENTITY,
        [Brand] nvarchar(max) NOT NULL,
        [Amount] nvarchar(max) NOT NULL,
        [DateLabel] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Method] nvarchar(max) NOT NULL,
        [HasProof] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Plans] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(50) NOT NULL,
        [Price] nvarchar(max) NOT NULL,
        [Period] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Highlighted] bit NOT NULL,
        [Badge] nvarchar(max) NULL,
        [Cta] nvarchar(max) NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_Plans] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [PlatformStats] (
        [Id] int NOT NULL IDENTITY,
        [PlatformKey] nvarchar(50) NOT NULL,
        [Icon] nvarchar(max) NOT NULL,
        [Tone] nvarchar(max) NOT NULL,
        [Locked] bit NOT NULL,
        [Followers] nvarchar(max) NOT NULL,
        [Engagement] decimal(18,2) NOT NULL,
        [Reach] nvarchar(max) NOT NULL,
        [Posts] int NOT NULL,
        [GrowthJson] nvarchar(max) NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_PlatformStats] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [SarsSteps] (
        [Id] int NOT NULL IDENTITY,
        [Step] nvarchar(max) NOT NULL,
        [Done] bit NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_SarsSteps] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [TopPosts] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Reach] nvarchar(max) NOT NULL,
        [Likes] nvarchar(max) NOT NULL,
        [Engagement] decimal(18,2) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_TopPosts] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [VettingRecords] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Avatar] nvarchar(max) NOT NULL,
        [Handle] nvarchar(100) NOT NULL,
        [Followers] nvarchar(max) NOT NULL,
        [Engagement] decimal(18,2) NOT NULL,
        [Platform] nvarchar(max) NOT NULL,
        [VettedDate] nvarchar(max) NOT NULL,
        [VettedBy] nvarchar(max) NOT NULL,
        [Authenticity] decimal(18,2) NOT NULL,
        [BrandSafe] bit NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_VettingRecords] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [WorkspaceSettings] (
        [Id] int NOT NULL IDENTITY,
        [CurrentPlan] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_WorkspaceSettings] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [Deliverables] (
        [Id] int NOT NULL IDENTITY,
        [CreatorBrandId] int NOT NULL,
        [Task] nvarchar(max) NOT NULL,
        [Due] nvarchar(max) NOT NULL,
        [Done] bit NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_Deliverables] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Deliverables_CreatorBrands_CreatorBrandId] FOREIGN KEY ([CreatorBrandId]) REFERENCES [CreatorBrands] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE TABLE [PlanFeatures] (
        [Id] int NOT NULL IDENTITY,
        [PlanId] int NOT NULL,
        [Text] nvarchar(max) NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_PlanFeatures] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PlanFeatures_Plans_PlanId] FOREIGN KEY ([PlanId]) REFERENCES [Plans] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Deliverables_CreatorBrandId] ON [Deliverables] ([CreatorBrandId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Influencers_Handle] ON [Influencers] ([Handle]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PlanFeatures_PlanId] ON [PlanFeatures] ([PlanId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Plans_Name] ON [Plans] ([Name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PlatformStats_PlatformKey] ON [PlatformStats] ([PlatformKey]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_VettingRecords_Handle] ON [VettingRecords] ([Handle]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261001212921_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261001212921_InitialCreate', N'10.0.12');
END;

COMMIT;
GO

