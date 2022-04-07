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
        Task<int> UpdateSquad(List<tblSquads> squads);
        Task<PagedList<SquadDto>> GetSquad(squadParam squadParam);
    }
}
