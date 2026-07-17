// ================================
// API URLs
// ================================

const API = "/students";
const STUDENT_API = "/student";

// ================================
// Elements
// ================================

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

const totalStudents = document.getElementById("totalStudents");
const totalUniversities = document.getElementById("totalUniversities");
const totalDepartments = document.getElementById("totalDepartments");
const totalPhotos = document.getElementById("totalPhotos");

const loader = document.getElementById("loader");
const toast = document.getElementById("toast");

let students = [];

// ================================
// Loader
// ================================

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

// ================================
// Toast
// ================================

function showToast(message) {

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

// ================================
// Load Students
// ================================

async function loadStudents() {

    showLoader();

    try {

        const response = await fetch(API);

        students = await response.json();

        renderStudents(students);

        updateDashboard(students);

    }

    catch (error) {

        showToast("Failed to load students");

        console.log(error);

    }

    hideLoader();

}

// ================================
// Dashboard
// ================================

function updateDashboard(data){

    totalStudents.innerHTML = data.length;

    const universities = new Set();
    const departments = new Set();

    let photos = 0;

    data.forEach(student=>{

        universities.add(student.university);

        departments.add(student.department);

        if(student.photo){
            photos++;
        }

    });

    totalUniversities.innerHTML = universities.size;

    totalDepartments.innerHTML = departments.size;

    totalPhotos.innerHTML = photos;

}

// ================================
// DASHBOARD CARD CLICK EVENTS
// ================================

document.getElementById("studentsCard")
.addEventListener("click", showDashboardStudents);

document.getElementById("universitiesCard")
.addEventListener("click", showUniversities);

document.getElementById("departmentsCard")
.addEventListener("click", showDepartments);

document.getElementById("photosCard")
.addEventListener("click", showPhotos);

// ================================
// OPEN DASHBOARD MODAL
// ================================

function openDashboard(title, content) {

    document.getElementById("dashboardTitle").innerHTML = title;

    document.getElementById("dashboardContent").innerHTML = content;

    document.getElementById("dashboardModal").style.display = "flex";

}

// ================================
// SHOW ALL STUDENTS FROM DASHBOARD
// ================================

function showDashboardStudents() {

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    students.forEach(student => {

        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <button class="action-btn view"
                        onclick="viewFromDashboard(${student.id})">
                        <i class="fa fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;

    });

    html += `
            </tbody>
        </table>
    `;

    openDashboard("All Students", html);

}

// ================================
// VIEW STUDENT FROM DASHBOARD
// ================================

function viewFromDashboard(id) {

    // Close the dashboard modal first
    document.getElementById("dashboardModal").style.display = "none";

    // Open the existing student details modal
    viewStudent(id);

}

// ================================
// SHOW UNIVERSITIES
// ================================

function showUniversities() {

    let universityCount = {};

    students.forEach(student => {

        if (!universityCount[student.university]) {
            universityCount[student.university] = 0;
        }

        universityCount[student.university]++;

    });

    let html = `
        <table>
            <thead>
                <tr>
                    <th>University</th>
                    <th>Total Students</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let university in universityCount) {

        html += `
            <tr>
                <td>${university}</td>
                <td>${universityCount[university]}</td>
            </tr>
        `;

    }

    html += `
            </tbody>
        </table>
    `;

    openDashboard("Universities", html);

}

// ================================
// SHOW DEPARTMENTS
// ================================

function showDepartments() {

    let departmentCount = {};

    students.forEach(student => {

        if (!departmentCount[student.department]) {
            departmentCount[student.department] = 0;
        }

        departmentCount[student.department]++;

    });

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Total Students</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let department in departmentCount) {

        html += `
            <tr>
                <td>${department}</td>
                <td>${departmentCount[department]}</td>
            </tr>
        `;

    }

    html += `
            </tbody>
        </table>
    `;

    openDashboard("Departments", html);

}

// ================================
// SHOW STUDENTS WITH PHOTOS
// ================================

function showPhotos() {

    const photoStudents = students.filter(student => student.photo);

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (photoStudents.length === 0) {

        html += `
            <tr>
                <td colspan="3" style="text-align:center;">
                    No student photos found.
                </td>
            </tr>
        `;

    } else {

        photoStudents.forEach(student => {

            html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>
                        <button class="action-btn view"
                            onclick="viewStudent(${student.id})">
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;

        });

    }

    html += `
            </tbody>
        </table>
    `;

    openDashboard("Students With Photos", html);

}

// ================================
// Render Table
// ================================

function renderStudents(data){

    studentTable.innerHTML="";

    if(data.length===0){

        studentTable.innerHTML=`
        <tr>
            <td colspan="8" style="text-align:center;">
                No Students Found
            </td>
        </tr>
        `;

        return;
    }

    data.forEach(student=>{

        let photo = student.photo
        ? `/static/uploads/${student.photo}`
        : "/static/images/default-avatar.png";

        studentTable.innerHTML +=`

        <tr>

            <td>${student.id}</td>

            <td>

                <img src="${photo}" alt="Student">

            </td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

            <td>${student.university}</td>

            <td>${student.department}</td>

            <td>

                <button class="action-btn view"
                onclick="viewStudent(${student.id})">

                <i class="fa fa-eye"></i>

                </button>

                <button class="action-btn edit"
                onclick="openEdit(${student.id})">

                <i class="fa fa-pen"></i>

                </button>

                <button class="action-btn patch"
                onclick="openPatch(${student.id})">

                <i class="fa fa-wrench"></i>

                </button>

                <button class="action-btn delete"
                onclick="openDelete(${student.id})">

                <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// ================================
// Search
// ================================

searchInput.addEventListener("keyup",()=>{

    const keyword=searchInput.value.toLowerCase();

    const filtered=students.filter(student=>

        student.name.toLowerCase().includes(keyword)

    );

    renderStudents(filtered);

});

// ================================
// Refresh
// ================================

document
.getElementById("refreshBtn")
.addEventListener("click",loadStudents);

// ================================
// Start App
// ================================

loadStudents();
// ================================
// ADD STUDENT
// ================================

const addForm = document.getElementById("addStudentForm");

addForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    showLoader();

    const formData = new FormData(addForm);

    try {

        const response = await fetch("/student", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        hideLoader();

        showToast(result.message);

        addForm.reset();

        document.getElementById("addModal").style.display = "none";

        loadStudents();

    } catch (error) {

        hideLoader();

        showToast("Unable to add student.");

        console.log(error);

    }

});


// ================================
// VIEW STUDENT
// ================================

async function viewStudent(id) {

    showLoader();

    try {

        const response = await fetch(`/student/${id}`);

        const student = await response.json();

        let photo = student.photo
            ? `/static/uploads/${student.photo}`
            : "/static/images/default-avatar.png";

        document.getElementById("studentDetails").innerHTML = `
            <img src="${photo}">
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>University:</strong> ${student.university}</p>
            <p><strong>Department:</strong> ${student.department}</p>
        `;

        document.getElementById("viewModal").style.display = "flex";

    } catch (error) {

        showToast("Unable to load student.");

    }

    hideLoader();

}


// ================================
// EDIT STUDENT (PUT)
// ================================

async function openEdit(id) {

    const response = await fetch(`/student/${id}`);

    const student = await response.json();

    editId.value = student.id;
    editName.value = student.name;
    editEmail.value = student.email;
    editPhone.value = student.phone;
    editUniversity.value = student.university;
    editDepartment.value = student.department;

    document.getElementById("editModal").style.display = "flex";

}

document.getElementById("editStudentForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    showLoader();

    const id = editId.value;

    const data = {

        name: editName.value,
        email: editEmail.value,
        phone: editPhone.value,
        university: editUniversity.value,
        department: editDepartment.value

    };

    try {

        const response = await fetch(`/student/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        hideLoader();

        showToast(result.message);

        document.getElementById("editModal").style.display = "none";

        loadStudents();

    } catch (error) {

        hideLoader();

        showToast("Update failed.");

    }

});


// ================================
// PATCH STUDENT
// ================================

async function openPatch(id) {

    const response = await fetch(`/student/${id}`);

    const student = await response.json();

    patchId.value = student.id;
    patchName.value = student.name;
    patchEmail.value = student.email;
    patchPhone.value = student.phone;
    patchUniversity.value = student.university;
    patchDepartment.value = student.department;

    document.getElementById("patchModal").style.display = "flex";

}

document.getElementById("patchStudentForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    showLoader();

    const id = patchId.value;

    const data = {

        name: patchName.value,
        email: patchEmail.value,
        phone: patchPhone.value,
        university: patchUniversity.value,
        department: patchDepartment.value

    };

    try {

        const response = await fetch(`/student/${id}`, {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        hideLoader();

        showToast(result.message);

        document.getElementById("patchModal").style.display = "none";

        loadStudents();

    } catch (error) {

        hideLoader();

        showToast("Patch failed.");

    }

});
// ================================
// DELETE STUDENT
// ================================

let deleteStudentId = null;

function openDelete(id) {

    deleteStudentId = id;

    document.getElementById("deleteModal").style.display = "flex";

}

document
.getElementById("confirmDelete")
.addEventListener("click", async () => {

    if (!deleteStudentId) return;

    showLoader();

    try {

        const response = await fetch(`/student/${deleteStudentId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        hideLoader();

        showToast(result.message);

        document.getElementById("deleteModal").style.display = "none";

        deleteStudentId = null;

        loadStudents();

    } catch (error) {

        hideLoader();

        showToast("Delete failed.");

    }

});

document
.getElementById("cancelDelete")
.addEventListener("click", () => {

    deleteStudentId = null;

    document.getElementById("deleteModal").style.display = "none";

});

// ================================
// OPEN MODALS
// ================================

document
.getElementById("openAddModal")
.addEventListener("click", () => {

    document.getElementById("addModal").style.display = "flex";

});

// ================================
// CLOSE MODALS
// ================================

document.getElementById("closeAdd").onclick = () => {

    document.getElementById("addModal").style.display = "none";

};

document.getElementById("closeView").onclick = () => {

    document.getElementById("viewModal").style.display = "none";

};

document.getElementById("closeEdit").onclick = () => {

    document.getElementById("editModal").style.display = "none";

};

document.getElementById("closePatch").onclick = () => {

    document.getElementById("patchModal").style.display = "none";

};

document.getElementById("closeDashboard").onclick = () => {

    document.getElementById("dashboardModal").style.display = "none";

};

// ================================
// CLOSE WHEN CLICKING OUTSIDE
// ================================

window.onclick = function(event){

    const modals = [

        "addModal",
        "viewModal",
        "dashboardModal",
        "editModal",
        "patchModal",
        "deleteModal"

    ];

    modals.forEach(id=>{

        const modal = document.getElementById(id);

        if(event.target===modal){

            modal.style.display="none";

        }

    });

};

// ================================
// INITIALIZE
// ================================

document.addEventListener("DOMContentLoaded", () => {

    loadStudents();

});