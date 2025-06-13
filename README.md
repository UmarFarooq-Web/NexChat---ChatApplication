# 🚀 NexChat - Real-Time MERN Chat App

NexChat is a modern real-time chat application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **Socket.IO** integration for seamless live communication. Designed with a clean UI and optimized performance, NexChat allows users to chat in real-time, view who’s online, and enjoy a responsive, dynamic experience.

> ⚡ Built with scalability and performance in mind, perfect for private teams, study groups, or casual chatting.

---

## 🖼️ Project Preview

![image](https://github.com/user-attachments/assets/4aa2d27c-0378-4c6f-8dc6-f9011befe447)

---

## ✨ Features

- ✅ **Real-Time Messaging** with Socket.IO
- ✅ **Live User Presence** – See who's online
- ✅ **Auto Scroll to Latest Message**
- ✅ **Responsive UI** for desktop and mobile
- ✅ **Clean and Modern Design**
- ✅ **Scalable Architecture**
- ✅ **Separate Socket Event Handlers**
- ✅ **Local Environment Setup with `.env` support**

---

## 🧱 Tech Stack

| Technology | Role |
|------------|------|
| MongoDB    | Database |
| Express.js | Backend Framework |
| React.js   | Frontend Library |
| Node.js    | Backend Runtime |
| Socket.IO  | Real-time WebSockets |
| Tailwind CSS | Styling |
| dotenv     | Environment Config |
| NeDB       | Lightweight local storage (optional support) |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexchat.git
cd nexchat


## 🛠️ Setup Instructions

### 2. Environment Variables

Create a `.env` file in both the **backend** and **frontend** (if needed) folders to securely manage environment-specific variables.

#### Example `.env` for Backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000


### 3. 📦 Install Dependencies

To get NexChat up and running, you'll need to install the required dependencies for both the backend and frontend.

---

#### 🛠️ Backend Setup

Navigate to the `backend` folder and install the required packages:

```bash
cd backend
npm install


### 4. 🚀 Start the Development Servers

With all dependencies installed and your `.env` file configured, you're ready to launch the NexChat app locally.

---

#### 🔌 Start the Backend Server

In the `backend` folder, run the following command:

```bash
cd backend
npm run dev

### 5. ✅ Test the App

Once both servers are running:

- Open your browser and go to:

```text
http://localhost:3000

