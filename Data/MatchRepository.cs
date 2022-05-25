using CricketApp._helpers;
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
        private readonly IMongoCollection<tblMatchDetails> _tblMatchDetails;
        private readonly IMongoCollection<tblSquadPlayer> _tblSquadPlayer;

        public MatchRepository(IMongoDatabase _mongoDatabase)
        {
            _tblMatches = _mongoDatabase.GetCollection<tblMatch>(nameof(tblMatch));
            _tblMatchDetails= _mongoDatabase.GetCollection<tblMatchDetails>(nameof(tblMatchDetails));
            _tblSquadPlayer = _mongoDatabase.GetCollection<tblSquadPlayer>(nameof(tblSquadPlayer));
        }

        public async Task<int> Create(tblMatch tblMatchs)
        {
            try
            {
                var isExist = await IsExist(tblMatchs.matchName, tblMatchs.matchTypes);
                if (!isExist)
                {
                    tblMatchs.matchId = await NextId();
                    tblMatchs.IsDeleated = false;
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
                var filter = Builders<tblMatch>.Filter.Eq(c => c.matchId, objectId);
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

        public List<seriesMatchDto> GetMatchById(int matchId)
        {
            try
            {
                return (from mtc in _tblMatches.AsQueryable().ToEnumerable()
                                              join sqdplrhm in _tblSquadPlayer.AsQueryable().ToEnumerable()
                                              on new {x = mtc.seriesId,y = mtc.teamHomeId } equals new { x = sqdplrhm.seriesId, y = sqdplrhm.teamId }
                                              into joinDt1
                                              from homeplr in joinDt1.DefaultIfEmpty()

                                              join sqdplrvi in _tblSquadPlayer.AsQueryable().ToEnumerable()
                                              on new { x = mtc.seriesId, y = mtc.teamVisitingId } equals new { x = sqdplrvi.seriesId, y = sqdplrvi.teamId }
                                              into joinDt2
                                              from visitplr in joinDt2.DefaultIfEmpty()
                                              where mtc.matchId == matchId
                                              select new seriesMatchDto
                                              {
                                                  matchId = mtc.matchId,
                                                  matchName = mtc.matchName,
                                                  matchTypeId = mtc.matchTypeId,
                                                  matchTypes = mtc.matchTypes,
                                                  teamHomeId = mtc.teamHomeId,
                                                  teamHomeName = mtc.teamHomeName,
                                                  teamVisitingId = mtc.teamVisitingId,
                                                  teamVisitingName =mtc.teamVisitingName,
                                                  location = mtc.location,
                                                  fromDate = mtc.fromDate,
                                                  toDate =  mtc.toDate,
                                                  StatusName = mtc.StatusName,
                                                  seriesId = mtc.seriesId,
                                                  hmteamplrDetails = homeplr?.playerSquadDetails,
                                                  visitteamplrDetails = visitplr?.playerSquadDetails,
                                              }).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<PagedList<tblMatch>> GetMatchsList(matchParam teamParam)
        {
            var matches = await _tblMatches.Find(x => x.IsDeleated == false&&x.seriesId==teamParam.seriesId).ToListAsync();

            return PagedList<tblMatch>.CreateAsyc(matches.AsQueryable(), teamParam.PageNumber, teamParam.PageSize);
        }

        public async Task<bool> IsExist(string Name, string MatchTypes)
        {
            try
            {
                var res = await _tblMatches.FindAsync(x => x.matchName == Name && x.matchTypes == MatchTypes);
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
                var matches = await _tblMatchDetails.FindAsync(x => x.created!=null);

                var last_item = matches.ToList().OrderByDescending(x => x.matchId).FirstOrDefault();

                if (last_item != null)
                {
                    return (last_item.matchId + 1);
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
                var filter = Builders<tblMatch>.Filter.Eq(c => c.matchId, objectId);
                var update = Builders<tblMatch>.Update
                 .Set(c => c.matchName, tblMatchs.matchName)
                 .Set(c => c.matchTypes, tblMatchs.matchTypes)
                 .Set(c => c.matchTypeId, tblMatchs.matchTypeId)
                 .Set(c => c.teamHomeId, tblMatchs.teamHomeId)
                 .Set(c => c.teamHomeName, tblMatchs.teamHomeName)
                 .Set(c => c.teamVisitingId, tblMatchs.teamVisitingId)
                 .Set(c => c.teamVisitingName, tblMatchs.teamVisitingName)
                 .Set(c => c.location, tblMatchs.location)
                 .Set(c => c.fromDate, tblMatchs.fromDate)
                 .Set(c => c.toDate, tblMatchs.toDate)
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
