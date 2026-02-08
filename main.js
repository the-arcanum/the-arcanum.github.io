var members = [];

var rankClassMap = new Map([
      // Class I
      ["Acolyte", "Class I"],

      // Class II
      ["Mage", "Class II"],

      // Class III
      ["Senior Mage", "Class III"],

      // Class IV
      ["High Mage", "Class IV"],
      ["Enchanter", "Class IV"],
      ["Alchemist", "Class IV"],
      ["Artificer", "Class IV"],
      ["Healer", "Class IV"],
      ["Priest", "Class IV"],
      ["Druid", "Class IV"],
      ["Arcane Knight", "Class IV"],
      ["Bard", "Class IV"],

      // Class V
      ["Archmage", "Class V"],
      ["Grand Enchanter", "Class V"],
      ["Grand Alchemist", "Class V"],
      ["Grand Artificer", "Class V"],
      ["Grand Healer", "Class V"],
      ["High Priest", "Class V"],
      ["Archdruid", "Class V"],
      ["Arcane Champion", "Class V"],
      ["Grand Bard", "Class V"],
    ]);

const classPriority = {
  "Class V": 5,
  "Class IV": 4,
  "Class III": 3,
  "Class II": 2,
  "Class I": 1,
};

const classIcons = {
  "Class V": "gold.svg",
  "Class IV": "copper.svg",
  "Class III": "iron.svg",
  "Class II": "tin.svg",
  "Class I": "lead.svg",
};

var members = [];

$.getJSON("members.json", function(json) {
    for(var i = 0; i < json.length; i++) {
    	members.push(json[i]);
	}

	members = sortMembers(members);

    loadMembers();
});


function loadMembers() {
	$("#members").empty();

	document.getElementById("members").style.display = "none";

	var counter = 0;
	$.each(members, function(i,m) {
            var imageUrl = "https://render.crafty.gg/3d/bust/" + m.name;
            var memberClass = rankClassMap.get(m.rank);
            var memberClassId = memberClass.toLowerCase().trim().replace(/\s+/g, "-");
            var memberRank = m.rank.toLowerCase().trim().replace(/\s+/g, "-");
            var classIcon = classIcons[memberClass];
			var card = '<div class="rank-card ' + memberRank + ' ' + memberClassId +'"><div class="rank-header"><span class="shine"></span><h1 class="rank-number">' + memberClass + '</h1>'
			+ '<img src="' + imageUrl + '"></div><div class="mage-info"><h2>' + m.name + '</h2><div class="mage-titles"><div class="mage-title">'
			+ '<span class="icon" style="--icon: url(resources/' + classIcon + ')"></span><h3>' + m.rank + '</h3></div><p class="origin">' + m.origin + '</p>'
			+ '<p class="class">' + m.class + '</p></div></div>';

			if (m.faction != null && m.faction != "") {
			  card += '<div class="region">' + m.faction + '</div>';
			}

			card += '</div>';

            $("#members").append(card);
    });
	document.getElementById("members").style.display = "flex";
	document.getElementById("footer").style.display = "flex";
}

function filterMembersByRank(rank, tabElement) {
  // Update active tab
  document.querySelectorAll(".tabs .tab").forEach(t => t.classList.remove("active"));
  tabElement.classList.add("active");

  const rankClass = rank.toLowerCase().trim().replace(/\s+/g, "-");
  const memberElements = document.getElementById("members").children;

  for (let m of memberElements) {
    m.style.display = m.classList.contains(rankClass) ? "flex" : "none";
  }
}

// Show all members
function showAllMembers(tabElement) {
  setActiveTab(tabElement);
  const members = document.getElementById("members").children;
  for (let m of members) m.style.display = "flex";

  document.getElementById("no-members").style.display = "none";
}

function showByClass(className, tabElement) {
  setActiveTab(tabElement);
  const memberElements = document.getElementById("members").children;

  var shownCount = 0;

  for (let m of memberElements) {
    if (m.classList.contains(className)) {
      m.style.display = "flex";
      shownCount++;
    } else {
      m.style.display = "none";
    }
  }

  document.getElementById("no-members").style.display = shownCount == 0 ? "block" : "none";
}

function setActiveTab(tabElement) {
  document.querySelectorAll(".tabs .tab").forEach(t => t.classList.remove("active"));
  tabElement.classList.add("active");
}

function sortMembers(members) {
  return members.sort((a, b) => {
    const classA = rankClassMap.get(a.rank); // "Class II", etc.
    const classB = rankClassMap.get(b.rank);

    const classDiff = classPriority[classB] - classPriority[classA];
    if (classDiff !== 0) return classDiff;

    // Tiebreaker: earlier lastUpdate first
    return Number(a.lastUpdate) - Number(b.lastUpdate);
  });
}