import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, TextField, Typography, RadioGroup, Radio, FormControl, FormLabel, FormControlLabel, Card, CardContent, Snackbar, Alert, Slider, Checkbox } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useState, useEffect } from "react";

// ----------------------------------------------------------------------

export function NewOneTimeActivityPage() {
    const { register, handleSubmit, control } = useForm();
    const Router = useRouter();

    const [useProfileDirection, setUseProfileDirection] = useState(false);
    const [direction, setDirection] = useState('');
    const [canCheckbox, setCanCheckbox] = useState(false);

    const [customDirection, setCustomDirection] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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

        const activities: any[] = []; // this is the fix
        const currentDate = new Date(startDate);
        const activityDate = new Date(currentDate);
        activityDate.setHours(hour, minute, 0, 0);

        activities.push({
            ...data,
            startDate: activityDate.toISOString(),
            endDate: activityDate.toISOString(),
            isOneTime: true,
            dateCreated: new Date().toISOString(),
            signUps: 0,
            isComplete: false,
            frequencyDay: targetDay,
            directions: useProfileDirection ? direction : customDirection,
        });
        fetch('http://localhost:3000/api/activities/add-new-one-time-activity', {
            method: 'POST',
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
                                {...register('name', { required: 'Activity name is required' })}

                                sx={{ mb: 2 }}
                            />
                            {/* Activity Location */}
                            <TextField
                                fullWidth
                                label="Activity Location"
                                {...register('location', { required: 'Activity location is required' })}

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
                                multiline
                                rows={3}
                                {...register('description', { required: 'Activity description is required' })}
                                sx={{ mb: 2 }}
                            />
                            {/* Total Slots */}
                            <TextField
                                fullWidth
                                label="Total Slots"
                                type="number"
                                {...register('totalSlots', { required: 'Total slots are required' })}
                                sx={{ mb: 2 }}
                            />
                            {/* Credit Cost - edit to make it a form? not sure if react recognises this as input */}
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
                                {...register('startDate', { required: 'Activity date is required' })}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                            {/* Activity Time */}
                            <TextField
                                fullWidth
                                label="Start Time of Activity (HH:MM)"
                                {...register('frequencyTime', { required: 'Activity time is required' })}
                                sx={{ mb: 2 }}
                            />
                            {/* Activity Duration */}
                            <TextField
                                fullWidth
                                label="Activity Duration"
                                type="number"
                                inputProps={{ step: "0.01", min: "0" }}
                                {...register('duration', { required: 'Activity duration is required' })}
                                sx={{ mb: 2 }}
                            />

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
