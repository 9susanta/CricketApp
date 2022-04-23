using CricketApp._helpers;
using CricketApp.Entity;
using CricketApp.Interfaces;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
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
        private readonly IMongoCollection<tblMatchScoreboardDetails> _tblMatchScoreboardDetails;
        public StartMatchRepository(IMongoDatabase _mongoDatabase)
        {
            _tblMatchDetails = _mongoDatabase.GetCollection<tblMatchDetails>(nameof(tblMatchDetails));
            _tblMatchScoreboardDetails = _mongoDatabase.GetCollection<tblMatchScoreboardDetails>(nameof(tblMatchScoreboardDetails));

        }
        public matchPlayerScoreDetails getMatchTeamDetails(int matchId)
        {
            try
            {
                var match_players = (from tmd in _tblMatchDetails.AsQueryable().AsEnumerable()
                                     join tmsd in _tblMatchScoreboardDetails.AsQueryable().AsEnumerable()
                                     on tmd.matchId equals tmsd.matchId 
                                     into tmp_ser
                                     from tmp_se in tmp_ser.DefaultIfEmpty()
                                     where tmd.matchId == matchId
                                     
                                     select new matchPlayerScoreDetails
                                     {
                                         matchDetailsId = tmd.matchDetailsId,
                                         matchId = tmd.matchId,
                                         teamAId = tmd.teamAId,
                                         teamAName = tmd.teamAName,
                                         teamBId = tmd.teamBId,
                                         teamBName = tmd.teamBName,
                                         totalOvers = tmd.totalOvers,
                                         tossWinTeamId = tmd.tossWinTeamId,
                                         tossWinTeamName = tmd.tossWinTeamName,
                                         tossDecideName = tmd.tossDecideName,
                                         tossBatting = tmd.tossBatting,
                                         created = tmd.created,
                                         lastUpdated = tmd.lastUpdated,
                                         teamAPlayers = tmd.teamAPlayers,
                                         teamBPlayers = tmd.teamBPlayers,
                                         teamABattingOrder = tmd.teamABattingOrder,
                                         teamBBattingOrder = tmd.teamBBattingOrder,

                                         matchStatus = tmd.matchStatus,
                                         battingFirstScored = tmd.battingFirstScored,
                                         battingFirstTeamName = tmd.battingFirstTeamName,
                                         battingFirstWicketFall = tmd.battingFirstWicketFall,
                                         battingFirstOverFaced = tmd.battingFirstOverFaced,
                                         battingSecondtScored = tmd.battingSecondtScored,
                                         battingSecondTeamName = tmd.battingSecondTeamName,
                                         battingSecondWicketFall = tmd.battingSecondWicketFall,
                                         battingSecondOverFaced = tmd.battingSecondOverFaced,
                                         result = tmd.result,
                                         currentmatchDetails = tmp_se?.currentmatchDetails
                                     });


                return match_players.FirstOrDefault();
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
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

        public async Task<int> updateCurrentMatchDetails(matchDto _matchDetailsDto)
        {
            var isExist = _tblMatchScoreboardDetails.Find(x => x.matchId == _matchDetailsDto.matchId).FirstOrDefault();
            if (isExist == null)
            {
                 tblMatchScoreboardDetails _tblMatchScoreboards = new tblMatchScoreboardDetails();
                _tblMatchScoreboards.matchId = _matchDetailsDto.matchId.Value;
                _tblMatchScoreboards.currentmatchDetails = _matchDetailsDto.currentmatchDetails;
                _tblMatchScoreboardDetails.InsertOne(_tblMatchScoreboards);
            }
            else
            {
                var filter = Builders<tblMatchScoreboardDetails>.Filter.Eq(c => c.matchId, _matchDetailsDto.matchId);
                var update = Builders<tblMatchScoreboardDetails>.Update
                 .Set(c => c.currentmatchDetails, _matchDetailsDto.currentmatchDetails);

                var result = await _tblMatchScoreboardDetails.UpdateOneAsync(filter, update);
            }
            return 1;
        }

        public async Task<int> updateMatchTeamDetails(matchStartDto matchStartDto)
        {
            var isExist = _tblMatchDetails.Find(x => x.matchId==matchStartDto.matchId).FirstOrDefault();
            if (isExist==null)
            {
                int nextId = await NextId();
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
                _matchDetails.teamABattingOrder = matchStartDto.teamABattingOrder;
                _matchDetails.teamBBattingOrder = matchStartDto.teamBBattingOrder;
                _matchDetails.battingFirstTeamName = matchStartDto.battingFirstTeamName;
                _matchDetails.battingSecondTeamName = matchStartDto.battingSecondTeamName;
                _tblMatchDetails.InsertOne(_matchDetails);
            }
            else
            {
                var filter = Builders<tblMatchDetails>.Filter.Eq(c => c.matchId, matchStartDto.matchId);
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
                 .Set(c => c.lastUpdated, DateTime.Now)
                 .Set(c => c.teamABattingOrder, matchStartDto.teamABattingOrder)
                 .Set(c => c.teamBBattingOrder, matchStartDto.teamBBattingOrder)
                 .Set(c => c.battingFirstTeamName, matchStartDto.battingFirstTeamName)
                 .Set(c => c.battingSecondTeamName, matchStartDto.battingSecondTeamName)
                 .Set(c => c.battingFirstScored, matchStartDto.battingFirstScored)
                 .Set(c => c.battingFirstWicketFall, matchStartDto.battingFirstWicketFall)
                 .Set(c => c.battingFirstOverFaced, matchStartDto.battingFirstOverFaced)
                 .Set(c => c.battingSecondOverFaced, matchStartDto.battingSecondOverFaced)
                 .Set(c => c.battingSecondtScored, matchStartDto.battingSecondtScored)
                 .Set(c => c.battingSecondWicketFall, matchStartDto.battingSecondWicketFall)
                 .Set(c => c.matchStatus, matchStartDto.matchStatus)
                 .Set(c => c.result, matchStartDto.result);

                 var result = await _tblMatchDetails.UpdateOneAsync(filter, update);

            }
            return 1;
        }
    }
}
