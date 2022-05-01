using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class Group
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public Group()
        {
        }

        public Group(string name)
        {
            Name = name;
        }
        public string Name { get; set; }
    }
}
