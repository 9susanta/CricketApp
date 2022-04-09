using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IUnitOfWork
    {
        ItblTeamsRepository TeamsRepository { get; }
        ISeriesRepository SeriesRepository { get; }
        IPlayersRepository PlayersRepository { get; }
        ISquadRepository SquadRepository { get; }
        IStartMatchRepository StartMatchRepository { get; }
    }
}
