import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Api from "src/helpers/Api";
import { useRouter } from "src/routes/hooks";

export type ChangePasswordDialogProps = {
    open: boolean;
    handleClose: () => void;
};

export default function ChangePasswordDialog({ open, handleClose }: ChangePasswordDialogProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        setIsLoading(true);
        Api.forgetPassword(email)
            .then((response) => {
                if (response.ok) {
                    setSnackbarMessage("Email Password Change sent!");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    setIsLoading(false);
                    handleClose();
                }
                else {
                    setSnackbarMessage("Failed to Reset Password");
                    setSnackbarSeverity("error");
                    setIsLoading(false);
                    setOpenSnackbar(true);
                    handleClose();
                }
            });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleChangePassword();
    }
    return (
        <Box>
            <Dialog open={open} onClose={handleClose}>
                <form
                    onSubmit={handleSubmit}
                >
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isLoading ? "Loading..." : "An email will be sent to you with a temporary password."}
                        </DialogContentText>
                        {
                            !isLoading && (
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            )
                        }

                    </DialogContent>
                    {
                        !isLoading && (<DialogActions>
                            <Button onClick={handleClose} color="error" variant="contained">Cancel</Button>
                            <Button type="submit" variant="contained">Confirm Reset Password</Button>
                        </DialogActions>)
                    }

                </form>
            </Dialog>
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
        </Box>
    )
}