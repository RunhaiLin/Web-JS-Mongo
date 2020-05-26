// TODO: add client side code for single page application
function main() {

    const url1 = "http://localhost:3000/api/reviews";
    const addbtn = document.querySelector("#addBtn");
    const filterbtn = document.querySelector("#filterBtn");
    const table_body = document.querySelector('tbody');


    const req = new XMLHttpRequest();
    req.open('GET',url1,true);

    function addtable(reviewarr){
        
        //console.log(table_body);
        reviewarr.forEach(ele => {
            const table_new_row = document.createElement('tr');
            
            const table_new_row_name = document.createElement('td');
            table_new_row_name.textContent = ele['name'];
            const table_new_row_semester = document.createElement('td');
            table_new_row_semester.textContent = ele['semester'];
            const table_new_row_year = document.createElement('td');
            table_new_row_year.textContent = ele['year'];
            const table_new_row_review = document.createElement('td');
            table_new_row_review.textContent = ele['review'];

            table_new_row.appendChild(table_new_row_name);
            table_new_row.appendChild(table_new_row_semester);
            table_new_row.appendChild(table_new_row_year);
            table_new_row.appendChild(table_new_row_review);
            table_body.appendChild(table_new_row);
            
        });
    }

    req.addEventListener('load',function(){

        if (req.status>=200 && req.status<400){
            
            const reviewarr = JSON.parse(req.responseText);
            //console.log(reviewarr)
            addtable(reviewarr);

        }   
        
    })

    req.addEventListener('error', function(e) {
        document.body.appendChild(document.createTextNode('A mistake has been made ' + e));
    });
    
    req.send();

    addbtn.addEventListener('click',function(evt){
        evt.preventDefault();
        table_body.innerText = "";
        const req_add = new XMLHttpRequest();
        const url_add = "http://localhost:3000/api/review/create";
        req_add.open('POST',url_add,true);

        req_add.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        console.log("HHhhhhhhhhhhh");

        const namevalue = document.querySelector("#name").value;
        const semestervalue = document.querySelector("#semester").value;
        const yearvalue = document.querySelector("#year").value;
        const reviewvalue = document.querySelector("#review").value;

        req_add.addEventListener('load',function(){
            if (req_add.status>=200 && req_add.status<400){
            
                const reviewarr = JSON.parse(req_add.responseText);
                document.querySelector('#filterSemester').value = "";
                document.querySelector('#filterYear').value = "";
                addtable(reviewarr);
    
            }   
        });

        req_add.addEventListener('error',function(e){
            document.body.appendChild(document.createTextNode('A mistake has been made ' + e));
        });

        req_add.send('name='+namevalue+'&semester='+semestervalue+'&year='+yearvalue+'&review='+reviewvalue);
        


    })

    filterbtn.addEventListener('click',function(evt){

        evt.preventDefault();
        table_body.innerText = "";
        const filtersemvalue = document.querySelector('#filterSemester').value;
        // console.log("filtersemvalue");
        // console.log(filtersemvalue);

        const filteryevalue = document.querySelector('#filterYear').value;
        // console.log("filteryevalue");
        // console.log(filteryevalue);

        const req_new = new XMLHttpRequest();
        const url_new = "http://localhost:3000/api/reviews"+"?semester="+filtersemvalue+"&year="+filteryevalue;
        req_new.open('GET',url_new,true);

        req_new.addEventListener('load',function(){

            if (req_new.status>=200 && req_new.status<400){
                
                const reviewarr = JSON.parse(req_new.responseText);
                addtable(reviewarr);
    
            }   
            
        })
    
        req_new.addEventListener('error', function(e) {
            document.body.appendChild(document.createTextNode('A mistake has been made ' + e));
        });

        req_new.send();




    })

    
}

document.addEventListener("DOMContentLoaded", main);
