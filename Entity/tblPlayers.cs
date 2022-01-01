using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Entity
{
    public class tblPlayers
    {
        public tblPlayers()
        {
            this.Created = DateTime.Now;
        }
        [BsonId]
        public int PlayersId { get; set; }
        public string JerseyNo { get; set; }
        public string JerseyName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Dob { get; set; }
        public int? InternationalTeam { get; set; }
        public int? DomesticTeam { get; set; }
        public int? ClubTeams { get; set; }
        public int? LocalTeams { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleated { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
