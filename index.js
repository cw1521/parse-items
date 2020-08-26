// MOST RECENT ITEM PARSER AS OF 8/21/2020


const fs = require("fs");
const parseString = require("xml2js").parseString;
const itemParser = require("./parseItems");

const itemsInputPath = "./input/unique_items.xml";
const itemsOutputPath = "./output/unique_items.json";

const xml = fs.readFileSync(itemsInputPath);

parseString(xml, (err, result) => {
    let items = [];
    let pages = itemParser.getPages(result);
    for (let page of pages) {
        let item = [];
        item = itemParser.parseItem(page);
        // console.dir(item)
    }
});