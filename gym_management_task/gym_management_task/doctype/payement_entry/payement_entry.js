// Copyright (c) 2024, ateeq and contributors
// For license information, please see license.txt


frappe.ui.form.on('Payment Entry', {
    refresh: function (frm) {

        // Filter reference docname based on the email and payment type
        frm.set_query('reference_docname', function () {
            let filters = {
                'gym_member': frm.doc.gym_member
            };

            if (frm.doc.payment_type === "Gym Trainer Subscription") {
                filters["status"] = "Unpaid";
            }
            if (frm.doc.payment_type === "Gym Locker Booking") {
                filters["status"] = "Unpaid";
            }
            if (frm.doc.payment_type === "Gym Class Booking") {
                filters["status"] = "Unpaid";
            }

            return {
                filters: filters
            };
        });
    },
    payment_type: function (frm) {
        console.log("Payment type changed:", frm.doc.payment_type);  // Triggered when payment_type changes

        if (frm.doc.payment_type === "Gym Trainer Subscription") {
            frm.set_value('amount', gym_settings.gym_trainer_subscription_amount);  // Set amount for Gym Trainer Subscription
            console.log("Amount set to 100 for Gym Trainer Subscription");
        } else if (frm.doc.payment_type === "Gym Locker Booking") {
            frm.set_value('amount', gym_settings.gym_locker_booking_amount);  // Set amount for Gym Locker Booking
            console.log("Amount set to 50 for Gym Locker Booking");
        } else if (frm.doc.payment_type === "Gym Class Booking") {
            frm.set_value('amount', gym_settings.gym_class_booking_amount);  // Set amount for Gym Class Booking
            console.log("Amount set to 30 for Gym Class Booking");
            // } else if (frm.doc.payment_type === "Gym Membership") {
            //     frm.set_value('amount', gym_settings.gym_membership_amount);  // Set amount for Gym Class Booking
            //     console.log("Amount set to 30 for Gym Class Booking");
        }
    }
});




