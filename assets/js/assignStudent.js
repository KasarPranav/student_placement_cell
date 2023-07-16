const batchOption = $('#batch option:selected');
const batch = $('#batch')
let selectBatch = async function(req,res){
         console.log("****", soval(batch));
        if(soval(batch)){
            let data = await fetch(`http://localhost:3000/students/getStudentByBatchName/${soval(batch)}`);
            let studentData =  await data.json();
            const studentSelection = `<div id="select-student" class="col-md-4 ms-4">
                                        <label for="student"><h5>Student</h5></label>
                                        <select id="student" name="studentId" required class="form-select" aria-label="Default select example">
                                        <option value="">---Select Student---</option>
                                        </select>
                                    </div>`
        // console.log($('#select-student'));
        if($('#select-student').length==0){
            $('#assign-students-input').append($(studentSelection));
        }
        let options = studentData.studentData.map((item)=>{
            return `<option value=${item._id}>${item.firstName+' '+item.lastName}</option>`;
        })
        $('#student').html([`<option value="">---Select Student---</option>`,options]);   
    }else{
        $('#select-student').remove()
    }
}
function soval(a) {
    return $('option:selected', a).val();
}
function sotext(a) {
    return $('option:selected', a).text();
}

batch.on('click', selectBatch);
