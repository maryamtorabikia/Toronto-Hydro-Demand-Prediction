let selectedDate = 'Wed, 01 Jan 2020 00:00:00 GMT';
let selectedMonth = 1;

function convertMonth(month) {

    switch(month) {
        case 1:
            return 'January';
            break;
        case 2:
            return 'February';
            break;
        case 3:
            return 'March';
            break;
        case 4:
            return 'April';
            break;
        case 5:
            return 'May';
            break;
        case 6:
            return 'June';
            break;
        case 7:
            return 'July';
            break;
        case 8:
            return 'August';
            break;
        case 9:
            return 'September';
            break;
        case 10:
            return 'October';
            break;
        case 11:
            return 'November';
            break;
        case 12:
            return 'December';
            break;

        default:
            break;
      };
};

function init() {
  //find the element in html file which is for date selection 
  var userSelection = d3.select("#selDataset");
  var monthSelection = d3.select("#monthSelect");

  var dateList =[];
  var actualList=[];
  var PredictedList=[];
  var diffList=[];
  var accuracyList=[];
  var monthList=[];

  d3.json("/api/v1.0/final").then((data) => {

    //add the dates from hydro dataset into drop-down box 
    data.forEach(function(d) {

        var dt = moment(new Date(d.date.substr(0, 16))).format("DD-MMM-YYYY");
        if(dateList.indexOf(dt) === -1) {
            
            dateList.push(dt);
            userSelection.append("option")
            .text(dt)
            .property("value", d.date); 

        }
        if(monthList.indexOf(d.month) === -1) {
            monthList.push(d.month);
            monthSelection.append("option")
            .text(convertMonth(d.month))
            .property("value", d.month);
        }

        actualList.push(d.actual_demand.toFixed(2));
        PredictedList.push(d.predicted_demand.toFixed(2));

        diffList.push(d.predicted_demand.toFixed(2) - d.actual_demand.toFixed(2));
        accuracyList.push(100 - (Math.abs( (((d.predicted_demand - d.actual_demand) *100)  / d.actual_demand ))).toFixed(2));
    
    });


    // console.log('accuracy: ', accuracyList);

    var labels = ['Predicted', 'Actual'];

    traceLine1 = {
        x: dateList, 
        y: actualList,
        name: "Actual Demand",
        type: "line",
        line: {color: "blue"},
    }

    traceLine2 = {
        x: dateList, 
        y: PredictedList,
        name: "Predicted Demand",
        type: "line",
        line: {color: "red"},
    }

    //data for the line chart
    var lineData = [traceLine1, traceLine2];
 
    // layout for line chart
    var layout_line = {

        title: {
            text: "Predicted vs. Actual Hydro Demand",
            font: {     
                family: 'Times New Roman, Times, serif',
                color: '#45358d',
                size: 24
        }},
        cliponaxis: 0,
        height: 500,
        width: 1100,
        xaxis: { title: "Date", tickangle: 45 },
        yaxis: { title: "Actual (KW/H)"}
    };

    Plotly.newPlot("line", lineData, layout_line);


    updateDailyChart('Wed, 01 Jan 2020 00:00:00 GMT');
    updateMonthlyChart(1)

  });
};

function updateDailyChart(selectedDate){

    d3.json("/api/v1.0/final").then((data) => {
        
        // console.log(selectedDate);
        var filteredData = data.filter(info => info.date == selectedDate)
        // console.log(filteredData);

        var hourList=[];
        var actualList=[];
        var PredictedList=[];
        var diffList=[];
        var accuracyList=[];

        // console.log(hourList);
        filteredData.forEach(function(d) {

            hourList.push(d.hour);
            actualList.push(d.actual_demand.toFixed(2));
            PredictedList.push(d.predicted_demand.toFixed(2));

            diffList.push((d.predicted_demand - d.actual_demand).toFixed(2));
            accuracyList.push(100 - (Math.abs( (((d.predicted_demand - d.actual_demand) *100)  / d.actual_demand ))).toFixed(2));
        });

        var labels = ['Predicted', 'Actual'];

        traceLine1 = {
            x: hourList, 
            y: actualList,
            name: "Actual Demand",
            type: "line",
            line: {color: "green"},
        }

        traceLine2 = {
            x: hourList, 
            y: PredictedList,
            name: "Predicted Demand",
            type: "line",
            line: {color: "red"},
        }
    
        //data for the line chart
        var lineData = [traceLine1, traceLine2];
     
        // layout for line chart
        var layout_line = {
            // labels: labels,
            title: {
                text: `Predicted vs. Actual Hydro Demand On ${moment(new Date(selectedDate.substr(0, 16))).format("DD-MMM-YYYY")}`,
                font: {     
                    family: 'Times New Roman, Times, serif',
                    color: '#45358d',
                    size: 24
            }},
            
            // cliponaxis: 0,
            height: 500,
            width: 1100,
            xaxis: { title: "Hour of Day", tickmode: "linear"},
            yaxis: { title: "Actual (KW/H)"}
        };
    
        Plotly.newPlot("dailyline", lineData, layout_line);

        updateTable(selectedDate, hourList, actualList, PredictedList, diffList, accuracyList);
    });
};

function updateMonthlyChart(selectedMonth){


    d3.json("/api/v1.0/finalmean").then((data) => {

        // console.log(selectedDate);
        var filteredData = data.filter(info => info.month == selectedMonth)
        // console.log(filteredData);

        var dateList=[];
        var actualList=[];
        var PredictedList=[];
        var diffList=[];
        var accuracyList=[];
  
        // console.log(hourList);
        filteredData.forEach(function(d) {
            var dt = moment(new Date(d.date.substr(0, 16))).format("DD-MMM-YYYY");
            if(dateList.indexOf(dt) === -1) {
                dateList.push(dt);

                actualList.push(d.actual_demand.toFixed(2));
                PredictedList.push(d.predicted_demand.toFixed(2));
    
                diffList.push((d.predicted_demand - d.actual_demand).toFixed(2));
                accuracyList.push(100 - (Math.abs( (((d.predicted_demand - d.actual_demand) *100)  / d.actual_demand ))).toFixed(2));
            }

        });

        var labels = ['Predicted', 'Actual'];

        traceLine1 = {
            x: dateList, 
            y: actualList,
            name: "Actual Demand",
            type: "line",
            line: {color: "green"},
            }
    
        traceLine2 = {
            x: dateList, 
            y: PredictedList,
            name: "Predicted Demand",
            type: "line",
            line: {color: "red"},
        }
        
        //data for the line chart
        var lineData = [traceLine1, traceLine2];
        
        // console.log(moment(new Date(d.date.substr(0, 16))).format("MMMMM"));
        // console.log(`Predicted vs. Actual Hydro Demand On ${convertMonth(selectedMonth)}`);

        // layout for line chart
        var layout_line = {
            // labels: labels,
 
            title: {
                text: `Predicted vs. Actual Hydro Demand For ${moment(new Date(dateList[0])).format("MMMM")}`,
                font: {     
                    family: 'Times New Roman, Times, serif',
                    color: '#45358d',
                    size: 24
            }},
            // cliponaxis: 0,
            height: 500,
            width: 1100,
            xaxis: { title: "Day of Month", tickmode: "linear", tickangle: 45},
            yaxis: { title: "Actual (KW/H)"}
        };
    
        Plotly.newPlot("monthlyline", lineData, layout_line);

        updateMonthTable(selectedMonth, dateList, actualList, PredictedList, diffList, accuracyList);

        document.getElementById('selDataset').value =  filteredData[0].date;
        document.getElementById('selDataset').text = dateList[0];
        updateDailyChart(filteredData[0].date)

    });
};

function updateTable(selectedDate, hourList, actualList, PredictedList, diffList, accuracyList){

    var dt = moment(new Date(selectedDate.substr(0, 16))).format("MMMM DD YYYY");
    var heading = d3.select("#heading");
    heading.html("");
    var headerRow = heading.append("tr");
    var headerCell = headerRow.append("th");
    headerCell.text(`Actual vs. Predicted Summary For: ${dt}`);

    var predictTable = d3.select("#predictTable");
    predictTable.html("");

    var row = predictTable.append("tr");
    
    var cell = row.append("td")

    var row = predictTable.append("tr");
    var cell = row.append("th");
    cell.text("Hour");
    var cell = row.append("th");
    cell.text("Actual Demand");
    var cell = row.append("th");
    cell.text("Predicted Demand");
    var cell = row.append("th");
    cell.text("Difference");
    var cell = row.append("th");
    cell.text("Accuracy");

    for (var i=0; i< hourList.length; i++) {
        // console.log(actualList[i]);
        var row = predictTable.append("tr");
        var cell = row.append("td");
        cell.text(hourList[i]);
        var cell = row.append("td");
        cell.text(actualList[i]);
        var cell = row.append("td");
        cell.text(PredictedList[i]);
        var cell = row.append("td");
        cell.text(diffList[i]);
        var cell = row.append("td");
        cell.text(accuracyList[i]);
    }; 
}  

function updateMonthTable(selecteMonth, dateList, actualList, PredictedList, diffList, accuracyList){

    var dt = moment(new Date(dateList[0].substr(0, 16))).format("MMMM");
    var heading = d3.select("#monthTitleTable");
    heading.html("");
    var headerRow = heading.append("tr");
    var headerCell = headerRow.append("th");
    headerCell.text(`Actual vs. Predicted Summary For: ${dt}`);

    var monthPredictTable = d3.select("#MonthPredictTable");
    monthPredictTable.html("");

    var row = monthPredictTable.append("tr");
    var cell = row.append("td")

    var row = monthPredictTable.append("tr");
    var cell = row.append("th");
    cell.text("Date");
    var cell = row.append("th");
    cell.text("Actual Demand");
    var cell = row.append("th");
    cell.text("Predicted Demand");
    var cell = row.append("th");
    cell.text("Difference");
    var cell = row.append("th");
    cell.text("Accuracy");

    for (var i=0; i< dateList.length; i++) {

        var row = monthPredictTable.append("tr");
        var cell = row.append("td");
        cell.text(moment(new Date(dateList[i].substr(0, 16))).format("DD-MMM-YYYY"));
        var cell = row.append("td");
        cell.text(actualList[i]);
        var cell = row.append("td");
        cell.text(PredictedList[i]);
        var cell = row.append("td");
        cell.text(diffList[i]);
        var cell = row.append("td");
        cell.text(accuracyList[i]);
    }; 
}  
// when user selects an entry from drop-down, this function is called from the html
function optionChanged(optDate) {

    updateDailyChart(optDate);
    selectedDate = optDate;
}

function monthChanged(optMonth) {
    updateMonthlyChart(optMonth);
    selectedMonth = optMonth;
}

//initialize webpage
init();
