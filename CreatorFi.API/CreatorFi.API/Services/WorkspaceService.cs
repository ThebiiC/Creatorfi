using CreatorFi.Data;
using CreatorFi.API.Infrastructure;
using CreatorFi.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace CreatorFi.API.Services;

public class WorkspaceService(CreatorFiDbContext db, SnapshotReader snapshots)
{
    public Task<WorkspaceSnapshot> GetAsync(CancellationToken ct) => snapshots.WorkspaceAsync(ct);

    public async Task<ServiceResult<WorkspaceMutation>> AddApplicationAsync(ApplicationRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var handle = TextFormats.WithHandle(request.Handle);
        var email = request.Email.Trim();
        if (name.Length == 0 || handle.Length == 0 || email.Length == 0)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Missing details", "Name, handle, and email are required.");
        }

        db.Applications.Add(new ApplicationRecord
        {
            Id = $"app-{Guid.NewGuid():N}",
            Name = name,
            Avatar = TextFormats.Initials(name),
            Email = email,
            Handle = handle,
            Followers = TextFormats.Or(request.Followers, "0"),
            Platform = TextFormats.Or(request.Platform, "Instagram"),
            Niche = TextFormats.Or(request.Niche, "General"),
            AppliedDate = TextFormats.TodayLabel(),
            Message = TextFormats.Or(request.Message, "Applied to join the roster."),
            Portfolio = TextFormats.Or(request.Portfolio, "—"),
            Engagement = request.Engagement,
            Status = "pending",
            IdDocumentUrl = "",
            CreatedAt = DateTime.UtcNow,
        });
        Log($"{name} submitted an application.", "milestone");
        return await SavedAsync("Application added", $"{name} is waiting in the pending list.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> SetApplicationStatusAsync(string id, string status, CancellationToken ct)
    {
        if (status is not ("accepted" or "declined"))
        {
            return ServiceResult<WorkspaceMutation>.Fail("Invalid status", "Choose accepted or declined.");
        }

        var current = await db.Applications.FirstOrDefaultAsync(item => item.Id == id, ct);
        if (current is null)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Not found", "That application is no longer in the list.");
        }

        if (current.Status == status)
        {
            return await UnchangedAsync(ct);
        }

        current.Status = status;
        if (status == "accepted")
        {
            if (!await HandleTakenAsync(current.Handle, ct))
            {
                AddInfluencer(current.Name, current.Handle, current.Followers, current.Engagement, current.Platform, current.Niche);
            }

            await EnsureVettingAsync(current.Name, current.Handle, current.Avatar, current.Followers, current.Engagement, current.Platform, ct);
            Log($"{current.Name} was accepted and added to the roster.", "milestone");
            return await SavedAsync("Application accepted", $"{current.Name} is on the roster and waiting for vetting.", ct);
        }

        Log($"{current.Name}'s application was declined.", "milestone");
        return await SavedAsync("Application declined", $"{current.Name} was declined.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> AddInfluencerAsync(InfluencerRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var handle = TextFormats.WithHandle(request.Handle);
        if (name.Length == 0 || handle.Length == 0)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Missing details", "Name and handle are required to onboard an influencer.");
        }

        if (await HandleTakenAsync(handle, ct))
        {
            return ServiceResult<WorkspaceMutation>.Fail("Already on the roster", $"{handle} is already listed.");
        }

        var followers = TextFormats.Or(request.Followers, "0");
        var platform = TextFormats.Or(request.Platform, "Instagram");
        AddInfluencer(name, handle, followers, request.Engagement, platform, TextFormats.Or(request.Niche, "General"));
        await EnsureVettingAsync(name, handle, TextFormats.Initials(name), followers, request.Engagement, platform, ct);
        Log($"{name} was onboarded and is waiting for vetting.", "milestone");
        return await SavedAsync("Influencer onboarded", $"{name} is on the roster as pending.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> ReviewVettingAsync(VettingReviewRequest request, CancellationToken ct)
    {
        var handle = TextFormats.WithHandle(request.Handle);
        var item = await db.VettingRecords.FirstOrDefaultAsync(record => record.Handle.ToLower() == handle.ToLower(), ct);
        if (item is null)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Not found", "That creator is not in the vetting queue.");
        }

        var influencer = await db.Influencers.FirstOrDefaultAsync(person => person.Handle.ToLower() == handle.ToLower(), ct);
        if (request.Approve)
        {
            item.Status = "vetted";
            item.VettedDate = TextFormats.TodayLabel();
            item.VettedBy = "Workspace";
            item.BrandSafe = true;
            item.Authenticity = item.Authenticity == 0 ? 80 : item.Authenticity;
            if (influencer is not null)
            {
                influencer.Status = "active";
            }

            Log($"{item.Name} was approved and is now active.", "milestone");
            return await SavedAsync("Approved", $"{item.Name} is vetted and active.", ct);
        }

        db.VettingRecords.Remove(item);
        if (influencer is not null)
        {
            influencer.Status = "inactive";
        }

        Log($"{item.Name} was rejected and marked inactive.", "milestone");
        return await SavedAsync("Rejected", $"{item.Name} is inactive and off the review queue.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> AssignCoachAsync(CoachingAssignRequest request, CancellationToken ct)
    {
        var handle = request.Handle.Trim();
        var coach = request.Coach.Trim();
        var person = await db.Influencers.FirstOrDefaultAsync(item => item.Handle == handle, ct);
        if (person is null || coach.Length == 0)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Missing details", "Choose an influencer and enter a coach name.");
        }

        var already = await db.CoachingRecords.AnyAsync(
            item => item.Handle.ToLower() == person.Handle.ToLower() && item.Status == "in-progress",
            ct);
        if (already)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Already assigned", $"{person.Name} already has coaching in progress.");
        }

        db.CoachingRecords.Add(new CoachingRecord
        {
            Name = person.Name,
            Avatar = person.Avatar,
            Handle = person.Handle,
            Stage = TextFormats.Or(request.Stage, "Getting started"),
            Progress = 0,
            Coach = coach,
            Sessions = 0,
            NextSession = "Not scheduled",
            Notes = TextFormats.Or(request.Notes, "Newly assigned."),
            Status = "in-progress",
            CreatedAt = DateTime.UtcNow,
        });
        Log($"{coach} was assigned to coach {person.Name}.", "milestone");
        return await SavedAsync("Coach assigned", $"{coach} is now coaching {person.Name}.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> CompleteCoachingAsync(HandleRequest request, CancellationToken ct)
    {
        var handle = request.Handle.Trim();
        var item = await db.CoachingRecords.FirstOrDefaultAsync(
            record => record.Handle == handle && record.Status == "in-progress",
            ct);
        if (item is null)
        {
            return await UnchangedAsync(ct);
        }

        item.Status = "completed";
        item.Progress = 100;
        item.NextSession = "—";
        Log($"{item.Name} finished coaching with {item.Coach}.", "milestone");
        return await SavedAsync("Coaching complete", $"{item.Name} has graduated.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> AddBrandAsync(BrandRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        if (name.Length == 0)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Missing details", "Brand name is required.");
        }

        db.Brands.Add(new Brand
        {
            Name = name,
            Industry = TextFormats.Or(request.Industry, "General"),
            Budget = TextFormats.Or(request.Budget, "R0"),
            Campaigns = 0,
            Influencers = request.Influencers < 0 ? 0 : request.Influencers,
            Status = "active",
            Logo = TextFormats.Initials(name),
            Rating = 0,
            CreatedAt = DateTime.UtcNow,
        });
        Log($"{name} was added as a brand partner.", "brand");
        return await SavedAsync("Brand added", $"{name} is now a brand partner.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> AddCampaignAsync(CampaignRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var brand = request.Brand.Trim();
        if (name.Length == 0 || brand.Length == 0)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Missing details", "Campaign name and brand are required.");
        }

        db.Campaigns.Add(new Campaign
        {
            Name = name,
            Brand = brand,
            Status = "draft",
            Progress = 0,
            Budget = TextFormats.Or(request.Budget, "R0"),
            Spent = "R0",
            Influencers = 0,
            Reach = "0",
            StartDate = TextFormats.TodayLabel(),
            EndDate = "—",
            CreatedAt = DateTime.UtcNow,
        });
        Log($"{name} was created for {brand}.", "campaign");
        return await SavedAsync("Campaign created", $"{name} is saved as a draft.", ct);
    }

    public async Task<ServiceResult<WorkspaceMutation>> ChoosePlanAsync(PlanRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var known = await db.Plans.AnyAsync(item => item.Name == name, ct);
        if (!known)
        {
            return ServiceResult<WorkspaceMutation>.Fail("Unknown plan", "Choose one of the listed plans.");
        }

        var setting = await db.WorkspaceSettings.FirstAsync(ct);
        setting.CurrentPlan = name;
        Log($"Workspace plan changed to {name}.", "milestone");
        return await SavedAsync("Plan updated", $"This workspace is now on the {name} plan.", ct);
    }

    private async Task<bool> HandleTakenAsync(string handle, CancellationToken ct) =>
        await db.Influencers.AnyAsync(item => item.Handle.ToLower() == handle.ToLower(), ct);

    private void AddInfluencer(string name, string handle, string followers, decimal engagement, string platform, string niche)
    {
        db.Influencers.Add(new Influencer
        {
            Name = name,
            Handle = handle,
            Avatar = TextFormats.Initials(name),
            Followers = followers,
            Engagement = engagement,
            Platform = platform,
            Niche = niche,
            Status = "pending",
            Campaigns = 0,
            Earnings = "R0",
            Plan = "Starter",
            CreatedAt = DateTime.UtcNow,
        });
    }

    private async Task EnsureVettingAsync(
        string name,
        string handle,
        string avatar,
        string followers,
        decimal engagement,
        string platform,
        CancellationToken ct)
    {
        var exists = await db.VettingRecords.AnyAsync(item => item.Handle.ToLower() == handle.ToLower(), ct);
        if (exists)
        {
            return;
        }

        db.VettingRecords.Add(new VettingRecord
        {
            Name = name,
            Avatar = string.IsNullOrWhiteSpace(avatar) ? TextFormats.Initials(name) : avatar,
            Handle = handle,
            Followers = followers,
            Engagement = engagement,
            Platform = platform,
            VettedDate = "—",
            VettedBy = "—",
            Authenticity = 0,
            BrandSafe = false,
            Status = "pending-review",
            CreatedAt = DateTime.UtcNow,
        });
    }

    private void Log(string text, string type)
    {
        db.ActivityItems.Add(new ActivityItem
        {
            Text = text,
            TimeLabel = "Just now",
            Type = type,
            CreatedAt = DateTime.UtcNow,
        });
    }

    private async Task<ServiceResult<WorkspaceMutation>> SavedAsync(string title, string message, CancellationToken ct)
    {
        await db.SaveChangesAsync(ct);
        await TrimActivityAsync(ct);
        var snapshot = await snapshots.WorkspaceAsync(ct);
        return ServiceResult<WorkspaceMutation>.Success(new WorkspaceMutation(snapshot, title, message));
    }

    private async Task<ServiceResult<WorkspaceMutation>> UnchangedAsync(CancellationToken ct)
    {
        var snapshot = await snapshots.WorkspaceAsync(ct);
        return ServiceResult<WorkspaceMutation>.Success(new WorkspaceMutation(snapshot, null, null));
    }

    private async Task TrimActivityAsync(CancellationToken ct)
    {
        var stale = await db.ActivityItems
            .OrderByDescending(item => item.CreatedAt)
            .ThenByDescending(item => item.Id)
            .Skip(20)
            .ToListAsync(ct);
        if (stale.Count == 0)
        {
            return;
        }

        db.ActivityItems.RemoveRange(stale);
        await db.SaveChangesAsync(ct);
    }
}
