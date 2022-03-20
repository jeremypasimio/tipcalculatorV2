'use strict'

$(document).ready(function() {
  let url = '/partnerentry/' + sessionStorage.getItem("storeNum");
  $('#backToPartnerEntry').attr('href', url);
  let submitUrl = '/deletepartner/' + sessionStorage.getItem("storeNum");
  $('#deletePartnerForm').attr('action', submitUrl);
});
