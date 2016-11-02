Ext.define('program.view.window.EditFileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-editfile',
    replaceClick: function () {
        var me = this.view;

        var win = Ext.create('Ext.window.Window', {
            title: 'Replace •••',
            frame: true,
            width: 325,
            bodyPadding: 10,
            autoShow: true,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    itemId: "oldvalue",
                    margin: 10,
                    xtype: "textfield",
                    allowBlank: false,
                    fieldLabel: 'old value',
                },
                {
                    itemId: "newvalue",
                    margin: 10,
                    xtype: "textfield",
                    allowBlank: false,
                    fieldLabel: 'new value',
                }
            ],
            buttons: [
                {
                    text: 'Ok', handler: function () {

                    var oldValue = win.getComponent("oldvalue").getValue();
                    var newValue = win.getComponent("newvalue").getValue();
                    me.textArea.setValue(me.textArea.value.replaceAll(oldValue, newValue));
                    win.close();

                }
                },
                {
                    text: 'Cancel', handler: function () {
                    win.close();
                }
                }
            ]
        })


    }
});
