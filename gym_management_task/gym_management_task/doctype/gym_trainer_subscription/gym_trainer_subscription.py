# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class GymTrainerSubscription(Document):
	pass
def calculate_total_amount(doc, method):
    frappe.logger().info("Calculating total amount for Gym Class Booking")

    # Fetch Gym Settings
    try:
        gym_settings = frappe.get_doc("Gym Settings")
        frappe.logger().info(f"Gym settings fetched: {gym_settings}")
    except Exception as e:
        frappe.logger().error(f"Error fetching Gym Settings: {e}")
        return

    # Fetch Gym Class Booking Amount
    class_booking_amount = gym_settings.gym_trainer_subscription_amount

    # Ensure total_no_of_days and class_booking_amount are valid
    if doc.remaining_days is None:
        doc.remaining_days = 0

    if class_booking_amount is None:
        class_booking_amount = 0

    if doc.remaining_days > 0 and class_booking_amount > 0:
        frappe.logger().info(f"Total No of Days: {doc.remaining_days}, Class Booking Amount: {class_booking_amount}")
        doc.total_amount = doc.remaining_days * class_booking_amount
        frappe.logger().info(f"Total Amount calculated: {doc.total_amount}")
    else:
        doc.total_amount = 0  # Set to 0 if no value
        frappe.logger().info("Total amount set to 0 due to invalid values")