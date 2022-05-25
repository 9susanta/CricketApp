using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblMatchDetails
    {
        public tblMatchDetails()
        {
            this.created = DateTime.Now;
        }
        [BsonId]
        public int matchDetailsId { get; set; }
        public int matchId { get; set; }
        public int matchName { get; set; }
        public int teamHomeId { get; set; }
        public string teamHomeName { get; set; }
        public int teamVisitingId { get; set; }
        public string teamVisitingName { get; set; }
        public int totalOvers { get; set; }
        public int tossWinTeamId { get; set; }
        public string tossWinTeamName { get; set; }
        public string tossDecideName { get; set; }
        public string tossBatting { get; set; }
        public string teamHomePlayers { get; set; }
        public string teamVisitingPlayers { get; set; }
        public int teamHomeBattingOrder { get; set; }
        public int teamVisitingBattingOrder { get; set; }
        public string matchStatus { get; set; }
        public int battingFirstScored { get; set; }
        public string battingFirstTeamName { get; set; }
        public int battingFirstWicketFall { get; set; }
        public string battingFirstOverFaced { get; set; }
        public int battingSecondtScored { get; set; }
        public string battingSecondTeamName { get; set; }
        public int battingSecondWicketFall { get; set; }
        public string battingSecondOverFaced { get; set; }
        public string result { get; set; }

        public DateTime? created { get; set; }
        public DateTime? lastUpdated { get; set; }
    }
}
