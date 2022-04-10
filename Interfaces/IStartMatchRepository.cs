using CricketApp._helpers;
using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IStartMatchRepository
    {
        Task<int> updateMatchTeamDetails(matchStartDto _matchStartDto);
        Task<tblMatchDetails> getMatchTeamDetails(int matchDetailsId);
        Task<int> NextId();
    }
}
