using DataAccess.Models;

namespace WebChat.Core.DTOs;

public class ChatMessage
{
    public string Message { get; set; } = null!;
    public int ChatId { get; set; }
}
