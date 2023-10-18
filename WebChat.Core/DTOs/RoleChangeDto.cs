using DataAccess.Models.Enums;

namespace WebChat.Core.DTOs;

public class RoleChangeDto
{
    public MemberRole Role { get; set; }
    public string UserId { get; set; } = null!;
    public int ChatId { get; set; }
}
