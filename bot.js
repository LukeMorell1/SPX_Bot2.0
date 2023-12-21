import * as cheerio from "cheerio";

async function getPrice() {
  try {
    const response = await fetch(
      "https://www.marketwatch.com/investing/index/spx"
    );
    if(!response.ok) {
      throw new Error("HTTP Error! Status: ${response.status}");
    }

    const html = await response.text();
    const $ = cheerio.load(html, null, false);

    const currPrice = $("meta[name='price']").attr("content");
    const lastClose = $("div.intraday__close td.table__cell.u-semi").text();
    const status = $(".intraday__status .status").text();
    if(!currPrice || !lastClose || !status) {
      throw new Error("Failed to extract all neccessary html elements");
    }

    const currPriceNum = currPrice.replaceAll(",", "");
    const lastCloseNum = lastClose.replaceAll(",", "");
    const change = currPriceNum / lastCloseNum;
    const percentChange = (change - 1) * 100;
    const perChange = percentChange.toFixed(2);

    const marketData = {
      perChange,
      status,
    };
    return marketData;
  } catch (err) {
    console.log(err);
  }
}

export default getPrice;