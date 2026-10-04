using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CreatorFi.Data;

public class CreatorFiDbContext(DbContextOptions<CreatorFiDbContext> options) : DbContext(options)
{
    public DbSet<Influencer> Influencers => Set<Influencer>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<ApplicationRecord> Applications => Set<ApplicationRecord>();
    public DbSet<CoachingRecord> CoachingRecords => Set<CoachingRecord>();
    public DbSet<VettingRecord> VettingRecords => Set<VettingRecord>();
    public DbSet<ActivityItem> ActivityItems => Set<ActivityItem>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<PlanFeature> PlanFeatures => Set<PlanFeature>();
    public DbSet<WorkspaceSetting> WorkspaceSettings => Set<WorkspaceSetting>();
    public DbSet<CreatorProfile> CreatorProfiles => Set<CreatorProfile>();
    public DbSet<PlatformStat> PlatformStats => Set<PlatformStat>();
    public DbSet<TopPost> TopPosts => Set<TopPost>();
    public DbSet<CreatorBrandDeal> CreatorBrands => Set<CreatorBrandDeal>();
    public DbSet<Deliverable> Deliverables => Set<Deliverable>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<SarsStep> SarsSteps => Set<SarsStep>();
    public DbSet<CreatorCoaching> CreatorCoaching => Set<CreatorCoaching>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApplicationRecord>().ToTable("Applications");
        modelBuilder.Entity<WorkspaceSetting>().ToTable("WorkspaceSettings");
        modelBuilder.Entity<CreatorBrandDeal>().ToTable("CreatorBrands");
        modelBuilder.Entity<SarsStep>().ToTable("SarsSteps");
        modelBuilder.Entity<CreatorCoaching>().ToTable("CreatorCoaching");

        modelBuilder.Entity<Influencer>().Property(item => item.Handle).HasMaxLength(100);
        modelBuilder.Entity<Influencer>().HasIndex(item => item.Handle).IsUnique();

        modelBuilder.Entity<VettingRecord>().Property(item => item.Handle).HasMaxLength(100);
        modelBuilder.Entity<VettingRecord>().HasIndex(item => item.Handle).IsUnique();

        modelBuilder.Entity<Plan>().Property(item => item.Name).HasMaxLength(50);
        modelBuilder.Entity<Plan>().HasIndex(item => item.Name).IsUnique();
        modelBuilder.Entity<Plan>()
            .HasMany(item => item.Features)
            .WithOne(item => item.Plan)
            .HasForeignKey(item => item.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlatformStat>().Property(item => item.PlatformKey).HasMaxLength(50);
        modelBuilder.Entity<PlatformStat>().HasIndex(item => item.PlatformKey).IsUnique();

        modelBuilder.Entity<UserAccount>().ToTable("UserAccounts");
        modelBuilder.Entity<UserAccount>().Property(item => item.Name).HasMaxLength(200);
        modelBuilder.Entity<UserAccount>().Property(item => item.Email).HasMaxLength(320);
        modelBuilder.Entity<UserAccount>().HasIndex(item => item.Email).IsUnique();
        modelBuilder.Entity<UserAccount>().Property(item => item.Handle).HasMaxLength(100);
        modelBuilder.Entity<UserAccount>().Property(item => item.Avatar).HasMaxLength(10);
        modelBuilder.Entity<UserAccount>().Property(item => item.Location).HasMaxLength(200);
        modelBuilder.Entity<UserAccount>().Property(item => item.Plan).HasMaxLength(50);
        modelBuilder.Entity<UserAccount>().Property(item => item.IdReference).HasMaxLength(20);
        modelBuilder.Entity<UserAccount>().Property(item => item.Role).HasMaxLength(20);
        modelBuilder.Entity<UserAccount>().Property(item => item.PasswordHash).HasMaxLength(500);

        modelBuilder.Entity<CreatorBrandDeal>()
            .HasMany(item => item.Deliverables)
            .WithOne(item => item.CreatorBrand)
            .HasForeignKey(item => item.CreatorBrandId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CreatorFiDbContextFactory : IDesignTimeDbContextFactory<CreatorFiDbContext>
{
    public CreatorFiDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<CreatorFiDbContext>()
            .UseSqlServer("Server=localhost\\SQLEXPRESS;Database=CreatorFi;Trusted_Connection=True;TrustServerCertificate=True")
            .Options;
        return new CreatorFiDbContext(options);
    }
}
