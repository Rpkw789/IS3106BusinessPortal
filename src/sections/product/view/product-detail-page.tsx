import { Container, Alert, Snackbar, Typography, Box, Button, Card, CardContent, Stack, Chip, Divider, Rating } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { ProductItemProps } from 'src/sections/product/product-item';
import { useEffect, useState } from 'react';

function formatTimeRange(frequencyTime: string, duration: string) {
    // Split the frequencyTime into hours and minutes
    const [hours, minutes] = frequencyTime.split(':').map(Number);

    // Create a date object using the current date and the provided time
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0); // Set start time with frequency time

    const durationInHours = parseFloat(duration);
    const durationHours = Math.floor(durationInHours);
    const durationMinutes = Math.round((durationInHours - durationHours) * 60);

    // Calculate the end time by adding the duration (in hours) to the start time
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationHours);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    // Format the start and end times as "HH:mm"
    const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${formattedStartTime} - ${formattedEndTime}`;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ProductDetailPage({ product }: { product: ProductItemProps }) {
    const router = useRouter();

    const [activity, setActivity] = useState<ProductItemProps>(product);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const onDelete = () => {
        fetch(`http://localhost:3000/api/activities/${product._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((rawdata) => {
                if (rawdata.status === "success") {
                    setSnackbarMessage(rawdata.message);
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    router.push('/activities');
                } else {
                    setSnackbarMessage(rawdata.message);
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
    };

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 4, p: 3, boxShadow: 5, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        {activity.name}
                    </Typography>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                        <Chip
                        label={activity.isComplete ? 'Completed' : 'Upcoming'}
                        color={activity.isComplete ? 'success' : 'warning'}
                        sx={{ alignSelf: 'flex-start' }}
                        />
                        <Typography variant="body1"><strong>Day:</strong> {formatDate(activity.startDate)}</Typography>
                        <Typography variant="body1"><strong>Time:</strong> {formatTimeRange(activity.frequencyTime, activity.duration)}</Typography>
                        <Typography variant="body1"><strong>Location:</strong> {activity.location}</Typography>
                        <Typography variant="body1"><strong>Credit Cost:</strong> {activity.creditCost}</Typography>
                        <Typography variant="body1"><strong>Total Slots:</strong> {activity.totalSlots} (Signed Up: {activity.signUps})</Typography>
                        <Typography variant="body1"><strong>Description:</strong> {activity.description}</Typography>
                        <Typography variant="body1"><strong>Directions:</strong> {activity.directions}</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" color="secondary" onClick={() => router.push(`/activities/${activity._id}/customers`)}>
                            View Customers
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => router.push(`/edit-activity/${product._id}`)}>
                            Edit Activity
                        </Button>
                        <Button variant="contained" color="error" onClick={onDelete}>
                            Delete Activity
                        </Button>
                    </Box>
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
