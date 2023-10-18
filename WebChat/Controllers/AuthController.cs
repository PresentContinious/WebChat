using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebChat.Core.DAL;
using WebChat.Core.DTOs;

namespace WebChat.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController : Controller
{
    private IUnitOfWork WorkModel { get; }

    public AuthController(IUnitOfWork workModel)
    {
        WorkModel = workModel;
    }

    [HttpPost]
    [ActionName("sign-up")]
    public async Task<IActionResult> SignUp([FromBody] UserRegistrationDto userRegistration)
    {
        IdentityResult userResult;
        if (userRegistration.UserName == "admin")
            userResult = await WorkModel.UserAuthentication.RegisterAdminAsync(userRegistration);
        else
            userResult = await WorkModel.UserAuthentication.RegisterUserAsync(userRegistration);

        return !userResult.Succeeded
            ? BadRequest(string.Join("\n", userResult.Errors.Select(e => e.Description)))
            : await SignIn(new UserLoginDto
                { UserName = userRegistration.UserName, Password = userRegistration.Password });
    }

    [HttpPost]
    [ActionName("sign-in")]
    public async Task<IActionResult> SignIn([FromBody] UserLoginDto userLogin)
    {
        var res = WorkModel.UserAuthentication.ValidateUser(userLogin, out User? user);

        return res
            ? Ok(new { Token = await WorkModel.UserAuthentication.CreateTokenAsync(user!) })
            : BadRequest("Invalid username or password");
    }
}
