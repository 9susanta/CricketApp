using CricketApp._helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IStartMatchRepository
    {
        Task<int> updateMatchTeamDetails(matchStartDto _matchStartDto);
        matchStartDto getMatchTeamDetails(int matchDetailsId);
        Task<int> NextId();
    }
}
