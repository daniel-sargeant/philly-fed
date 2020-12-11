import * as d3 from 'd3';

export const drawChart = (data) => {
  d3.select('#chart svg').remove();

  const responsiveWidth = parseInt(d3.select('#chart').style('width'), 10);

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('height', '500')
    .attr('width', responsiveWidth)
    .append('g')
    .attr('transform', 'translate(30,10)');

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([40, responsiveWidth - 100]);

  svg.append('g').attr('transform', `translate(0,400)`).call(d3.axisBottom(x));

  const y = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => +d.value), d3.max(data, (d) => +d.value)])
    .range([400, 0]);

  svg
    .append('g')
    .attr('transform', `translate(${responsiveWidth - 100},0)`)
    .call(d3.axisRight(y));

  const y2 = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => (9 / 5) * +d.value + 32),
      d3.max(data, (d) => (9 / 5) * +d.value + 32),
    ])
    .range([400, 0]);

  svg.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y2));

  const gridlinesX = d3.axisBottom().tickFormat('').tickSize(400).scale(x);

  svg.append('g').attr('class', 'grid').call(gridlinesX);

  const gridlinesY = d3
    .axisRight()
    .tickFormat('')
    .tickSize(responsiveWidth - 140)
    .scale(y2);

  svg.append('g').attr('class', 'grid').attr('transform', 'translate(40,0)').call(gridlinesY);

  svg
    .append('text')
    .attr('transform', `translate(${responsiveWidth / 2},450)`)
    .style('text-anchor', 'middle')
    .text('Year');

  svg
    .append('text')
    .attr('transform', `translate(${responsiveWidth - 60},170) rotate(90)`)
    .style('text-anchor', 'middle')
    .text('°C');

  svg
    .append('text')
    .attr('transform', 'translate(0,170) rotate(270)')
    .style('text-anchor', 'middle')
    .text('°F');

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value)),
    );

  d3.select('#chart').append('div').attr('id', 'tooltip');

  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.date))
    .attr('cy', (d) => y(d.value))
    .attr('r', 4)
    .attr('fill', 'black')
    .on('mouseover', (e, d) =>
      d3.select('#tooltip').style('opacity', 1).text(`${d.year}: ${d.value}°C`),
    )
    .on('mouseout', () => d3.select('#tooltip').style('opacity', 0))
    .on('mousemove', (e) =>
      d3
        .select('#tooltip')
        .style('left', `${e.pageX + 5}px`)
        .style('top', `${e.pageY - 25}px`),
    );

  const mean = d3.mean(data, (d) => d.value);

  svg
    .append('line')
    .attr('x1', 40)
    .attr('x2', responsiveWidth - 100)
    .attr('y1', y(mean))
    .attr('y2', y(mean))
    .attr('stroke', 'goldenrod')
    .attr('stroke-width', 2)
    .on('mouseover', (e) =>
      d3
        .select('#tooltip')
        .style('opacity', 1)
        .text(`Average: ${mean.toFixed(3)}°C`),
    )
    .on('mouseout', () => d3.select('#tooltip').style('opacity', 0))
    .on('mousemove', (e) =>
      d3
        .select('#tooltip')
        .style('left', `${e.pageX + 5}px`)
        .style('top', `${e.pageY - 45}px`),
    );
};
