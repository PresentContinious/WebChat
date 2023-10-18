using DataAccess.Models;
using DataAccess.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using WebChat.Core.DAL;
using WebChat.Core.DTOs;

namespace WebChat.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AccountController : Controller
{
    public AccountController(IUnitOfWork workModel)
    {
        WorkModel = workModel;
    }

    private IUnitOfWork WorkModel { get; }

    [HttpGet]
    [ActionName("me")]
    public async Task<IActionResult> GetHomePage()
    {
        var user = await WorkModel.UserRepository
            .GetFirstAsync(u => u.UserName == User.Identity!.Name, "Chats.Users", "Chats.Messages.User");

        if (user is null)
            return Redirect("/sign-in");

        return Json(user);
    }

    [HttpGet]
    [ActionName("contacts")]
    public async Task<IActionResult> GetContacts()
    {
        var user = await WorkModel.UserRepository
            .GetFirstAsync(u => u.UserName == User.Identity!.Name, "Chats.Users");

        return Json(user?.Chats
            .Where(c => c.Type == ChatType.Private)
            .Select(c => c.Users.First(u => u.Id != user.Id).UserName));
    }

    [HttpPost]
    [ActionName("chat")]
    public async Task<IActionResult> AddContact([FromBody] string username)
    {
        var user = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name, "Chats");
        var secondUser = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == username, "Chats");

        if (user is null)
            return Redirect("/sign-in");

        if (secondUser is null)
            return BadRequest("User is not found");

        user.Chats.Add(new Chat
        {
            Type = ChatType.Private,
            Members = new List<ChatMember>
            {
                new() { User = user, Role = MemberRole.Member },
                new() { User = secondUser, Role = MemberRole.Member }
            }
        });

        await WorkModel.SaveAsync();

        return Ok(user);
    }

    [HttpPost]
    [ActionName("role")]
    public async Task<IActionResult> SetRole([FromBody] RoleChangeDto roleChangeDto)
    {
        var user = await WorkModel.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name, "ChatMembers");
        if (user is null)
            return Redirect("/sign-in");

        var userToChange =
            await WorkModel.UserRepository.GetFirstAsync(u => u.Id == roleChangeDto.UserId, "ChatMembers");
        if (userToChange is null)
            return NotFound("User is not found");

        var member = userToChange.ChatMembers
            .First(c => c.UserId == userToChange.Id && c.ChatId == roleChangeDto.ChatId);

        if (member.Role != MemberRole.Creator)
            member.Role = roleChangeDto.Role;
        else
            return BadRequest("Creator can't change his role");

        await WorkModel.ChatMemberRepository.UpdateAsync(member);
        await WorkModel.SaveAsync();

        return Ok("Role changed");
    }
}
