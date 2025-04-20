import { useForm, Controller, set } from 'react-hook-form';
import { Box, Button, Container, TextField, Typography, RadioGroup, Radio, FormControl, FormLabel, FormControlLabel, Card, CardContent, Snackbar, Alert, Slider, Checkbox } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useState, useEffect, act } from "react";
import Api, { address } from 'src/helpers/Api';
import { v4 as uuidv4 } from 'uuid';
import { start } from 'repl';
import { useParams } from 'react-router-dom';
import { MdPhotoCamera } from 'react-icons/md';
import { CustomerTableRow } from './product-customers-page';

// ----------------------------------------------------------------------
export type ActivityProp = {
    name: string;
    location: string;
    description: string;
    directions: string;
    totalSlots: number;
    startDate: string;
    endDate: string;
    frequencyTime: string;
    frequencyDay: number;
    duration: string;
    signUps: number;
    creditCost: number;
    businessId: string;
    isOneTime: boolean;
    scheduleId: string;
    customers: string[];
};

export function EditNewOneTimeActivityPage() {
    const { register, handleSubmit, control } = useForm();
    const router = useRouter();
    const { activityId } = useParams();

    const [updateData, setUpdateData] = useState<Record<string, any>>({ creditCost: 5 });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activityImage, setActivityImage] = useState<File | null>(null);

    const [activity, setActivity] = useState<any | null>(null);

    const [useProfileDirection, setUseProfileDirection] = useState(false);
    const [direction, setDirection] = useState('');
    const [canCheckbox, setCanCheckbox] = useState(false);

    const [customDirection, setCustomDirection] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const insertUpdateData = (attributeName: string, value: any) => {
        setUpdateData((prev) => ({ ...prev, [attributeName]: value }));
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setActivityImage(file);
        // Create a URL for preview
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);

        // Here, you can also upload the image to an API

    };

    useEffect(() => {
        Api.getBusinessProfile().then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    if (data.business.directions !== "") {
                        setDirection(data.business.directions);
                        setCanCheckbox(true);
                    }
                }
            })
    }, []);

    useEffect(() => {
        if (!activity) { return; }

        // @ts-ignore
        if (activity.directions === direction) {
            setUseProfileDirection(true);
        } else {
            setUseProfileDirection(false);
        }
    }, [activity, direction])

    useEffect(() => {
        Api.getActivityById(activityId)
            .then((response) => response.json())
            .then((data) => {
                setActivity(data);
            });
    }, [activityId]);

    const onSubmit = async () => {

        try {
            const updatedActivity = {
                ...updateData,
                directions: useProfileDirection ? direction : customDirection,
            }

            if (updateData.startDate) {
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

                // @ts-ignore
                updatedActivity.startDate = activityDate;
                // @ts-ignore
                updatedActivity.frequencyDay = targetDay.toString();
            }



            const formData = new FormData();
            if (activityImage) {
                formData.append("activityImage", activityImage);
            }


            Object.keys(updatedActivity).forEach(key => {
                formData.append(key, (updatedActivity as Record<string, any>)[key]);
            });
            Api.editActivities(activityId, formData).then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update activity. Please try again.");
                }
                return response;
            }).then((result) => {
                setSnackbarMessage("Activity updated successfully!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                router.push('/activities');
            })

        } catch (error: any) {
            console.error("Something went wrong:", error);
            setSnackbarMessage(error.message || "An error occurred");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };


    if (!activity) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 4, p: 3, boxShadow: 5, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Edit Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Fill in the details below to edit activity.
                    </Typography>
                    <FormControl>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Activity Name */}
                            <TextField
                                fullWidth
                                label="Activity Name"
                                required
                                {...register('name', { required: 'Activity name is required' })}
                                sx={{ mb: 2 }}
                                defaultValue={activity && activity.name}
                                onChange={(e) => insertUpdateData("name", e.target.value)}
                            />
                            {/* Activity Location */}
                            <TextField
                                fullWidth
                                label="Activity Location"
                                required
                                {...register('location', { required: 'Activity location is required' })}
                                onChange={(e) => insertUpdateData("location", e.target.value)}
                                defaultValue={activity && activity.location}
                                sx={{ mb: 2 }}
                            />
                            <FormControlLabel
                                value="auto-add-direction"
                                control={<Checkbox
                                    checked={useProfileDirection}
                                    onChange={(e) => setUseProfileDirection(e.target.checked)}
                                    disabled={!canCheckbox} />}
                                label="Add Direction In Profile" />
                            {!canCheckbox && (
                                <Box>
                                    <Typography variant='caption'>
                                        No directions found in your profile. Please add directions in your profile first.
                                    </Typography>
                                </Box>
                            )}
                            {/* Activity Direction */}
                            <TextField
                                fullWidth
                                label="Direction"
                                disabled={useProfileDirection}
                                value={useProfileDirection ? direction : customDirection}
                                onChange={(e) => setCustomDirection(e.target.value)}
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}

                            />
                            <input
                                type="hidden"
                                {...register('direction')}
                                value={useProfileDirection ? direction : customDirection}
                            />
                            {/* Activity Description */}
                            <TextField
                                fullWidth
                                label="Activity Description"
                                required
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                                defaultValue={activity && activity.description}
                                onChange={(e) => insertUpdateData("description", e.target.value)}
                            />
                            {/* Total Slots */}
                            <TextField
                                fullWidth
                                label="Total Slots"
                                required
                                type="number"
                                sx={{ mb: 2 }}
                                defaultValue={activity && activity.totalSlots}
                                onChange={(e) => insertUpdateData("totalSlots", e.target.value)}
                            />
                            {/* Credit Cost */}
                            <Typography id="credit-cost-slider" gutterBottom>
                                Credit Cost
                            </Typography>
                            <Controller
                                name="creditCost"
                                control={control}
                                defaultValue={activity && activity.creditCost}
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
                            <TextField
                                fullWidth
                                label="Activity Date"
                                type="date"
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                                defaultValue={activity && new Date(activity.startDate).toISOString().split('T')[0]}
                                onChange={(e) => insertUpdateData("startDate", e.target.value)}
                            />
                            {/* Activity Time */}
                            <TextField
                                fullWidth
                                label="Activity Start Time"
                                type="time"
                                required
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 60 }} // accepts time down to the minute
                                defaultValue={activity && activity.frequencyTime}
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
                                defaultValue={activity && activity.duration}
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
                                <img src={selectedImage || `${address}${activity.activityImage}`} alt="Preview" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button variant="contained" color="primary" type="submit" sx={{ px: 4 }}>
                                    Edit Activity
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
}