using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class MatchRepository : IMatchRepository
    {
        private readonly IMongoCollection<tblMatch> _tblMatches;
        public MatchRepository(IMongoDatabase _mongoDatabase)
        {
            _tblMatches = _mongoDatabase.GetCollection<tblMatch>(nameof(tblMatch));

        }
        public async Task<int> Create(tblMatch tblMatchs)
        {
            try
            {
                var isExist = await IsExist(tblMatchs.MatchName, tblMatchs.MatchTypes);
                if (!isExist)
                {
                    tblMatchs.MatchId = await NextId();
                    await _tblMatches.InsertOneAsync(tblMatchs);

                    return 1;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        public async Task<bool> Delete(int objectId)
        {
            try
            {
                var filter = Builders<tblMatch>.Filter.Eq(c => c.MatchId, objectId);
                var update = Builders<tblMatch>.Update
                 .Set(c => c.IsDeleated, true);
                var result = await _tblMatches.UpdateOneAsync(filter, update);
                if (result.ModifiedCount > 0)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }

        public Task<tblMatch> GetMatchs(int objectId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<tblMatch>> GetMatchsList()
        {
            var matches = await _tblMatches.Find(x => x.IsDeleated == false).ToListAsync();

            return matches;
        }

        public async Task<bool> IsExist(string Name, string MatchTypes)
        {
            try
            {
                var res = await _tblMatches.FindAsync(x => x.MatchName == Name && x.MatchTypes == MatchTypes);
                return res.Any();
            }
            catch (Exception ex)
            {

                return true;
            }
        }

        public async Task<int> NextId()
        {
            try
            {
                var series = await _tblMatches.FindAsync(x => x.Created != null);

                var last_item = series.ToList().OrderByDescending(x => x.Created).FirstOrDefault();

                if (last_item != null)
                {
                    return (last_item.MatchId + 1);
                }
            }
            catch (Exception ex)
            {
            }
            return 1;
        }

        public async Task<bool> Update(int objectId, tblMatch tblMatchs)
        {
            try
            {
                var filter = Builders<tblMatch>.Filter.Eq(c => c.MatchId, objectId);
                var update = Builders<tblMatch>.Update
                 .Set(c => c.MatchName, tblMatchs.MatchName)
                 .Set(c => c.MatchTypes, tblMatchs.MatchTypes)
                 .Set(c => c.MatchTypeId, tblMatchs.MatchTypeId)
                 .Set(c => c.Status, tblMatchs.Status)
                  .Set(c => c.StatusName, tblMatchs.StatusName)
                 .Set(c => c.LastUpdated, DateTime.Now);
                var result = await _tblMatches.UpdateOneAsync(filter, update);
                if (result.ModifiedCount > 0)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
