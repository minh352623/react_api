export default function sortByMonth(arr) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  arr.sort(function (a, b) {
    return months.indexOf(a) - months.indexOf(b);
  });
}
