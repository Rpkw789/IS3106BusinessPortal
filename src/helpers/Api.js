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
    uploadGalleryImage(formData, businessId) {

        return fetch(`${address}/api/businesses/galleryImage/${businessId}`, {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            method: "POST",
            body: formData
        });
    },
    deleteGalleryImage(imageId, businessId) {
        return fetch(`${address}/api/businesses/galleryImage/delete/${businessId}`, {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ image: imageId })
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