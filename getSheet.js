var jsonp = function (url) {
    var script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function () {
        alert('Can not access JSONP file.')
    };
    var done = false;
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

var parse = function (data) {
    console.log(data)
    var column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length) {
        return false;
    }
    var columns = [],
        result = [],
        row_length,
        value;
    for (var column_idx in data.table.cols) {
        columns.push(data.table.cols[column_idx].label);
    }
    for (var rows_idx in data.table.rows) {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length) {
            return false;
        }
        for (var row_idx in data.table.rows[rows_idx]['c']) {
            if (!result[rows_idx]) {
                result[rows_idx] = {};
            }
            console.log(data.table.rows[rows_idx]['c'][row_idx].v)
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

var query = function (sql, sheetName, callback) {
    var myKey = '1kbBoHLU2-xbc4ZwM12dSEJAEivMfWnOYQNPx_yFHAxM';
    var url = `https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?`,
        params = {
            tq: encodeURIComponent(sql),
            sheet: encodeURIComponent(sheetName),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params) {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    console.log(url, '|end|')
    return jsonp(url); // Call JSONP helper function
}

var my_callback = function (data) {
    data = parse(data); // Call data parser helper function
  
    //AND THEN WHATEVER YOU WANT 
    for(var i = 0 ; i < datas.length; i++){
        if(JSON.stringify(datas[i]) == JSON.stringify(data)) {
            return false;
        }
    }
    
    datas.push(data);

    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            console.log(col.indexOf(key))
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.querySelector("#showData table");
    if (table === null || table == undefined) {
        // CREATE DYNAMIC TABLE.
        table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        var tr = table.insertRow(-1); // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th"); // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData8");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    } else {

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {

            var tr = table.insertRow();

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
        }
    }

}

var datas = [];

$('#search-8-btn').click(function(){
    $('#showData8').html('');
    datas = [];

    query(`SELECT * WHERE A != 'null' ORDER BY A ASC`, '8기', 'my_callback');

});