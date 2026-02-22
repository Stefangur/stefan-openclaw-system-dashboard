import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

// Enhanced health analytics API route
export async function GET(request: NextRequest) {
  try {
    const workspacePath = '/Users/butler/.openclaw/workspace'
    const fitnessDataPath = path.join(workspacePath, 'fitness-tracking.json')
    
    // Read fitness tracking data
    const rawData = readFileSync(fitnessDataPath, 'utf8')
    const fitnessTracking = JSON.parse(rawData)
    
    const dailyLogs = fitnessTracking.daily_logs || []
    
    // User vitals
    const vitals = {
      age: 66,
      height: 190,
      targetBMI: 24.0,
      targetBMIWeight: Math.round(24.0 * Math.pow(1.90, 2))
    }
    
    // Current metrics
    const latestLog = dailyLogs[dailyLogs.length - 1]
    const currentWeight = latestLog?.weight_kg || 108
    const currentBMI = currentWeight / Math.pow(vitals.height / 100, 2)
    const targetWeight = (80 + 88) / 2 // 84kg middle of range
    
    // Calculate health overview
    const overview = {
      currentBMI: Math.round(currentBMI * 10) / 10,
      bmiCategory: getBMICategory(currentBMI),
      weightToLose: Math.max(0, Math.round((currentWeight - targetWeight) * 10) / 10),
      weeksToGoal: Math.ceil(Math.max(0, currentWeight - targetWeight) / 0.5),
      overallHealthScore: calculateHealthScore(dailyLogs, currentBMI)
    }
    
    // Progress calculations
    const startWeight = 108
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentLogs = dailyLogs.filter((log: any) => new Date(log.date) >= weekAgo)
    
    const progress = {
      weight: {
        current: currentWeight,
        start: startWeight,
        target: targetWeight,
        lost: Math.max(0, startWeight - currentWeight),
        percentage: Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)
      },
      hydration: {
        avgDaily: recentLogs.length > 0 ? 
          Math.round((recentLogs.reduce((sum: number, log: any) => sum + (log.water_glasses || 0), 0) / recentLogs.length) * 10) / 10 : 0,
        trend: recentLogs.map((log: any) => ({
          date: log.date,
          glasses: log.water_glasses || 0,
          percentage: Math.round(((log.water_glasses || 0) / 8) * 100),
          target: 8
        }))
      },
      activity: {
        avgDailySteps: recentLogs.length > 0 ?
          Math.round(recentLogs.reduce((sum: number, log: any) => sum + (log.steps || 0), 0) / recentLogs.length) : 0,
        stepsTrend: recentLogs.map((log: any) => ({
          date: log.date,
          steps: log.steps || 0,
          percentage: Math.round(((log.steps || 0) / 8000) * 100),
          target: 8000
        }))
      }
    }
    
    // Health insights based on data analysis
    const insights = generateHealthInsights(dailyLogs, currentBMI, progress)
    
    const healthData = {
      overview,
      progress,
      insights,
      vitals,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(healthData)
    
  } catch (error) {
    console.error('Error loading health data:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      overview: {
        currentBMI: 30.0,
        bmiCategory: 'Adipositas',
        weightToLose: 24,
        weeksToGoal: 48,
        overallHealthScore: 45
      },
      progress: {
        weight: {
          current: 108,
          start: 108,
          target: 84,
          lost: 0,
          percentage: 0
        },
        hydration: {
          avgDaily: 0,
          trend: []
        },
        activity: {
          avgDailySteps: 0,
          stepsTrend: []
        }
      },
      insights: {
        strengths: [],
        improvements: ['Beginne mit regelmäßiger Gewichtskontrolle', 'Steigere tägliche Wasserzufuhr', 'Erhöhe körperliche Aktivität'],
        recommendations: ['Setze realistische wöchentliche Ziele', 'Tracke täglich Gewicht und Aktivität', 'Etabliere gesunde Routinen']
      },
      vitals: {
        age: 66,
        height: 190,
        targetBMI: 24.0,
        targetBMIWeight: 87
      },
      timestamp: new Date().toISOString(),
      error: 'Failed to load health data'
    })
  }
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Untergewicht'
  if (bmi < 25) return 'Normalgewicht'
  if (bmi < 30) return 'Übergewicht'
  return 'Adipositas'
}

function calculateHealthScore(dailyLogs: any[], currentBMI: number): number {
  let score = 50 // Base score
  
  // BMI component (0-40 points)
  if (currentBMI < 25) score += 40
  else if (currentBMI < 30) score += 20
  else if (currentBMI < 35) score += 10
  
  // Recent activity component (0-30 points)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recentLogs = dailyLogs.filter(log => new Date(log.date) >= weekAgo)
  
  if (recentLogs.length > 0) {
    const avgSteps = recentLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / recentLogs.length
    if (avgSteps >= 8000) score += 30
    else if (avgSteps >= 5000) score += 20
    else if (avgSteps >= 2000) score += 10
    
    // Hydration component (0-20 points)
    const avgWater = recentLogs.reduce((sum, log) => sum + (log.water_glasses || 0), 0) / recentLogs.length
    if (avgWater >= 8) score += 20
    else if (avgWater >= 6) score += 15
    else if (avgWater >= 4) score += 10
  }
  
  return Math.min(100, Math.max(0, Math.round(score)))
}

function generateHealthInsights(dailyLogs: any[], currentBMI: number, progress: any): any {
  const strengths: string[] = []
  const improvements: string[] = []
  const recommendations: string[] = []
  
  // Analyze BMI
  if (currentBMI < 30) {
    strengths.push('BMI unter Adipositas-Grenze - guter Ausgangspunkt für weiteren Fortschritt')
  }
  if (progress.weight.lost > 0) {
    strengths.push(`Bereits ${progress.weight.lost}kg Gewichtsverlust erreicht - du bist auf dem richtigen Weg!`)
  }
  
  // Analyze hydration
  if (progress.hydration.avgDaily >= 6) {
    strengths.push('Gute Hydration - du trinkst regelmäßig Wasser')
  } else {
    improvements.push('Wasserzufuhr auf mindestens 8 Gläser täglich steigern')
    recommendations.push('Stelle eine Wasserflasche als visuellen Reminder auf den Schreibtisch')
  }
  
  // Analyze activity
  if (progress.activity.avgDailySteps >= 5000) {
    strengths.push('Gute Grundaktivität - regelmäßige Bewegung etabliert')
  } else {
    improvements.push('Tägliche Schrittzahl auf mindestens 8.000 erhöhen')
    recommendations.push('Plane bewusst 2-3 kurze Spaziergänge in den Tag ein')
  }
  
  // General recommendations
  if (currentBMI > 25) {
    recommendations.push('Fokussiere auf nachhaltigen Gewichtsverlust von 0,5kg pro Woche')
    recommendations.push('Kombiniere Krafttraining mit Cardio für optimale Ergebnisse')
  }
  
  if (dailyLogs.length < 7) {
    improvements.push('Regelmäßiges Tracking für bessere Fortschrittskontrolle')
    recommendations.push('Etabliere eine tägliche 2-Minuten Tracking-Routine am Abend')
  }
  
  return { strengths, improvements, recommendations }
}