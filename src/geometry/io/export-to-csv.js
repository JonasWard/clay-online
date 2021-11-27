export function outputCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    for (const entry of window.coordinates) {
        csvContent += entry.toString() + "\r\n";
    };

    return csvContent;
}
