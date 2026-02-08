"use client";

import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SUBJECT_STRENGTH_DATA } from "@/features/analytics/dummyData";
import { analyticsChartTheme } from "../../Shared/chartTheme";

export const SubjectRadar = () => {
  return (
    <AnalyticsCard title="Subject Balance" subtitle="Average marks distribution">
      <div style={{ height: "260px", width: "100%" }}>
        <ResponsiveRadar
          data={SUBJECT_STRENGTH_DATA}
          keys={["score"]}
          indexBy="subject"
          theme={analyticsChartTheme}
          maxValue={100}
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor="#F59E0B"
          gridLevels={3}
          gridShape="circular"
          gridLabelOffset={12}
          enableDots={true}
          dotSize={6}
          dotColor="#1E1D1B"
          dotBorderWidth={2}
          dotBorderColor="#F59E0B"
          enableDotLabel={false}
          colors={["#F59E0B"]}
          fillOpacity={0.2}
          blendMode="normal"
          animate={true}
        />
      </div>
    </AnalyticsCard>
  );
};