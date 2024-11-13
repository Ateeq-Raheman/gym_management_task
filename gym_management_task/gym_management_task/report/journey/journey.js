frappe.query_reports["Journey"] = {
	"filters": [
		{
			"fieldname": "member",
			"label": __("Member"),
			"fieldtype": "Link",
			"options": "Gym Member",
			"mandatory": 1,
			"default": frappe.session.user
		}
	],
	onload: function (report) {
		console.log("Report is being loaded");
		if (!frappe.query_report.chart) {
			frappe.query_report.chart = new Chart({
				parent: report.page.main,
				title: "Journey",
				type: 'bar', // or the chart type you prefer
				height: 250,
				data: {}
			});
		}
		frappe.query_report.get_chart_data(report);
	},
	// Chart Data Configuration
	get_chart_data: function (columns, result) {
		console.log(result);  // Add this to log the result for debugging
		let labels = [];
		let calorie_intake = [];
		let weight_loss = [];
		let weight_gain = [];
		let body_mass = [];

		result.forEach(row => {
			labels.push(row.date);  // Assuming date is the first column
			calorie_intake.push(row.calorie_intake);  // Assuming Calorie Intake is second column
			weight_loss.push(row.weight_loss);  // Assuming Weight Loss is third column
			weight_gain.push(row.weight_gain);  // Assuming Weight Gain is fourth column
			body_mass.push(row.weight_loss);  // Assuming Body Mass is fifth column
		});
		console.log(labels);
		console.log(calorie_intake);
		console.log(weight_loss);
		console.log(weight_gain);
		console.log(body_mass);
		return {
			data: {
				labels: labels,
				datasets: [
					{ name: "Calorie Intake", values: calorie_intake },
					{ name: "Weight Loss", values: weight_loss },
					{ name: "Weight Gain", values: weight_gain },
					{ name: "Body Mass", values: body_mass }
				]
			},
			type: 'bar',
			height: 250
		};
	}
};