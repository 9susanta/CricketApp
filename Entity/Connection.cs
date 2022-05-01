using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class Connection
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public Connection()
        {
        }

        public Connection(string connectionId, string groupName)
        {
            ConnectionId = connectionId;
            GroupName = groupName;
        }
        public string GroupName { get; set; }
        public string ConnectionId { get; set; }
    }
}
