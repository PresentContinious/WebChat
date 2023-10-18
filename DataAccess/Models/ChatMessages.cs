namespace DataAccess.Models;

public class ChatMessages
{
    public int Id { get; set; }

    public int ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public int MessageId { get; set; }
    public Message Message { get; set; } = null!;

    public bool IsRead { get; set; }
}
