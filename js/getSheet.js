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

let parse = function (data) {
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

let my_callback = function (data) {
    data = parse(data); // Call data parser helper function

    //AND THEN WHATEVER YOU WANT 
    for (let i = 0; i < datas.length; i++) {
        if (JSON.stringify(datas[i]) == JSON.stringify(data)) {
            return false;
        }
    }

    datas.push(data);

    //table memo
    // let table = document.querySelector("#showData table");
    // if (table === null || table == undefined) {
    //     // CREATE DYNAMIC TABLE.
    //     table = document.createElement("table");

    //     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    //     let tr = table.insertRow(-1); // TABLE ROW.

    //     // ADD JSON DATA TO THE TABLE AS ROWS.
    //     for (let i = 1; i < data.length; i++) {

    //         tr = table.insertRow(-1);

    //         for (let j = 0; j < 1; j++) {
    //             let tabCell = tr.insertCell(-1);
    //             tabCell.innerHTML = data[i][''];
    //         }
    //     }

    //     // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    //     let divContainer = document.getElementById("showData");
    //     divContainer.innerHTML = "";
    //     divContainer.appendChild(table);
    // } else {

    //     // ADD JSON DATA TO THE TABLE AS ROWS.
    //     for (let i = 0; i < data.length; i++) {

    //         let tr = table.insertRow();

    //         for (let j = 0; j < 1; j++) {
    //             let tabCell = tr.insertCell(-1);
    //             tabCell.innerHTML = data[i][''];
    //         }
    //     }
    // }
    let select = document.querySelector("#showData select");

        // CREATE DYNAMIC SELECT.
        select = document.createElement("select");
        select.setAttribute('id', 'selName');

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        
        // ADD JSON DATA TO THE TABLE AS ROWS.
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
        divContainer.appendChild(select);
}

let datas = [];

let grade = document.querySelector('#gradeSel');
grade.addEventListener('change', () => {
    let div = document.querySelector('#showData');
    div.innerHTML = '';
    datas = [];
    query(`SELECT * WHERE A != 'null' ORDER BY A ASC`, grade.value, 'my_callback');
});
