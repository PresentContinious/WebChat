namespace WebChat.Core.DTOs;

public class UserRegistrationDto
{
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string Password { get; init; } = null!;
    public string UserName { get; init; } = null!;
}
