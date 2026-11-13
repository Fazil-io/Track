export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(dateStr: string): {
  dayName: string;
  formattedDate: string;
  relative: string;
} {
  const date = parseDateKey(dateStr);
  const todayStr = formatDateKey(new Date());

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = dayNames[date.getDay()];
  const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  let relative = '';
  if (dateStr === todayStr) {
    relative = 'Today';
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === formatDateKey(yesterday)) {
      relative = 'Yesterday';
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (dateStr === formatDateKey(tomorrow)) {
        relative = 'Tomorrow';
      }
    }
  }

  return { dayName, formattedDate, relative };
}

export function getLast7DaysKeys(referenceDateKey?: string): string[] {
  const baseDate = referenceDateKey ? parseDateKey(referenceDateKey) : new Date();
  const keys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    keys.push(formatDateKey(d));
  }
  return keys;
}

export function getMonthDays(year: number, month: number): {
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  date: Date;
}[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay(); // 0 is Sunday
  const totalDays = lastDayOfMonth.getDate();

  const days: {
    dateKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    date: Date;
  }[] = [];

  // Previous month padding days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const date = new Date(year, month - 1, d);
    days.push({
      dateKey: formatDateKey(date),
      dayNumber: d,
      isCurrentMonth: false,
      date
    });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i);
    days.push({
      dateKey: formatDateKey(date),
      dayNumber: i,
      isCurrentMonth: true,
      date
    });
  }

  // Next month padding days to complete 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      dateKey: formatDateKey(date),
      dayNumber: i,
      isCurrentMonth: false,
      date
    });
  }

  return days;
}

