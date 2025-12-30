const crypto = require("crypto");

// ===  codes 表 ===
const N = 20;
const codes = {
  0: "W", 1: "l", 2: "k", 3: "B", 4: "Q",
  5: "g", 6: "f", 7: "i", 8: "i", 9: "r",
  10: "v", 11: "6", 12: "A", 13: "K", 14: "N",
  15: "k", 16: "4", 17: "L", 18: "1", 19: "8",
};

// === path -> key===
function pathKey(path = "/") {
  const e = String(path).toLowerCase();
  const t = e + e;
  let out = "";
  for (let i = 0; i < t.length; i++) {
    const idx = t.charCodeAt(i) % N;
    out += codes[idx];
  }
  return out;
}

// === a.default：HMAC-SHA512 输出 hex ===
function hmacSha512Hex(message, key) {
  return crypto.createHmac("sha512", key).update(message, "utf8").digest("hex");
}

// === o.default：生成 header 名 i ===
function headerName(path = "/", data = {}) {
  const t = String(path).toLowerCase();
  const body = JSON.stringify(data).toLowerCase();
  const key = pathKey(t);
  const digest = hmacSha512Hex(t + body, key);
  return digest.toLowerCase().substr(8, 20);
}

// === r.default：生成 header 值 u ===
function headerValue(path = "/", data = {}, tid = "") {
  const n = String(path).toLowerCase();
  const body = JSON.stringify(data).toLowerCase();
  const key = pathKey(n);
  return hmacSha512Hex(n + "pathString" + body + (tid ?? ""), key);
}

// === 一次性生成最终头 ===
function makeSignedHeader(path, data, tid) {
  const i = headerName(path, data);
  const u = headerValue(path, data, tid);
  return { [i]: u };
}

// ====== 示例 ======
const path = "/api/sns/getGlossaryInfo?ids=26%2C205%2C137%2C108%2C58%2C228%2C126%2C127";
const data = {};

const tid = "";

const signed = makeSignedHeader(path, data, tid);
console.log("路径密钥 =", pathKey(path));
console.log("签名头 =", signed);
