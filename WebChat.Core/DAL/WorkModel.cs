using DataAccess;
using DataAccess.Models;
using DataAccess.Repositories.Interfaces;
using DataAccess.Repositories.Operations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using WebChat.Core.Interfaces;
using WebChat.Core.Services;

namespace WebChat.Core.DAL;

public class WorkModel : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public WorkModel(ApplicationDbContext context, UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _context = context;
        UserAuthentication = new UserAuthenticationRepository(userManager, roleManager, configuration);
        ChatRepository = new GenericRepository<Chat>(_context);
        UserRepository = new GenericRepository<User>(_context);
        ChatMemberRepository = new GenericRepository<ChatMember>(_context);
    }

    public IGenericRepository<Chat> ChatRepository { get; }
    public IGenericRepository<ChatMember> ChatMemberRepository { get; }
    public IGenericRepository<User> UserRepository { get; }
    public IUserAuthenticationRepository UserAuthentication { get; }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    private bool _disposed;

    private void Dispose(bool disposing)
    {
        if (!_disposed)
            if (disposing)
                _context.Dispose();

        _disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
