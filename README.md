# ⚙️ LoanLink Server | Backend API Engine

This is the backend server for **LoanLink**, a microloan management platform. It handles the REST API, MongoDB database integration, JWT authentication, and administrative logic to ensure a secure and scalable financial system.



## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **Security** | JSON Web Tokens (JWT), CORS, Dotenv |
| **Deployment** | Vercel |

## 🚀 Key Functionalities

-   **JWT Authentication:** Secure API routes by verifying user tokens before processing requests.
-   **Loan Management:** Complete CRUD operations for adding, updating, and deleting loan schemes.
-   **Application Processing:** Logic for handling user applications and managing status transitions (Pending ➔ Approved/Rejected).
-   **Admin Middleware:** Custom middleware to verify administrative privileges for sensitive operations.
-   **Data Validation:** Sanitizes and validates incoming request bodies to maintain database integrity.

## 📡 API Endpoints (Quick Reference)

### 🔓 Public Routes
-   `GET /loans` - Fetch all available loan schemes.
-   `GET /loan/:id` - Fetch details of a specific loan.
-   `GET /blogs` - Get financial insight articles.

### 🔐 Protected Routes (User)
-   `POST /jwt` - Generate a token upon login.
-   `POST /loansApplication` - Submit a new loan request.
-   `GET /myLoans/:email` - Fetch applications specific to a user.

### 🛡 Admin Routes
-   `GET /allApplications` - View every application in the system.
-   `PATCH /application/status/:id` - Update application status.
-   `POST /addLoan` - Create a new loan category.



## 📦 Local Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/sumon10c/loanlink-server.git](https://github.com/sumon10c/loanlink-server.git)
    ```

2.  **Install NPM Packages:**
    ```bash
    cd loanlink-server
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the following:
    ```env
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    ACCESS_TOKEN_SECRET=your_random_jwt_secret
    PORT=5000
    ```

4.  **Start the Server:**
    ```bash
    npm start
    # or for development
    npm run dev
    ```

## 🗄 Database Structure (MongoDB)
The server interacts with three primary collections:
1.  **Users:** Stores user profiles and roles.
2.  **Loans:** Contains loan metadata (Interest rate, Max amount, etc.).
3.  **Applications:** Links users to their requested loans with status timestamps.

## 🤝 Contributing
1. Fork the Project.
2. Create your Feature Branch.
3. Commit your Changes.
4. Push to the Branch.
5. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
**Maintained by [Sumon Chakraborty](https://github.com/sumon10c)**
