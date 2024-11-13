# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
    if not filters:
        filters = {}

    # Check if the member filter is selected; if not, prompt the user
    if not filters.get("member"):
        frappe.throw("Please select a member to view their fitness journey.")

    # Fetch data from the child table (Tracking Sheet) based on the selected Gym Member
    data = frappe.db.sql("""
        SELECT 
            ts.date AS "Date", 
            ts.calorie_intake AS "Calorie Intake", 
            ts.weight_loss AS "Weight Loss", 
            ts.weight_gain AS "Weight Gain", 
            ts.body_mass AS "Body Mass"
        FROM `tabTracking Sheet` ts
        JOIN `tabProcess Sheet` ps ON ps.name = ts.parent
        WHERE ps.member = %(member)s
        ORDER BY ts.date ASC
    """, {"member": filters.get("member")}, as_dict=1)

    # Debugging: Print the fetched data for confirmation
    frappe.msgprint(f"Fetched data: {data}")

    # Define columns for the report table
    columns = [
        {"label": "Date", "fieldname": "Date", "fieldtype": "Date", "width": 120},
        {"label": "Calorie Intake", "fieldname": "Calorie Intake", "fieldtype": "Float", "width": 120},
        {"label": "Weight Loss", "fieldname": "Weight Loss", "fieldtype": "Float", "width": 120},
        {"label": "Weight Gain", "fieldname": "Weight Gain", "fieldtype": "Float", "width": 120},
        {"label": "Body Mass", "fieldname": "Body Mass", "fieldtype": "Float", "width": 120}
    ]

    # Return columns and fetched data
    return columns, data

