using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IMatchRepository
    {
        Task<tblMatch> GetMatchs(int objectId);
        Task<int> Create(tblMatch tblMatchs);
        Task<IEnumerable<tblMatch>> GetMatchsList();
        Task<bool> Update(int objectId, tblMatch tblMatchs);
        Task<bool> Delete(int objectId);
        Task<bool> IsExist(string Name, string MatchTypes);
        Task<int> NextId();
    }
}
