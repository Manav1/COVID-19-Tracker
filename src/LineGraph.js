import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

let graphColor, borderColor;

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const buildChartData2 = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.timeline.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data.timeline[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data.timeline[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType , country}) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let url;
      let date1 = new Date("01/01/2020");
      let date2 = Date.now();
      let days = (date2 - date1) / ((1000 * 3600 * 24));
      if(country === "worldwide"){
        url = "https://disease.sh/v3/covid-19/historical/all?lastdays=" + days;
      } else {
        url = "https://disease.sh/v3/covid-19/historical/" + country + "?lastdays=" + days;
      }
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData;
          if(country === "worldwide") {
            chartData = buildChartData(data, casesType);
          } else {
            chartData = buildChartData2(data, casesType);
          }
          
          setData(chartData);
        
        });
    };

    fetchData();
  }, [casesType, country]);

  if(casesType === "recovered") {
    graphColor = "rgba(125, 215, 29, 0.5)" ;
    borderColor = "#7dd71d" ;
  } else if(casesType === "cases") {
    graphColor = "rgba(204, 16, 52, 0.5)";
    borderColor = "#CC1034" ;
  } else {
    graphColor = "rgba(204, 16, 52, 0.7)";
    borderColor = "#CC1034";
  }

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: graphColor,
                borderColor: borderColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
