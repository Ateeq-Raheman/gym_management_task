// Copyright (c) 2024, ateeq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gym Membership', {
    // Trigger when membership type is changed or the form is loaded/refreshed
    refresh: function (frm) {
        frm.trigger('calculate_membership');
    },

    membership_type: function (frm) {
        frm.trigger('calculate_membership');
    },

    calculate_membership: function (frm) {
        let today = frappe.datetime.get_today();

        if (!frm.doc.start_date) {
            frm.set_value('start_date', today);
        }

        let membership_type = frm.doc.membership_type;
        let end_date = null;

        if (membership_type === '1 Month') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 1);
        }
        else if (membership_type === '2 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 2);
        }
        else if (membership_type === '3 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 3);
        }
        else if (membership_type === '4 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 4);
        }
        else if (membership_type === '5 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 5);
        }
        else if (membership_type === '6 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 6);
        }
        else if (membership_type === '7 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 7);
        }
        else if (membership_type === '8 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 8);
        }
        else if (membership_type === '9 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 9);
        }
        else if (membership_type === '10 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 10);
        }
        else if (membership_type === '11 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 11);
        }
        else if (membership_type === '12 Months') {
            end_date = frappe.datetime.add_months(frm.doc.start_date || today, 12);
        }

        frm.set_value('end_date', end_date);

        // Set price
        let prices = {
            '1 Month': 1000,
            '2 Months': 2000,
            '3 Months': 3000,
            '4 Months': 4000,
            '5 Months': 5000,
            '6 Months': 6000,
            '7 Months': 7000,
            '8 Months': 8000,
            '9 Months': 9000,
            '10 Months': 10000,
            '11 Months': 11000,
            '12 Months': 12000,
        };

        frm.set_value('price', prices[membership_type] || 0);
    },

    start_date: function (frm) {
        // Recalculate the end date if the start date changes manually
        frm.trigger('calculate_membership');
    },

    validate: function (frm) {
        // Get today's date in the correct format and convert it to a Date object
        let today = frappe.datetime.str_to_obj(frappe.datetime.get_today());

        if (frm.doc.end_date) {
            let endDate = frappe.datetime.str_to_obj(frm.doc.end_date);

            console.log("End Date: " + endDate + ", Today's Date: " + today);

            if (endDate < today) {
                frm.set_value('membership_status', 'Expired');
                frappe.msgprint(__('Membership status set to Expired due to past end date.'));
            } else {
                frm.set_value('membership_status', 'Active');
            }

            // Refresh the field to reflect the change immediately
            frm.refresh_field('membership_status');
        }
    }
});

frappe.ui.form.on('Gym Membership', {
    refresh: function (frm) {
        // Custom Button to redirect to Gym Membership Doctype
        frm.add_custom_button(__('Gym Trainer Subscription'), function () {
            // Redirect to Gym Membership List or New Form
            frappe.set_route('List', 'Gym Trainer Subscription');
        }, __('Create'));

        // Custom Button to redirect to Payment Entry Doctype
        frm.add_custom_button(__('Payment Entry'), function () {
            // Redirect to Payment Entry List or New Form
            frappe.set_route('List', 'Payment Entry');
        }, __('Create'));
        frm.add_custom_button(__('Gym Locker Booking'), function () {
            // Redirect to Payment Entry List or New Form
            frappe.set_route('List', 'Gym Locker Booking');
        }, __('Create'));
        frm.add_custom_button(__('Gym Class Booking'), function () {
            // Redirect to Payment Entry List or New Form
            frappe.set_route('List', 'Gym Class Booking');
        }, __('Create'));
    }
});
