using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using WebChat.Core.DTOs;

namespace WebChat.Core.Interfaces;

public interface IUserAuthenticationRepository
{
    Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);
    Task<IdentityResult> RegisterAdminAsync(UserRegistrationDto userRegistration);
    bool ValidateUser(UserLoginDto loginDto, out User? user);
    Task<User?> GetUserByName(string? name);
    Task<string> CreateTokenAsync(User user);
}
