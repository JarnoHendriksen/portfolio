export function Padding({amount}: {amount: string}) {
    return (
        <div style={{width: amount}}></div>
    )
}

export function FormatDate(date: Date) {
    let dateStr: string[] = date.toDateString().split(' ');

    return dateStr[1] + " " + dateStr[3];
}