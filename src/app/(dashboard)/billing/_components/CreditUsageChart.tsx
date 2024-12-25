'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartColumnStackedIcon, Layers2 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { getCreditsUsageInTimePeriod } from '@/actions/analytics/getCreditsUsageInTimePeriod';

type ChartData = Awaited<ReturnType<typeof getCreditsUsageInTimePeriod>>;
const chartConfig: ChartConfig = {
	success: {
		label: 'Successful Phases Credits',
		color: 'hsl(var(--chart-2))'
	},
	failed: {
		label: 'Failed Phases Credits',
		color: 'hsl(var(--chart-1))'
	}
};

type CreditUsageChartProps = {
	data: ChartData;
	title: string;
	description: string;
};

const CreditUsageChart = ({ data, title, description }: CreditUsageChartProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<ChartColumnStackedIcon className="w-6 h-6 text-primary" /> {title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer className="max-h-52 w-full" config={chartConfig}>
					<BarChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={'date'}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
							}}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip content={<ChartTooltipContent className="w-64" />} />
						<Bar
							dataKey={'success'}
							stroke={chartConfig.success.color}
							fill={chartConfig.success.color}
							fillOpacity={0.8}
							radius={[0, 0, 4, 4]}
							stackId={'1'}
						/>
						<Bar
							dataKey={'failed'}
							stroke={chartConfig.failed.color}
							fill={chartConfig.failed.color}
							fillOpacity={0.8}
							radius={[4, 4, 0, 0]}
							stackId={'1'}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default CreditUsageChart;
