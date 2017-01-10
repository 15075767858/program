Ext.define('program.model.WeekModel', {
    extend: 'Ext.data.Model',
    alias: "WeekModel",
    fields: [
        {name: "divId", type: "string"},
        {name: "Week", type: "string"},
        {name: "StartTime", type: "string"},
        {name: "EndTime", type: "string"},
        {
            name: "level", type: "number", calculate: function (data) {
            var week = data.Week;
            var weeks = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            return weeks.indexOf(week);
        }
        }
    ]
});
