async function fetchData() {
    // START OF API
    apiGetSet = true;
    let playerData, playerBest;
    if (api !== '' && tempUsername !== '')
        playerData = await getUserDataSet(tempUsername);
    else
        playerData = null;


    if (playerData === null) {
        playerData = {
            "user_id": "gamer",
            "username": `${name}`,
            "pp_rank": "0",
            "pp_raw": "0",
            "country": "__",
            "pp_country_rank": "0",
        }
        playerBest = {
            "0": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "1": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "2": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "3": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "4": {
                "beatmap_id": "-1",
                "pp": "-"
            }
        }
        for (var i = 0; i < 5; i++) {
            document.getElementById(`bg${i + 1}`).style.backgroundImage = `unset`;
            document.getElementById(`topArtistTitle${i + 1}`).innerHTML = `Offline Play`;
            document.getElementById(`topDiff${i + 1}`).innerHTML = `[-]`;
            document.getElementById(`topPP${i + 1}`).innerHTML = `${playerBest[i]["pp"]}pp`
        }
    } else {
        playerBest = await getUserTop(tempUsername);
        for (var i = 0; i < 5; i++) {
            let mapData = await getMapDataSet(playerBest[i]["beatmap_id"]);
            document.getElementById(`bg${i + 1}`).style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg')`;
            document.getElementById(`topArtistTitle${i + 1}`).innerHTML = `${mapData.artist} - ${mapData.title}`;
            document.getElementById(`topDiff${i + 1}`).innerHTML = `[${mapData.version}]`;
            document.getElementById(`topPP${i + 1}`).innerHTML = `${Math.round(playerBest[i]["pp"])}pp`;
        }
    }

    tempUID = playerData.user_id;
    tempCountry = `${(playerData.country).split('').map(char => 127397 + char.charCodeAt())[0].toString(16)}-${(playerData.country).split('').map(char => 127397 + char.charCodeAt())[1].toString(16)}`;
    tempRanks = playerData.pp_rank;
    tempcountryRank = playerData.pp_country_rank;
    tempPlayerPP = playerData.pp_raw;

    if (tempUID !== "gamer")
        playerAva.style.backgroundImage = `url('https://a.ppy.sh/${tempUID}')`;
    else
        playerAva.style.backgroundImage = "url('./static/gamer.png')";

    playerCountry.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;
    playerRank.innerHTML = `Ranking: #${tempRanks}`;
    playerCRank.innerHTML = `Country Ranking: #${tempcountryRank}`;
    playerPerformance.innerHTML = `Performance: ${Math.round(tempPlayerPP)}pp`;

    // END OF API CALL
}

async function setupRankingPanel() {
    rankingPanelSet = true;
    rankingPanelBG.style.opacity = 1;
    
    nowPlayingContainer.style.opacity = 0;
    document.getElementById("strainGraph").style.opacity = 0;

    rankingPanel.style.opacity = '1';
    playerName.innerHTML = tempUsername;

    mapContainerR.style.transform = "translateY(0)";
    statSection.style.transform = "translateY(0)";
    player.style.transform = "translateX(0)";
    result.style.transform = "translateX(0)";
    rankingResult.style.transform = "translateY(0)";

    playerName.innerHTML = tempUsername;

    rCS.innerHTML = `CS:${tempCS}`;
    rAR.innerHTML = `AR:${tempAR}`;
    rOD.innerHTML = `OD:${tempOD}`;
    rHP.innerHTML = `HP:${tempHPDr}`;
    rSR.innerHTML = `SR:${tempSR}`;

    mapArtistTitle.innerHTML = tempMapArtist + ' - ' + tempMapTitle;
    mapDifficulty.innerHTML = `${tempMapDiff}`;
    mapCreator.innerHTML = `Mapped by ${tempMapper}`;
    switch (tempRankedStatus) {
        case 4:
            rankedStatus.style.backgroundImage = `url('./static/state/ranked.png')`;
            break;
        case 7:
            rankedStatus.style.backgroundImage = `url('./static/state/loved.png')`;
            break;
        case 5:
        case 6:
            rankedStatus.style.backgroundImage = `url('./static/state/qualified.png')`;
            break;
        default:
            rankedStatus.style.backgroundImage = `url('./static/state/unranked.png'~)`;
            break;
    }

    scoreResult.innerHTML = numberWithCommas(tempScore);
    accResult.innerHTML = tempAcc.toFixed(2) + '%';
    comboResult.innerHTML = tempCombo + 'x';

    URResult.innerHTML = tempURIndex.toFixed(2) + 'UR';
    r300.innerHTML = temp300;
    r100.innerHTML = temp100;
    r50.innerHTML = temp50;
    r0.innerHTML = temp0;
    ppResult.innerHTML = tempPP + 'pp';

    resultRecorder.style.transform = 'none';
}

async function deRankingPanel() {
    rankingPanelSet = false;
    apiGetSet = false;
    rankingPanel.style.opacity = 0;
    resultRecorder.style.transform = 'translateY(100px)';

    mapContainerR.style.transform = "translateY(-200px)";
    statSection.style.transform = "translateY(-300px)";
    player.style.transform = "translateX(-620px)";
    result.style.transform = "translateX(620px)";
    rankingResult.style.transform = "translateY(800px)";

    nowPlayingContainer.style.opacity = 1;
    document.getElementById("strainGraph").style.opacity = 1;
}