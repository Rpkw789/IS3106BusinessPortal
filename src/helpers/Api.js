const address = 'http://localhost:3000';

const Api = {
  updateBusinessProfile(updateData, profileImage, businessId) {
    const formData = new FormData();
    formData.append('profilePicture', profileImage);
    Object.keys(updateData).forEach((key) => {
      formData.append(key, updateData[key]);
    });

    return fetch(`${address}/api/businesses/editProfile/${businessId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'PUT',
      body: formData,
    });
  },
  uploadGalleryImage(formData, businessId) {
    return fetch(`${address}/api/businesses/galleryImage/${businessId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'POST',
      body: formData,
    });
  },
  deleteGalleryImage(imageId, businessId) {
    return fetch(`${address}/api/businesses/galleryImage/delete/${businessId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ image: imageId }),
    });
  },
  getProfile() {
    return fetch(`${address}/api/businesses/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'GET',
    });
  },
  getTodayActivities() {
    return fetch(`${address}/api/activities/today-activities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getBookingsWithQuery(chooseDate, query) {
    return fetch(`${address}/api/bookings/${chooseDate}${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getBookingsByBusinessWithQuery(query) {
    return fetch(`${address}/api/bookings/biz${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getMonthlyCreditsEarned(month) {
    return fetch(`${address}/api/bookings/historyStats${month}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getMonthlyRatings(month) {
    return fetch(`${address}/api/reviews/calMonthlyBiz${month}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getBookingsByBusiness() {
    return fetch(`${address}/api/bookings/biz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getBusinessProfile() {
    return fetch(`${address}/api/businesses/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getActivityById(activityId) {
    return fetch(`${address}/api/activities/${activityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  editActivities(activityId, formData) {
    return fetch(`${address}/api/activities/${activityId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
  },
  login(formData) {
    return fetch(`${address}/api/businesses/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  },
  signUp(formData) {
    return fetch(`${address}/api/businesses/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  },
  addOneTimeActivity(formData) {
    return fetch(`${address}/api/activities/add-new-one-time-activity`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  addScheduledActivity(formData) {
    return fetch(`${address}/api/activities/add-new-scheduled-activity`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
  },
  getAllBusinessActivities(queryParams) {
    return fetch(`${address}/api/activities/all-business-activities?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getActivityBookings(activityId) {
    return fetch(`${address}/api/bookings/activity/${activityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  deleteActivity(activityId) {
    return fetch(`http://localhost:3000/api/activities/${activityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  cancelBooking(bookingId) {
    return fetch(`http://localhost:3000/api/bookings/cancel/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  deleteSchedule(scheduleId) {
    return fetch(`http://localhost:3000/api/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getBusinessSchedules() {
    return fetch('http://localhost:3000/api/schedules/all-business-schedules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

export default Api;
export { address };
