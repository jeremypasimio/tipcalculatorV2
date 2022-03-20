  'use strict'

  let form = document.getElementById('addStoreForm')

   form.addEventListener('submit', function(event) {
     if (!form.checkValidity()) {
       event.preventDefault()
       event.stopPropagation()
     }

     form.classList.add('was-validated')
   }, false)

   $("#submitBtn").click(function(){

   });
