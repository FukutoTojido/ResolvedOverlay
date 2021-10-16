const gradeColors = {
    "XH": "#FFFFFF",
    "X": "#DE3950",
    "SH": "#FFFFFF",
    "S": "#F2D646",
    "A": "#46F26E",
    "B": "#469CF2",
    "C": "#9F46F2",
    "D": "#FF0000",
}

const isEmptyObject = (object) => Object.keys(object).length === 0 && object.constructor === Object;

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const calculateNewOd = (od, mods) => {
	if (mods.includes("DT") || mods.includes("NC"))
		return 500 / 333 * od + (-2210) / 333;
	
	if (mods.includes("HT"))
		return 500 / 667 * od + (-2210) / 667;
	
	return od;
}

const calculateAccuracy = (h300, h100, h50, h0) => Number(((h300 + h100 / 3 + h50 / 6) / (h300 + h100 + h50 + h0)) * 100).toFixed(2);

const getGradeStyle = (h300, h100, h50, h0, hasHiddenMod = false) => {
	const getGradeStyleByGrade = (grade) =>
		`<div id="gradeOurplayer" \n style="width: 50px; color: ${gradeColors[grade]}; filter: drop-shadow(0 0 5px ${gradeColors[grade]})">${grade}</div>`;

	return getGradeStyleByGrade(getGrade(h300, h100, h50, h0, hasHiddenMod));
};

function getGrade(h300, h100, h50, h0, hasHiddenMod = false) {
	// Calculate accuracy and max combo
	let accuracy = calculateAccuracy(h300, h100, h50, h0);
	let maxCombo = h300 + h100 + h50 + h0;

	// X aka SS grade
	if (accuracy == 100 || maxCombo === 0) {
		// XH grade
		if (hasHiddenMod) return "XH";
		return "X";
	}

	// S grade
	if (accuracy == 100 || maxCombo === 0) {
		// SH grade
		if (hasHiddenMod) return "SH";
		return "S";
	}

	// A grade
	if ((accuracy > 80 && accuracy <= 90 && h0 === 0) || h300 / maxCombo > 0.9) return "A";

	// B grade
	if ((accuracy > 70 && acc <= 80 && h0 === 0) || h300 / maxCombo > 0.8) return "B";

	// C grade
	if (h300 / maxCombo > 0.6 && h300 / maxCombo <= 0.8) return "C";

	// D grade
	return "D";
}
