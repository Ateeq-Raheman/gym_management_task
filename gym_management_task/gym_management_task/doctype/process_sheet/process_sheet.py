# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import today, add_days
from frappe.model.document import Document


class ProcessSheet(Document):

    pass

# def send_weekly_summary():
#     # Fetch all members with active memberships
#     members = frappe.get_all('Gym Member', filters={'active_membership': 'Active'}, fields=['name', 'email'])
#     print(members)

#     for member in members:
#         # Fetch the classes the member attended in the past week
#         classes = frappe.get_all('Gym Class Booking', 
#                                     filters={
#                                         'member': member.name,
#                                         'class_date': ['>=', add_days(today(), -7)]
#                                     },
#                                     fields=['select_from_the_options', 'class_date'])

#         # If there are any classes attended, prepare and send the summary email
#         if classes:
#             # Prepare the message body
#             message = f"Hello {member.name},\n\nHere is the summary of your classes this week:\n\n"
#             for c in classes:
#                 message += f"{c.class_name} on {c.class_date} at {c.class_time}\n"

#             try:
#                 # Send the email
#                 frappe.sendmail(
#                     recipients=member.email,
#                     subject="Your Weekly Class Summary",
#                     message=message
#                 )
#                 frappe.logger().info(f"Weekly summary sent to {member.email}")
#             except Exception as e:
#                 frappe.logger().error(f"Failed to send weekly summary to {member.email}: {e}")
#         else:
#             # No classes attended, optionally log or skip
#             frappe.logger().info(f"No classes to report for {member.name} this week.")




