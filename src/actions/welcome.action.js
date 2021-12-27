import {GET_WELCOME_DETAILS} from "./actionTypes";

export function welcomeScreenAction(apiResponse){
  console.log(apiResponse, '----------------------');
	const modifyAPIResponse = updateAPIResponse(apiResponse);
	return {
    type: GET_WELCOME_DETAILS,
    welcomeScreenReducer : modifyAPIResponse
  }
}

function updateAPIResponse(data) {
  data.destinationDetails.map((item) => {
    item.destinationId = item._id;
  })
  return data;
}