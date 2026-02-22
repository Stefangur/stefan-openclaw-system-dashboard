import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

// Enhanced progress data API route
export async function GET(request: NextRequest) {
  try {
    const workspacePath = '/Users/butler/.openclaw/workspace'
    const fitnessDataPath = path.join(workspacePath, 'fitness-tracking.json')
    
    // Read fitness tracking data
    const rawData = readFileSync(fitnessDataPath, 'utf8')
    const fitnessTracking = JSON.parse(rawData)
    
    // Calculate progress metrics
    const dailyLogs = fitnessTracking.daily_logs || []
    
    // Weight progress
    const weightHistory = dailyLogs
      .filter((log: any) => log.weight_kg > 0)
      .map((log: any) => ({
        date: log.date,
        weight_kg: log.weight_kg,
        note: log.weight_note
      }))
    
    const startWeight = 108
    const targetRange = [80, 88]
    const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight_kg : startWeight
    const targetWeight = (targetRange[0] + targetRange[1]) / 2 // 84kg middle of range
    
    // Steps and water history (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentLogs = dailyLogs.filter((log: any) => 
      new Date(log.date) >= thirtyDaysAgo)
    
    const stepsHistory = recentLogs.map((log: any) => ({
      date: log.date,
      steps: log.steps || 0,
      target: 8000,
      percentage: Math.round(((log.steps || 0) / 8000) * 100)
    }))
    
    const waterHistory = recentLogs.map((log: any) => ({
      date: log.date,
      glasses: log.water_glasses || 0,
      target: 8,
      percentage: Math.round(((log.water_glasses || 0) / 8) * 100)
    }))
    
    // Calculate overview metrics
    const weightLost = Math.max(0, startWeight - currentWeight)
    const targetLoss = startWeight - targetWeight
    const bmiStart = startWeight / Math.pow(1.90, 2)
    const bmiCurrent = currentWeight / Math.pow(1.90, 2)
    const bmiChange = Math.round((bmiStart - bmiCurrent) * 10) / 10
    
    // Monthly summary
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthlyLogs = dailyLogs.filter((log: any) => new Date(log.date) >= monthAgo)
    
    const monthlySummary = {
      avgDailySteps: monthlyLogs.length > 0 ? 
        Math.round(monthlyLogs.reduce((sum: number, log: any) => sum + (log.steps || 0), 0) / monthlyLogs.length) : 0,
      avgWaterIntake: monthlyLogs.length > 0 ?
        Math.round((monthlyLogs.reduce((sum: number, log: any) => sum + (log.water_glasses || 0), 0) / monthlyLogs.length) * 10) / 10 : 0,
      totalWorkouts: monthlyLogs.reduce((sum: number, log: any) => 
        sum + (log.cardio_sessions?.length || 0), 0)
    }
    
    const progressData = {
      overview: {
        weightLost: Math.round(weightLost * 10) / 10,
        targetLoss: Math.round(targetLoss * 10) / 10,
        currentBMI: Math.round(bmiCurrent * 10) / 10,
        bmiChange,
        weeksToGoal: Math.ceil((currentWeight - targetWeight) / 0.5),
        progressScore: Math.round((weightLost / targetLoss) * 100)
      },
      weightHistory,
      stepsHistory,
      waterHistory,
      monthlySummary,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(progressData)
    
  } catch (error) {
    console.error('Error loading progress data:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      overview: {
        weightLost: 0,
        targetLoss: 24,
        currentBMI: 30.0,
        bmiChange: 0,
        weeksToGoal: 48,
        progressScore: 0
      },
      weightHistory: [],
      stepsHistory: [],
      waterHistory: [],
      monthlySummary: {
        avgDailySteps: 0,
        avgWaterIntake: 0,
        totalWorkouts: 0
      },
      timestamp: new Date().toISOString(),
      error: 'Failed to load progress data'
    })
  }
}