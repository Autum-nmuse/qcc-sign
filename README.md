# 企查查 API 请求签名生成器

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

企查查网站 API 请求头签名算法的 JavaScript 实现。用于生成请求时所需的动态签名头。

## 📋 功能特性

- 🔐 基于 HMAC-SHA512 的签名算法
- 🔑 动态生成请求签名头名称和值
- 📦 纯 Node.js 实现，仅依赖内置 `crypto` 模块
- ⚡ 轻量级，无第三方依赖

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0

### 安装

```bash
git clone https://github.com/Autum-nmuse/qcc-sign.git
cd qcc-sign
```

### 基本使用

```javascript
const { makeSignedHeader, pathKey } = require('./headers.js');

// API 路径
const path = "/api/sns/getGlossaryInfo?ids=26%2C205%2C137%2C108%2C58%2C228%2C126%2C127";

// 请求体数据（如果是 GET 请求，传空对象）
const data = {};

// 设备/会话标识 浏览器的tid，可通过window.tid获取
const tid = "";

// 生成签名头
const signedHeader = makeSignedHeader(path, data, tid);
console.log(signedHeader);
// 输出: { '签名头名称': '签名头值' }
```

## 📖 API 文档

### `makeSignedHeader(path, data, tid)`

一次性生成完整的签名请求头。

| 参数 | 类型 | 描述 |
|------|------|------|
| `path` | `string` | API 请求路径（含查询参数） |
| `data` | `object` | 请求体数据 |
| `tid` | `string` | 设备/会话标识符 |

**返回值**: `object` - 包含签名头键值对的对象

---

### `pathKey(path)`

根据请求路径生成 HMAC 密钥。

| 参数 | 类型 | 描述 |
|------|------|------|
| `path` | `string` | API 请求路径 |

**返回值**: `string` - 生成的密钥字符串

---

### `headerName(path, data)`

生成签名头的名称。

| 参数 | 类型 | 描述 |
|------|------|------|
| `path` | `string` | API 请求路径 |
| `data` | `object` | 请求体数据 |

**返回值**: `string` - 20 字符的签名头名称

---

### `headerValue(path, data, tid)`

生成签名头的值。

| 参数 | 类型 | 描述 |
|------|------|------|
| `path` | `string` | API 请求路径 |
| `data` | `object` | 请求体数据 |
| `tid` | `string` | 设备/会话标识符 |

**返回值**: `string` - HMAC-SHA512 十六进制签名值

## 🔧 算法说明

### 签名流程

```
1. 路径转小写处理
2. 使用 codes 映射表根据路径生成密钥
3. 使用 HMAC-SHA512 算法生成签名
4. 截取/处理得到最终签名头
```

### codes 映射表

算法内部使用一个 20 字符的映射表，通过路径字符的 ASCII 码对 20 取模来获取对应字符：

```javascript
const codes = {
  0: "W", 1: "l", 2: "k", 3: "B", 4: "Q",
  5: "g", 6: "f", 7: "i", 8: "i", 9: "r",
  10: "v", 11: "6", 12: "A", 13: "K", 14: "N",
  15: "k", 16: "4", 17: "L", 18: "1", 19: "8",
};
```

## 📝 使用示例

### 示例 1：GET 请求签名

```javascript
const path = "/api/company/getInfo?id=12345";
const signed = makeSignedHeader(path, {}, "your-tid-here");

// 在 axios 或 fetch 中使用
const response = await fetch(`https://www.qcc.com${path}`, {
  headers: {
    ...signed,
    'Content-Type': 'application/json',
  }
});
```

### 示例 2：POST 请求签名

```javascript
const path = "/api/search/company";
const data = { keyword: "腾讯", pageIndex: 1 };
const signed = makeSignedHeader(path, data, "your-tid-here");

const response = await fetch(`https://www.qcc.com${path}`, {
  method: 'POST',
  headers: {
    ...signed,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});
```

## ⚠️ 免责声明

本项目仅供学习和研究使用。请遵守相关法律法规，尊重网站的服务条款。使用本代码所产生的任何后果由使用者自行承担。

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

**注意**：本项目仅用于技术学习目的，请勿用于任何商业或非法用途。
