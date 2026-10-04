using CreatorFi.Data;

namespace CreatorFi.Data;

public static class DbSeeder
{
    private const string BlankGrowth = "[0,0,0,0,0,0,0]";

    public static void Seed(CreatorFiDbContext db)
    {
        if (db.WorkspaceSettings.Any())
        {
            return;
        }

        var origin = new DateTime(2026, 1, 15, 12, 0, 0, DateTimeKind.Utc);
        db.Plans.AddRange(
            CreatePlan(0, "Starter", "R29", "/month", "Perfect for emerging influencers just getting started", false, null, "Get Started",
                "Up to 5 brand connections", "Basic analytics dashboard", "Email support", "1 campaign at a time", "Standard profile listing"),
            CreatePlan(1, "Pro", "R79", "/month", "For growing influencers ready to scale their partnerships", true, "Most Popular", "Upgrade to Pro",
                "Up to 25 brand connections", "Advanced analytics & insights", "Priority email & chat support", "5 concurrent campaigns", "Featured profile listing", "Media kit builder", "Contract templates"),
            CreatePlan(2, "Business", "R199", "/month", "For established influencers managing multiple brand deals", false, null, "Go Business",
                "Unlimited brand connections", "Premium analytics & ROI tracking", "Dedicated account manager", "Unlimited campaigns", "Top-tier profile placement", "Advanced media kit", "Custom contract management", "Revenue forecasting"),
            CreatePlan(3, "Enterprise", "R499", "/month", "For agencies and top-tier creators managing large portfolios", false, "For Agencies", "Contact Sales",
                "Everything in Business", "Multi-user team access", "White-label reporting", "API access", "Custom integrations", "Dedicated success team", "SLA guarantee", "Custom billing", "Brand matchmaking AI"));

        db.Courses.AddRange(
            CreateCourse(0, "Why being tax compliant protects your money", "8 min", "SARS", "Start here"),
            CreateCourse(1, "Deductions creators miss (legally lower your tax)", "12 min", "SARS", "Popular"),
            CreateCourse(2, "Building a media kit that wins brand deals", "15 min", "Growth", null),
            CreateCourse(3, "Negotiating your rate with brands", "10 min", "Business", null));

        db.Brands.AddRange(
            CreateBrand(origin, 0, "Luxe Beauty Co.", "Beauty & Cosmetics", "R120,000", 6, 14, "active", "LB", 4.9m),
            CreateBrand(origin, 1, "TechNova Inc.", "Technology", "R250,000", 4, 8, "active", "TN", 4.7m),
            CreateBrand(origin, 2, "FitLife Pro", "Health & Fitness", "R85,000", 3, 10, "active", "FL", 4.8m),
            CreateBrand(origin, 3, "Wanderlust Travel", "Travel & Tourism", "R180,000", 5, 12, "paused", "WT", 4.5m),
            CreateBrand(origin, 4, "GreenEarth Foods", "Food & Beverage", "R95,000", 2, 6, "active", "GE", 4.6m),
            CreateBrand(origin, 5, "UrbanThread", "Fashion & Apparel", "R200,000", 7, 18, "active", "UT", 4.8m));

        db.Campaigns.AddRange(
            CreateCampaign(origin, 0, "Summer Glow Collection", "Luxe Beauty Co.", "live", 72, "R45,000", "R32,400", 6, "4.2M", "Jan 15, 2026", "Mar 15, 2026"),
            CreateCampaign(origin, 1, "TechNova Launch Event", "TechNova Inc.", "live", 45, "R80,000", "R36,000", 4, "2.8M", "Feb 1, 2026", "Apr 30, 2026"),
            CreateCampaign(origin, 2, "30-Day Fitness Challenge", "FitLife Pro", "completed", 100, "R30,000", "R28,500", 5, "3.5M", "Nov 1, 2025", "Dec 1, 2025"),
            CreateCampaign(origin, 3, "Explore the World Series", "Wanderlust Travel", "draft", 10, "R60,000", "R0", 0, "0", "Apr 1, 2026", "Jun 30, 2026"),
            CreateCampaign(origin, 4, "Spring Fashion Drop", "UrbanThread", "live", 58, "R55,000", "R31,900", 8, "5.1M", "Jan 20, 2026", "Mar 20, 2026"));

        db.WorkspaceSettings.Add(new WorkspaceSetting { CurrentPlan = "Starter" });
        db.CreatorProfiles.Add(new CreatorProfile { Plan = "Free" });
        db.PlatformStats.AddRange(
            CreatePlatform(0, "Instagram", "camera", "pink", false),
            CreatePlatform(1, "Twitter", "twitter", "sky", true),
            CreatePlatform(2, "Facebook", "facebook", "blue", true),
            CreatePlatform(3, "Other", "sparkles", "violet", true));
        db.SarsSteps.AddRange(
            CreateStep(0, "Register as a taxpayer with SARS"),
            CreateStep(1, "Register as a provisional taxpayer"),
            CreateStep(2, "Keep records of all brand income"),
            CreateStep(3, "Log deductible expenses (gear, data, travel)"),
            CreateStep(4, "Submit first provisional return (IRP6)"),
            CreateStep(5, "Watch for VAT registration (R1m turnover)"));

        db.SaveChanges();
    }

    private static Plan CreatePlan(int order, string name, string price, string period, string description, bool highlighted, string? badge, string cta, params string[] features) =>
        new()
        {
            Name = name,
            Price = price,
            Period = period,
            Description = description,
            Highlighted = highlighted,
            Badge = badge,
            Cta = cta,
            SortOrder = order,
            Features = features.Select((text, index) => new PlanFeature { Text = text, SortOrder = index }).ToList(),
        };

    private static Course CreateCourse(int order, string title, string duration, string category, string? tag) =>
        new() { Title = title, Duration = duration, Category = category, Tag = tag, SortOrder = order };

    private static Brand CreateBrand(DateTime origin, int index, string name, string industry, string budget, int campaigns, int influencers, string status, string logo, decimal rating) =>
        new()
        {
            Name = name,
            Industry = industry,
            Budget = budget,
            Campaigns = campaigns,
            Influencers = influencers,
            Status = status,
            Logo = logo,
            Rating = rating,
            CreatedAt = origin.AddMinutes(-index),
        };

    private static Campaign CreateCampaign(DateTime origin, int index, string name, string brand, string status, int progress, string budget, string spent, int influencers, string reach, string startDate, string endDate) =>
        new()
        {
            Name = name,
            Brand = brand,
            Status = status,
            Progress = progress,
            Budget = budget,
            Spent = spent,
            Influencers = influencers,
            Reach = reach,
            StartDate = startDate,
            EndDate = endDate,
            CreatedAt = origin.AddMinutes(-index),
        };

    private static PlatformStat CreatePlatform(int order, string key, string icon, string tone, bool locked) =>
        new()
        {
            PlatformKey = key,
            Icon = icon,
            Tone = tone,
            Locked = locked,
            Followers = "0",
            Engagement = 0,
            Reach = "0",
            Posts = 0,
            GrowthJson = BlankGrowth,
            SortOrder = order,
        };

    private static SarsStep CreateStep(int order, string step) =>
        new() { Step = step, Done = false, SortOrder = order };
}
