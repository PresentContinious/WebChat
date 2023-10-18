using DataAccess.Models;
using DataAccess.Models.Enums;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<Chat> Chats { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<ChatMember> ChatMembers { get; set; } = null!;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Chat>()
            .HasMany(c => c.Users)
            .WithMany(m => m.Chats)
            .UsingEntity<ChatMember>(e => e.Property(p => p.Role).HasDefaultValue(MemberRole.Member));
    }
}
