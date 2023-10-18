namespace DataAccess.Models;

public class Message
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public int ChatId { get; set; }
    public Chat Chat { get; set; } = null!;

    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
}
