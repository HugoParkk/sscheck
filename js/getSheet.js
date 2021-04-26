let isFirst = true;
let isGrade = true;
let grade;

const setAnimation = (ele) => {
    // animation
    ele.classList.add("showData");
    ele.classList.add("animation-init");
    setTimeout(function () {
        ele.classList.add("animation-fade");
    }, 50);
}
const setAnimation2 = (ele) => {
    // animation
    setTimeout(function () {
        ele.classList.add('animation-fade2')
    }, 50);
}

let jsonp = function (url) {
    let script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function () {
        alert('Can not access JSONP file.')
    };
    let done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState ===
            'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script.parentNode) {
                return script.parentNode.removeChild(script);
            }
        }
    };
    window.document.getElementsByTagName('head')[0].appendChild(script);
};

let parse = (data) => {
    let column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length) {
        return false;
    }
    let columns = [],
        result = [],
        row_length,
        value;
    for (let column_idx in data.table.cols) {
        columns.push(data.table.cols[column_idx].label);
    }
    for (let rows_idx in data.table.rows) {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length) {
            return false;
        }
        for (let row_idx in data.table.rows[rows_idx]['c']) {
            if (!result[rows_idx]) {
                result[rows_idx] = {};
            }
            value = !!data.table.rows[rows_idx]['c'][row_idx].v ? data.table.rows[rows_idx]['c'][row_idx]
                .v : '';
            if (data.table.rows[rows_idx]['c'][row_idx].f !== undefined && data.table.rows[rows_idx]['c'][
                row_idx
            ].v !== undefined) {
                value = data.table.rows[rows_idx]['c'][row_idx].f;
            }
            result[rows_idx][columns[row_idx]] = value;
        }
    }
    return result;
};

let query = function (sql, sheetName, callback) {
    let myKey = '1kbBoHLU2-xbc4ZwM12dSEJAEivMfWnOYQNPx_yFHAxM';
    let url = `https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?`,
        params = {
            tq: encodeURIComponent(sql),
            sheet: encodeURIComponent(sheetName),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (let key in params) {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    return jsonp(url); // Call JSONP helper function
}

let my_callback = (data) => {
    if (isGrade) {
        data = parse(data); // Call data parser helper function

        //AND THEN WHATEVER YOU WANT 
        for (let i = 0; i < datas.length; i++) {
            if (JSON.stringify(datas[i]) == JSON.stringify(data)) {
                return false;
            }
        }

        datas.push(data);

        // CREATE DYNAMIC SELECT.
        let select = document.createElement("select");
        select.setAttribute('id', 'gradeSel');

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        // ADD JSON DATA TO THE TABLE AS ROWS.
        let opt = document.createElement('option');
        select.appendChild(opt);
        for (let i = 1; i < data.length; i++) {
            let opt = document.createElement('option'); // SELECT OPTION.
            for (let j = 0; j < 1; j++) {
                opt.value = data[i][''];
                opt.text = data[i][''];
                select.appendChild(opt);
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        let divContainer = document.querySelector('.container');
        divContainer.innerHTML = "";
        let newDiv = document.createElement('div')
        newDiv.id = 'showGrade'
        let text = document.createElement('h3');
        text.innerHTML = '기수';
        newDiv.appendChild(text);

        newDiv.appendChild(select);
        setAnimation(newDiv);
        divContainer.appendChild(newDiv)
        let showData = document.createElement('div');
        showData.id = 'showData';
        divContainer.appendChild(showData);

        grade = document.querySelector('#gradeSel')
        grade.addEventListener('change', () => {
            let div = document.querySelector('#showData');
            div.innerHTML = '';
            datas = [];
            query(`SELECT * WHERE A != 'null' ORDER BY A ASC`, grade.value, 'my_callback');
        });
        isGrade = false;
    } else {
        data = parse(data); // Call data parser helper function

        //AND THEN WHATEVER YOU WANT 
        for (let i = 0; i < datas.length; i++) {
            if (JSON.stringify(datas[i]) == JSON.stringify(data)) {
                return false;
            }
        }

        datas.push(data);

        let select = document.querySelector("#showData");

        // CREATE DYNAMIC SELECT.
        select = document.createElement("select");
        select.setAttribute('id', 'selName');

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        // ADD JSON DATA TO THE TABLE AS ROWS.
        let opt = document.createElement('option');
        select.appendChild(opt);
        for (let i = 1; i < data.length; i++) {
            let opt = document.createElement('option'); // SELECT OPTION.
            for (let j = 0; j < 1; j++) {
                opt.value = data[i][''];
                opt.text = data[i][''];
                select.appendChild(opt);
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";

        let text = document.createElement('h3');
        text.innerHTML = '이름';
        divContainer.appendChild(text);

        divContainer.appendChild(select);
        let lastDiv = document.getElementById('showGrade')
        setAnimation2(lastDiv);
        setAnimation(divContainer);
        let name = document.getElementById('selName')
        name.addEventListener('change', () => {
            if (isFirst) {
                let btn = document.createElement('button');
                btn.innerText = '출석';
                btn.id = 'sendBtn';
                document.querySelector('.container').appendChild(btn);
                let lastDiv = document.getElementById('showData')
                setAnimation2(lastDiv);
                setAnimation(btn);
                isFirst = false;
            }
            const url = 'https://script.google.com/macros/s/AKfycbz2fhg1c1OGz-0eX-8Tjwz0likHmyUT8xI8wYRuIptctS4Ej6ZT/exec';
            const send = document.querySelector('#sendBtn');
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
        });
    }
}

let datas = [];

window.onload = () => {
    let div = document.querySelector('.container');
    div.innerHTML = '';
    datas = [];
    query(`SELECT * WHERE A != 'null' ORDER BY A DESC`, '기수목록', 'my_callback');
}


