using WebChat.Core.DTOs;

namespace WebChat.Core.Interfaces;

public interface IChatClient
{
    Task ReceiveMessage(ChatMessage message);
}
