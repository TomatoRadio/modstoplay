function sortMods() {
    const userPrefs = getUserPrefs();
    let list = document.getElementById('mod_list')
    let sorted = [...list.children].sort(function(mod1,mod2) {
        return getModMatch(mod2,userPrefs) - getModMatch(mod1,userPrefs);
    });
    list.innerHTML = sorted.map(ele => ele.outerHTML).join('');
};

function getUserPrefs() {
    var prefs = {};
    ['story','gameplay','art','comedy','vanilla','playtime','language'].filter(function(id) {
        let suffix = id === 'complete' ? '' : '-check';
        return document.getElementById(id+suffix) ? document.getElementById(id+suffix).checked : true;
    }).forEach(function(id) {
        let val = document.getElementById(id).value;
        if (parseInt(val)) {val = parseInt(val)};
        if (val === 'on') {val = 'complete'};
        prefs[id] = val;
    });
    return prefs
};

function getModMatch(mod,prefs) {
    let match = 30;
    for (let key in prefs) {
        let mVal = getValueFromMod(mod,key)
        let uVal = prefs[key];
        if (typeof mVal === 'number') {
            match -= Math.abs(mVal - parseInt(uVal));
        } else if (Array.isArray(mVal)) {
            match -= mVal.includes(uVal) ? 0 : 100;
        } else if (uVal !== mVal) {match -= 100};
    };
    console.log(getModName(mod),match,match/30);
    mod.style.backgroundColor = `#333`
    if (match >= 0) {
        mod.style.backgroundColor = `rgb(${175*(1-match/30)},${150*(match/30)},0)`
        console.log(mod.style.backgroundColor);
    } else {
        mod.style.backgroundColor = `#313`
    }
    mod.getElementsByTagName('var')[0].innerText = match;
    return match;
};

function getModName(mod) {
    return mod.getElementsByTagName('a')[0].innerText;
};

function getValueFromMod(mod,key) {
    let text = mod.getElementsByClassName(key)[0].innerHTML.replace(/([^\w])+/,'');
    switch (text.toLowerCase()) {
        case 'high':return 5;
        case 'm-high':return 4;
        case 'medium':case 'idk':return 3;
        case 'm-low':return 2;
        case 'low':return 1;
        default: return text.toLowerCase().split(" ");
    };
};

function flipBool(element) {document.getElementById(element.id.replace('-check','')).disabled = !document.getElementById(element.id.replace('-check','')).disabled};