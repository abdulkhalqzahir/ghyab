document.addEventListener('DOMContentLoaded', function () {
    const studentNameInput = document.getElementById('studentName');
    const studentImageInput = document.getElementById('studentImage');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const stageSelect = document.getElementById('stageSelect');
    const groupSelect = document.getElementById('groupSelect');

    let studentsData = {
        stage1: { A: [], B: [], C: [] },
        stage2: { A: [], B: [], C: [] },
        stage3: { A: [], B: [], C: [] },
        stage4: { A: [], B: [], C: [] }
    };

    // هێنانەوەی داتا لە Local Storage
    Object.keys(studentsData).forEach(stage => {
        Object.keys(studentsData[stage]).forEach(group => {
            const data = JSON.parse(localStorage.getItem(`students${stage}${group}`)) || [];
            studentsData[stage][group] = data;
        });
    });

    // زیادکردنی قوتابی
    saveButton.addEventListener('click', function () {
        const name = studentNameInput.value;
        const image = studentImageInput.files[0];
        const stage = stageSelect.value;
        const group = groupSelect.value;

        if (name && image && group) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const student = {
                    name: name,
                    image: e.target.result,
                    group: group,
                    absences: 0,
                    absenceDates: []
                };

                studentsData[`stage${stage}`][group].push(student);
                localStorage.setItem(`students${stage}${group}`, JSON.stringify(studentsData[`stage${stage}`][group]));
                renderTable();
                studentNameInput.value = '';
                studentImageInput.value = '';
            };
            reader.readAsDataURL(image);
        } else {
            alert('تکایە هەموو خانەکان پر بکەرەوە');
        }
    });

    // سڕینەوەی قوتابی
    deleteButton.addEventListener('click', function () {
        const selectedStudent = prompt('ناوی قوتابیەکە بنووسە بۆ سڕینەوە:');
        if (selectedStudent) {
            confirmDelete(selectedStudent);
        }
    });

    // نیشاندانی خشتەکە
    function renderTable() {
        const stage = stageSelect.value;
        const group = groupSelect.value;
        const students = studentsData[`stage${stage}`][group];

        studentTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${student.name}
                    <span class="delete-icon" onclick="confirmDelete('${student.name}', ${index})"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
<radialGradient id="SrYuS0MYDGH9m0SRC6_noa_Pvblw74eluzR_gr1" cx="31.417" cy="-1098.083" r="28.77" gradientTransform="translate(0 1128)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4e09d"></stop><stop offset=".226" stop-color="#f8e8b5"></stop><stop offset=".513" stop-color="#fcf0cd"></stop><stop offset=".778" stop-color="#fef4dc"></stop><stop offset="1" stop-color="#fff6e1"></stop></radialGradient><path fill="url(#SrYuS0MYDGH9m0SRC6_noa_Pvblw74eluzR_gr1)" d="M7.5,64L7.5,64c1.933,0,3.5-1.567,3.5-3.5l0,0c0-1.933-1.567-3.5-3.5-3.5l0,0 C5.567,57,4,58.567,4,60.5l0,0C4,62.433,5.567,64,7.5,64z"></path><radialGradient id="SrYuS0MYDGH9m0SRC6_nob_Pvblw74eluzR_gr2" cx="31.5" cy="-1096" r="31.751" gradientTransform="translate(0 1128)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4e09d"></stop><stop offset=".226" stop-color="#f8e8b5"></stop><stop offset=".513" stop-color="#fcf0cd"></stop><stop offset=".778" stop-color="#fef4dc"></stop><stop offset="1" stop-color="#fff6e1"></stop></radialGradient><path fill="url(#SrYuS0MYDGH9m0SRC6_nob_Pvblw74eluzR_gr2)" d="M62,20.5L62,20.5c0-2.485-2.015-4.5-4.5-4.5H49c-2.209,0-4-1.791-4-4l0,0 c0-2.209,1.791-4,4-4h2c2.209,0,4-1.791,4-4l0,0c0-2.209-1.791-4-4-4H20c-2.209,0-4,1.791-4,4l0,0c0,2.209,1.791,4,4,4h2 c1.657,0,3,1.343,3,3l0,0c0,1.657-1.343,3-3,3H7.5C5.567,14,4,15.567,4,17.5l0,0C4,19.433,5.567,21,7.5,21H9c1.657,0,3,1.343,3,3 l0,0c0,1.657-1.343,3-3,3H5c-2.761,0-5,2.239-5,5l0,0c0,2.761,2.239,5,5,5h2.5c1.933,0,3.5,1.567,3.5,3.5l0,0 c0,1.933-1.567,3.5-3.5,3.5H6c-2.209,0-4,1.791-4,4l0,0c0,2.209,1.791,4,4,4h11.5c1.381,0,2.5,1.119,2.5,2.5l0,0 c0,1.381-1.119,2.5-2.5,2.5l0,0c-1.933,0-3.5,1.567-3.5,3.5l0,0c0,1.933,1.567,3.5,3.5,3.5h35c1.933,0,3.5-1.567,3.5-3.5l0,0 c0-1.933-1.567-3.5-3.5-3.5H52c-1.105,0-7-0.895-7-2l0,0c0-1.105,0.895-2,2-2h12c2.209,0,4-1.791,4-4l0,0c0-2.209-1.791-4-4-4h-2.5 c-1.381,0-2.5-1.119-2.5-2.5l0,0c0-1.381,1.119-2.5,2.5-2.5H57c2.209,0,4-1.791,4-4l0,0c0-2.209-1.791-4-4-4h-4.5 c-1.933,0-3.5-1.567-3.5-3.5l0,0c0-1.933,1.567-3.5,3.5-3.5h5C59.985,25,62,22.985,62,20.5z"></path><g><linearGradient id="SrYuS0MYDGH9m0SRC6_noc_Pvblw74eluzR_gr3" x1="32" x2="32" y1="53" y2="8" gradientTransform="matrix(1 0 0 -1 0 64)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#def9ff"></stop><stop offset=".282" stop-color="#cff6ff"></stop><stop offset=".823" stop-color="#a7efff"></stop><stop offset="1" stop-color="#99ecff"></stop></linearGradient><path fill="url(#SrYuS0MYDGH9m0SRC6_noc_Pvblw74eluzR_gr3)" d="M15.211,11h33.578c3.024,0,5.356,2.663,4.956,5.661l-4.667,35 C48.747,54.145,46.628,56,44.122,56H19.878c-2.506,0-4.625-1.855-4.956-4.339l-4.667-35C9.855,13.663,12.187,11,15.211,11z"></path><linearGradient id="SrYuS0MYDGH9m0SRC6_nod_Pvblw74eluzR_gr4" x1="32" x2="32" y1="46" y2="56" gradientTransform="matrix(1 0 0 -1 0 64)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#41bfec"></stop><stop offset=".232" stop-color="#4cc5ef"></stop><stop offset=".644" stop-color="#6bd4f6"></stop><stop offset="1" stop-color="#8ae4fd"></stop></linearGradient><path fill="url(#SrYuS0MYDGH9m0SRC6_nod_Pvblw74eluzR_gr4)" d="M53,18H11c-1.105,0-2-0.895-2-2v-6c0-1.105,0.895-2,2-2h42c1.105,0,2,0.895,2,2v6 C55,17.105,54.105,18,53,18z"></path></g><g><linearGradient id="SrYuS0MYDGH9m0SRC6_noe_Pvblw74eluzR_gr5" x1="52" x2="52" y1="-1064" y2="-1088" gradientTransform="translate(0 1128)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff5840"></stop><stop offset=".007" stop-color="#ff5840"></stop><stop offset=".989" stop-color="#fa528c"></stop><stop offset="1" stop-color="#fa528c"></stop></linearGradient><path fill="url(#SrYuS0MYDGH9m0SRC6_noe_Pvblw74eluzR_gr5)" d="M52,40c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S58.627,40,52,40z"></path><path fill="#fff" d="M57.417,49.412l-8.005,8.005c-0.778,0.778-2.051,0.778-2.828,0l0,0 c-0.778-0.778-0.778-2.051,0-2.828l8.005-8.005c0.778-0.778,2.051-0.778,2.828,0l0,0C58.194,47.361,58.194,48.634,57.417,49.412z"></path><path fill="#fff" d="M46.583,49.412l8.005,8.005c0.778,0.778,2.051,0.778,2.828,0l0,0c0.778-0.778,0.778-2.051,0-2.828 l-8.005-8.005c-0.778-0.778-2.051-0.778-2.828,0l0,0C45.806,47.361,45.806,48.634,46.583,49.412z"></path></g>
</svg></span>
                </td>
                <td><img src="${student.image}" alt="${student.name}" class="img-thumbnail"></td>
                <td>${student.group}</td>
                <td>${student.absences}</td>
                <td>${student.absenceDates.join('<br>')}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="markAbsent(${index})">نەهاتن</button>
                    <button class="btn btn-success btn-sm" onclick="markPresent(${index})">هاتوو</button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    // زیادکردنی غیاب
    window.markAbsent = function (index) {
        const stage = stageSelect.value;
        const group = groupSelect.value;
        const students = studentsData[`stage${stage}`][group];

        const now = new Date();
        const dateString = now.toLocaleString();
        students[index].absences++;
        students[index].absenceDates.push(dateString);
        localStorage.setItem(`students${stage}${group}`, JSON.stringify(students));
        renderTable();

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
        const stage = stageSelect.value;
        const group = groupSelect.value;
        const students = studentsData[`stage${stage}`][group];

        if (students[index].absences > 0) {
            students[index].absences--;
            students[index].absenceDates.pop();
            localStorage.setItem(`students${stage}${group}`, JSON.stringify(students));
        }
        renderTable();
    };

    // دڵنیایی بۆ سڕینەوە
    window.confirmDelete = function (studentName, index) {
        Swal.fire({
            title: 'دڵنیایت؟',
            text: `دڵنیایت دەتەوێت قوتابی "${studentName}" بسڕیتەوە؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بەڵێ، بسڕەوە',
            cancelButtonText: 'نەخێر'
        }).then((result) => {
            if (result.isConfirmed) {
                const stage = stageSelect.value;
                const group = groupSelect.value;
                studentsData[`stage${stage}`][group].splice(index, 1);
                localStorage.setItem(`students${stage}${group}`, JSON.stringify(studentsData[`stage${stage}`][group]));
                renderTable();
                Swal.fire('سڕایەوە!', `قوتابی "${studentName}" سڕایەوە.`, 'success');
            }
        });
    };

    // گۆڕینی قۆناغ و گروپ
    stageSelect.addEventListener('change', renderTable);
    groupSelect.addEventListener('change', renderTable);

    // نیشاندانی خشتەکە لە سەرەتادا
    renderTable();
});