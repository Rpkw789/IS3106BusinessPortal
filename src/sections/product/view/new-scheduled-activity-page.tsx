import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Container, TextField, Typography, RadioGroup, Radio, FormControl, FormLabel, FormControlLabel, Card, CardContent, Select, InputLabel, MenuItem, Slider, Snackbar } from "@mui/material";
import { useRouter } from 'src/routes/hooks';
import { useState, useEffect } from 'react';
import { MdPhotoCamera } from "react-icons/md";

// ----------------------------------------------------------------------

export function NewScheduledActivityPage() {
    const { register, handleSubmit, control } = useForm();
    const router = useRouter();

    const [activities, setActivities] = useState<any[]>([]);
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
        const token = localStorage.getItem("token");
    
        const startDate = new Date(updateData.startDate);
        const endDate = new Date(updateData.endDate);
        const frequencyDay = updateData.frequencyDay; 
        const timeParts = updateData.frequencyTime.split(":");
        const hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
    
        const dayMapping: { [key: string]: number } = {
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
            "Thursday": 4, "Friday": 5, "Saturday": 6
        };
    
        const targetDay = dayMapping[frequencyDay]; 
    
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (currentDate.getDay() === targetDay) {
                // Clone current date and set time
                const activityDate = new Date(currentDate);
                activityDate.setHours(hour, minute, 0, 0);
    
                // Create new activity object
                const formData = new FormData();
                Object.keys(updateData).forEach(key => {
                    formData.append(key, updateData[key]);
                });
                formData.append("activityImage", activityImage);
                formData.append("isOneTime", "false");
                formData.append("dateCreated", new Date().toISOString());
                formData.append("signUps", "0");
                formData.append("customers", JSON.stringify([]));
                formData.append("rating", "0");
                formData.append("isComplete", "false");
                formData.append("frequencyDay", targetDay.toString());

                try {
                    fetch('http://localhost:3000/api/activities/add-new-scheduled-activity', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }).then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    });
                    router.push('/activities');
                } catch (error) {
                    console.error('Error creating scheduled activity:', error);
                    alert('Error creating scheduled activity. Please try again.');
                } 
            }
            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

    };

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 4, p: 3, boxShadow: 5, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Add New Scheduled Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Fill in the details below to create a new scheduled activity.
                    </Typography>
                    
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
                            multiline
                            rows={3}
                            required
                            sx={{ mb: 2 }}
                            onChange={(e) => insertUpdateData("description", e.target.value)}
                        />
                        {/* Total Slots */}
                        <TextField
                            fullWidth
                            label="Total Slots"
                            type="number"
                            required
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
                        {/* Start Date */}
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                            onChange={(e) => insertUpdateData("startDate", e.target.value)}
                        />
                        {/* End Date */}
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                            onChange={(e) => insertUpdateData("endDate", e.target.value)}
                        />
                        {/* Day Selection */}
                        <FormControl sx={{ mb: 2, minWidth: 480 }}>
                            <InputLabel id="day-label">Activity happens on every</InputLabel>
                            <Select
                                labelId="frequencyDay-label"
                                id="frequencyDay"
                                defaultValue=""
                                label="Day"
                                required
                                onChange={(e) => insertUpdateData("frequencyDay", e.target.value)} 
                            >
                                <MenuItem value="Monday">Monday</MenuItem>
                                <MenuItem value="Tuesday">Tuesday</MenuItem>
                                <MenuItem value="Wednesday">Wednesday</MenuItem>
                                <MenuItem value="Thursday">Thursday</MenuItem>
                                <MenuItem value="Friday">Friday</MenuItem>
                                <MenuItem value="Saturday">Saturday</MenuItem>
                                <MenuItem value="Sunday">Sunday</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Activity Time */}
                        <TextField
                            fullWidth
                            label="Activity Start Time (HH:MM in 24-hour format)"
                            required
                            sx={{ mb: 2 }}
                            onChange={(e) => insertUpdateData("frequencyTime", e.target.value)}
                        />
                        {/* Activity Duration */}
                        <TextField
                            fullWidth
                            label="Activity Duration (in hours)"
                            type="number"
                            inputProps={{ step: "0.1", min: "0.5" }}
                            required
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
                            <Button variant="contained" color="primary" type='submit' sx={{ px: 4 }}>
                                Add Activity
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                {`Activity Created: ${new Date().toLocaleString()}`}
                            </Typography>
                        </Box>                        
                    </form>
                    
                </CardContent>
            </Card>
        </Container>
    );
 }
