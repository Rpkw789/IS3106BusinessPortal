import { useForm, Controller, set } from 'react-hook-form';
import { Box, Button, Container, TextField, Typography, RadioGroup, Radio, FormControl, FormLabel, FormControlLabel, Card, CardContent, Snackbar, Alert, Slider, Checkbox } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { start } from 'repl';
import { useParams } from 'react-router-dom';

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
    const { register, handleSubmit, control, setValue } = useForm();
    const Router = useRouter();
    const { activityId } = useParams();
    const [useProfileDirection, setUseProfileDirection] = useState(false);
    const [canCheckbox, setCanCheckbox] = useState(false);
    const [direction, setDirection] = useState("");

    const [activities, setActivities] = useState<ActivityProp>();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        if (useProfileDirection && direction) {
            // Update activities state
            handleActivityChange("directions", direction);
    
            // Update form state
            setValue("directions", direction);
        }
    }, [useProfileDirection, direction, setValue]);
    
    useEffect(() => {
        fetch('http://localhost:3000/api/businesses/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then((response) => response.json())
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
        fetch(`http://localhost:3000/api/activities/${activityId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setActivities(data);
            });
    }, [activityId]);
    if (!activities) {
        return <div>Loading...</div>;
    }
    const handleActivityChange = (field: keyof ActivityProp, value: any) => {
        setActivities((prev) => prev ? { ...prev, [field]: value } : prev);
    };

    const onSubmit = (data: any) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.startDate);
        const date = new Date(data.startDate);
        const frequencyDay = date.toLocaleString('en-US', { weekday: 'long' });
        const timeParts = data.frequencyTime.split(":"); // Extract hours and minutes from input
        const hour = parseInt(timeParts[0], 10); // Convert to number
        const minute = parseInt(timeParts[1], 10); // Convert to number

        // Map day names to numeric values (Sunday = 0, Monday = 1, ..., Saturday = 6)
        const dayMapping: { [key: string]: number } = {
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
            "Thursday": 4, "Friday": 5, "Saturday": 6
        };

        const targetDay = dayMapping[frequencyDay];
        const currentDate = new Date(startDate);
        const activityDate = new Date(currentDate);
        activityDate.setHours(hour, minute, 0, 0);
        
        setActivities({
            ...activities, ...data,
            startDate: activityDate.toISOString(),
            endDate: activityDate.toISOString(),
            frequencyDay: targetDay,
            directions: useProfileDirection ? direction : data.directions,
        });
        fetch(`http://localhost:3000/api/activities/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(activities),
        })
            .then((response) => {
                if (!response.ok) {
                    setSnackbarMessage(data.message);
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                } else {
                    setSnackbarMessage(data.message);
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    Router.push('/activities');
                }
            });
    }

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 4, p: 3, boxShadow: 5, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Edit New One Time Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Change the details below to edit a new one time activity.
                    </Typography>
                    <FormControl>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Controller
                                name="name"
                                control={control}
                                defaultValue={activities.name}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Activity Name"
                                        onChange={(e) => {
                                            field.onChange(e); // updates react-hook-form
                                            handleActivityChange("name", e.target.value); // updates activities state
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Activity Location */}
                            <Controller
                                name="location"
                                control={control}
                                defaultValue={activities.location}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Activity Location"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("location", e.target.value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                value="auto-add-direction"
                                control={
                                    <Checkbox
                                        checked={useProfileDirection}
                                        onChange={(e) => setUseProfileDirection(e.target.checked)}
                                        disabled={!canCheckbox}
                                    />
                                }
                                label="Add Direction In Profile"
                            />
                            {!canCheckbox && (
                                <Box>
                                    <Typography variant='caption'>
                                        No directions found in your profile. Please add directions in your profile first.
                                    </Typography>
                                </Box>
                            )}
                            <Controller
                                name="directions"
                                control={control}
                                defaultValue={useProfileDirection ? direction : activities.directions}
                                rules={{ required: 'Activity Direction is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Direction"
                                        disabled={useProfileDirection}
                                        multiline
                                        rows={3}
                                        value={useProfileDirection ? direction : field.value}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("directions", e.target.value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Activity Description */}
                            <Controller
                                name="description"
                                control={control}
                                defaultValue={activities.description}
                                rules={{ required: 'Activity description is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Activity Description"
                                        multiline
                                        rows={3}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("description", e.target.value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Total Slots */}
                            <Controller
                                name="totalSlots"
                                control={control}
                                defaultValue={activities.totalSlots}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Total Slots"
                                        type="number"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("totalSlots", parseInt(e.target.value, 10));
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Credit Cost - edit to make it a form? not sure if react recognises this as input */}
                            <Typography id="credit-cost-slider" gutterBottom>
                                Credit Cost
                            </Typography>
                            <Controller
                                name="creditCost"
                                control={control}
                                defaultValue={activities.creditCost}
                                render={({ field }) => (
                                    <Slider
                                        {...field}
                                        aria-labelledby="credit-cost-slider"
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={15}
                                        onChange={(e, value) => {
                                            field.onChange(value);
                                            handleActivityChange("creditCost", value as number);
                                        }}
                                    />
                                )}
                            />
                            {/* Activity Date */}
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue={new Date(activities.startDate).toISOString().split('T')[0]}
                                rules={{ required: 'Activity date is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Activity Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("startDate", e.target.value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Activity Time */}
                            <Controller
                                name="frequencyTime"
                                control={control}
                                defaultValue={activities.frequencyTime}
                                rules={{ required: 'Activity time is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Start Time of Activity (HH:MM)"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleActivityChange("frequencyTime", e.target.value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            {/* Activity Duration */}
                            <Controller
                                name="duration"
                                control={control}
                                defaultValue={activities.duration}
                                rules={{ required: 'Activity duration is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Activity Duration"
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                            field.onChange(value);
                                            handleActivityChange("duration", value);
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />

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
};