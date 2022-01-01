using CricketApp.Entity;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface ItblTeamsRepository
    {
        Task<tblTeams> GetTeams(int objectId);
        Task<int> Create(tblTeams tblTeams);
        Task<IEnumerable<tblTeams>> GetTeamsList();
        Task<bool> Update(int objectId, tblTeams tblTeams);
        Task<bool> Delete(int objectId);
        Task<bool> IsExist(string Name,string TeamTypes);
        Task<int> NextId();

    }
}
