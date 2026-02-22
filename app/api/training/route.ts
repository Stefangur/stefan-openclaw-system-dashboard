import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

// Enhanced training data API route
export async function GET(request: NextRequest) {
  try {
    const workspacePath = '/Users/butler/.openclaw/workspace'
    const fitnessDataPath = path.join(workspacePath, 'fitness-tracking.json')
    
    // Read fitness tracking data
    const rawData = readFileSync(fitnessDataPath, 'utf8')
    const fitnessTracking = JSON.parse(rawData)
    
    // Extract all training sessions
    const allSessions: any[] = []
    fitnessTracking.daily_logs?.forEach((log: any) => {
      if (log.cardio_sessions) {
        log.cardio_sessions.forEach((session: any) => {
          allSessions.push({
            ...session,
            date: log.date
          })
        })
      }
    })
    
    // Equipment tracking
    const equipmentStats = {
      pellendorf: {
        concept2: {
          name: 'Concept 2 Rudergerät',
          sessions: allSessions.filter(s => s.equipment?.includes('Concept')).length,
          totalMinutes: allSessions.filter(s => s.equipment?.includes('Concept'))
            .reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
          status: 'active' as const
        },
        hammerVaron: {
          name: 'Hammer Varon xtr',
          sessions: allSessions.filter(s => s.equipment?.includes('Hammer')).length,
          totalMinutes: allSessions.filter(s => s.equipment?.includes('Hammer'))
            .reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
          status: 'active' as const
        },
        finnloBioForce: {
          name: 'Finnlo Bio Force',
          sessions: allSessions.filter(s => s.equipment?.includes('Finnlo')).length,
          totalMinutes: allSessions.filter(s => s.equipment?.includes('Finnlo'))
            .reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
          status: 'active' as const
        }
      },
      maishofen: {
        wi3: {
          name: 'Wi3 Ergometer',
          sessions: allSessions.filter(s => s.equipment?.includes('Wi3')).length,
          totalMinutes: allSessions.filter(s => s.equipment?.includes('Wi3'))
            .reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
          status: 'active' as const
        }
      }
    }
    
    // Training analytics
    const analytics = {
      totalSessions: allSessions.length,
      totalMinutes: allSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
      totalCalories: allSessions.reduce((sum, s) => sum + (s.calories_estimated || 0), 0),
      avgSessionDuration: allSessions.length > 0 ? 
        Math.round(allSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / allSessions.length) : 0,
      avgCaloriesPerSession: allSessions.length > 0 ?
        Math.round(allSessions.reduce((sum, s) => sum + (s.calories_estimated || 0), 0) / allSessions.length) : 0,
      weeklyProgress: {
        current: getWeeklyMinutes(allSessions),
        target: 150, // 90min hometrainer + 60min rowing
        percentage: Math.round((getWeeklyMinutes(allSessions) / 150) * 100)
      }
    }
    
    // Training targets
    const targets = {
      cardioSessionsWeekly: 4,
      hometrainerMinutesWeekly: 90,
      rowingMinutesWeekly: 60,
      totalCardioMinutesWeekly: 150
    }
    
    // Weekly training schedule (Stefan's plan)
    const weeklySchedule = {
      monday: {
        equipment: 'Concept 2 Ruder-Intervalle',
        duration: 20,
        type: 'Cardio (Pellendorf)'
      },
      tuesday: {
        equipment: 'Wi3 Ergometer Cardio-Variationen',
        duration: 25,
        type: 'Cardio (Maishofen)'
      },
      wednesday: {
        equipment: 'Finnlo Bio Force Krafttraining',
        duration: 25,
        type: 'Kraft (Pellendorf)'
      },
      thursday: {
        equipment: 'Wi3 Ergometer Cardio-Variationen',
        duration: 25,
        type: 'Cardio (Maishofen)'
      },
      friday: {
        equipment: 'Concept 2 Ruder-Intervalle',
        duration: 20,
        type: 'Cardio (Pellendorf)'
      },
      saturday: {
        equipment: 'Hammer Varon Long Cardio',
        duration: 30,
        type: 'Cardio (Pellendorf)'
      },
      sunday: {
        type: 'Ruhetag/Spaziergang'
      }
    }
    
    const trainingData = {
      sessions: allSessions.slice(-20).reverse(), // Last 20 sessions, most recent first
      equipment: equipmentStats,
      analytics,
      targets,
      weeklySchedule,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(trainingData)
    
  } catch (error) {
    console.error('Error loading training data:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      sessions: [],
      equipment: {
        pellendorf: {
          concept2: { name: 'Concept 2 Rudergerät', sessions: 0, totalMinutes: 0, status: 'ready' },
          hammerVaron: { name: 'Hammer Varon xtr', sessions: 0, totalMinutes: 0, status: 'ready' },
          finnloBioForce: { name: 'Finnlo Bio Force', sessions: 0, totalMinutes: 0, status: 'ready' }
        },
        maishofen: {
          wi3: { name: 'Wi3 Ergometer', sessions: 0, totalMinutes: 0, status: 'ready' }
        }
      },
      analytics: {
        totalSessions: 0,
        totalMinutes: 0,
        totalCalories: 0,
        avgSessionDuration: 0,
        avgCaloriesPerSession: 0,
        weeklyProgress: { current: 0, target: 150, percentage: 0 }
      },
      targets: {
        cardioSessionsWeekly: 4,
        hometrainerMinutesWeekly: 90,
        rowingMinutesWeekly: 60,
        totalCardioMinutesWeekly: 150
      },
      weeklySchedule: {
        monday: { equipment: 'Concept 2 Ruder-Intervalle', duration: 20, type: 'Cardio (Pellendorf)' },
        tuesday: { equipment: 'Wi3 Ergometer Cardio-Variationen', duration: 25, type: 'Cardio (Maishofen)' },
        wednesday: { equipment: 'Finnlo Bio Force Krafttraining', duration: 25, type: 'Kraft (Pellendorf)' },
        thursday: { equipment: 'Wi3 Ergometer Cardio-Variationen', duration: 25, type: 'Cardio (Maishofen)' },
        friday: { equipment: 'Concept 2 Ruder-Intervalle', duration: 20, type: 'Cardio (Pellendorf)' },
        saturday: { equipment: 'Hammer Varon Long Cardio', duration: 30, type: 'Cardio (Pellendorf)' },
        sunday: { type: 'Ruhetag/Spaziergang' }
      },
      timestamp: new Date().toISOString(),
      error: 'Failed to load training data'
    })
  }
}

function getWeeklyMinutes(sessions: any[]): number {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  return sessions
    .filter(session => new Date(session.date) >= weekAgo)
    .reduce((sum, session) => sum + (session.duration_minutes || 0), 0)
}