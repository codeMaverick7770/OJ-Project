# KickDSA — AI-Assisted DSA Platform for Beginners and Intermediates

Welcome to **kickDSA** — an **AI-powered Online Judge** built for beginners struggling with Data Structures and Algorithms (DSA).

We believe that mastering DSA shouldn't be about solving 1000+ random problems. It should be about **patterns, clarity, and guided learning.** KickDSA exists to help you do just that.

---

## 🚀 Live Site

👉 [https://www.kickdsa.online](https://www.kickdsa.online)

## 🌟 Key Features

### 👨‍🏫 AI-Powered DSA Assistance

* **Problem Simplifier**: Explains complex problems in simple language (powered by DeepSeek / OpenRouter).
* **AI Code Review**: Choose from 4 levels of AI guidance to debug your code, from hints to full solutions.
* **Visual Explainers** *(coming soon)*: Get flowcharts and step-wise visual aids.

### 🧠 Beginner-Centric Problem Solving

* **Example Test Cases** toggle for clarity.
* **Built-in Compiler**: Supports C++, Python, Java.
* **Custom Input vs Example Mode**.
* **Boilerplate Code** per language.

### ✍️ Admin Tools

* Create/edit/delete problems.
* JSON-based **bulk problem creation**.

### 🏆 Leaderboard & Submissions

* Track scores.
* View global rankings.
* Store submission history.

---

## ⚙️ Tech Stack

### 🧩 Frontend

* React + Vite
* TailwindCSS + ShadCN UI
* Framer Motion animations
* Hosted on **Vercel**

### 🔧 Backend

* Node.js + Express
* MongoDB Atlas (Mongoose)
* JWT Authentication + Role-based Access
* Hosted on **AWS EC2** with **PM2** + **NGINX** + **SSL (Certbot)**

### 🧪 Compiler Microservice

* Dockerized custom compiler
* Hosted on separate EC2 instance
* Runs user code securely & returns output

### 🤖 AI Integrations

* Google Gemini API
* DeepSeek via OpenRouter.ai

### 🔄 CI/CD & Infra

* GitHub Actions for EC2 deployment
* Environment-based `.env.production`
* Docker + Amazon ECR for compiler
* NGINX reverse proxy for multiple services

---

## 🛠 How to Run Locally

### 1. Clone the Repo

```bash
git clone https://github.com/yourname/OJ-Project.git
cd OJ-Project
```

### 2. Install Dependencies

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Setup `.env` File

Create `.env` in `/server` directory with:

```env
PORT=8000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=your-secret
GEMINI_API_KEY=your-key
VISUAL_AI_KEY=your-key
ORIGIN=http://localhost:5173
```

### 4. Run Servers

```bash
cd client
npm run dev
# In another terminal:
cd server
npm run dev
```

---

## 📂 Project Structure

```
OJ-Project
├── client                # React frontend
├── server                # Express backend
│   ├── controller
│   ├── routes
│   ├── models
│   ├── utils
│   └── index.js
├── compiler              # Dockerized code execution
├── .github/workflows     # GitHub Actions CI/CD
├── ecosystem.config.js   # PM2 deployment config
└── README.md
```

---

## 🧠 AI Features in Detail

| Feature            | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| Problem Simplifier | Converts tough problems into easy explanations without giving away answers |
| AI Review Tool     | Four levels: Hint → Logic → Snippet → Full Solution                        |
| Visual Flowchart   | (Upcoming) Convert solution flow to diagram                                |

---

## 🏁 Upcoming Roadmap

* [ ] Flowchart generation with Stable Diffusion
* [ ] Personalized learning journey per user
* [ ] Contest hosting system
* [ ] Problem tagging and pattern insights

---

## 🙌 Inspiration

This project was built to help learners overcome the "tutorial hell" and break free from unstructured LeetCode grinding. Inspired by conversations with real students who felt lost despite hard work.

> "Let’s make DSA feel less like a wall, and more like a ladder."

---

## 🧑‍💻 Developer

**Tauqeer Ahmad**
📧 [LinkedIn](https://linkedin.com/in/mtauqeer7770)
🌐 [kickdsa.online](https://kickdsa.online)

If you liked this project or have feedback, feel free to connect or open a pull request!

---

## 🛡 License

This project is open source and licensed under the MIT License.

---

## ⭐ Show Your Support

If you find this helpful, give it a ⭐ on GitHub, share it with friends, or contribute to the codebase. Your support helps us grow!

---

