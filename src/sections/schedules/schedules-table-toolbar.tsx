import { useState } from 'react';
import Api from "src/helpers/Api";

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { Snackbar, Alert } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { Iconify } from 'src/components/iconify';
import { red } from '@mui/material/colors';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

type SchedulesTableToolbarProps = {
	selected: string[];
	filterName: string;
	onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onFilterStatus: (value: string) => void;
};

export function SchedulesTableToolbar({ selected, filterName, onFilterName, onFilterStatus }: SchedulesTableToolbarProps) {
	// Confirm delete pop up will appear after delete button is clicked 
	const numSelected = selected.length;
	const router = useRouter();
	const [popUp, onPopUp] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

	const openPopUp = () => {
		onPopUp(true);
	};

	const closePopUp = () => {
		onPopUp(false);
	};

	// once click confirmed, remove from data 
	const confirmCancel = async () => {
		try {
			const cancelPromises = selected.map((scheduleId) =>
				Api.deleteSchedule(scheduleId).then(async (response) => {
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`Failed to cancel ${scheduleId}: ${errorText}`);
					}
				})
			);

			await Promise.all(cancelPromises);

			setSnackbarMessage("All schedules cancelled successfully");
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			closePopUp();
			router.refresh();

		} catch (error) {
			setSnackbarMessage("Error cancelling one or more schedules");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		}
	}

	// Make filter for subscription status
	const [filter, onFilter] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState('all');

	const openFilter = () => {
		onFilter(true);
	};

	const closeFilter = () => {
		onFilter(false);
	};

	// Once choose filter, filter staff data

	const confirmFilter = () => {
		onFilterStatus(selectedFilter);
		closeFilter();
	}

	return (
		<Toolbar
			sx={{
				height: 96,
				display: 'flex',
				justifyContent: 'space-between',
				p: (theme) => theme.spacing(0, 1, 0, 3),
				...(numSelected > 0 && {
					color: 'primary.main',
					bgcolor: 'primary.lighter',
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography component="div" variant="subtitle1">
					{numSelected} selected
				</Typography>
			) : (
				<OutlinedInput
					fullWidth
					value={filterName}
					onChange={onFilterName}
					placeholder="Search schedule..."
					startAdornment={
						<InputAdornment position="start">
							<Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
						</InputAdornment>
					}
					sx={{ maxWidth: 320 }}
				/>
			)}

			{numSelected > 0 ? (
				<>
					<Tooltip title="Cancel Schedule">
						<Button onClick={openPopUp} variant='contained' color='error'
							startIcon={<Iconify icon="eva:trash-2-outline" />}>
							Cancel Schedule
						</Button>
					</Tooltip>
					<Dialog
						open={popUp}
						onClose={closePopUp}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							Confirm Cancel Schedule?
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								Once confirmed, <strong>ALL</strong> activities under the selected schedules will be deleted.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button sx={{ color: red[500] }} onClick={closePopUp}>Cancel</Button>
							<Button onClick={confirmCancel} autoFocus>
								Confirm
							</Button>
						</DialogActions>
					</Dialog>
				</>
			) : (
				<Box>
					<Tooltip title="Filter list">
						<IconButton onClick={openFilter}>
							<Iconify icon="ic:round-filter-list" />
						</IconButton>
					</Tooltip>
					<Dialog
						open={filter}
						onClose={closeFilter}
						aria-labelledby="filter-popUp"
						aria-describedby="filter-description"
					>
						<DialogTitle id="filter-title">
							Filter by Days Of Week
						</DialogTitle>
						<DialogContent>
							<FormControl component="fieldset" sx={{ mt: 2 }}>
								<RadioGroup
									value={selectedFilter}
									onChange={(event) => setSelectedFilter(event.target.value)}
								>
									<FormControlLabel value="all" control={<Radio />} label="All" />
									<FormControlLabel value="Sunday" control={<Radio />} label="Sunday" />
									<FormControlLabel value="Monday" control={<Radio />} label="Monday" />
									<FormControlLabel value="Tuesday" control={<Radio />} label="Tuesday" />
									<FormControlLabel value="Wednesday" control={<Radio />} label="Wednesday" />
									<FormControlLabel value="Thursday" control={<Radio />} label="Thursday" />
									<FormControlLabel value="Friday" control={<Radio />} label="Friday" />
									<FormControlLabel value="Saturday" control={<Radio />} label="Saturday" />
								</RadioGroup>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button sx={{ color: red[500] }} onClick={closeFilter}>Cancel</Button>
							<Button onClick={confirmFilter} autoFocus>
								Confirm
							</Button>
						</DialogActions>
					</Dialog>
				</Box>
			)}
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
		</Toolbar>
	);
}
