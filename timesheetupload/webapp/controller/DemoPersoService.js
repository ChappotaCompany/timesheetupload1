sap.ui.define(['sap/ui/thirdparty/jquery'], function (jQuery) {
    "use strict";

    var DemoPersoService = {

        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
                {
                    id: "demoApp-timesheettable-caCol",
                    order: 1,
                    text: "Controlling Area",
                    visible: true
                },
                {
                    id: "demoApp-timesheettable-rccCol",
                    order: 2,
                    text: "Receiver Cost Center",
                    visible: false
                },
                {
                    id: "demoApp-timesheettable-atCol",
                    order: 3,
                    text: "Activity Type",
                    visible: true
                },

                {
                    id: "demoApp-timesheettable-wiCol",
                    order: 4,
                    text: "WorkItem",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-bccCol",
                    order: 5,
                    text: "Billing Control Category",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-wbsCol",
                    order: 6,
                    text: "WBS Element",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-tsnCol",
                    order: 7,
                    text: "Time Sheet Note",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-rhCol",
                    order: 8,
                    text: "Recorded Hours",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-humCol",
                    order: 9,
                    text: "Hours Unit Of Measure",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-twlCol",
                    order: 10,
                    text: "TimeSheet Wrk LocCode",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-pweCol",
                    order: 11,
                    text: "Person WorkAgreement ExternalID",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-ccCol",
                    order: 12,
                    text: "CompanyCode",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-trCol",
                    order: 13,
                    text: "TimeSheet Record",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tdCol",
                    order: 14,
                    text: "TimeSheet Date",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-tiroCol",
                    order: 15,
                    text: "TimeSheet Is Released OnSave",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tsCol",
                    order: 16,
                    text: "TimeSheet Status",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tieitCol",
                    order: 17,
                    text: "TimeSheet Is Executed In TestRun",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-toCol",
                    order: 18,
                    text: "TimeSheet Operation",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-yywCol",
                    order: 19,
                    text: "YY1_WorkLocationType_TIM",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-yyuCol",
                    order: 20,
                    text: "YY1_UniqueReferenceNum_TIM",
                    visible: false
                }

            ]
        },

        oResetData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
                {
                    id: "demoApp-timesheettable-caCol",
                    order: 1,
                    text: "Controlling Area",
                    visible: true
                },
                {
                    id: "demoApp-timesheettable-rccCol",
                    order: 2,
                    text: "Receiver Cost Center",
                    visible: false
                },
                {
                    id: "demoApp-timesheettable-atCol",
                    order: 3,
                    text: "Activity Type",
                    visible: true
                },

                {
                    id: "demoApp-timesheettable-wiCol",
                    order: 4,
                    text: "WorkItem",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-bccCol",
                    order: 5,
                    text: "Billing Control Category",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-wbsCol",
                    order: 6,
                    text: "WBS Element",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-tsnCol",
                    order: 7,
                    text: "Time Sheet Note",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-rhCol",
                    order: 8,
                    text: "Recorded Hours",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-humCol",
                    order: 9,
                    text: "Hours Unit Of Measure",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-twlCol",
                    order: 10,
                    text: "TimeSheet Wrk LocCode",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-pweCol",
                    order: 11,
                    text: "Person WorkAgreement ExternalID",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-ccCol",
                    order: 12,
                    text: "CompanyCode",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-trCol",
                    order: 13,
                    text: "TimeSheet Record",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tdCol",
                    order: 14,
                    text: "TimeSheet Date",
                    visible: true
                }, {
                    id: "demoApp-timesheettable-tiroCol",
                    order: 15,
                    text: "TimeSheet Is Released OnSave",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tsCol",
                    order: 16,
                    text: "TimeSheet Status",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-tieitCol",
                    order: 17,
                    text: "TimeSheet Is Executed In TestRun",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-toCol",
                    order: 18,
                    text: "TimeSheet Operation",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-yywCol",
                    order: 19,
                    text: "YY1_WorkLocationType_TIM",
                    visible: false
                }, {
                    id: "demoApp-timesheettable-yyuCol",
                    order: 20,
                    text: "YY1_UniqueReferenceNum_TIM",
                    visible: false
                }
            ]
        },


        getPersData: function () {
            var oDeferred = new jQuery.Deferred();
            if (!this._oBundle) {
                this._oBundle = this.oData;
            }
            oDeferred.resolve(this._oBundle);

            return oDeferred.promise();
        },

        setPersData: function (oBundle) {
            var oDeferred = new jQuery.Deferred();
            this._oBundle = oBundle;
            oDeferred.resolve();
            return oDeferred.promise();
        },

        getResetPersData: function () {
            var oDeferred = new jQuery.Deferred();

            setTimeout(function () {
                oDeferred.resolve(this.oResetData);
            }.bind(this), 2000);

            return oDeferred.promise();
        },

        resetPersData: function () {
            var oDeferred = new jQuery.Deferred();
            this._oBundle = this.oResetData;


            oDeferred.resolve();


            return oDeferred.promise();
        }


    };

    return DemoPersoService;

});
