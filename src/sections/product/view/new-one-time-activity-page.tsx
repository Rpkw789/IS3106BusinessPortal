import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, TextField, Typography, FormControl, FormControlLabel, Card, CardContent, Snackbar, Alert, Slider, Checkbox } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useEffect, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";

// ----------------------------------------------------------------------

export function NewOneTimeActivityPage() {
    const { register, handleSubmit, control } = useForm();
    const Router = useRouter();

    const [activityImage, setActivityImage] = useState("/default-profile.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateData, setUpdateData] = useState<Record<string, any>>({});

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const insertUpdateData = (attributeName: string, value: any) => {
        setUpdateData((prev) => ({ ...prev, [attributeName]: value }));
      }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
    
        const imageUrl = URL.createObjectURL(file);
        setActivityImage(activityImage);
        insertUpdateData("activityImage", activityImage);
    }
    };
      
    const onSubmit = async () => {
        try {
            const startDate = new Date(updateData.startDate);
            const timeParts = updateData.frequencyTime.split(":");
            const hour = parseInt(timeParts[0], 10);
            const minute = parseInt(timeParts[1], 10);
    
            const frequencyDay = startDate.toLocaleString('en-US', { weekday: 'long' });
            const dayMapping: { [key: string]: number } = {
                Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
                Thursday: 4, Friday: 5, Saturday: 6
            };
            const targetDay = dayMapping[frequencyDay];
    
            const activityDate = new Date(startDate);
            activityDate.setHours(hour, minute, 0, 0);
    
            const formData = new FormData();
            Object.keys(updateData).forEach(key => {
                formData.append(key, updateData[key]);
            });
            formData.append("activityImage", activityImage);
            formData.append("startDate", activityDate.toISOString());
            formData.append("endDate", activityDate.toISOString());
            formData.append("isOneTime", "true");
            formData.append("dateCreated", new Date().toISOString());
            formData.append("signUps", "0");
            formData.append("customers", JSON.stringify([]));
            formData.append("scheduleId", "null");
            formData.append("rating", "0");
            formData.append("isComplete", "false");
            formData.append("frequencyDay", targetDay.toString());

            fetch (`http://localhost:3000/api/activities/add-new-one-time-activity`, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            }).then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create activity. Please try again.");
                }
                return response.json();
            }).then((result) => {
            setSnackbarMessage("Activity created successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            }) 
            
        } catch (error: any) {
            console.error("Something went wrong:", error);
            setSnackbarMessage(error.message || "An error occurred");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };    

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 4, p: 3, boxShadow: 5, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Add New One Time Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Fill in the details below to create a new one time activity.
                    </Typography>
                    <FormControl>
                        <form onSubmit={handleSubmit(onSubmit)}>
    
                            {/* Activity Name */}
                            <TextField
                                fullWidth
                                label="Activity Name"
                                required
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("name", e.target.value)}
                            />
                            {/* Activity Location */}
                            <TextField
                                fullWidth
                                label="Activity Location"
                                required
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("location", e.target.value)}
                            />
                            {/* Activity Description */}
                            <TextField
                                fullWidth
                                label="Activity Description"
                                required
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("description", e.target.value)}
                            />
                            {/* Total Slots */}
                            <TextField
                                fullWidth
                                label="Total Slots"
                                required
                                type="number"
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("totalSlots", e.target.value)}
                            />
                            {/* Credit Cost */}
                            <Typography id="credit-cost-slider" gutterBottom>
                                Credit Cost
                            </Typography>
                            <Controller
                                name="creditCost"
                                control={control}
                                defaultValue={5}
                                render={({ field }) => (
                                    <Slider
                                        {...field}
                                        onChange={(e, value) => {
                                            field.onChange(value);
                                            insertUpdateData("creditCost", value);
                                        }}
                                        aria-labelledby="credit-cost-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={15}
                                    />
                                )}
                            />
                            {/* Activity Date */}
                            <TextField
                                fullWidth
                                label="Activity Date"
                                type="date"
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("startDate", e.target.value)}
                            />
                            {/* Activity Time */}
                            <TextField
                                fullWidth
                                label="Start Time of Activity (HH:MM)"
                                required
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("frequencyTime", e.target.value)}
                            />
                            {/* Activity Duration */}
                            <TextField
                                fullWidth
                                label="Activity Duration"
                                required
                                type="number"
                                inputProps={{ step: "0.01", min: "0" }}
                                sx={{ mb: 2 }}
                                onChange={(e) => insertUpdateData("duration", e.target.value)}
                            />
                            {/* Activity Image */}
                            <Button variant="outlined" component="label">
                                <MdPhotoCamera size={18} color="black" />
                                <Typography sx={{ ml: 1 }} variant="body2">Upload Image</Typography>
                                <input
                                    type="file"
                                    name="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <img src={activityImage} alt="Preview" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                            </Box>
    
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button variant="contained" color="primary" type="submit" sx={{ px: 4 }}>
                                    Add Activity
                                </Button>
                            </Box>
    
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {`Activity Created: ${new Date().toLocaleString()}`}
                                </Typography>
                            </Box>
                        </form>
                    </FormControl>
                </CardContent>
            </Card>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};
