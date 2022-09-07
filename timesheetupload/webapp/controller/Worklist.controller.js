sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    'sap/m/TablePersoController',
    'sap/m/library',
    './DemoPersoService',
    "../libs/xlsx",
    "../libs/jszip",
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast, TablePersoController, mlibrary, DemoPersoService, xlsx, jszip) {
    "use strict";
    var ResetAllMode = mlibrary.ResetAllMode;

    return BaseController.extend("com.chappota.timesheet.timesheetupload.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {

            this.localModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.localModel, "localModel");


            this._oTPC = new TablePersoController({
                table: this.byId("timesheettable"),
                // specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                componentName: "demoApp",
                resetAllMode: ResetAllMode.ServiceReset,
                persoService: DemoPersoService
            }).activate();

            var jsonmode1l1 = new JSONModel();
            jsonmode1l1.setData({"res": []});
            this.getView().byId("displaytable").setModel(jsonmode1l1, "disp");
        },


        /* =========================================================== */
        /* Method to impor the excel sheet and push to the table       */
        /* =========================================================== */

        _import: function (file) {
            this.byId("filenameid").setValue(file.name);
            var that = this;
            var excelData = {};
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    workbook.SheetNames.forEach(function (sheetName) { // Here is your object for every sheet in workbook
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    });
                    // Setting the data to the local model
                    that.localModel.setData({items: excelData});
                    that.localModel.refresh(true);
                };
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        },

        onUpload: function (e) {
            this._import(e.getParameter("files") && e.getParameter("files")[0]);
        },
        /**********************************************************/
        /*  Method to Post time to TimeSheetEntryCollection        */
        /**********************************************************/
        // _postTime1 : function(oEvent){
        //     var displaytablelength = this.byId("displaytable").getItems().length;
        //     var data = [];
        //     if(displaytablelength > 0){

        //         this.byId("displaytable").getModel("disp").setData(data);
        //         this._postTime1();
        //     }
        //     else {
        //         this._postTime1();
        //     }
        // },

        _postTime: function (oEvent) {
            debugger;
            this.getView().byId("displaytable").getModel("disp").getData().res = [];

            this.getView().byId("displaytable").getModel("disp").refresh();


            var oTable = this.getView().byId("timesheettable");
            this.count = oTable.mAggregations.items.length;
            for (var i = 0; i < oTable.mAggregations.items.length; i++) {


                var finalRecordPayload = {
                    "TimeSheetDataFields": {
                        "ControllingArea": "A000",
                        // (Hard Code)
                        // "SenderCostCenter": "1720P001", // (Hard code)
                        "ActivityType": oTable.mAggregations.items[i].mAggregations.cells[2].getText(), // "T001", //this.acttype, // (From the record – “Activity Type”)
                        "WBSElement": oTable.mAggregations.items[i].mAggregations.cells[5].getText(), // (From the record – “WBS Element”)
                        "RecordedHours": oTable.mAggregations.items[i].mAggregations.cells[7].getText(), // (From the record – “Unbilled Quantity”)
                        "RecordedQuantity": oTable.mAggregations.items[i].mAggregations.cells[7].getText(), // (From the record – “Unbilled Quantity”)
                        "HoursUnitOfMeasure": "H", // (Hard Code)
                        "TimeSheetNote": "HARDCODED"
                    },
                    "CompanyCode": "1720",
                    // (Hard Code)
                    // "PersonWorkAgreementExternalID": personalextid,
                    "PersonWorkAgreement": oTable.mAggregations.items[i].mAggregations.cells[10].getText(), // (Optional, Will be included in the Screen 2 API)
                    "TimeSheetRecord": oTable.mAggregations.items[i].mAggregations.cells[12].getText(),
                    "TimeSheetDate": this.formatter.dateTimebackendwithtime(oTable.mAggregations.items[i].mAggregations.cells[13].getText()), // (From the record – “Timesheet date”)
                    "TimeSheetIsReleasedOnSave": true, // (Hard Code)
                    "TimeSheetStatus": oTable.mAggregations.items[i].mAggregations.cells[15].getText(), // (Hard Code)
                    "TimeSheetOperation": 'C' // (Use “C” for new, “U” for Edited and “D” for deleted)
                };

                this.acttype = oTable.mAggregations.items[i].mAggregations.cells[2].getText();
                this.wbs = oTable.mAggregations.items[i].mAggregations.cells[5].getText();
                this.timesheetnote = this.wbs = oTable.mAggregations.items[i].mAggregations.cells[6].getText();
                this.rechoursqty = oTable.mAggregations.items[i].mAggregations.cells[7].getText();
                this.prnr = oTable.mAggregations.items[i].mAggregations.cells[10].getText();
                this.timesheetrecord = oTable.mAggregations.items[i].mAggregations.cells[12].getText();
                this.timesheetstatus = oTable.mAggregations.items[i].mAggregations.cells[15].getText();
                this.date = this.formatter.dateTimebackendwithtime(oTable.mAggregations.items[i].mAggregations.cells[13].getText());

                // this._statusreusable(this.acttype, this.wbs, this.timesheetnote, this.rechoursqty, this.prnr, this.timesheetrecord, this.timesheetstatus, this.date, finalRecordPayload);

                this._statusreusable(this.prnr, finalRecordPayload, this.date);


            }


        },
        /******************************************************************************/
        /*  Method used to print Status, Error and ReProcess on DisplayTable            */
        /******************************************************************************/
        // _statusreusable: function (acttype,wbs,timenote,rechrsqty,prnr,timesheetrecord,timesheetstatus,date,finalRecordPayload) {
        _statusreusable: function (prnr, finalRecordPayload, date) {
            debugger;
            var wipsaves = this.getOwnerComponent().getModel(),
                oldData = this.getView().byId("displaytable").getModel("disp").getData();
            wipsaves.create("/TimeSheetEntryCollection", finalRecordPayload, {
                success: (odata) => { // this._statusreusable('Success', odata);
                    oldData.res.push({
                        "ControllingArea": "A000",
                        "ActivityType": finalRecordPayload.TimeSheetDataFields.ActivityType,
                        "WBSElement": finalRecordPayload.TimeSheetDataFields.WBSElement,
                        // "TimeSheetNote" : timenote,
                        // "RecordedHours" : rechrsqty,
                        // "RecordedQuantity" : rechrsqty,
                        "PersonalNumber": prnr,
                        // "TimeSheetRecord" : timesheetrecord,
                        // "TimesheetStatus" : timesheetstatus,
                        "Date": date,
                        "Status": 'Success',
                        "Message": ""
                    });
                    this.byId("displaytable").setVisible(true);
                    this.getView().byId("displaytable").getModel("disp").refresh();
                },
                error: (err) => { // this._statusreusable('Error', err);
                    oldData.res.push({
                        "ControllingArea": "A000",
                        "ActivityType": this.acttype,

                        "WBSElement": finalRecordPayload.TimeSheetDataFields.WBSElement,
                        // "TimeSheetNote" : timenote,
                        // "RecordedHours" : rechrsqty,
                        // "RecordedQuantity" : rechrsqty,
                        "PersonalNumber": prnr,
                        // "TimeSheetRecord" : timesheetrecord,
                        // "TimesheetStatus" : timesheetstatus,
                        "Date": date,
                        "Status": 'Error',
                        "Message": JSON.parse(err.responseText).error.message.value
                    });
                    this.byId("displaytable").setVisible(true);
                    this.getView().byId("displaytable").getModel("disp").refresh();

                }
            });


        },
        /**************************************/
        /*  Method to reprocess failed records*/
        /**************************************/
        // _reprocessLineItem : function(oEvent){
        //     var currentdate = oEvent.getSource().getBindingContext("disp").getProperty("Date");
        //     debugger;
        // },
        _newDate: function (oEvent) {
            debugger;
            // var newDate = [];

            this.changedDate = this.formatter.dateTimebackendwithtime(oEvent.getParameter("value"));
            // newDate.push(changedDate);


        },

        _finalreprocess: function () {
            debugger;
            // this.getView().byId("displaytable").getModel("disp").getData().res = [];
            this.getView().byId("displaytable").getModel("disp").refresh();
            var oTable = this.getView().byId("displaytable");
            this.count = oTable.mAggregations.items.length;

            for (var i = 0; i < oTable.mAggregations.items.length; i++) {

                var finalRecordPayload = {
                    "TimeSheetDataFields": {
                        "ControllingArea": "A000",
                        "ActivityType": oTable.mAggregations.items[i].mAggregations.cells[1].getText(), // "T001", //this.acttype, // (From the record – “Activity Type”)
                        "WBSElement": oTable.mAggregations.items[i].mAggregations.cells[2].getText(),
                        // (From the record – “WBS Element”)
                        // "RecordedHours": oTable.mAggregations.items[i].mAggregations.cells[4].getText(), // (From the record – “Unbilled Quantity”)
                        // "RecordedQuantity": oTable.mAggregations.items[i].mAggregations.cells[4].getText(), // (From the record – “Unbilled Quantity”)
                        "HoursUnitOfMeasure": "H", // (Hard Code)
                        "TimeSheetNote": "HARDCODED"
                    },
                    "CompanyCode": "1720",
                    "PersonWorkAgreement": oTable.mAggregations.items[i].mAggregations.cells[4].getValue(), // (Optional, Will be included in the Screen 2 API)
                    "TimeSheetRecord": "",
                    "TimeSheetDate": this.formatter.dateTimebackendwithtime(oTable.mAggregations.items[i].mAggregations.cells[5].getValue()), // (From the record – “Timesheet date”)
                    "TimeSheetIsReleasedOnSave": true, // (Hard Code)
                    "TimeSheetStatus": "", // (Hard Code)
                    "TimeSheetOperation": 'C' // (Use “C” for new, “U” for Edited and “D” for deleted)
                };

                var wipsaves = this.getOwnerComponent().getModel(),
                    oldData = this.getView().byId("displaytable").getModel("disp").getData();

                /*wipsaves.create("/TimeSheetEntryCollection", finalRecordPayload, {
                                        success: (odata) => {
                                            
                                            //this._statusreusable('Success', odata);
                                            oldData.res.push({
                                                "ControllingArea": "A000",  
                                                "ActivityType": finalRecordPayload.TimeSheetDataFields.ActivityType,
                                                "WBSElement": finalRecordPayload.TimeSheetDataFields.WBSElement,
                                                // "TimeSheetNote": this.timesheetnote,
                                                "PersonalNumber": finalRecordPayload.PersonWorkAgreement,
                                                "Date" : this.changedDate,
                                                "Status": 'Success',
                                                "Message": ""
                                            });
                                            this.byId("displaytable").setVisible(true);
                                            this.getView().byId("displaytable").getModel("disp").refresh();
                                        },
                                error: (err) => {
                                
                                    //this._statusreusable('Error', err);
                                    oldData.res.push({
                                        "ControllingArea": "A000",  
                                        "ActivityType": finalRecordPayload.TimeSheetDataFields.ActivityType,
                                                "WBSElement": finalRecordPayload.TimeSheetDataFields.WBSElement,
                                        // "TimeSheetNote": this.timesheetnote,
                                        "PersonalNumber": finalRecordPayload.PersonWorkAgreement,
                                        "Date" : this.changedDate,                           
                                        "Status": 'Error',
                                        "Message": JSON.parse(err.responseText).error.message.value
                                    });
                                    // this.byId("displaytable").setVisible(true);
                                    this.getView().byId("displaytable").getModel("disp").refresh();

                                }
                            });*/
                this._statusreusable(finalRecordPayload.PersonWorkAgreement, finalRecordPayload, finalRecordPayload.TimeSheetDate);
                if (i === (this.count - 1)) 
                    this.getView().byId("displaytable").getModel("disp").getData().res = [];
                


                this.getView().byId("displaytable").getModel("disp").refresh();
            };


        },

        /**************************************/
        /*  Method used for Table Personaliztion*/
        /**************************************/
        onPersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

        onExit: function () {
            this._oTPC.destroy();
        },
        onTablePersoRefresh: function () {
            DemoPersoService.resetPersData().done(function () {
                this._oTPC.refresh();
            }.bind(this));
        },

        onTableGrouping: function (oEvent) {
            this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function (oEvent) { // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress: function (oEvent) { // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack: function () { // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("CompanyCode", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/TimeSheetEntryCollection".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});
