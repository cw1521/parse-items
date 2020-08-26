
function getNotes(notes) {
    return notes;
}


function getItemStatsArray(statsblock) {
    let statsArray = statsblock.replace(/<br>/g, "\n");
    statsArray = statsArray.replace(/<BR>/, "")
    statsArray = statsArray.replace(/:[ \[]+/g, ":").replace(/[\]]+/g, "");
    statsArray = statsArray.replace(/Effect:/g, "Effect: ").replace(/Time:/g, "Time: ");
    statsArray = statsArray.replace(/Illusion:/g, "Illusion: ");
    statsArray = statsArray.replace(/ITEM/g, "ITEM|");
    statsArray = statsArray.replace(/\(Effect\)\|[A-Za-z (]+\(/g, "(")
    statsArray = statsArray.replace("NODROP", "NO DROP").trim().replace(/NO DROP/g, "NO DROP|");
    statsArray = statsArray.replace(/\|<span class\=[\'a-zA-Z> ]+<\/span>/g, "");
    statsArray = statsArray.replace(/1H/g, "1H").replace(/2H/g, "2H");
    statsArray = statsArray.split("\n");
    statsArray = statsArray.filter(elem => { return elem != ''});
    return statsArray;
}


function parseItemStatsArray(item, itemStatsArray) {
    for (let elem of itemStatsArray) {
        elem = elem.replace(/SV /g, "SV_").replace(/Atk /g, "Atk_");
        elem = elem.replace(/Weight /g, "Wt_").replace(/Size /g, "Size_");
        
        elem = elem.trim();
    
        if (elem.includes("Class")) {
            setClasses(item, elem);
        }
        else if (elem.includes("Race")) {
            setRaces(item, elem);
        }
        else if (elem.includes("Slot:")) {
            elem = elem.split("Slot:")[1].split(" ");
            item.slot = elem;
        }
        else if (elem.includes("Effect: ")) {
            elem = elem.replace("[[", "").trim();
            elem = elem.split("Effect: ")[1];
            item.effect = elem;
        }
        else if (elem.includes("|")) {
            elem = elem.split("|");
            elem = elem.filter(ele => { return ele != "" });
            for (let ele of elem) {
                if (ele.includes("MAGIC")) item.magic = true;
                else if (ele.includes("LORE")) item.lore = true;
                else if (ele.includes("DROP") || ele.includes("TRADE")) item.no_drop = true;
                else if (ele.includes("RENT") || ele.includes("TEMPORARY")) item.temporary = true;
                else if (ele.includes("QUEST")) item.quest = true;
                else console.dir(ele);
            }
        }
        else if (elem.includes("EXPENDABLE")) {
            let itemStats = elem.split("  ");
            item.expendable = true;
            let charges = itemStats[1].split(":")[1];
            item.charges = charges;
            // console.dir(itemStats);
        }
        else {
            elem = elem.replace(/[ ]+/g, "|");
            elem = elem.replace(/\|Instrument/g, " Instrument");
            elem = elem.replace(/1H\|/g, "1H ").replace(/2H\|/g, "2H ");
            elem = elem.replace(/\|to\|/g, " to ").replace(/\|Atk/g, " Atk");
            elem = elem.replace(/POISON\|/g, "POISON:");
            // if (item.name == "Glowing Red Stone") {
            //     console.dir(elem)
            //     console.log()
            // }
            elems = elem.trim().split("|");
            for (let stat of elems) {

                let classes = ["WAR", "CLR", "PAL", "RNG", "SHD", "BRD", "DRU", "MNK", "ROG", "SHM", "NEC", "WIZ", "MAG", "ENC"];

                stat = stat.split(":");
                item[stat[0].toLowerCase()] = stat[1];
                // if (classes.findIndex != -1) item.classes.push(stat)

                // if (item.name == "Glowing Red Stone") {
                //     console.dir(item.classes)
                //     console.log()
                // }
            }
            // console.dir(elems)
        }
    }

    // console.dir(itemStatsArray);
}



function setClasses(item, classElem) {
    let classes = ["WAR", "CLR", "PAL", "RNG", "SHD", "BRD", "DRU", "MNK", "ROG", "SHM", "NEC", "WIZ", "MAG", "ENC"];
    if (!classElem.includes("except")) {
        item.classes = classElem.split("Class:")[1].split(" ");
    }
    else {
        classElem = classElem.split("Class:")[1].split(" except");
        if (classElem[1] != '') {
            let excludedClasses = classElem[1].trim().split(" ");
            classes = classes.filter(tempClass => { return excludedClasses.indexOf(tempClass) == -1 });
            item.classes = classes;
        }
        else item.classes = [classElem[0]];
    }
}



function setRaces(item, raceElem) {
    let races = ["HUM", "BAR", "ERU", "HEF", "ELF", "HIE", "DEF", "DWF", "HFL", "GNM", "TRL", "OGR", "IKS"];

    if (!raceElem.includes("except")) {
        item.races = raceElem.split("Race:")[1].split(" ");
    }
    else {
        raceElem = raceElem.split("Race:")[1].split(" except");
        if (raceElem[1] != '') {
            let excludedRaces = raceElem[1].trim().split(" ");
            races = races.filter(race => { return excludedRaces.indexOf(race) == -1 });
            item.races = races;
        }
        else item.races = [raceElem[0]];
    }
}




function getItemInfoObj(itemInfo) {
    let itemInfoObj = new Object();
    let itemInfoArray = itemInfo.split("\n|");
    for (let elem of itemInfoArray) {
        if (elem.includes("notes")) {
            let notes = elem.split("notes")[1].trim();
            if (notes != "=") itemInfoObj.notes = notes;
        }
        else if (elem.includes("itemname")) {
            let itemname = elem.split("=")[1].trim();
            itemInfoObj.itemname = itemname;
        }
        else if (elem.includes("lucy_img_ID")) {
            let lucy_img_id = elem.split("=")[1].trim();
            itemInfoObj.lucy_img_id = lucy_img_id;
        }
        else if (elem.includes("statsblock")) {
            let statsblock = elem.replace("=\n", "= \n").replace("statsblock  = ", "statsblock  = \n");
            statsblock = statsblock.split("= \n")[1].trim();
            itemInfoObj.statsblock = statsblock;
        }
        else if (elem.includes("dropsfrom")) {
            let dropsfrom = elem.replace("=\n", "= \n").split("= \n");
            if (dropsfrom.length == 2) {
                dropsfrom = dropsfrom[1].trim();
                itemInfoObj.dropsfrom = dropsfrom;
            }
        }
        else if (elem.includes("merchant_value")) {
            let merchant_value = elem;
            if (!merchant_value.includes("=\n"))
                merchant_value = merchant_value.replace("=", "=\n");
            merchant_value = merchant_value.split("=\n")[1].trim();
            itemInfoObj.merchant_value = merchant_value;
        }
        else if (elem.includes("relatedquests"))
        {
            let relatedquests = elem.replace("relatedquests=", "relatedquests =");
            relatedquests = relatedquests.split("relatedquests =")[1].trim();
            itemInfoObj.relatedquests = relatedquests;
        }
        else if (elem.includes("playercrafted")) {
            let playercrafted = elem.split("=")[1].trim();
            itemInfoObj.playercrafted = playercrafted;
        }
        else if (elem.includes("soldby")) {
            let soldby = elem.split(" = \n")[1].trim();
            itemInfoObj.soldby = soldby;
        }
        else if (elem.includes("recipes")) {
            let recipes = elem.split("=")[1].trim();
            itemInfoObj.recipes = recipes;
        }
        else if (elem.includes("foraged")) {
            let foraged = elem.split("=")[1].trim();
            itemInfoObj.foraged = foraged;
        }
        else if (elem.includes("second_image") || elem.includes("second_imagetext")) {
            // console.dir(elem);
            
        }
        // else {
        //     console.dir(elem);
        //     console.log("\n");
        // }
    }
    return itemInfoObj;
}

function parseItemDropsFrom(item, dropsFrom) {
    console.dir(dropsFrom);
    let tempDropsFrom = dropsFrom.split("\n\n");
    // console.dir(tempDropsFrom);
    // if (tempDropsFrom.length > 2) console.dir(tempDropsFrom);

}




// TODO:
// recipes, foraged, soldby, playercrafted, relatedquests, etc ??
// add lucy_img_id

function parseItemInfo(item, itemInfo) {
    let itemInfoObj = getItemInfoObj(itemInfo);
    if (itemInfoObj.notes) item.notes = getNotes(itemInfoObj.notes);
    if (itemInfoObj.statsblock) {
        let itemStatsArray = getItemStatsArray(itemInfoObj.statsblock);
        parseItemStatsArray(item, itemStatsArray);           
    }
    if (itemInfoObj.itemname) item.name = itemInfoObj.name; 
    if (itemInfoObj.lucy_img_id) item.lucy_img_id = itemInfoObj.lucy_img_id;
    if (itemInfoObj.dropsfrom) parseItemDropsFrom(item, itemInfoObj.dropsfrom)

    // console.dir(itemInfoObj);
    // console.log("\n");

}







function getItemInfo(page) {
    let itemText = page.revision[0].text[0]._; 
    while (itemText.includes("{{Itempage\n")) {
        itemText = itemText.replace(/\{\{Itempage\n/g, "{{Itempage");
    }
    itemText = itemText.replace(/\{\{Itempage/g, "{{Itempage\n\n");
    itemText = itemText.replace(/\n\}\}\n\n\[\[Category:/, "\n\n}}\n\n[[Category:");
    itemText = itemText.replace(/\n\}\}\n\[\[Category:/, "\n\n}}\n\n[[Category:");
    itemText = itemText.replace(/\n\}\}\n\[\[File:/, "\n\n}}\n\n[[File:");
    itemText = itemText.replace(/\n\}\}\n\{\{FashionShow\n/, "\n\n}}\n\n{{FashionShow\n");
    itemText = itemText.replace(/\n\n\}\}\n==/, "\n\n}}\n\n[[");
    itemText = itemText.split("{{Itempage\n\n")[1];
    itemText = itemText.split("\n\n}}\n\n");
    let categoryText = itemText[1];
    categoryText = categoryText.split("{{FashionShowEnd}}");
    if (categoryText.length > 1) {
        itemText[1] = categoryText[1].trim()
    }
    return itemText;
}





function getPages(xml) {
    return xml.mediawiki.page
}



function parseItem(page) {
    let item = new Object();
    item.name = page.title[0];
    let itemInfo = getItemInfo(page);
    item.category = itemInfo[1];
    parseItemInfo(item, itemInfo[0]);
}


exports.getPages = getPages;
exports.parseItem = parseItem;