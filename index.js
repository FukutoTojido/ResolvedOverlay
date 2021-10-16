const config = {};

// Get data from config file
fetch("config.json")
    .then((response) => response.json())
    .then((json) => Object.assign(config, json))
    .catch((error) => console.error("Could not read JSON file", error));

function setupConfig()
{
    // Setup leaderboard
    document.getElementById("leaderboard").style.opacity = Number(config.enableLeaderboard);

    // Setup recorder info
    document.getElementById("recorderName").innerHTML = config.recorderName;
    document.getElementById("recorderInfo").innerHTML = `Recorder: ${config.recorderName}`;
}

let api;

function setupAxios() {
    const instance = axios.create({
        baseURL: "https://osu.ppy.sh/api",
    });

    instance.interceptors.request.use((_config) => {
        console.log(config);

        _config.params = {
            k: config.apiKey,
            ..._config.params,
        };
        return _config;
    });

    api = instance;
}

// Setup necessary things
setTimeout(() => {
    setupAxios();
    setupConfig();
}, 100)

// Setup animations
const animations = {
    accuracy: new CountUp("acc", 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: false,
        separator: " ",
        decimal: ".",
        suffix: "%"
    }),

    score: new CountUp("score", 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: "."
    }),

    combo: new CountUp("combo", 0, 0, 0, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "x"
    }),
    
    starsCurrent: new CountUp("starsCurrent", 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        prefix: "Now: ",
        suffix: "*"
    }),
    
    stars: new CountUp("stars", 0, 0, 2, .2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        prefix: "Full: ",
        suffix: "*"
    }),
}

// START
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let rankingPanelBg = document.getElementById("rankingPanelBg");
let recorderTitle = document.getElementById("recorderTitle");
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
let urBar = document.getElementById("urBar");
let urTick = document.getElementById("urTick");
let avgHitError = document.getElementById("avgHitError");

let l300 = document.getElementById("l300");
let l100 = document.getElementById("l100");
let urIndex = document.getElementById("urIndex");

let leaderboardScores = document.getElementById("leaderboardScores");

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
let urResult = document.getElementById("urResult");

let r300 = document.getElementById("r300");
let r100 = document.getElementById("r100");
let r50 = document.getElementById("r50");
let r0 = document.getElementById("r0");

let ppResult = document.getElementById("ppResult");

socket.onopen = () => console.log("Successfully Connected")

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};

socket.onerror = error => console.log("Socket Error: ", error)

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
let tempCountryRank;
let tempPlayerPP;

let tempHP;
let tempMods;
let isHidden;

let rankingPanelSet;
let hasGetUserData = false;

let tempTimeCurrent;
let tempTimeFull;
let tempFirstObj;

let tempStrainBase;
let smoothOffset = 2;
let seek;
let fullTime;

let tempHitErrorArrayLength;
let od = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempTotalAvg = 0;
let tempTotalWeighted = 0;
let tempBool;

let tempURIndex;
let tempSmooth;

let tempSlotLength, tempCurrentPosition;
let hasSetLeaderboard = false;
let hasSetOurPlayer = false;
let ourplayerContainer;

let minimodsContainerOP, tempMinimodsOP, minimodsCountOP;

let hasSetColor = false;
let colorToSet = get_bg_color("#nowPlayingContainer");
let beatmapScores;

const chartConfig = {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            borderColor: "rgba(255, 255, 255, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
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
                cubicInterpolationMode: "monotone"
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

const chartConfigSecond = {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            borderColor: "rgba(0, 0, 0, 0)",
            borderWidth: "2",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
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
                cubicInterpolationMode: "monotone"
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

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, chartConfig);

    var ctxSecond = document.getElementById("canvasSecond").getContext("2d");
    window.myLineSecond = new Chart(ctxSecond, chartConfigSecond);
};

// Delay function for 100ms due to async
setTimeout(() => {
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const menu = data.menu;
        const gameplay = data.gameplay;

        if (!hasSetColor) {
            hasSetColor = true;
            setTimeout(() => colorToSet = get_bg_color("#nowPlayingContainer"), 550);
        }

        if (gameplay.name && tempUsername !== gameplay.name) {
            tempUsername = gameplay.name;
            username.innerHTML = tempUsername;
            setupUser(tempUsername);
        }

        if (tempImg !== menu.bm.path.full) {
            tempImg = menu.bm.path.full;
            menu.bm.path.full = menu.bm.path.full.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/"/g, "%27");
            mapContainer.style.backgroundImage = `url("http://127.0.0.1:24050/Songs/${menu.bm.path.full}?a=${Math.random(10000)}")`;
            mapContainer.style.backgroundPosition = "50% 50%";
            rankingPanelBg.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("http://127.0.0.1:24050/Songs/${menu.bm.path.full}?a=${Math.random(10000)}")`;
        }

        if (gameState !== menu.state) {
            gameState = menu.state;
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
                urIndex.style.transform = "none";

                document.getElementById("modsContainer").style.transform = "translateX(500px)";
                document.getElementById("leaderboard").style.transform = "translateX(-400px)";

                urIndex.innerHTML = "";

                setTimeout(() => {
                    leaderboardScores.innerHTML = "";
                    hasSetOurPlayer = false;
                    hasSetLeaderboard = false;
                    $("#ourplayer").remove();
                }, 1000)
            }
            else {
                deRankingPanel();
                upperPart.style.transform = "none";
                bottom.style.transform = "none";
                document.getElementById("modsContainer").style.transform = "none";
            }
        }

        if (tempMapID !== menu.bm.id || tempSR !== menu.bm.stats.fullSR) {
            hasSetColor = false;
            tempMapID = menu.bm.id;
            tempMapArtist = menu.bm.metadata.artist;
            tempMapTitle = menu.bm.metadata.title;
            tempMapDiff = "[" + menu.bm.metadata.difficulty + "]";
            tempMapper = menu.bm.metadata.mapper;
            tempRankedStatus = menu.bm.rankedStatus;

            tempCS = menu.bm.stats.CS;
            tempAR = menu.bm.stats.AR;
            tempOD = menu.bm.stats.OD;
            tempHPDr = menu.bm.stats.HP;
            tempSR = menu.bm.stats.fullSR;

            tempFirstObj = menu.bm.time.firstObj;

            mapName.innerHTML = tempMapArtist + " - " + tempMapTitle;
            mapInfo.innerHTML = `${tempMapDiff}`;

            stats.innerHTML = "CS: " + tempCS + "&emsp;" + "AR: " + tempAR + "&emsp;" + "OD: " + tempOD + "&emsp;" + "HP: " + tempHPDr + "&emsp;" + "Star Rating: " + tempSR + "★";
        }

        if (tempGrade !== gameplay.hits.grade.current) {
            tempGrade = gameplay.hits.grade.current;
        }

        if (gameplay.score == 0) { }

        if (tempScore !== gameplay.score) {
            tempTotalAvg = 0;
            tempTotalWeighted = 0;
            tempAvg = 0;
            tempScore = gameplay.score;
            score.innerHTML = tempScore;
            animations.score.update(score.innerHTML);
        }

        if (tempAcc !== gameplay.accuracy) {
            tempAcc = gameplay.accuracy;
            acc.innerHTML = tempAcc;
            animations.accuracy.update(acc.innerHTML);
        }

        if (fullTime !== menu.bm.time.mp3) {
            fullTime = menu.bm.time.mp3;
            onepart = 490 / fullTime;
        }

        if (tempStrainBase !== JSON.stringify(menu.pp.strains)) {
            tempLink = JSON.stringify(menu.pp.strains);
            smoothed = smooth(menu.pp.strains, smoothOffset);
            chartConfig.data.datasets[0].data = smoothed;
            chartConfig.data.datasets[0].backgroundColor = `rgba(${colorToSet.r}, ${colorToSet.g}, ${colorToSet.b}, 0.2)`;
            chartConfig.data.labels = smoothed;
            chartConfigSecond.data.datasets[0].data = smoothed;
            chartConfigSecond.data.datasets[0].backgroundColor = `rgba(${colorToSet.r}, ${colorToSet.g}, ${colorToSet.b}, 0.7)`;
            chartConfigSecond.data.labels = smoothed;
            if (window.myLine && window.myLineSecond) {
                window.myLine.update();
                window.myLineSecond.update();
            }
        }
        if (seek !== menu.bm.time.current && fullTime !== undefined && fullTime !== 0) {
            seek = menu.bm.time.current;
            progressChart.style.width = onepart * seek + "px";
        }
        if (tempMods !== menu.mods.str) {
            document.getElementById("modsContainer").innerHTML = "";

            tempMods = menu.mods.str;

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
                    mods.style.backgroundImage = `url("./static/mods/${tempMods.substr(i, 2)}.png")`;
                    mods.style.transform = `translateX(${i / 2 * 30}px)`;
                    document.getElementById("modsContainer").appendChild(mods);
                }
                i++;
            }

            if (od !== menu.bm.stats.OD)
                od = calculateNewOd(menu.bm.stats.OD, menu.mods.str);
        }
        if (tempCombo !== gameplay.combo.current) {
            tempCombo = gameplay.combo.current;
            if (gameplay.combo.current == gameplay.combo.max)
                tempMaxCombo = gameplay.combo.max;
            
            combo.innerHTML = tempCombo;
            animations.combo.update(combo.innerHTML);
        }

        if (gameplay.hits.hitErrorArray !== null) {
            tempSmooth = smooth(gameplay.hits.hitErrorArray, 4);

            if (tempHitErrorArrayLength !== tempSmooth.length) {
                tempHitErrorArrayLength = tempSmooth.length;
                for (var a = 0; a < tempHitErrorArrayLength; a++) 
                    tempAvg = tempAvg * 0.90 + tempSmooth[a] * 0.1;
                
                fullPos = (-10 * od + 199.5);
                tickPos = gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / fullPos * 145;
                avgHitError.style.transform = `translateX(${(tempAvg / fullPos) * 150}px)`;
                l100.style.width = `${(-8 * od + 139.5) / fullPos * 300}px`;
                l100.style.transform = `translateX(${(209.8 - ((-8 * od + 139.5) / fullPos * 300)) / 2}px)`;
                l300.style.width = `${(-6 * od + 79.5) / fullPos * 300}px`;
                l300.style.transform = `translateX(${(119.5 - ((-6 * od + 79.5) / fullPos * 300)) / 2}px)`;

                // UR bar tick
                let tick = document.createElement("div");
                tick.id = `tick${tempHitErrorArrayLength}`;
                tick.setAttribute("class", "tick");
                tick.style.opacity = 1;
                tick.style.transform = `translateX(${tickPos}px)`;
                urBar.appendChild(tick);

                const fade = () => tick.style.opacity = 0;
                const remove = () => urBar.removeChild(tick);
            
                setTimeout(fade, 2000);
                setTimeout(remove, 2500);
            }
        }

        if (tempURIndex !== gameplay.hits.unstableRate) {
            tempURIndex = gameplay.hits.unstableRate;
            urIndex.innerHTML = tempURIndex;
        }

        if (temp300 !== gameplay.hits[300]) 
            temp300 = gameplay.hits[300];
        
        if (temp100 !== gameplay.hits[100]) {
            temp100 = gameplay.hits[100];
            h100.innerHTML = temp100;
        }

        if (temp50 !== gameplay.hits[50]) {
            temp50 = gameplay.hits[50];
            h50.innerHTML = temp50;
        }

        if (temp0 !== gameplay.hits[0]) {
            temp0 = gameplay.hits[0];
            h0.innerHTML = temp0;
        }
        
        if (tempPP !== gameplay.pp.current) {
            tempPP = gameplay.pp.current;
            pp.innerHTML = tempPP;
        }

        if (tempTimeCurrent !== menu.bm.time.current) {
            if (tempTimeCurrent > menu.bm.time.current) {
                leaderboardScores.innerHTML = "";
                $("#ourplayer").remove();
                hasSetOurPlayer = false;
                hasSetLeaderboard = false;
            }
        
            tempTimeCurrent = menu.bm.time.current;
            tempTimeFull = menu.bm.time.mp3;
            interfaceID = data.settings.showInterface;

            if (tempTimeCurrent >= tempFirstObj + 5000 && tempTimeCurrent <= tempFirstObj + 11900 && gameState == 2) {
                recorderTitle.style.transform = "translateX(600px)";
                if (tempTimeCurrent >= tempFirstObj + 5500)
                    recorderName.style.transform = "translateX(600px)";
            }
            else {
                recorderTitle.style.transform = "none";
                recorderName.style.transform = "none";
            }

            if (tempTimeCurrent >= tempTimeFull - 10000 && gameState === 2 && !hasGetUserData)
                fetchData();

            if (tempTimeCurrent >= tempTimeFull - 2000 && gameState === 2)
                rankingPanelBg.style.opacity = 1;

            if (gameState === 7) {
                if (!rankingPanelSet)
                    setupRankingPanel();
                if (tempGrade !== "")
                    if (!isHidden)
                        rankingResult.style.backgroundImage = `url("./static/rankings/${tempGrade}.png")`;
                    else if (tempGrade === "S" || tempGrade === "SS")
                        rankingResult.style.backgroundImage = `url("./static/rankings/${tempGrade}H.png")`;
                    else
                        rankingResult.style.backgroundImage = `url("./static/rankings/${tempGrade}.png")`;
            } else
                if (!(tempTimeCurrent >= tempTimeFull - 500 && gameState === 2))
                    rankingPanelBg.style.opacity = 0;

            if (gameState == 2) {
                createLeaderboard(gameplay);

                if (interfaceID == 1 && gameState == 2) {
                    upperPart.style.transform = "translateY(-200px)";
                    bottom.style.transform = "translateY(300px)";
                    urIndex.style.transform = "translateY(-280px)";
                } else {
                    upperPart.style.transform = "none";
                    bottom.style.transform = "none";
                    urIndex.style.transform = "none";
                }
            }
        }

        if (gameplay.hp.smooth > 0) {
            hp.style.clipPath = `polygon(${(1 - gameplay.hp.smooth / 200) * 40 + 6.3}% 0%, ${(gameplay.hp.smooth / 200) * 40 + 53.7}% 0%, ${(gameplay.hp.smooth / 200) * 40 + 53.7}% 100%, ${(1 - gameplay.hp.smooth / 200) * 40 + 6.3}% 100%)`;
        } else {
            hp.style.clipPath = `polygon(6.3% 0, 93.7% 0, 93.7% 100%, 6.3% 100%)`;
        }
    }
}, 100);

async function setupUser(username) {
    const user = await getUserData(username) || {
        "user_id": "gamer",
        "username": username,
        "pp_rank": "0",
        "pp_raw": "0",
        "country": "__",
        "pp_country_rank": "0",
    }

    tempCountry = `${(user.country).split("").map(char => 127397 + char.charCodeAt())[0].toString(16)}-${(user.country).split("").map(char => 127397 + char.charCodeAt())[1].toString(16)}`;
    tempRanks = user.pp_rank;
    tempCountryRank = user.pp_country_rank;
    tempPlayerPP = user.pp_raw

    if (user.user_id !== "gamer") 
        ava.style.backgroundImage = `url("https://a.ppy.sh/${user.user_id}")`;
    else 
        ava.style.backgroundImage = "url(\"./static/gamer.png\")";

    playerPP.innerHTML = Math.round(tempPlayerPP) + "pp";
    ranks.innerHTML = "#" + tempRanks;
    countryRank.innerHTML = "#" + tempCountryRank;
    country.style.backgroundImage = `url("https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg")`;

    const avatarColor = await postUserId(user.user_id);
    if (avatarColor) {
        tickLeft.style.backgroundColor = `hsl(${avatarColor[0]})`;
        tickLeft.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[0]})`;
        tickRight.style.backgroundColor = `hsl(${avatarColor[1]})`;
        tickRight.style.boxShadow = `0 0 10px 3px hsl(${avatarColor[1]})`;

        document.getElementById("comboBar").style.backgroundColor = `hsl(${avatarColor[0]})`;
        document.getElementById("ppBar").style.backgroundColor = `hsl(${avatarColor[1]})`;
    }
}

async function getUserData(name, mode = 0) {
    try {
        const data = (
            await api.get("/get_user", {
                params: {
                    u: name,
                    m: mode
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function getUserTopPlays(name, mode = 0) {
    try {
        const data = (
            await api.get("/get_user_best", {
                params: {
                    u: name,
                    m: mode,
                    limit: 5
                },
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    }
};

async function getBeatmapData(beatmapId, mode = 0) {
    try {
        const data = (
            await api.get("/get_beatmaps", {
                params: {
                    b: beatmapId,
                    m: mode
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function getBeatmapScores(beatmapId, mode = 0) {
    try {
        const data = (
            await api.get("/get_scores", {
                params: {
                    b: beatmapId,
                    m: mode
                },
            })
        )["data"];
        return data.length !== 0 ? data[0] : null;
    } catch (error) {
        console.error(error);
    }
};

async function postUserId(id) {
    try {
        const imageData = ((await axios.post("http://bangdream-wave-rsx-airblade-sh.herokuapp.com",
            { user_id: id },
            {
                headers: {
                    "content-type": "application/json",
            }
        }))["data"])["data"];
        return imageData;
    } catch (error) {
        console.error(error);
    }
}
