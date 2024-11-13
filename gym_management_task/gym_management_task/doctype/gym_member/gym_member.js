// Copyright (c) 2024, ateeq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gym Member', {
    refresh: function (frm) {
        // Custom Button to redirect to Gym Membership Doctype
        frm.add_custom_button(__('Gym Membership'), function () {
            // Redirect to Gym Membership List or New Form
            frappe.set_route('List', 'Gym Membership');
        }, __('Create'));

        // Custom Button to redirect to Payment Entry Doctype
        frm.add_custom_button(__('Payment Entry'), function () {
            // Redirect to Payment Entry List or New Form
            frappe.set_route('List', 'Payment Entry');
        }, __('Create'));
    }
});
