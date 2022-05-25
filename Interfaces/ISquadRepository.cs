using CricketApp._helpers;
using CricketApp.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface ISquadRepository
    {
        Task<int> UpdateSquadTeam(List<tblSquadTeam> squadsTeams);
        Task<int> UpdateSquadPlayer(tblSquadPlayer squadsPlayer);
        Task<List<squadDto>> GetSquad(int seriesId);
    }
}
