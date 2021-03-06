Ext.define("program.view.window.RenameWindow", {
    extend: "Ext.window.Window",

    xtype: "renamewindow",
    requires: [
        "program.view.window.RenameWindowController",
        "program.view.window.RenameWindowModel",
        "program.store.RenameStore"
    ],
    width: 800,
    height: 1024,
    controller: "window-renamewindow",
    viewModel: {
        type: "window-renamewindow"
    },
    constrainHeader: true,
    autoShow: true,
    //maxHeight:Ext.getBody().getHeight(),
    layout: 'accordion',
    scrollable: true,
    listeners: {

        boxready: "boxready"
    },

    xmlSources: function () {

        var me = this;

        var sDevName = me.text.substring(0, me.text.indexOf('.'));
        me.title = sDevName;
        me.sDevName = sDevName;
        //       var items = []
        me.items = []

        Ext.Ajax.request({

            async: false,
            url: "resources/devxml/" + me.text,

            success: function (response, opts) {
                var xml = response.responseXML;
                if (!xml) {
                    Ext.Msg.alert("Error", "invalid data !");
                }


                var domKeys = xml.querySelectorAll("key");
                var keys = [];
                for (var i = 0; i < domKeys.length; i++) {
                    keys[i] = domKeys[i];
                }
                keys.sort(function (a, b) {
                    var akey = a.getAttribute("number")
                    var bkey = b.getAttribute("number")
                    return akey - bkey;
                })

                for (var i = 0; i < keys.length; i++) {

                    var Object_Name = keys[i].querySelector("Object_Name").innerHTML;
                    var keyType = keys[i].getAttribute("number").substr(4, 1);
                    if (keyType == '3' || keyType == '4') {
                        var devName = keys[i].getAttribute('number').substr(0, 4)
                        me.devName = devName;
                    }
                    //var fieldsItems = [];
                    var types = me["type" + keyType];
                    //console.log(types)
                    if (!types) {
                        continue;
                    }

                    var formData = {};
                    for (var j = 0; j < types.length; j++) {
                        var typeTag = keys[i].getElementsByTagName(types[j])[0];
                        var fieldName = types[j];
                        var value;
                        if (typeTag) {
                            value = typeTag.innerHTML;
                        } else {
                            value = ""
                        }
                        /*var textfield = {
                         fieldLabel: fieldName,
                         name: fieldName,
                         value: value
                         };*/

                        formData[fieldName] = value;

                        //fieldsItems.push(textfield);
                    }
                    console.log(formData)
                    /*
                     var formPanel = Ext.create("Ext.form.Panel", {
                     title: Object_Name,
                     key: keys[i].getAttribute("number"),
                     defaultType: 'textfield',
                     defaults: {
                     anchor: '100%'
                     },
                     minHeight: 300,
                     scrollable: true,
                     url: "resources/test1.php?par=setRenameValue&devname=" + sDevName,
                     bodyPadding: 10,
                     items: fieldsItems
                     })*/

                    var formPanel = me.createDevForm({Object_Name: Object_Name, key: keys[i].getAttribute('number')});

                    me.items.push(formPanel)
                    formPanel.getForm().setValues(formData)
                }


            },
            failure: function (response, opts) {
                Ext.Msg.alert("Error", 'server-side failure with status code ' + response.status);
            }
        });


//        me.items = items;

    },
    createDevForm: function (data) {

        var me = this;
        var keyType = data.key.substr(4, 1);
        var fields = me["type" + keyType];
        var fieldsItems = [];
        if (!fields) {
            console.log("fields=" + fields)
            return;
        }
        for (var i = 0; i < fields.length; i++) {
            console.log(fields[i])
            var fieldName = fields[i];
            var textfield = null;


            if (fieldName == "Inactive_Text") {
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,
                    xtype: "combobox",
                    editable: false,
                    store: me.I_T_D
                }
            } else if (fieldName == "Active_Text") {
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,
                    xtype: "combobox",
                    editable: false,
                    store: me.A_T_D
                }
            } else if (fieldName == "Device_Type") {
                var combostore = Ext.create('Ext.data.Store', {
                    autoLoad: false,
                    fields: ['name'],
                    data: [
                        {"name": "0-10=0-100"},
                        {"name": "NTC10K"},
                        {"name": "NTC20K"},
                        {"name": "BI"},
                        {"name": "hide"}
                    ]
                })

                textfield = {
                    fieldLabel: fieldName,
                    xtype: "combobox",
                    name: fieldName,

                    store: combostore,
                    validator: function (val) {
                        if (val == "NTC10K" || val == "NTC20K" || val == "BI" || val == "hide") {
                            return true
                        }
                        var arr = val.split("=");
                        if (arr.length != 2) {
                            return false;
                        }
                        for (var i = 0; i < arr.length; i++) {
                            var arr_ = arr[i].split("-");
                            if (arr_.length < 2 || arr_.length > 3) {
                                return false;
                            }
                            isNaN(arr_[0])
                            isNaN(arr_[1])
                        }
                        return true;
                    },
                    displayField: 'name',
                    valueField: 'name'
                }

            }
            else if (fieldName == 'Alarm_Value') {
                console.log("Alarm_Value")
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,
                    listeners: {
                        focus: function (field, newValue) {

                            Ext.create('program.view.window.AlarmWindow', {
                                id: "alermwindow",
                                sDevNodeName: panel.key,
                                sDevName: panel.key.substr(0, 4),
                                sDevNodeType: panel.key.substr(4, 1),
                                alarmData: field.getValue(),
                                localData: true,
                                submitAlarm: function (value) {
                                    field.setValue(value)
                                }
                            })
                        }
                    }
                };
            } else if (fieldName == "Object_Name") {
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,
                    value: data["Object_Name"],
                    listeners: {
                        change: function (field, newValue) {
                            if (field.name == "Object_Name") {
                                var form = field.up("form")
                                if (form) {
                                    form.setTitle(newValue)
                                }
                            }
                            if (!form) {
                                return;
                            }
                        }
                    }
                };
            } else if (fieldName == "Units") {
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,
                    value: data["Units"],
                    listeners: {
                        focus: function (field) {
                            Ext.create("program.view.window.AttributeTableWin", {
                                callback: function (value) {
                                    field.setValue(value)
                                }
                            })
                        }
                    }
                }

            } else {
                textfield = {
                    fieldLabel: fieldName,
                    name: fieldName,

                };
            }
            fieldsItems.push(textfield);
        }
        console.log(data)

        var panel = Ext.create("Ext.form.Panel", {
            //title: data.Object_name,
            title: data['Object_Name'],

            key: data.key,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            minHeight: 300,
            url: "resources/test1.php?par=setRenameValue&devname=" + me.sDevName,
            scrollable: true,
            bodyPadding: 10,
            items: fieldsItems,
            tbar: [{
                text: "commit",
                hidden: true,
                handler: function () {
                    panel.saveToDataBase()
                }
            }],
            saveToDataBase: function () {
                var me = this;

                me.header.remove(me.p)

                var type = me.key.substr(4, 1);

                var deviceType = me.query("[name=Device_Type]")[0];
                if (!!deviceType) {
                    if (deviceType.value == "BI" & type == "0") {
                        console.log(deviceType.value)
                        return;
                    }
                    if (deviceType.value == "hide") {
                        console.log(deviceType.value)
                        return;
                    }
                }
                var p = Ext.create('Ext.ProgressBar', {
                    width: 200,
                    buttonAlign: "left",
                    value: 0
                });
                me.p = p;
                me.header.insert(1, p)
                var items = me.items.items;
                var formSize = items.length;

                for (var i = 0; i < items.length; i++) {

                    (function (me, field, delay) {
                        setTimeout(function () {
                            //console.log((delay + 1) / formSize)
                            p.setValue((delay + 1) / formSize)
                            changeDevValue(me.key, field.name, field.value)
                        }, delay * 10)
                    })(me, items[i], i)
                }

            }
        })

        return panel;
    },

    databaseSources: function () {
        var me = this;
        me.title = me.sDevName + " rename";
        var sDevName = me.sDevName;
        me.items = []

        myAjax("resources/test1.php?par=getKeys&devname=" + sDevName, function (response) {
            var datas = Ext.decode(response.responseText)
            console.log(datas)
            //var fields = me.fields;
            datas.sort(function (a, b) {
                var akey = a['key']
                var bkey = b['key']
                return akey - bkey;
            })

            var store = Ext.create("Ext.data.JsonStore", {
                fields: me.fields,
                storeId: "testStore",
                data: datas
            })
            store.setData(datas)
            for (var i = 0; i < datas.length; i++) {
                var gridpanel = me.createDevForm(datas[i]);
                console.log(gridpanel)
                if (gridpanel != undefined) {
                    me.items.push(gridpanel);
                    gridpanel.getForm().loadRecord(store.getAt(i));

                }

            }

        })
    },


    getChartStoreData: function () {
        var me = this;
        var items = me.items.items;
        return devsSplitType(items);
    },
    getFormValues: function () {
        var me = this;
        var items = me.items.items;
        var data = {
            AI: 0,
            AO: 0,
            AV: 0,
            BI: 0,
            BO: 0,
            BV: 0,
            SCHEDULE: 0,
            type0: [],
            type1: [],
            type2: [],
            type3: [],
            type4: [],
            type5: [],
            type6: [],
        }
        for (var i = 0; i < items.length; i++) {
            if (items[i].key) {
                var type = items[i].key.substr(4, 1);
                if (type == 0) {
                    data.AI++
                    data.type0.push(items[i])
                }
                if (type == 1) {
                    data.AO++
                    data.type1.push(items[i])
                }
                if (type == 2) {
                    data.AV++
                    data.type2.push(items[i])
                }
                if (type == 3) {
                    data.BI++
                    data.type3.push(items[i])
                }
                if (type == 4) {
                    data.BO++
                    data.type4.push(items[i])
                }
                if (type == 5) {
                    data.BV++
                    data.type5.push(items[i])
                }
                if (type == 6) {
                    data.SCHEDULE++
                    data.type6.push(items[i])
                }

            }

        }
        return data;
    },

    insrtDevForm: function (key, Object_Name) {
        var me = this;
        var types = {
            "type0": {
                "Offset": "0.100",
                "Description": "ANALOG INPUT 1",
                "Device_Type": "BI",
                "Units": "98",
                "Min_Pres_Value": "0.00",
                "Max_Pres_Value": "100.000",
                "COV_Increment": "1.000",
                "High_Limit": "100.000",
                "Low_Limit": "0.000",
                "Deadband": "0.000",
                "Limit_Enable": "0",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Notification_Class": "1"
            },
            "type1": {
                "Offset": "1.000",
                "Description": "ANALOG OUTPUT1",
                "Device_Type": "0-10=0-100",
                "COV_Increment": "0.500",
                "High_Limit": "100",
                "Low_Limit": "0.000",
                "Deadband": "0.000",
                "Limit_Enable": "0",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Notification_Class": "1"
            },
            "type2": {
                "Description": "ANALOG VALUE 1",
                "COV_Increment": "0.500",
                "High_Limit": "100",
                "Low_Limit": "0.000",
                "Deadband": "0.000",
                "Limit_Enable": "0",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Notification_Class": "1"
            },
            "type3": {
                "Description": "BINARY_INPUT 1",
                "Device_Type": "normal open",
                "Inactive_Text": "Off",
                "Active_Text": "On",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Alarm_Value": "0",
                "Notification_Class": "1"
            },
            "type4": {
                "Description": "BINARY_OUTPUT 1",
                "Device_Type": "normal",
                "Inactive_Text": "Off",
                "Active_Text": "On",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Alarm_Value": "0",
                "Notification_Class": "1"
            },
            "type5": {
                "Description": "BINARY_VALUE1",
                "Device_Type": "normal",
                "Inactive_Text": "Off",
                "Active_Text": "On",
                "Event_Enable": "0",
                "Notify_Type": "0",
                "Time_Delay": "0",
                "Alarm_Value": "0",
                "Notification_Class": "1"
            },
            "type6": {
                "Description": "SCHEDULE1",
                "Priority_For_Writing": "10"
            }
        }

        var items = me.items.items;

        console.log(key)
        var inertIndex = 0;

        for (var i = 0; i < items.length; i++) {

            if (key < items[i].key) {
                inertIndex = i;

                console.log(items[i].key, "----", i)

                break;
            }
        }

        var form = me.createDevForm({key: key, Object_Name: Object_Name});
        var type = key.substr(4, 1);
        var values = types["type" + type];

        form.getForm().setValues(values)

        if (inertIndex) {
            me.insert(inertIndex, form);
        } else {
            me.add(form);
        }


    },
    deleteDevForm: function (key) {

        console.log(key)
        var me = this;
        var form = me.query('[key=' + key + ']')[0];
        me.remove(form);


    },

    initComponent: function () {
        var me = this;
        me.setHeight(680);
        me.setWidth(512);
        me.setMaxHeight(Ext.getBody().getHeight())

        var fields = ["Object_Name", "Offset", "Description", "Device_Type",
            "Inactive_Text", "Active_Text",
            "Units", "Min_Pres_Value", "Max_Pres_Value", "COV_Increment", "High_Limit",
            "Low_Limit", "Deadband", "Limit_Enable", "Event_Enable", "Present_Value",
            "Offset", "Set_Alarm", "AV_count", "BV_count", "SCHEDULE_count",
        ];

        me.type0 = ["Object_Name", "Offset", "Description", "Device_Type", "Units", "Min_Pres_Value", "Max_Pres_Value", "COV_Increment", "High_Limit", "Low_Limit", "Deadband", "Limit_Enable", "Event_Enable", "Notify_Type", "Time_Delay", "Notification_Class"];
        me.type1 = ["Object_Name", "Offset", "Description", "Device_Type", "COV_Increment", "High_Limit", "Low_Limit", "Deadband", "Limit_Enable", "Event_Enable", "Notify_Type", "Time_Delay", "Notification_Class"];
        me.type2 = ["Object_Name", "Description", "COV_Increment", "High_Limit", "Low_Limit", "Deadband", "Limit_Enable", "Event_Enable", "Notify_Type", "Time_Delay", "Notification_Class"];
        me.type3 = ["Object_Name", "Description", "Device" +
        "", "Inactive_Text", "Active_Text", "Event_Enable", "Notify_Type", "Time_Delay", "Alarm_Value", "Notification_Class"];
        me.type4 = ["Object_Name", "Description", "Device_Type", "Inactive_Text", "Active_Text", "Event_Enable", "Notify_Type", "Time_Delay", "Alarm_Value", "Notification_Class"];
        me.type5 = ["Object_Name", "Description", "Device_Type", "Inactive_Text", "Active_Text", "Event_Enable", "Notify_Type", "Time_Delay", "Alarm_Value", "Notification_Class"];
        me.type6 = ["Object_Name", "Description", "Priority_For_Writing", "Alarm"];
        me.type8 = ['Object_Name'];

        me.I_T_D = ActiveJson.get("Inactive_Text_Defaults")
        me.A_T_D = ActiveJson.get("Active_Text_Defaults")
        var fields = ["AI_count", "AO_count", "AV_count", "BI_count", "BO_count", "BV_count", "SCHEDULE_count"].concat(me.type0).concat(me.type1).concat(me.type2).concat(me.type3).concat(me.type4).concat(me.type5).concat(me.type6);
        me.fields = fields;
        if (me.text) {
            me.xmlSources()
            me.xmlsources = true
        } else if (me.sDevName) {
            me.databaseSources();
        }
        me.callParent()
    },
    iterationItems: function (callback) {
        var me = this;
        var items = me.items.items;
        for (var i = 1; i < items.length; i++) {
            callback(items[i], i)
        }
        return me;
    },
    getXmlStr: function () {
        var me = this;
        var items = me.items.items;
        var root = document.createElement("root");
        var ai = document.createElement("AI_count");
        var ao = document.createElement("AO_count");
        var av = document.createElement("AV_count");
        var bi = document.createElement("BI_count");
        var bo = document.createElement("BO_count");
        var bv = document.createElement("BV_count");
        var schedule = document.createElement("SCHEDULE_count");
        var aicount = 0;
        var aocount = 0;
        var avcount = 0;
        var bicount = 0;
        var bocount = 0;
        var bvcount = 0;
        var schedulecount = 0;

        root.appendChild(ai);
        root.appendChild(ao);
        root.appendChild(av);
        root.appendChild(bi);
        root.appendChild(bo);
        root.appendChild(bv);
        root.appendChild(schedule);

        for (var i = 1; i < items.length; i++) {
            //console.log(items[i]);
            var form = items[i].getForm();
            var res = form.getFieldValues();
            var key = document.createElement("key");
            var keytype = items[i].key.substr(4, 1);
            if (keytype == "0") {
                aicount++
            }
            if (keytype == "1") {
                aocount++
            }
            if (keytype == "2") {
                avcount++
            }
            if (keytype == "3") {
                bicount++
            }
            if (keytype == "4") {
                bocount++
            }
            if (keytype == "5") {
                bvcount++
            }
            if (keytype == "6") {
                schedulecount++
            }
            if (me.deviceName) {
                var newKey = me.deviceName + (items[i].key.substr(4, 7))
                key.setAttribute("number", newKey);

            } else {
                key.setAttribute("number", items[i].key);
            }
            for (var type in res) {
                var tag = document.createElement(type)
                tag.innerHTML = res[type];
                key.appendChild(tag);
            }
            root.appendChild(key);
            myAjax("resources/test1.php?par=getAlarm&nodename=" + items[i].key, function (response) {
                try {

                    var alermJson = Ext.decode(response.responseText);
                    if (alermJson['Set_Alarm']) {
                        //var setAlarm = document.createElement("Set_Alarm");
                        var aPars = alermJson['Set_Alarm'][0]
                        for (var type in aPars) {
                            var tag = document.createElement(type);
                            tag.innerHTML = aPars[type];
                            //setAlarm.appendChild(tag);
                            key.appendChild(tag);
                        }
                    }

                } catch (e) {
                    console.log(e)
                }
            })
        }

        ai.innerHTML = aicount;
        ao.innerHTML = aocount;
        av.innerHTML = avcount;
        bi.innerHTML = bicount;
        bo.innerHTML = bocount;
        bv.innerHTML = bvcount;
        schedule.innerHTML = schedulecount;
        //var root = me.saveXml();
        var div = document.createElement("div");
        div.appendChild(root)
        var xmlstr = div.innerHTML
        for (var i = 0; i < me.fields.length; i++) {
            var field = me.fields[i]
            console.log(me.fields[i])
            xmlstr = xmlstr.replaceAll(field.toLocaleLowerCase(), me.fields[i]);
        }
        return xmlstr;
    },
    saveXml: function (filename) {
        var me = this;
        var xmlstr = me.getXmlStr()
        xmlstr = formatXml(xmlstr);
        console.log(xmlstr)
        var filename = "devxml/" + filename + ".xml"
        var datas = {
            rw: "w",
            fileName: filename,
            content: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n' + xmlstr
        }

        $.ajax({
            type: "POST",
            url: "resources/xmlRW.php",
            data: datas,
            success: function () {
                delayToast("Status", "Saved file " + datas.fileName + " successfully.", 0);
                moveXml(filename);
            }
        });
        function moveXml(filename) {
            myAjax(null, function (response) {
                try {
                    var resJson = Ext.decode(response.responseText);
                    if (resJson.success) {
                        delayToast("Massage", resJson.info)
                    } else {
                        Ext.Msg.alert("Massage", resJson.info)
                    }
                } catch (e) {
                    Ext.Msg.alert("error", e)
                    throw new Error(e);
                }
            }, {
                par: "moveXml",
                filename: filename
            })
        }

        setTimeout(function () {
            me.close()
        }, 1000)
    },
    build: function () {
        var me = this;
        var items = me.items.items;
        for (var i = 1; i < items.length; i++) {
            (function (me, form, delay) {
                setTimeout(function () {
                    form.expand();
                    form.saveToDataBase()
                }, delay * 1000)
            })(me, items[i], i)
        }
    },
    relaodRenameWindow: function () {
        var me = this;

        setTimeout(function () {
            if (me.sources == "db") {
                Ext.create('program.view.window.RenameWindow', {
                    sources: "db",
                    sDevName: me.sDevName,
                })
                return;
            }
            if (me.sources == "xml") {
                Ext.create('program.view.window.RenameWindow', {
                    sources: "xml",
                    text: me.text,
                })
                return;
            }

        }, 3000)

    },
    buttons: [
        {
            text: "Save ...",
            handler: function () {
                var me = this.up("window");
                Ext.MessageBox.prompt("Save ...", "please input device number", function (ms, v) {
                    if (ms == 'ok') {
                        if (isNaN(v) || v.length != 4) {
                            Ext.Msg.alert("Key Exception", "The key ,Does not meet the requirements")
                            return
                        }
                        if (v) {
                            me.deviceName = v;
                            me.saveXml(v)
                        } else {
                            Ext.Msg.alert("Exception", "filename exception .")
                        }
                    }
                })

            }
        },
        {
            text: "replace ...",
            handler: function () {
                var me = this.up("window");
                var arr = me.type0.concat(me.type1).concat(me.type2).concat(me.type3).concat(me.type4).concat(me.type5).concat(me.type6).unique1()


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
                            itemId: "field",
                            margin: 10,
                            xtype: "combobox",
                            allowBlank: false,
                            fieldLabel: 'Fields',
                            store: arr,
                            editable: false,
                            queryMode: 'local',
                            autoSelect: false
                        },
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
                            var text = win.down("combobox").getValue();
                            if (text == null) {
                                Ext.Msg.alert('Info', 'Plase select file name.');
                                return;
                            }
                            var field = win.getComponent("field").getValue();
                            var oldValue = win.getComponent("oldvalue").getValue();
                            var newValue = win.getComponent("newvalue").getValue();
                            me.replaceFieldValue(field, oldValue, newValue)


                            win.close();
                        }
                        },
                        {
                            text: 'Close', handler: function () {
                            win.close();
                        }
                        }
                    ]
                })

            }
        },
        {
            text: "build", handler: function () {
            {
                var me = this.up("window");
                Ext.MessageBox.show({
                    title: 'Build Database?',
                    msg: 'Do you want to build the data into the database?',
                    buttons: Ext.MessageBox.OKCANCEL,
                    scope: me,
                    fn: function (ms) {
                        if (ms == 'ok') {
                            me.build()
                        }
                    },
                    animateTarget: this,
                    icon: Ext.MessageBox.QUESTION
                });

            }
        }
        },
        "->",
        {
            text: "Ok", handler: function () {
            var me = this.up("window");
            console.log(me.sDevName)
            console.log(me.deviceName)
            Ext.MessageBox.prompt("Save", "please input device name", function (ms, v) {
                if (ms == 'ok') {
                    if (isNaN(v) || v.length != 4) {
                        Ext.Msg.alert("Key Exception", "The key ,Does not meet the requirements")
                        return;
                    }
                    if (v) {

                        me.deviceName = v;
                        me.saveXml(me.sDevName)
                        //me.relaodRenameWindow()
                    } else {
                        Ext.Msg.alert("Exception", "filename exception .")
                    }
                }
            }, this, "", me.deviceName || me.sDevName)

            return;
        }
        },
        {

            text: "Close", handler: function (button) {
            var me = button.up('window');
            me.close();
        }
        }
    ],
    replaceFieldValue: function (fieldName, oldValue, newValue) {
        var me = this;
        var items = me.query('[name=' + fieldName + ']');
        for (var i = 0; i < items.length; i++) {
            items[i].setValue(items[i].getValue().replace(oldValue, newValue));
        }

        Ext.Msg.alert("Massage", items.length + " project have been changed");
    }
});

function devsSplitType(datas) {

    console.log(datas)
    var AI = {
        name: 'AI',
        value: 0,
        devs: "",
        keys: []
    }
    var AO = {
        name: 'AO',
        value: 0,
        devs: "",
        keys: []
    }
    var AV = {
        name: 'AV',
        value: 0,
        devs: "",
        keys: []
    }
    var BI = {
        name: 'BI',
        value: 0,
        devs: "",
        keys: []
    }
    var BO = {
        name: 'BO',
        value: 0,
        devs: "",
        keys: []
    }
    var BV = {
        name: 'BV',
        value: 0,
        devs: "",
        keys: []
    }
    var SCHEDULE = {
        name: "SCHEDULE",
        value: 0,
        devs: "",
        keys: []
    }


    datas.find(function (data, index, all) {
        // console.log(data)
        if (data.key) {
            if (data.key.substr(4, 1) == 0) {
                AI.value++;
                AI.devs += data.title + ""
                AI.keys.push(data)
            }
        }
    })

    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 1) {
                AO.value++;
                AO.devs += data.title + ""
                AO.keys.push(data)
            }
        }
    })
    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 2) {
                AV.value++;
                AV.devs += data.title + ""
                AV.keys.push(data)
            }
        }

    })
    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 3) {
                BI.value++;
                BI.devs += data.title + ""
                BI.keys.push(data)
            }
        }
    })
    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 4) {
                BO.value++;
                BO.devs += data.title + ""
                BO.keys.push(data)
            }
        }

    })
    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 5) {
                BV.value++;
                BV.devs += data.title + ""
                BV.keys.push(data)
            }
        }
    })

    datas.find(function (data, index, all) {
        if (data.key) {
            if (data.key.substr(4, 1) == 6) {
                SCHEDULE.value++;
                SCHEDULE.devs += data.title + "";
                SCHEDULE.keys.push(data)
            }
        }
    })

    var arr = []
    arr.push(AI)
    arr.push(AO)
    arr.push(AV)
    arr.push(BI)
    arr.push(BO)
    arr.push(BV)
    arr.push(SCHEDULE)
    console.log(arr)
    return arr;

}

/*var items = me.items.items;
 var root = document.createElement("root");
 for (var i = 0; i < items.length; i++) {
 console.log(items[i]);
 /!*items[i].submit({
 method: "POST"
 })*!/
 var form = items[i].getForm();
 var res = form.getFieldValues();
 var key = document.createElement("key");
 key.setAttribute("number", items[i].key);
 for (var type in res) {
 var tag = document.createElement(type)
 tag.innerHTML = res[type];
 key.appendChild(tag);
 }
 root.appendChild(key);
 myAjax("resources/test1.php?par=getAlarm&nodename=" + items[i].key, function (response) {
 try {
 var alermJson = Ext.decode(response.responseText);
 if (alermJson['Set_Alarm']) {
 var setAlarm = document.createElement("Set_Alarm");
 var aPars = alermJson['Set_Alarm'][0]
 for (var type in aPars) {
 var tag = document.createElement(type)
 tag.innerHTML = aPars[type];
 setAlarm.appendChild(tag);
 }
 key.appendChild(setAlarm);
 }
 } catch (e) {
 console.log(e)
 }
 })
 }*/