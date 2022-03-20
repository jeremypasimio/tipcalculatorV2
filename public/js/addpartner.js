  'use strict'

  $(document).ready(function() {
    let url = '/partnerentry/' + sessionStorage.getItem("storeNum");
    $('#backToPartnerEntry').attr('href', url);
    $('#storeNumHidden').val(sessionStorage.getItem("storeNum"));

    let borrowedPartner = JSON.parse($("#borrowedPartnerHiddenField").text());
    let savedBorrowedPartnerList = sessionStorage.getItem("borrowedPartnerList");
    const isEmpty = Object.keys(borrowedPartner).length === 0;

    if (savedBorrowedPartnerList === null && !isEmpty) {
      let borrowedPartnerList = [];
      borrowedPartnerList.push(borrowedPartner);
      sessionStorage.setItem("borrowedPartnerList", JSON.stringify(borrowedPartnerList));
    } else {
      if (!isEmpty) {
        let borrowedPartnerList = JSON.parse(savedBorrowedPartnerList);
        borrowedPartnerList.push(borrowedPartner);
        sessionStorage.setItem("borrowedPartnerList", JSON.stringify(borrowedPartnerList));
      } else{
        console.log("no item");
      }
    }
  });


  //event listener for form validation
  let form = document.getElementById('addPartnerForm')

  form.addEventListener('submit', function(event) {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    form.classList.add('was-validated')
  }, false)
