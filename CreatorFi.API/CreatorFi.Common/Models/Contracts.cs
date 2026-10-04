namespace CreatorFi.Common.Models;

public sealed record ApiMessage(string Title, string Message);

public sealed class ServiceResult<T>
{
    public T? Value { get; private init; }
    public string? ErrorTitle { get; private init; }
    public string? ErrorMessage { get; private init; }
    public bool IsSuccess => ErrorTitle is null;

    public static ServiceResult<T> Success(T value) => new() { Value = value };
    public static ServiceResult<T> Fail(string title, string message) => new() { ErrorTitle = title, ErrorMessage = message };
}

public sealed record InfluencerDto(
    string Name,
    string Handle,
    string Avatar,
    string Followers,
    decimal Engagement,
    string Platform,
    string Niche,
    string Status,
    int Campaigns,
    string Earnings,
    string Plan);

public sealed record BrandDto(
    string Name,
    string Industry,
    string Budget,
    int Campaigns,
    int Influencers,
    string Status,
    string Logo,
    decimal Rating);

public sealed record CampaignDto(
    string Name,
    string Brand,
    string Status,
    int Progress,
    string Budget,
    string Spent,
    int Influencers,
    string Reach,
    string StartDate,
    string EndDate);

public sealed record ActivityDto(string Text, string Time, string Type);

public sealed record CoachingDto(
    string Name,
    string Avatar,
    string Handle,
    string Stage,
    int Progress,
    string Coach,
    int Sessions,
    string NextSession,
    string Notes,
    string Status);

public sealed record VettingDto(
    string Name,
    string Avatar,
    string Handle,
    string Followers,
    decimal Engagement,
    string Platform,
    string VettedDate,
    string VettedBy,
    decimal Authenticity,
    bool BrandSafe,
    string Status);

public sealed record ApplicationDto(
    string Id,
    string Name,
    string Avatar,
    string Email,
    string Handle,
    string Followers,
    string Platform,
    string Niche,
    string AppliedDate,
    string Message,
    string Portfolio,
    decimal Engagement,
    string Status,
    string IdDocumentUrl);

public sealed record PlanDto(
    string Name,
    string Price,
    string Period,
    string Description,
    IReadOnlyList<string> Features,
    bool Highlighted,
    string? Badge,
    string Cta);

public sealed record WorkspaceSnapshot(
    IReadOnlyList<InfluencerDto> Influencers,
    IReadOnlyList<ApplicationDto> Applications,
    IReadOnlyList<CoachingDto> Coaching,
    IReadOnlyList<VettingDto> Vetting,
    IReadOnlyList<ActivityDto> Activity,
    IReadOnlyList<BrandDto> Brands,
    IReadOnlyList<CampaignDto> Campaigns,
    string CurrentPlan,
    IReadOnlyList<PlanDto> Plans);

public sealed record WorkspaceMutation(WorkspaceSnapshot Snapshot, string? ToastTitle, string? ToastMessage);

public sealed record CreatorProfileDto(
    string Name,
    string Handle,
    string Avatar,
    string Plan,
    string Location,
    bool IdVerified,
    string IdMasked);

public sealed record PlatformDto(
    string Key,
    string Icon,
    string Tone,
    bool Locked,
    string Followers,
    decimal Engagement,
    string Reach,
    int Posts,
    IReadOnlyList<int> Growth);

public sealed record PostDto(string Title, string Reach, string Likes, decimal Engagement);

public sealed record DeliverableDto(string Task, string Due, bool Done);

public sealed record CreatorBrandDto(
    string Name,
    string Logo,
    string Status,
    string Importance,
    string NextDue,
    string Fee,
    IReadOnlyList<DeliverableDto> Deliverables);

public sealed record PaymentDto(
    string Brand,
    string Amount,
    string Date,
    string Status,
    string Method,
    bool HasProof);

public sealed record StepDto(string Step, bool Done);

public sealed record CreatorCoachingDto(
    string Stage,
    int Progress,
    string Coach,
    int Sessions,
    string NextSession);

public sealed record CourseDto(string Title, string Duration, string Category, string? Tag);

public sealed record CreatorSnapshot(
    CreatorProfileDto Profile,
    IReadOnlyList<PlatformDto> Platforms,
    IReadOnlyList<PostDto> Posts,
    IReadOnlyList<CreatorBrandDto> Brands,
    IReadOnlyList<PaymentDto> Payments,
    IReadOnlyList<StepDto> Steps,
    CreatorCoachingDto? Coaching,
    IReadOnlyList<CourseDto> Courses);

public sealed record CreatorMutation(CreatorSnapshot Snapshot, string? ToastTitle, string? ToastMessage);

public sealed class ApplicationRequest
{
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Followers { get; set; }
    public string? Platform { get; set; }
    public string? Niche { get; set; }
    public string? Message { get; set; }
    public string? Portfolio { get; set; }
    public decimal Engagement { get; set; }
}

public sealed class StatusRequest
{
    public string Status { get; set; } = "";
}

public sealed class InfluencerRequest
{
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string? Followers { get; set; }
    public decimal Engagement { get; set; }
    public string? Platform { get; set; }
    public string? Niche { get; set; }
}

public sealed class VettingReviewRequest
{
    public string Handle { get; set; } = "";
    public bool Approve { get; set; }
}

public sealed class CoachingAssignRequest
{
    public string Handle { get; set; } = "";
    public string Coach { get; set; } = "";
    public string? Stage { get; set; }
    public string? Notes { get; set; }
}

public sealed class HandleRequest
{
    public string Handle { get; set; } = "";
}

public sealed class BrandRequest
{
    public string Name { get; set; } = "";
    public string? Industry { get; set; }
    public string? Budget { get; set; }
    public int Influencers { get; set; }
}

public sealed class CampaignRequest
{
    public string Name { get; set; } = "";
    public string Brand { get; set; } = "";
    public string? Budget { get; set; }
}

public sealed class PlanRequest
{
    public string Name { get; set; } = "";
}

public sealed class ProfileRequest
{
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string? Location { get; set; }
    public string? IdMasked { get; set; }
}

public sealed class PlatformUpdateRequest
{
    public string? Followers { get; set; }
    public string? Reach { get; set; }
    public decimal Engagement { get; set; }
    public int Posts { get; set; }
}

public sealed class PostRequest
{
    public string Title { get; set; } = "";
    public string? Reach { get; set; }
    public string? Likes { get; set; }
    public decimal Engagement { get; set; }
}

public sealed class CreatorBrandRequest
{
    public string Name { get; set; } = "";
    public string Task { get; set; } = "";
    public string Due { get; set; } = "";
    public string? Importance { get; set; }
    public string? Fee { get; set; }
}

public sealed class DeliverableToggleRequest
{
    public string BrandName { get; set; } = "";
    public string Task { get; set; } = "";
}

public sealed class PaymentRequest
{
    public string Brand { get; set; } = "";
    public string Amount { get; set; } = "";
    public string? Status { get; set; }
    public string? Method { get; set; }
}

public sealed class ProofRequest
{
    public string Brand { get; set; } = "";
    public string Date { get; set; } = "";
}

public sealed class BookSessionRequest
{
    public string Coach { get; set; } = "";
    public string? Stage { get; set; }
    public string? NextSession { get; set; }
}

public sealed class StepRequest
{
    public string Step { get; set; } = "";
}

public sealed record AuthResponse(string Token, string Name, string Email, string Role);

public sealed class RegisterRequest
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

public sealed class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}
