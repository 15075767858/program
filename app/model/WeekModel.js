Ext.define('program.model.WeekModel', {
    extend: 'Ext.data.Model',
    alias: "WeekModel",
    fields: [
        //{name: "divId", type: "string"},
        {name: "Week", type: "string"},
        {name: "time", type: "string"},
        {name: "value", type: "boolean"},
        {
            name: "level", type: "number", calculate: function (data) {
            var week = data.Week;
            var weeks = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            return weeks.indexOf(week);
        }
        }
        //{name: "StartTime", type: "string"},
        //{name: "EndTime", type: "string"},
    ]
});
