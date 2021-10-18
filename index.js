const file = [];
let api = "", leaderboardEnable = "1", leaderboardTab = "0";
async function getAPI() {
    try {
        const jsonData = await $.getJSON("config.json");
        jsonData.map((num) => {
            file.push(num);
        });
        api = file[0].api;
        leaderboardEnable = file[1].leaderboardEnable;
        leaderboardTab = file[1].leaderboardTab;
        document.getElementById("recorderName").innerHTML = file[2].recorder;
        document.getElementById("resultRecorder").innerHTML = `Recorder: ${file[2].recorder}`;
    } catch (error) {
        console.error("Could not read JSON file", error);
    }
};
getAPI();

// START
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let mapid = document.getElementById('mapid');
let mapBG = document.getElementById("mapBG");
let rankingPanelBG = document.getElementById("rankingPanelBG");
let recorder = document.getElementById("recorder");
let recorderName = document.getElementById("recorderName");
let resultRecorder = document.getElementById("resultRecorder");

// NOW PLAYING
let mapContainer = document.getElementById("nowPlayingContainer");
let mapTitle = document.getElementById("mapTitle");
let mapDesc = document.getElementById("mapDesc")
let stars = document.getElementById("stars");
let starsCurrent = document.getElementById("starsCurrent");
let overlay = document.getElementById("overlay");

// PLAYING SCORE
let upperPart = document.getElementById("top");
let score = document.getElementById("score");
let acc = document.getElementById("acc");
let combo = document.getElementById("combo")

// ACCURACY INFO
let bottom = document.getElementById("bottom");
let lowerPart = document.getElementById("lowerPart");
let accInfo = document.getElementById("accInfo");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let h0 = document.getElementById("h0");

// PERFORMANCE POINTS
let pp = document.getElementById("pp");

// PLAYER INFO
let username = document.getElementById("username");
let country = document.getElementById("country");
let ranks = document.getElementById("ranks");
let countryRank = document.getElementById("countryRank");
let playerPP = document.getElementById("playerPP");

let tickLeft = document.getElementById("tickLeft");
let tickRight = document.getElementById("tickRight");

// HP BAR
let hp = document.getElementById("hp");

let progressChart = document.getElementById("progress");
let strainGraph = document.getElementById("strainGraph");

// UR

let URbar = document.getElementById("URbar");
let URtick = document.getElementById("URtick");
let avgHitError = document.getElementById("avgHitError");

let l300 = document.getElementById("l300");
let l100 = document.getElementById("l100");
let URIndex = document.getElementById("URIndex");

let leaderboard = document.getElementById("leaderboard");

// Ranking Result
let rankingPanel = document.getElementById("rankingPanel");

let mapContainerR = document.getElementById("mapContainer");
let rankedStatus = document.getElementById("rankedStatus");
let mapArtistTitle = document.getElementById("mapArtistTitle");
let mapDifficulty = document.getElementById("mapDifficulty");
let mapCreator = document.getElementById("mapCreator");

let statSection = document.getElementById("statSection");
let rCS = document.getElementById("CS");
let rAR = document.getElementById("AR");
let rOD = document.getElementById("OD");
let rHP = document.getElementById("HD");
let rSR = document.getElementById("SR");

let player = document.getElementById("player");
let playerAva = document.getElementById("playerAva");
let playerCountry = document.getElementById("playerCountry");
let playerName = document.getElementById("playerName");
let playerPerformance = document.getElementById("playerPerformance");
let playerRank = document.getElementById("playerRank");
let playerCRank = document.getElementById("playerCRank");

let rankingResult = document.getElementById("rankingResult");

let result = document.getElementById("result");
let scoreResult = document.getElementById("scoreResult");
let comboResult = document.getElementById("comboResult");
let accResult = document.getElementById("accResult");
let URResult = document.getElementById("URResult");

let r300 = document.getElementById("r300");
let r100 = document.getElementById("r100");
let r50 = document.getElementById("r50");
let r0 = document.getElementById("r0");

let ppResult = document.getElementById("ppResult");

socket.onopen = () => {
    console.log("Successfully Connected");
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

let animation = {
    acc: new CountUp('acc', 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: false,
        separator: " ",
        decimal: ".",
        suffix: "%"
    }),
    score: new CountUp('score', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: "."
    }),
    combo: new CountUp('combo', 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "x"
    }),
    starsCurrent: new CountUp('starsCurrent', 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        prefix: "Now: ",
        suffix: "*"
    }),
    stars: new CountUp('stars', 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        prefix: "Full: ",
        suffix: "*"
    }),
}

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

let tempMapID, tempImg, tempMapArtist, tempMapTitle, tempMapDiff, tempMapper, tempRankedStatus;

let tempSR, tempCS, tempAR, tempOD, tempHPDr;

let gameState;
let tempScore;
let tempAcc;
let tempCombo;
let interfaceID;

let temp300;
let temp100;
let temp50;
let temp0;
let tempGrade;

let tempPP;

let tempUsername;
let tempUID;
let tempCountry;
let tempRanks;
let tempcountryRank;
let tempPlayerPP;

let tempHP;
let tempMods;
let isHidden;

let rankingPanelSet;
let apiGetSet = false;

let tempTimeCurrent;
let tempTimeFull;
let tempFirstObj;
let tempTimeMP3;

let tempStrainBase;
let smoothOffset = 2;
let seek;
let fullTime;

let tempHitErrorArrayLength;
let OD = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempTotalAvg = 0;
let tempTotalWeighted = 0;
let tempBool;

let tempURIndex;
let tempSmooth;

let tempSlotLength, tempCurrentPosition;
let leaderboardSet = 0;
let ourplayerSet = 0;
let ourplayerContainer;

let minimodsContainerOP, tempMinimodsOP, minimodsCountOP;

let colorSet = 0;
let colorGet = get_bg_color('#nowPlayingContainer');

window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    var ctxSecond = document.getElementById('canvasSecond').getContext('2d');
    window.myLineSecond = new Chart(ctxSecond, configSecond);
};

socket.onmessage = event => {
    let data = JSON.parse(event.data);

    if (!colorSet) {
        colorSet = 1;
        setTimeout(function () { colorGet = get_bg_color('#nowPlayingContainer') }, 550);
    }


    switch (leaderboardEnable) {
        case "1":
            document.getElementById("leaderboardx").style.opacity = 1;
            break;
        case "0":
            document.getElementById("leaderboardx").style.opacity = 0;
            break;
    }

    if (data.gameplay.name && tempUsername !== data.gameplay.name) {
        tempUsername = data.gameplay.name;
        username.innerHTML = tempUsername;
        setupUser(tempUsername);
    }

    if (tempImg !== data.menu.bm.path.full) {
        tempImg = data.menu.bm.path.full;
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, '%23').replace(/%/g, '%25').replace(/\\/g, '/').replace(/'/g, '%27');
        mapContainer.style.backgroundImage = `url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
        mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
        rankingPanelBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
        mapContainer.style.backgroundPosition = "50% 50%";
    }

    if (gameState !== data.menu.state) {
        gameState = data.menu.state;
        if (gameState !== 2) {
            if (gameState !== 7)
                deRankingPanel();
            upperPart.style.transform = "translateY(-200px)";

            tickPos = 0;
            tempAvg = 0;
            l300.style.width = "119.5px";
            l300.style.transform = "translateX(0)";
            l100.style.width = "209.8px";
            l100.style.transform = "translateX(0)";
            avgHitError.style.transform = "translateX(0)";

            bottom.style.transform = "translateY(300px)";
            URIndex.style.transform = 'none';

            document.getElementById("modContainer").style.transform = "translateX(500px)";

            document.getElementById("leaderboardx").style.transform = "translateX(-400px)";

            URIndex.innerHTML = '';

            setTimeout(() => {
                leaderboard.innerHTML = '';
                leaderboardSet = 0;
                ourplayerSet = 0;
                $('#ourplayer').remove();
            }, 1000)
        }
        else {
            deRankingPanel();
            upperPart.style.transform = 'none';
            bottom.style.transform = 'none';
            document.getElementById("modContainer").style.transform = 'none';
        }
    }

    if (tempMapID !== data.menu.bm.id || tempSR !== data.menu.bm.stats.fullSR) {
        colorSet = 0;
        tempMapID = data.menu.bm.id;
        tempMapArtist = data.menu.bm.metadata.artist;
        tempMapTitle = data.menu.bm.metadata.title;
        tempMapDiff = '[' + data.menu.bm.metadata.difficulty + ']';
        tempMapper = data.menu.bm.metadata.mapper;
        tempRankedStatus = data.menu.bm.rankedStatus;

        tempCS = data.menu.bm.stats.CS;
        tempAR = data.menu.bm.stats.AR;
        tempOD = data.menu.bm.stats.OD;
        tempHPDr = data.menu.bm.stats.HP;
        tempSR = data.menu.bm.stats.fullSR;

        tempFirstObj = data.menu.bm.time.firstObj;

        mapName.innerHTML = tempMapArtist + ' - ' + tempMapTitle;

        mapInfo.innerHTML = `${tempMapDiff}`;

        stats.innerHTML = 'CS: ' + tempCS + '&emsp;' + 'AR: ' + tempAR + '&emsp;' + 'OD: ' + tempOD + '&emsp;' + 'HP: ' + tempHPDr + '&emsp;' + 'Star Rating: ' + tempSR + '*';
    }

    if (tempGrade !== data.gameplay.hits.grade.current) {
        tempGrade = data.gameplay.hits.grade.current;
    }

    if (data.gameplay.score == 0) { }

    if (tempScore !== data.gameplay.score) {
        tempTotalAvg = 0;
        tempTotalWeighted = 0;
        tempAvg = 0;
        tempScore = data.gameplay.score;
        score.innerHTML = tempScore;
        animation.score.update(score.innerHTML);
    }

    if (tempAcc !== data.gameplay.accuracy) {
        tempAcc = data.gameplay.accuracy;
        acc.innerHTML = tempAcc;
        animation.acc.update(acc.innerHTML);
    }

    if (fullTime !== data.menu.bm.time.mp3) {
        fullTime = data.menu.bm.time.mp3;
        onepart = 490 / fullTime;
    }

    if (tempStrainBase !== JSON.stringify(data.menu.pp.strains)) {
        tempLink = JSON.stringify(data.menu.pp.strains);
        smoothed = smooth(data.menu.pp.strains, smoothOffset);
        config.data.datasets[0].data = smoothed;
        config.data.datasets[0].backgroundColor = `rgba(${colorGet.r}, ${colorGet.g}, ${colorGet.b}, 0.2)`;
        config.data.labels = smoothed;
        configSecond.data.datasets[0].data = smoothed;
        configSecond.data.datasets[0].backgroundColor = `rgba(${colorGet.r}, ${colorGet.g}, ${colorGet.b}, 0.7)`;
        configSecond.data.labels = smoothed;
        if (window.myLine && window.myLineSecond) {
            window.myLine.update();
            window.myLineSecond.update();
        }
    }
    if (seek !== data.menu.bm.time.current && fullTime !== undefined && fullTime !== 0) {
        seek = data.menu.bm.time.current;
        progressChart.style.width = onepart * seek + 'px';
    }
    if (tempMods !== data.menu.mods.str) {
        document.getElementById("modContainer").innerHTML = "";

        tempMods = data.menu.mods.str;

        if (tempMods.search("HD") !== -1)
            isHidden = true;
        else
            isHidden = false;

        let modsCount = tempMods.length;

        for (var i = 0; i < modsCount; i++) {
            if (tempMods.substr(i, 2) !== "NM" || tempMods.substr(i, 2) !== "TD") {
                let mods = document.createElement("div");
                mods.id = tempMods.substr(i, 2);
                mods.setAttribute("class", "mods");
                mods.style.backgroundImage = `url('./static/mods/${tempMods.substr(i, 2)}.png')`;
                mods.style.transform = `translateX(${i / 2 * 30}px)`;
                document.getElementById("modContainer").appendChild(mods);
            }
            i++;
        }

        if (OD !== data.menu.bm.stats.OD) {
            if (data.menu.mods.str.indexOf("DT") == -1 || data.menu.mods.str.indexOf("NC") == -1) {
                OD = data.menu.bm.stats.OD;
            } else {
                OD = 500 / 333 * data.menu.bm.stats.OD + (-2210) / 333;
            }
            if (data.menu.mods.str.indexOf("HT") == -1) {
                OD = data.menu.bm.stats.OD;
            } else {
                OD = 500 / 667 * data.menu.bm.stats.OD + (-2210) / 667;
            }
        }
    }
    if (tempCombo !== data.gameplay.combo.current) {
        tempCombo = data.gameplay.combo.current;
        if (data.gameplay.combo.current == data.gameplay.combo.max) {
            tempMaxCombo = data.gameplay.combo.max;
        }
        combo.innerHTML = tempCombo;
        animation.combo.update(combo.innerHTML);
    }

    if (data.gameplay.hits.hitErrorArray !== null) {
        tempSmooth = smooth(data.gameplay.hits.hitErrorArray, 4);

        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {

                tempAvg = tempAvg * 0.90 + tempSmooth[a] * 0.1;
            }
            fullPos = (-10 * OD + 199.5);
            tickPos = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / fullPos * 145;
            avgHitError.style.transform = `translateX(${(tempAvg / fullPos) * 150}px)`;
            l100.style.width = `${(-8 * OD + 139.5) / fullPos * 300}px`;
            l100.style.transform = `translateX(${(209.8 - ((-8 * OD + 139.5) / fullPos * 300)) / 2}px)`;
            l300.style.width = `${(-6 * OD + 79.5) / fullPos * 300}px`;
            l300.style.transform = `translateX(${(119.5 - ((-6 * OD + 79.5) / fullPos * 300)) / 2}px)`;
            let tick = document.createElement("div");
            tick.id = `tick${tempHitErrorArrayLength}`;
            tick.setAttribute("class", "tick");
            tick.style.opacity = 1;
            tick.style.transform = `translateX(${tickPos}px)`;
            document.getElementById("URbar").appendChild(tick);

            function fade() {
                tick.style.opacity = 0;
            }

            function remove() {
                document.getElementById("URbar").removeChild(tick);
            }
            setTimeout(fade, 2000);
            setTimeout(remove, 2500);
        }
    }

    if (tempURIndex !== data.gameplay.hits.unstableRate) {
        tempURIndex = data.gameplay.hits.unstableRate;
        URIndex.innerHTML = tempURIndex;
    }

    if (temp300 !== data.gameplay.hits[300]) {
        temp300 = data.gameplay.hits[300];
    }
    if (temp100 !== data.gameplay.hits[100]) {
        temp100 = data.gameplay.hits[100];
        h100.innerHTML = temp100;
    }
    if (temp50 !== data.gameplay.hits[50]) {
        temp50 = data.gameplay.hits[50];
        h50.innerHTML = temp50;
    }
    if (temp0 !== data.gameplay.hits[0]) {
        temp0 = data.gameplay.hits[0];
        h0.innerHTML = temp0;
    }
    if (tempPP !== data.gameplay.pp.current) {
        tempPP = data.gameplay.pp.current;
        pp.innerHTML = tempPP;
    }


    if (tempTimeCurrent !== data.menu.bm.time.current) {
        if (tempTimeCurrent > data.menu.bm.time.current) {
            leaderboard.innerHTML = '';
            $("#ourplayer").remove();
            ourplayerSet = 0;
            leaderboardSet = 0;
        }
        tempTimeCurrent = data.menu.bm.time.current;
        tempTimeFull = data.menu.bm.time.full;
        tempTimeMP3 = data.menu.bm.time.mp3;
        interfaceID = data.settings.showInterface;

        if (tempTimeCurrent >= tempFirstObj + 5000 && tempTimeCurrent <= tempFirstObj + 11900 && gameState == 2) {
            recorder.style.transform = "translateX(600px)";
            if (tempTimeCurrent >= tempFirstObj + 5500)
                recorderName.style.transform = "translateX(600px)";
        }
        else {
            recorder.style.transform = 'none';
            recorderName.style.transform = 'none';
        }

        if (tempTimeCurrent >= tempTimeFull - 10000 && gameState === 2 && !apiGetSet)
            fetchData();

        if (tempTimeCurrent >= tempTimeMP3 - 2000 && gameState === 2)
            rankingPanelBG.style.opacity = 1;

        if (gameState === 7) {
            if (!rankingPanelSet)
                setupRankingPanel();
            if (tempGrade !== '')
                if (!isHidden)
                    rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}.png')`;
                else if (tempGrade === 'S' || tempGrade === 'SS')
                    rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}H.png')`;
                else
                    rankingResult.style.backgroundImage = `url('./static/rankings/${tempGrade}.png')`;
        } else
            if (!(tempTimeCurrent >= tempTimeFull - 500 && gameState === 2))
                rankingPanelBG.style.opacity = 0;

        if (gameState == 2) {
            upperPart.style.transform = "none";

            if (leaderboardTab === "1")
                document.getElementById("leaderboardx").style.opacity = (data.gameplay.leaderboard.isVisible === true) ? 0 : 1;

            if (data.gameplay.leaderboard.slots !== null) {
                if (tempSlotLength !== data.gameplay.leaderboard.slots.length) {
                    tempSlotLength = data.gameplay.leaderboard.slots.length;
                }

                document.getElementById("leaderboardx").style.transform = 'none';

                if (!ourplayerSet && leaderboardEnable === "1") {
                    ourplayerSet = 1;
                    ourplayerContainer = document.createElement("div");
                    ourplayerContainer.id = "ourplayer";
                    ourplayerContainer.setAttribute("class", "ourplayerContainer");

                    minimodsContainerOP = document.createElement("div");
                    minimodsContainerOP.id = `minimodsContainerOurPlayer`;
                    minimodsContainerOP.setAttribute("class", "minimodsContainer");

                    document.getElementById("leaderboardx").appendChild(ourplayerContainer);
                    document.getElementById("ourplayer").appendChild(minimodsContainerOP);

                    tempMinimodsOP = data.gameplay.leaderboard.ourplayer.mods;

                    minimodsCountOP = tempMinimodsOP.length;

                    for (var k = 0; k < minimodsCountOP; k++) {
                        let mods = document.createElement("div");
                        mods.id = tempMinimodsOP.substr(k, 2) + "OurPlayer";
                        mods.setAttribute("class", "minimods");
                        mods.style.backgroundImage = `url('./static/minimods/${tempMinimodsOP.substr(k, 2)}.png')`;
                        mods.style.transform = `translateX(${k / 2 * 10}px)`;
                        document.getElementById(`minimodsContainerOurPlayer`).appendChild(mods);
                        k++;
                    }
                }

                ourplayerContainer.innerHTML = `
                <div id="ourplayerName" style="width: 200px;">${data.gameplay.leaderboard.ourplayer.name}</div>
                ${grader(data.gameplay.hits["300"], data.gameplay.hits["100"], data.gameplay.hits["50"], data.gameplay.hits["0"], data.gameplay.leaderboard.ourplayer.mods.search("HD"))}
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 100px;">${new Intl.NumberFormat().format(Number(data.gameplay.score))}</div>
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 50px;">${data.gameplay.combo.max}x</div>
                <div id="ourplayerName" style="font-size: 15px; font-family: Torus; width: 60px;">${data.gameplay.accuracy.toFixed(2)}%</div>
                ${$('#' + minimodsContainerOP.id).prop("outerHTML")}`;

                if (!leaderboardSet && leaderboardEnable === "1") {
                    leaderboardSet = 1;

                    for (var i = tempSlotLength - 1; i > 0; i--) {
                        let playerContainer = document.createElement("div");
                        playerContainer.id = `slot${i}`;
                        playerContainer.setAttribute("class", "playerContainer");
                        playerContainer.style.top = `${(i - 1) * 75}px`;
                        // playerContainer.innerHTML = `
                        // <span style="width: 190px;">${data.gameplay.leaderboard.slots[i - 1].name}</span>
                        // ${grader(data.gameplay.leaderboard.slots[i - 1].h300, data.gameplay.leaderboard.slots[i - 1].h100, data.gameplay.leaderboard.slots[i - 1].h50, data.gameplay.leaderboard.slots[i - 1].h0, data.gameplay.leaderboard.slots[i - 1].mods.search("HD"))}
                        // <br/>
                        // <span style="display: inline-block; font-size: 15px; font-family: GothicRD; width: 100px;">${new Intl.NumberFormat().format(Number(data.gameplay.leaderboard.slots[i - 1].score))}</span>
                        // <span style="display: inline-block; font-size: 15px; font-family: GothicRD; width: 50px;">${data.gameplay.leaderboard.slots[i - 1].maxCombo}x</span>
                        // <span style="display: inline-block; font-size: 15px; font-family: GothicRD; width: 60px;">${accuracyCalc(data.gameplay.leaderboard.slots[i - 1].h300, data.gameplay.leaderboard.slots[i - 1].h100, data.gameplay.leaderboard.slots[i - 1].h50, data.gameplay.leaderboard.slots[i - 1].h0)}%</span>`;

                        let playerNameLB = document.createElement("div");
                        playerNameLB.innerHTML = `<div id="lb_name${i}" style="width: 200px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${data.gameplay.leaderboard.slots[i - 1].name}</div>`;

                        let playerScoreLB = document.createElement("div");
                        playerScoreLB.innerHTML = `<div id="lb_score${i}" style="font-size: 15px; font-family: Torus; width: 100px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${new Intl.NumberFormat().format(Number(data.gameplay.leaderboard.slots[i - 1].score))}</div>`

                        let playerComboLB = document.createElement("div");
                        playerComboLB.innerHTML = `<div id="lb_combo${i}" style="font-size: 15px; font-family: Torus; width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${data.gameplay.leaderboard.slots[i - 1].maxCombo}x</div>`

                        let playerAccLB = document.createElement("div");
                        let raw_playerAcc = accuracyCalc(data.gameplay.leaderboard.slots[i - 1].h300, data.gameplay.leaderboard.slots[i - 1].h100, data.gameplay.leaderboard.slots[i - 1].h50, data.gameplay.leaderboard.slots[i - 1].h0);
                        playerAccLB.innerHTML = `<div id="lb_acc${i}" style="font-size: 15px; font-family: Torus; width: 60px; color: #ffffff; filter: drop-shadow(0 0 5px rgba(0, 0, 0 ,0))">${raw_playerAcc}%</div>`

                        let playerGradeLB = document.createElement("div");
                        let lb_hasHD = data.gameplay.leaderboard.slots[i - 1].mods.search("HD");
                        let lb_h300 = data.gameplay.leaderboard.slots[i - 1].h300;
                        let lb_h100 = data.gameplay.leaderboard.slots[i - 1].h100;
                        let lb_h50 = data.gameplay.leaderboard.slots[i - 1].h50;
                        let lb_h0 = data.gameplay.leaderboard.slots[i - 1].h0;
                        let lb_combo = lb_h300 + lb_h100 + lb_h50 + lb_h0;

                        switch (true) {
                            case (raw_playerAcc == 100 || lb_combo === 0):
                                if (lb_hasHD === -1) {
                                    playerGradeLB.innerHTML = `<div id="grade${i}" style="width: 50px; color: #de3950; filter: drop-shadow(0 0 5px #de3950)">X</div>`;
                                    break;
                                }
                                playerGradeLB.innerHTML = `<div id=grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">X</div>`;
                                break;
                            case (raw_playerAcc > 90 && lb_h50 / lb_combo < 0.01 && lb_h0 === 0):
                                if (lb_hasHD === -1) {
                                    playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #f2d646; filter: drop-shadow(0 0 5px #f2d646)">S</div>`;
                                    break;
                                }
                                playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">S</div>`;
                                break;
                            case ((raw_playerAcc > 80 && raw_playerAcc <= 90 && lb_h0 === 0) || (lb_h300 / lb_combo > 0.9)):
                                playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #46f26e; filter: drop-shadow(0 0 5px #46f26e)">A</div>`;
                                break;
                            case ((raw_playerAcc > 70 && raw_playerAcc <= 80 && lb_h0 === 0) || (lb_h300 / lb_combo > 0.8)):
                                playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #469cf2; filter: drop-shadow(0 0 5px #469cf2)">B</div>`;
                                break;
                            case ((lb_h300 / lb_combo > 0.6) && (lb_h300 / lb_combo <= 0.8)):
                                playerGradeLB.innerHTML = `<div id="grade${i}"  style="width: 50px; color: #9f46f2; filter: drop-shadow(0 0 5px #9f46f2)">C</div>`;
                                break;
                            case ((lb_h300 / lb_combo <= 0.6)):
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
                        leaderboard.appendChild(playerContainer);

                        let tempMinimods = data.gameplay.leaderboard.slots[i - 1].mods;

                        let minimodsCount = tempMinimods.length;

                        for (var k = 0; k < minimodsCount; k++) {
                            let mods = document.createElement("div");
                            mods.id = tempMinimods.substr(k, 2) + i;
                            mods.setAttribute("class", "minimods");
                            mods.style.backgroundImage = `url('./static/minimods/${tempMinimods.substr(k, 2)}.png')`;
                            mods.style.transform = `translateX(${k / 2 * 10}px)`;
                            document.getElementById(`minimodsContainerSlot${i}`).appendChild(mods);
                            k++;
                        }
                    }
                }

                if (tempCurrentPosition !== data.gameplay.leaderboard.ourplayer.position) {
                    tempCurrentPosition = data.gameplay.leaderboard.ourplayer.position;
                }

                if (tempCurrentPosition === 0)
                    ourplayerContainer.style.opacity = '0';
                else
                    ourplayerContainer.style.opacity = '1';

                if (tempCurrentPosition > 5) {
                    leaderboard.style.transform = `translateY(${-(tempCurrentPosition - 6) * 75}px)`;
                    document.getElementById("ourplayer").style.transform = `none`;
                }
                else {
                    leaderboard.style.transform = 'translateY(0)';
                    document.getElementById("ourplayer").style.transform = `translateY(-${(6 - tempCurrentPosition) * 75}px)`
                }
                for (var i = 1; i < tempSlotLength; i++) {
                    if (i >= tempCurrentPosition && tempCurrentPosition !== 0) {
                        document.getElementById(`slot${i}`).style.transform = `translateY(75px)`;
                    }
                }
            }

            if (interfaceID == 1 && gameState == 2) {
                upperPart.style.transform = "translateY(-200px)";
                bottom.style.transform = "translateY(300px)";
                URIndex.style.transform = "translateY(-280px)";
            } else {
                upperPart.style.transform = 'none';
                bottom.style.transform = 'none';
                URIndex.style.transform = "none";
            }
        }
    }

    if (data.gameplay.hp.smooth > 0) {
        hp.style.clipPath = `polygon(${(1 - data.gameplay.hp.smooth / 200) * 40 + 6.3}% 0%, ${(data.gameplay.hp.smooth / 200) * 40 + 53.7}% 0%, ${(data.gameplay.hp.smooth / 200) * 40 + 53.7}% 100%, ${(1 - data.gameplay.hp.smooth / 200) * 40 + 6.3}% 100%)`;
    } else {
        hp.style.clipPath = `polygon(6.3% 0, 93.7% 0, 93.7% 100%, 6.3% 100%)`;
    }
}

let config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            borderColor: 'rgba(255, 255, 255, 0)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            data: [],
            fill: true,
        }]
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: 'monotone'
            },
            point: {
                radius: 0
            }
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            }
        }
    }
};

let configSecond = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: '2',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            data: [],
            fill: true,
        }]
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: 'monotone'
            },
            point: {
                radius: 0
            }
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            }
        }
    }
};

function brightnessCheck(element, rgb) {
    let brightness = (0.21 * rgb.r) + (0.72 * rgb.g) + (0.07 * rgb.b);
    if (brightness > 190) {
        element.style.color = '#161616';
        element.style.textShadow = '0 2px 3px rgba(0, 0, 0, 0.5)';
    } else {
        element.style.color = 'white';
        element.style.textShadow = '0 2px 5px rgba(0, 0, 0, 0.6);'
    }
}

async function setupUser(name) {
    let data;
    if (api != "")
        data = await getUserDataSet(name);
    else
        data = null;
    //const avaImage = await getImage('8266808');
    if (data === null) {
        data = {
            "user_id": "gamer",
            "username": `${name}`,
            "pp_rank": "0",
            "pp_raw": "0",
            "country": "__",
            "pp_country_rank": "0",
        }
    }
    tempUID = data.user_id;

    tempCountry = `${(data.country).split('').map(char => 127397 + char.charCodeAt())[0].toString(16)}-${(data.country).split('').map(char => 127397 + char.charCodeAt())[1].toString(16)}`;
    tempRanks = data.pp_rank;
    tempcountryRank = data.pp_country_rank;
    tempPlayerPP = data.pp_raw

    if (tempUID !== "gamer") {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${tempUID}')`;
    }
    else {
        ava.style.backgroundImage = "url('./static/gamer.png')";
    }

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + tempRanks;

    countryRank.innerHTML = "#" + tempcountryRank;

    playerPP.innerHTML = Math.round(tempPlayerPP) + "pp";

    const avatarColor = await postUserID(tempUID);
    if (avatarColor) {
        tickLeft.style.backgroundColor = `hsl(${avatarColor[0]})`;
        tickLeft.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[0]})`;
        tickRight.style.backgroundColor = `hsl(${avatarColor[1]})`;
        tickRight.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;

        document.getElementById("comboBar").style.backgroundColor = `hsl(${avatarColor[0]})`;
        // document.getElementById("comboBar").style.filter = `drop-shadow(0 0 10px hsl(${avatarColor[0]}))`;
        document.getElementById("ppBar").style.backgroundColor = `hsl(${avatarColor[1]})`;
        // document.getElementById("ppBar").style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;

        // combo.style.borderColor = `hsl(${avatarColor[0]})`;
        // combo.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[0]})`;
        // pp.style.borderColor = `hsl(${avatarColor[1]})`;
        // pp.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;
    }
}

async function getUserDataSet(name) {
    try {
        const data = (
            await axios.get("/get_user", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    u: name,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function getUserTop(name) {
    try {
        const data = (
            await axios.get("/get_user_best", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    u: name,
                    limit: 5
                },
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    }
};

async function getMapDataSet(beatmapID) {
    try {
        const data = (
            await axios.get("/get_beatmaps", {
                baseURL: "https://osu.ppy.sh/api",
                params: {
                    k: api,
                    b: beatmapID,
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function postUserID(id) {
    try {
        let imageData = null;
        const dataImageAsBase64 = await axios.post('http://bangdream-wave-rsx-airblade-sh.herokuapp.com', { user_id: id }, {
            headers: {
                'content-type': 'application/json',
            }
        }).then(response => { imageData = response.data.data });
        return imageData;
    } catch (error) {
        console.error(error);
    }
}

accuracyCalc = (h300, h100, h50, h0) => {
    let accuracy = (h300 + h100 / 3 + h50 / 6) / (h300 + h100 + h50 + h0) * 100;
    return accuracy.toFixed(2);
}

grader = (h300, h100, h50, h0, isHD) => {
    // console.log(isHD);
    let acc = accuracyCalc(h300, h100, h50, h0);
    let maxCombo = h300 + h100 + h50 + h0;
    switch (true) {
        case (acc == 100 || maxCombo === 0):
            if (isHD === -1) {
                return `<div id="gradeOurplayer" style="width: 50px; color: #de3950; filter: drop-shadow(0 0 5px #de3950)">X</div>`;
                break;
            }
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">X</div>`;
            break;
        case (acc > 90 && h50 / maxCombo < 0.01 && h0 === 0):
            if (isHD === -1) {
                return `<div id="gradeOurplayer"  style="width: 50px; color: #f2d646; filter: drop-shadow(0 0 5px #f2d646)">S</div>`;
                break;
            }
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ffffff; filter: drop-shadow(0 0 5px #ffffff)">S</div>`;
            break;
        case ((acc > 80 && acc <= 90 && h0 === 0) || (h300 / maxCombo > 0.9)):
            return `<div id="gradeOurplayer"  style="width: 50px; color: #46f26e; filter: drop-shadow(0 0 5px #46f26e)">A</div>`;
            break;
        case ((acc > 70 && acc <= 80 && h0 === 0) || (h300 / maxCombo > 0.8)):
            return `<div id="gradeOurplayer"  style="width: 50px; color: #469cf2; filter: drop-shadow(0 0 5px #469cf2)">B</div>`;
            break;
        case ((h300 / maxCombo > 0.6) && (h300 / maxCombo <= 0.8)):
            return `<div id="gradeOurplayer"  style="width: 50px; color: #9f46f2; filter: drop-shadow(0 0 5px #9f46f2)">C</div>`;
            break;
        case ((h300 / maxCombo <= 0.6)):
            return `<div id="gradeOurplayer"  style="width: 50px; color: #ff0000; filter: drop-shadow(0 0 5px #ff0000)">D</div>`;
            break;
    }
}