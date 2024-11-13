# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt



import frappe
from frappe.model.document import Document

class PaymentEntry(Document):
	def on_submit(self):
			if self.status == "Paid":
				if self.payment_type == "Gym Trainer Subscription":
					doc = frappe.get_doc("Gym Trainer Subscription", self.reference_docname)
				elif self.payment_type == "Gym Class Booking":
					doc = frappe.get_doc("Gym Class Booking", self.reference_docname)
				elif self.payment_type == "Gym Locker Booking":
					doc = frappe.get_doc("Gym Locker Booking", self.reference_docname)
				
				# Update the status to 'Paid' and allow changes after submission
				if doc.status != "Paid":
					doc.status = "Paid"
					doc.flags.ignore_validate_update_after_submit = True  # Bypass the submit restriction
					doc.save(ignore_permissions=True)  # Save the document

	def validate(self):
		# Check if the selected reference document has already been paid for
		if self.payment_type == "Gym Trainer Subscription":
			doc = frappe.get_doc("Gym Trainer Subscription", self.reference_docname)
		elif self.payment_type == "Gym Class Booking":
			doc = frappe.get_doc("Gym Class Booking", self.reference_docname)
		elif self.payment_type == "Gym Locker Booking":
			doc = frappe.get_doc("Gym Locker Booking", self.reference_docname)
		
		# If the document status is already 'Paid', raise an error
		if doc.status == "Paid":
			frappe.throw(("Payment is already made for this {0}".format(self.payment_type)))

            
	# def test_payment_entry_updates_status():

	# # Create a new Gym Trainer Subscription with status "Unpaid"
	# 	trainer_subscription = frappe.get_doc({
	# 		"doctype": "Gym Trainer Subscription",
	# 		"member": "Test Member",
	# 		"trainer": "Test Trainer",
	# 		"status": "Unpaid"
	# 	})
	# 	trainer_subscription.insert()

	# 	# Create a new Payment Entry for the trainer subscription
	# 	payment_entry = frappe.get_doc({
	# 		"doctype": "Payment Entry",
	# 		"payment_type": "Gym Trainer Subscription",
	# 		"reference_docname": trainer_subscription.name,
	# 		"amount": 1000,
	# 		"status": "Paid"
	# 	})
	# 	payment_entry.insert()
	# 	payment_entry.submit()

	# 	# Fetch the updated Gym Trainer Subscription and verify the status is "Paid"
	# 	updated_subscription = frappe.get_doc("Gym Trainer Subscription", trainer_subscription.name)
	# 	assert updated_subscription.status == "Paid"
