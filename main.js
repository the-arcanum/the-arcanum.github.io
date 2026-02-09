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

    renderMembers();
});


function renderMembers(filteredMembers = members) {
    const container = $("#members");
    container.empty();

    container.css("opacity", 0);

    filteredMembers.forEach((m, i) => {
        const skinId = m.skinId || m.name;
        const imageUrl = "https://render.crafty.gg/3d/bust/" + skinId;
        const memberClass = rankClassMap.get(m.rank);
        const memberClassId = memberClass.toLowerCase().replace(/\s+/g, "-");
        const memberRank = m.rank.toLowerCase().replace(/\s+/g, "-");
        const classIcon = classIcons[memberClass];

        const card = `
            <div class="rank-card ${memberRank} ${memberClassId}" style="--rank-color: var(--${memberRank}); animation-delay: ${i*40}ms;">
                <div class="rank-inner">
                    <div class="rank-header">
                        <span class="shine"></span>
                        <h1 class="rank-number">${memberClass}</h1>
                        <img src="${imageUrl}">
                    </div>
                    <div class="mage-info">
                        <h2>${m.name}</h2>
                        <div class="mage-titles">
                            <div class="mage-title">
                                <span class="icon" style="--icon: url(resources/${classIcon})"></span>
                                <h3>${m.rank}</h3>
                            </div>
                            <p class="origin">${m.origin}</p>
                            <p class="class">${m.class}</p>
                        </div>
                    </div>
                    ${m.faction ? `<div class="region"><p>${m.faction}</p></div>` : ""}
                </div>
            </div>
        `;
        container.append(card);
    });

    const memberElements = document.querySelectorAll("#members .rank-inner");

    memberElements.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.08}s`;
    });

    container.css("opacity", 1);
    $("#footer").css("opacity", 1);
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

function showAllMembers(tabElement) {
    setActiveTab(tabElement);
    renderMembers(members);
    showNoMembers(false);
}

function showByClass(className, tabElement) {
    setActiveTab(tabElement);
    const filtered = members.filter(m => {
        const cls = rankClassMap.get(m.rank);
        return cls.toLowerCase().replace(/\s+/g, "-") === className;
    });
    renderMembers(filtered);

    showNoMembers(filtered.length === 0);
}

function setActiveTab(tabElement) {
  document.querySelectorAll(".tabs .tab").forEach(t => t.classList.remove("active"));
  tabElement.classList.add("active");
}

function showNoMembers(show) {
    const noMembersEl = document.getElementById("no-members");

    if (show) {
        if (noMembersEl.style.display != "block") {
            noMembersEl.style.display = "block";
            noMembersEl.classList.remove("show-animate");

            // Force reflow so animation can restart
            void noMembersEl.offsetWidth;

            noMembersEl.classList.add("show-animate");
        }
    } else {
      if (noMembersEl.style.display != "none") {
        noMembersEl.style.display = "none";
        noMembersEl.classList.remove("show-animate");
      }
    }
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