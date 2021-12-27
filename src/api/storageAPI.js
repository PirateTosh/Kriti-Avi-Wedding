export function checkIsUserLoggedIn() {
  return localStorage.getItem('isLoggedIn');
}

export const storeGuest = (guest) => {
  localStorage.setItem('currentGuest', JSON.stringify(guest));
};

export const fetchCurrentGuest = (guest) => {
  return JSON.parse(localStorage.getItem('currentGuest'));
};

export const storeEvent = (event) => {
  localStorage.setItem('currentEvent', JSON.stringify(event));
};

export const fetchCurrentEvent = () => {
  return JSON.parse(localStorage.getItem('currentEvent'));
};