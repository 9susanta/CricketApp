using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IScoreRepository
    {
        void AddGroup(Group group);
        void AddConnections(Connection Connections);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetLiveScoreGroup(string groupName);
        void RemoveConnection(Connection connection);
        Task<Connection> GetGroupForConnection(string connectionId);
    }
}
