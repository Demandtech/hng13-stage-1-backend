# String Analyzer API

A Node.js + Express REST API for storing and analyzing strings with metadata and natural language filters

## Features

Store and retrieve analyzed strings

- Fetch strings by their exact value or through natural language filters (e.g., “strings containing the letter z”, “strings with vowels only”)

- SQLite database with auto-creation

- Custom error handling (ResponseStatusException)

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite (via `better-sqlite3`)
- **Environment:** dotenv


---

## ⚙️ Installation & Setup

```bash

git clone https://github.com/Demandtech/hng13-stage-1-backend

cd hng13-stage-1-backend

npm install

npm run dev
```
