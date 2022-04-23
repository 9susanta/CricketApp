using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblMatchScoreboardDetails
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public int matchId { get; set; }
        public string currentmatchDetails { get; set; }
        public tblMatchScoreboardDetails()
        {
            _id = ObjectId.GenerateNewId();
        }
    }
}
