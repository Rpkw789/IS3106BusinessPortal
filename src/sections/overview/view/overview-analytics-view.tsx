import { useState, useCallback, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Card } from '@mui/material';

import { _tasks, _posts, _timeline, _activity, _bookings } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { BookingProp } from 'src/sections/Bookings/bookings-table-row';
import dayjs, { Dayjs } from 'dayjs';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/sections/Bookings/view';
import { getComparator, emptyRows } from 'src/sections/Bookings/utils';
import { TableEmptyRows } from 'src/sections/Bookings/table-empty-rows';
import { TableNoData } from 'src/sections/Bookings/table-no-data';
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { TodayActivities, ActivityTableHead, ActivityTableRow } from '../analytics-today-activities';
import { EarningsRow, FinanceToolbar, TotalEarnings, GroupedBooking } from '../earnings';

// ----------------------------------------------------------------------
export type ActivityProp = {
	id: string;
	name: string;
	date: Date;
	start: string;
	end: string;
	signups: number;
};

export function OverviewAnalyticsView() {
	const table = useTable();
	const earningsTable = useTable();
	
	const [filterName, setFilterName] = useState('');
	const [chooseDate, setChooseDate] = useState('');

	const dataFiltered: ActivityProp[] = applyFilter({
		inputData: _activity,
		comparator: getComparator(table.order, table.orderBy),
		filterName,
	});
	const notFound = !dataFiltered.length && !!filterName;

	const bookingsFiltered: BookingProp[] = applyFinanceFilter({
		inputData: _bookings,
		comparator: getComparator(table.order, table.orderBy),
		date: chooseDate,
	});

	const groupedBookings = groupBookingsByActivity(bookingsFiltered);

	return (
		<DashboardContent maxWidth="xl">
			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
				Hi, Welcome back 👋
			</Typography>

			<Grid container spacing={3}>

				<Grid xs={12} sm={6}>
					<AnalyticsWidgetSummary
						title="Monthly Credits Earned"
						percent={2.8}
						total={500}
						color="warning"
						icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
						chart={{
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
							series: [40, 70, 50, 28, 70, 75, 7, 64],
						}}
					/>
				</Grid>

				<Grid xs={12} sm={6}>
					<AnalyticsWidgetSummary
						title="Ratings"
						percent={2.8}
						total={4.8}
						color="primary"
						icon={<img alt="icon" src="/assets/icons/glass/clipart3078264.png" />}
						chart={{
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
							series: [40, 70, 50, 28, 70, 75, 7, 64],
						}}
					/>
				</Grid>
			</Grid>

			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, mt: 5 }}>
				Earnings
			</Typography>

			<Card>
				<FinanceToolbar 
					chooseDate={chooseDate}
					onChooseDate={(date: Dayjs | null) => {  // ✅ Accepts Dayjs | null
						if (date) {
							setChooseDate(date.format('MM YYYY'));  // ✅ Convert Dayjs to string
							table.onResetPage();
						}
					}}
				/>

				<Scrollbar>
					<TableContainer sx={{ overflow: 'unset' }}>
						<Table sx={{ minWidth: 800 }}>
							<ActivityTableHead
								order={table.order}
								orderBy={table.orderBy}
								onSort={table.onSort}
								headLabel={[
									{ id: 'name', label: 'Activity Name' },
									{ id: 'earnedCredits', label: 'Credits Earned' },
									{ id: 'cash', label: 'Cash Earnings' }
								]}
							/>
							<TableBody>
								{groupedBookings
									.slice(
										earningsTable.page * earningsTable.rowsPerPage,
										earningsTable.page * earningsTable.rowsPerPage + earningsTable.rowsPerPage
									)
									.map((row) => (
									<EarningsRow key={row.activityName} row={row} />
								))}

								<TableEmptyRows
									height={68}
									emptyRows={emptyRows(table.page, table.rowsPerPage, _activity.length)}
								/>

								{!groupedBookings || groupedBookings.length === 0 ? <TableNoData searchQuery={filterName} /> : null}
							</TableBody>
							<TableBody>
								<TotalEarnings bookings={bookingsFiltered} />
							</TableBody>
						</Table>
					</TableContainer>
				</Scrollbar>
				<TablePagination
					component="div"
					page={earningsTable.page}
					count={groupedBookings.length}
					rowsPerPage={earningsTable.rowsPerPage}
					onPageChange={earningsTable.onChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={earningsTable.onChangeRowsPerPage}
				/>

			</Card>

			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, mt: 5 }}>
				Today&apos;s Activities
			</Typography>

			<Card>
				<TodayActivities
					filterName={filterName}
					onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
						setFilterName(event.target.value);
						table.onResetPage();
					}} />

				<Scrollbar>
					<TableContainer sx={{ overflow: 'unset' }}>
						<Table sx={{ minWidth: 800 }}>
							<ActivityTableHead
								order={table.order}
								orderBy={table.orderBy}
								onSort={table.onSort}
								headLabel={[
									{ id: 'name', label: 'Activity Name' },
									{ id: 'start', label: 'Start Time' },
									{ id: 'end', label: 'End Type' },
									{ id: 'signUps', label: 'Sign Ups' },
									{ id: '' },
								]}
							/>
							<TableBody>
								{dataFiltered
									.slice(
										table.page * table.rowsPerPage,
										table.page * table.rowsPerPage + table.rowsPerPage
									)
									.map((row) => (
										<ActivityTableRow
											row={row}
										/>
									))}

								<TableEmptyRows
									height={68}
									emptyRows={emptyRows(table.page, table.rowsPerPage, _activity.length)}
								/>

								{notFound && <TableNoData searchQuery={filterName} />}
							</TableBody>
						</Table>
					</TableContainer>
				</Scrollbar>

				<TablePagination
					component="div"
					page={table.page}
					count={dataFiltered.length}
					rowsPerPage={table.rowsPerPage}
					onPageChange={table.onChangePage}
					rowsPerPageOptions={[5, 10, 25]}
					onRowsPerPageChange={table.onChangeRowsPerPage}
				/>
			</Card>

			<Grid container spacing={3} sx={{ mt: 5 }}>
				<Grid xs={12} md={6} lg={4}>
					<AnalyticsCurrentVisits
						title="Activities Booked"
						chart={{
							series: [
								{ label: 'Activity 1', value: 3500 },
								{ label: 'Activity 2', value: 2500 },
								{ label: 'Activity 3', value: 1500 },
								{ label: 'Activity 4', value: 500 },
							],
						}}
					/>
				</Grid>

				<Grid xs={12} md={6} lg={8}>
					<AnalyticsWebsiteVisits
						title="Booking Volume"
						subheader="(+43%) than last year"
						chart={{
							categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
							series: [
								{ name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] }
							],
						}}
					/>
				</Grid>

				<Grid xs={12} md={6} lg={8}>
					<AnalyticsTasks title="Tasks" list={_tasks} />
				</Grid>
			</Grid>
		</DashboardContent>
	);
}

// ----------------------------------------------------------------------
type ApplyFilterProps = {
	inputData: ActivityProp[];
	filterName: string;
	comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filterName }: ApplyFilterProps) {
	const stabilizedThis = inputData.map((el, index) => [el, index] as const);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter(
			(user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	return inputData;
}

// ----------------------------------------------------------------------

type FinanceFilerProps = {
	inputData: BookingProp[];
	date: string;
	comparator: (a: any, b: any) => number;
}

export function applyFinanceFilter({ inputData, date, comparator }: FinanceFilerProps) {
	const chosenDayjs = date ? dayjs(date, 'MM YYYY') : null;

	const stabilizedThis = inputData.map((el, index) => [el, index] as const);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (chosenDayjs) {
		inputData = inputData.filter(
			(booking) => {
				const bookingDayjs = dayjs(booking.date, 'MM YYYY');
				return bookingDayjs.isSame(chosenDayjs, 'month') && bookingDayjs.isSame(chosenDayjs, 'year');
			}
		);
	}

	return inputData;
}

// ----------------------------------------------------------------------

export function groupBookingsByActivity(bookings: BookingProp[], cashPerCredit: number = 10): GroupedBooking[] {
    if (!bookings || bookings.length === 0) return [];
	const grouped: Record<string, GroupedBooking> = {};

    bookings.forEach((booking) => {
        if (!grouped[booking.activityName]) {
            grouped[booking.activityName] = {
                activityName: booking.activityName,
                totalCredits: 0,
                cashEarned: 0
            };
        }
        grouped[booking.activityName].totalCredits += Number(booking.creditSpent);
        grouped[booking.activityName].cashEarned = grouped[booking.activityName].totalCredits * cashPerCredit;
    });

    return Object.values(grouped);
}