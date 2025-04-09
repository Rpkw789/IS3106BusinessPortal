const address = "http://localhost:3000";

const Api = {
    updateBusinessProfile(updateData, profileImage, businessId) {
        const formData = new FormData();
        formData.append("profilePicture", profileImage);
        Object.keys(updateData).forEach(key => {
            formData.append(key, updateData[key]);
        });

        console.log(localStorage.getItem("accesstoken"));

        return fetch(`${address}/api/businesses/editProfile/${businessId}`, {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            method: "PUT",
            body: formData
        });
    },
}

export default Api;
export { address };