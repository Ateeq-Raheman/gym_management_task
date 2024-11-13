frappe.ui.form.on('Gym Locker Booking', {
    start_date: function (frm) {
        calculate_total_days_and_amount(frm);
    },
    end_date: function (frm) {
        calculate_total_days_and_amount(frm);
    }
});

function calculate_total_days_and_amount(frm) {
    if (frm.doc.start_date && frm.doc.end_date) {
        let start_date = new Date(frm.doc.start_date);
        let end_date = new Date(frm.doc.end_date);

        if (end_date < start_date) {
            frappe.msgprint(__('End Date cannot be earlier than Start Date.'));
            frm.set_value('total_no_of_days', 0);
            frm.set_value('total_amount', 0);
            return;
        }

        // Calculate total number of days (1 day = 24 * 60 * 60 * 1000 milliseconds)
        let time_difference = end_date - start_date;
        let total_days = Math.ceil(time_difference / (1000 * 60 * 60 * 24)) + 1;  // Include start day

        // Set total number of days
        frm.set_value('total_no_of_days', total_days);

        // Fetch the locker booking rate from Gym Settings and calculate the total amount
        frappe.db.get_single_value('Gym Settings', 'gym_locker_booking_amount').then(rate => {
            let total_amount = total_days * rate;
            frm.set_value('total_amount', total_amount);
        });
    } else {
        frm.set_value('total_no_of_days', 0);
        frm.set_value('total_amount', 0);
    }
}
