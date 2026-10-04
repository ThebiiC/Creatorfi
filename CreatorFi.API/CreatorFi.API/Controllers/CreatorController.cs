using CreatorFi.Common.Models;
using CreatorFi.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CreatorFi.API.Controllers;

[ApiController]
[Authorize]
[Route("api/creator")]
public class CreatorController(CreatorService creator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CreatorSnapshot>> Get(CancellationToken ct) =>
        Ok(await creator.GetAsync(ct));

    [HttpPut("profile")]
    public async Task<IActionResult> SaveProfile(ProfileRequest request, CancellationToken ct) =>
        From(await creator.SaveProfileAsync(request, ct));

    [HttpPost("upgrade")]
    public async Task<IActionResult> Upgrade(CancellationToken ct) =>
        From(await creator.UpgradeAsync(ct));

    [HttpPut("platforms/{key}")]
    public async Task<IActionResult> UpdatePlatform(string key, PlatformUpdateRequest request, CancellationToken ct) =>
        From(await creator.UpdatePlatformAsync(key, request, ct));

    [HttpPost("posts")]
    public async Task<IActionResult> AddPost(PostRequest request, CancellationToken ct) =>
        From(await creator.AddPostAsync(request, ct));

    [HttpPost("brands")]
    public async Task<IActionResult> AddBrand(CreatorBrandRequest request, CancellationToken ct) =>
        From(await creator.AddBrandAsync(request, ct));

    [HttpPatch("deliverables")]
    public async Task<IActionResult> ToggleDeliverable(DeliverableToggleRequest request, CancellationToken ct) =>
        From(await creator.ToggleDeliverableAsync(request, ct));

    [HttpPost("payments")]
    public async Task<IActionResult> AddPayment(PaymentRequest request, CancellationToken ct) =>
        From(await creator.AddPaymentAsync(request, ct));

    [HttpPatch("payments/proof")]
    public async Task<IActionResult> MarkProof(ProofRequest request, CancellationToken ct) =>
        From(await creator.MarkProofAsync(request, ct));

    [HttpPut("coaching")]
    public async Task<IActionResult> BookSession(BookSessionRequest request, CancellationToken ct) =>
        From(await creator.BookSessionAsync(request, ct));

    [HttpPatch("steps")]
    public async Task<IActionResult> ToggleStep(StepRequest request, CancellationToken ct) =>
        From(await creator.ToggleStepAsync(request, ct));

    private static IActionResult From(ServiceResult<CreatorMutation> result)
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
