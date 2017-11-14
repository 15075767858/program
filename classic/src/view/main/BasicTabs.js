/**
 * Created by Administrator on 2016/2/25.
 */


Ext.define('program.view.tab.BasicTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'basic-tabs',
    requires: [
        "program.view.tab.BasicController",
        "program.view.tree.DevTree"
    ],

    width: 400,
    height: 300,
    maxHeight: "100%",
    defaults: {
        //bodyPadding: 10,
        //autoScroll: true
    },
    style: "border-right:10px",
    controller: 'grid-panel-gridpanel',

    items: [{
            title: 'DB onlin',
            layout: "border",
            items: [
                /*Ext.create("program.view.tree.DevTree", {
                 region: "north",
                 height: 300,
                 minHeight: 200
                 }),*/
                {
                    xtype: "devtree",
                    region: "north",
                    height: 300,
                    minHeight: 200
                },
                Ext.create("Ext.grid.Panel", {
                    region: "center",
                    manageHeight: true,
                    title: "Icons",
                    autoScroll: true,
                    collapsible: true,
                    //resizable: true,
                    stateful: true,
                    store: Ext.create("program.store.SvgImgs", {}),
                    id: "leftPanelIcons",
                    columns: [{
                            draggable: false,
                            menuDisabled: true,
                            sortable: false,
                            header: 'type',
                            dataIndex: "src",
                            flex: 1,
                            renderer: function (value) {
                                return Ext.String.format('<img src="{0}" width="67px" height="33px"/>', value);
                            }
                        },
                        {
                            draggable: false,
                            menuDisabled: true,
                            sortable: false,
                            header: 'name',
                            dataIndex: 'name',
                            width: 1,
                            resizeable: false
                        },
                        {
                            draggable: false,
                            menuDisabled: true,
                            sortable: false,
                            header: 'name',
                            dataIndex: 'title',
                            flex: 1
                        },

                    ],
                    autoShow: true,

                    viewConfig: {
                        /*   plugins: {
                         ptype: 'gridviewdragdrop',
                         dragText: 'Drag and drop to reorganize',
                         ddGroup:    'DragDropGroup1',
                         enableDrop:true
                         }*/
                    },
                    listeners: {
                        expand: function () {
                            setTimeout(function () {
                                Ext.getCmp("leftDevTree").setHeight(400);
                                //console.log(Ext.getCmp("leftDevTree").getHeight());
                            }, 50)

                        },
                        collapse: function () {
                            setTimeout(function () {
                                Ext.getCmp("leftDevTree").setHeight("95%");
                                //console.log(Ext.getCmp("leftDevTree").getHeight());
                            }, 50)

                        },
                        render: "basicRender",
                        viewready: "basicViewready",
                        itemclick: "basicItemclick",
                        afterDragDrop: "basicAfterDragDrop"
                    }

                })
            ]
        },
        {
            title: 'device onlin',
            items: {
                id: "deviceOnlinTreePanel",
                tbar: [{
                    text: 'Discovery',
                    xtype: "button",
                    handler: function (th) {
                        var me = this.up("treepanel");
                        //me.expandAll();
                        me.getDevicesToTreeData();
                    }
                }, {
                    text: 'Config',
                    xtype: "button",
                    handler: function (th) {
                        var me = this.up("treepanel");
                        me.collapseAll();
                    }
                }, {
                    text: 'Clear',
                    xtype: "button",
                    handler: function (th) {
                        var me = this.up("treepanel");
                        //me.collapseAll();
                        me.store.root.removeAll()
                    }
                }],
                xtype: "treepanel",
                //rootVisible:false,
                getDevicesToTreeData: function () {
                    var treePanel = this;
                    bacnetInterface.bacnetutil.getDevicesToTreeData(function (err, devices) {
                        console.log(devices)
                        treePanel.store.root.appendChild(devices)
                    })
                },
                store: {
                    root: {
                        text: "B/IP",
                        expanded: true,
                    }
                },
                listeners: {
                    boxready: function (panel) {
                        panel.getDevicesToTreeData()
                        //deviceOnlinTreePanelReady(panel)
                        //Ext.GlobalEvents.fireEvent("deviceOnlinTreePanelReady")
                    },
                    itemcontextmenu: function (th, record, item, index, e, eOpts) {
                        e.stopEvent();
                        var __this = this;
                        if (record.data.depth == 1) {
                            Ext.create("Ext.menu.Menu", {
                                //floating: true,
                                //viewModel: treePanel.viewModel,
                                autoShow: true,
                                x: e.pageX + 5,
                                y: e.pageY + 5,
                                items: [{
                                        text: "Get Device All Property",
                                        handler: function () {

                                        }
                                    },
                                    {
                                        text: "Get Device Object List",
                                        handler: function () {

                                        }
                                    }, {
                                        text: "Get Device Object List Array",
                                        handler: function () {

                                        }
                                    }
                                ]
                            })
                        }
                        if (record.data.depth == 2) {
                            Ext.create("Ext.menu.Menu", {
                                //floating: true,
                                //viewModel: treePanel.viewModel,
                                autoShow: true,
                                x: e.pageX + 5,
                                y: e.pageY + 5,
                                items: [{
                                        text: "Get Device All Property",
                                        handler: function () {

                                        }
                                    },
                                    {
                                        text: "Get Object Necessary Property",
                                        handler: function () {

                                        }
                                    }, {
                                        text: "Get Object Optional Property",
                                        handler: function () {

                                        }
                                    }, "-", {
                                        text: "Get Object Present-Value",
                                        handler: function () {

                                        }
                                    }
                                ]
                            })
                        }
                    }
                }
            }
        },
        {
            title: "download",
            items: {
                rootVisible: true,
                xtype: "treepanel",
                listeners: {
                    boxready: function (treePanel) {
                        treePanel.store.root.set("text", location.host)
                    },
                    itemcontextmenu: function (treePanel, record, item, index, e, eOpts) {
                        e.stopEvent()
                        e.stopPropagation()
                        if (record.data.depth == 1) {
                            Ext.createWidget("showdevices", {
                                device: record.data.text
                            })
                        }
                    },
                    itemclick: function (treePanel, record, item, index, e, eOpts) {
                        console.log(arguments)
                        if (record.data.depth == 1) {
                            Ext.createWidget("showdevices", {
                                device: record.data.text
                            })
                        }

                    }
                },

                width: "100%",
                height: "100%",
                scrollable: "y",
                modal: true,
                store: Ext.create("Ext.data.TreeStore", {
                    autoLoad: true,
                    url: "resources/test1.php?par=nodestree",
                    proxy: {
                        type: "ajax",
                        url: "resources/test1.php?par=nodestree&ip=" + location.host + "&port=6379",
                        reader: {
                            type: "json"
                        }
                    }
                })
            }
        },
    ]
});