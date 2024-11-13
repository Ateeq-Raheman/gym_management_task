// Copyright (c) 2022, Frappe Technologies and contributors
// For license information, please see license.txt




// frappe.ui.form.on('Gym Class Booking', {
//     from_date: function (frm) {
//         // Calculate only when both from_date and to_date are set
//         if (frm.doc.to_date) {
//             calculate_total_days_and_amount(frm);
//         }
//     },
//     to_date: function (frm) {
//         calculate_total_days_and_amount(frm);
//     },
//     total_amount: function (frm) {
//         // If the user manually changes the total_amount, stop auto-calculation
//         frm.auto_calculate = false; // Disable further auto-calculations once manually changed
//     },
//     refresh: function (frm) {
//         // Add custom buttons for Payment Entry and Gym Locker Booking
//         frm.add_custom_button(__('Payment Entry'), function () {
//             frappe.set_route('List', 'Payment Entry');
//         }, __('Create'));

//         frm.add_custom_button(__('Gym Locker Booking'), function () {
//             frappe.set_route('List', 'Gym Locker Booking');
//         }, __('Create'));

//         // Ensure total_amount is editable
//         frm.set_df_property('total_amount', 'read_only', 0);

//         // Reset auto_calculate flag when creating a new document
//         if (frm.is_new()) {
//             frm.auto_calculate = true;
//         }
//     },
//     before_save: function (frm) {
//         // Prevent recalculating total_amount if the user manually set it
//         if (frm.auto_calculate === false) {
//             return; // Stop recalculating if manually overridden
//         }
//     }
// });

// // Function to calculate total days and total amount
// function calculate_total_days_and_amount(frm) {
//     // Ensure both from_date and to_date are set
//     if (frm.doc.from_date && frm.doc.to_date) {
//         let from_date = new Date(frm.doc.from_date);
//         let to_date = new Date(frm.doc.to_date);

//         // Ensure to_date is not earlier than from_date
//         if (to_date < from_date) {
//             frappe.msgprint(__('To Date cannot be earlier than From Date.'));
//             frm.set_value('total_no_of_days', 0);
//             frm.set_value('total_amount', 0);  // Reset total amount
//             return;
//         }

//         // Calculate total number of days
//         let time_difference = to_date - from_date;
//         let total_days = Math.ceil(time_difference / (1000 * 60 * 60 * 24));  // Convert milliseconds to days
//         frm.set_value('total_no_of_days', total_days + 1);  // Include the starting day

//         // Auto-calculate total amount only if not manually overridden
//         if (frm.auto_calculate !== false) {
//             frappe.call({
//                 method: "frappe.client.get",
//                 args: {
//                     doctype: "Gym Settings"
//                 },
//                 callback: function (response) {
//                     if (response.message) {
//                         let gym_class_booking_amount = response.message.gym_class_booking_amount || 0;
//                         if (frm.doc.total_no_of_days > 0 && gym_class_booking_amount > 0) {
//                             let total_amount = frm.doc.total_no_of_days * gym_class_booking_amount;
//                             frm.set_value('total_amount', total_amount);  // Set calculated total amount
//                         } else {
//                             frm.set_value('total_amount', 0);  // Reset total amount to 0 if no valid values
//                         }
//                     } else {
//                         frappe.msgprint(__('Could not fetch Gym Settings.'));
//                     }
//                 }
//             });
//         }
//     } else {
//         frm.set_value('total_no_of_days', 0);
//         frm.set_value('total_amount', 0);  // Reset total amount if dates are missing
//     }
// }



frappe.ui.form.on('Gym Class Booking', {
    onload: function (frm) {
        if (frm.is_new()) {
            frm.auto_calculate = true;  // Allow auto-calculation for new documents
            frm.manual_override = false; // Flag to track if the user manually changes the total amount
        }
    },

    from_date: function (frm) {
        calculate_total_days_and_amount(frm);
    },

    to_date: function (frm) {
        calculate_total_days_and_amount(frm);
    },

    total_no_of_days: function (frm) {
        // Only recalculate the total_amount when total_no_of_days changes
        if (frm.doc.total_no_of_days && !frm.manual_override) {
            calculate_total_amount(frm);
        }
    },

    total_amount: function (frm) {
        // If the user manually changes the total_amount, stop further auto-calculation
        frm.manual_override = true;
        frm.auto_calculate = false;  // Disable auto-calculation once user manually enters total_amount
    },

    before_save: function (frm) {
        // Do not calculate total_amount if it has been manually overridden by the user
        if (frm.manual_override) {
            return;  // Skip any recalculation if user manually entered the amount
        }
    },

    refresh: function (frm) {
        if (!frm.doc.total_amount) {
            frm.set_value('total_amount', 0);
        }
    }
});

// Calculate total days based on from_date and to_date
function calculate_total_days_and_amount(frm) {
    if (frm.doc.from_date && frm.doc.to_date) {
        const fromDate = new Date(frm.doc.from_date);
        const toDate = new Date(frm.doc.to_date);

        // Ensure that to_date is not earlier than from_date
        if (toDate < fromDate) {
            frappe.msgprint(__('To Date cannot be earlier than From Date.'));
            frm.set_value('total_no_of_days', 0);
            frm.set_value('total_amount', 0);  // Reset total_amount if invalid dates
            return;
        }

        // Calculate total days (including start date)
        const diffTime = Math.abs(toDate - fromDate);
        const totalNoOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Set total_no_of_days in the form
        frm.set_value('total_no_of_days', totalNoOfDays);

        // Only recalculate total_amount if user has not manually overridden it
        if (!frm.manual_override) {
            calculate_total_amount(frm);
        }
    }
}

// Calculate total amount based on number of days and class booking amount
function calculate_total_amount(frm) {
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Gym Settings"
        },
        callback: function (response) {
            if (response.message) {
                const gym_settings = response.message;
                const class_booking_amount = gym_settings.gym_class_booking_amount || 0;

                // Calculate the total amount based on total_no_of_days
                if (frm.doc.total_no_of_days && class_booking_amount) {
                    const totalAmount = frm.doc.total_no_of_days * class_booking_amount;
                    frm.set_value('total_amount', totalAmount);
                    frm.auto_calculate = true;  // Mark the amount as auto-calculated
                }
            } else {
                frappe.throw(__('Unable to fetch Gym Settings.'));
            }
        }
    });
}
