import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { drawChart } from '../dataviz/d3utils';

const DATA_URL =
  'https://www.ncdc.noaa.gov/cag/global/time-series/globe/land_ocean/1/10/1880-2020/data.json';

const Chart = () => {
  const [data, setData] = useState('');
  const [selection, setSelection] = useState({ fromYear: '', toYear: '' });

  const parseData = ({ data }) => {
    const arrs = [...Object.entries(data)];
    return arrs.map((el) => {
      return { date: d3.timeParse('%Y')(el[0]), value: el[1], year: el[0] };
    });
  };

  const toggleSelected = (e) => setSelection({ ...selection, [e.target.id]: e.target.value });

  useEffect(() => {
    d3.json(DATA_URL).then((res) => setData(parseData(res)));
  }, []);

  useEffect(() => {
    const findYear = (toOrFrom) => data.indexOf(data.find((el) => el.year === selection[toOrFrom]));
    const start = selection.fromYear ? findYear('fromYear') : 0;
    const end = selection.toYear ? findYear('toYear') : data.length - 1;
    const redrawChart = () => {
      if (data && start < end) {
        drawChart(data.slice(start, end));
      }
    };
    redrawChart();
    window.addEventListener('resize', redrawChart);
  });

  const Loading = () => {
    return <div className="loading">Loading...</div>;
  };

  return (
    <>
      <div className="inputs">
        <form>
          <div className="from-select">
            <label>
              From:
              <select
                id="fromYear"
                name="fromYear"
                value={selection.fromYear}
                onChange={toggleSelected}
              >
                <option value=" "> </option>
                {data
                  ? data.map((el) => {
                      return (
                        <option key={el.year} value={el.year}>
                          {el.year}
                        </option>
                      );
                    })
                  : ''}
              </select>
            </label>
          </div>
          <div className="to-select">
            <label>
              To:
              <select id="toYear" name="toYear" value={selection.toYear} onChange={toggleSelected}>
                <option value=" "> </option>
                {data
                  ? data.map((el) => {
                      return (
                        <option
                          key={el.year}
                          value={el.year}
                          disabled={el.year < selection.fromYear}
                        >
                          {el.year}
                        </option>
                      );
                    })
                  : ''}
              </select>
            </label>
          </div>
          <input
            className="input"
            type="reset"
            value="Reset Dates"
            onClick={() => drawChart(data)}
          />
        </form>
      </div>
      {data ? drawChart(data) : <Loading />}
      <div id="chart"></div>
    </>
  );
};

export default Chart;
