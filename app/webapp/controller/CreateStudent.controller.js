sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageBox",
      "sap/ui/model/json/JSONModel",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel) {
      "use strict";
  
      return Controller.extend("app.controller.CreateStudent", {
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("EditStudent")
            .attachPatternMatched(this._onRouteMatched, this);
          oRouter
            .getRoute("CreateStudent")
            .attachPatternMatched(this._onRouteMatched, this);
        },
  
        _onRouteMatched: function (oEvent) {
  
          var oRegistreer = {
            Firstname: "",
            Lastname: "",
            Dob: "",
          };
  
          var oModel = new JSONModel(oRegistreer);
          this.getView().setModel(oModel, "form");
  
          var oArgs = oEvent.getParameter("arguments");
          var oName = oEvent.getParameter("name");
  
          if (oName == "EditStudent") {
            this.getEventData(oArgs.StudentId);
          } else if (oName == "CreateStudent") {
            this._resetCreate();
          }
        },
  
        validateForm: function (formData) {
          for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
              return true;
            }
          }
          return false;
        },
  
        _resetCreate: function () {
  
          var button = this.byId("createEditButton");
          if (button != null) {
            button.setText("Create Student");
          }
  
          var title = this.byId("createStudent");
          if (title != null) {
            title.setTitle("Create Student");
          }
          
          if (title != null) {
            title.setTitle("Create Student");
          }
        },
  
        getEventData: function (studentId) {
  
          var button = this.byId("createEditButton");
          button.setText("Edit Student");
  
          var title = this.byId("createStudent");
          title.setTitle("Edit Student");
          var sTitleKey = "evenementEditButton"; // Replace with the actual key from your resource bundle
  
          var title = this.byId("createStudent");
          title.setTitle("Edit Student");
          var odatamodel = this.getView().getModel("v2model");
          var oForm = this.getView().getModel("form").getData();
  
          odatamodel.read("/StudentSet(" + studentId + ")", {
            success: function (oData) {
              // Set the retrieved data to the form model
              var oModel = new JSONModel(oData);
  
              this.getView().setModel(oModel, "form");
            }.bind(this),
            error: function (error) {
              // Handle error
              MessageBox.error("Failed to fetch event data.");
            },
          });
        },
  
        createEvent() {
          var oForm = this.getView().getModel("form").getData();
  
          // Controlestructuren
          if (!this.validateForm(oForm)) {
            MessageBox.error("Please fill in all fields");
            return;
          }

          console.log(oForm);

        //   oForm.Dob = this.deformatDate(oForm.Dob);
  
          var odatamodel = this.getView().getModel("v2model");
  
          odatamodel.create("/StudentSet", oForm, {
            success: function (data, response) {
              MessageBox.success("Student was created succesfully!", {
                onClose: function () {
                  window.location.href = "#/StudentsList/"; 
                },
              });
            },
            error: function (error) {
              MessageBox.error(
                "Creating the student dit not work!"
              );
            },
          });
        },
        onEditEvent: function () {
          var oForm = this.getView().getModel("form").getData();

          console.log(oForm);
  
          // Validate form data (similar to createEvent validation)
          if (!this.validateForm(oForm)) {
            MessageBox.error("Please fill in all fields");
            return;
          }
  
  
          // Assuming you have an event ID (e.g., from the route parameter)
          var studentId = oForm.StudentId; // Replace with actual event ID

          console.log(oForm.Dob);

        //   oForm.Dob = this.deformatDate(oForm.Dob);

          console.log(oForm.Dob);
  
          var odatamodel = this.getView().getModel("v2model");
  
          odatamodel.update("/StudentSet(" + studentId + ")", oForm, {
            success: function (data, response) {
              MessageBox.success(
                "Event updated successfully! Redirecting to event page."
              );
              setTimeout(function () {
                window.location.href = "#/StudentsList/" + studentId;
                window.location.reload();
              }, 1000);
            },
            error: function (error) {
              MessageBox.error(
                "The student was not edited try again..."
              );
            },
          });
        },
        handleEvent() {
          var oForm = this.getView().getModel("form").getData();
  
          if (oForm.StudentId) {
            this.onEditEvent();
          } else {
            this.createEvent();
          }
        },
        formatDate: function(dob) {
            if(dob == null) return;
            var day = dob.slice(0, 2);
            var month = dob.slice(2, 4);
            var year = dob.slice(4);
          
            return year + '-' + month + '-' + day;
          },
        deformatDate(dateString) {
            console.log(dateString);
            const parts = dateString.split("-");
            
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            
            return day + month + year;
        },
        annuleer() {
          history.back();
        },
      });
    }
  );
  