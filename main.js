let studentsList = [];


class Student {

    #grades;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {

        if (!name || name.trim() === "") {
            throw new Error("من فضلك أدخل اسم الطالب.");
        }

        this.name = name.trim();

        this.grades = [grade1, grade2, grade3];

        this.attendance = attendance;
    }

    // Grades Setter
    set grades(values) {

        if (!Array.isArray(values) || values.length !== 3) {
            throw new Error("يجب إدخال درجات المواد الثلاث.");
        }

        for (let grade of values) {

            if (
                grade === "" ||
                grade === null ||
                grade === undefined ||
                !Number.isFinite(grade) ||
                grade < 0 ||
                grade > 100
            ) {
                throw new Error("يجب أن تكون كل درجة بين 0 و100.");
            }
        }

        this.#grades = values;
    }

    get grades() {
        return this.#grades;
    }

    // Attendance Setter
    set attendance(value) {

        if (
            value === "" ||
            value === null ||
            value === undefined ||
            !Number.isFinite(value) ||
            value < 0 ||
            value > 100
        ) {
            throw new Error("يجب أن تكون نسبة الحضور بين 0 و100.");
        }

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    // Calculate Average
    get average() {

        let total = this.#grades.reduce(
            (sum, grade) => sum + grade,
            0
        );

        return total / this.#grades.length;
    }

}


const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");

const grade1 = document.getElementById("grade1");
const grade2 = document.getElementById("grade2");
const grade3 = document.getElementById("grade3");

const attendance = document.getElementById("attendance");

const errorMessage = document.getElementById("errorMessage");

const studentsDisplay = document.getElementById("studentsDisplay");

const mercyButton = document.getElementById("mercyButton");

const mercyReport = document.getElementById("mercyReport");

function displayStudents() {

    if (studentsList.length === 0) {

        studentsDisplay.innerHTML = `
            <p class="empty-message">
                لم يتم إضافة أي طلاب حتى الآن.
            </p>
        `;

        return;
    }

    studentsDisplay.innerHTML = studentsList.map((student, index) => `
        <div class="student-item">
            <p>الطالب: ${escapeHTML(student.name)}</p>
            <p>متوسط الدرجات: ${student.average.toFixed(2)}</p>
        </div>
    `).join("");

}


studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    try {

        const nameValue = studentName.value;

        const grade1Value = grade1.value;
        const grade2Value = grade2.value;
        const grade3Value = grade3.value;

        const attendanceValue = attendance.value;

        const newStudent = new Student(
            nameValue,
            Number(grade1Value),
            Number(grade2Value),
            Number(grade3Value),
            Number(attendanceValue)
        );

        studentsList.push(newStudent);

        displayStudents();

        errorMessage.textContent = "";
        errorMessage.classList.add("d-none");

        studentForm.reset();

        mercyReport.innerHTML = `
            <p class="empty-message">
                أضيف طالب جديد، اضغطي على زر تفعيل لجنة الرأفة لتحديث التقرير.
            </p>
        `;

    }

    catch (error) {

        errorMessage.textContent = error.message;

        errorMessage.classList.remove("d-none");

    }

});

mercyButton.addEventListener("click", function() {

    // Filter Students
    const strugglingStudents = studentsList.filter(student => {

        return student.average >= 40 && student.average <= 49;

    });

    if (strugglingStudents.length === 0) {

        mercyReport.innerHTML = `
            <div class="mercy-result">
                <h3>التقرير النهائي للجنة الرأفة</h3>
                <p>عدد الطلاب المتعثرين: 0</p>
                <p>لا يوجد طلاب تنطبق عليهم شروط لجنة الرأفة.</p>
                <div class="mercy-average">
                    المتوسط العام بعد الرأفة: 0
                </div>
            </div>
        `;

        return;
    }

    const updatedStudents = strugglingStudents.map(student => {

        return {
            name: student.name,
            newAverage: student.average + 5
        };

    });

    const totalAverage = updatedStudents.reduce(
        (sum, student) => sum + student.newAverage,
        0
    );

    const finalAverage = totalAverage / updatedStudents.length;

    mercyReport.innerHTML = `
        <div class="mercy-result">

            <h3>التقرير النهائي للجنة الرأفة</h3>

            <p>
                عدد الطلاب المتعثرين:
                <strong>${updatedStudents.length}</strong>
            </p>

            <h3>أسماء الطلاب بعد الرأفة</h3>

            ${updatedStudents.map(student => `
                <div class="mercy-student">
                    <p>
                        اسم الطالب:
                        <strong>${escapeHTML(student.name)}</strong>
                    </p>

                    <p>
                        المتوسط بعد إضافة 5 درجات:
                        <strong>${student.newAverage.toFixed(2)}</strong>
                    </p>
                </div>
            `).join("")}

            <div class="mercy-average">
                المتوسط العام بعد الرأفة:
                ${finalAverage.toFixed(2)}
            </div>

        </div>
    `;

});


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}