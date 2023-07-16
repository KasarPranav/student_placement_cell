const link = $('.update-link');

$(link).on('click',handleLinkEvent);


function handleLinkEvent(event){
    event.preventDefault();
    const resultId = $(event.currentTarget).attr("data-id");;
    // console.log(resultId);
    const result = $(`#inlineRadio1-${resultId}:checked`).val();
    // console.log(radioButton);
    $.ajax({
        type: 'POST',
        url: '/interview/update-results',
        dataType: 'json',
        data: {
            resultId: resultId,
            result: result
        },
        success: (res)=>{
            const updateTable = $(`#result-${res.result._id}`);
            $(updateTable).text(result);
        },
        error: (error)=>{
            console.log("Error While updating result: ", error)
        },
        timeout: 3000
    })
}