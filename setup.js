
(function() {

  // INPUT ELEMENTS
  let myinput_A;
  let myinput_r;
  let myinput_n;
  let myinput_y;

  // BASIC OUTPUTS
  let myoutput_t;
  let myoutput_pmt;
  let myoutput_total_interest;
  let myoutput_total_payments;
  let myoutput_total_interest_over_total_payments;
  
  let values, table_data, table;

  window.addEventListener('load', function() {

    // INPUT ELEMENTS
    myinput_A = document.getElementById('myinput_A');
    myinput_r = document.getElementById('myinput_r');
    myinput_n = document.getElementById('myinput_n');
    myinput_y = document.getElementById('myinput_y');

    // BASIC OUTPUTS
    myoutput_t = document.getElementById('myoutput_t');
    myoutput_pmt = document.getElementById('myoutput_pmt');
    myoutput_total_interest = document.getElementById('myoutput_total_interest');
    myoutput_total_payments = document.getElementById('myoutput_total_payments');
    myoutput_total_interest_over_total_payments = document.getElementById('myoutput_total_interest_over_total_payments');
    
    values = UPDATE_VALUES();
    table_data = UPDATE_TABLE_DATA(values);
    table = UPDATE_TABLE(table_data.arr);
    
    // UPDATE TOTAL INTEREST PAID
    myoutput_total_interest.value = table_data.total_interest.toFixed(2);
    myoutput_total_payments.value = table_data.total_payments.toFixed(2);
    myoutput_total_interest_over_total_payments.value = table_data.total_interest_over_total_payments.toFixed(4);
    
    output_table_container.innerHTML = ''; 
    output_table_container.appendChild(table);
    
    console.log(values);
    console.log(table_data);
    
    [myinput_A, myinput_r, myinput_n, myinput_y].forEach(function(el, b, c) {
    
      el.addEventListener('input', function() {
      
        values = UPDATE_VALUES();
        table_data = UPDATE_TABLE_DATA(values);
        table = UPDATE_TABLE(table_data.arr);
        
        // UPDATE TOTAL INTEREST PAID
        myoutput_total_interest.value = table_data.total_interest.toFixed(2);
        myoutput_total_payments.value = table_data.total_payments.toFixed(2);
        myoutput_total_interest_over_total_payments.value = table_data.total_interest_over_total_payments.toFixed(4);
        
        output_table_container.innerHTML = ''; 
        output_table_container.appendChild(table);
        
        console.log(values);
        console.log(table_data);
    
      });
      
    
    
    });
    
    
    
  });

  function UPDATE_VALUES() {
   
    // INPUTS
    let A = parseFloat(myinput_A.value);
    let r = parseFloat(myinput_r.value);
    let n = parseFloat(myinput_n.value);
    let y = parseFloat(myinput_y.value);
    
    // OUTPUTS
    let t = n*y;
    let x1 = (1 + r/n) ** t;
    let x2 = A*(r/n)*x1;
    let x3 = x1 - 1;
    let x = x2 / x3;
   
    let obj = {
      'A': A,
      'r': r,
      'n': n,
      'y': y,
      't': n*y,
      'x1': x1,
      'x2': x2,
      'x3': x3,
      'x': x
    };
   
    // INPUT ELEMENTS
    myinput_A.value = A.toFixed(0);
    myinput_r.value = r.toFixed(3);
    myinput_n.value = n.toFixed(0);
    myinput_y.value = y.toFixed(0);
    
    // OUTPUT ELEMENTS
    myoutput_t.value = t.toFixed(0);
    myoutput_pmt.value = x.toFixed(2);
   
    return obj;
  };
  
  function UPDATE_TABLE_DATA(values) {
  
    let obj = {
      'total_interest':0,
      'total_payments':0,
      'total_interest_over_total_payments':0,
      'arr':[],
      'arr2':[]
    };
    
    // by period
    let arr = [];
    
    // by year
    let arr2 = [];
    
    let opening = values.A;
    let interest;
    let payment = values.x;
    let closing;
    
    
    for (let t = 0; t < values.t; t++) {
    
      interest = opening * values.r / values.n;
      closing = opening + interest - payment;

      let year = Math.floor(t/values.n);

      obj.arr.push({
        't':t,
        'year':year,
        'opening': opening,
        'interest': interest,
        'payment': payment,
        'closing': closing
      });
      
      if (t%values.n === 0) {
        obj.arr2.push({
          't_first':t,
          't_last':0,
          'year':year,
          'opening': opening,
          'interest': interest,
          'payment': payment,
          'closing': closing
        });
      };
      
      if (t%values.n !== 0) {
        obj.arr2[obj.arr2.length-1].interest += interest;
        obj.arr2[obj.arr2.length-1].payment += payment;
      };
      
      if ((t+1)%values.n == 0) {
        obj.arr2[obj.arr2.length-1].t_last = t; 
        obj.arr2[obj.arr2.length-1].closing = closing;
      };  
      
      opening = closing;
      
      obj.total_interest += interest;
      obj.total_payments += payment;
      
    }
  
    obj.total_interest_over_total_payments = obj.total_interest / obj.total_payments;
    
    return obj;
  };
  
  function UPDATE_TABLE(table_data) {

    let table = document.createElement('table');
    table.classList.add('mytables');
  
    let header_row = document.createElement('tr');
    table.appendChild(header_row);
    
    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'year';
      header_row.appendChild(td);
    })();
    
    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'period';
      header_row.appendChild(td);
    })();
    
    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'opening';
      header_row.appendChild(td);
    })();

    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'interest';
      header_row.appendChild(td);
    })();

    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'payment';
      header_row.appendChild(td);
    })();

    (function() {
      let td = document.createElement('td');
      td.innerHTML = 'closing';
      header_row.appendChild(td);
    })();
    
    // CONTENT
    for (let t = 0; t < table_data.length; t++) {
      
      let row = document.createElement('tr');
      table.appendChild(row);
      
      (function() {
        let td = document.createElement('td');
        td.innerHTML = table_data[t].year + 1;
        row.appendChild(td);
      })();
      
      (function() {
        let td = document.createElement('td');
        td.innerHTML = table_data[t].t + 1;
        row.appendChild(td);
      })();
      
      (function() {
        let td = document.createElement('td');
        td.style.textAlign = 'RIGHT';
        td.innerHTML = numberWithCommas(table_data[t].opening.toFixed(0));
        row.appendChild(td);
      })();
      
      (function() {
        let td = document.createElement('td');
        td.style.textAlign = 'RIGHT';
        td.innerHTML = numberWithCommas(table_data[t].interest.toFixed(0));
        row.appendChild(td);
      })();
      
      (function() {
        let td = document.createElement('td');
        td.style.textAlign = 'RIGHT';
        td.innerHTML = numberWithCommas(table_data[t].payment.toFixed(0));
        row.appendChild(td);
      })();
      
      (function() {
        let td = document.createElement('td');
        td.style.textAlign = 'RIGHT';
        td.innerHTML = numberWithCommas(table_data[t].closing.toFixed(0));
        row.appendChild(td);
      })();
    }

    return table;
  };

})();

// stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}