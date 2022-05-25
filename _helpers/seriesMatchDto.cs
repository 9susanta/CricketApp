using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp._helpers
{
    public class seriesMatchDto
    {
        public int matchId { get; set; }

        public string matchName { get; set; }

        public int? matchTypeId { get; set; }

        public string matchTypes { get; set; }

        public int teamHomeId { get; set; }

        public string teamHomeName { get; set; }

        public int teamVisitingId { get; set; }

        public string teamVisitingName { get; set; }

        public string location { get; set; }

        public DateTime fromDate { get; set; }

        public DateTime toDate { get; set; }

        public string StatusName { get; set; }

        public int seriesId { get; set; }
        public string hmteamplrDetails { get; set; }
        public string visitteamplrDetails { get; set; }
    }
}
