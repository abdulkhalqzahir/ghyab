document.addEventListener('DOMContentLoaded', function () {
    const studentNameInput = document.getElementById('studentName');
    const studentImageInput = document.getElementById('studentImage');
    const studentGroupSelect = document.getElementById('studentGroup');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');
    const studentTableBody = document.querySelector('#studentTable tbody');

    let students = [];

    // گەڕان بەدوای ناوەکان
    document.getElementById('garan').addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        const rows = document.getElementById('studentTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const studentName = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
            if (studentName.includes(searchQuery)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    });

    // زیادکردنی قوتابی
    saveButton.addEventListener('click', function () {
        const name = studentNameInput.value;
        const image = studentImageInput.files[0];
        const group = studentGroupSelect.value;

        if (name && image && group) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const student = {
                    name: name,
                    image: e.target.result,
                    group: group,
                    absences: 0,
                    absenceDates: [] // لیستی ڕۆژ و کاتی غیابەکان
                };
                students.push(student);
                renderTable();
                studentNameInput.value = '';
                studentImageInput.value = '';
                studentGroupSelect.value = 'A';
            };
            reader.readAsDataURL(image);
        } else {
            alert('تکایە هەموو خانەکان پر بکەرەوە');
        }
    });

    // سڕینەوەی قوتابی
    deleteButton.addEventListener('click', function () {
        const selectedStudent = prompt('ناوی قوتابیەکە بنووسە بۆ سڕینەوە:');
        students = students.filter(student => student.name !== selectedStudent);
        renderTable();
    });

    // نیشاندانی خشتەکە
    function renderTable() {
        studentTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td><img src="${student.image}" alt="${student.name}" class="img-thumbnail"></td>
                <td>${student.group}</td>
                <td>${student.absences}</td>
                <td>${student.absenceDates.join('<br>')}</td> <!-- نیشاندانی ڕۆژ و کاتی غیابەکان -->
                <td>
                    <button class="btn btn-warning btn-sm" onclick="markAbsent(${index})">نەهاتن</button>
                    <button class="btn btn-success btn-sm" onclick="markPresent(${index})">هاتوو</button>
                </td>
            `;

            if (student.absences >= 5) {
                row.classList.add('absent-5');
            }
            if (student.absences >= 8) {
                row.classList.add('absent-8');
            }
            studentTableBody.appendChild(row);
        });
    }

    // زیادکردنی غیاب
    window.markAbsent = function (index) {
        const now = new Date();
        const dateString = now.toLocaleString(); // وەرگرتنی ڕۆژ و کات
        students[index].absences++;
        students[index].absenceDates.push(dateString); // زیادکردنی ڕۆژ و کات بۆ لیستەکە
        renderTable();

        // کاتێک غیابەکان گەیشتە ٦
        if (students[index].absences === 6) {
            Swal.fire({
                title: 'ئاگاداری!',
                html: `<b>${students[index].name}</b> قوتابی بەڕێز، لەبەر ڕێژەی زۆری نەهاتنت، بۆ دەوام کۆتایت بۆ هاتنەوە.`,
                icon: 'warning',
                confirmButtonText: 'باشە',
                customClass: {
                    popup: 'sweet-alert-custom',
                    title: 'sweet-title-custom',
                    htmlContainer: 'sweet-html-custom'
                }
            });
        }
    };

    // کەمکردنەوەی غیاب (هاتوو)
    window.markPresent = function (index) {
        if (students[index].absences > 0) {
            students[index].absences--;
            students[index].absenceDates.pop(); // سڕینەوەی کۆتا ڕۆژی غیاب
        }
        renderTable();
    };

    // نیشاندانی خشتەکە لە سەرەتادا
    renderTable();
});