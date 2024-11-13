# Copyright (c) 2024, ateeq and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.model.document import Document


# gym_member.py
class GymMember(Document):
    def validate(self):
        # Ensure that the member is active
        if not self.active_membership:
            frappe.throw(("Gym member must be active."))

    def on_submit(self):
        # Code to handle submission of a gym member document
        pass

