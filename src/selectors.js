import get from "lodash/get";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";

export const getLoggedInUserDetails = (state) => {
  return get(state, "loginReducer.guestDetails");
};
export const getGuestId = (state) => {
  return get(state, "loginReducer.guestDetails._id");
};

export const getGuestFirstName = (state) => {
  return get(state, "loginReducer.guestDetails.guestFirstName");
};

export const getGuestAddressing = (state) => {
  let guestAddressing = get(state, "loginReducer.guestDetails.guestAddressing");
  let guestFirstName = get(state, "loginReducer.guestDetails.guestFirstName");
  if(typeof guestAddressing !== 'undefined'){
    return guestAddressing;
  } else {
    return guestFirstName;
  }
};

export const getGuestLastName = (state) => {
  return get(state, "loginReducer.guestDetails.guestLastName");
};
export const getEventId = (state) => {
  return get(state, "loginReducer.guestDetails.eventId");
};
export const getEventName = (state) => {
  return get(state, "loginReducer.EventName");
};
export const getPopupdata = (state) => {
  return get(state, "popupReducer");
};
export const getWelcomeDetails = (state) => {
  return get(state, "welcomeReducer.welcomeScreenDetails");
};
export const getDestinationDetails = (state) => {
  return get(state, "welcomeReducer.welcomeScreenDetails.destinationDetails");
};
export const getDestinations = (state) => {
  let destination = map(getDestinationDetails(state), data => {
    return {
      destinationId: data.destinationId,
      destinationName: data.basicInfo.destinationName
    };
  });
  return destination;
};

export const getContactDetails = (state) => {
  let contactTitle = get(getWelcomeDetails(state), "contactTitle");
  let contactItems = get(state, "welcomeReducer.welcomeScreenDetails.contactItems");
  return {
    contactTitle: contactTitle,
    contactItems: contactItems
  }
};

export const getEventDetails = (state) => {
  return get(state, "eventReducer.eventDetails");
};

export const getRsvpDetails = (state) => {
  return get(state, "rsvpReducer.rsvpDetails")
}

export const getEventByDate = (state) => {
  let eventDetails = getEventDetails(state);
  let data = [];
  let uniqueEvents = eventDetails && eventDetails.reduce((data, e1) => {
    let matches = data.filter((e2) => {
      return e1.subEventDate === e2.subEventDate;
    });
    if (matches.length === 0)
      data.push(e1);
    return data;
  }, []);
  return uniqueEvents;
};

export const getItineraryDetails = (state) => {
  return get(state, "welcomeReducer.welcomeScreenDetails.itineraryList");
};

export const getItineraries = (state) => {
  let details = cloneDeep(getItineraryDetails(state));
  var guestData = (JSON.parse(localStorage.getItem('currentGuest')));
  var invitedSubevents = [];
  (guestData.inviteStatus).map(subevent => {
    if (subevent.status) {
      invitedSubevents.push(subevent.subEventId);
    }
  });
  if (details) {
    details.map(function (detail, index) {
      if (typeof detail.subEventId != 'undefined' && detail.subEventId && detail.subEventId != 'common' && invitedSubevents.indexOf(detail.subEventId) == -1) {
        delete details[index];
      }
    });
  }
  let data = [];
  let result = details && details.reduce((data, e1) => {
    let matches = data.filter((e2) => {
      return e1.date === e2.date;
    });
    if (matches.length === 0)
      data.push(e1);
    return data;
  }, []);
  return result;
};

export const getGuestInformation = (state) => {
  return get(state, "guestInformationReducer.guestInformation");
};
export const getGuestLoggedIn = (state) => {
  return get(state, "guestInformationReducer.guestLoggedIn");
};

export const getGuestFamily = (state) => {
  let guestFamily = map(getGuestInformation(state), data => {
    return {
      guestId: data._id,
      guestName: data.guestFirstName,
      ...data
    };
  });
  return guestFamily;
};

export const fetchGender = () => {
  return [
    {
      id: "Mr",
      name: "Mr"
    }, {
      id: "Ms",
      name: "Ms"
    }, {
      id: "Mrs",
      name: "Mrs"
    }
    , {
      id: "Dr",
      name: "Dr"
    }
  ]
};
export const fetchGenderOption = () => {
  return [
    {
      id: "male",
      name: "Male"
    }, {
      id: "female",
      name: "Female"
    }, {
      id: "child",
      name: "Child"
    }


  ]
};

export const fetchCountry = () => {
  return [
    {
      id: "India",
      name: "India"
    }, {
      id: "Afghanistan",
      name: "Afghanistan"
    }, {
      id: "Albania",
      name: "Albania"
    }, {
      id: "Algeria",
      name: "Algeria"
    }, {
      id: "Andorra",
      name: "Andorra"
    }, {
      id: "Angola",
      name: "Angola"
    }, {
      id: "Antigua and Barbuda",
      name: "Antigua and Barbuda"
    }, {
      id: "Argentina",
      name: "Argentina"
    }, {
      id: "Armenia",
      name: "Armenia"
    }, {
      id: "Aruba",
      name: "Aruba"
    }, {
      id: "Australia",
      name: "Australia"
    }, {
      id: "Austria",
      name: "Austria"
    }, {
      id: "Azerbaijan",
      name: "Azerbaijan"
    }, {
      id: "Bahamas",
      name: "Bahamas"
    }, {
      id: "Bahrain",
      name: "Bahrain"
    }, {
      id: "Bangladesh",
      name: "Bangladesh"
    }, {
      id: "Barbados",
      name: "Barbados"
    }, {
      id: "Belarus",
      name: "Belarus"
    }, {
      id: "Belgium",
      name: "Belgium"
    }, {
      id: "Belize",
      name: "Belize"
    }, {
      id: "Benin",
      name: "Benin"
    }, {
      id: "Bhutan",
      name: "Bhutan"
    }, {
      id: "Bolivia",
      name: "Bolivia"
    }, {
      id: "Bosnia and Herzegovina",
      name: "Bosnia and Herzegovina"
    }, {
      id: "Botswana",
      name: "Botswana"
    }, {
      id: "Brazil",
      name: "Brazil"

    }, {
      id: "Brunei",
      name: "Brunei"

    }, {
      id: "Bulgaria",
      name: "Bulgaria"

    }, {
      id: "Burkina Faso",
      name: "Burkina Faso"

    }, {
      id: "Burma",
      name: "Burma"

    }, {
      id: "Burundi",
      name: "Burundi"

    }, {
      id: "Cambodia",
      name: "Cambodia"

    }, {
      id: "Cameroon",
      name: "Cameroon"

    }, {
      id: "Canada",
      name: "Canada"

    }, {
      id: "Cape Verde",
      name: "Cape Verde"

    }, {
      id: "Central African Republic",
      name: "Central African Republic"

    }, {
      id: "Chad",
      name: "Chad"

    }, {
      id: "Chile",
      name: "Chile"

    }, {
      id: "China",
      name: "China"

    }, {
      id: "Colombia",
      name: "Colombia"

    }, {
      id: "Comoros",
      name: "Comoros"

    }, {
      id: "Congo, Democratic Republic of the",
      name: "Congo, Democratic Republic of the"

    }, {
      id: "Congo, Republic of the",
      name: "Congo, Republic of the"

    }, {
      id: "Costa Rica",
      name: "Costa Rica"

    }, {
      id: "Cote d'Ivoire",
      name: "Cote d'Ivoire"

    }, {
      id: "Croatia",
      name: "Croatia"

    }, {
      id: "Curacao",
      name: "Curacao"

    }, {
      id: "Cyprus",
      name: "Cyprus"

    }, {
      id: "Czech Republic",
      name: "Czech Republic"

    }, {
      id: "Denmark",
      name: "Denmark"

    }, {
      id: "Djibouti",
      name: "Djibouti"

    }, {
      id: "Dominica",
      name: "Dominica"

    }, {
      id: "Dominican Republic",
      name: "Dominican Republic"

    }, {
      id: "East Timor (see Timor-Leste)",
      name: "East Timor (see Timor-Leste)"

    }, {
      id: "Ecuador",
      name: "Ecuador"

    }, {
      id: "Egypt",
      name: "Egypt"

    }, {
      id: "El Salvador",
      name: "El Salvador"

    }, {
      id: "Equatorial Guinea",
      name: "Equatorial Guinea"

    }, {
      id: "Eritrea",
      name: "Eritrea"

    }, {
      id: "Estonia",
      name: "Estonia"

    }, {
      id: "Ethiopia",
      name: "Ethiopia"

    }, {
      id: "Fiji",
      name: "Fiji"

    }, {
      id: "Finland",
      name: "Finland"

    }, {
      id: "France",
      name: "France"

    }, {
      id: "Gabon",
      name: "Gabon"

    }, {
      id: "Gambia",
      name: "Gambia"

    }, {
      id: "Georgia",
      name: "Georgia"

    }, {
      id: "Germany",
      name: "Germany"

    }, {
      id: "Ghana",
      name: "Ghana"

    }, {
      id: "Greece",
      name: "Greece"

    }, {
      id: "Grenada",
      name: "Grenada"

    }, {
      id: "Guatemala",
      name: "Guatemala"

    }, {
      id: "Guinea",
      name: "Guinea"

    }, {
      id: "Guinea-Bissau",
      name: "Guinea-Bissau"

    }, {
      id: "Guyana",
      name: "Guyana"

    }, {
      id: "Haiti",
      name: "Haiti"

    }, {
      id: "Holy See",
      name: "Holy See"

    }, {
      id: "Honduras",
      name: "Honduras"

    }, {
      id: "Hong Kong",
      name: "Hong Kong"

    }, {
      id: "Hungary",
      name: "Hungary"

    }, {
      id: "Iceland",
      name: "Iceland"

    }, {
      id: "Indonesia",
      name: "Indonesia"

    }, {
      id: "Iran",
      name: "Iran"

    }, {
      id: "Iraq",
      name: "Iraq"

    }, {
      id: "Ireland",
      name: "Ireland"

    }, {
      id: "Israel",
      name: "Israel"

    }, {
      id: "Italy",
      name: "Italy"

    }, {
      id: "Jamaica",
      name: "Jamaica"

    }, {
      id: "Japan",
      name: "Japan"

    }, {
      id: "Jordan",
      name: "Jordan"

    }, {
      id: "Kazakhstan",
      name: "Kazakhstan"

    }, {
      id: "Kenya",
      name: "Kenya"

    }, {
      id: "Kiribati",
      name: "Kiribati"

    }, {
      id: "Korea, North",
      name: "Korea, North"

    }, {
      id: "Korea, South",
      name: "Korea, South"

    }, {
      id: "Kosovo",
      name: "Kosovo"

    }, {
      id: "Kuwait",
      name: "Kuwait"

    }, {
      id: "Kyrgyzstan",
      name: "Kyrgyzstan"

    }, {
      id: "Laos",
      name: "Laos"

    }, {
      id: "Latvia",
      name: "Latvia"

    }, {
      id: "Lebanon",
      name: "Lebanon"

    }, {
      id: "Lesotho",
      name: "Lesotho"

    }, {
      id: "Liberia",
      name: "Liberia"

    }, {
      id: "Libya",
      name: "Libya"

    }, {
      id: "Liechtenstein",
      name: "Liechtenstein"

    }, {
      id: "Lithuania",
      name: "Lithuania"

    }, {
      id: "Luxembourg",
      name: "Luxembourg"

    }, {
      id: "Macau",
      name: "Macau"

    }, {
      id: "Macedonia",
      name: "Macedonia"

    }, {
      id: "Madagascar",
      name: "Madagascar"

    }, {
      id: "Malawi",
      name: "Malawi"

    }, {
      id: "Malaysia",
      name: "Malaysia"

    }, {
      id: "Maldives",
      name: "Maldives"

    }, {
      id: "Mali",
      name: "Mali"

    }, {
      id: "Malta",
      name: "Malta"

    }, {
      id: "Marshall Islands",
      name: "Marshall Islands"

    }, {
      id: "Mauritania",
      name: "Mauritania"

    }, {
      id: "Mauritius",
      name: "Mauritius"

    }, {
      id: "Mexico",
      name: "Mexico"

    }, {
      id: "Micronesia",
      name: "Micronesia"


    }, {
      id: "Moldova",
      name: "Moldova"


    }, {
      id: "Monaco",
      name: "Monaco"

    }, {
      id: "Mongolia",
      name: "Mongolia"

    }, {
      id: "Montenegro",
      name: "Montenegro"

    }, {
      id: "Morocco",
      name: "Morocco"

    }, {
      id: "Mozambique",
      name: "Mozambique"

    }, {
      id: "Namibia",
      name: "Namibia"

    }, {
      id: "Nauru",
      name: "Nauru"
    }, {
      id: "Nepal",
      name: "Nepal"


    }, {
      id: "Netherlands",
      name: "Netherlands"

    }, {
      id: "Netherlands Antilles",
      name: "Netherlands Antilles"

    }, {
      id: "New Zealand",
      name: "New Zealand"

    }, {
      id: "Nicaragua",
      name: "Nicaragua"

    }, {
      id: "Niger",
      name: "Niger"

    }, {
      id: "Nigeria",
      name: "Nigeria"

    }, {
      id: "North Korea",
      name: "North Korea"

    }, {
      id: "Norway",
      name: "Norway"

    }, {
      id: "Oman",
      name: "Oman"

    }, {
      id: "Pakistan",
      name: "Pakistan"

    }, {
      id: "Palau",
      name: "Palau"

    }, {
      id: "Palestinian Territories",
      name: "Palestinian Territories"

    }, {
      id: "Panama",
      name: "Panama"

    }, {
      id: "Papua New Guinea",
      name: "Papua New Guinea"

    }, {
      id: "Paraguay",
      name: ""

    }, {
      id: "Peru",
      name: "Peru"


    }, {
      id: "Philippines",
      name: "Philippines"



    }, {
      id: "Poland",
      name: "Poland"

    }, {
      id: "Portugal",
      name: "Portugal"

    }, {
      id: "Qatar",
      name: "Qatar"

    }, {
      id: "Romania",
      name: "Romania"

    }, {
      id: "Russia",
      name: "Russia"

    }, {
      id: "Rwanda",
      name: "Rwanda"

    }, {
      id: "Saint Kitts and Nevis",
      name: "Saint Kitts and Nevis"

    }, {
      id: "Saint Lucia",
      name: "Saint Lucia"

    }, {
      id: "Saint Vincent and the Grenadines",
      name: "Saint Vincent and the Grenadines"


    }, {
      id: "Samoa",
      name: "Samoa"

    }, {
      id: "San Marino",
      name: "San Marino"
    }, {
      id: "Sao Tome and Principe",
      name: "Sao Tome and Principe"

    }, {
      id: "Saudi Arabia",
      name: "Saudi Arabia"


    }, {
      id: "Senegal",
      name: "Senegal"

    }, {
      id: "Serbia",
      name: "Serbia"

    }, {
      id: "Seychelles",
      name: "Seychelles"

    }, {
      id: "Sierra Leone",
      name: "Sierra Leone"

    }, {
      id: "Singapore",
      name: "Singapore"


    }, {
      id: "Sint Maarten",
      name: "Sint Maarten"
    }, {
      id: "Slovakia",
      name: "Slovakia"

    }, {
      id: "Slovenia",
      name: "Slovenia"


    }, {
      id: "Solomon Islands",
      name: "Solomon Islands"
    }, {
      id: "Somalia",
      name: "Somalia"


    }, {
      id: "South Africa",
      name: "South Africa"

    }, {
      id: "South Korea",
      name: "South Korea"

    }, {
      id: "South Sudan",
      name: "South Sudan"

    }, {
      id: "Spain",
      name: "Spain"

    }, {
      id: "Sri Lanka",
      name: "Sri Lanka"

    }, {
      id: "Sudan",
      name: "Sudan"

    }, {
      id: "Suriname",
      name: "Suriname"

    }, {
      id: "Swaziland",
      name: "Swaziland"

    }, {
      id: "Sweden",
      name: "Sweden"

    }, {
      id: "Switzerland",
      name: "Switzerland"

    }, {
      id: "Syria",
      name: "Syria"

    }, {
      id: "Taiwan",
      name: "Taiwan"

    }, {
      id: "Tajikistan",
      name: "Tajikistan"

    }, {
      id: "Tanzania",
      name: "Tanzania"

    }, {
      id: "Thailand",
      name: "Thailand"

    }, {
      id: "Timor-Leste",
      name: "Timor-Leste"

    }, {
      id: "Togo",
      name: "Togo"

    }, {
      id: "Tonga",
      name: "Tonga"

    }, {
      id: "Trinidad and Tobago",
      name: "Trinidad and Tobago"

    }, {
      id: "Tunisia",
      name: "Tunisia"

    }, {
      id: "Turkey",
      name: "Turkey"

    }, {
      id: "Turkmenistan",
      name: "Turkmenistan"

    }, {
      id: "Tuvalu",
      name: "Tuvalu"

    }, {
      id: "Uganda",
      name: "Uganda"

    }, {
      id: "Ukraine",
      name: "Ukraine"

    }, {
      id: "United Arab Emirates",
      name: "United Arab Emirates"

    }, {
      id: "United Kingdom",
      name: "United Kingdom"

    }, {
      id: "United States",
      name: "United States"

    }, {
      id: "Uruguay",
      name: "Uruguay"

    }, {
      id: "Uzbekistan",
      name: "Uzbekistan"

    }, {
      id: "Vanuatu",
      name: "Vanuatu"

    }, {
      id: "Venezuela",
      name: "Venezuela"

    }, {
      id: "Vietnam",
      name: "Vietnam"

    }, {
      id: "Yemen",
      name: "Yemen"

    }, {
      id: "Zambia",
      name: "Zambia"

    }, {
      id: "Zimbabwe",
      name: "Zimbabwe"

    }
  ]
};

export const passportDetailsAvailableOption = () => {
  return [
    {
      id: 1,
      name: "YES"
    }, {
      id: 0,
      name: "NO"
    }
  ]
};
export const getNearestAirportList = (state) => {
  return get(state, "guestInformationReducer.nearestAirportList");
};
export function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "IOS";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  return null;
}

export const getAppDetails = (state) => {
  return get(state, "appConfigReducer.appDetails");
};

export const getGuestPreference = (state) => {
  return get(state, "guestInformationReducer.guestPreference");
};

export const getservicePreference = (state) => {
  return get(state, "guestInformationReducer.servicePreference");
};
export const getEventSummary = (state) => {
  return get(state, "mySummaryReducer.eventSummary");
};
export const getGuestSummaryFamily = (state) => {
  let guestSummaryFamily = map(getEventSummary(state), data => {
    return {
      guestId: data._id,
      guestName: data.name
    };
  });
  return guestSummaryFamily;
};

export const getChatGuests = (state) => {
  return get(state, "myChatReducer.chatGuests");
};

export const getChatMessages = (state) => {
  return get(state, "myChatReducer.chatMessages");
};

// My Information section
export const getGuestInfoDetails = (state) => {
  let visaQuestion = get(state, "welcomeReducer.welcomeScreenDetails.visaQuestion");
  let photoIDQuestion = get(state, "welcomeReducer.welcomeScreenDetails.passportQuestion");
  let guestInfoOptions = get(state, "appConfigReducer.appDetails.appDetails.selectedAppGuestInfo");
  // return (visaQustion, photoIDQuestion, guestInfoOptions);
  return {
    visaQuestion : visaQuestion,
    photoIDQuestion : photoIDQuestion,
    guestInfoOptions : guestInfoOptions
  }
}

export const getAirportList = (state) => {
  return get(state, 'flightReducer.airportList')
}

export const getAirlineList = (state) => {
  return get(state, 'flightReducer.airlineList')
}

export const getGuestFlights = (state) => {
  return get(state, 'flightReducer.guestFlights')
}

export const getSpeakers = (state) => {
  console.log('Getting Speakers ::', get(state, 'speakerReducer.speakerScreenDetails'))
  return get(state, 'speakerReducer.speakerScreenDetails')
}

export const getSponsors = (state) => {
  console.log('Getting Sponsors ::', get(state, 'sponsorReducer.sponsorScreenDetails'))
  return get(state, 'sponsorReducer.sponsorScreenDetails')
}