import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

interface DailyNutritionLog {
  date: string
  calories_estimated: number
  protein_estimated: number
  meal_quality: number
  meals_count: number
}

interface MealData {
  date: string
  protein_g?: number
  [key: string]: unknown
}

// Enhanced nutrition analytics API route
export async function GET(request: NextRequest) {
  try {
    const workspacePath = '/Users/butler/.openclaw/workspace'
    const fitnessDataPath = path.join(workspacePath, 'fitness-tracking.json')
    
    // Read fitness tracking data
    const rawData = readFileSync(fitnessDataPath, 'utf8')
    const fitnessTracking = JSON.parse(rawData)
    
    // Extract all meals
    const allMeals: MealData[] = []
    fitnessTracking.daily_logs?.forEach((log: any) => {
      if (log.meals) {
        log.meals.forEach((meal: any) => {
          allMeals.push({
            ...meal,
            date: log.date
          })
        })
      }
    })
    
    // Daily nutrition logs
    const dailyLogs: DailyNutritionLog[] = fitnessTracking.daily_logs?.map((log: any) => ({
      date: log.date,
      calories_estimated: log.calories_estimated || 0,
      protein_estimated: log.protein_estimated || 0,
      meal_quality: log.meal_quality || 0,
      meals_count: log.meals?.length || 0
    })) || []
    
    // Calculate analytics
    const validLogs = dailyLogs.filter((log: DailyNutritionLog) => log.calories_estimated > 0)
    
    const analytics = {
      avgDailyCalories: validLogs.length > 0 ? 
        Math.round(validLogs.reduce((sum: number, log: DailyNutritionLog) => sum + log.calories_estimated, 0) / validLogs.length) : 0,
      avgDailyProtein: validLogs.length > 0 ?
        Math.round(validLogs.reduce((sum: number, log: DailyNutritionLog) => sum + log.protein_estimated, 0) / validLogs.length) : 0,
      avgMealQuality: validLogs.length > 0 ?
        Math.round((validLogs.reduce((sum: number, log: DailyNutritionLog) => sum + log.meal_quality, 0) / validLogs.length) * 10) / 10 : 0,
      bestDay: validLogs.reduce((best: DailyNutritionLog | null, log: DailyNutritionLog) => 
        log.meal_quality > (best?.meal_quality || 0) ? log : best, null),
      proteinSources: allMeals
        .filter((meal: MealData) => meal.protein_g && meal.protein_g > 15)
        .sort((a: MealData, b: MealData) => (b.protein_g || 0) - (a.protein_g || 0))
        .slice(0, 10)
    }
    
    // Weekly trend (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const targets = {
      calories: 2000,
      protein: 90,
      mealQuality: 7,
      meals: 3
    }
    
    const weeklyTrend = dailyLogs
      .filter((log: DailyNutritionLog) => new Date(log.date) >= weekAgo)
      .slice(-7)
      .map((log: DailyNutritionLog) => ({
        date: log.date,
        calories: log.calories_estimated,
        protein: log.protein_estimated,
        quality: log.meal_quality,
        caloriesProgress: Math.round((log.calories_estimated / targets.calories) * 100),
        proteinProgress: Math.round((log.protein_estimated / targets.protein) * 100)
      }))
    
    // Ensure we have data for the last 7 days
    while (weeklyTrend.length < 7) {
      const missingDate = new Date()
      missingDate.setDate(missingDate.getDate() - (7 - weeklyTrend.length))
      weeklyTrend.unshift({
        date: missingDate.toISOString().split('T')[0],
        calories: 0,
        protein: 0,
        quality: 0,
        caloriesProgress: 0,
        proteinProgress: 0
      })
    }
    
    const nutritionData = {
      dailyLogs,
      recentMeals: allMeals.slice(-15).reverse(), // Last 15 meals, most recent first
      analytics,
      targets,
      weeklyTrend,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(nutritionData)
    
  } catch (error) {
    console.error('Error loading nutrition data:', error)
    
    // Return fallback data on error
    const today = new Date().toISOString().split('T')[0]
    const weeklyTrend = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        calories: 0,
        protein: 0,
        quality: 0,
        caloriesProgress: 0,
        proteinProgress: 0
      })
    }
    
    return NextResponse.json({
      dailyLogs: [],
      recentMeals: [],
      analytics: {
        avgDailyCalories: 0,
        avgDailyProtein: 0,
        avgMealQuality: 0,
        bestDay: null,
        proteinSources: []
      },
      targets: {
        calories: 2000,
        protein: 90,
        mealQuality: 7,
        meals: 3
      },
      weeklyTrend,
      timestamp: new Date().toISOString(),
      error: 'Failed to load nutrition data'
    })
  }
}