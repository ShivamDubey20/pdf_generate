# Quiz and Question Generation Platform

Welcome to the **Quiz and Question Generation Platform**! This project leverages Next.js 14 to generate quizzes and similar questions from PDF documents, integrating LangChain models for AI-powered content generation, and Supabase with Drizzle ORM for efficient database management.

The platform is designed to simplify quiz creation and question generation for educational and assessment purposes.

---

## 🌟 Features

### 1. **Quiz and Question Generation**
   - Extract content from PDF files and generate structured quizzes and questions using AI-powered models.
   - **Tailored Outputs** with LangChain models to ensure high-quality quiz and question generation.

### 2. **Database Management**
   - Managed with Supabase and Drizzle ORM.
   - **Two Databases**:
     - One for storing quiz questions.
     - Another for storing generated questions.

### 3. **Modern Frontend**
   - Built using **Next.js 14** with a clean, responsive UI powered by **Tailwind CSS**.

### 4. **PDF Parsing**
   - Efficiently parse and process PDFs using the **pdf-parse** library for content extraction.

---

## 🛠 Tech Stack

### Frontend:
- **Next.js 14**: Framework for server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Backend:
- **LangChain**: AI framework for processing and generating quiz and question content.
- **Supabase**: Managed PostgreSQL database for storing quiz data.
- **Drizzle ORM**: Type-safe, modern ORM for interacting with PostgreSQL.

### Additional Libraries:
- **pdf-parse**: Extracting text content from PDF documents.
- **Framer Motion**: For animations and transitions.
- **Radix UI**: Accessible and customizable React components.

---

🚀 Getting Started
### Prerequisites**
- **Node.js (v16 or higher)**
- **PostgreSQL**
- **Supabase account (for database management)**

---

🧩 How it Works
- **Upload PDF: Users upload PDF documents containing educational content or assessments.**
- **AI Processing: LangChain models process the PDF content, extracting key information.**
- **Question Generation: The AI generates structured questions and quizzes.**
- **Database Storage: The questions are stored in a PostgreSQL database using Supabase and Drizzle ORM.**

---

### 🎨 UI/UX Design
The platform's user interface is designed using Tailwind CSS, providing a modern and responsive layout. We utilize Framer Motion for smooth animations and transitions, and Radix UI for accessible and customizable React components.