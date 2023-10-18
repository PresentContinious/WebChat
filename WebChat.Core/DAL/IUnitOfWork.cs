using DataAccess.Models;
using DataAccess.Repositories.Interfaces;
using WebChat.Core.Interfaces;

namespace WebChat.Core.DAL;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Chat> ChatRepository { get; }
    IGenericRepository<ChatMember> ChatMemberRepository { get; }
    IGenericRepository<User> UserRepository { get; }
    IUserAuthenticationRepository UserAuthentication { get; }
    Task SaveAsync();
}
