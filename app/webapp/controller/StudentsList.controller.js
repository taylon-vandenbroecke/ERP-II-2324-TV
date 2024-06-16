sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
    ],
    function (Controller, Filter, FilterOperator) {
      "use strict";
  
      return Controller.extend("app.controller.StudentsList", {
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.attachRouteMatched(this.onRouteMatched, this);
        },
  
        onRouteMatched: function (oEvent) {
          var sRouteName = oEvent.getParameter("name");
          if (sRouteName === "Events") {
            this.refreshPage();
          }
        },
  
        refreshPage: function () {
          var oTable = this.byId("eventsTable");
          if (oTable) {
            this.filterFutureEvents(oTable.getBinding("items"));
            oTable.getBinding("items").refresh();
          }
        },
  
        filterFutureEvents: function (oTable) {
          var oTable = this.byId("eventsTable");
          if (oTable) {
            var oBinding = oTable.getBinding("items");
            var currentDate = new Date();
            
            // Haal einddatum rechtstreeks op uit de geselecteerde itemcontext
            var eventDate = new Date(oSelectedItem.getProperty("eindDatum"));
            var eventDateObj = new Date(eventDate);
            
            // Filter voor toekomstige evenementen
            if (currentDate <= eventDateObj) {
              var oFilters = new Filter(eventDateObj, FilterOperator.GT, currentDate);
              oBinding.filter([oFilters]);
            }
          }
          return oTable;
        },
        
  
        onSearchNaam: function (oEvent) {
          var sQuery = oEvent.getParameter("query");
          var oTable = this.byId("eventsTable");
          var oBinding = oTable.getBinding("items");
          var aFilters = [];
  
          if (sQuery) {
            var nQuery = parseInt(sQuery);
  
            if (!isNaN(nQuery)) {
              var oEvenementIDFilter = new sap.ui.model.Filter({
                path: "evenementID",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: nQuery,
              });
  
              aFilters.push(oEvenementIDFilter);
            }
  
            var oNaamFilter = new sap.ui.model.Filter({
              path: "naam",
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery,
            });
  
            aFilters.push(oNaamFilter);
          }
  
          var oCombinedFilter = new sap.ui.model.Filter({
            filters: aFilters,
            and: false,
          });
  
          oBinding.filter(oCombinedFilter);
        },
  
        onSearchLocation: function (oEvent) {
          var sQuery = oEvent.getParameter("query");
          var oTable = this.byId("eventsTable");
          var oBinding = oTable.getBinding("items");
          var aFilters = [];
  
          if (sQuery) {
            var oFilter = new Filter("locatie", FilterOperator.Contains, sQuery);
            aFilters.push(oFilter);
          }
  
          oBinding.filter(aFilters);
        },

        onSearchID: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("studentsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
    
            if (sQuery) {
              var oFilter = new Filter("StudentId", FilterOperator.Contains, sQuery);
              aFilters.push(oFilter);
            }
    
            oBinding.filter(aFilters);
          },
  
        onSearchBeginDate: function (oEvent) {
          var sQuery = oEvent.getParameter("value");
          var oTable = this.byId("eventsTable");
          var oBinding = oTable.getBinding("items");
          var aFilters = [];
  
          if (sQuery) {
            var oFilter = new sap.ui.model.Filter(
              "beginDatum",
              sap.ui.model.FilterOperator.EQ,
              sQuery
            );
            aFilters.push(oFilter);
          }
  
          oBinding.filter(aFilters);
        },
  
        onSearchEndDate: function (oEvent) {
          var sQuery = oEvent.getParameter("value");
          var oTable = this.byId("eventsTable");
          var oBinding = oTable.getBinding("items");
          var aFilters = [];
  
          if (sQuery) {
            var oFilter = new sap.ui.model.Filter(
              "beginDatum",
              sap.ui.model.FilterOperator.EQ,
              sQuery
            );
            aFilters.push(oFilter);
          }
  
          oBinding.filter(aFilters);
        },
  
        onSelectionChange: function (oEvent) {
          var oTable = oEvent.getSource();
          var oModel = oTable.getModel();
          var oLabel = this.byId("idFilterLabel");
          var oInfoToolbar = this.byId("idInfoToolbar");
          var aSelectedItems = oTable.getSelectedItems();
  
          // Update UI
          oInfoToolbar.setVisible(aSelectedItems.length > 0);
          oLabel.setText(aSelectedItems.length + " selected");
        },
  
        handleListItemPress: function (oEvent) {
          var oSelectedItem = oEvent.getSource().getBindingContext();
          //Retrieve the path of the selected item and strip the starting '/'
          //to avoid an invalid URL
  
          var sStudentId = oSelectedItem.getProperty("StudentId");
  
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("StudentDetail", {
            StudentId: sStudentId,
          });
        },
        myCustomFormatterFunction: function(beginDatum, beginUur) {
          try {
            var oDate = new Date(beginDatum);
            var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
              pattern: "yyyy-MM-dd",
              UTC: true
            }).format(oDate);
        
            if (beginUur) {
              var aTime = beginUur.split(':');
              var formattedTime = aTime[0] + ':' + aTime[1];
        
              var formattedDateTime = formattedDate + ' ' + formattedTime;
        
              return formattedDateTime;
            } else {
              return "Invalid time";
            }
          } catch (error) {
            console.error("Error formatting date and time:", error);
            return "Error formatting date and time";
          }
        },
        formatDate: function(dob) {
            var day = dob.slice(0, 2);
            var month = dob.slice(2, 4);
            var year = dob.slice(4);
          
            return year + '-' + month + '-' + day;
        },
        newStudent: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("CreateStudent");
        },
        onBack: function () {
          window.location.href = "http://localhost:4004/p2_bsp_g1/webapp/index.html";
        }
      });
    }
  );
  