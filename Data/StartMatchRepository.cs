using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Data
{
    public class StartMatchRepository : IStartMatchRepository
    {
        private readonly IMongoCollection<tblMatchDetails> _tblMatchDetails;
        private readonly IMongoCollection<tblMatchPlayer> _tblMatchPlayer;
        public StartMatchRepository(IMongoDatabase _mongoDatabase)
        {
            _tblMatchDetails = _mongoDatabase.GetCollection<tblMatchDetails>(nameof(tblMatchDetails));
            _tblMatchPlayer = _mongoDatabase.GetCollection<tblMatchPlayer>(nameof(tblMatchPlayer));

        }
        public matchStartDto getMatchTeamDetails(int matchDetailsId)
        {
            var matchDetails = from tmd in _tblMatchDetails.AsQueryable()
                               join tmp in _tblMatchPlayer.AsQueryable()
                               on tmd.matchDetailsId equals tmp.matchDetailsId
                               where tmp.matchDetailsId == matchDetailsId
                               select new matchStartDto
                               {
                                   matchDetailsId=tmd.matchDetailsId,
                                   matchId=tmd.matchId,
                                   teamAId=tmd.teamAId,
                                   teamBId=tmd.teamBId,
                                   teamAName=tmd.teamAName,
                                   teamBName=tmd.teamBName,
                                   tossBatting=tmd.tossBatting,
                                   tossDecideName=tmd.tossDecideName,
                                   tossWinTeamId=tmd.tossWinTeamId,
                                   tossWinTeamName=tmd.tossWinTeamName,
                                   totalOvers=tmd.totalOvers,
                                   matchPlayerDetails = tmp
                          };
            return matchDetails.FirstOrDefault();
        }

        public async Task<int> NextId()
        {
            try
            {
                var series = await _tblMatchDetails.FindAsync(x => x.created != null);

                var last_item = series.ToList().OrderByDescending(x => x.created).FirstOrDefault();

                if (last_item != null)
                {
                    return (last_item.matchDetailsId + 1);
                }
            }
            catch (Exception ex)
            {
            }
            return 1;
        }
        public async Task<int> updateMatchTeamDetails(matchStartDto matchStartDto)
        {
            var isExist = _tblMatchDetails.Find(x => x.matchId==matchStartDto.matchId).FirstOrDefault();
            int nextId = await NextId();
            if (isExist==null)
            {
                tblMatchDetails _matchDetails = new tblMatchDetails();
                _matchDetails.matchDetailsId = nextId;
                _matchDetails.matchId = matchStartDto.matchId.Value;
                _matchDetails.teamAId = matchStartDto.teamAId.Value;
                _matchDetails.teamAName = matchStartDto.teamAName;
                _matchDetails.teamBId = matchStartDto.teamBId.Value;
                _matchDetails.teamBName = matchStartDto.teamBName;
                _matchDetails.tossDecideName = matchStartDto.tossDecideName;
                _matchDetails.tossWinTeamId = matchStartDto.tossWinTeamId.Value;
                _matchDetails.tossWinTeamName = matchStartDto.tossWinTeamName;
                _matchDetails.totalOvers = matchStartDto.totalOvers.Value;
                _matchDetails.tossBatting = matchStartDto.tossBatting;
                _matchDetails.teamAPlayers= matchStartDto.teamAPlayers;
                _matchDetails.teamBPlayers = matchStartDto.teamBPlayers;
                _tblMatchDetails.InsertOne(_matchDetails);
            }
            else
            {
                var filter = Builders<tblMatchDetails>.Filter.Eq(c => c.matchDetailsId, matchStartDto.matchDetailsId);
                var update = Builders<tblMatchDetails>.Update
                 .Set(c => c.matchId, matchStartDto.matchId.Value)
                 .Set(c => c.teamAId, matchStartDto.teamAId.Value)
                 .Set(c => c.teamAName, matchStartDto.teamAName)
                 .Set(c => c.teamBId, matchStartDto.teamBId.Value)
                 .Set(c => c.teamBName, matchStartDto.teamBName)
                 .Set(c => c.tossDecideName, matchStartDto.tossDecideName)
                 .Set(c => c.tossWinTeamId, matchStartDto.tossWinTeamId.Value)
                 .Set(c => c.tossWinTeamName, matchStartDto.tossWinTeamName)
                 .Set(c => c.totalOvers, matchStartDto.totalOvers)
                 .Set(c => c.tossBatting, matchStartDto.tossBatting)
                 .Set(c => c.teamAPlayers, matchStartDto.teamAPlayers)
                 .Set(c => c.teamBPlayers, matchStartDto.teamBPlayers)
                 .Set(c => c.lastUpdated, DateTime.Now);
                var result = await _tblMatchDetails.UpdateOneAsync(filter, update);

            }
            return 1;
        }
    }
}
