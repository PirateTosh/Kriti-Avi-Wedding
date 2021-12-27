import $ from 'jquery';
export function setComponentHeight() {
  setTimeout(function () {
    let bodyHeight = $('body').height()
    let htmlHeight = $('html').height()
    if (bodyHeight > htmlHeight) {
      $('html').height($('body').height());
    }
    else {
      $('body').height($('html').height());
    }
  }, 2000);
}