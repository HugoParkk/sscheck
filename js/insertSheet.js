const url = 'https://script.google.com/macros/s/AKfycbz2fhg1c1OGz-0eX-8Tjwz0likHmyUT8xI8wYRuIptctS4Ej6ZT/exec';
const send = document.querySelector('#sendBtn')
const today = new Date();

send.addEventListener('click', () => {
    const name = document.querySelector('#selName').value;
    const grade = document.querySelector('#gradeSel').value;
    
    let data = {
        '기수': grade,
        '이름': name,
        '일자': today.toLocaleDateString(),
        '시간': today.toLocaleTimeString(),
    }
    $.ajax({
        method: "POST",
        url: url,
        data: data,
        success: function (response) {
            alert('출석 완료.');
        }
    });

    // fetch(url, {
    //     method: 'POST', 
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: data,
    // }).then((res) => alert('출석 완료.'));
});