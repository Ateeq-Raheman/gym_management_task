import frappe
from frappe.model.document import Document

class GymLockerBooking(Document):

    def validate(self):
        # Check if locker is already booked
        existing_booking = frappe.db.exists('Gym Locker Booking', {
            'locker_number': self.locker_number,
            'end_date': ('>=', self.start_date),
            'docstatus': 1  # Only check submitted bookings
        })

        if existing_booking:
            frappe.throw(f"Locker {self.locker_number} is already booked during this period.")
        
        # Check if the locker is available in Locker Available DocType
        locker = frappe.get_doc('Locker Available', self.locker_number)
        if locker.status == 'Issued':
            frappe.throw(f"Locker {self.locker_number} is currently issued.")
        
        # Validation passed; locker can be booked
    
    def on_submit(self):
        # When the booking is submitted, mark the locker as 'Issued'
        locker = frappe.get_doc('Locker Available', self.locker_number)
        locker.status = 'Issued'
        locker.save()

        # Decrement the locker available count in Gym Settings
        self.update_locker_available_count(decrement=True)

    def on_cancel(self):
        # Handle cancellation
        frappe.msgprint(f"Locker {self.locker_number} canceled and set to available.")
        
        # Fetch the locker and set its status to 'Available'
        locker = frappe.get_doc('Locker Available', self.locker_number)
        locker.status = 'Available'
        locker.save()

        # Update Gym Settings to increment the locker availability count
        self.update_locker_available_count(decrement=False)

    def update_locker_available_count(self, decrement):
        # Fetch the single Gym Settings document
        gym_settings = frappe.get_single('Gym Settings')

        # Update the locker available count
        if decrement:
            gym_settings.locker_available = gym_settings.locker_available - 1
        else:
            gym_settings.locker_available = gym_settings.locker_available + 1

        # Save the updated Gym Settings document
        gym_settings.save()
