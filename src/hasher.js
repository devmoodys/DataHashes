import packageCrypto from "crypto";

export default function hashData(data) {
  const shaData = dataParse(data);
  return { hash: shaData };
}

function dataParse(data) {
  const sorted = sortKeys(data); // Sort the Data by Keys and the Values
  const stringified = JSON.stringify(sorted); // Stringify sorted key value pairs

  const hash = packageCrypto.createHash("sha256");
  hash.update(stringified); // Create hash
  const hexValue = hash.digest("hex");

  return hexValue;
}

function sortKeys(data) {
  let sorted = [];

  // eslint-disable-next-line
  for (var obj in data) {
    let tmp = [];
    // eslint-disable-next-line
    for (var key in data[obj]) {
      tmp.push([key, data[obj][key]]); // Convert objects into an array of subarrays, containing key/value pairs
    }
    tmp.sort((a, b) => (a[0] < b[0] ? -1 : 1)); // Sort key value pairs within sub-array
    sorted.push(tmp);
  }

  sorted.sort((a, b) => (a[0][1] < b[0][1] ? -1 : 1)); // sort objects (which are now sub-arrays)
  return sorted;
}
