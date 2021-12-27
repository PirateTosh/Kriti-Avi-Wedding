
import React from 'react';
import $ from 'jquery';
import {browserHistory} from "react-router";
export function confirmBox() { 
    var $content =  "<div class='dialog-ovelay'>" +
                 "<div class='dialog-msg appGradientColor'>" +
                     " <p> " + "Oops, it looks like you're offline. Please connect to the internet and try again." + " </p> " +
                     "<footer>" +
                         "<div class='controls'>" +
                             " <button class='button button-danger doAction alertBtn'>" + "OK" + "</button> " 
                         "</div>" +
                     "</footer>" +
                 "</div>" +
              "</div>" +
            "</div>";
     $('body').prepend($content);
  $('.doAction').click(function () {
    $(this).parents('.dialog-ovelay').fadeOut(10, function () {
        $(this).remove();
      });
    browserHistory.push("/menus");
  });
  
}