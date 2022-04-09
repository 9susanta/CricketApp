using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblMatchPlayer
    {
        public tblMatchPlayer()
        {
            this.created = DateTime.Now;
        }
        [BsonId]
        public int matchPlayerId { get; set; }
        public int matchDetailsId { get; set; }
        public int matchId { get; set; }
        public int teamId { get; set; }
        public string teamName { get; set; }
        public int playerId { get; set; }
        public string playerName { get; set; }
        public DateTime? created { get; set; }
        public DateTime? lastUpdated { get; set; }
    }
}
