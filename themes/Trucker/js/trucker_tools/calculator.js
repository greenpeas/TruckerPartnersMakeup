var measurement_system = 'standard';
var MILES_TO_KM = 1.60934;
var GALLONS_TO_L = 3.78541;
var cancelBeforeUnload;
var trip_tax = 0;

function showMessage(msg) {
    jQuery('#message').text(msg).show();
    setTimeout(function () {
        jQuery('#message').hide();
    }, 2000);
}

function showError(msg, ctxt) {
    if (ctxt != undefined) {
        jQuery('#error', ctxt).text(msg).show();
        setTimeout(function () {
            jQuery('#error', ctxt).hide();
        }, 5000);
    } else {

        jQuery('#error').text(msg).show();
        setTimeout(function () {
            jQuery('#error').hide();
        }, 5000);
    }
}

function precise_round(num, decimals) {
    if (num === Infinity)
        return 0;
    if (decimals === undefined)
        decimals = 0;
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function setMeasurementSystem(system) {
    if (measurement_system !== system) {
        jQuery('.measurement-system-text').toggleClass('hide');

        measurement_system = system;
        jQuery('ul#measurement_system li').removeClass('active');
        jQuery('ul#measurement_system li#' + system).addClass('active');

        var vol_x, dist_x;
        if (system === 'metric') {
            vol_x = GALLONS_TO_L;
            dist_x = MILES_TO_KM;
        } else {
            vol_x = 1 / GALLONS_TO_L;
            dist_x = 1 / MILES_TO_KM;
        }

        jQuery('td.taxable_miles, td.nontaxable_miles').each(function (i, e) {
            if (jQuery.isNumeric(jQuery(e).html())) {
                var val = parseFloat(jQuery(e).html());
                jQuery(e).html(precise_round(val * dist_x, 0));
            }
        });
        jQuery('td.paid_gallons').each(function (i, e) {
            if (jQuery.isNumeric(jQuery(e).html())) {
                var val = parseFloat(jQuery(e).html());
                jQuery(e).html(precise_round(val * vol_x, 0));
            }
        });


        recalculateForm();
    }
}

function recalculateForm() {
    var total_gallons = 0;
    var total_miles = 0;
    var mpg = 0;
    var vol_x = 1;
    var dist_x = 1;
    if (measurement_system === 'metric') {
        dist_x = MILES_TO_KM;
        vol_x = GALLONS_TO_L;
    }
    for (trip_number in trips) {
        var t = trips[trip_number];
        var g = gas[trip_number];
        if (!t)
            continue;

        total_miles += precise_round(parseFloat(t.total_miles), 3);
        total_gallons += precise_round(parseFloat(t.total_gas), 3);

        jQuery('table#trips tr[trip-number="' + trip_number + '"]').each(function () {
            var truck_id = jQuery(this).attr('truck-id');
            var t_miles = 0;
            var t_gas = 0;
            if (typeof (t.mileage) != 'undefined') {
                for (i = 0; i < t.mileage.length; i++) {
                    if (t.mileage[i] === undefined)
                        continue;
                    if (ifta_free_calc || t.mileage[i].truck_id == truck_id) {
                        if (typeof (t.mileage[i]) == 'undefined')
                            continue;
                        if (typeof (t.mileage[i].taxable_miles) != 'undefined')
                            t_miles += t.mileage[i].taxable_miles;
                        if (typeof (t.mileage[i].nontaxable_miles) != 'undefined')
                            t_miles += t.mileage[i].nontaxable_miles;
                    }
                }
                jQuery('td.miles', this).html(precise_round(t_miles * dist_x, 0));
            }
            if (typeof (t.gas) != 'undefined') {
                for (i = 0; i < t.gas.length; i++) {
                    if (t.gas[i] === undefined)
                        continue;
                    if (ifta_free_calc || t.gas[i].truck_id == truck_id) {
                        if (typeof (t.gas[i]) == 'undefined')
                            continue;
                        if (typeof (t.gas[i].paid_gallons) != 'undefined')
                            t_gas += t.gas[i].paid_gallons;
                    }
                }
                jQuery('td.gallons', this).html(precise_round(t_gas * vol_x, 0));
            }
        });

        //assumes one truck per trip. 
        //jQuery('table#trips tr[trip-number="'+trip_number+'"] td.miles').html(precise_round(t.total_miles*dist_x, 0));
        //jQuery('table#trips tr[trip-number="'+trip_number+'"] td.gallons').html(precise_round(t.total_gas*vol_x, 0));
    }

    mpg = (total_miles * dist_x) / (total_gallons * vol_x);
    if (isNaN(mpg) || total_miles === 0 || total_gallons === 0) {
        mpg = 0;
        jQuery('button.report').addClass('disabled');
    } else {
        jQuery('button.report').removeClass('disabled');
    }

    jQuery('#mpg').text(precise_round(mpg, 2).toFixed(2));

    average_mpg = mpg;

    calculateFinalReport(false);
    return mpg;
}
var trips = {};
var gas = {};
var average_mpg;

function saveTripMileage() {
    var d = jQuery('div#miles');
    var t_number = jQuery('select#trip_number :selected', d).attr('trip-number');

    if (ifta_free_calc) {
        t_number = default_trip;
    }
    lastUsedTrip = jQuery('select#trip_number', d).val();
    var trip = trips[t_number];
    var j = jQuery('select#jurisdiction option:selected', d);
    var truck_id = jQuery('select#trip_number option:selected', d).attr('truck-id');
    var m = {
        jurisdiction: j.attr('abbr'),
        rate: j.attr('rate'),
        surcharge: j.attr('surcharge'),
        jurisdiction_id: j.val(),
        truck_id: truck_id
    };
    jQuery('input', d).each(function (i, e) {
        var _v = jQuery(e).val();
        if (jQuery.isNumeric(_v))
            m[jQuery(e).attr('name')] = precise_round(parseFloat(_v));
    });

    if ((t_number == '' || t_number == undefined) && !ifta_free_calc) {
        jQuery('select#trip_number', d).parents('.control-group').addClass('error');
        showError('Please select a trip');
        return;
    } else {
        jQuery('select#trip_number', d).parents('.control-group').removeClass('error');
    }
    if (m.nontaxable_miles === '' || isNaN(m.nontaxable_miles)) {
        if (m.taxable_miles === '' || isNaN(m.taxable_miles)) {
            jQuery('input#nontaxable_miles, input#taxable_miles').parents('.control-group').addClass('error');
            return;
        }
    }
    jQuery('input#nontaxable_miles, input#taxable_miles').parents('.control-group').removeClass('error');

    if (m.jurisdiction_id === '') {
        jQuery('select#jurisdiction', d).parents('.control-group').addClass('error');
        return;
    }
    jQuery('select#jurisdiction', d).parents('.control-group').removeClass('error');

    if (trip.mileage === undefined) {
        trip.mileage = [m];
    } else {
        trip.mileage.push(m);
    }

    if (!isNaN(m.nontaxable_miles) && m.nontaxable_miles !== '')
        trip.total_miles += precise_round(parseFloat(m.nontaxable_miles));
    if (!isNaN(m.taxable_miles) && m.taxable_miles !== '')
        trip.total_miles += precise_round(parseFloat(m.taxable_miles));
    jQuery('table#trips tr[trip-number="' + t_number + '"][truck-id="' + truck_id + '"] td.miles').html(trip.total_miles);

    //update db
    if (typeof (saveLogEntry) === 'function') {
        saveLogEntry('mileage', jQuery.extend(m, {
            trip_number: t_number,
            qqyyyy: qqyyyy

        }));
    }

    showMessage('Saving...');
    //update table
    var tr = jQuery('table#trip_summary tbody tr:first').clone();
    tr.attr('mileage-number', (trip.mileage.length - 1));
    tr.attr('truck-id', truck_id);
    jQuery('td.trip_number', tr).html(trip.trip_number);
    jQuery('td.taxable_miles', tr).html(m.taxable_miles);
    jQuery('td.nontaxable_miles', tr).html(m.nontaxable_miles);
    jQuery('td.jurisdiction', tr).html(m.jurisdiction);
    jQuery('table#trip_summary tbody').append(tr);

    jQuery('button', tr).each(function (i, e) {
        jQuery(e).attr('trip-number', trip.trip_number);
        jQuery(e).attr('trip-mileage', trip.mileage.length - 1);
    });
    tr.show();
    recalculateForm();
    jQuery('input, select', d).val('');
    d.attr('id', 'trip_mileage_' + (trip.mileage.length - 1));
    d.hide();

    jQuery('#btn_add_mileage').removeClass('disabled').removeAttr('disabled');

    setTripDropdowns(t_number);
}

function setTripDropdowns(trip) {
    if (trip == '' || trip == undefined)
        return;
    jQuery('#gas_prototype select#trip_number option, #trip_prototype select#gas_prototype option').removeAttr('selected');
    jQuery('#gas_prototype select[name=trip_number] option, #trip_prototype select[name=trip_number] option').each(function () {
        if (jQuery(this).val() === trip)
            jQuery(this).prop('selected', true);
        else
            jQuery(this).removeProp('selected');

    });

}

function saveGas() {
    var d = jQuery('div#gallons:visible');

    var g = {};
    var t_number = jQuery('select#trip_number :selected', d).attr('trip-number');
    lastUsedTrip = jQuery('select#trip_number', d).val();
    g.trip_number = t_number;
    var trip = trips[g.trip_number];
    var truck_id = jQuery('select#trip_number option:selected', d).attr('truck-id');

    jQuery('input, select', d).each(function (i, e) {
        var _v = jQuery(e).val();
        if (jQuery.isNumeric(_v))
            g[jQuery(e).attr('name')] = precise_round(parseFloat(_v));
    });

    var j = jQuery('select#jurisdiction option:selected', d);
    g.jurisdiction = j.attr('abbr');
    g.rate = j.attr('rate');
    g.surcharge = j.attr('surcharge');
    g.jurisdiction_id = j.val();
    if (g.paid_gallons === '' || isNaN(g.paid_gallons)) {
        jQuery('input#paid_gallons').parents('.control-group').addClass('error');
        return;

    }
    jQuery('input#paid_gallons').parents('.control-group').removeClass('error');
    if ((trip_number == '' || trip_number == undefined) && !ifta_free_calc) {
        jQuery('select#trip_number', d).parents('.control-group').addClass('error');
        showError('Please select a trip');
        return;
    } else {
        jQuery('select#trip_number', d).parents('.control-group').removeClass('error');
    }

    if (g.jurisdiction_id === '') {

        jQuery('select#jurisdiction', d).parents('.control-group').addClass('error');
        return;
    }
    jQuery('select#jurisdiction', d).parents('.control-group').removeClass('error');

    if (trip.gas === undefined) {
        trip.gas = [g];
    } else {
        trip.gas.push(g);
    }


    jQuery('input, select', d).val('');
    d.hide();
    d.attr('id', 'trip_gas_' + trip.gas.length - 1);

    if (!isNaN(g.paid_gallons) && g.paid_gallons !== '')
        trip.total_gas += parseFloat(g.paid_gallons);
    jQuery('table#trips tr[trip-number="' + t_number + '"] td.gallons').html(trip.total_gas);

    //update table
    var tr = jQuery('table#gas_summary tbody tr:first').clone();
    tr.attr('trip-number', g.trip_number);
    tr.attr('truck-id', truck_id);
    jQuery('td.trip_number', tr).html(g.trip_number);
    jQuery('td.paid_gallons', tr).html(g.paid_gallons);
    jQuery('td.jurisdiction', tr).html(g.jurisdiction);
    jQuery('table#gas_summary tbody').append(tr);

    //save to db
    if (typeof (saveLogEntry) === 'function') {
        saveLogEntry('gas', jQuery.extend(g, {
            trip_number: t_number,
            qqyyyy: qqyyyy,
            truck_id: truck_id
        }));
    }

    showMessage('Saving...');

    jQuery('button', tr).each(function (i, e) {
        jQuery(e).attr('trip-number', g.trip_number);
        jQuery(e).attr('trip-gas', trip.gas.length - 1);
    });
    tr.show();

    recalculateForm();
    jQuery('#btn_add_gas').removeClass('disabled').removeAttr('disabled');

    setTripDropdowns(t_number);
}


function editTripMileage(e) {
    var tn = jQuery(e).attr('trip-number');
}

function deleteTripMileage(e) {
    var tn = jQuery(e).attr('trip-number');
    var tm = jQuery(e).attr('trip-mileage');
    var tr = jQuery(e).parents('tr');

    var log_id = tr.attr('data-log-id');
    var taxable_miles = jQuery('td.taxable_miles', tr).text();
    var nontaxable_miles = jQuery('td.nontaxable_miles', tr).text();

    var t = trips[tn];
    if (!jQuery.isEmptyObject(t)) {
        delete t.mileage[tm];
    }
    if (jQuery.isNumeric(taxable_miles)) {
        t.total_miles -= parseFloat(taxable_miles);
    }
    if (jQuery.isNumeric(nontaxable_miles)) {
        t.total_miles -= parseFloat(nontaxable_miles);
    }

    if (log_id !== '' && log_id !== undefined && typeof (deleteLogEntry) === 'function') {
        deleteLogEntry(log_id);
    }

    jQuery(e).parents('tr').remove();
    jQuery('div#mileage div#trip_' + tn).remove();

    recalculateForm();
}

function deleteGas(e) {
    var tn = jQuery(e).attr('trip-number');
    var tg = jQuery(e).attr('trip-gas');

    var tr = jQuery(e).parents('tr');
    var log_id = tr.attr('data-log-id');
    var gallons = jQuery('td.paid_gallons', tr).text();

    var t = trips[tn];
    if (!jQuery.isEmptyObject(t)) {
        delete t.gas[tg];
    }
    if (jQuery.isNumeric(gallons)) {
        t.total_gas -= parseFloat(gallons);
    }

    if (log_id !== '' && log_id !== undefined && typeof (deleteLogEntry) === 'function') {
        deleteLogEntry(log_id);
    }
    jQuery(e).parents('tr').remove();
    jQuery('div#gas div#trip_' + tn).remove();

    recalculateForm();

}

function newTrip(trip_name, t_id, _truck_name, status_flag) {

    var flag = 'A';
    if (typeof (status_flag) != 'undefined') {
        flag = status_flag;
    }
    var d = jQuery('div#newTrip');
    var tname = jQuery('#txt_trip_name', d).val();
    var truck_id = jQuery('#truck_id', d).val();
    var truck_name = jQuery('#truck_id option:selected', d).html();

    if (typeof (_truck_name) != 'undefined') {
        truck_name = _truck_name;
    }

    if (truck_id === undefined || truck_id == '')
        truck_id = t_id;
    if (trip_name !== undefined)
        tname = trip_name;
    if (tname === '' && !ifta_free_calc) {
        showError('Please enter a trip number', jQuery('#newTrip'));
        return;
    }

    if ((truck_id == undefined || truck_id == '') && !ifta_free_calc) {
        showError('Please select a truck', jQuery('#newTrip'));
        return;
    }

    //check for uniqueness
    if (trips[tname] !== undefined) {
        if (trips[tname].truck_id === truck_id) {
            showError('A trip with this name already exists for the selected truck', jQuery('#newTrip'));
            return;
        }
    }

    var tr = jQuery('table#trips tbody tr:first').clone();
    tr.attr('trip-number', tname);
    tr.attr('truck-id', truck_id);
    jQuery('td.trip_number', tr).html(tname);
    jQuery('td.truck', tr).html(truck_name);
    jQuery('td.miles', tr).html('0');
    jQuery('td.gallons', tr).html('0');
    jQuery('td.actions button', tr).attr('trip-number', tname);
    jQuery('table#trips tbody tr.mpg_summary').before(tr);
    if (flag == 'A') {
        jQuery('select#trip_number').append('<option value="' + tname + '_' + truck_id + '" truck-id="' + truck_id + '" trip-number="' + tname + '" >' + tname + ' (' + truck_name + ')</option>');
    }
    jQuery('select#trip_number').val(tname + '_' + truck_id);

    if (trips[tname] === undefined) {
        trips[tname] = {total_miles: 0, total_gas: 0, trip_number: tname, truck_id: truck_id, truck_name: truck_name, status_flag: flag};
    }
    jQuery('#txt_trip_name', d).val('');
    tr.show();
    jQuery('#newTrip').modal('hide');
    filterOnTruck(truck_id);
    return trips[tname];

}



function showTripDialog() {
    jQuery('#newTrip').modal('show');
}

function deleteTrip(e) {
    if (e === '' || e === undefined)
        return;
    var tname = jQuery(e).attr('trip-number');
    if (e === '' || e === undefined)
        return;

    trips[tname] = undefined;
    jQuery('table#trips tbody tr[trip-number=' + tname + ']').remove();
    jQuery('table#trip_summary tbody tr:visible, table#gas_summary tbody tr:visible').each(function (i, e) {
        var log_id = jQuery(e).attr('data-log-id');
        if (log_id !== '' && log_id !== undefined && typeof (deleteLogEntry) === 'function') {
            deleteLogEntry(log_id);
        }

        if (jQuery(e).attr('trip-number') === tname) {
            jQuery(e).remove();
        }

    });
    jQuery('select#trip_number option[trip-number="' + tname + '"]').remove();
}

function newTripMileage() {

    if (jQuery('div#miles:visible').length > 0)
        return;
    var d = jQuery('#trip_prototype').clone();
    jQuery('input.submit-form-on-enter', d).each(function () {
        var id = jQuery(this).attr('data-button-id');
        if (jQuery('#' + id).length === 1) {
            jQuery(this).keypress(function (event) {
                if (event.which == 13) {
                    jQuery('#' + id).click();
                }
            });
        }
    });
    jQuery('.integer', d).keyup(function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    if (typeof (lastUsedTrip) != 'undefined')
        jQuery('select#trip_number', d).val(lastUsedTrip);
    jQuery('select#trip_number', d).change(tripNumberChange);
    tripNumberChange.call(jQuery('select#trip_number', d));
    jQuery('div#mileage').append(d);
    d.attr('id', 'miles');
    d.show();
    jQuery('#btn_add_mileage').addClass('disabled').attr('disabled');

}

function newGas() {
    if (jQuery('div#gallons:visible').length > 0)
        return;
    var d = jQuery('#gas_prototype').clone();

    jQuery('input.submit-form-on-enter', d).each(function () {
        var id = jQuery(this).attr('data-button-id');
        if (jQuery('#' + id).length == 1) {
            jQuery(this).keypress(function (event) {
                if (event.which == 13) {
                    jQuery('#' + id).click();
                }
            });
        }
    });

    jQuery('.integer', d).keyup(function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });


    jQuery('div#gas').append(d);
    if (typeof (lastUsedTrip) != 'undefined')
        jQuery('select#trip_number', d).val(lastUsedTrip);
    jQuery('select#trip_number', d).change(tripNumberChange);
    //tripNumberChange.call(jQuery('select#trip_number', d));

    d.attr('id', 'gallons');
    d.show();
    jQuery('#btn_add_gas').addClass('disabled').attr('disabled')
}

function validateForm(seterror) {
    var valid = true;
    var p = jQuery('div.tab-content div.tab-pane:visible');
    jQuery.each(jQuery('input,select', p), function (i, e) {
        if (jQuery(e).hasClass('required') && (jQuery(e).val() == '' || jQuery(e).val() == undefined)) {
            valid = false;
            if (seterror) {
                jQuery(e).parents('.control-group').addClass('error');
            }
        }
    });

    return valid;
}

function fieldChanged() {
    if (jQuery(this).val() == '') {
        jQuery(this).parents('.control-group').addClass('error');
    } else {
        if (validateForm(false)) {
            jQuery(this).parents('.control-group').removeClass('error');
            jQuery('ul#formTabs li.disabled').removeClass('disabled');
        }
    }
}

function submitEmail() {
    if (!jQuery('#agree').is(':checked')) {
        jQuery('#email_error').text('Please accept the terms and conditions.');
        jQuery('#agree').addClass('error');
        jQuery('#email_error').show();
        return;
    } else {
        jQuery('#email_error').text('');
        jQuery('#agree').removeClass('error');
        jQuery('#email_error').hide();
    }
    if (typeof (saveTrips) == 'function') {
        saveTrips.call();
    }

    var rxEmail = new RegExp(/^\S+@\S+\.\S+$/);
    if (!rxEmail.test(jQuery('#email').val())) {
        jQuery('#email').addClass('error');
        jQuery('div#email_error').text('Invalid email address');
        jQuery('div#email_error').show();
        return;

    } else {
        jQuery('div#email_error').text('');
        jQuery('div#email_error').hide();
    }

}

function showSurvey() {
    if (jQuery('#survey').length != 0) {
        jQuery('#modal_survey').modal('show');
    }
}

function checkConditions() {
    if (jQuery('input:checkbox#agree').is(':checked')) {
        jQuery('a.final-report-button').removeClass('disabled').removeAttr('disabled');
    } else {
        jQuery('a.final-report-button').addClass('disabled').attr('disabled');
    }
}

function printFinalReport() {

    var table = jQuery('#report_table_wrapper').clone();
    var data = '<html><head><style>table { border: 1px solid #000; } table thead tr td { font-weight: bold; } table tr td { border: 1px solid #000; } .hide { display:none; }</style></head>' +
        '<body>' + table[0].innerHTML + '</body></html>';
    
    $.ajax({
      url: 'index.php?r=trucker_tools/default/gen_pdf',
      type:'POST',
      data: {
        data: data
      },
      success: function(data){
        window.open("index.php?r=trucker_tools/default/download&file="+data);
        //document.location.href = "index.php?r=trucker_tools/default/download&file="+data;
      }
    });
}

function confirmFinalReport() {
    cancelBeforeUnload = true;
    jQuery('table#final_report_table').hide();
    jQuery('div#report_disclaimer').show();
    jQuery('div#final_report div.modal-footer a.btn').addClass('disabled');
    cancelBeforeUnload = false;
    return false;
}

function calculateFinalReport(show) {

    jQuery('td.company_name').text(jQuery('input#trucking_company').val());

    var report_data = [];
    var vol_x = 1;
    var dist_x = 1;
    var total_nontaxable_miles = 0;
    var total_taxable_miles = 0;
    var total_paid_gallons = 0;
    var total_taxable_gallons = 0;
    var total_net_taxable_gallons = 0;
    var total_surcharge = 0;
    var total_miles = 0;
    //var penalty = 0;
    trip_tax = 0;
    if (measurement_system === 'metric') {
        dist_x = MILES_TO_KM;
        vol_x = GALLONS_TO_L;
    }

    for (tname in trips) {
        var trip = trips[tname];
        var taxable_miles = 0;
        var nontaxable_miles = 0;
        if (typeof (trip.mileage) != 'undefined') {
            for (var m = 0; m < trip.mileage.length; m++) {
                var tmiles = 0;
                var ntmiles = 0;
                if (trip.mileage[m] === undefined)
                    continue;
                var j_id = trip.mileage[m].jurisdiction_id;
                if (jQuery.isNumeric(trip.mileage[m].taxable_miles)) {
                    tmiles = trip.mileage[m].taxable_miles;
                }

                if (jQuery.isNumeric(trip.mileage[m].nontaxable_miles)) {
                    ntmiles = trip.mileage[m].nontaxable_miles;
                }

                if (report_data[j_id] === undefined) {
                    report_data[j_id] = {
                        taxable_miles: parseFloat(tmiles),
                        nontaxable_miles: parseFloat(ntmiles),
                        rate: parseFloat(trip.mileage[m].rate),
                        surcharge: parseFloat(trip.mileage[m].surcharge),
                        paid_gallons: 0
                    };
                } else {
                    report_data[j_id].taxable_miles += parseFloat(tmiles);
                    report_data[j_id].nontaxable_miles += parseFloat(ntmiles);
                }
                total_taxable_miles += parseFloat(tmiles);
                total_nontaxable_miles += parseFloat(ntmiles);
            }
        }
        if (typeof (trip.gas) != 'undefined') {
            for (var g = 0; g < trip.gas.length; g++) {
                if (trip.gas[g] === undefined)
                    continue;
                var j_id = trip.gas[g].jurisdiction_id;
                var gallons = 0;
                if (jQuery.isNumeric(trip.gas[g].paid_gallons)) {
                    gallons = trip.gas[g].paid_gallons;
                }
                if (report_data[j_id] === undefined) {
                    report_data[j_id] = {
                        taxable_miles: 0,
                        nontaxable_miles: 0,
                        rate: jQuery.isNumeric(trip.gas[g].rate) ? parseFloat(trip.gas[g].rate) : 0,
                        surcharge: 0,
                        paid_gallons: parseFloat(gallons)

                    };
                } else {
                    report_data[j_id].paid_gallons += parseFloat(gallons);
                }
                total_paid_gallons += parseFloat(gallons);
            }
        }
    }
    total_miles = total_taxable_miles + total_nontaxable_miles;


    average_mpg = precise_round(average_mpg, 2);
    jQuery('table#final_report_table tbody tr').each(function (i, e) {
        var j_id = jQuery(e).attr('jurisdiction');
        var is_surcharge = jQuery(e).hasClass('surcharge');
        var data = report_data[j_id];

        if (data !== undefined) {
            if (isNaN(data.rate))
                data.rate = 0;
            jQuery('td.ifta_miles', e).html(precise_round(parseFloat(data.taxable_miles) * dist_x, 0) + precise_round(parseFloat(data.nontaxable_miles) * dist_x, 0));
            jQuery('td.taxable_miles', e).html(precise_round(parseFloat(data.taxable_miles) * dist_x, 0));
            var taxable_gallons = 0;
            if (average_mpg > 0) {
                taxable_gallons = precise_round(data.taxable_miles / average_mpg, 0);
            }
            if (!is_surcharge) {
                jQuery('td.taxable_gallons', e).html(precise_round(taxable_gallons * vol_x, 0));
                total_taxable_gallons += parseFloat(precise_round(taxable_gallons * vol_x, 0));
                jQuery('td.paid_gallons', e).html(precise_round(parseFloat(data.paid_gallons) * vol_x, 0));
            }
            var net_taxable_gallons = taxable_gallons - data.paid_gallons;
            var total_tax = net_taxable_gallons * data.rate;
            var surcharge = 0;

            if (data.surcharge > 0 && is_surcharge) {
                surcharge = data.surcharge * precise_round(((parseFloat(data.taxable_miles) * dist_x)) / average_mpg, 0);
                total_tax = surcharge;
                jQuery('td.tax_subtotal', e).removeClass('negative').html('$' + precise_round(surcharge, 2).toFixed(2));
                jQuery('td.total_due', e).removeClass('negative').html('$' + precise_round(surcharge, 2).toFixed(2));
                trip_tax += parseFloat(total_tax.toFixed(3));
            } else if (!is_surcharge) {
                total_surcharge += surcharge;
                trip_tax += parseFloat(total_tax.toFixed(3));
                if (net_taxable_gallons < 0) {
                    jQuery('td.net_taxable_gallons', e).addClass('negative').html('(' + precise_round(parseFloat(net_taxable_gallons) * vol_x, 0) + ')');
                    jQuery('td.tax_subtotal', e).addClass('negative').html('($' + precise_round(total_tax, 2).toFixed(2) + ')');
                    jQuery('td.total_due', e).addClass('negative').html('($' + precise_round(total_tax, 2).toFixed(2) + ')');
                } else {
                    jQuery('td.net_taxable_gallons', e).removeClass('negative').html(precise_round(parseFloat(net_taxable_gallons) * vol_x, 0));
                    jQuery('td.tax_subtotal', e).removeClass('negative').html('$' + precise_round(total_tax, 2).toFixed(2));
                    jQuery('td.total_due', e).removeClass('negative').html('$' + precise_round(total_tax, 2).toFixed(2));
                }
                total_net_taxable_gallons += net_taxable_gallons;
            }

            //var jpenalty = calculatePenalty(total_tax);
            //penalty += jpenalty;

            jQuery(e).removeClass('hide');
        } else if (!jQuery(e).hasClass('totals')) {
            jQuery(e).addClass('hide');

        }
    });
    if (trip_tax == Infinity) {
        trip_tax = 0;
    }
    if (total_miles == 0) {
        trip_tax = 0;
    }


    trip_tax = parseFloat(trip_tax.toFixed(3));
    jQuery('td.total_tax, span#running_total_tax, tr.totals td#total_surcharge').text('$' + trip_tax.toFixed(2));
    jQuery('td.mpg').text(isNaN(average_mpg) ? '0' : precise_round(average_mpg, 2).toFixed(2));
    jQuery('td.total_miles').text(precise_round(total_miles, 0));
    jQuery('td.total_non_ifta_miles').text(precise_round(total_nontaxable_miles, 0));
    jQuery('tr.totals td#total_taxable_miles').text(precise_round(total_taxable_miles, 0));
    jQuery('tr.totals td#total_ifta_miles').text(precise_round(total_taxable_miles, 0) + precise_round(total_nontaxable_miles, 0));
    jQuery('tr.totals td#total_nontaxable_miles').text(precise_round(total_nontaxable_miles, 0));
    jQuery('tr.totals td#total_taxable_gallons').text(precise_round(total_taxable_gallons, 0));
    jQuery('tr.totals td#total_net_taxable_gallons').text(precise_round(total_net_taxable_gallons, 0));
    jQuery('tr.totals td#total_paid_gallons').text(precise_round(total_paid_gallons, 0));
    //jQuery('tr.totals td#total_surcharge').text('$' + precise_round(total_surcharge, 0));

    if (trip_tax > 0) {
        jQuery('div#total_tax_wrapper').removeClass('alert-info alert-success');
        jQuery('div#total_tax_wrapper').addClass('alert-error');
    } else if (trip_tax < 0) {
        jQuery('div#total_tax_wrapper').removeClass('alert-info alert-error');
        jQuery('div#total_tax_wrapper').addClass('alert-success');
    } else if (trip_tax = 0) {
        jQuery('div#total_tax_wrapper').removeClass('alert-success alert-error');
        jQuery('div#total_tax_wrapper').addClass('alert-info');
    }

    if (show) {
        jQuery('div#final_report').modal('show');
    }
}

function showFinalReport() {
    jQuery('table#final_report_table').show();
    jQuery('div#report_disclaimer').hide();
    jQuery('div#final_report div.modal-footer a.btn').removeClass('disabled');
    calculateFinalReport(true);
}

function clearAll() {
    if (confirm('Are you sure? \r\n You will lose all info you entered for this quarter.')) {
        jQuery('#reset').val('true');
        jQuery('#freeIftaCalculator').submit();

    }
}

function tripNumberChange() {
    var truck_id = jQuery(':selected', this).attr('truck-id');
    filterOnTruck(truck_id);
    jQuery('#current_truck').val(truck_id);
}

function filterOnTruck(truck_id) {
    if (typeof (truck_id) === 'undefined')
        return;

    if (truck_id === '') {
        jQuery('table#trips tbody tr').show();
        jQuery('table#gas_summary tbody tr').show();
        jQuery('table#trip_summary tbody tr').show();
        jQuery('table#trip_summary tbody tr:first, table#trips tbody tr:first, table#gas_summary tbody tr:first').hide();
    } else {
        jQuery('table#trips tbody tr, table#trip_summary tbody tr, table#gas_summary tbody tr').hide();
        jQuery('table#trips tbody tr[truck-id=' + truck_id + ']').show();
        jQuery('table#trips tbody tr.mpg_summary').show();
        jQuery('table#trip_summary tbody tr[truck-id=' + truck_id + ']').show();
        jQuery('table#gas_summary tbody tr[truck-id=' + truck_id + ']').show();

    }
}

jQuery(document).ready(function () {
    jQuery('form#freeIftaCalculator input').blur(recalculateForm);
    jQuery('form#freeIftaCalculator select').change(recalculateForm);
    jQuery('ul#formTabs').tab();
    jQuery('ul#formTabs li a').click(function (e) {
        if (!validateForm(true) && jQuery(e.target).attr('data-toggle') !== 'dropdown') {
            e.preventDefault();
            return false;
        } else {
            jQuery('ul#formTabs li.disabled').removeClass('disabled');
        }
    });
    jQuery('input.required').blur(fieldChanged);
    jQuery('select.required').change(fieldChanged);
    jQuery('g').modal({show: false});

    if (default_trip != '') {
        trip_name = default_trip;
        newTrip(trip_name, 0);
    }

    jQuery(window).bind('beforeunload', function (e) {
        if (cancelBeforeUnload)
            return;
        if (typeof (trip_name) == 'undefined')
            return;
        if (jQuery.isEmptyObject(trips) || trips[trip_name].total_miles > 0 || trips[trip_name].total_gas > 0) {

            if (ifta_free_calc)
                return 'If you leave now your data will not be saved.';
        }

    });

    jQuery('input#trucking_company').keypress(function (event) {
        if (event.which == 13) {
            $('#formTabs a#mileage-link').tab('show');
        }
    });

    if (jQuery('#survey').length > 0) {
        jQuery('#survey').appendTo('#modal_survey .modal-body');
        jQuery('#survey').show();
    }

    jQuery('#txt_trip_name').keypress(function (event) {
        if (event.which == 13) {
            newTrip();
            return false;
        }
    })

    jQuery('#email').keypress(function (event) {
        if (event.which == 13) {
            submitEmail();
            return false;
        }
    });

    jQuery('select#current_truck').change(function () {
        filterOnTruck(jQuery(this).val());

    });

});