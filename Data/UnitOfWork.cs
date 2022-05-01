using CricketApp.DBConfiguration;
using CricketApp.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMongoDatabase _mongodb;
        public UnitOfWork(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _mongodb = client.GetDatabase(settings.DatabaseName);
        }
        public ITeamsRepository TeamsRepository => new tblTeamsRepository(_mongodb);

        public ISeriesRepository SeriesRepository => new SeriesRepository(_mongodb);

        public IPlayersRepository PlayersRepository => new PlayersRepository(_mongodb);

        public ISquadRepository SquadRepository => new SquadRepository(_mongodb);

        public IStartMatchRepository StartMatchRepository => new StartMatchRepository(_mongodb);

        public IMatchRepository MatchRepository => new MatchRepository(_mongodb);

        public IScoreRepository ScoreRepository => new ScoreRepository(_mongodb);
    }
}
