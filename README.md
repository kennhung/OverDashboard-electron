[![CircleCI](https://circleci.com/gh/Team6083/OverDashboard-electron.svg?style=shield)](https://circleci.com/gh/Team6083/OverDashboard-electron) [![dependencies Status](https://david-dm.org/Team6083/OverDashboard-electron/status.svg)](https://david-dm.org/Team6083/OverDashboard-electron) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/c5273be664f84783a5b9df733b6a38ed)](https://www.codacy.com/app/kennhung/OverDashboard-electron?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Team6083/OverDashboard-electron&amp;utm_campaign=Badge_Grade)
# OverDashboard-electron
Team 6083's FRC robot dashboard.
## Overview
這個dashboard使用 `electron` 為基底 介面以靜態HTML+javascript更新資料

用 `wpilib-nt-client`接收Networktable的資料 透過ipc傳送給javascript接收

## Installation and use
**透過安裝檔:**
1. 下載 [最新版釋出](https://github.com/Team6083/OverDashboard-electron/releases) 
1. 執行 `OverDashboard_Setup.exe` 安裝

**透過原始碼:**

需要 [nodejs](https://nodejs.org/) 與 [npm](https://www.npmjs.com/)

1. 完成安裝上述需求
1. 使用 `git clone https://github.com/Team6083/OverDashboard-electron.git` 下載GitHub專案
1. 進入專案資料夾 `cd OverDashboard-electron`
1. 使用 `npm install` 下載其他編譯需求軟體
1. `npm start` 啟動dashboard
