sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,MessageToast) {
    "use strict";

    return BaseController.extend("com.chappota.timesheet.timesheetupload.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {

            this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");


            // var oViewModel;

            // // keeps the search state
            // this._aTableSearchState = [];

            // // Model used to manipulate control states
            // oViewModel = new JSONModel({
            //     worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
            //     shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
            //     shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
            //     tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            // });
            // this.setModel(oViewModel, "worklistView");

        },
            onUpload: function (e) {
                        this._import(e.getParameter("files") && e.getParameter("files")[0]);
                    },

                    _import: function (file) {
                        var that = this;
                        var excelData = {};
                        if (file && window.FileReader) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });
                                workbook.SheetNames.forEach(function (sheetName) {
                                    // Here is your object for every sheet in workbook
                                    excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                                });
                                // Setting the data to the local model 
                                that.localModel.setData({
                                    items: excelData
                                });
                                that.localModel.refresh(true);
                            };
                            reader.onerror = function (ex) {
                                console.log(ex);
                            };
                            reader.readAsBinaryString(file);
                        }
                    },

                    _postTime : function(oEvent){
                        var oTable = this.getView().byId("timesheettable");
                        for(var i=0;i<oTable.mAggregations.items.length;i++){

                            // for(var j=0;j<oTable.mAggregations.items[i].mAggregations.cells.length;j++){
                           debugger;
                           
                            var finalRecordPayload = {
                                "TimeSheetDataFields": {
                                      "ControllingArea": "A000", // (Hard Code)
                                     //"SenderCostCenter": "1720P001", // (Hard code)
                                      "ActivityType": oTable.mAggregations.items[i].mAggregations.cells[2].getText(),//"T001", //this.acttype, // (From the record – “Activity Type”)
                                    "WBSElement":  oTable.mAggregations.items[i].mAggregations.cells[5].getText(), // (From the record – “WBS Element”)
                                      "RecordedHours":  oTable.mAggregations.items[i].mAggregations.cells[7].getText(), // (From the record – “Unbilled Quantity”)
                                    "RecordedQuantity": oTable.mAggregations.items[i].mAggregations.cells[7].getText(), // (From the record – “Unbilled Quantity”)
                                     "HoursUnitOfMeasure": "H", // (Hard Code)
                                     "TimeSheetNote": "HARDCODED"
                                 },
                                  "CompanyCode": "1720", // (Hard Code)
                                //"PersonWorkAgreementExternalID": personalextid,
                                  "PersonWorkAgreement":  oTable.mAggregations.items[i].mAggregations.cells[10].getText(), // (Optional, Will be included in the Screen 2 API)
                                  "TimeSheetRecord": oTable.mAggregations.items[i].mAggregations.cells[12].getText(),
                                  "TimeSheetDate": this.formatter.dateTimebackendwithtime(oTable.mAggregations.items[i].mAggregations.cells[13].getText()), // (From the record – “Timesheet date”)
                               "TimeSheetIsReleasedOnSave": true, // (Hard Code)
                                  "TimeSheetStatus": oTable.mAggregations.items[i].mAggregations.cells[15].getText(), // (Hard Code)
                                 "TimeSheetOperation": 'C' // (Use “C” for new, “U” for Edited and “D” for deleted)
                                };
                                                      


                            // }
                            var wipsaves = this.getOwnerComponent().getModel();
                            wipsaves.create("/TimeSheetEntryCollection", finalRecordPayload, {
                                success: (odata) => {
                                    debugger;
                                    MessageToast.show("Record ("+i+") posted");
                                },
                                error: (err) => {
                                    MessageToast.show(err);
                                  
                                }
                            });
                        
                        
                        }

                        // var finalRecordPayload = {
                        //     "TimeSheetDataFields": {
                        //         "ControllingArea": "A000", // (Hard Code)
                        //         //"SenderCostCenter": "1720P001", // (Hard code)
                        //         "ActivityType": oTable.getItems()[ind].getCells()[10].getText(),//"T001", //this.acttype, // (From the record – “Activity Type”)
                        //         "WBSElement": oTable.getItems()[ind].getCells()[8].getText(), // (From the record – “WBS Element”)
                        //         "RecordedHours": oTable.getItems()[ind].getCells()[7].getText(), // (From the record – “Unbilled Quantity”)
                        //         "RecordedQuantity": oTable.getItems()[ind].getCells()[7].getText(), // (From the record – “Unbilled Quantity”)
                        //         "HoursUnitOfMeasure": "H", // (Hard Code)
                        //         "TimeSheetNote": oTable.getItems()[ind].getCells()[13].getText()
                        //     },
                        //     "CompanyCode": "1720", // (Hard Code)
                        //     //"PersonWorkAgreementExternalID": personalextid,
                        //     "PersonWorkAgreement": oTable.getItems()[ind].getCells()[11].getText(), // (Optional, Will be included in the Screen 2 API)
                        //     "TimeSheetRecord": timesheetid,
                        //     "TimeSheetDate": this.formatter.dateTimebackendwithtime(oTable.getItems()[ind].getCells()[12].getText()), // (From the record – “Timesheet date”)
                        //     "TimeSheetIsReleasedOnSave": true, // (Hard Code)
                        //     "TimeSheetStatus": timesheetstatus, // (Hard Code)
                        //     "TimeSheetOperation": 'C' // (Use “C” for new, “U” for Edited and “D” for deleted)
                        // };

                        // var wipsaves = this.getOwnerComponent().getModel("wipsavesMDL");
                        // wipsaves.create("/TimeSheetEntryCollection", finalRecordPayload, {
                        //     success: (odata) => {
                        //         this._deleteWIPEdit(jeid);
                        //         MessageToast.show("Record posted");
                        //     },
                        //     error: (err) => {
                        //         MessageToast.show(err);
                        //         this.byId("wiptable").removeSelections();
                        //     }
                        // });
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
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
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
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
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
        onRefresh : function () {
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
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/TimeSheetEntryCollection".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
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
