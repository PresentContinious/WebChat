using Microsoft.AspNetCore.Identity;

namespace DataAccess.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string FullName => $"{FirstName} {LastName}";

    public List<Chat> Chats { get; set; } = new List<Chat>();
    public List<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();
}
