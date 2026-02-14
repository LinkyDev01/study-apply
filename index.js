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

            if (isNaN(age) || age < 19 || age > 39) {
                alert('만 19세 ~ 39세만 신청이 가능합니다.');
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

        // 반 선택 체크 (라디오 버튼)
        else if (input.name === "level" && input.type === "radio") {
            const classRadios = step.querySelectorAll('input[name="class"]');
            const isClassSelected = Array.from(classRadios).some(radio => radio.checked);
            if (!isClassSelected) {
                alert('희망 수준을 선택해주세요.');
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

    // 로딩 오버레이 표시
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    const payload = {
        name: this.name.value,
        month: this.month.value,
        language: this.language.value,
        class: this.class.value,
        level: this.level.value,
        gender: this.gender.value,
        age: this.age.value,
        phone: this.phone.value,
        job: this.job.value || '',
        instagram: this.instagram.value || '',
        introduction: this.introduction.value,
        source: this.source.value || '',
        referrer: this.referrer.value || '',
        privacy_agree: this.privacy_agree.checked,
        photo_agree: this.photo_agree.checked
    };

    try {
        await fetch(
          'https://script.google.com/macros/s/AKfycby0B3jEKtG4DPiUKz2K902qv5Q98MCpHnsZqD1ZTMf8uFpxVYpAhOzsIXbhKCSlxAA/exec',
          {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        alert('신청이 완료되었습니다!');
        window.location.replace('https://buy.tosspayments.com/products/SCBnFcyXiE?shopId=prreBmgHJwPY');
    } catch (err) {
        alert('전송 중 오류가 발생했습니다.');
    } finally {
        // 로딩 오버레이 숨김
        loadingOverlay.style.display = 'none';
    }
});
