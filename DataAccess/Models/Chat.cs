using DataAccess.Models.Enums;

namespace DataAccess.Models;

public class Chat
{
    public int Id { get; set; }

    public string? Name { get; set; }
    public ChatType Type { get; set; }

    public List<ChatMember> Members { get; set; } = new();
    public List<User> Users { get; set; } = new();

    public List<Message> Messages { get; set; } = new();

    public IDictionary<DateTime, List<Message>> MessagesByDate => Messages
        .GroupBy(m => m.CreatedAt.Date)
        .ToDictionary(e => e.Key, e => e.ToList());
}
