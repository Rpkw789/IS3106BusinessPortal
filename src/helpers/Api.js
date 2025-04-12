const address = "http://localhost:3000";

const Api = {
    updateBusinessProfile(updateData, profileImage, businessId) {
        const formData = new FormData();
        formData.append("profilePicture", profileImage);
        Object.keys(updateData).forEach(key => {
            formData.append(key, updateData[key]);
        });

        return fetch(`${address}/api/businesses/editProfile/${businessId}`, {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            method: "PUT",
            body: formData
        });
    },
    getProfile() {
        return fetch(`${address}/api/businesses/profile`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            method: "GET"
        });
    }
}

export default Api;
export { address };