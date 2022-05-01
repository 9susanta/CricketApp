using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Interfaces
{
    public interface IUnitOfWork
    {
        ITeamsRepository TeamsRepository { get; }
        ISeriesRepository SeriesRepository { get; }
        IPlayersRepository PlayersRepository { get; }
        ISquadRepository SquadRepository { get; }
        IMatchRepository MatchRepository { get; }
        IStartMatchRepository StartMatchRepository { get; }
        IScoreRepository ScoreRepository { get; }

    }
}
