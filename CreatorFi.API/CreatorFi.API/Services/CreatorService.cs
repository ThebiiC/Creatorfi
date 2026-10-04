using CreatorFi.Data;
using CreatorFi.API.Infrastructure;
using CreatorFi.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace CreatorFi.API.Services;

public class CreatorService(CreatorFiDbContext db, SnapshotReader snapshots)
{
    public Task<CreatorSnapshot> GetAsync(CancellationToken ct) => snapshots.CreatorAsync(ct);

    public async Task<ServiceResult<CreatorMutation>> SaveProfileAsync(ProfileRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        if (name.Length == 0)
        {
            return ServiceResult<CreatorMutation>.Fail("Missing details", "Enter your name to save the profile.");
        }

        var profile = await db.CreatorProfiles.FirstAsync(ct);
        var idMasked = request.IdMasked?.Trim() ?? "";
        profile.Name = name;
        profile.Handle = TextFormats.WithHandle(request.Handle);
        profile.Avatar = TextFormats.Initials(name);
        profile.Location = request.Location?.Trim() ?? "";
        profile.IdMasked = idMasked;
        profile.IdVerified = idMasked.Length > 0;
        return await SavedAsync("Profile saved", "Your creator profile is saved.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> UpgradeAsync(CancellationToken ct)
    {
        var profile = await db.CreatorProfiles.FirstAsync(ct);
        profile.Plan = "Pro";
        var platforms = await db.PlatformStats.ToListAsync(ct);
        foreach (var platform in platforms)
        {
            platform.Locked = false;
        }

        return await SavedAsync("Plan updated", "Pro unlocks every platform on this profile.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> UpdatePlatformAsync(string key, PlatformUpdateRequest request, CancellationToken ct)
    {
        var platform = await db.PlatformStats.FirstOrDefaultAsync(item => item.PlatformKey == key, ct);
        if (platform is null)
        {
            return ServiceResult<CreatorMutation>.Fail("Not found", "That platform is not on this profile.");
        }

        if (platform.Locked)
        {
            return ServiceResult<CreatorMutation>.Fail("Platform locked", "Upgrade before recording stats for this platform.");
        }

        platform.Followers = TextFormats.Or(request.Followers, "0");
        platform.Reach = TextFormats.Or(request.Reach, "0");
        platform.Engagement = request.Engagement;
        platform.Posts = request.Posts < 0 ? 0 : request.Posts;
        return await SavedAsync("Stats saved", $"{platform.PlatformKey} numbers are updated.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> AddPostAsync(PostRequest request, CancellationToken ct)
    {
        var title = request.Title.Trim();
        if (title.Length == 0)
        {
            return ServiceResult<CreatorMutation>.Fail("Missing details", "Give the post a title.");
        }

        db.TopPosts.Add(new TopPost
        {
            Title = title,
            Reach = TextFormats.Or(request.Reach, "0"),
            Likes = TextFormats.Or(request.Likes, "0"),
            Engagement = request.Engagement,
            CreatedAt = DateTime.UtcNow,
        });
        return await SavedAsync("Post added", $"{title} is on your overview.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> AddBrandAsync(CreatorBrandRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        var task = request.Task.Trim();
        var due = request.Due.Trim();
        if (name.Length == 0 || task.Length == 0 || due.Length == 0)
        {
            return ServiceResult<CreatorMutation>.Fail("Missing details", "Brand, deliverable, and due date are required.");
        }

        var importance = request.Importance is "High" or "Low" ? request.Importance : "Medium";
        db.CreatorBrands.Add(new CreatorBrandDeal
        {
            Name = name,
            Logo = TextFormats.Initials(name),
            Status = "active",
            Importance = importance,
            NextDue = due,
            Fee = TextFormats.Or(request.Fee, "R0"),
            CreatedAt = DateTime.UtcNow,
            Deliverables =
            [
                new Deliverable { Task = task, Due = due, Done = false, SortOrder = 0 },
            ],
        });
        return await SavedAsync("Brand added", $"{name} is on your deal list.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> ToggleDeliverableAsync(DeliverableToggleRequest request, CancellationToken ct)
    {
        var brands = await db.CreatorBrands.Include(item => item.Deliverables)
            .Where(item => item.Name == request.BrandName)
            .ToListAsync(ct);
        foreach (var deliverable in brands.SelectMany(item => item.Deliverables).Where(item => item.Task == request.Task))
        {
            deliverable.Done = !deliverable.Done;
        }

        return await SavedAsync(null, null, ct);
    }

    public async Task<ServiceResult<CreatorMutation>> AddPaymentAsync(PaymentRequest request, CancellationToken ct)
    {
        var brand = request.Brand.Trim();
        var amount = request.Amount.Trim();
        if (brand.Length == 0 || amount.Length == 0)
        {
            return ServiceResult<CreatorMutation>.Fail("Missing details", "Brand and amount are required.");
        }

        if (!amount.StartsWith('R'))
        {
            amount = "R" + amount;
        }

        db.Payments.Add(new Payment
        {
            Brand = brand,
            Amount = amount,
            DateLabel = TextFormats.TodayLabel(),
            Status = request.Status == "received" ? "received" : "pending",
            Method = TextFormats.Or(request.Method, "EFT"),
            HasProof = false,
            CreatedAt = DateTime.UtcNow,
        });
        return await SavedAsync("Payment logged", $"{brand} was added to your income record.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> MarkProofAsync(ProofRequest request, CancellationToken ct)
    {
        var matches = await db.Payments
            .Where(item => item.Brand == request.Brand && item.DateLabel == request.Date)
            .ToListAsync(ct);
        foreach (var payment in matches)
        {
            payment.HasProof = true;
        }

        return await SavedAsync("Proof attached", $"Proof of payment is on file for {request.Brand}.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> BookSessionAsync(BookSessionRequest request, CancellationToken ct)
    {
        var coach = request.Coach.Trim();
        if (coach.Length == 0)
        {
            return ServiceResult<CreatorMutation>.Fail("Missing details", "Enter a coach name to book a session.");
        }

        var stage = TextFormats.Or(request.Stage, "Getting started");
        var nextSession = TextFormats.Or(request.NextSession, "Not scheduled");
        var current = await db.CreatorCoaching.FirstOrDefaultAsync(ct);
        if (current is null)
        {
            db.CreatorCoaching.Add(new CreatorCoaching
            {
                Coach = coach,
                Stage = stage,
                NextSession = nextSession,
                Progress = 0,
                Sessions = 0,
            });
        }
        else
        {
            current.Coach = coach;
            current.Stage = stage;
            current.NextSession = nextSession;
            current.Sessions += 1;
        }

        return await SavedAsync("Session booked", $"Next session with {coach} is {nextSession}.", ct);
    }

    public async Task<ServiceResult<CreatorMutation>> ToggleStepAsync(StepRequest request, CancellationToken ct)
    {
        var step = await db.SarsSteps.FirstOrDefaultAsync(item => item.Step == request.Step, ct);
        if (step is not null)
        {
            step.Done = !step.Done;
        }

        return await SavedAsync(null, null, ct);
    }

    private async Task<ServiceResult<CreatorMutation>> SavedAsync(string? title, string? message, CancellationToken ct)
    {
        await db.SaveChangesAsync(ct);
        var snapshot = await snapshots.CreatorAsync(ct);
        return ServiceResult<CreatorMutation>.Success(new CreatorMutation(snapshot, title, message));
    }
}
