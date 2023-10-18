using DataAccess.Models;
using Microsoft.AspNetCore.SignalR;

namespace WebChat.Core.Services;

public class ChatHub : Hub
{
    public async Task SendMessage(Chat chat)
    {
        await Clients.All.SendAsync("ReceiveMessage", chat);
    }
}
