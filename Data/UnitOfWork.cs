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
        public ItblTeamsRepository TeamsRepository => new tblTeamsRepository(_mongodb);

        public ISeriesRepository SeriesRepository => new SeriesRepository(_mongodb);

        public IPlayersRepository PlayersRepository => new PlayersRepository(_mongodb);
    }
}
