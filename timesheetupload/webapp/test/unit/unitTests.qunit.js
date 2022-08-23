/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/chappota/timesheet/timesheetupload/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});