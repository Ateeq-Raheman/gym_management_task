# # Copyright (c) 2024, ateeq and contributors
# # For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today
from frappe.utils import today, add_days


class GymClassBooking(Document):

    pass
    # def validate(self):
    # # Ensure both class_date and today's date are compared as date objects
    #     class_date_as_date = getdate(self.class_date)  # Convert the class_date string to a date object
    #     if class_date_as_date < getdate(today()):
    #         frappe.throw(("Class date cannot be before today."))



def send_weekly_summary():
    # Fetch all members with active memberships
    members = frappe.get_all('Gym Member', filters={'active_membership': 'Active'}, fields=['name', 'email'])
    print(members)

    for member in members:
        # Fetch the classes the member attended in the past week
        classes = frappe.get_all('Gym Class Booking', 
                                 filters={
                                     'gym_member': member.name,  # Match your field for Gym Member
                                     'class_date': ['>=', add_days(today(), -7)]  # Classes attended in the last 7 days
                                 },
                                 fields=['classes', 'class_date'])  # Use the correct field name
        print(classes)
        # If there are any classes attended, prepare and send the summary email
        if classes:
            # Prepare the message body
            # Prepare the message body as HTML table
            message = f"<p>Hello {member.name},</p>"
            message += "<p>Here are the details of your classes that you booked this week:</p>"
            message += "<table border='1' cellpadding='5' cellspacing='0'>"
            message += "<tr><th>Class Name</th><th>Date</th></tr>"  # Table headers

            for c in classes:
                class_names = ', '.join(c.classes)  # Join multiple selected classes
                message += f"<tr><td>{class_names}</td><td>{c.class_date}</td></tr>"

            message += "</table>"


            try:
                # Send the email
                frappe.sendmail(
                    recipients=member.email,
                    subject="Your Weekly Class Summary",
                    message=message,
                    content_type="html"
                )
                frappe.logger().info(f"Weekly summary sent to {member.email}")
            except Exception as e:
                frappe.logger().error(f"Failed to send weekly summary to {member.email}: {e}")
        else:
            # No classes attended, optionally log or skip
            frappe.logger().info(f"No classes to report for {member.name} this week.")
    print("Done")



# def calculate_total_amount(doc, method):
#     frappe.logger().info("Calculating total amount for Gym Class Booking")

#     # Fetch Gym Settings
#     try:
#         gym_settings = frappe.get_doc("Gym Settings")
#         frappe.logger().info(f"Gym settings fetched: {gym_settings}")
#     except Exception as e:
#         frappe.logger().error(f"Error fetching Gym Settings: {e}")
#         return

#     # Fetch Gym Class Booking Amount
#     class_booking_amount = gym_settings.gym_class_booking_amount

#     # Calculate the total amount based on Total No of Days
#     if doc.total_no_of_days > 0 and class_booking_amount > 0:
#         frappe.logger().info(f"Total No of Days: {doc.total_no_of_days}, Class Booking Amount: {class_booking_amount}")
#         doc.total_amount = doc.total_no_of_days * class_booking_amount
#         frappe.logger().info(f"Total Amount calculated: {doc.total_amount}")
#     else:
#         doc.total_amount = 0  # Set to 0 if no value
#         frappe.logger().info("Total amount set to 0 due to invalid values")


# def calculate_total_amount(doc, method):
#     frappe.logger().info("Calculating total amount for Gym Class Booking")

#     # Fetch Gym Settings
#     try:
#         gym_settings = frappe.get_doc("Gym Settings")
#         frappe.logger().info(f"Gym settings fetched: {gym_settings}")
#     except Exception as e:
#         frappe.logger().error(f"Error fetching Gym Settings: {e}")
#         return

#     # Fetch Gym Class Booking Amount
#     class_booking_amount = gym_settings.gym_class_booking_amount

#     # Ensure total_no_of_days and class_booking_amount are valid
#     if doc.total_no_of_days is None:
#         doc.total_no_of_days = 0

#     if class_booking_amount is None:
#         class_booking_amount = 0

#     if doc.total_no_of_days > 0 and class_booking_amount > 0:
#         frappe.logger().info(f"Total No of Days: {doc.total_no_of_days}, Class Booking Amount: {class_booking_amount}")
#         doc.total_amount = doc.total_no_of_days * class_booking_amount
#         frappe.logger().info(f"Total Amount calculated: {doc.total_amount}")
#     else:
#         doc.total_amount = 0  # Set to 0 if no value
#         frappe.logger().info("Total amount set to 0 due to invalid values")

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
    class_booking_amount = gym_settings.gym_class_booking_amount

    # Ensure total_no_of_days and class_booking_amount are valid
    if doc.total_no_of_days is None:
        doc.total_no_of_days = 0

    if class_booking_amount is None:
        class_booking_amount = 0

    if doc.total_no_of_days > 0 and class_booking_amount > 0:
        frappe.logger().info(f"Total No of Days: {doc.total_no_of_days}, Class Booking Amount: {class_booking_amount}")
        doc.total_amount = doc.total_no_of_days * class_booking_amount
        frappe.logger().info(f"Total Amount calculated: {doc.total_amount}")
    else:
        doc.total_amount = 0  # Set to 0 if no value
        frappe.logger().info("Total amount set to 0 due to invalid values")

