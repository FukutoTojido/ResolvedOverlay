function createLeaderboard(gameplay) {
	upperPart.style.transform = "none";
	document.getElementById("leaderboard").style.transform = "none";

	if (config.enableLeaderboard && !hasSetOurPlayer) {
		hasSetOurPlayer = true;
		ourplayerContainer = document.createElement("div");
		ourplayerContainer.id = "ourplayer";
		ourplayerContainer.setAttribute("class", "ourplayerContainer");

		minimodsContainerOP = document.createElement("div");
		minimodsContainerOP.id = `minimodsContainerOurPlayer`;
		minimodsContainerOP.setAttribute("class", "minimodsContainer");

		document.getElementById("leaderboard").appendChild(ourplayerContainer);
		document.getElementById("ourplayer").appendChild(minimodsContainerOP);

		tempMinimodsOP = gameplay.leaderboard.ourplayer.mods;

		minimodsCountOP = tempMinimodsOP.length;

		for (var k = 0; k < minimodsCountOP; k++) {
			let mods = document.createElement("div");
			mods.id = tempMinimodsOP.substr(k, 2) + "OurPlayer";
			mods.setAttribute("class", "minimods");
			mods.style.backgroundImage = `url("./static/minimods/${tempMinimodsOP.substr(k, 2)}.png")`;
			mods.style.transform = `translateX(${(k / 2) * 10}px)`;
			document.getElementById(`minimodsContainerOurPlayer`).appendChild(mods);
			k++;
		}
	}

	ourplayerContainer.innerHTML = `
                <div id="ourplayerName" style="width: 200px;">${gameplay.leaderboard.ourplayer.name}</div>
                ${getGradeStyle(
									gameplay.hits["300"],
									gameplay.hits["100"],
									gameplay.hits["50"],
									gameplay.hits["0"],
									gameplay.leaderboard.ourplayer.mods.search("HD"),
								)}
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 100px;">${new Intl.NumberFormat().format(
									Number(gameplay.score),
								)}</div>
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 50px;">${gameplay.combo.max}x</div>
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 60px;">${gameplay.accuracy.toFixed(2)}%</div>
                ${$("#" + minimodsContainerOP.id).prop("outerHTML")}`;

	if (config.enableLeaderboard && !hasSetLeaderboard) {
		hasSetLeaderboard = true;

		for (var i = tempSlotLength - 1; i > 0; i--) {
			let playerContainer = document.createElement("div");
			playerContainer.id = `slot${i}`;
			playerContainer.setAttribute("class", "playerContainer");
			playerContainer.style.top = `${(i - 1) * 75}px`;

			let playerNameLB = document.createElement("div");
			playerNameLB.innerHTML = `<div id="lb_name${i}" style="width: 200px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${
				gameplay.leaderboard.slots[i - 1].name
			}</div>`;

			let playerScoreLB = document.createElement("div");
			playerScoreLB.innerHTML = `<div id="lb_score${i}" style="font-size: 15px; font-family: Torus; width: 100px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${new Intl.NumberFormat().format(
				Number(gameplay.leaderboard.slots[i - 1].score),
			)}</div>`;

			let playerComboLB = document.createElement("div");
			playerComboLB.innerHTML = `<div id="lb_combo${i}" style="font-size: 15px; font-family: Torus; width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${
				gameplay.leaderboard.slots[i - 1].maxCombo
			}x</div>`;

			let playerAccLB = document.createElement("div");
			let raw_playerAcc = calculateAccuracy(
				gameplay.leaderboard.slots[i - 1].h300,
				gameplay.leaderboard.slots[i - 1].h100,
				gameplay.leaderboard.slots[i - 1].h50,
				gameplay.leaderboard.slots[i - 1].h0,
			);
			playerAccLB.innerHTML = `<div id="lb_acc${i}" style="font-size: 15px; font-family: Torus; width: 60px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${raw_playerAcc}%</div>`;

			let playerGradeLB = document.createElement("div");
			let lb_hasHD = gameplay.leaderboard.slots[i - 1].mods.search("HD");
			let lb_h300 = gameplay.leaderboard.slots[i - 1].h300;
			let lb_h100 = gameplay.leaderboard.slots[i - 1].h100;
			let lb_h50 = gameplay.leaderboard.slots[i - 1].h50;
			let lb_h0 = gameplay.leaderboard.slots[i - 1].h0;
			let lb_combo = lb_h300 + lb_h100 + lb_h50 + lb_h0;

			switch (true) {
				case raw_playerAcc == 100 || lb_combo === 0:
					if (lb_hasHD === -1) {
						playerGradeLB.innerHTML = `<div id="grade${i}" style="width: 50px; color: #de3950; filter: drop-shadow(0 0 5px #de3950)">X</div>`;
						break;
					}
					playerGradeLB.innerHTML = `<div id=grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">X</div>`;
					break;
				case raw_playerAcc > 90 && lb_h50 / lb_combo < 0.01 && lb_h0 === 0:
					if (lb_hasHD === -1) {
						playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #f2d646; filter: drop-shadow(0 0 5px #f2d646)">S</div>`;
						break;
					}
					playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">S</div>`;
					break;
				case (raw_playerAcc > 80 && raw_playerAcc <= 90 && lb_h0 === 0) || lb_h300 / lb_combo > 0.9:
					playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #46f26e; filter: drop-shadow(0 0 5px #46f26e)">A</div>`;
					break;
				case (raw_playerAcc > 70 && raw_playerAcc <= 80 && lb_h0 === 0) || lb_h300 / lb_combo > 0.8:
					playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #469cf2; filter: drop-shadow(0 0 5px #469cf2)">B</div>`;
					break;
				case lb_h300 / lb_combo > 0.6 && lb_h300 / lb_combo <= 0.8:
					playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #9f46f2; filter: drop-shadow(0 0 5px #9f46f2)">C</div>`;
					break;
				case lb_h300 / lb_combo <= 0.6:
					playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #ff0000; filter: drop-shadow(0 0 5px #ff0000)">D</div>`;
					break;
			}

			playerContainer.appendChild(playerNameLB);
			playerContainer.appendChild(playerGradeLB);
			playerContainer.appendChild(playerScoreLB);
			playerContainer.appendChild(playerComboLB);
			playerContainer.appendChild(playerAccLB);

			let minimodsContainer = document.createElement("div");
			minimodsContainer.id = `minimodsContainerSlot${i}`;
			minimodsContainer.setAttribute("class", "minimodsContainer");
			playerContainer.appendChild(minimodsContainer);
			leaderboardScores.appendChild(playerContainer);

			let tempMinimods = gameplay.leaderboard.slots[i - 1].mods;
			let minimodsCount = tempMinimods.length;

			for (var k = 0; k < minimodsCount; k++) {
				let mods = document.createElement("div");
				mods.id = tempMinimods.substr(k, 2) + i;
				mods.setAttribute("class", "minimods");
				mods.style.backgroundImage = `url("./static/minimods/${tempMinimods.substr(k, 2)}.png")`;
				mods.style.transform = `translateX(${(k / 2) * 10}px)`;
				document.getElementById(`minimodsContainerSlot${i}`).appendChild(mods);
				k++;
			}
		}
	}

	if (tempCurrentPosition !== gameplay.leaderboard.ourplayer.position) {
		tempCurrentPosition = gameplay.leaderboard.ourplayer.position;
	}

	if (tempCurrentPosition === 0) ourplayerContainer.style.opacity = "0";
	else ourplayerContainer.style.opacity = "1";

	if (tempCurrentPosition > 5) {
		leaderboardScores.style.transform = `translateY(${-(tempCurrentPosition - 6) * 75}px)`;
		document.getElementById("ourplayer").style.transform = `none`;
	} else {
		leaderboardScores.style.transform = "translateY(0)";
		document.getElementById("ourplayer").style.transform = `translateY(-${(6 - tempCurrentPosition) * 75}px)`;
	}
	for (var i = 1; i < tempSlotLength; i++) {
		if (i >= tempCurrentPosition && tempCurrentPosition !== 0) {
			document.getElementById(`slot${i}`).style.transform = `translateY(75px)`;
		}
	}
}
