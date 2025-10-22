# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties. Built with **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Features

For each analyzed string, the service computes and stores:

- **`length`** — Total number of characters
- **`is_palindrome`** — Boolean indicating if the string reads the same forwards and backwards (case-insensitive)
- **`unique_characters`** — Count of distinct characters
- **`word_count`** — Number of words in the string
- **`sha256_hash`** — SHA-256 hash for unique identification
- **`character_frequency_map`** — Object mapping each character to its occurrence count

---

## 🚀 Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling
- **Crypto** — Built-in module for SHA-256 hashing
- **dotenv** — Environment variable management

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/string-analyzer-service.git
cd string-analyzer-service
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/string_analyzer
PORT=5000
```

- **`MONGO_URI`** — Your MongoDB connection string
- **`PORT`** — Server port (default: 5000)

**4. Start the development server**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

---

## 📡 API Endpoints

### 1. **Analyze and Create String**

**`POST /strings`**

Analyzes a string and stores its computed properties.

**Request Body:**
```json
{
  "value": "racecar"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `201 Created` | String analyzed and stored successfully |
| `400 Bad Request` | Missing `value` field |
| `422 Unprocessable Entity` | `value` must be a string |
| `409 Conflict` | String already exists |

**Example:**
```bash
curl -X POST http://localhost:5000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

---

### 2. **Get Specific String**

**`GET /strings/:value`**

Retrieves a specific string and its computed properties.

**Responses:**

| Status | Description |
|--------|-------------|
| `200 OK` | String found and returned |
| `404 Not Found` | String does not exist |

**Example:**
```bash
curl http://localhost:5000/strings/racecar
```

---

### 3. **Get All Strings with Filters**

**`GET /strings`**

Retrieves all strings with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `is_palindrome` | `boolean` | Filter by palindrome status |
| `min_length` | `number` | Minimum string length |
| `max_length` | `number` | Maximum string length |
| `word_count` | `number` | Exact word count |
| `contains_character` | `string` | Filter strings containing a specific character |

**Response:**
```json
{
  "data": [...],
  "count": 10,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200 OK` | Strings retrieved successfully |
| `400 Bad Request` | Invalid query parameter values |

**Example:**
```bash
curl "http://localhost:5000/strings?is_palindrome=true&min_length=5"
```

---

### 4. **Delete String**

**`DELETE /strings/:value`**

Deletes a specific string from the database.

**Responses:**

| Status | Description |
|--------|-------------|
| `204 No Content` | String deleted successfully |
| `404 Not Found` | String does not exist |

**Example:**
```bash
curl -X DELETE http://localhost:5000/strings/racecar
```

---

### 5. **Natural Language Filtering**

**`GET /strings/filter-by-natural-language`**

Filters strings using natural language queries.

**Query Parameter:**
- `query` — Natural language filter expression

**Supported Query Examples:**

| Query | Filters Applied |
|-------|----------------|
| `"all single word palindromic strings"` | `word_count=1`, `is_palindrome=true` |
| `"strings longer than 10 characters"` | `min_length=11` |
| `"palindromic strings that contain the first vowel"` | `is_palindrome=true`, `contains_character=a` |
| `"strings containing the letter z"` | `contains_character=z` |

**Response:**
```json
{
  "data": [...],
  "count": 5,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| `200 OK` | Query interpreted and results returned |
| `400 Bad Request` | Missing or unparseable query |
| `422 Unprocessable Entity` | Conflicting filters detected |

**Example:**
```bash
curl "http://localhost:5000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

---

## 📁 Project Structure
```
string-analyzer-service/
├── controllers/
│   └── stringController.js    # Business logic for string operations
├── models/
│   └── stringModel.js          # Mongoose schema definition
├── routes/
│   └── stringRoutes.js         # Express route definitions
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
├── server.js                   # Express server entry point
└── README.md                   # Project documentation
```

---

## 📦 Dependencies
```json
{
  "express": "^5.x.x",
  "mongoose": "^8.x.x",
  "dotenv": "^17.x.x"
}
```

Install all dependencies:
```bash
npm install express mongoose dotenv
```

**Note:** The `crypto` module is built into Node.js and doesn't require installation.

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:
```env
# MongoDB Connection
MONGO_URI=mongodb://127.0.0.1:27017/string_analyzer

# Server Configuration
PORT=5000
```

**Production Example (MongoDB Atlas):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/string_analyzer
PORT=5000
```

---

## 🧪 Testing

### Using cURL

**Create a string:**
```bash
curl -X POST http://localhost:5000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

**Get all palindromes:**
```bash
curl "http://localhost:5000/strings?is_palindrome=true"
```

**Natural language query:**
```bash
curl "http://localhost:5000/strings/filter-by-natural-language?query=palindromic%20strings"
```

### Using Postman/Thunder Client

1. Import the collection or manually create requests
2. Set base URL to `http://localhost:5000`
3. Test each endpoint with various parameters

---

## 📝 Implementation Notes

- **SHA-256 Hashing:** Used to ensure string uniqueness in the database
- **Case-Insensitive Palindrome Check:** Ignores case when checking palindromes
- **Natural Language Parsing:** Limited to predefined query patterns as specified in requirements
- **Character Frequency:** Includes spaces and special characters in the frequency map

---

## 🚨 Important Considerations

- Ensure MongoDB is running before starting the server
- For production, use environment-specific configuration
- The natural language filtering supports only the examples provided in the task specification
- SHA-256 hashes are case-sensitive and reflect the original string casing

---

## 🐛 Common Issues

**MongoDB Connection Error:**
```bash
# Ensure MongoDB is running
mongod --dbpath /path/to/data/directory
```

**Port Already in Use:**
```bash
# Change PORT in .env or kill the process using the port
lsof -ti:5000 | xargs kill -9
```

---
