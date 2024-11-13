# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt


from frappe.model.document import Document
import frappe
from frappe import _

class GymMembership(Document):
    def validate(self):
        exists = frappe.db.exists(
            "Gym Membership",
            {
                "member": self.member,
                "end_date": (">", self.start_date),
            },
        )
        if exists:
            frappe.throw("There is an active Gym Membership for this member")
