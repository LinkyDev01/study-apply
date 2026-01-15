function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(stepNumber) {
    const step = document.getElementById(`step${stepNumber}`);
    const requiredInputs = step.querySelectorAll('[required]');

    if (stepNumber === 3) {
        const input = step.querySelector('#photoInput');
        if (!input.files || input.files.length === 0) {
            alert('사진을 선택해주세요.');
            return false;
        }
        // 파일 크기 체크 (10MB 이하)
        const file = input.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('사진 파일 크기는 10MB 이하로 선택해주세요.');
            return false;
        }
        // 이미지 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return false;
        }
    }

    for (let input of requiredInputs) {
        // 체크박스는 checked 속성으로 체크
        if (input.type === 'checkbox') {
            if (!input.checked) {
                alert('필수 동의 항목을 모두 체크해주세요.');
                input.focus();
                return false;
            }
        }

        else if (input.name === "age") {
            const age = Number(input.value);

            if (isNaN(age) || age < 19 || age > 35) {
                alert('만 19세 ~ 35세만 신청이 가능합니다.');
                input.focus();
                return false;
            }
        }

        // 언어 선택 체크 (라디오 버튼)
        else if (input.name === "language" && input.type === "radio") {
            const classRadios = step.querySelectorAll('input[name="class"]');
            const isClassSelected = Array.from(classRadios).some(radio => radio.checked);
            if (!isClassSelected) {
                alert('희망 언어를 선택해주세요.');
                return false;
            }
        }

        // 반 선택 체크 (라디오 버튼)
        else if (input.name === "class" && input.type === "radio") {
            const classRadios = step.querySelectorAll('input[name="class"]');
            const isClassSelected = Array.from(classRadios).some(radio => radio.checked);
            if (!isClassSelected) {
                alert('희망 반을 선택해주세요.');
                return false;
            }
        }

        // 성별 선택 체크 (라디오 버튼)
        else if (input.name === "gender" && input.type === "radio") {
            const genderRadios = step.querySelectorAll('input[name="gender"]');
            const isGenderSelected = Array.from(genderRadios).some(radio => radio.checked);
            if (!isGenderSelected) {
                alert('성별을 선택해주세요.');
                return false;
            }
        }

        // 일반 입력은 value로 체크
        else if (!input.value.trim()) {
            alert('필수 항목을 모두 입력해주세요.');
            input.focus();
            return false;
        }
        
    }
    return true;
}

// Step navigation
document.getElementById('nextStep1').addEventListener('click', () => {
    if (validateStep(1)) {
        currentStep = 2;
        showStep(currentStep);
    }
});

document.getElementById('prevStep2').addEventListener('click', () => {
    currentStep = 1;
    showStep(currentStep);
});

document.getElementById('nextStep2').addEventListener('click', () => {
    currentStep = 3;
    showStep(currentStep);
});

document.getElementById('prevStep3').addEventListener('click', () => {
    currentStep = 2;
    showStep(currentStep);
});

// 글자 수 카운터
const introTextarea = document.querySelector('textarea[name="introduction"]');
const charCountSpan = document.getElementById('charCount');

if (introTextarea && charCountSpan) {
    introTextarea.addEventListener('input', function() {
        charCountSpan.textContent = this.value.length;
    });
}

// 연락처 자동 하이픈 입력
const phoneInput = document.querySelector('input[name="phone"]');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
        let formattedValue = '';

        if (value.length <= 3) {
            formattedValue = value;
        } else if (value.length <= 7) {
            formattedValue = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length <= 11) {
            formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        } else {
            formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }

        e.target.value = formattedValue;
    });
}

document.getElementById('applicationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateStep(3)) return;

    const fileInput = document.getElementById('photoInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('사진을 선택해주세요.');
        return;
    }

    // 로딩 오버레이 표시
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    const reader = new FileReader();

    reader.onload = async () => {
        const base64 = reader.result.split(',')[1];

        const payload = {
            name: this.name.value,
            language: this.language.value,
            class: this.class.value,
            gender: this.gender.value,
            age: this.age.value,
            phone: this.phone.value,
            job: this.job.value || '',
            instagram: this.instagram.value || '',
            introduction: this.introduction.value,
            source: this.source.value || '',
            referrer: this.referrer.value || '',
            privacy_agree: this.privacy_agree.checked,
            photoBase64: base64,
            photoType: file.type
        };

        try {
            await fetch(
              'https://script.google.com/macros/s/AKfycbxRD1H4ufVOFyYmr_ttn-ynqBoh-DBDEBJCQQxMrOgY3JcdFArkT9T8fw0Emc3mVuA/exec',
              {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              }
            );

            alert('신청이 완료되었습니다!');
            window.location.replace('https://linky-study-homepage.vercel.app/');
        } catch (err) {
            alert('전송 중 오류가 발생했습니다.');
        } finally {
            // 로딩 오버레이 숨김
            loadingOverlay.style.display = 'none';
        }
    };

    reader.readAsDataURL(file);
});


// 사진 미리보기 기능
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const fileNameDisplay = document.getElementById('fileNameDisplay');

if (photoInput && photoPreview && fileNameDisplay) {
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
            fileNameDisplay.textContent = file.name;
        } else {
            photoPreview.style.display = 'none';
            fileNameDisplay.textContent = '선택된 파일 없음';
        }
    });
}
