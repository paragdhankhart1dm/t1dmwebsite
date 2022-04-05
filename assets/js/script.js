async function onVisLoad() {
    console.log('Load complete');
    await getData();
    changeHorizon(5);
}

const prefix = '';
const dataFolder = prefix+"outputs/";
const dataApi = prefix+"getData.php"
var currentHorizon = 5;
var availableHorizons = [5, 15, 30];
var warning = false;
var hMap = {};

const MALE_ASSETS = [
    'assets/imgs/male1.png',
    'assets/imgs/male2.png',
];

const FEMALE_ASSETS = [
    'assets/imgs/female1.png',
    'assets/imgs/female2.png',
];

///API CONSTANTS

const API_USER = "user"
const API_USER_NAME = "name"
const API_USER_GENDER = "gender"

const API_HORIZONS = "h"
const API_HORIZON_TIME = 'time'
const API_HORIZON_PREDICTION_FILE = 'prediction'
const API_RMSE = "rmse"
const API_UNIT = "unit"
const API_START_DATE = "start_date"
const API_END_DATE = "stop_date"
const API_TEST_DATE = 'test_date'
const API_TEST_PATH = "test_prediction_path"

const API_GRAPH_TEST = "graph_test"
const API_HELPER_GRAPHS = "analysis_graphs"
const API_GRAPH_FIT = "graph_fit"
const API_GRAPH_INPUTS = "input_graphs"

function changeHorizon(horizon) {
    if (!availableHorizons.includes(horizon)) {
        return;
    }
    currentHorizon = horizon;
    console.info('horizon is', currentHorizon)

    //set graph
    setGraph(currentHorizon);

    //set button
    let b5 = document.getElementById('b5');
    let b15 = document.getElementById('b15');
    let b30 = document.getElementById('b30');

    b5.classList.remove('active-horizon');
    b15.classList.remove('active-horizon');
    b30.classList.remove('active-horizon');

    switch (currentHorizon) {
        case 5:
            b5.classList.add('active-horizon');
            break;
        case 15:
            b15.classList.add('active-horizon');
            break;
        case 30:
            b30.classList.add('active-horizon');
            break;
    }
    //set text
    document.getElementById('prediction_horizon').innerText = currentHorizon;
    document.getElementById('prediction_horizon2').innerText = currentHorizon;

    normalText = document.getElementById('normal_interpretation');
    warningText = document.getElementById('warning_interpretation');
    normalText.classList.remove('hidden');
    warningText.classList.remove('hidden');
    //set warning
    if (!warning) {
        warningText.classList.add('hidden');
    } else {
        normalText.classList.add('hidden');
    }
    setAnalysisUI();
}

function setGraph(horizon) {
    const img = prefix+hMap[horizon][API_GRAPH_TEST];
    console.log(img);
    document.getElementById('graph').setAttribute('src',img);

}

async function getData() {
    console.log('fetching user data 2 from ', dataApi);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    
    const response = await fetch(dataApi, requestOptions);  
    const jData = JSON.parse(await response.text());
    console.log(jData);

    setUserData(jData[API_USER]);
    setHorizonData(jData[API_HORIZONS]);
}

async function getData2() {
    console.log('fetching user data 2 from ', dataApi);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    
    const response = await fetch(dataApi, requestOptions);  
    const jData = JSON.parse(await response.text());
    hMap = jData;
    console.log(jData);
}

function setUserData(jUser) {
    document.getElementById('user-name').innerText = jUser[API_USER_NAME];
    const gender = jUser[API_USER_GENDER];
    if(gender == "M"){
        //todo: pick random asset
        const random = MALE_ASSETS[Math.floor(Math.random() * MALE_ASSETS.length)];
        document.getElementById('user-icon').setAttribute("src",random);
    }
}

function setHorizonData(hData) {
    for (let h of hData){
        hMap[h[API_HORIZON_TIME]] = h;
    }
    console.log(hMap);
}

class HorizonData {
    time=0;
    unit="minutes";
    rmse = "";
    prediction_path = "";
    constructor(hData){
        this.time = hData[API_HORIZON_TIME];
        this.unit = hData[API_UNIT];
        this.rmse = API_RMSE;
        this.prediction_path = API_HORIZON_PREDICTION_FILE;
    }
}
// Set name on index.html

function setIndexData() {
    
}
var showAnalysis = false;
function toggleAnalysis() {
    showAnalysis = !showAnalysis;
    setAnalysisUI();
}

function setAnalysisUI() {
    let analysisButtonText = (showAnalysis)?"Hide data analysis":"View data analysis";
    document.getElementById('analysisButton').innerHTML = analysisButtonText;

    anDiv = document.getElementById('analysis');

    if(showAnalysis) {
        anDiv.classList.remove("display");
    }else{
        anDiv.classList.add("display");
        return;
    }

    anDiv.innerHTML = "";
    let imgs = ""
    imgs += '<h1 class"title">Input Data</h1>'
    for (let inputImg of hMap[currentHorizon][API_GRAPH_INPUTS]){
        inputImg = prefix+inputImg;
        // console.log(inputImg);
        imgs += `<img src = '${inputImg}'>`
    }

    imgs += '<h1 class"title">Training accuracy</h1>'
    let fitGraph = prefix + hMap[currentHorizon][API_GRAPH_FIT]
    imgs += `<img src = '${fitGraph}'>`
    console.log(imgs);
    anDiv.innerHTML = imgs;
}

async function loadMain() {
    await getData2();
    document.getElementById('username').innerHTML = hMap[API_USER][API_USER_NAME];
}