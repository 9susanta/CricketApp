using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp._helpers
{
    public class SquadDto
    {
        public int SquadsId { get; set; }
        public int SeriesId { get; set; }
        public string Series { get; set; }
        public int PlayersId { get; set; }
        public string Player { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
