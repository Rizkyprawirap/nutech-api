# Nutech API
---
## ⚙️ How to Run the Project
### **1. Start PostgreSQL (Docker Compose)**
```bash
docker compose up -d
```
---

### **2. Apply Database Schema**

Run:

```bash
psql -h localhost -U nutech -d nutech -f ddl/schema.sql
```

(Or import the `.sql` file using any DB client)

---

### **3. Install Dependencies**

```bash
npm install
```

---

### **4. Start the Server**

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

The API runs at:

```
http://localhost:7777
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=7777

DB_HOST=localhost
DB_PORT=5432
DB_USER=nutech
DB_PASS=nutech123
DB_NAME=nutech

JWT_SECRET=secret
```

---

## 📚 API Endpoints

### **Membership**
```
POST /api/membership/v1/registration
POST /api/membership/v1/login
GET  /api/membership/v1/profile
PUT  /api/membership/v1/profile/update
PUT  /api/membership/v1/profile/update/image
```

### **Information**
```
GET  /api/information/v1/banner
GET /api/information/v1/services
```

### **Services**
```
GET  /api/transaction/v1/balance
POST /api/transaction/v1/topup
POST /api/transaction/v1/transaction
GET  /api/transaction/v1/history
```


