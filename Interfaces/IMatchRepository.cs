using CricketApp._helpers;
using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IMatchRepository
    {
        Task<int> Create(tblMatch tblMatchs);
        Task<PagedList<tblMatch>> GetMatchsList(matchParam teamParam);
        List<seriesMatchDto> GetMatchById(int Id);
        Task<bool> Update(int objectId, tblMatch tblMatchs);
        Task<bool> Delete(int objectId);
        Task<bool> IsExist(string Name, string MatchTypes);
        Task<int> NextId();
    }
}
