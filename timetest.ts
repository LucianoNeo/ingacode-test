import { endOfDay, startOfDay, startOfMonth, endOfMonth } from 'date-fns';




const today = startOfDay(new Date('2023-01-14T11:06:17.267Z'));
const tomorrow = endOfDay(new Date('2023-01-13T11:06:17.267Z'));

console.log(today)