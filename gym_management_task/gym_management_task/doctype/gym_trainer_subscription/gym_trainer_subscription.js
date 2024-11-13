// Copyright (c) 2022, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gym Trainer Subscription', {
    onload: function (frm) {
        // Reset auto_calculate flag when a new document is created
        if (frm.is_new()) {
            frm.auto_calculate = true;  // Reset auto-calculation flag on new document
        }
    },

    start_date: function (frm) {
        calculate_remaining_days_and_total_amount(frm);
    },
    end_date: function (frm) {
        calculate_remaining_days_and_total_amount(frm);
    },

    remaining_days: function (frm) {
        // Recalculate total amount when remaining days change, if it hasn't been manually overridden
        if (frm.doc.remaining_days && frm.auto_calculate !== false) {
            calculate_total_amount(frm);
        }
    },

    total_amount: function (frm) {
        // If user manually enters the total amount, stop auto-calculation
        frm.auto_calculate = false;
    },

    before_save: function (frm) {
        // Ensure total amount is set during validation if it hasn't been manually entered
        if (!frm.doc.total_amount) {
            calculate_total_amount(frm);
        }
    },

    refresh: function (frm) {
        // On refresh, ensure total amount is set to 0 if it's empty
        if (!frm.doc.total_amount) {
            frm.set_value('total_amount', 0);
        }
    }
});

// Function to calculate the remaining days based on start and end dates
function calculate_remaining_days_and_total_amount(frm) {
    if (frm.doc.start_date && frm.doc.end_date) {
        const startDate = new Date(frm.doc.start_date);
        const endDate = new Date(frm.doc.end_date);

        // Calculate the difference in days
        const diffTime = Math.abs(endDate - startDate);
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Set the remaining days in the form
        frm.set_value('remaining_days', remainingDays);

        // Calculate the total amount only if the user hasn't manually overridden it
        if (frm.auto_calculate !== false) {
            calculate_total_amount(frm);
        }
    }
}

// Function to calculate the total amount based on remaining days and gym trainer subscription amount
function calculate_total_amount(frm) {
    // Fetch the Gym Trainer Subscription Amount from Gym Settings
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Gym Settings"
        },
        callback: function (response) {
            if (response.message) {
                const gym_settings = response.message;
                const trainer_subscription_amount = gym_settings.gym_trainer_subscription_amount || 0;

                // Calculate total amount based on remaining days
                if (frm.doc.remaining_days) {
                    const totalAmount = frm.doc.remaining_days * trainer_subscription_amount;
                    frm.set_value('total_amount', totalAmount);
                    frm.auto_calculate = true;  // Mark the amount as auto-calculated
                    frappe.msgprint(__('Total Amount calculated: ' + totalAmount));
                }
            } else {
                frappe.throw(__('Unable to fetch Gym Settings.'));
            }
        }
    });
}
