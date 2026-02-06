"use client";

import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { SUBJECT_STRENGTH_DATA } from "@/features/analytics/dummyData";
import { analyticsChartTheme } from "../Shared/chartTheme";

export const SubjectRadar = () => {
  return (
    <AnalyticsCard title="Subject Balance" subtitle="Average marks distribution">
      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveRadar
          data={SUBJECT_STRENGTH_DATA}
          keys={["score"]}
          indexBy="subject"
          theme={analyticsChartTheme}
          maxValue={100}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: "color" }}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={36}
          enableDots={true}
          dotSize={10}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          dotBorderColor={{ from: "color" }}
          enableDotLabel={true}
          dotLabel="value"
          dotLabelYOffset={-12}
          colors={["#FB7185"]} // Maths Color (coral)
          fillOpacity={0.25}
          blendMode="normal"
          animate={true}
        />
      </div>
    </AnalyticsCard>
  );
};