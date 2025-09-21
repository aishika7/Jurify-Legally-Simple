# Jurify – Legally Simple ⚖️

Jurify is an **AI-powered legal assistant** that simplifies document analysis, clause extraction, and legal query resolution.
It leverages **LLMs, Pinecone, and modern web technologies** to make legal information accessible, fast, and reliable.

---

## 📌 Problem Statement

Legal documents are often **complex, lengthy, and filled with jargon**, making them inaccessible for non-lawyers.
Current solutions are either **too generic** (chatbots without context) or **too expensive** for wider adoption.

---

## 💡 Our Solution

Jurify bridges this gap by providing:

* **Automated clause detection** from contracts.
* **Semantic search** across uploaded documents.
* **AI-driven answers** to legal questions.
* **Secure, cloud-native backend** with scalable vector search.

---

## 🚀 Architecture

```
Frontend (React + Vite) --> Backend (Node.js + Express on Cloud Run)
     |                                   |
     |                                   |
     v                                   v
   Users                        AI Layer (LLM + Embeddings)
                                    |         \
                                    |          --> Pinecone (Vector DB)
                                    v
                             MongoDB (Users, Metadata)
                                    |
                           Google Cloud Services (Secrets, Storage)
```

---

## ✨ Features

* 📝 Upload & parse **PDF legal documents**.
* 🔎 **Semantic search** powered by Pinecone.
* 🤖 **AI query answering** using OpenAI embeddings + LLMs.
* 📊 Role-based dashboard (Admin, Lawyer, Client).
* 🔐 Secure deployment on **Google Cloud Run**.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, TailwindCSS, Shadcn/UI
**Backend:** Node.js, Express, TypeScript
**AI & Search:** OpenAI API, Pinecone Vector DB
**Database:** MongoDB (Prisma ORM)
**Cloud:** Google Cloud Run, Secret Manager, Cloud Storage
**Deployment:** Vercel / Netlify (Frontend), Cloud Run (Backend)

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Jurify-Legally-Simple.git
cd Jurify-Legally-Simple
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Set environment variables in `.env`:

```
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
PINECONE_API_KEY=xxxx
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX=jurify-index
MONGODB_URI=your_mongo_uri
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set environment variables in `.env`:

```
VITE_API_URL=https://your-backend-url.a.run.app
```

---

## 🌍 Deployment

### Backend – Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/jurify-backend
gcloud run deploy jurify-backend --image gcr.io/PROJECT_ID/jurify-backend --platform managed
```

### Frontend – Vercel/Netlify

* Set **root directory** = `frontend`
* Add environment variable `VITE_API_URL` = Cloud Run backend URL

---

## 🔑 USP (Why Jurify?)

* **Focused on Legal domain** → Unlike generic AI chatbots.
* **Affordable & Scalable** → Deployable on cloud infra at low cost.
* **Transparency** → Shows clause-level matches + AI explanation.
* **Accessibility** → Easy-to-use interface for both lawyers & clients.

---

## 👩‍💻 Team

* Aishika Majumdar, Ishita Chowdhury, Soumavo Acharjee 

---

## 📜 License

MIT License © 2025 Jurify Team
