import EventEmitter from 'events';
import { isArray } from 'util';
import Item from 'antd/lib/list/Item';

export default class CountPower extends EventEmitter {
  priceConfig = [];

  sumCount = 0;

  constructor() {
    super();

    debugger;

    const myPriceConfig = [
      { min: '0', max: '100', price: '1' },
      { min: '100', max: '200', price: '2' },
      { min: '200', max: '-1', price: '3' },
    ];

    const myPriceConfig2 = [
      { min: '0', max: '30', price: '1' },
      { min: '30', max: '100', price: '2.5' },
      { min: '200', max: '-1', price: '3' },
    ];

    const myPriceConfig3 = [
      { min: '0', max: '30', price: '1' },
      { min: '30', max: '100', price: '0.5' },
      { min: '200', max: '-1', price: '5' },
    ];

    const dayCount = ['40', '50', '200', '220'];

    const dayCount2 = ['10', '10', '10', '10', '10', '10', '10'];
    const result = this.Calculate(dayCount, myPriceConfig);

    console.info('pay money:' + result);
  }

  sumValue = 0;

  Calculate(usage, price) {
    let cost = 0;
    let finalPriceValue = 0;
    let usageArray = [];
    let priceArray = [];
    let priceSum = 0;
    if (!Array.isArray(usage) || !Array.isArray(price)) {
      return cost;
    }

    let lastSum = 0;
    let lastPrice = 0;
    let lastCost = 0;
    usage.forEach((item, key) => {
      lastSum += parseFloat(item);
      lastPrice = this.getDayPriceFinal(lastSum, price);
      console.info('计算该次累计区间价格:' + lastPrice);
      console.info('计算累计下次累计天数:' + lastSum);
      let cost = item * lastPrice;
      console.info('key:' + key + ' 需要支付费用:' + cost);
      lastCost += cost;
      console.info('总计需要支付费用:' + lastCost);

      //let costItem = this.getDayPrice(item, price);
      //console.info('当天支付需支付费用:' + costItem);
      //cost += costItem;
    });

    return cost;
  }

  getDayPriceFinal(daySum, price) {
    let finalPriceValue = 0;
    price.forEach((item, key) => {
      let sumMin = parseFloat(item.min);
      let sumMax = parseFloat(item.max);
      if (daySum > sumMin) {
        // 保存最终价格
        finalPriceValue = parseFloat(item.price);
      }
    });

    return finalPriceValue;
  }

  getDayPrice(daySum, price) {
    let cost = 0;
    let sum = 0;
    let finalPriceValue = 0;
    let usageArray = [];
    let priceArray = [];
    let priceSum = 0;

    let leftCount = 0;
    let index = 0;
    price.forEach((item, key) => {
      let sumMin = parseFloat(item.min);
      let sumMax = parseFloat(item.max);
      if (daySum > sumMin) {
        // 保存最终价格
        finalPriceValue = parseFloat(item.price);
        priceArray.push(item.price);
        if (sumMin > sumMax && sumMax < 0) {
          usageArray.push(sumMin);
        } else {
          usageArray.push(sumMax - sumMin);
        }
        ++index;
      }
    });

    leftCount = 0;
    usageArray.forEach((item, key) => {
      if (key < index - 1) {
        cost += parseFloat(item) * priceArray[key];
        leftCount += parseFloat(item);
      }
    });

    console.info('计算出累之前累加费用:' + cost);
    daySum -= leftCount;

    console.info('finalPriceValue:' + finalPriceValue);

    cost += daySum * finalPriceValue;

    console.info('加上最后一档费用:' + cost);

    return cost;
  }
}
