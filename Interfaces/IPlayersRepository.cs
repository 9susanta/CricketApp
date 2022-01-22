using CricketApp._helpers;
using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IPlayersRepository
    {
        Task<tblPlayers> GetPlayers(int objectId);
        Task<int> Create(tblPlayers tblPlayers);
        Task<PagedList<tblPlayers>> GetPlayersList(playerParam seriesParam);
        Task<bool> Update(int objectId, tblPlayers tblPlayers);
        Task<bool> Delete(int objectId);
        Task<bool> IsExist(string FirstName, string LastName, int InternationalTeam);
        Task<int> NextId();
    }
}
