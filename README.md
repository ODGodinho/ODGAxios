> ⚠️ **Archived Project**
>
> This repository has been **archived** and is no longer actively maintained.  
> The project has been migrated to a **monorepo**.
>
> 👉 **New repository:** https://github.com/ODGodinho/ODGMono
>
> Please update your references and use the monorepo for the latest code and updates.

<h1 align="center">
    <a href="https://github.com/ODGodinho">
        <img
            src="https://raw.githubusercontent.com/ODGodinho/Stanley-TheTemplate/main/public/images/Stanley.jpg"
            alt="Stanley Imagem" width="400"
        />
        <br /><br />
        <img
            src="https://camo.githubusercontent.com/272811d860f3fab0dd8ff0690e2ca36afbf0c96ad44100b8d42dfdce8511679b/68747470733a2f2f6178696f732d687474702e636f6d2f6173736574732f6c6f676f2e737667"
            alt="Stanley Imagem" width="260"
        />
    </a>
    <br />
    Axios (Inversion of control)
    <br />
</h1>

<h4 align="center">ODG Message for axios Inversion of control 📦!</h4>

<p align="center">

[![codecov](https://codecov.io/gh/ODGodinho/ODGAxios/branch/main/graph/badge.svg?token=JCLIEK2OFN)](https://codecov.io/gh/ODGodinho/ODGAxios)
[![Stargazers](https://img.shields.io/github/stars/ODGodinho/ODGAxios?color=F430A4)](https://github.com/ODGodinho/ODGAxios/stargazers)
[![Made by ODGodinho](https://img.shields.io/badge/made%20by-ODGodinho-%2304A361)](https://www.linkedin.com/in/victor-alves-odgodinho/)
[![Forks](https://img.shields.io/github/forks/ODGodinho/ODGAxios?color=CD4D34)](https://github.com/ODGodinho/ODGAxios/network/members)
![Repository size](https://img.shields.io/github/repo-size/ODGodinho/ODGAxios)
[![GitHub last commit](https://img.shields.io/github/last-commit/ODGodinho/ODGAxios)](https://github.com/ODGodinho/ODGAxios/commits/master)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](https://opensource.org/licenses/MIT)
[![StyleCI](https://github.styleci.io/repos/577502561/shield?branch=main)](https://github.styleci.io/repos/577502561?branch=main)

</p>

# Table of Contents

- [🎇 Benefits](#-benefits)
- [📗 Libraries](#-libraries)
- [📁 Dependencies](#-dependencies)
- [⏩ Get Started](#-get-started)
  - [🔘 Use Template](#-installation)
  - [💻 Usage](#-usage)
  - [📍 Start Project](#-start-project)
  - [📨 Build and Run](#-build-and-run)
  - [🧪 Teste Code](#-teste-code)

---

## 🎇 Benefits

- 🚀 Speed performance Inversion of control
- 🚨 Code Quality
- 🎇 Use Interface
- 🧪 Teste with 100% coverage

## 📗 Libraries

- [Node.js 16](https://nodejs.org/?n=dragonsgamers)
- [Typescript](https://www.typescriptlang.org/?n=dragonsgamers)
- [Eslint](https://eslint.org/?n=dragonsgamers)
- [ODG-Linter-JS](https://github.com/ODGodinho/ODG-Linter-Js?n=dragonsgamers)
- [EditorConfig](https://editorconfig.org/?n=dragonsgamers)
- [ReviewDog](https://github.com/reviewdog/action-eslint)

## 📁 Dependencies

- [Node.js](https://nodejs.org) 16 or later
- [Yarn](https://yarnpkg.com/) Optional/Recommended
- [ODG Message](https://github.com/ODGodinho/ODGMessage?n=dragonsgamers)
- [ODG TsConfig](https://github.com/ODGodinho/tsconfig?n=dragonsgamers) Last Version
- [ODG Exception](https://github.com/ODGodinho/ODGException?n=dragonsgamers) Last Version

## ⏩ Get Started

---

### 🔘 Installation

```powershell
yarn add @odg/message @odg/axios axios
```

### 💻 Usage

For simple example usage, you can use [Inversify](https://www.npmjs.com/package/inversify) for Dependency Injection

```typescript
import { type MessageInterface, type MessageResponse } from "@odg/message";

class Test {

    public constructor(
        private readonly requester: MessageInterface
    ) {
    }

    public async example(): Promise<MessageResponse<
      unknown, // Reques Body
      Record<string, unknown>, // Response Body
    >> {
        return this.requester.request({
            url: "https://api.github.com/users/ODGodinho",
        });
    }

}
```

```typescript
const test = new Test(new AxiosMessage({
  // default options axios
}));

console.log(await test.example());
```

### 📍 Start Project

First install dependencies with the following command

```bash
yarn install
# or
npm install
```

## 📨 Build and Run

To build the project, you can use the following command

> if you change files, you need to run `yarn build` and `yarn start` again

```bash
yarn build && yarn start
# or
yarn dev
```

## 🧪 Teste Code

To Test execute this command

```bash
yarn test
# or
yarn test:watch
```
