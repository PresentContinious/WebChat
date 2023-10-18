using DataAccess.Models;
using DataAccess.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using WebChat.Core.DAL;
using WebChat.Core.DTOs;

namespace WebChat.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ChatController : Controller
{
    private IUnitOfWork WorkModel { get; }

    public ChatController(IUnitOfWork workModel)
    {
        WorkModel = workModel;
    }

    [HttpGet("{id:int}")]
    [ActionName("get")]
    public async Task<IActionResult> Get(int id)
    {
        var chat = await WorkModel.ChatRepository.GetFirstAsync(c => c.Id == id, "Messages.User", "Users", "Members");
        if (chat is null)
            return NotFound("Chat is not found");

        var user = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name);
        if (user is null)
            return Redirect("/sign-in");

        return Json(new
        {
            chat,
            userId = user.Id,
            canEdit = chat.Members
                .First(m => m.UserId == user.Id).Role is MemberRole.Admin or MemberRole.Creator
        });
    }

    [HttpPost]
    [ActionName("new")]
    public async Task<IActionResult> AddGroup([FromBody] GroupDto group)
    {
        var user = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name);
        if (user is null)
            return Redirect("/sign-in");

        var chat = new Chat
        {
            Name = group.Name,
            Type = ChatType.Group,
            Members = new List<ChatMember> { new() { User = user, Role = MemberRole.Creator } }
        };

        foreach (var contact in group.Contacts)
        {
            var contactUser = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == contact);
            if (contactUser is null)
                return NotFound("User is not found");

            chat.Members.Add(new ChatMember
            {
                User = contactUser,
                Role = MemberRole.Member
            });
        }

        await WorkModel.ChatRepository.InsertAsync(chat);
        await WorkModel.SaveAsync();

        return Ok(chat);
    }

    [HttpPost]
    [ActionName("message")]
    public async Task<IActionResult> Post([FromBody] ChatMessage message)
    {
        var chat = await WorkModel.ChatRepository
            .GetFirstAsync(c => c.Id == message.ChatId, "Messages.User", "Users", "Members");

        if (chat is null)
            return NotFound("Chat is not found");

        var user = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name);
        if (user is null)
            return Redirect("/sign-in");

        var chatMember = chat.Members.FirstOrDefault(m => m.UserId == user.Id);
        if (chatMember is null)
            return BadRequest("You are not a member of this chat");

        if (chatMember.Role != MemberRole.Admin &&
            chatMember.Role != MemberRole.Creator &&
            chatMember.Role != MemberRole.Member)
            return BadRequest("You are not allowed to send messages");

        chat.Messages.Add(new Message
        {
            Text = message.Message,
            User = user,
            CreatedAt = DateTime.Now,
            Chat = chat
        });

        await WorkModel.SaveAsync();

        return Ok(new
        {
            chat,
            userId = user.Id,
            canEdit = chat.Members
                .First(m => m.UserId == user.Id).Role is MemberRole.Admin or MemberRole.Creator
        });
    }
}
