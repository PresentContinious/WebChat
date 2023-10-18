using DataAccess.Models.Enums;

namespace DataAccess.Models;

public class ChatMember
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    public int ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public MemberRole Role { get; set; }
}
