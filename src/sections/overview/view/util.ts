import { BookingProp } from 'src/sections/Bookings/bookings-table-row';
import dayjs from 'dayjs';
import {GroupedBooking } from '../earnings';

export type ActivityProp = {
	_id: string;
	name: string;
	location: string;
	description: string;
	totalSlots: string;
	startDate: string;
	endDate: string;
	frequencyDay: string;
	frequencyTime: string;
	duration: string;
	creditCost: number;
	isOneTime: boolean;
	dateCreated: string;
	signUps: number;
	customers: string[];
	rating: number;
	isComplete: boolean;
	businessId: string;
	scheduleId: string;
};
// ----------------------------------------------------------------------
type ApplyFilterProps = {
	inputData: ActivityProp[];
	filterName: string;
	comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filterName }: ApplyFilterProps) {
	if (!inputData || inputData.length === 0) return [];
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
	comparator: (a: any, b: any) => number;
	confirmedFilter: string;
}

export function applyFinanceFilter({ inputData, comparator, confirmedFilter }: FinanceFilerProps) {
	if (!inputData || inputData.length === 0) return [];
	const stabilizedThis = inputData.map((el, index) => [el, index] as const);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	return inputData;
}

// ----------------------------------------------------------------------

export function groupBookingsByActivity(bookings: BookingProp[], cashPerCredit: number = 10): GroupedBooking[] {
	if (!bookings || bookings.length === 0) return [];
	const grouped: Record<string, GroupedBooking> = {};
	bookings.forEach((booking) => {
		if (!grouped[booking.activityId]) {
			grouped[booking.activityId] = {
				activityName: booking.activityName,
				totalCredits: 0,
				cashEarned: 0
			};
		}
		grouped[booking.activityId].totalCredits += Number(booking.creditSpent);
		grouped[booking.activityId].cashEarned = grouped[booking.activityId].totalCredits * cashPerCredit;
	});

	return Object.values(grouped);
}

// ----------------------------------------------------------------------
export type GroupedBookingPie = {
    activityName: string;
    counter: number;
};

export function groupBookingsByActivityPie(bookings: BookingProp[], cashPerCredit: number = 10): GroupedBookingPie[] {
	if (!bookings || bookings.length === 0) return [];
	const grouped: Record<string, GroupedBookingPie> = {};
	bookings.forEach((booking) => {
		if (!grouped[booking.activityId]) {
			grouped[booking.activityId] = {
				activityName: booking.activityName,
				counter: 0,
			};
		}
		grouped[booking.activityId].counter +=1;
	});

	return Object.values(grouped);
}