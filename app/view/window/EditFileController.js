Ext.define('program.view.window.EditFileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-editfile',
    findClick: function () {
        var me = this.view;

        try {

            var resArr = Ext.decode(Ext.decode(me.textArea.value).gridpanelConfigs)
            for (var i = 0; i < resArr.length; i++) {
                console.log(resArr[i].datas)

            }

            console.log(resArr)

        } catch (e) {
            Ext.Msg.alert("Massage", "Data Error")
        }

    },
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
                anchor: '100%',
                margin: 10
            },
            items: [
                me.typeCombo,
                {
                    itemId: "oldvalue",
                    xtype: "textfield",
                    allowBlank: false,
                    fieldLabel: 'old value',
                },
                {
                    itemId: "newvalue",
                    xtype: "textfield",
                    allowBlank: false,
                    fieldLabel: 'new value'
                }
            ],
            buttons: [
                {
                    text: 'Ok', handler: function () {

                    var oldValue = win.getComponent("oldvalue").getValue();
                    var newValue = win.getComponent("newvalue").getValue();
                    if(me.replaceOkHandler){
                        me.replaceOkHandler(oldValue,newValue)
                        win.close();
                        return ;
                    }
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
