frappe.ui.form.on('Payment Entry', {
    refresh: function (frm) {
        // Filter reference docname based on gym_member and payment type
        frm.set_query('reference_docname', function () {
            let filters = {
                'gym_member': frm.doc.member  // Filter based on the selected gym member
            };

            if (frm.doc.payment_type === "Gym Trainer Subscription" ||
                frm.doc.payment_type === "Gym Locker Booking" ||
                frm.doc.payment_type === "Gym Class Booking") {
                filters["status"] = "Unpaid";  // Show only unpaid subscriptions or bookings
            }

            return {
                filters: filters
            };
        });
    },

    payment_type: function (frm) {
        // Dynamic amount handling based on payment type
        if (frm.doc.payment_type === "Gym Trainer Subscription" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Trainer Subscription");
        } else if (frm.doc.payment_type === "Gym Locker Booking" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Locker Booking");
        } else if (frm.doc.payment_type === "Gym Class Booking" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Class Booking");
        }
    },

    reference_docname: function (frm) {
        // Fetch amount when reference_docname is selected
        if (frm.doc.payment_type === "Gym Trainer Subscription" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Trainer Subscription");
        } else if (frm.doc.payment_type === "Gym Locker Booking" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Locker Booking");
        } else if (frm.doc.payment_type === "Gym Class Booking" && frm.doc.reference_docname) {
            fetch_amount_from_reference(frm, "Gym Class Booking");
        }
    }
});

// Helper function to fetch total amount from the reference document
function fetch_amount_from_reference(frm, doctype) {
    if (!frm.doc.reference_docname) {
        frappe.msgprint(__('Please select a reference document.'));
        return;
    }

    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: doctype,
            name: frm.doc.reference_docname
        },
        callback: function (r) {
            if (r.message && r.message.total_amount) {
                frm.set_value('amount', r.message.total_amount);  // Set amount from the reference document's total_amount field
            } else {
                frappe.msgprint(__('Could not fetch the total amount from {0}.', [doctype]));
            }
        },
        error: function () {
            frappe.msgprint(__('Error fetching the total amount from {0}.', [doctype]));
        }
    });
}
