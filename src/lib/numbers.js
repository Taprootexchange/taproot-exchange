import { ethers } from "ethers";
import { ceil, floor, round } from "lodash";
window.ethers = ethers;

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const limitDecimalsWithNormal = (amount, maxDecimals) => {
  let temAmount = amount === 0 ? "0.000" : amount;
  let amountStr = temAmount.toString();
  if (maxDecimals === undefined) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    let decimals = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals)
      );
    } else {
      amountStr = amountStr + "0".repeat(maxDecimals - decimals);
    }
  }
  return amountStr;
};

export const limitDecimals = (amount, maxDecimals, computedType = "normal") => {
  if (computedType === "normal") {
    return limitDecimalsWithNormal(amount, maxDecimals);
  } else if (computedType === "round") {
    return round(amount, maxDecimals);
  } else if (computedType === "floor") {
    return floor(amount, maxDecimals);
  } else {
    return ceil(amount, maxDecimals);
  }
};

export function numberWithCommas(x) {
  if (!x && x != 0) {
    return "...";
  }

  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
