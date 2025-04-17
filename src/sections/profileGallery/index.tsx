import { Card, CardContent, CardHeader, Avatar, Typography, Button, Grid, TextField, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import EditIconSVG from "src/components/editIconSVG";
import Api from "src/helpers/Api";
import { useRouter } from "src/routes/hooks";
import { ProfileView, Profile } from "src/sections/profile/view/profile-page";

export function ProfileGalleryView() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileChanged, setProfileChanged] = useState<boolean>(false);
    const [isEditPage, setEditPage] = useState(false);
    const [gallery, setGallery] = useState<string[]>([]);

    const navigate = useNavigate();

    const router = useRouter();

    useEffect(() => {
        Api.getBusinessProfile()
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch profile");
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    console.log("Fetched Profile Data:", data);
                    setProfile(data.business);
                    setGallery(data.business.gallery);
                } else {
                    console.error(data.message);
                    router.push("/sign-in");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                router.push("/sign-in");
            });
    }, [router, profileChanged]);

    const handleAddGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("HI")
        if (!file) return;


        // upload to backend
        const formData = new FormData();
        formData.append("image", file);

        await Api.uploadGalleryImage(formData, profile?._id)
            .catch((err) => {
                console.error("Failed to upload gallery image", err);
            });
        setProfileChanged(!profileChanged);

    };

    const handleDeleteGalleryImage = async (index: number) => {

        console.log(gallery);
        console.log(gallery[index]);

        await Api.deleteGalleryImage(gallery[index], profile?._id)
            .catch((err) => {
                console.error("Failed to delete image", err);
            });
        setProfileChanged(!profileChanged);
    };


    if (!profile) {
        return null; // Render nothing while redirecting
    }

    return (
        <Card style={{ margin: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 16, gap: 15 }}>

                <div style={{ color: '#121417', fontSize: 32, fontWeight: '700', lineHeight: '40px' }}>Gallery</div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {profile.gallery?.map((imgUrl, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <img
                                src={`http://localhost:3000/${imgUrl}`}
                                alt={`Gallery ${index}`}
                                style={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 12 }}
                            />
                            {isEditPage && (
                                <Button
                                    onClick={() => handleDeleteGalleryImage(index)}
                                    style={{ position: 'absolute', top: 4, right: 4, minWidth: 24, padding: 0, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                >
                                    X
                                </Button>
                            )}
                        </div>
                    ))}

                    {isEditPage && (
                        <label
                            htmlFor="upload-gallery-image"
                            style={{
                                width: 128,
                                height: 128,
                                border: '2px dashed #ccc',
                                borderRadius: 12,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                color: '#999',
                                fontSize: 14,
                                transition: 'border 0.3s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.border = '2px dashed #666' }}
                            onMouseLeave={(e) => { e.currentTarget.style.border = '2px dashed #ccc' }}
                        >
                            <input
                                id="upload-gallery-image"
                                type="file"
                                accept="image/*"
                                onChange={handleAddGalleryImage}
                                style={{ display: 'none' }}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                style={{ marginBottom: 8 }}
                            >
                                <path d="M.5 1.5A.5.5 0 0 1 1 1h1.293l.853-.854a.5.5 0 0 1 .708 0L4.707 1H14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a.5.5 0 0 1 .5-.5zM1 2v11h13V2H4.707l-.853-.854a.5.5 0 0 0-.708 0L2.293 2H1zm5 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm5.002 5a.5.5 0 0 1 .354.854l-1.647 1.646a.5.5 0 0 1-.708 0L8 11.207l-1.293 1.293a.5.5 0 0 1-.708 0L4.354 10.854a.5.5 0 1 1 .708-.708L6 11.293l1.293-1.293a.5.5 0 0 1 .708 0l1.293 1.293 1.647-1.647a.5.5 0 0 1 .354-.147z" />
                            </svg>
                            Upload Image
                        </label>
                    )}
                </div>


                {!isEditPage ? (
                    <div style={{ display: 'flex', flexDirection: "row", gap: 10 }}>
                        <Button onClick={() => setEditPage(true)} variant="contained" color="primary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                            <div style={{ fontSize: 14, fontWeight: '700' }}>Edit Gallery</div>
                        </Button>
                        <Button onClick={() => { navigate(-1) }} variant="contained" color="secondary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                            <div style={{ fontSize: 14, fontWeight: '700' }}>Go Back</div>
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: "row", gap: "10px" }}>
                        <Button onClick={() => { setEditPage(false) }} variant="contained" color="primary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                            <div style={{ fontSize: 14, fontWeight: '700' }}>Done Editing</div>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
