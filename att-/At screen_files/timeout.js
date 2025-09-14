;(function ( HaloCTimeout, undefined ) {

  var timeoutMs = 600000;
  var redirectUrl = '';

  function getTimeoutParams() {
    try {
      var timeoutMsFromPage = timeoutJspVars.timeoutMs;
      if (timeoutMsFromPage) {
        timeoutMs = timeoutMsFromPage;
      }
    } catch (e) {
      // Do nothing
    }

    try {
      var redirectUrlFromPage = timeoutJspVars.redirectUrl;
      if (redirectUrlFromPage) {
        redirectUrl = redirectUrlFromPage;
      }
    } catch (e) {
      // Do nothing
    }
  }

  function startTimeoutCounter() {
    if (timeoutMs <= 0) {
      navigateToTimeoutPage();
    } else {
      setTimeout(function() {
        navigateToTimeoutPage();
      }, timeoutMs);
    }
  }

  function navigateToTimeoutPage() {
    window.location.href = redirectUrl;
  }

  (function(){
    try {
      getTimeoutParams();
      if (redirectUrl != null && redirectUrl !== '') {
        startTimeoutCounter();
      }
    } catch (e) {
      console.error('Timeout Error', e);
    }
  })();


})(window.HaloCTimeout = window.HaloCTimeout || {});
