using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CricketApp.Enums
{
    public class MatchTypes
    {
        public int Id { get; set; }
        public string MatchType { get; set; }
    }
    public class TypeList
    {
        public List<MatchTypes> _matchType=new List<MatchTypes>();
        public TypeList()
        {
            _matchType.Add(new MatchTypes() { Id = 1, MatchType = "International" });
            _matchType.Add(new MatchTypes() { Id = 2, MatchType = "Domestic" });
            _matchType.Add(new MatchTypes() { Id = 3, MatchType = "Club" });
        }
    }
}
