# 🎓 Student Management System

A modern Student Management System built using **Flask**, **SQLite**, **HTML**, **CSS**, and **JavaScript**. This application allows administrators to manage student records efficiently through a simple and responsive web interface.

---

## 📌 Features

### 🔐 Authentication
- Admin Login
- Session Management
- Secure Logout

### 👨‍🎓 Student Management
- Add Student
- View Student Details
- Update Student Information
- Partial Update (PATCH)
- Delete Student
- Upload Student Photo

### 📊 Dashboard
- Total Students
- Total Universities
- Total Departments
- Total Photos

### 🔍 Search
- Search students by name
- Instant filtering

### 🎨 User Interface
- Responsive Design
- Toast Notifications
- Loading Animation
- Modal Popups
- Dashboard Cards
- Student Table

---

## 🛠️ Technologies Used

### Backend
- Python
- Flask
- SQLite3

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Database
- SQLite

---

## 📁 Project Structure

```text
Student_Management_System/
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   └── login.css
│   │
│   ├── images/
│   │   └── default-avatar.png
│   │
│   ├── js/
│   │   ├── script.js
│   │   └── login.js
│   │
│   └── uploads/
│
├── templates/
│   ├── index.html
│   └── login.html
│
├── app.py
├── database.py
├── requirements.txt
└── students.db
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/bandarusahasra96-taju/Student_Management_System.git
```

### Move into Project Folder

```bash
cd Student_Management_System
```

### Create Virtual Environment

Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open your browser:

```
http://127.0.0.1:5000
```

---

## 📋 Functionalities

- Login Authentication
- Dashboard Overview
- Student Registration
- Student Listing
- View Student Details
- Edit Student Information
- Partial Update
- Delete Student
- Upload Student Photos
- Search Students
- Responsive User Interface

---

## 🗄️ Database

Database Used:

```
SQLite
```

Main Table:

```
students
```

Fields

| Field | Type |
|--------|------|
| id | INTEGER |
| photo | TEXT |
| name | TEXT |
| email | TEXT |
| phone | TEXT |
| university | TEXT |
| department | TEXT |
| created_at | TIMESTAMP |

---

## 📸 Screenshots

You can add screenshots here.

Example:

```
screenshots/
    login.png
    dashboard.png
    add_student.png
    student_table.png
```

---

## 📌 Future Enhancements

- Export Student Data to Excel
- Export PDF Reports
- Student Attendance
- Role Based Login
- Email Notifications
- Advanced Filters
- Pagination
- Dark Mode

---

## 👨‍💻 Author

**Sahasra Bandaru**

GitHub:
https://github.com/bandarusahasra96-taju

---

## 📄 License

This project is created for educational purposes.