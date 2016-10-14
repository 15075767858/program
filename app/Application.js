/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('program.Application', {
    extend: 'Ext.app.Application',
    
    name: 'program',
    //autoCreateViewport:true,
    appFolder:'app',


    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    },

    onAppUpdate: function () {
        window.location.reload();

        /*Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                }
            }
        );*/
    }
});
