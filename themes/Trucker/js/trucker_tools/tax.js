var q = '4';
var y = '2015';

var qqyyyy = '0' + q + y;
var default_trip = '';
switch (q) {
    case '1':
        default_trip = '1st Quarter';
        break;
    case '2':
        default_trip = '2nd Quarter';
        break;
    case '3':
        default_trip = '3rd Quarter';
        break;
    case '4':
        default_trip = '4th Quarter';
        break;
    default:
        default_trip = 'my trip';
        break;
}
var ifta_free_calc = true;
var truck_id = 'free';
var truck_report = false;
var units = 's';
var truck_only = false;