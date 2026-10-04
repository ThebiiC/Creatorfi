using CreatorFi.Common.Models;
using CreatorFi.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreatorFi.API.Controllers;

[ApiController]
[Authorize]
[Route("api/workspace")]
public class WorkspaceController(WorkspaceService workspace) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<WorkspaceSnapshot>> Get(CancellationToken ct) =>
        Ok(await workspace.GetAsync(ct));

    [HttpPost("applications")]
    public async Task<IActionResult> AddApplication(ApplicationRequest request, CancellationToken ct) =>
        From(await workspace.AddApplicationAsync(request, ct));

    [HttpPatch("applications/{id}/status")]
    public async Task<IActionResult> SetApplicationStatus(string id, StatusRequest request, CancellationToken ct) =>
        From(await workspace.SetApplicationStatusAsync(id, request.Status, ct));

    [HttpPost("influencers")]
    public async Task<IActionResult> AddInfluencer(InfluencerRequest request, CancellationToken ct) =>
        From(await workspace.AddInfluencerAsync(request, ct));

    [HttpPost("vetting/review")]
    public async Task<IActionResult> ReviewVetting(VettingReviewRequest request, CancellationToken ct) =>
        From(await workspace.ReviewVettingAsync(request, ct));

    [HttpPost("coaching")]
    public async Task<IActionResult> AssignCoach(CoachingAssignRequest request, CancellationToken ct) =>
        From(await workspace.AssignCoachAsync(request, ct));

    [HttpPost("coaching/complete")]
    public async Task<IActionResult> CompleteCoaching(HandleRequest request, CancellationToken ct) =>
        From(await workspace.CompleteCoachingAsync(request, ct));

    [HttpPost("brands")]
    public async Task<IActionResult> AddBrand(BrandRequest request, CancellationToken ct) =>
        From(await workspace.AddBrandAsync(request, ct));

    [HttpPost("campaigns")]
    public async Task<IActionResult> AddCampaign(CampaignRequest request, CancellationToken ct) =>
        From(await workspace.AddCampaignAsync(request, ct));

    [HttpPut("plan")]
    public async Task<IActionResult> ChoosePlan(PlanRequest request, CancellationToken ct) =>
        From(await workspace.ChoosePlanAsync(request, ct));

    private static IActionResult From(ServiceResult<WorkspaceMutation> result)
    {
        if (!result.IsSuccess || result.Value is null)
        {
            return new BadRequestObjectResult(new ApiMessage(
                result.ErrorTitle ?? "Request failed",
                result.ErrorMessage ?? "The API could not save that change."));
        }

        return new OkObjectResult(result.Value);
    }
}
