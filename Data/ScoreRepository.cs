using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class ScoreRepository: IScoreRepository
    {
        private readonly IMongoCollection<Group> _tblGroup;
        private readonly IMongoCollection<Connection> _tblConnection;
        public ScoreRepository(IMongoDatabase _mongoDatabase)
        {
            _tblGroup = _mongoDatabase.GetCollection<Group>(nameof(Group));
            _tblConnection = _mongoDatabase.GetCollection<Connection>(nameof(Connection));
        }
        public void AddGroup(Group group)
        {
            _tblGroup.InsertOne(group);
        }
        public void AddConnections(Connection Connections)
        {
            _tblConnection.InsertOne(Connections);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            var result= await _tblConnection.FindAsync(connectionId);
            return result.FirstOrDefault();
        }

        public async Task<Group> GetLiveScoreGroup(string groupName)
        {
            var result = await _tblGroup.FindAsync(x=>x.Name==groupName);
            return result.FirstOrDefault();
        }

        public void RemoveConnection(Connection connection)
        {
            var filter = Builders<Connection>.Filter.Eq(c=>c.ConnectionId, connection.ConnectionId);
            _tblConnection.DeleteOneAsync(filter);
        }

        public async Task<Connection> GetGroupForConnection(string connectionId)
        {
            return await Task.FromResult((from tmd in _tblGroup.AsQueryable().AsEnumerable()
                                          join tmsd in _tblConnection.AsQueryable().AsEnumerable()
                                          on tmd.Name equals tmsd.GroupName
                                          where tmsd.ConnectionId == connectionId
                                          select tmsd).FirstOrDefault());
        }

    }
}
