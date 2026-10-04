using System.Globalization;

namespace CreatorFi.API.Infrastructure;

public static class TextFormats
{
    public static string TodayLabel() =>
        DateTime.Now.ToString("MMM d, yyyy", CultureInfo.GetCultureInfo("en-US"));

    public static string WithHandle(string? value)
    {
        var handle = value?.Trim() ?? "";
        if (handle.Length == 0)
        {
            return "";
        }

        return handle.StartsWith('@') ? handle : "@" + handle;
    }

    public static string Initials(string name)
    {
        var letters = string.Concat(
            name.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Take(2)
                .Select(part => char.ToUpperInvariant(part[0])));
        return letters.Length == 0 ? "NA" : letters;
    }

    public static string Or(string? value, string fallback)
    {
        var trimmed = value?.Trim() ?? "";
        return trimmed.Length == 0 ? fallback : trimmed;
    }
}
