import frappe

# fitness_journey.py
def execute(filters=None):
    columns, data = [], []
    columns = [
        ("Date") + ":Date:100",
        ("Weight") + ":Float:100",
        ("Calories Intake") + ":Float:100",
        ("Workout Plan") + ":Link/Gym Workout Plan:200"
    ]
    
    # Fetch the data based on filters
    data = frappe.db.sql("""
        SELECT date, weight, calories_intake, workout_plan
        FROM `tabGymMemberFitnessMetrics`
        WHERE member=%s
    """, (filters.get("member"),))
    
    return columns, data
