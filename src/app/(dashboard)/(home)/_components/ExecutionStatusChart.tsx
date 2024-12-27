'use client';
import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Layers2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>;
const chartConfig: ChartConfig = {
	success: {
		label: 'Success',
		color: 'hsl(var(--chart-2))'
	},
	failed: {
		label: 'Failed',
		color: 'hsl(var(--chart-1))'
	}
};

type ExecutionStatusChartProps = {
	data: ChartData;
};

const ExecutionStatusChart = ({ data }: ExecutionStatusChartProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<Layers2 className="w-6 h-6 text-primary" /> Workflow execution status
				</CardTitle>
				<CardDescription>Daily number of successful and failed workflow executions</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer className="max-h-52 w-full" config={chartConfig}>
					<AreaChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
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
						<Area
							min={0}
							type={'bump'}
							dataKey={'success'}
							stroke={chartConfig.success.color}
							fill={chartConfig.success.color}
							fillOpacity={0.6}
							stackId={'1'}
						/>
						<Area
							min={0}
							type={'bump'}
							dataKey={'failed'}
							stroke={chartConfig.failed.color}
							fill={chartConfig.failed.color}
							fillOpacity={0.6}
							stackId={'1'}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default ExecutionStatusChart;
