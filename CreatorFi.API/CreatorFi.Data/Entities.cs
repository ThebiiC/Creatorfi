namespace CreatorFi.Data;

public class Influencer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Followers { get; set; } = "0";
    public decimal Engagement { get; set; }
    public string Platform { get; set; } = "";
    public string Niche { get; set; } = "";
    public string Status { get; set; } = "pending";
    public int Campaigns { get; set; }
    public string Earnings { get; set; } = "R0";
    public string Plan { get; set; } = "Starter";
    public DateTime CreatedAt { get; set; }
}

public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Industry { get; set; } = "";
    public string Budget { get; set; } = "R0";
    public int Campaigns { get; set; }
    public int Influencers { get; set; }
    public string Status { get; set; } = "active";
    public string Logo { get; set; } = "";
    public decimal Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Campaign
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Status { get; set; } = "draft";
    public int Progress { get; set; }
    public string Budget { get; set; } = "R0";
    public string Spent { get; set; } = "R0";
    public int Influencers { get; set; }
    public string Reach { get; set; } = "0";
    public string StartDate { get; set; } = "";
    public string EndDate { get; set; } = "—";
    public DateTime CreatedAt { get; set; }
}

public class ApplicationRecord
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Email { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Followers { get; set; } = "0";
    public string Platform { get; set; } = "";
    public string Niche { get; set; } = "";
    public string AppliedDate { get; set; } = "";
    public string Message { get; set; } = "";
    public string Portfolio { get; set; } = "";
    public decimal Engagement { get; set; }
    public string Status { get; set; } = "pending";
    public string IdDocumentUrl { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class CoachingRecord
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Stage { get; set; } = "";
    public int Progress { get; set; }
    public string Coach { get; set; } = "";
    public int Sessions { get; set; }
    public string NextSession { get; set; } = "Not scheduled";
    public string Notes { get; set; } = "";
    public string Status { get; set; } = "in-progress";
    public DateTime CreatedAt { get; set; }
}

public class VettingRecord
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Followers { get; set; } = "0";
    public decimal Engagement { get; set; }
    public string Platform { get; set; } = "";
    public string VettedDate { get; set; } = "—";
    public string VettedBy { get; set; } = "—";
    public decimal Authenticity { get; set; }
    public bool BrandSafe { get; set; }
    public string Status { get; set; } = "pending-review";
    public DateTime CreatedAt { get; set; }
}

public class ActivityItem
{
    public int Id { get; set; }
    public string Text { get; set; } = "";
    public string TimeLabel { get; set; } = "Just now";
    public string Type { get; set; } = "milestone";
    public DateTime CreatedAt { get; set; }
}

public class Plan
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Price { get; set; } = "";
    public string Period { get; set; } = "";
    public string Description { get; set; } = "";
    public bool Highlighted { get; set; }
    public string? Badge { get; set; }
    public string Cta { get; set; } = "";
    public int SortOrder { get; set; }
    public List<PlanFeature> Features { get; set; } = [];
}

public class PlanFeature
{
    public int Id { get; set; }
    public int PlanId { get; set; }
    public Plan Plan { get; set; } = null!;
    public string Text { get; set; } = "";
    public int SortOrder { get; set; }
}

public class WorkspaceSetting
{
    public int Id { get; set; }
    public string CurrentPlan { get; set; } = "Starter";
}

public class CreatorProfile
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Plan { get; set; } = "Free";
    public string Location { get; set; } = "";
    public bool IdVerified { get; set; }
    public string IdMasked { get; set; } = "";
}

public class PlatformStat
{
    public int Id { get; set; }
    public string PlatformKey { get; set; } = "";
    public string Icon { get; set; } = "";
    public string Tone { get; set; } = "";
    public bool Locked { get; set; }
    public string Followers { get; set; } = "0";
    public decimal Engagement { get; set; }
    public string Reach { get; set; } = "0";
    public int Posts { get; set; }
    public string GrowthJson { get; set; } = "[0,0,0,0,0,0,0]";
    public int SortOrder { get; set; }
}

public class TopPost
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Reach { get; set; } = "0";
    public string Likes { get; set; } = "0";
    public decimal Engagement { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatorBrandDeal
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Logo { get; set; } = "";
    public string Status { get; set; } = "active";
    public string Importance { get; set; } = "Medium";
    public string NextDue { get; set; } = "";
    public string Fee { get; set; } = "R0";
    public DateTime CreatedAt { get; set; }
    public List<Deliverable> Deliverables { get; set; } = [];
}

public class Deliverable
{
    public int Id { get; set; }
    public int CreatorBrandId { get; set; }
    public CreatorBrandDeal CreatorBrand { get; set; } = null!;
    public string Task { get; set; } = "";
    public string Due { get; set; } = "";
    public bool Done { get; set; }
    public int SortOrder { get; set; }
}

public class Payment
{
    public int Id { get; set; }
    public string Brand { get; set; } = "";
    public string Amount { get; set; } = "";
    public string DateLabel { get; set; } = "";
    public string Status { get; set; } = "pending";
    public string Method { get; set; } = "EFT";
    public bool HasProof { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SarsStep
{
    public int Id { get; set; }
    public string Step { get; set; } = "";
    public bool Done { get; set; }
    public int SortOrder { get; set; }
}

public class CreatorCoaching
{
    public int Id { get; set; }
    public string Stage { get; set; } = "";
    public int Progress { get; set; }
    public string Coach { get; set; } = "";
    public int Sessions { get; set; }
    public string NextSession { get; set; } = "Not scheduled";
}

public class UserAccount
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Avatar { get; set; } = "";
    public string Location { get; set; } = "";
    public string Plan { get; set; } = "Free";
    public string IdReference { get; set; } = "";
    public bool IdVerified { get; set; }
    public string Role { get; set; } = "Creator";
    public string PasswordHash { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Duration { get; set; } = "";
    public string Category { get; set; } = "";
    public string? Tag { get; set; }
    public int SortOrder { get; set; }
}
