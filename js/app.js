questions = [
    "Things that are hard are the most rewarding.",
    "I enjoy learning new things.",
    "I see great things in my future.",
    "I use my time extremely efficiently.",
    "People would describe me as someone who gets stuff done.",
    "When I have something to do, I get started right away.",
    "I take initiative in getting things done.",
    "I believe I have a purpose in life.",
    "I am willing to take risks.",
    "Going to college is not necessary for me to be successful.",
    "There are many colleges that I could be successful at.",
    "I enjoy meeting new people.",
    "I would consider myself a \"people person.\"",
    "I like having people depend on me.",
    "I do my best when the community around me is doing its best.",
    "I spend a lot of time getting out of my comfort zone.",
    "People would describe me as creative.",
    "I am always asking questions.",
    "Some people would describe me as quirky or weird.",
    "I like hearing new ideas.",
    "Sharing is caring.",
    "It’s important to find something I love to do.",
    "I’ve made a difference in people’s lives.",
    "I want to help people.",
    "Helping other people makes me feel good.",
    "I’m good at introducing myself to new people.",
    "I’m assertive when I know what I want.",
    "When working in a team, I make the other members better.",
    "When working in a group, I am often a leader.",
    "I like solving problems.",
    "I’m level-headed when tensions are high.",
    "I do well under pressure.",
    "Brainstorming is an important skill.",
    "I like to create new things.",
    "If a classmate read something I wrote, they would be able to tell it was me based on my writing style.",
    "Failure can be a great learning opportunity.",
    "Some things are worth trying, even if they are unlikely to succeed.",
    "I like to surround myself with smart people.",
    "I work harder than most of my peers.",
    "I’m good at balancing multiple tasks.",
    "I get along well with many different kinds of people.",
    "When I have an issue with somebody, I am usually direct in telling them how I feel.",
    "Cheating is never acceptable.",
    "I am good with time management.",
    "I rarely lose important things.",
    "My life matters.",
    "I would read more if I had more free time.",
    "I will make the college I go to better.",
    "I have high expectations for myself.",
    "I like discovering new things.",
    "I challenge others and myself to think outside the box.",
    "I know my strengths and weaknesses.",
    "I’m actively working to correct some of my weaknesses.",
    "I want to travel in college.",
    "Most people that meet me remember me.",
    "I spent my time in high school doing things I genuinely loved doing.",
    "I like to create my own opportunities.",
    "I am usually engaged and participate in class.",
    "I generally don’t get too stressed out.",
    "I am good at meeting deadlines.",
    "I am comfortable with complexity.",
    "I am very perceptive.",
    "I am willing to make sacrifices.",
    "I like working with people towards a larger vision.",
    "When I have questions in school, I find someone to ask.",
    "I try my best to stay actively conscious and not drift off during the day."
];
usedquestions = [];
var SAT_MEAN = 1020;
var SAT_S = 194;

var actual_JSON;
var ids = [];
loadJSON(function (response) {
    actual_JSON = JSON.parse(response);
    for (i = 0; i < actual_JSON.length; i++) {
        var temp = document.createElement("option");
        temp.value = actual_JSON[i].NAME;
        ids.push(actual_JSON[i].NAME);
        temp.innerHTML = actual_JSON[i].NAME;
        document.getElementById("dl").appendChild(temp);
    }
    var nativedatalist = !!('list' in document.createElement('input')) &&
        !!(document.createElement('datalist') && window.HTMLDataListElement);

    if (!nativedatalist) {
        $('input[list]').each(function () {
            var availableTags = $('#' + $(this).attr("list")).find('option')
                .map(function () {
                    return this.value;
                }).get();
            $(this).autocomplete({
                source: availableTags
            });
        });
    }
});

$("span[title]").click(function () {
    var $title = $(this).find(".title");
    if (!$title.length) {
        $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
    } else {
        $title.remove();
    }
})

function percentile(z)  {
    // Source http://stackoverflow.com/questions/16194730/seeking-a-statistical-javascript-function-to-return-p-value-from-a-z-score
    //z == number of standard deviations from the mean

    //if z is greater than 6.5 standard deviations from the mean
    //the number of significant digits will be outside of a reasonable 
    //range
    if ( z < -6.5)
      return 0.0;
    if( z > 6.5) 
      return 1.0;

    var factK = 1;
    var sum = 0;
    var term = 1;
    var k = 0;
    var loopStop = Math.exp(-23);
    while(Math.abs(term) > loopStop) 
    {
      term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
      sum += term;
      k++;
      factK *= k;

    }
    sum += 0.5;

    return sum;
}

function getObjectiveScore(gpa, apsTaken, honorsTaken, sat) {
    var index = ids.indexOf(cinput.value);
    var college = actual_JSON[index];
    var output = 0;
    // Standardized Test Weighting
    // Maximum Score is 20 for Perfect SAT
    var satCoeff = sat / 100;
    if (sat < parseInt(college.SAT_25)) satCoeff = sat / 120;
    if (sat > parseInt(college.SAT_75)) satCoeff = sat / 80;
    output += satCoeff * percentile((sat - SAT_MEAN) / SAT_S);

    // Grade Point Average Weighting
    // Maximum Score is 20 for Perfect 4.0 GPA
    var gpaCoeff = gpa * 5;
    if (gpa < parseFloat(college.GPA) * 0.8) gpaCoeff = gpa * 3;
    else if (gpa < parseFloat(college.GPA)) gpaCoeff = gpa * 4;
    output += gpaCoeff * (gpa / 4);

    // Course Rigor Weighting
    // Maximum Score is 10 for 10+ AP-Equiv Classes
    var honorsWeight = 0.5;
    output += Math.min(apsTaken + honorsTaken * honorsWeight, 10);

    // Maximum Score is 50
    return output;
}

function actToSatConvert(testScore) {
    // More accurate score conversion than regular scaling
    // Uses official concordance tables
    switch(testScore) {
        case 11: return 530; break;
        case 12: return 585; break;
        case 13: return 640; break;
        case 14: return 690; break;
        case 15: return 740; break;
        case 16: return 790; break;
        case 17: return 835; break;
        case 18: return 875; break;
        case 19: return 915; break;
        case 20: return 955; break;
        case 21: return 995; break;
        case 22: return 1030; break;
        case 23: return 1065; break;
        case 24: return 1105; break;
        case 25: return 1145; break;
        case 26: return 1185; break;
        case 27: return 1225; break;
        case 28: return 1265; break;
        case 29: return 1305; break;
        case 30: return 1340; break;
        case 31: return 1375; break;
        case 32: return 1415; break;
        case 33: return 1460; break;
        case 34: return 1510; break;
        case 35: return 1565; break;
        case 36: return 1600; break;
        default: return 0;
    }
}

getdata.onclick = function() {
    // Data validation
    if ((satbox.value > 36 && satbox.value < 400) || satbox.value < 11 || satbox.value > 1600) {
        alert("Please enter a valid test score.");
        return;
    }
    if (usedquestions.length <= 20) {
        warning.style = "text-align: center; display: block; color: red";
        return;
    }
    if (gpabox.value < 0 || gpabox.value > 4) {
        return;
    }

    // Integration of college information
    details_link.style = "border-bottom: 1px dotted; cursor: pointer; display: inline";
    var index = ids.indexOf(cinput.value);
    var college = actual_JSON[index];
    stats_gpa.innerText = college.GPA;
    stats_rate.innerText = (parseFloat(college.ADMISSION) * 100).toPrecision(2);
    stats_sat_25.innerText = college.SAT_25;
    stats_sat_75.innerText = college.SAT_75;
    stats_act_25.innerText = college.ACT_25;
    stats_act_75.innerText = college.ACT_75;
    stats_address.innerText = college.ADDRESS;
    stats_address.innerText = college.ADDRESS;

    // Personal Scores
    var testValue = parseInt(satbox.value) > 36 ? parseInt(satbox.value) : actToSatConvert(parseInt(satbox.value));
    var pObjectiveScore = getObjectiveScore(parseFloat(gpabox.value), parseFloat(ap5box.value), parseFloat(ap4box.value), testValue);
    var pSubjectiveScore = sub / 3;

    // College Specific Scores
    var cAP = parseFloat(college.ADMISSION) * 10;
    var cObjective75 = getObjectiveScore(parseFloat(college.GPA), cAP * 1.2, 0, parseInt(college.SAT_75));
    var cObjective50 = getObjectiveScore(parseFloat(college.GPA), cAP, 0, (parseInt(college.SAT_75) + parseInt(college.SAT_25)) / 2);
    var cObjective25 = getObjectiveScore(parseFloat(college.GPA), cAP * 0.8, 0, parseInt(college.SAT_25));
    var cComprehensiveScore = cObjective50 + 50 * (1 - parseFloat(college.ADMISSION));
    var exceptionalApplicant = pObjectiveScore > cObjective75;
    var aboveAverageApplicant = pObjectiveScore > cObjective50;
    var belowAverageApplicant = pObjectiveScore < cObjective25;

    // Calculate Final Projected Scores
    var pComprehensiveScore = pObjectiveScore + pSubjectiveScore;
    if (exceptionalApplicant) {
        pComprehensiveScore = Math.min(100, pComprehensiveScore * 1.05);
    } else if (aboveAverageApplicant)  {
        pComprehensiveScore = Math.min(100, pComprehensiveScore * 1.025);
    } else if (belowAverageApplicant) {
        pComprehensiveScore *= 0.9;
    }
    var percent = getTotalApplicantScore(pComprehensiveScore, cComprehensiveScore);

    finalscore.value = percent.toPrecision(2) + "%";
    objective.innerText = pObjectiveScore.toPrecision(4);
    subjective.innerText = pSubjectiveScore.toPrecision(4);
    composite.innerText = pComprehensiveScore.toPrecision(4);
    scaled.innerText = percent.toPrecision(4);
}

function getTotalApplicantScore(pTA, cTA) {
    var index = ids.indexOf(cinput.value);
    var acceptance = parseFloat(actual_JSON[index].ADMISSION) * 100;
    var curve = 3 * (pTA - cTA);
    return Math.max(Math.min(acceptance + curve, 95), 5);
}


function changeQuestion() {
    warning.style = "text-align: center; display: none";
    var loop = true;
    while (loop) {
        var index = Math.floor(Math.random() * questions.length);
        if (usedquestions.indexOf(index) < 0) {
            usedquestions.push(index);
            loop = false;
            questiontag.innerHTML = "Question " + usedquestions.length + " of 20: " + questions[index];
        }
    }
    if (usedquestions.length > 20) {
        button1.disabled = true;
        button2.disabled = true;
        button3.disabled = true;
        button4.disabled = true;
        button5.disabled = true;
        questiontag.innerHTML = "Click Chance Me to see your chances";
    }
}

var sub = 50;
button1.onclick = function () {
    sub += 5;
    changeQuestion();
}
button2.onclick = function () {
    sub += 3;
    changeQuestion();
}
button3.onclick = function () {
    sub += 0;
    changeQuestion();
}
button4.onclick = function () {
    sub += -3;
    changeQuestion();
}
button5.onclick = function () {
    sub += -5;
    changeQuestion();
}

changeQuestion();

function r() {
    button1.disabled = false;
    button2.disabled = false;
    button3.disabled = false;
    button4.disabled = false;
    button5.disabled = false;
    sub = 50;
    ids = null;
    actual_JSON = null;
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadText(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("text/plain");
    xobj.open('GET', 'builddate', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadText(function (response) {
    document.getElementById('builddate').innerText = response.substring(response.indexOf(' ') + 1);
});

var visible = false;

function toggleDetails() {
    if (visible) {
        details.style = "display:none";
        details_link.innerText = "Show Details";
    } else {
        details.style = "display:inline";
        details_link.innerText = "Hide Details";
    }
    visible = !visible;
}


function toggleExplain() {
    if (visible) {
        explain.style = "display:none";
        explain_link.innerText = "How does it work?";
    } else {
        explain.style = "display:inline";
        explain_link.innerText = "Hide Explanation";
    }
    visible = !visible;
}
