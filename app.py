from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from database import create_table, get_connection
import os
import uuid
import requests

app = Flask(__name__)
app.secret_key = "student_management_secret_key"

# Folder for uploaded student photos
UPLOAD_FOLDER = os.path.join("static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =========================
# IMPORT DUMMYJSON STUDENTS
# =========================

def import_dummy_students():

    conn = get_connection()

    # Check whether DummyJSON data already exists
    dummy_check = conn.execute(
        "SELECT * FROM students WHERE email='emilysmith@dummyjson.com'"
    ).fetchone()

    if dummy_check:
        conn.close()
        return


    response = requests.get(
        "https://dummyjson.com/users?limit=100"
    )

    users = response.json()["users"]


    for user in users:

        # Avoid duplicate emails
        exists = conn.execute(
            "SELECT * FROM students WHERE email=?",
            (user["email"],)
        ).fetchone()


        if exists:
            continue


        conn.execute("""
        INSERT INTO students
        (photo,name,email,phone,university,department)
        VALUES (?,?,?,?,?,?)
        """,(
            "",
            user["firstName"] + " " + user["lastName"],
            user["email"],
            user["phone"],
            user.get("university","Unknown"),
            "Computer Science"
        ))


    conn.commit()
    conn.close()

# Create database table when app starts
create_table()

import_dummy_students()

# =========================
# HOME PAGE
# =========================
@app.route("/")
def home():
    if "admin" not in session:
        return redirect(url_for("login"))

    return render_template("index.html")

# =========================
# LOGIN
# =========================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "GET":
        return render_template("login.html")

    print("LOGIN DATA:", request.form)

    username = request.form.get("username")
    password = request.form.get("password")

    print("USERNAME:", username)
    print("PASSWORD:", password)


    if username == "admin" and password == "admin123":

        session["admin"] = username

        return jsonify({
            "success": True
        })


    return jsonify({
        "success": False,
        "message": "Invalid Username or Password"
    })

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response
# =========================
# GET ALL STUDENTS
# =========================
@app.route("/students", methods=["GET"])
def get_students():
    conn = get_connection()
    students = conn.execute(
        "SELECT * FROM students ORDER BY id DESC"
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])



# =========================
# GET ONE STUDENT
# =========================
@app.route("/student/<int:id>", methods=["GET"])
def get_student(id):
    conn = get_connection()
    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()
    conn.close()

    if student:
        return jsonify(dict(student))

    return jsonify({"message": "Student not found"}), 404


# =========================
# ADD STUDENT
# =========================
@app.route("/student", methods=["POST"])
def add_student():

    photo = request.files.get("photo")

    filename = ""

    if photo and photo.filename != "":

        extension = photo.filename.rsplit(".", 1)[1].lower()

        filename = f"{uuid.uuid4().hex}.{extension}"

        photo.save(
            os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )
        )

    name = request.form["name"]
    email = request.form["email"]
    phone = request.form["phone"]
    university = request.form["university"]
    department = request.form["department"]

    conn = get_connection()

    conn.execute("""
        INSERT INTO students
        (photo,name,email,phone,university,department)
        VALUES (?,?,?,?,?,?)
    """, (
        filename,
        name,
        email,
        phone,
        university,
        department
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Student Added Successfully"})


# =========================
# UPDATE STUDENT (PUT)
# =========================
@app.route("/student/<int:id>", methods=["PUT"])
def update_student(id):

    data = request.get_json()

    conn = get_connection()

    conn.execute("""
        UPDATE students
        SET
        name=?,
        email=?,
        phone=?,
        university=?,
        department=?
        WHERE id=?
    """, (
        data["name"],
        data["email"],
        data["phone"],
        data["university"],
        data["department"],
        id
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Student Updated Successfully"})


# =========================
# PATCH STUDENT
# =========================
@app.route("/student/<int:id>", methods=["PATCH"])
def patch_student(id):

    data = request.get_json()

    conn = get_connection()

    student = conn.execute(
        "SELECT * FROM students WHERE id=?",
        (id,)
    ).fetchone()

    if not student:
        conn.close()
        return jsonify({"message": "Student not found"}), 404

    student = dict(student)

    conn.execute("""
        UPDATE students
        SET
        name=?,
        email=?,
        phone=?,
        university=?,
        department=?
        WHERE id=?
    """, (
        data.get("name", student["name"]),
        data.get("email", student["email"]),
        data.get("phone", student["phone"]),
        data.get("university", student["university"]),
        data.get("department", student["department"]),
        id
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Student Partially Updated"})


# =========================
# DELETE STUDENT
# =========================
@app.route("/student/<int:id>", methods=["DELETE"])
def delete_student(id):

    conn = get_connection()

    conn.execute(
        "DELETE FROM students WHERE id=?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Student Deleted Successfully"})

# =========================
# LOGOUT
# =========================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)