using System.Text.Json;
using CreatorFi.Data;
using CreatorFi.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace CreatorFi.API.Services;

public class SnapshotReader(CreatorFiDbContext db)
{
    public async Task<WorkspaceSnapshot> WorkspaceAsync(CancellationToken ct)
    {
        var influencers = await db.Influencers.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var applications = await db.Applications.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt)
            .ToListAsync(ct);
        var coaching = await db.CoachingRecords.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var vetting = await db.VettingRecords.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var activity = await db.ActivityItems.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .Take(20)
            .ToListAsync(ct);
        var brands = await db.Brands.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var campaigns = await db.Campaigns.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var setting = await db.WorkspaceSettings.AsNoTracking().FirstAsync(ct);
        var plans = await db.Plans.AsNoTracking().Include(item => item.Features).OrderBy(item => item.SortOrder).ToListAsync(ct);

        return new WorkspaceSnapshot(
            influencers.Select(ToDto).ToList(),
            applications.Select(ToDto).ToList(),
            coaching.Select(ToDto).ToList(),
            vetting.Select(ToDto).ToList(),
            activity.Select(ToDto).ToList(),
            brands.Select(ToDto).ToList(),
            campaigns.Select(ToDto).ToList(),
            setting.CurrentPlan,
            plans.Select(ToDto).ToList());
    }

    public async Task<CreatorSnapshot> CreatorAsync(CancellationToken ct)
    {
        var profile = await db.CreatorProfiles.AsNoTracking().FirstAsync(ct);
        var platforms = await db.PlatformStats.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync(ct);
        var posts = await db.TopPosts.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var brands = await db.CreatorBrands.AsNoTracking().Include(item => item.Deliverables)
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var payments = await db.Payments.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id)
            .ToListAsync(ct);
        var steps = await db.SarsSteps.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync(ct);
        var coaching = await db.CreatorCoaching.AsNoTracking().FirstOrDefaultAsync(ct);
        var courses = await db.Courses.AsNoTracking().OrderBy(item => item.SortOrder).ToListAsync(ct);

        return new CreatorSnapshot(
            ToDto(profile),
            platforms.Select(ToDto).ToList(),
            posts.Select(ToDto).ToList(),
            brands.Select(ToDto).ToList(),
            payments.Select(ToDto).ToList(),
            steps.Select(item => new StepDto(item.Step, item.Done)).ToList(),
            coaching is null ? null : new CreatorCoachingDto(coaching.Stage, coaching.Progress, coaching.Coach, coaching.Sessions, coaching.NextSession),
            courses.Select(item => new CourseDto(item.Title, item.Duration, item.Category, item.Tag)).ToList());
    }

    private static InfluencerDto ToDto(Influencer item) => new(
        item.Name, item.Handle, item.Avatar, item.Followers, item.Engagement, item.Platform,
        item.Niche, item.Status, item.Campaigns, item.Earnings, item.Plan);

    private static BrandDto ToDto(Brand item) => new(
        item.Name, item.Industry, item.Budget, item.Campaigns, item.Influencers, item.Status, item.Logo, item.Rating);

    private static CampaignDto ToDto(Campaign item) => new(
        item.Name, item.Brand, item.Status, item.Progress, item.Budget, item.Spent,
        item.Influencers, item.Reach, item.StartDate, item.EndDate);

    private static ActivityDto ToDto(ActivityItem item) => new(item.Text, item.TimeLabel, item.Type);

    private static CoachingDto ToDto(CoachingRecord item) => new(
        item.Name, item.Avatar, item.Handle, item.Stage, item.Progress, item.Coach,
        item.Sessions, item.NextSession, item.Notes, item.Status);

    private static VettingDto ToDto(VettingRecord item) => new(
        item.Name, item.Avatar, item.Handle, item.Followers, item.Engagement, item.Platform,
        item.VettedDate, item.VettedBy, item.Authenticity, item.BrandSafe, item.Status);

    private static ApplicationDto ToDto(ApplicationRecord item) => new(
        item.Id, item.Name, item.Avatar, item.Email, item.Handle, item.Followers, item.Platform,
        item.Niche, item.AppliedDate, item.Message, item.Portfolio, item.Engagement, item.Status, item.IdDocumentUrl);

    private static PlanDto ToDto(Plan item) => new(
        item.Name,
        item.Price,
        item.Period,
        item.Description,
        item.Features.OrderBy(feature => feature.SortOrder).Select(feature => feature.Text).ToList(),
        item.Highlighted,
        item.Badge,
        item.Cta);

    private static CreatorProfileDto ToDto(CreatorProfile item) => new(
        item.Name, item.Handle, item.Avatar, item.Plan, item.Location, item.IdVerified, item.IdMasked);

    private static PlatformDto ToDto(PlatformStat item) => new(
        item.PlatformKey,
        item.Icon,
        item.Tone,
        item.Locked,
        item.Followers,
        item.Engagement,
        item.Reach,
        item.Posts,
        ReadGrowth(item.GrowthJson));

    private static PostDto ToDto(TopPost item) => new(item.Title, item.Reach, item.Likes, item.Engagement);

    private static CreatorBrandDto ToDto(CreatorBrandDeal item) => new(
        item.Name,
        item.Logo,
        item.Status,
        item.Importance,
        item.NextDue,
        item.Fee,
        item.Deliverables.OrderBy(deliverable => deliverable.SortOrder)
            .Select(deliverable => new DeliverableDto(deliverable.Task, deliverable.Due, deliverable.Done))
            .ToList());

    private static PaymentDto ToDto(Payment item) => new(
        item.Brand, item.Amount, item.DateLabel, item.Status, item.Method, item.HasProof);

    private static IReadOnlyList<int> ReadGrowth(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<List<int>>(json) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }
}
