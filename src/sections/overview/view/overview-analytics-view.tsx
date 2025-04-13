import { useState, useCallback, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Card } from '@mui/material';

import { _tasks, _posts, _timeline, _activity } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { BookingProp } from 'src/sections/Bookings/bookings-table-row';
import { format } from 'date-fns';
import { Dayjs } from 'dayjs';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/sections/Bookings/view';
import { getComparator, emptyRows } from 'src/sections/Bookings/utils';
import { TableEmptyRows } from 'src/sections/Bookings/table-empty-rows';
import { TableNoData } from 'src/sections/Bookings/table-no-data';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { TodayActivities, ActivityTableHead, ActivityTableRow } from '../analytics-today-activities';
import { EarningsRow, FinanceToolbar, TotalEarnings } from '../earnings';
import {
	applyFilter, applyFinanceFilter, groupBookingsByActivity, ActivityProp,
	groupBookingsByActivityPie
} from './util';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const monthQueryStr = `?month=${mm}_${yyyy}`;
	const table = useTable();
	const earningsTable = useTable();
	const monthCategories = Array.from({ length: parseInt(mm, 10) }, (_, i) =>
		format(new Date(2024, i, 1), 'MMM')
	);

	const [filterName, setFilterName] = useState('');
	const [chooseDate, setChooseDate] = useState('');
	const [historyStats, setHistoryStats] = useState([]);
	const [thisMonthCredits, setThisMonthCredits] = useState(0);
	const [bookings, setBookings] = useState<BookingProp[]>([]);
	const [pieChartData, setPieChartData] = useState<any[]>([]);
	const [seriesData, setSeriesData] = useState<any[]>([]);
	const [todayActivities, setTodayActivities] = useState<ActivityProp[]>([]);
	const [selectedFilter, setSelectedFilter] = useState('');
	const [confirmedFilter, setConfirmedFilter] = useState("");
	useEffect(() => {
		const query = confirmedFilter !== "" ? `&activity=${confirmedFilter}` : "";
		fetch(`http://localhost:3000/api/bookings/biz${chooseDate}${query}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem("token")}`,
				},
			}
		).then((response) => response.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setBookings(data);
				} else {
					console.error('Server returned error response:', data);
					setBookings([]); // Set to empty array if not a valid bookings list
				}
			})
	}, [chooseDate, confirmedFilter]);
	useEffect(() => {
		fetch('http://localhost:3000/api/activities/today-activities',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => {
				if (res.ok) {
					return res.json();  // This returns a Promise
				}
				throw new Error('Network response was not ok');
			})
			.then((data) => {
				setTodayActivities(data);  // Now data is the resolved value from res.json()
			})
			.catch((error) => {
				console.error('Error fetching activities:', error);
			});
		fetch(`http://localhost:3000/api/bookings/biz${monthQueryStr}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((response) => response.json())
			.then((data) => {
				if (Array.isArray(data)) {
					let credit = 0;
					setPieChartData(groupBookingsByActivityPie(data));
					data.forEach((item) => {
						credit += item.creditSpent;
					});
					setThisMonthCredits(credit);
				}
			})
		fetch(`http://localhost:3000/api/bookings/historyStats${monthQueryStr}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setHistoryStats(data.monthly);
				}
			})
	}, [monthQueryStr]);

	useEffect(() => {
		const seriesDataNew = !pieChartData || pieChartData.length === 0
			? [
				{ label: 'Activity 1', value: 3500 },
				{ label: 'Activity 2', value: 2500 },
				{ label: 'Activity 3', value: 1500 },
				{ label: 'Activity 4', value: 500 },
			]
			: pieChartData.map((item) => {
				const label = item.activityName.split('(')[0].trim(); // safer than slice
				const value = item.counter;
				return { label, value };
			});
		setSeriesData(seriesDataNew);
	}, [pieChartData]);

	const dataFiltered: ActivityProp[] = applyFilter({
		inputData: todayActivities,
		comparator: getComparator(table.order, table.orderBy),
		filterName,
	});
	const notFound = !dataFiltered.length && !!filterName;

	const bookingsFiltered: BookingProp[] = applyFinanceFilter({
		inputData: bookings,
		comparator: getComparator(table.order, table.orderBy),
		confirmedFilter,
	});

	const groupedBookings = useMemo(() =>
		groupBookingsByActivity(bookingsFiltered), [bookingsFiltered]);
	const activityOptions = groupedBookings.map((group) => group.activityName);


	useEffect(() => {
		if (activityOptions.length > 0 && !selectedFilter) {
			setSelectedFilter(activityOptions[0]);
		}
	}, [activityOptions, selectedFilter]);

	const confirmFilter = () => {
		setConfirmedFilter(selectedFilter)
		console.log('Filter confirmed:', selectedFilter);
	}

	return (
		<DashboardContent maxWidth="xl">
			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
				Hi, Welcome back 👋
			</Typography>

			<Grid container spacing={3}>

				<Grid xs={12} sm={6}>
					<AnalyticsWidgetSummary
						title="Monthly Credits Earned"
						percent={(historyStats[historyStats.length - 1] - historyStats[historyStats.length - 2]) / historyStats[historyStats.length - 2] * 100}
						total={thisMonthCredits}
						color="warning"
						icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
						chart={{
							categories: monthCategories,
							series: historyStats,
						}}
					/>
				</Grid>

				<Grid xs={12} sm={6}>
					{/* TODO: Need to recalculate Ratings */}
					<AnalyticsWidgetSummary
						title="Ratings"
						percent={2.8}
						total={4.8}
						color="primary"
						icon={<img alt="icon" src="/assets/icons/glass/clipart3078264.png" />}
						chart={{
							categories: monthCategories,
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
					onChooseDate={(date: Dayjs | null) => {  // Accepts Dayjs | null
						if (date) {
							const formattedDate = `?month=${date.format('MM_YYYY')}`;
							setChooseDate(formattedDate);
							earningsTable.onResetPage();
						} else {
							setChooseDate('');
							earningsTable.onResetPage();
						}
						// Convert Dayjs to string
					}}
					selectedFilter={selectedFilter}
					onChangeActivity={(event: React.ChangeEvent<HTMLInputElement>) => {
						setSelectedFilter(event.target.value);
						earningsTable.onResetPage();
					}}
					activityOptions={activityOptions}
					confirmFilter={confirmFilter}
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

								{!groupedBookings || groupedBookings.length === 0 ? <TableNoData searchQuery={chooseDate} /> : null}
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
				<Grid xs={12}>
					<AnalyticsCurrentVisits
						title="Bookings For This Month"
						noData={!pieChartData || pieChartData.length === 0}
						chart={{ series: seriesData }}
					/>
				</Grid>
			</Grid>
		</DashboardContent>
	);
}