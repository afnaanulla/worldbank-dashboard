import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { DataService } from "../../services/data.service"

import { BaseChartDirective } from "ng2-charts"
import { type ChartConfiguration, type ChartType, Chart, registerables } from "chart.js"

// ✅ Register Chart.js components
Chart.register(...registerables)

@Component({
  standalone: true,
  selector: "app-dashboard",
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  country = "IN"
  start = 2000
  end = 2023
  codes = ["NY.GDP.MKTP.CD", "SP.POP.TOTL"]

  lineType: ChartType = "line"
  barType: ChartType = "bar"

  // ✅ Initialize with proper structure
  lineData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [],
  }
  barData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [],
  }

  lineOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false, // ✅ Better for GDP data
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            // ✅ Format large numbers nicely
            const value = context.parsed.y
            if (value > 1000000000) {
              return context.dataset.label + ": $" + (value / 1000000000).toFixed(2) + "B"
            } else if (value > 1000000) {
              return context.dataset.label + ": $" + (value / 1000000).toFixed(2) + "M"
            }
            return context.dataset.label + ": " + value.toLocaleString()
          },
        },
      },
    },
  }

  barOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            return context.dataset.label + ": " + value.toLocaleString()
          },
        },
      },
    },
  }

  lineLabel = "GDP over time"
  barLabel = "Population over time"
  error = ""

  constructor(private data: DataService) {}

  ngOnInit() {
    this.load()
  }

  load() {
    this.error = ""
    console.log("Loading data with params:", {
      country: this.country,
      codes: this.codes,
      start: this.start,
      end: this.end,
    })

    this.data
      .indicators({
        country: this.country,
        codes: this.codes,
        start: this.start,
        end: this.end,
      })
      .subscribe({
        next: (res) => {
          console.log("Received data:", res)

          // ✅ More robust data processing
          if (!res.series || res.series.length === 0) {
            this.error = "No data series found"
            return
          }

          const labels = res.series[0]?.points?.map((p: any) => p.date.toString()) ?? []
          console.log("Labels:", labels)

          const datasets = res.series.map((s: any, index: number) => ({
            label: s.name,
            data: s.points?.map((p: any) => p.value) ?? [],
            fill: false,
            borderColor: this.getColor(index),
            backgroundColor: this.getColor(index, 0.2),
            tension: 0.1,
          }))

          console.log("Datasets:", datasets)

          // ✅ Ensure we have valid data before updating charts
          if (labels.length === 0 || datasets.length === 0) {
            this.error = "No valid data points found"
            return
          }

          // ✅ Update charts with new data
          this.lineData = {
            labels: [...labels],
            datasets: datasets.length > 0 ? [{ ...datasets[0] }] : [],
          }

          this.barData = {
            labels: [...labels],
            datasets: datasets.length > 1 ? [{ ...datasets[1] }] : datasets.length > 0 ? [{ ...datasets[0] }] : [],
          }

          this.lineLabel = res.series[0]?.name ?? "Series 1"
          this.barLabel = res.series[1]?.name ?? res.series[0]?.name ?? "Series 2"

          console.log("Updated lineData:", this.lineData)
          console.log("Updated barData:", this.barData)
        },
        error: (err) => {
          console.error("Error loading data:", err)
          this.error = err?.error?.detail ?? "Failed to load data"
        },
      })
  }

  // ✅ Helper method for consistent colors
  private getColor(index: number, alpha = 1): string {
    const colors = [
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
    ]
    return colors[index % colors.length]
  }

  logout() {
    fetch("/api/auth/logout/", { method: "POST", credentials: "include" }).then(() => (location.href = "/login"))
  }
}
